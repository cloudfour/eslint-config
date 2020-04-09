# @cloudfour/eslint-plugin

[![NPM version](https://img.shields.io/npm/v/@cloudfour/eslint-plugin.svg)](https://www.npmjs.com/package/@cloudfour/eslint-plugin) [![Renovate Status](https://badges.renovateapi.com/github/cloudfour/eslint-config)](https://renovatebot.com/)

Cloud Four's ESLint configuration. This exports itself as a "super-plugin" because of a [limitation of ESLint](https://github.com/eslint/eslint/issues/3458).

The way this works is that it requires all of the plugin dependencies, and exports them from this plugin under a prefix.

The plugins that this exposes are:

- [`node`](https://github.com/mysticatea/eslint-plugin-node)
- [`import`](https://github.com/benmosher/eslint-plugin-import)
- [`standard`](https://github.com/standard/eslint-plugin-standard)
- [`promise`](https://github.com/xjamundx/eslint-plugin-promise)
- [`unicorn`](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [`jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc)

To override settings for any of these plugins, you must prefix the configuration
with `cloudfour/`, because the plugins are exposed through this "super-plugin".

```json
{
  "extends": ["plugin:@cloudfour/recommended"],
  "rules": {
    "@cloudfour/promise/no-native": "off"
  }
}
```

This also exposes a custom rule:

- `@cloudfour/no-param-reassign`: Like the built in `no-param-reassign`, but accepts a list of functions to ignore

## Installation

```sh
npm install --save-dev @cloudfour/eslint-plugin eslint prettier
```

## Usage

Add this to your `package.json`:

```json
  "scripts": {
    "check-lint": "eslint . && prettier --check .",
    "lint": "eslint --fix . && prettier --write ."
  },
  "eslintConfig": {
    "extends": "plugin:@cloudfour/recommended"
  },
  "prettier": {
    "singleQuote": true
  }
```

### Check for Lint Errors

```sh
npm run check-lint
```

### Fix Lint Errors

This command will attempt to automatically fix lint errors. Note that not all lint errors can be fixed this way, so be prepeared to fix any remaining errors by hand.

```sh
npm run lint
```

### Troubleshooting Note

This config relies on using a version of eslint installed locally to your project. If you also have eslint installed globally, it's possible to run into conflicts. To avoid any problems, either:

- Just use the `npm run check-lint` and `npm run lint` scripts, which will run the local version of eslint.
- Or, if you prefer to run eslint by hand, use [npx](https://www.npmjs.com/package/npx), which will run the local version of eslint. eg, `npx eslint '**/*.js'`
