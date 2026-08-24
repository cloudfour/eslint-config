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
			'@cloudfour/prefer-early-return',
			'capitalized-comments',
			'n/file-extension-in-import',
			'no-return-assign',
			'no-unused-expressions',
			'no-var',
			'object-shorthand',
			'prefer-template',
		]);
	});

	it('reports at error severity rather than warning', async () => {
		const messages = await lintFixture('__tests__/fixtures/invalid.js');
		const severities = [
			...new Set(messages.map((message) => message.severity)),
		];

		assert.deepEqual(severities, [2]);
	});
});
