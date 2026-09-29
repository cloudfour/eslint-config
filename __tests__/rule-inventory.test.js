import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { describe, it } from 'node:test';

import { ESLint } from 'eslint';

import config from '../eslint.config.js';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// Resolved options include the defaults ESLint injects from each core rule's
// `meta.defaultOptions`, and those change between ESLint releases — 10.10 added
// `checkConditionalExpressions` to `no-unmodified-loop-condition` and
// `errorClassNames` to `preserve-caught-error`, neither of which we or xo set.
// The `validate-oldest-eslint` CI job swaps ESLint out deliberately, so
// comparing options there reports ESLint's own churn as if it were ours.
//
// Which rules are enabled is stable across the ESLint range we support, so that
// half of the comparison runs everywhere and only the options half is gated.
const PINNED_ESLINT = ESLint.version === pkg.devDependencies.eslint;

// At least one probe per layer of the config that has its own `files` pattern,
// so the inventory covers everything a consumer can be linting. The last test
// in this file enforces that, so a layer xo adds later fails CI until it has a
// probe. These paths are never read from disk — `calculateConfigForFile` only
// matches them against globs.
//
// A probe with a `base` is a narrow layer stacked on a broader one, like `.tsx`
// on `.ts`. Its section records only how it differs from the base, since a full
// copy would repeat hundreds of rules to capture one, and every rule xo adds
// would then show up in each copy.
const PROBES = [
	{ path: 'probe.js' },
	{ path: 'probe.ts' },
	{ path: 'probe.html' },
	{ path: 'package.json' },
	{ path: 'probe.css' },
	{ path: 'probe.md' },
	{ path: 'probe.json' },
	{ path: 'probe.json5', base: 'probe.json' },
	{ path: 'probe.jsonc', base: 'probe.json' },
	{ path: 'probe.d.ts', base: 'probe.ts' },
	{ path: 'probe.test-d.ts', base: 'probe.ts' },
	{ path: 'probe.tsx', base: 'probe.ts' },
	{ path: 'xo.config.js', base: 'probe.js' },
];

const SNAPSHOT = new URL('rule-inventory.snapshot.txt', import.meta.url);

const HEADER_SEPARATOR = ' — ';
const RELATIVE_TO = 'relative to ';

/**
 * Collects every rule our config leaves on for a path, mapped to its serialised
 * options.
 *
 * Severity is deliberately excluded. `javascript.test.js` already asserts we
 * report at error severity, and leaving it out keeps the snapshot from churning
 * on the difference between `error` and `2`. Options are kept, because a bump
 * that retunes an existing rule breaks consumers just as happily as one that
 * adds a rule.
 *
 * @param {string} filePath Path to resolve the config for.
 * @returns {Promise<Map<string, string>>} Rule name to serialised options.
 */
const activeRules = async (filePath) => {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config,
	});
	const resolved = await eslint.calculateConfigForFile(filePath);

	const rules = new Map();
	const names = Object.keys(resolved.rules ?? {}).toSorted();

	for (const name of names) {
		const entry = resolved.rules[name];
		const severity = Array.isArray(entry) ? entry[0] : entry;
		if (severity === 'off' || severity === 0) {
			continue;
		}

		const options = Array.isArray(entry) ? entry.slice(1) : [];
		rules.set(name, options.length > 0 ? JSON.stringify(options) : '');
	}

	return rules;
};

/**
 * Describes how a narrow probe's rules differ from its base's, as a map in the
 * same shape `activeRules` returns. Each value starts with `+` (only the narrow
 * probe enables it), `-` (only the base does) or `~` (both do, with different
 * options), followed by the narrow probe's options where it has any.
 *
 * @param {Map<string, string>} rules The narrow probe's rules.
 * @param {Map<string, string>} base The base probe's rules.
 * @returns {Map<string, string>} Rule name to its marked difference.
 */
const relativeTo = (rules, base) => {
	const delta = new Map();
	const withOptions = (sign, options) =>
		options === '' ? sign : `${sign} ${options}`;

	for (const name of [
		...new Set([...rules.keys(), ...base.keys()]),
	].toSorted()) {
		if (!base.has(name)) {
			delta.set(name, withOptions('+', rules.get(name)));
		} else if (!rules.has(name)) {
			delta.set(name, '-');
		} else if (rules.get(name) !== base.get(name)) {
			delta.set(name, withOptions('~', rules.get(name)));
		}
	}

	return delta;
};

/**
 * Renders the inventory as the text we commit.
 *
 * @param {Map<string, Map<string, string>>} inventory Probe to its rules.
 * @returns {string} The snapshot contents.
 */
const render = (inventory) => {
	const sections = [];

	for (const { path: probe, base } of PROBES) {
		const rules = inventory.get(probe);
		const summary = base ? `${RELATIVE_TO}${base}` : `${rules.size} rules`;
		const lines = [`# ${probe}${HEADER_SEPARATOR}${summary}`];
		for (const [name, value] of rules) {
			if (base) {
				// `+ name options`, so the sign leads the line.
				const [sign, ...options] = value.split(' ');
				lines.push([sign, name, ...options].join(' '));
			} else {
				lines.push(value === '' ? name : `${name} ${value}`);
			}
		}

		sections.push(lines.join('\n'));
	}

	return `${sections.join('\n\n')}\n`;
};

