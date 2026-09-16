import { ESLint } from 'eslint';

import config from '../eslint.config.js';

/**
 * Lints a fixture with our published config.
 *
 * Fixtures go through the real `ESLint` class rather than `Linter` so that
 * `files` patterns, `languageOptions` and the type-aware TypeScript overrides
 * all resolve exactly the way they will for consumers. `overrideConfigFile:
 * true` stops ESLint searching the filesystem for a config, so the array we
 * export is the only thing under test.
 *
 * @param {string} filePath Fixture path, relative to the repo root.
 * @returns {Promise<import('eslint').Linter.LintMessage[]>}
 */
export const lintFixture = async (filePath) => {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config,
	});

	const [result] = await eslint.lintFiles(filePath);
	return result.messages;
};

/**
 * Every rule our config leaves on for a path.
 *
 * `calculateConfigForFile` only matches the path against `files` globs and never
 * reads it, so this can probe file types we keep no fixture for.
 *
 * @param {string} filePath Path to resolve the config for.
 * @returns {Promise<string[]>} Enabled rule names, sorted.
 */
export const enabledRules = async (filePath) => {
	const eslint = new ESLint({
		overrideConfigFile: true,
		overrideConfig: config,
	});

	const { rules = {} } = await eslint.calculateConfigForFile(filePath);

	return Object.entries(rules)
		.filter(([, entry]) => {
			const severity = Array.isArray(entry) ? entry[0] : entry;
			return severity !== 'off' && severity !== 0;
		})
		.map(([name]) => name)
		.toSorted();
};

/**
 * The set of rules a fixture tripped, sorted and de-duplicated.
 *
 * We assert on the set rather than on every individual message because what we
 * care about is which rules are active, not how many times each one happened to
 * fire. That keeps the fixtures editable without making the tests meaningless:
 * adding or losing a rule still fails.
 *
 * @param {import('eslint').Linter.LintMessage[]} messages
 * @returns {string[]}
 */
export const rulesFired = (messages) =>
	[...new Set(messages.map((message) => message.ruleId))].toSorted();

/**
 * Renders messages as `line:column rule` for assertion failure output, so a
 * failing test says what actually fired instead of just "not deep equal".
 *
 * @param {import('eslint').Linter.LintMessage[]} messages
 * @returns {string}
 */
export const format = (messages) =>
	messages
		.map((message) => `${message.line}:${message.column} ${message.ruleId}`)
		.join('\n');
