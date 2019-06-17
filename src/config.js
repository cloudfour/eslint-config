// ESLint configs
const xo = require('eslint-config-xo');
const standard = require('eslint-config-standard');
const prettier = require('eslint-config-prettier');
const prettierStandard = require('eslint-config-prettier/standard');
const prettierUnicorn = require('eslint-config-prettier/unicorn');

// ESLint plugins
const node = require('eslint-plugin-node').configs.recommended;
const unicorn = require('eslint-plugin-unicorn').configs.recommended;

/**
 * @param {{[key: string]: any}} rules the rules to process
 */
const prefix = rules =>
  Object.entries(rules).reduce((output, [key, value]) => {
    if (key.includes('/') && !key.startsWith('@cloudfour/')) {
      key = `@cloudfour/${key}`;
    }

    output[key] = value;
    return output;
  }, {});

const removeUnused = rules =>
  Object.entries(rules).reduce((output, [key, value]) => {
    if (
      value === 'off' ||
      value === 0 ||
      value[0] === 'off' ||
      value[0] === 0
    ) {
      return output;
    }

    output[key] = value;
    return output;
  }, {});

module.exports.configs = {
  recommended: {
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: { jsx: true }
    },
    environment: {
      node: true,
      es6: true
    },
    globals: {
      document: false,
      navigator: false,
      window: false
    },
    plugins: ['@cloudfour'],
    rules: removeUnused(
      prefix({
        // Plugins' recommended configs
        ...node.rules,
        ...unicorn.rules,

        // "standards"
        ...xo.rules,
        ...standard.rules,

        ...prettier.rules, // Undoes core stylistic rules
        ...prettierStandard.rules, // Undoes stylistic rules in standard plugin
        ...prettierUnicorn.rules, // Undoes stylistic rules in unicorn plugin

        // Custom Rules
        '@cloudfour/no-param-reassign': [
          'error',
          { ignoreWithinCallbacks: ['reduce'] }
        ],

        // Overrides
        'valid-jsdoc': 'off',
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: false,
            allowTernary: false,
            allowTaggedTemplates: false
          }
        ],
        'no-return-assign': ['error'],
        'func-names': 'off',
        'prefer-const': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-object-spread': 'error',
        'prefer-spread': 'error',
        'prefer-destructuring': ['error', { array: false }],
        'prefer-rest-params': 'error',
        'prefer-template': 'error',
        'node/no-unsupported-features/es-syntax': 'off', // Does not account for transpilation
        'node/no-unpublished-require': 'off', // Does not account for "build" scripts
        'node/shebang': 'off' // Tons of false positives
      })
    )
  }
};
