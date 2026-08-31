# @cloudfour/eslint-config

[![NPM version](https://img.shields.io/npm/v/@cloudfour/eslint-config.svg)](https://www.npmjs.com/package/@cloudfour/eslint-config) [![Build Status](https://github.com/cloudfour/eslint-config/workflows/CI/badge.svg)](https://github.com/cloudfour/eslint-config/actions?query=workflow%3ACI) [![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)

Cloud Four's ESLint configuration.

This config extends the following plugins:

It is built on [`eslint-config-xo`](https://github.com/xojs/eslint-config-xo), which
bundles and configures most of the plugins we rely on — including
[`unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn),
[`jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc),
[`n`](https://github.com/eslint-community/eslint-plugin-n),
[`@typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint),
[`regexp`](https://github.com/ota-meshi/eslint-plugin-regexp) and
[`import-x`](https://github.com/un-ts/eslint-plugin-import-x) — plus rules for
`package.json`, JSON, Markdown, CSS and HTML. On top of that we add our own
overrides, which is where our house style actually lives.

Rule names use xo's namespaces as-is. Note that import rules are `import-x/*`, not
`import/*`.

One plugin is ours directly rather than xo's:

- [`promise`](https://github.com/xjamundx/eslint-plugin-promise). We are considering
  dropping this: `promise/param-names` is the only rule we take from it, and a whole
  dependency for one rule is hard to justify. If we drop it, that rule goes with it.

## Usage

This package exports [a flat ESLint configuration](https://eslint.org/docs/latest/use/configure/configuration-files-new).

```bash
npm install --save-dev eslint @cloudfour/eslint-config
```

Example `eslint.config.js`:

```js
import cloudFourConfig from '@cloudfour/eslint-config';

export default [
	...cloudFourConfig,
	{
		rules: {
			// your overrides here
			...
		}
	},
];
```

### Writing your own overrides

xo scopes its layers to the file types they lint, and registers plugins on those
layers. A `rules` block with no `files` applies to everything — including the
JSON, Markdown, CSS and HTML that xo now lints, where those plugins were never
registered. ESLint then fails to load the config entirely:

```text
A configuration object specifies rule "jsdoc/check-indentation",
but could not find plugin "jsdoc".
```

So scope any override for a JavaScript-only plugin:

```js
{
	files: ['**/*.{js,cjs,mjs,ts}'],
	rules: {
		'jsdoc/check-indentation': 'off',
	},
}
```

This is easy to miss, because it passes when you lint a single file
(`eslint src/index.js`) and only fails across the project (`eslint .`).

## Recommended settings for published packages

We turn off three `package.json` rules that would otherwise fire on every
project, including the many that never publish anything. Each one asks for
something genuinely worth having in a package you _do_ publish to npm, so
consider switching them back on there:

| Rule                              | Asks for                             | Worth it when                                                                                                                                                   |
| --------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package-json/prefer-exports`     | An `exports` field instead of `main` | The package is published and you want a defined public interface. Blocks deep imports into internals, so it's a breaking change — pair it with a major release. |
| `package-json/require-engines`    | `engines.node`                       | The package actually runs in Node. Skip it for browser libraries, where there is no Node version to describe.                                                   |
| `package-json/prefer-type-module` | `"type": "module"`                   | You are ready to go ESM-only. This breaks every consumer using `require()`, so it is a major-release decision.                                                  |

To adopt them in a project:

```js
{
	files: ['package.json'],
	rules: {
		'package-json/prefer-exports': 'error',
		'package-json/require-engines': 'error',
	},
}
```

Note that we scope xo's `package.json` layer to the **root** manifest. Rules
like `require-fields` and `prefer-type-module` describe a package's manifest,
and applying them to every `**/package.json` reports on files that are not
packages — most notably the `{"type": "commonjs"}` marker files that dual
CommonJS/ESM builds place in their output directories. If you keep real
manifests somewhere other than the repository root, such as npm workspaces,
widen the scope in your own config:

```js
{
	files: ['packages/*/package.json'],
	rules: {
		'package-json/require-fields': 'error',
	},
}
```
