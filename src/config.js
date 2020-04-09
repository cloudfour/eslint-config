// ESLint configs
const xo = require('eslint-config-xo');
const standard = require('eslint-config-standard');
const prettier = require('eslint-config-prettier');
const prettierStandard = require('eslint-config-prettier/standard');
const prettierUnicorn = require('eslint-config-prettier/unicorn');

// ESLint plugins
const node = require('eslint-plugin-node').configs.recommended;
const unicorn = require('eslint-plugin-unicorn').configs.recommended;
const jsdoc = require('eslint-plugin-jsdoc').configs.recommended;

/** @typedef {0 | 1 | 2 | 'off' | 'warn' | 'error'} ESLintRuleVal */
/** @typedef {ESLintRuleVal | [ESLintRuleVal, ...unknown[]]} ESLintRuleConfig */

/**
 * Adds the `@cloudfour/` prefix in front of each rule
 *
 * @param {{[key: string]: ESLintRuleConfig}} rules the rules to process
 */
const prefix = (rules) =>
  Object.entries(rules).reduce((output, [key, val]) => {
    if (key.includes('/') && !key.startsWith('@cloudfour/')) {
      key = `@cloudfour/${key}`;
    }

    output[key] = val;
    return output;
  }, {});

/**
 * Removes rules that are set to "off"
 *
 * @param {{[key: string]: ESLintRuleConfig}} rules the rules to process
 */
const removeUnused = (rules) =>
  Object.entries(rules).reduce((output, [key, val]) => {
    if (val === 'off' || val === 0 || val[0] === 'off' || val[0] === 0) {
      return output;
    }

    output[key] = val;
    return output;
  }, {});

/**
 * Changes all rules that are set to "warn" to "error"
 *
 * @param {{[key: string]: ESLintRuleConfig}} rules the rules to process
 */
const changeWarnToError = (rules) =>
  Object.entries(rules).reduce((output, [key, val]) => {
    if (val === 'warn' || val === 1) {
      output[key] = 'error';
    } else if (Array.isArray(val) && (val[0] === 'warn' || val[0] === 1)) {
      output[key] = ['error', ...val.slice(1)];
    } else {
      output[key] = val;
    }

    return output;
  }, {});

module.exports.configs = {
  recommended: {
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
    env: {
      node: true,
      es6: true,
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
        tagNamePreference: {
          TODO: 'todo',
        },
        preferredTypes: {
          '*': 'any',
          Function: '() => void',
          function: '() => void',
        },
      },
    },
    globals: {
      document: false,
      navigator: false,
      window: false,
    },
    plugins: ['@cloudfour'],
    rules: removeUnused(
      prefix({
        // Plugins' recommended configs
        ...node.rules,
        ...unicorn.rules,
        ...changeWarnToError(jsdoc.rules),

        // "standards"
        ...xo.rules,
        ...standard.rules,

        ...prettier.rules, // Undoes core stylistic rules
        ...prettierStandard.rules, // Undoes stylistic rules in standard plugin
        ...prettierUnicorn.rules, // Undoes stylistic rules in unicorn plugin

        // Custom Rules
        '@cloudfour/no-param-reassign': [
          'error',
          { ignoreWithinCallbacks: ['reduce'] },
        ],

        // Overrides
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: false,
            allowTernary: false,
            allowTaggedTemplates: false,
          },
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
        'node/shebang': 'off', // Tons of false positives
        'unicorn/prevent-abbreviations': 'off', // Causes more issues than it's worth

        // Disabling jsdoc rules that check the types themselves
        // If you want to have type checking on a project, use a real type checker (typescript) instead
        'jsdoc/newline-after-description': 'off',
        'jsdoc/no-undefined-types': 'off',
        'jsdoc/valid-types': 'off',
        'jsdoc/require-returns': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-property-description': 'off',
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-jsdoc': 'off',
      })
    ),
  },
};
