---
'@cloudfour/eslint-plugin': major
---

Update typescript-eslint to v4

- [Require `@ts-expect-error` comments to have a description explaining why](https://github.com/typescript-eslint/typescript-eslint/pull/2351)
- [New scope analyzer](https://github.com/typescript-eslint/typescript-eslint/pull/2039). This is mostly bugfixes, but it is possible that it could cause rules to (correctly) trigger on code that they didn't before.
- Enabled the new [`@typescript-eslint/consistent-type-imports`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-imports.md) rule, which will auto-fix type imports to use the new [`import type` syntax](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
- Enabled [`@typescript-eslint/no-unnecessary-condition`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-condition.md) and [`@typescript-eslint/no-unnecessary-boolean-literal-compare`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-boolean-literal-compare.md). If either of these rules trigger on your code, then that means that either your types are incorrect (likely missing `| null` or `| undefined`), or the condition is not necessary (meaning it either always runs or never runs).
