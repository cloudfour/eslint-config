---
'@cloudfour/eslint-plugin': major
---

Enabled [`@cloudfour/n/file-extension-in-import`](https://github.com/weiran-zsd/eslint-plugin-node/blob/HEAD/docs/rules/file-extension-in-import.md).

❌ `require('./foo')` → ✅ `require('./foo.js')`
❌ `import * as foo from './foo'` → ✅ `import * as foo from './foo.js'`

If the file that you are importing is a `.ts` file, you must import it as `.js`, because of a [decision that the TypeScript team made](https://github.com/microsoft/TypeScript/issues/16577#issuecomment-754941937).
