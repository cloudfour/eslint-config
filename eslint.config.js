import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';
import nodePlugin from 'eslint-plugin-n';
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import xo from 'eslint-config-xo';
import standard from './eslint-standard-config.js';
import disableStylistic from './eslint-stylistic-config.js';
import eslintConfigPrettier from 'eslint-config-prettier';

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
	// Overrides
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
		rules: {},
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
	},
	// Disable stylistic rules
	disableStylistic,
	eslintConfigPrettier,
];
