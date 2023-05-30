---
'@cloudfour/eslint-plugin': major
---

Update `eslint-plugin-jsdoc` from `v39` to `v46`

**Reconfigured Rules**

The `@cloudfour/jsdoc/tag-lines` rule is now configured to enforce one blank line in JSDoc comments between the description of a function and the `@param`/other tags.

For example, the blank line after the description is enforced here:

```js
/**
 * This is the description for the function, the blank line below this is enforced
 *
 * @param {string} name A parameter called name
 */
function someFunction(name) {}
```

**New Rules**

- [`@cloudfour/jsdoc/informative-docs`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/informative-docs.md#repos-sticky-header)
- [`@cloudfour/jsdoc/no-blank-block-descriptions`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-blank-block-descriptions.md#repos-sticky-header)
- [`@cloudfour/jsdoc/no-blank-blocks`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-blank-blocks.md#repos-sticky-header)

**Deleted Rules**

- [`@cloudfour/jsdoc/newline-after-description`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-newline-after-description)

**Newly Enabled Rules**

- [`@cloudfour/jsdoc/no-defaults`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-defaults.md#repos-sticky-header)
