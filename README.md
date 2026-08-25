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
