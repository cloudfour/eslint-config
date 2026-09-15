import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { describe, it } from 'node:test';

import { ESLint } from 'eslint';

import config from '../eslint.config.js';

// One probe per layer of the config that has its own `files` pattern, so the
// inventory covers everything a consumer can be linting. These paths are never
// read from disk — `calculateConfigForFile` only matches them against globs.
const PROBES = ['probe.js', 'probe.ts', 'probe.html', 'package.json'];

const SNAPSHOT = new URL('rule-inventory.snapshot.txt', import.meta.url);

const HEADER_SEPARATOR = ' — ';

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
 * Renders the inventory as the text we commit.
 *
 * @param {Map<string, Map<string, string>>} inventory Probe to its rules.
 * @returns {string} The snapshot contents.
 */
const render = (inventory) => {
	const sections = [];

	for (const [probe, rules] of inventory) {
		const lines = [`# ${probe}${HEADER_SEPARATOR}${rules.size} rules`];
		for (const [name, options] of rules) {
			lines.push(options === '' ? name : `${name} ${options}`);
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

	for (const line of text.split('\n')) {
		if (line.startsWith('# ')) {
			current = new Map();
			inventory.set(line.slice(2).split(HEADER_SEPARATOR, 1)[0], current);
		} else if (line !== '' && current) {
			const split = line.indexOf(' ');
			const name = split === -1 ? line : line.slice(0, split);
			current.set(name, split === -1 ? '' : line.slice(split + 1));
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
 * @returns {string[]} One line per rule that was added, removed or retuned.
 */
const diff = (expected, actual) => {
	const lines = [];

	for (const [probe, after] of actual) {
		const before = expected.get(probe) ?? new Map();

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

		for (const [name, options] of after) {
			if (before.has(name) && before.get(name) !== options) {
				lines.push(`${probe}: ~ ${name} (options changed)`);
			}
		}
	}

	return lines;
};

describe('rule inventory', () => {
	it('matches the committed snapshot', async () => {
		const resolved = await Promise.all(PROBES.map(activeRules));
		const inventory = new Map();
		for (const [index, probe] of PROBES.entries()) {
			inventory.set(probe, resolved[index]);
		}

		if (process.env.UPDATE_RULE_INVENTORY) {
			await writeFile(SNAPSHOT, render(inventory));
			return;
		}

		const expected = parse(await readFile(SNAPSHOT, 'utf8'));

		assert.deepEqual(
			diff(expected, inventory),
			[],
			'The set of rules this config enables has changed. If that was the ' +
				'point of your change, regenerate with `UPDATE_RULE_INVENTORY=1 ' +
				'npm test` and review the diff — it is the list of behaviour ' +
				'changes consumers will see, and it belongs in CHANGELOG.md.',
		);
	});
});