/**
 * Parses a committed snapshot back into the shape `render` was given.
 *
 * @param {string} text Snapshot contents.
 * @returns {Map<string, Map<string, string>>} Probe to its rules.
 */
const parse = (text) => {
	const inventory = new Map();
	let current;
	let relative = false;

	for (const line of text.split('\n')) {
		if (line.startsWith('# ')) {
			const [probe, summary = ''] = line.slice(2).split(HEADER_SEPARATOR);
			current = new Map();
			relative = summary.startsWith(RELATIVE_TO);
			inventory.set(probe, current);
		} else if (line !== '' && current) {
			// A relative line leads with its sign; move it back to the value.
			const [sign, rest] = relative
				? [line[0], line.slice(2)]
				: [undefined, line];
			const split = rest.indexOf(' ');
			const name = split === -1 ? rest : rest.slice(0, split);
			const options = split === -1 ? '' : rest.slice(split + 1);
			current.set(
				name,
				sign === undefined
					? options
					: [sign, options].filter(Boolean).join(' '),
			);
		}
	}

	return inventory;
};

/**
 * Describes the change as a list of lines, so a failure says which rules moved
 * rather than dumping two 68KB strings at you.
 *
 * @param {Map<string, Map<string, string>>} expected Committed inventory.
 * @param {Map<string, Map<string, string>>} actual Inventory as resolved now.
 * @param {boolean} compareOptions Whether to report retuned rules too.
 * @returns {string[]} One line per rule that was added, removed or retuned, or
 *   whose difference from a relative probe's base changed.
 */
const diff = (expected, actual, compareOptions) => {
	const lines = [];
	const bases = new Map(
		PROBES.filter(({ base }) => base).map(({ path: probe, base }) => [
			probe,
			base,
		]),
	);

	for (const [probe, after] of actual) {
		const before = expected.get(probe) ?? new Map();
		const base = bases.get(probe);

		// A relative section's entries are differences, not rules, so "added" and
		// "removed" would misdescribe them: a rule turned off for this probe
		// arrives as a new `-` entry. Report what the difference was and is.
		if (base) {
			const shown = (value) =>
				value === undefined || compareOptions ? value : value.split(' ', 1)[0];
			for (const name of new Set([...before.keys(), ...after.keys()])) {
				const [was, now] = [shown(before.get(name)), shown(after.get(name))];
				if (was !== now) {
					lines.push(
						`${probe}: ${name} relative to ${base} was ${was ?? 'the same'}, now ${now ?? 'the same'}`,
					);
				}
			}

			continue;
		}

		for (const name of after.keys()) {
			if (!before.has(name)) {
				lines.push(`${probe}: + ${name}`);
			}
		}

		for (const name of before.keys()) {
			if (!after.has(name)) {
				lines.push(`${probe}: - ${name}`);
			}
		}

		if (!compareOptions) {
			continue;
		}

		for (const [name, options] of after) {
			if (before.has(name) && before.get(name) !== options) {
				lines.push(`${probe}: ~ ${name} (options changed)`);
			}
		}
	}

	return lines;
};

describe('rule inventory', () => {
	const scope = PINNED_ESLINT
		? 'which rules it enables, and how they are configured'
		: 'which rules it enables';

	it(`matches the committed snapshot: ${scope}`, async () => {
		const resolved = new Map(
			await Promise.all(
				PROBES.map(async ({ path: probe }) => [
					probe,
					await activeRules(probe),
				]),
			),
		);
		const inventory = new Map();
		for (const { path: probe, base } of PROBES) {
			const rules = resolved.get(probe);
			inventory.set(
				probe,
				base ? relativeTo(rules, resolved.get(base)) : rules,
			);
		}

		if (process.env.UPDATE_RULE_INVENTORY) {
			await writeFile(SNAPSHOT, render(inventory));
			return;
		}

		const expected = parse(await readFile(SNAPSHOT, 'utf8'));

		assert.deepEqual(
			diff(expected, inventory, PINNED_ESLINT),
			[],
			'The set of rules this config enables has changed. If that was the ' +
				'point of your change, regenerate with `UPDATE_RULE_INVENTORY=1 ' +
				'npm test` and review the diff — it is the list of behaviour ' +
				'changes consumers will see, and it belongs in CHANGELOG.md.',
		);
	});

	it('has a probe for every layer that sets its own `files`', () => {
		const probes = PROBES.map(({ path: probe }) => probe);
		const isProbed = (glob) =>
			probes.some((probe) => path.matchesGlob(probe, glob));
		const uncovered = config
			.filter((layer) => layer.files && !layer.files.flat().some(isProbed))
			.map(
				(layer) =>
					`${layer.name ?? '(unnamed)'}: ${layer.files.flat().join(', ')}`,
			);

		assert.deepEqual(
			uncovered,
			[],
			'These layers apply to files no probe matches, so the rule inventory ' +
				'cannot see what they change. Add a probe to PROBES for each one ' +
				'(with a `base` if it is a narrow layer stacked on a broader one), ' +
				'then regenerate the snapshot.',
		);
	});
});
