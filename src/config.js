// ESLint configs
const xo = require('eslint-config-xo');
const standard = require('eslint-config-standard');
const prettier = require('eslint-config-prettier');
const typescript = require('@typescript-eslint/eslint-plugin');

// ESLint plugins
const node = require('eslint-plugin-n').configs.recommended;
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
  Object.fromEntries(
    Object.entries(rules).map(([key, val]) => {
      // If the key already starts with an @, remove it (for example typescript-eslint)
      if (key.includes('/') && !key.startsWith('@cloudfour/'))
        key = `@cloudfour/${key.replace(/^@/, '')}`;
      return [key, val];
    })
  );

/**
 * Removes rules that are set to "off"
 *
 * @param {Record<string, ESLintRuleConfig>} rules the rules to process
 */
const removeUnused = (rules) =>
  Object.fromEntries(
    Object.entries(rules).filter(
      ([, val]) =>
        !(val === 'off' || val === 0 || val[0] === 'off' || val[0] === 0)
    )
  );

/**
 * Changes all rules that are set to "warn" to "error"
 *
 * @param {{[key: string]: ESLintRuleConfig}} rules the rules to process
 */
const changeWarnToError = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([key, val]) => {
      if (val === 'warn' || val === 1) return [key, 'error'];
      if (Array.isArray(val) && (val[0] === 'warn' || val[0] === 1))
        return [key, ['error', ...val.slice(1)]];
      return [key, val];
    })
  );

