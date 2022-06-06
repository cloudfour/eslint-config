---
'@cloudfour/eslint-plugin': major
---

Enforce using the `node`: protocol for imports to node built-in modules ([`prefer-node-protocol`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/rules/prefer-node-protocol.js)).

❌ `require('fs')` → ✅ `require('node:fs')`
❌ `import * as fs from 'fs'` → ✅ `import * as fs from 'node:fs'`

The `import` form is supported in node v14.13.1+.
The `require` form is supported in node v14.18.0+.

It is auto-fixable.
