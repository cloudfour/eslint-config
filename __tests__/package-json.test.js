import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import configXO from 'eslint-config-xo';

import { format, lintFixture, rulesFired } from './helpers.js';

describe('package.json config', () => {
	it("scopes xo's package.json layer to the root manifest", () => {
		// We rewrite this layer's `files` by matching on its name. If xo ever
		// renames or removes the layer, the rewrite silently stops happening and
		// the rules go back to firing on every `**/package.json` — including the
		// marker files covered below. Fail loudly here instead.
		const layer = configXO({ prettier: 'compat' }).find(
			(candidate) => candidate.name === 'xo/package-json',
		);

		assert.ok(
			layer,
			'eslint-config-xo no longer exports a layer named "xo/package-json". Update the rewrite in eslint.config.js.',
		);
	});

	it('leaves dual-package marker files alone', async () => {
		// A `{"type": "commonjs"}` marker is not a package. Before scoping, it
		// collected demands for `name`, `version`, `license`, `keywords` and an
		// entry point, plus `prefer-type-module` telling it to become `"module"` —
		// which would break the CommonJS half of whatever shipped it.
		const messages = await lintFixture(
			'__tests__/fixtures/dual-package/cjs/package.json',
		);

		assert.deepEqual(
			rulesFired(messages).filter((rule) => rule?.startsWith('package-json/')),
			[],
			`Expected no package-json rules on a marker file, got:\n${format(messages)}`,
		);
	});

	it('does not require exports, type or engines of the root manifest', async () => {
		// Our own package.json is a real root manifest, so it exercises the scoped
		// layer rather than a fixture that only looks like one. It deliberately has
		// no `engines` beyond what we declare and is not `"type": "module"`-only,
		// so any of these firing means the override stopped applying.
		const disabled = new Set([
			'package-json/prefer-exports',
			'package-json/prefer-type-module',
			'package-json/require-engines',
		]);
		const messages = await lintFixture('package.json');

		assert.deepEqual(
			rulesFired(messages).filter((rule) => disabled.has(rule)),
			[],
			`Expected these rules to be off, got:\n${format(messages)}`,
		);
	});
});