module.exports.configs = {
  recommended: {
    parserOptions: {
      ecmaVersion: 2021,
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

        ...prettier.rules, // Undoes stylistic rules

        // Overrides
        'no-unused-expressions': [
          'error',
          {
            allowShortCircuit: false,
            allowTernary: false,
            allowTaggedTemplates: false,
          },
        ],
        '@cloudfour/prefer-early-return': 'error',
        'no-return-assign': ['error'],
        'func-names': 'off',
        'prefer-const': [
          'error',
          // If there is a destructuring assignment
          // and some of the properties should be const
          // but others shouldn't be, let it use let
          { destructuring: 'all' },
        ],
        'no-var': 'error',
        'object-shorthand': 'error',
        'prefer-object-spread': 'error',
        'prefer-spread': 'error',
        'prefer-destructuring': ['error', { array: false }],
        'prefer-rest-params': 'error',
        // We decided that since devs can use blank lines to create logical groupings in code,
        // it is best not to have ESLint enforce adding newlines
        'padding-line-between-statements': 'off',
        'prefer-template': 'error',
        'no-param-reassign': 'off', // We don't use `arguments`, and assigning to parameters can be useful
        'no-promise-executor-return': 'off', // Allow implicit return in promise executor
        'capitalized-comments': [
          'error',
          'always',
          {
            ignorePattern:
              'pragma|ignore|prettier-ignore|webpack\\w+:|c8|return|const|let|var|await|function|console',
            ignoreInlineComments: true,
            ignoreConsecutiveComments: true,
          },
        ],

        'n/no-unsupported-features/es-syntax': 'off', // Does not account for transpilation
        'n/no-unpublished-require': 'off', // Does not account for "build" scripts
        'n/shebang': 'off', // Tons of false positives

        'unicorn/import-style': 'off', // It doesn't seem useful to force people to use named, default, or namespace imports
        'unicorn/prevent-abbreviations': 'off', // Causes more issues than it's worth
        // Null is ok, even though Sindre Sorhus doesn't like it
        // It is ok to avoid using null and use undefined instead
        // but enforcing it in all code via a lint rule is too annoying
        'unicorn/no-null': 'off',
        // This rule is meant to avoid the edge case of breaking changes occuring
        // due to the `index` parameter being passed unexpectedly into the callback function,
        // causing unexpected behavior if the callback expects something that is not the index
        // But this is an edge case that can be avoided through careful manual review
        // and sometimes through TS
        'unicorn/no-array-callback-reference': 'off',
        // https://github.com/sindresorhus/eslint-plugin-unicorn/pull/1750
        // This rule got removed from the recommended preset, but that hasn't been published yet.
        'unicorn/prefer-json-parse-buffer': 'off',
        // This rule changes arrays to sets if you call .includes on it
        // Converting from array to set has a cost itself, just like .includes has a cost
        // We decided to leave the decision of using arrays vs sets to human reviewers
        'unicorn/prefer-set-has': 'off',
        // Reduce is often useful. Don't need a lint rule to tell us not to use it
        'unicorn/no-array-reduce': 'off',
        'unicorn/prefer-module': 'off', // A lot of projects still use commonjs by default for non-browser code. We can revisit this rule once commonjs is basically never used.
        'unicorn/prefer-switch': 'off', // Switch statements are often longer than if/else chains, and they are still read aloud as "if ... is ... then"
        'unicorn/prefer-number-properties': [
          'error',
          // There isn't a good reason to force use of Number.POSITIVE_INFINITY instead of Infinity
          { checkInfinity: false },
        ],
        // The node: protocol for imports is supported for imports starting in node 12
        // and for require()'s starting in node 16.
        // Since for most projects, we are transpiling imports to requires,
        // This rule is not ready until we only support node 16+
        'unicorn/prefer-node-protocol': 'off',
        // This rule suggests incorrect code with the destructured object is modified
        // That is a fairly common case, and it is too annoying to always disable the rule on each line
        'unicorn/consistent-destructuring': 'off',

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

          // TS handles checking these
          'n/no-missing-import': 'off',
          'n/no-missing-require': 'off',

          'no-import-assign': 'off', // TS handles this

          // With TS, the only reason to have a @param tag
          // is if a particular parameter needs a description,
          // which is not true for all parameters
          'jsdoc/require-param': 'off',
          'jsdoc/require-param-type': 'off', // Types should be in type annotations instead
          'jsdoc/require-param-description': 'error', // The only reason to have an @param in TS is to add a description
          'jsdoc/require-returns-type': 'off', // Return types should be in type annotations instead
          'jsdoc/require-returns-description': 'error', // The only reason to have an @returns in TS is to add a description
          // Auto-fixes type imports to use the `import type` syntax
          // This syntax is preferred because it makes the TS -> JS transformation easier
          // because it doesn't require checking which imports are only referenced as types
          '@typescript-eslint/consistent-type-imports': [
            'error',
            // We have set it to allow import('...') for types because that is the only kind of import that is allowed in global type augmentations
            { disallowTypeAnnotations: false },
          ],
          // Don't try to use the result of expression whose type is `void`
          '@typescript-eslint/no-confusing-void-expression': [
            'error',
            { ignoreArrowShorthand: true },
          ],
          // Don't use the void operator an an expression whose type is already `void`
          '@typescript-eslint/no-meaningless-void-operator': 'error',
          '@typescript-eslint/no-unnecessary-type-constraint': 'error',
          '@typescript-eslint/array-type': ['error', { default: 'array' }], // Require consistency: Use foo[] instead of Array<foo>
          '@typescript-eslint/ban-ts-comment': 'error',
          '@typescript-eslint/explicit-module-boundary-types': 'off', // Type inference is useful even for public functions
          '@typescript-eslint/no-explicit-any': 'off', // Any is an escape hatch, it should be allowed
          '@typescript-eslint/no-floating-promises': 'off', // Don't force every promise rejection to be caught. Humans can decide when it makes sense to handle errors and when it doesn't
          '@typescript-eslint/no-non-null-assertion': 'error', // Default is warn
          '@typescript-eslint/no-unsafe-assignment': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/no-unsafe-call': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/no-unsafe-member-access': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/no-unsafe-return': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/no-unsafe-argument': 'off', // Any is an escape hatch, let it be an escape hatch
          '@typescript-eslint/restrict-template-expressions': 'off', // Allow using any-typed-values in template expressions
          '@typescript-eslint/no-unnecessary-condition': 'error', // This catches a lot of dead code that TS itself doesn't flag
          '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
          '@typescript-eslint/prefer-optional-chain': 'error', // More readable syntax
          'no-unused-vars': 'off', // TS checks this via noUnusedLocals / noUnusedParameters
          '@typescript-eslint/no-unused-vars': 'off', // TS checks this via noUnusedLocals / noUnusedParameters
          '@typescript-eslint/no-empty-function': 'off', // Non-TS version of rule is not used either
          '@typescript-eslint/unbound-method': 'off', // It is pretty common for this already being handled outside of what TS/ESLint can be aware of
          'no-unused-expressions': 'off',
          '@typescript-eslint/no-unused-expressions': ['error'], // This rule is like the built in ESLint rule but it supports optional chaining
          // Replacing the built-in rule with the version that works well with TS
          'no-use-before-define': 'off',
          '@typescript-eslint/no-use-before-define': [
            'error',
            {
              functions: false,
              classes: false,
              variables: false,
              ignoreTypeReferences: true,
            },
          ],
        }),
      },
    ],
  },
};
