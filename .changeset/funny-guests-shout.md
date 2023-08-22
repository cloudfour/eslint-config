---
'@cloudfour/eslint-plugin': major
---

Improve linting of `type` modifiers on imports.

**Reconfigured Rules (`recommended` Config)**

- [`@cloudfour/import/no-duplicates`](https://github.com/import-js/eslint-plugin-import/blob/v2.28.0/docs/rules/no-duplicates.md)
  ```diff
  - "error"
  + [
  +   "error",
  +   {
  +     "prefer-inline": true
  +   }
  + ]
  ```

**Newly Enabled Rules (`recommended` Config » TS Overrides)**

- [`@cloudfour/typescript-eslint/no-import-type-side-effects`](https://typescript-eslint.io/rules/no-import-type-side-effects)
