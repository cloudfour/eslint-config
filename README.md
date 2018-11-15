# @cloudfour/eslint-plugin

Cloud Four's ESLint configuration. This exports itself as a "super-plugin" because of a [limitation of ESLint](https://github.com/eslint/eslint/issues/3458).

The way this works is that it requires all of the plugin dependencies, and exports them from this plugin under a prefix.

The plugins that this exposes are:

- [`node`](https://github.com/mysticatea/eslint-plugin-node)
- [`import`](https://github.com/benmosher/eslint-plugin-import)
- [`standard`](https://github.com/standard/eslint-plugin-standard)
- [`promise`](https://github.com/xjamundx/eslint-plugin-promise)

To override settings for any of these plugins, you must prefix the configuration
with `cloudfour/`, because the plugins are exposed through this "super-plugin".

```json
{
  "extends": ["plugin:cloudfour/recommended"],
  "rules": {
    "cloudfour/promise/no-native": "off"
  }
}
```

## Installation

```sh
npm install --save-dev @cloudfour/eslint-plugin eslint prettier
```

## Usage

Add this to your `package.json`:

```json
  "scripts": {
    "check-lint": "prettier --list-different '**/*.js' && eslint '**/*.js'",
    "lint": "prettier --write '**/*.js' && eslint --fix '**/*.js'"
  },
  "eslintConfig": {
    "extends": "plugin:cloudfour/recommended"
  },
  "prettier": {
    "singleQuote": true
  }
```

### For CI

```sh
npm run check-lint
```

### Locally

(this will automatically fix many linting issues)

```sh
npm run lint
```
