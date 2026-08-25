import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { format, lintFixture, rulesFired } from './helpers.js';

// These fixtures exercise the type-aware half of the config, so they depend on
// `tsconfig.json` at the repo root — that is what typescript-eslint's
// `projectService` resolves them against.
describe('TypeScript config', () => {
	it('allows everything our TypeScript overrides deliberately permit', async () => {
		const messages = await lintFixture('__tests__/fixtures/valid.ts');

		assert.deepEqual(
			rulesFired(messages),
			[],
			`Expected no rules to fire, got:\n${format(messages)}`,
		);
	});

	it('flags exactly the rules we turn on or reconfigure', async () => {
		const messages = await lintFixture('__tests__/fixtures/invalid.ts');

		assert.deepEqual(rulesFired(messages), [
			'@typescript-eslint/array-type',
			'@typescript-eslint/consistent-type-imports',
			'@typescript-eslint/no-non-null-assertion',
			'@typescript-eslint/no-unnecessary-condition',
			'@typescript-eslint/prefer-optional-chain',
			'import-x/no-duplicates',
			// Replaces `@typescript-eslint/no-unnecessary-boolean-literal-compare`,
			// which we turn off in favour of this one
			'unicorn/no-unnecessary-boolean-comparison',
		]);
	});

	it('keeps type-aware rules enabled, which need real type information', async () => {
		const messages = await lintFixture('__tests__/fixtures/invalid.ts');

		// `no-unnecessary-condition` can only fire when the project service
		// resolved types. If tsconfig.json or `projectService` ever breaks, the
		// rule silently stops reporting instead of erroring, so assert it here.
		assert.ok(
			messages.some(
				(message) =>
					message.ruleId === '@typescript-eslint/no-unnecessary-condition',
			),
			`Type information was not available. Rules that fired:\n${format(messages)}`,
		);
	});
});
