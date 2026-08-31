import configXO, {
	frameworkExtensions,
	htmlExtensions,
	jsExtensions,
	tsExtensions,
	tsFilesGlob,
} from 'eslint-config-xo';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';

// XO scopes its layers to the file types it lints, and registers plugins on
// those layers. Our overrides have to be scoped the same way, otherwise they
// apply to files (`.json`, `.md`, `.css`) where those plugins were never
// registered and ESLint fails with "could not find plugin". Derived from xo's
// own exports so the two stay in step.
const codeFilesGlob = `**/*.{${[...jsExtensions, ...frameworkExtensions, ...tsExtensions].join(',')}}`;
// One glob per extension rather than a `{…}` group: xo currently lists a single
// HTML extension, and a brace group with one option is not expanded by the glob
// matcher, so `**/*.{html}` would match nothing.
const htmlFilesGlobs = htmlExtensions.map((extension) => `**/*.${extension}`);

// Xo applies its `package-json` rules to every `**/package.json`, but the rules
// describe a root manifest. Packages that ship a dual CommonJS/ESM build also
// ship marker files whose entire content is `{"type": "commonjs"}` or
// `{"type": "module"}`, and those collect demands for `name`, `version`,
// `license`, `keywords` and an entry point that they will never have. Worse,
// `prefer-type-module` tells a `{"type": "commonjs"}` marker to become
// `"module"`, and following that breaks the CommonJS half of the package.
// Scoping the layer to the root manifest matches what the rules are about.
const xoLayers = configXO({ prettier: 'compat' }).map((layer) =>
	layer.name === 'xo/package-json'
		? { ...layer, files: ['package.json'] }
		: layer,
);

