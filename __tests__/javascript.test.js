import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { enabledRules, format, lintFixture, rulesFired } from './helpers.js';

describe('JavaScript config', () => {
	it('allows everything our overrides deliberately permit', async () => {
		const messages = await lintFixture('__tests__/fixtures/valid.js');

		assert.deepEqual(
			rulesFired(messages),
			[],
			`Expected no rules to fire, got:\n${format(messages)}`,
		);
	});

	it('flags exactly the rules we turn on or reconfigure', async () => {
		const messages = await lintFixture('__tests__/fixtures/invalid.js');

		assert.deepEqual(rulesFired(messages), [
			'capitalized-comments',
			'n/file-extension-in-import',
			'no-return-assign',
			'no-unused-expressions',
			'no-var',
			'object-shorthand',
			'prefer-template',
			// Replaces the custom `@cloudfour/prefer-early-return` rule we removed,
			// configured with the same `maximumStatements: 2` threshold
			'unicorn/prefer-early-return',
		]);
	});

	it('groups imports by builtin, external and relative', async () => {
		const messages = await lintFixture('__tests__/fixtures/import-order.js');

		// Ordering is the only rule we configure that depends on the plugin's
		// module resolver working, so assert on the message rather than just the
		// rule id: a broken resolver would still report, only about blank lines.
		assert.ok(
			messages.some(
				(message) =>
					message.ruleId === 'import-x/order' &&
					message.message.includes('should occur after import of'),
			),
			`Imports were not reordered by group:\n${format(messages)}`,
		);
	});

	it('enables no TypeScript rules on files that are not TypeScript', async () => {
		// Rules from typescript-eslint only ever match type annotations, so on these
		// files they cannot fire. Naming one anyway is not harmless: it makes the
		// `@typescript-eslint` plugin mandatory, and a project with no TypeScript
		// installed then fails to lint at all rather than skipping the rule. See
		// #707. `.vue` is on the list because xo scopes its TypeScript layer to the
		// `.ts` extensions, so single-file components resolve like plain JavaScript
		// and are the likeliest place for this to come back.
		const probes = [
			'probe.js',
			'probe.cjs',
			'probe.mjs',
			'probe.jsx',
			'probe.vue',
		];

		const found = await Promise.all(
			probes.map(async (probe) => {
				const rules = await enabledRules(probe);
				return [
					probe,
					rules.filter((rule) => rule.startsWith('@typescript-eslint/')),
				];
			}),
		);

		assert.deepEqual(
			Object.fromEntries(found),
			Object.fromEntries(probes.map((probe) => [probe, []])),
		);
	});

	it('reports at error severity rather than warning', async () => {
		const messages = await lintFixture('__tests__/fixtures/invalid.js');
		const severities = [
			...new Set(messages.map((message) => message.severity)),
		];

		assert.deepEqual(severities, [2]);
	});
});
