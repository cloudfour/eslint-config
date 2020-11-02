const node = require('eslint-plugin-node').rules;
const eslintImport = require('eslint-plugin-import').rules;
const promise = require('eslint-plugin-promise').rules;
const unicorn = require('eslint-plugin-unicorn').rules;
const jsdoc = require('eslint-plugin-jsdoc').rules;
const typescript = require('@typescript-eslint/eslint-plugin').rules;
const preferEarlyReturn = require('./rules/prefer-early-return');

/**
 * Prefixes each rule of the config
 * Example if `prefix` is `node`:
 * changes rule callback-return to node/callback-return
 *
 * @param {string} prefix
 * @param {{[key: string]: unknown}} rules
 */
const hoist = (prefix, rules) =>
  Object.entries(rules).reduce((output, [key, val]) => {
    output[`${prefix}/${key}`] = val;
    return output;
  }, {});

const rules = {
  ...hoist('node', node),
  ...hoist('import', eslintImport),
  ...hoist('promise', promise),
  ...hoist('unicorn', unicorn),
  ...hoist('jsdoc', jsdoc),
  ...hoist('typescript-eslint', typescript),
  'prefer-early-return': preferEarlyReturn,
};

module.exports = rules;