const config = [
	// eslint-config-xo bundles and configures eslint-plugin-unicorn,
	// eslint-plugin-jsdoc, eslint-plugin-n, typescript-eslint, eslint-plugin-regexp
	// and eslint-plugin-import-x, so we no longer depend on those directly. Its rule
	// namespaces are used as-is, including `import-x` rather than `import`.
	// `prettier: 'compat'` disables the stylistic rules that would fight Prettier,
	// which is what we previously used eslint-config-prettier for.
	...xoLayers,

	// Our settings
	{
		files: [codeFilesGlob],
		languageOptions: {
			// `ecmaVersion` is deliberately not set: xo already uses `latest`, and
			// pinning it lower here made `require-unicode-regexp` unsatisfiable,
			// because the `v` flag it asks for is newer than the syntax we allowed.
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.es2026,
				...globals.node,
				document: 'readonly',
				navigator: 'readonly',
				window: 'readonly',
			},
		},
		plugins: {
			promise: pluginPromise,
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
		// Override rules from recommended configs
		rules: {
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
			'no-var': 'error',
			'object-shorthand': 'error',
			'prefer-destructuring': ['error', { array: false }],
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
			'n/file-extension-in-import': ['error', 'always'], // Don't allow extension-less relative imports (e.g. use ./foo.js instead of ./foo)

			// Used for sorting/grouping import statements
			'import-x/order': [
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
			'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
			// Used for sorting members within an import statement alphabetically
			'sort-imports': ['error', { ignoreDeclarationSort: true }],

			'unicorn/import-style': 'off', // It doesn't seem useful to force people to use named, default, or namespace imports
			'unicorn/name-replacements': 'off', // Causes more issues than it's worth
			// Null is ok, even though Sindre Sorhus doesn't like it
			// It is ok to avoid using null and use undefined instead
			// but enforcing it in all code via a lint rule is too annoying
			'unicorn/no-null': 'off',
			// XO bans `null` as a *type* as well, via a different rule. That is the
			// same opinion as `unicorn/no-null` above, so it gets the same answer:
			// we keep xo's other restrictions and drop the one on null.
			'@typescript-eslint/no-restricted-types': [
				'error',
				{
					types: {
						object: {
							message:
								'The `object` type is hard to use. Use `Record<string, unknown>` instead.',
							fixWith: 'Record<string, unknown>',
						},
						Buffer: {
							message: 'Use Uint8Array instead.',
							fixWith: 'Uint8Array',
						},
					},
				},
			],
			// Enforces naming styles on types, properties and variables. It has no
			// way to know which names are ours and which come from someone else's
			// contract, so it flags things like `Authorization` headers, `utm_source`
			// query parameters and generated GraphQL types.
			'@typescript-eslint/naming-convention': 'off',
			// This rule is meant to avoid the edge case of breaking changes occuring
			// due to the `index` parameter being passed unexpectedly into the callback function,
			// causing unexpected behavior if the callback expects something that is not the index
			// But this is an edge case that can be avoided through careful manual review
			// and sometimes through TS
			'unicorn/no-array-callback-reference': 'off',
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
			// As of v73 this rule checks directory names too, and `__tests__`,
			// `__mocks__` and `__snapshots__` are established conventions that
			// aren't going to be renamed to satisfy a case rule
			'unicorn/filename-case': ['error', { ignore: [/^__\w+__$/v] }],
			// Requires booleans to be named `isFoo`, `hasFoo`, `shouldFoo` and so on.
			// Like `name-replacements`, this is a naming opinion that causes more
			// churn than it prevents bugs. Left to human reviewers.
			'unicorn/consistent-boolean-name': 'off',
			// Requires anything named with a verb prefix (`setFoo`, `getFoo`) to be a
			// function, so a variable holding a callback gets reported. Same family of
			// naming opinion as `consistent-boolean-name` and `name-replacements`
			// above, and it gets the same answer.
			'unicorn/no-non-function-verb-prefix': 'off',
			// Wants single-line `/** @type {…} */` JSDoc expanded to multiple lines.
			// That is a standard, Prettier-stable way to write a one-line annotation.
			'unicorn/single-line-block-comment-style': 'off',
			// Without type information this rule can't tell a string array (where the
			// default sort is correct) from a number array (where it isn't), so it
			// mostly reports false positives. The type-aware typescript-eslint
			// version is enabled for TS files below, where it can tell the difference.
			'unicorn/require-array-sort-compare': 'off',
			// Replaces the custom `@cloudfour/prefer-early-return` rule we used to
			// ship. `maximumStatements` is set to 2 to match what that rule enforced;
			// the upstream default of 1 would report more cases than it used to.
			'unicorn/prefer-early-return': ['error', { maximumStatements: 2 }],

			// Xo sets this to 'never', which wants JSDoc written without the leading
			// asterisk on continuation lines. That is not how JSDoc is conventionally
			// written and not what most editors and formatters produce.
			'jsdoc/require-asterisk-prefix': ['error', 'always'],

			// A tag's description runs until the next tag, and leading whitespace on
			// its continuation lines is stripped before the block is parsed, so
			// indenting them changes nothing about the parsed output. It only makes it
			// easier to see where one `@param` ends and the next begins. Between them
			// these two rules forbade that indentation and `--fix` silently flattened
			// it, so allow it instead. `allowIndentedSections` still reports the cases
			// that signal a real mistake, such as an indented tag line, and
			// `disableWrapIndent` permits either style rather than mandating one.
			'jsdoc/check-indentation': ['error', { allowIndentedSections: true }],
			'jsdoc/check-line-alignment': [
				'error',
				'never',
				{ disableWrapIndent: true },
			],

			// What is left of eslint-config-standard. We used to vendor a copy of it,
			// but xo already enables 95 of the 106 rules that copy contributed, and
			// most of the rest were formatting rules Prettier turns back off. These
			// are the ones nothing else covers.
			'no-empty-character-class': 'error',
			'no-invalid-regexp': 'error',
			'no-useless-backreference': 'error',
			'n/handle-callback-err': ['error', '^(err|error)$'],
			'n/no-callback-literal': 'error',
			'n/no-exports-assign': 'error',
			'promise/param-names': 'error',

			// Disabling rules about TODO comments. In practice, these were usually disabled.
			'no-warning-comments': 'off',
			'unicorn/expiring-todo-comments': 'off',

			// Disabling jsdoc rules that check the types themselves
			// If you want to have type checking on a project, use typescript instead
			'jsdoc/no-undefined-types': 'off',
			'jsdoc/valid-types': 'off',
			'jsdoc/require-returns': 'off',
			'jsdoc/require-param-description': 'off',
			'jsdoc/require-property-description': 'off',
			'jsdoc/require-returns-description': 'off',
			'jsdoc/require-jsdoc': 'off',
			'jsdoc/require-returns-check': 'off', // Does not handle @returns with void or undefined
			'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],

			// A few stylistic rules that aren't currently disabled by eslint-config-prettier
			'@stylistic/jsx-curly-brace-presence': 'off',
			'@stylistic/jsx-pascal-case': 'off',
			'@stylistic/lines-between-class-members': 'off',
			'@stylistic/padding-line-between-statements': 'off',
			'@stylistic/spaced-comment': 'off',
		},
	},

	// Override rules for TS files only. xo's `xo/typescript` layer already scopes
	// typescript-eslint to these files and turns on `projectService`, so we only
	// need our own adjustments here.
	{
		files: [tsFilesGlob],
		rules: {
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
			// Superseded by `unicorn/no-unnecessary-boolean-comparison`, which catches
			// the same cases without needing `strictNullChecks` and also covers JS.
			// Leaving both on reports the same problem twice.
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
			// The unicorn version is disabled above because it can't see types. This
			// one can, so it only reports arrays where the default sort is actually wrong.
			'@typescript-eslint/require-array-sort-compare': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error', // More readable syntax
			'no-unused-vars': 'off', // TS checks this via noUnusedLocals / noUnusedParameters
			'@typescript-eslint/no-unused-vars': 'off', // TS checks this via noUnusedLocals / noUnusedParameters
			'@typescript-eslint/no-empty-function': 'off', // Non-TS version of rule is not used either
			'@typescript-eslint/unbound-method': 'off', // It is pretty common for this already being handled outside of what TS/ESLint can be aware of
			'@typescript-eslint/no-import-type-side-effects': 'error',
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
		},
	},

	// Xo lints HTML, which it did not before v26.
	{
		files: htmlFilesGlobs,
		rules: {
			// Requires og:title, og:type, og:url and og:image on every HTML file in the
			// project. Demo pages, test fixtures, component examples and email
			// templates all match, and none of them are ever shared as a link. Which
			// pages get Open Graph tags, and what those tags say, is a per-page content
			// decision rather than something a linter can check. Not part of
			// html-eslint's own recommended set either; xo adds it.
			'@html-eslint/require-open-graph-protocol': 'off',
			// Same reasoning, less strongly. A meta description is worth writing for a
			// page with an audience, but it is content rather than correctness, and
			// requiring one on every HTML file in the repo is not the way to get it.
			'@html-eslint/require-meta-description': 'off',
		},
	},

	// Xo lints package.json, which is useful. Note that its layer is scoped to the
	// root manifest above, so these apply there too.
	{
		files: ['package.json'],
		rules: {
			// We pin exact versions here and Renovate is configured to keep doing so.
			// Whether to pin or use ranges is a project decision, not a lint error.
			// Unlike most package.json rules this one fires on every project, including
			// applications that never publish anything.
			'package-json/dependency-version-range': 'off',
			// Adding `exports` changes what a published package lets consumers reach:
			// deep imports that used to resolve start throwing
			// `ERR_PACKAGE_PATH_NOT_EXPORTED`. It is worth doing, but it belongs in a
			// deliberate major release rather than arriving as a lint error, and it is
			// meaningless for the applications that never publish at all.
			'package-json/prefer-exports': 'off',
			// `"type": "module"` breaks every consumer using `require()`. Same
			// reasoning as `prefer-exports`: a real decision about the package's
			// interface, not lint cleanup.
			'package-json/prefer-type-module': 'off',
			// Fair for packages that run in Node, but we publish browser libraries that
			// have no Node runtime to describe, and inventing a range to satisfy the
			// rule makes `engines` less trustworthy where it does matter.
			'package-json/require-engines': 'off',
		},
	},

	// Lockfiles are generated. npm uses an empty string as the key for the root
	// package, so every package-lock.json trips `json/no-empty-keys`.
	{
		files: ['**/package-lock.json'],
		rules: { 'json/no-empty-keys': 'off' },
	},
];

export default config;
