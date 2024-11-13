import eslintConfigPrettier from 'eslint-config-prettier';
import xo from 'eslint-config-xo';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import nodePlugin from 'eslint-plugin-n';
import pluginPromise from 'eslint-plugin-promise';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

import standard from './eslint-standard-config.js';
import disableStylistic from './eslint-stylistic-config.js';

export default [
	// Plugins' recommended configs
	nodePlugin.configs['flat/recommended'],
	jsdoc.configs['flat/recommended-error'],
	unicorn.configs['flat/recommended'],
	importPlugin.flatConfigs.recommended,
	pluginPromise.configs['flat/recommended'],
	// "Standards"
	...xo,
	standard,
	// Our settings
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.node,
				document: 'readonly',
				navigator: 'readonly',
				window: 'readonly',
			},
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
		// Override rules
		rules: {
			'no-unused-expressions': [
				'error',
				{
					allowShortCircuit: false,
					allowTernary: false,
					allowTaggedTemplates: false,
				},
			],
			// '@cloudfour/prefer-early-return': 'error',
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
					ignorePattern: String.raw`pragma|ignore|prettier-ignore|webpack\w+:|c8|return|const|let|var|await|function|console`,
					ignoreInlineComments: true,
					ignoreConsecutiveComments: true,
				},
			],

			'n/no-unsupported-features/es-syntax': 'off', // Does not account for transpilation
			'n/no-unpublished-require': 'off', // Does not account for "build" scripts
			'n/shebang': 'off', // Tons of false positives
			'n/file-extension-in-import': ['error', 'always'], // Don't allow extension-less relative imports (e.g. use ./foo.js instead of ./foo)

			// Used for sorting/grouping import statements
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
					],
					'newlines-between': 'always',
					alphabetize: { order: 'asc', caseInsensitive: true },
				},
			],
			// Avoid multiple import statements in the same file for the same module
			// prefer-inline means it is preferred to use inline `type` imports combined with non-types
			// instead of separate imports for types and non-types
			// e.g. import { Foo, type Bar } from 'something' is preferred over having separate import statements
			'import/no-duplicates': ['error', { 'prefer-inline': true }],
			// Used for sorting members within an import statement alphabetically
			'sort-imports': ['error', { ignoreDeclarationSort: true }],

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
			// String#replaceAll doesn't quite have enough browser/node support to enable this rule by default.
			// TODO [2025-01-01] Reconsider browser/node support for those two methods
			'unicorn/prefer-string-replace-all': 'off',
			// String#at and Array#at don't quite have enough browser/node support to enable this rule by default.
			// TODO [2025-01-01] Reconsider browser/node support for those two methods
			'unicorn/prefer-at': 'off',
			// This rule suggests incorrect code with the destructured object is modified
			// That is a fairly common case, and it is too annoying to always disable the rule on each line
			'unicorn/consistent-destructuring': 'off',

			// Allow _only_ TODO comments with expirations/conditions
			'no-warning-comments': 'off',
			'unicorn/expiring-todo-comments': [
				'error',
				{ allowWarningComments: false },
			],

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
			'jsdoc/require-returns-check': 'off', // Does not handle @returns with void or undefined
			'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
		},
	},
	// Disable stylistic rules
	disableStylistic,
	eslintConfigPrettier,
];
