// ESLint configs
const xo = require('eslint-config-xo');
const standard = require('eslint-config-standard');
const prettier = require('eslint-config-prettier');
const prettierStandard = require('eslint-config-prettier/standard');
const prettierUnicorn = require('eslint-config-prettier/unicorn');
const prettierTypescript = require('eslint-config-prettier/@typescript-eslint');
const typescript = require('@typescript-eslint/eslint-plugin');

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
      // If the key already starts with an @, remove it (for example typescript-eslint)
      key = `@cloudfour/${key.replace(/^@/, '')}`;
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
      ecmaVersion: 2020,
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
        'no-param-reassign': 'off', // We don't use `arguments`, and assigning to parameters can be useful
        'no-promise-executor-return': 'off', // Allow implicit return in promise executor
        'node/no-unsupported-features/es-syntax': 'off', // Does not account for transpilation
        'node/no-unpublished-require': 'off', // Does not account for "build" scripts
        'node/shebang': 'off', // Tons of false positives

        'unicorn/prevent-abbreviations': 'off', // Causes more issues than it's worth
        // Null is ok, even though Sindre Sorhus doesn't like it
        // It is ok to avoid using null and use undefined instead
        // but enforcing it in all code via a lint rule is too annoying
        'unicorn/no-null': 'off',
        // This rule is meant to avoid the edge case of breaking changes occuring
        // due to the `index` parameter being passed unexpectedly into the callback function,
        // causing unexpected behavior if the callback expects something that is not the index
        // But this is an edge case that can be avoided through careful manual review
        'unicorn/no-fn-reference-in-iterator': 'off',
        // This rule changes arrays to sets if you call .includes on it
        // Converting from array to set has a cost itself, just like .includes has a cost
        // We decided to leave the decision of using arrays vs sets to human reviewers
        'unicorn/prefer-set-has': 'off',
        // Reduce is often useful. Don't need a lint rule to tell us not to use it
        'unicorn/no-reduce': 'off',

        // Disabling jsdoc rules that check the types themselves
        // If you want to have type checking on a project, use typescript instead
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
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        parser: require.resolve('@typescript-eslint/parser'), // Force it to resolve from this directory
        parserOptions: {
          project: './tsconfig.json',
        },
        rules: prefix({
          ...typescript.configs['eslint-recommended'].overrides[0].rules,
          ...typescript.configs.recommended.rules,
          ...typescript.configs['recommended-requiring-type-checking'].rules,
          ...prettierTypescript.rules,

          'node/no-extraneous-import': 'off', // TS checks this, this rule is slow
          'no-import-assign': 'off', // TS handles this

          // With TS, the only reason to have a @param tag
          // is if a particular parameter needs a description,
          // which is not true for all parameters
          'jsdoc/require-param': 'off',
          'jsdoc/require-param-type': 'off', // Types should be in type annotations instead
          'jsdoc/require-param-description': 'error', // The only reason to have an @param in TS is to add a description
          'jsdoc/require-returns-type': 'off', // Return types should be in type annotations instead
          'jsdoc/require-returns-description': 'error', // The only reason to have an @returns in TS is to add a description

          '@typescript-eslint/array-type': ['error', { default: 'array' }], // Require consistency: Use foo[] instead of Array<foo>
          '@typescript-eslint/ban-ts-comment': [
            'error',
            {
              // True means ban, false means allow
              'ts-expect-error': false, // This is an escape hatch, allow it
              'ts-ignore': true,
              'ts-nocheck': false,
              'ts-check': false,
            },
          ],
          '@typescript-eslint/explicit-module-boundary-types': 'off', // Type inference is useful even for public functions
          '@typescript-eslint/no-explicit-any': 'off', // Any is an escape hatch, it should be allowed
          '@typescript-eslint/no-floating-promises': 'off', // Don't force every promise rejection to be caught. Humans can decide when it makes sense to handle errors and when it doesn't
          '@typescript-eslint/no-non-null-assertion': 'error', // Default is warn
          '@typescript-eslint/no-unsafe-assignment': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/no-unsafe-call': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/no-unsafe-member-access': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/no-unsafe-return': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/restrict-template-expressions': 'off', // Allow using any-typed-values in template expressions

          '@typescript-eslint/prefer-optional-chain': 'error', // More readable syntax
          'no-unused-vars': 'off', // TS checks this via noUnusedLocals / noUnusedParameters
          '@typescript-eslint/no-unused-vars': 'off', // TS checks this via noUnusedLocals / noUnusedParameters
          '@typescript-eslint/no-empty-function': 'off', // Non-TS version of rule is not used either
          '@typescript-eslint/unbound-method': 'off', // It is pretty common for this already being handled outside of what TS/ESLint can be aware of
          'no-unused-expressions': 'off',
          '@typescript-eslint/no-unused-expressions': ['error'], // This rule is like the built in ESLint rule but it supports optional chaining
        }),
      },
    ],
  },
};
