---
'@cloudfour/eslint-plugin': major
---

Update `eslint-plugin-unicorn` to `v29`

New rules:

- [`@cloudfour/unicorn/no-array-for-each`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-for-each.md)
- [`@cloudfour/unicorn/no-array-push-push`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-push-push.md)
- [`@cloudfour/unicorn/no-this-assignment`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-this-assignment.md)
- [`@cloudfour/unicorn/no-lonely-if`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-lonely-if.md)
- [`@cloudfour/unicorn/empty-brace-spaces`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/empty-brace-spaces.md) (not enabled by default)
- [`@cloudfour/unicorn/prefer-date-now`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-date-now.md)
- [`@cloudfour/unicorn/no-new-array`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-array.md)
- [`@cloudfour/unicorn/prefer-array-index-of`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-index-of.md)
- [`@cloudfour/unicorn/prefer-regexp-test`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-regexp-test.md)
- [`@cloudfour/unicorn/consistent-destructuring`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-destructuring.md) (not enabled by default)
- [`@cloudfour/unicorn/prefer-array-some`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-some.md)
- [`@cloudfour/unicorn/prefer-default-parameters`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-default-parameters.md)
- [`@cloudfour/unicorn/no-static-only-class`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-static-only-class.md)
- [`@cloudfour/unicorn/prefer-array-flat`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-flat.md) (not enabled by default)

Disabled rules:

- [`@cloudfour/unicorn/import-index`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/import-index.md) (due to Node ESM resolution implementation)

Rename rules:

- `@cloudfour/unicorn/no-fn-reference-in-iterator` → `@cloudfour/unicorn/no-array-callback-reference`
- `@cloudfour/unicorn/no-array-instanceof` → `@cloudfour/unicorn/no-instanceof-array`
- `@cloudfour/unicorn/no-reduce` → `@cloudfour/unicorn/no-array-reduce`
- `@cloudfour/unicorn/prefer-dataset` → `@cloudfour/unicorn/prefer-dom-node-dataset`
- `@cloudfour/unicorn/prefer-flat-map` → `@cloudfour/unicorn/prefer-array-flat-map`
- `@cloudfour/unicorn/prefer-replace-all` → `@cloudfour/unicorn/prefer-string-replace-all`
- `@cloudfour/unicorn/prefer-starts-ends-with` → `@cloudfour/unicorn/prefer-string-starts-ends-with`
- `@cloudfour/unicorn/prefer-text-content` → `@cloudfour/unicorn/prefer-dom-node-text-content`
- `@cloudfour/unicorn/prefer-trim-start-end` → `@cloudfour/unicorn/prefer-string-trim-start-end`
- `@cloudfour/unicorn/prefer-event-key` → `@cloudfour/unicorn/prefer-keyboard-event-key`
- `@cloudfour/unicorn/prefer-node-append` → `@cloudfour/unicorn/prefer-dom-node-append`
- `@cloudfour/unicorn/prefer-node-remove` → `@cloudfour/unicorn/prefer-dom-node-remove`

There were many improvements/changes to individual rules, listed [here](https://github.com/cloudfour/eslint-config/pull/242)
