const merge = require('deepmerge');

const mergeConfigs = (...configs) => {
  // arrays should be combined (like the plugins array)
  const config = merge.all(configs);
  // rule values should be overwritten, not deep merged
  const rules = Object.assign(...configs.map(c => c.rules));
  config.rules = rules;
  // ecmaFeatures is deprecated, but some configs/plugins still have it
  delete config.parserOptions.ecmaFeatures;
  return config;
};

const xoConfig = require('eslint-config-xo');
const standardConfig = require('eslint-config-standard');
const prettierConfig = require('eslint-config-prettier');

const overrides = {
  extends: ['plugin:unicorn/recommended'],
  plugins: ['unicorn'],
  rules: {
    'valid-jsdoc': 'off',
    'no-return-assign': ['error'],
    // prettier sometimes chooses to allow lines to exceed max, it is fine
    'max-len': 'off',
    'func-names': 'off',
    'standard/computed-property-even-spacing': 'off'
  }
};

const config = mergeConfigs(
  xoConfig,
  standardConfig,
  prettierConfig,
  overrides
);

module.exports = config;
