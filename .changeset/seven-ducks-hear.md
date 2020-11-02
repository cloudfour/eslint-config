---
'@cloudfour/eslint-plugin': major
---

Update `eslint-config-standard` to `16.0.1`

- Remove `eslint-plugin-standard` since all of the rules from it now live in other plugins
- `camelcase` rule now allows variables starting with `UNSAFE_` (from react) and known globals
- `no-unused-vars` now ignores unused caught errors (`unicorn/prefer-optional-catch-binding` handles this use case)
- `prefer-regex-literals`: Enabled [`disallowRedundantWrapping` option](https://eslint.org/docs/rules/prefer-regex-literals#disallowredundantwrapping)
- `array-callback-return`: Change [`allowImplicit`](https://eslint.org/docs/rules/array-callback-return#allowimplicit) to `false`.
- `use-isnan`: Change [`enforceForIndexOf`](https://eslint.org/docs/rules/use-isnan#enforceforindexof) to `true`.
-
