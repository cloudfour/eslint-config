# cloudfour/eslint-config

This is our ESLint configuration.

## Installation

```sh
$ npm install --save-dev cloudfour/eslint-config
```

## Usage

Add an `.eslintrc` file to your project and extend this configuration.

The default configuration will work for most Node/CommonJS projects:

```yaml
extends: '@cloudfour/eslint-config'
```

The `babel` configuration can be used for projects using Babel. You will want this specifically if you're using ES modules (`import` and `export`).

```yaml
extends: '@cloudfour/eslint-config/babel'
```
