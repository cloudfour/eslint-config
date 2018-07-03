# @cloudfour/eslint-config

This is our ESLint configuration.

## Installation

```sh
npm install --save-dev @cloudfour/eslint-config eslint prettier
```

You will also have to install some plugins that this depends on, because of a [limitation of ESLint](https://github.com/eslint/eslint/issues/3458)

```sh
npm install --save-dev eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-standard eslint-plugin-unicorn
```

## Usage

Add this to your `package.json`:

```json
  "scripts": {
    "check-lint": "prettier --list-different '**/*.js' && eslint '**/*.js'",
    "lint": "prettier --write '**/*.js' && eslint --fix '**/*.js'"
  },
  "eslintConfig": {
    "extends": "@cloudfour/eslint-config"
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
