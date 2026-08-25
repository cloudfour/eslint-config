import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { describe, it } from 'node:test';

// eslint-config-prettier ships a CLI that resolves our config for a file and
// reports any enabled rule that conflicts with Prettier. Using it is better
// than maintaining our own list: the list of conflicting rules lives upstream
// and updates when we bump the dependency.
//
// This guards the `@stylistic/*` overrides at the bottom of eslint.config.js,
// which were added by hand in 25.0.1 after conflicts were found manually.
const checkPrettierConflicts = (filePath) => {
	try {
		execFileSync(
			process.execPath,
			['node_modules/eslint-config-prettier/bin/cli.js', filePath],
			{ encoding: 'utf8', stdio: 'pipe' },
		);
		return null;
	} catch (error) {
		return error.stdout || error.message;
	}
};

describe('Prettier compatibility', () => {
	// One case per config branch: the base config, and the TypeScript overrides.
	for (const filePath of [
		'__tests__/fixtures/valid.js',
		'__tests__/fixtures/valid.ts',
	]) {
		it(`enables no rules that conflict with Prettier for ${filePath}`, () => {
			assert.equal(checkPrettierConflicts(filePath), null);
		});
	}
});
