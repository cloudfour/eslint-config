# Contributing Guide

## Tests

```sh
npm test          # run once
npm run test:watch
```

The suite uses [`node --test`](https://nodejs.org/api/test.html), so there is no
test framework to install. It covers four things:

- **Fixture behaviour** (`__tests__/javascript.test.js`, `__tests__/typescript.test.js`)
  lints `__tests__/fixtures/` with our config and asserts the exact set of rules
  that fire. The `valid` fixtures are the interesting half: everything in them is
  something we deliberately allow, so they fail if a dependency re-enables a rule
  we turned off.
- **Node support** (`__tests__/engines.test.js`) asserts that every Node version
  we advertise in `engines.node` is one that each installed dependency also
  supports.
- **Prettier conflicts** (`__tests__/prettier-conflicts.test.js`) runs the
  `eslint-config-prettier` CLI, which reports any enabled rule that fights
  Prettier.
- **Deprecations** (`__tests__/deprecated-rules.test.js`) fails when a dependency
  bump deprecates a rule we still enable.

When a dependency bump changes which rules fire, that is a real behaviour change
for consumers: update the fixtures and record it in `CHANGELOG.md`.

Fixtures are excluded from ESLint and Prettier so that autofixing can never
silently change what they test.

## Release Process

[How to publish an updated version](https://cloudfour.com/thinks/how-to-publish-an-updated-version-of-an-npm-package/)
