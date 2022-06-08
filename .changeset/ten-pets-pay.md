---
'@cloudfour/eslint-plugin': major
---

Sort imports

**Newly Enabled Rules**

- [`@cloudfour/import/order`](https://github.com/import-js/eslint-plugin-import/blob/v2.25.4/docs/rules/order.md)
- [`sort-imports`](https://eslint.org/docs/rules/sort-imports)

This rule sorts imports into separate categories, with empty lines between the categories, and with the imports within a category sorted alphabetically. The variable bindings within an import statement are also sorted alphabetically.

This rule is auto-fixable, however in some cases manual sorting may be needed. Occasionally, the auto-fix will detach comments from the import statements they refer to.
