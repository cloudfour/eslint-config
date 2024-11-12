# @cloudfour/eslint-config

[![NPM version](https://img.shields.io/npm/v/@cloudfour/eslint-config.svg)](https://www.npmjs.com/package/@cloudfour/eslint-config) [![Build Status](https://github.com/cloudfour/eslint-config/workflows/CI/badge.svg)](https://github.com/cloudfour/eslint-config/actions?query=workflow%3ACI) [![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)

Cloud Four's ESLint configuration.

The plugins that this config exposes are:

- [`n`](https://github.com/weiran-zsd/eslint-plugin-node) (maintained fork of original [`eslint-plugin-node`](https://github.com/mysticatea/eslint-plugin-node))
- [`import`](https://github.com/benmosher/eslint-plugin-import)
- [`standard`](https://github.com/standard/eslint-plugin-standard)
- [`promise`](https://github.com/xjamundx/eslint-plugin-promise)
- [`unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [`jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc)
- [`@typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

In addition to the `recommended` configuration, `@cloudfour/eslint-plugin` also re-exports typescript-eslint's [`disable-type-checked` configuration](https://typescript-eslint.io/linting/configs/#disable-type-checked). This configuration disables any rules that depend on typescript-eslint's typescript integration.

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
		// your overrides here
	},
];
```
