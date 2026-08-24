import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ESLint } from 'eslint';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import config from '../eslint.config.js';

// Rules we knowingly still enable despite upstream deprecating them. Most come
// from the vendored copy of eslint-config-standard in src/, which predates the
// deprecations. This list is a canary, not a target: it should only ever shrink.
// When a dependency bump deprecates something new, this test fails and tells us
// to decide about it deliberately rather than finding out from a consumer.
const KNOWN_DEPRECATED = [
	'lines-between-class-members',
	'no-buffer-constructor',
	'no-new-object',
	'no-new-symbol',
	'no-return-await',
	'spaced-comment',
];

/** Maps every rule available to our config to its metadata. */
const ruleMeta = new Map(
	[...builtinRules].map(([name, rule]) => [name, rule.meta]),
);
for (const entry of config) {
	for (const [prefix, plugin] of Object.entries(entry.plugins ?? {})) {
		for (const [name, rule] of Object.entries(plugin.rules ?? {})) {
			ruleMeta.set(`${prefix}/${name}`, rule.meta);
		}
	}
}

const activeRules = async (filePath) => {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config,
	});
	const resolved = await eslint.calculateConfigForFile(filePath);

	return Object.entries(resolved.rules)
		.filter(([, entry]) => (Array.isArray(entry) ? entry[0] : entry) !== 0)
		.map(([name]) => name);
};

describe('deprecated rules', () => {
	for (const filePath of ['probe.js', 'probe.ts']) {
		it(`enables no newly deprecated rules for ${filePath}`, async () => {
			const rules = await activeRules(filePath);
			const deprecated = rules
				.filter((name) => ruleMeta.get(name)?.deprecated)
				.filter((name) => !KNOWN_DEPRECATED.includes(name))
				.toSorted();

			assert.deepEqual(deprecated, []);
		});
	}

	it('has no stale entries in the known-deprecated list', async () => {
		const js = await activeRules('probe.js');
		const ts = await activeRules('probe.ts');
		const deprecated = new Set(
			[...js, ...ts].filter((name) => ruleMeta.get(name)?.deprecated),
		);
		const stale = KNOWN_DEPRECATED.filter((name) => !deprecated.has(name));

		assert.deepEqual(
			stale,
			[],
			'These rules are no longer enabled or no longer deprecated. Remove them from KNOWN_DEPRECATED.',
		);
	});
});
