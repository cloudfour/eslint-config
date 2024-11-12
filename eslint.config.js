import js from '@eslint/js';
import globals from 'globals';

export default [
	js.configs.recommended,

	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.es2021,
				...globals.node,
				document: false,
				navigator: false,
				window: false,
			},
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'warn',
		},
	},
];
