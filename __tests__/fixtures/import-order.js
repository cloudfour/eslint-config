// `import/order` is the one rule we configure that needs real module
// resolution: it has to know that `node:fs/promises` is a builtin, `semver` is
// external, and `./sibling.js` is a sibling in order to group them. The plugin
// resolves that with a native binary, so if the resolver ever stops working
// this rule degrades quietly rather than erroring — hence a fixture for it.
//
// These three imports are in exactly the wrong order.
import { sibling } from './sibling.js';
import { readFile } from 'node:fs/promises';
import semver from 'semver';

export const all = [sibling, readFile, semver];
