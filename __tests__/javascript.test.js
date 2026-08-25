import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { format, lintFixture, rulesFired } from './helpers.js';

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

	it('reports at error severity rather than warning', async () => {
		const messages = await lintFixture('__tests__/fixtures/invalid.js');
		const severities = [
			...new Set(messages.map((message) => message.severity)),
		];

		assert.deepEqual(severities, [2]);
	});
});
