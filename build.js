const prettier = require('prettier');
const { writeFileSync } = require('fs');
const { join, sep } = require('path');

const { configs, environments } = require('./src/config');

const resolveStart = '__REQUIRE_RESOLVE__';
const resolveEnd = '__END_REQUIRE_RESOLVE__';

// Require.resolve needs to be dynamic and cannot be statically stringified with JSON.stringify
const stringify = (data) =>
  `module.exports = ${JSON.stringify(data, (k, v) => {
    if (k === 'parser' && typeof v === 'string' && v.startsWith(__dirname)) {
      const pathWithoutNodeModules = v.replace(
        join(__dirname, `node_modules${sep}`),
        ''
      );
      // Takes the file path and changes it to just the name of the package the path was in
      const packagePath = pathWithoutNodeModules.startsWith('@')
        ? // If it is a part of a npm org, then it will be two levels deep: @___/___
          /^@[^/]*\/[^/]*/.exec(pathWithoutNodeModules)[0]
        : // Otherwise, it will just be one level deep: ___
          /^[^/]*/.exec(pathWithoutNodeModules)[0];
      return `${resolveStart}${packagePath}${resolveEnd}`;
    }

    return v;
  })}`.replace(
    // Wrap the relative parser path with require.resolve
    new RegExp(`"${resolveStart}(.*?)${resolveEnd}"`, 'g'),
    (_match, replacement) => `require.resolve("${replacement}")`
  );

const createFile = (data) =>
  // Clean up the file so that it is readable
  prettier.format(stringify(data), { parser: 'babel', singleQuote: true });

// Snapshots the merged config to make debugging rules easier and to reduce dependencies
writeFileSync(join('dist', 'config.js'), createFile({ configs, environments }));
