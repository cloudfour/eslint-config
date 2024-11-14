# @cloudfour/eslint-config

[![NPM version](https://img.shields.io/npm/v/@cloudfour/eslint-config.svg)](https://www.npmjs.com/package/@cloudfour/eslint-config) [![Build Status](https://github.com/cloudfour/eslint-config/workflows/CI/badge.svg)](https://github.com/cloudfour/eslint-config/actions?query=workflow%3ACI) [![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)

Cloud Four's ESLint configuration.

This config extends the following plugins:

- [`n`](https://github.com/weiran-zsd/eslint-plugin-node) (maintained fork of original [`eslint-plugin-node`](https://github.com/mysticatea/eslint-plugin-node))
- [`import`](https://github.com/benmosher/eslint-plugin-import)
- [`promise`](https://github.com/xjamundx/eslint-plugin-promise)
- [`jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc)
- [`unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [`standard`](https://github.com/standard/eslint-config-standard)
- [`@typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

It also adds the following custom rules:

- [`prefer-early-return`](./src/rules/prefer-early-return/)

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
