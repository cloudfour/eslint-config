const node = require('eslint-plugin-node').rules;
const eslintImport = require('eslint-plugin-import').rules;
const standard = require('eslint-plugin-standard').rules;
const promise = require('eslint-plugin-promise').rules;

const hoist = (prefix, rules) =>
  Object.entries(rules).reduce((output, [key, val]) => {
    output[`${prefix}/${key}`] = val;
    return output;
  }, {});

const rules = {
  ...hoist('node', node),
  ...hoist('import', eslintImport),
  ...hoist('standard', standard),
  ...hoist('promise', promise)
};

module.exports = rules;
