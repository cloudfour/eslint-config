const prettier = require('prettier');
const { writeFileSync } = require('fs');
const { join, sep } = require('path');

const { configs, environments } = require('./src/config');

const resolveStart = '__REQUIRE_RESOLVE__';
const resolveEnd = '__END_REQUIRE_RESOLVE__';

// Require.resolve needs to be dynamic and cannot be statically stringified with JSON.stringify
const stringify = (data) =>
  `module.exports = ${JSON.stringify(data, (k, v) => {
    if (k === 'parser' && v.startsWith(__dirname)) {
      return (
        resolveStart +
        v // Replace the static node_modules path with a relative path
          .replace(join(__dirname, `node_modules${sep}`), '')
          .replace(/\/.*$/, '') +
        resolveEnd
      );
    }

    return v;
  })}`.replace(
    // Wrap the relative parser path with require.resolve
    new RegExp(`"${resolveStart}(.*?)${resolveEnd}"`, 'g'),
    (_match, replacement) => {
      return `require.resolve("${replacement}")`;
    }
  );

const createFile = (data) =>
  // Clean up the file so that it is readable
  prettier.format(stringify(data), { parser: 'babylon', singleQuote: true });

// Snapshots the merged config to make debugging rules easier and to reduce dependencies
writeFileSync(join('dist', 'config.js'), createFile({ configs, environments }));
