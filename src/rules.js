const node = require('eslint-plugin-n').rules;
const eslintImport = require('eslint-plugin-import').rules;
const promise = require('eslint-plugin-promise').rules;
const unicorn = require('eslint-plugin-unicorn').rules;
const jsdoc = require('eslint-plugin-jsdoc').rules;
const typescript = require('@typescript-eslint/eslint-plugin').rules;
const preferEarlyReturn = require('./rules/prefer-early-return');

/**
 * Prefixes each rule of the config
 * Example if `prefix` is `n`:
 * changes rule callback-return to n/callback-return
 *
 * @param {string} prefix
 * @param {{[key: string]: unknown}} rules
 */
const hoist = (prefix, rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([key, val]) => [`${prefix}/${key}`, val])
  );

const rules = {
  ...hoist('n', node),
  ...hoist('import', eslintImport),
  ...hoist('promise', promise),
  ...hoist('unicorn', unicorn),
  ...hoist('jsdoc', jsdoc),
  ...hoist('typescript-eslint', typescript),
  'prefer-early-return': preferEarlyReturn,
};

module.exports = rules;
