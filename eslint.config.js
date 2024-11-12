import globals from 'globals';
import pluginNode from 'eslint-plugin-n';

export default [
	// Plugins' recommended configs
	pluginNode.configs['flat/recommended'],
	// "Standards"
	// Overrides
	{
		languageOptions: {
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
	},
];
