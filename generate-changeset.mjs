// @ts-check

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';

import _writeChangeset from '@changesets/write';
import kleur from 'kleur';
import prettier from 'prettier';
import prompts from 'prompts';

// @ts-expect-error
const writeChangeset = _writeChangeset.default;

/**
 * Wraps child_process.spawn to make it promise-friendly and output to stderr/stdout
 *
 * @param {string} command
 * @param {readonly string[]} args
 * @param {import("child_process").SpawnOptionsWithoutStdio} [opts]
 * @returns {Promise<void>}
 */
const runCommand = (command, args, opts) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...opts,
      stdio: [process.stdin, process.stdout, process.stderr],
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(code);
    });
  });

/** @param {string} path */
const stat = (path) => fs.stat(path).catch(() => null);

/** @param {string} message */
const log = (message) =>
  console.log(kleur.bold(kleur.green(`\n🌀 ${message}`)));

/**
 * @param {string} dir
 * @returns {Promise<import('eslint').ESLint.Plugin>}
 */
const loadConfig = async (dir) => {
  const configModule = await import(join(dir, 'index.js')).then(
    (m) => m.default,
  );
  return configModule;
};

/**
 * @param {string} input
 * @param {string} indenter
 */
const indent = (input, indenter) =>
  indenter + input.split('\n').join(`\n${indenter}`);

const prefix = '@cloudfour/';

/** @param {string} ruleName */
const removePrefix = (ruleName) =>
  ruleName.startsWith(prefix) ? ruleName.slice(prefix.length) : ruleName;

/** @param {string} ruleName */
const printRuleForCLI = (ruleName) => {
  const isBuiltIn = !ruleName.includes('/');
  ruleName = removePrefix(ruleName);
  return isBuiltIn ? ruleName : prefix + ruleName;
};

const printRuleConfig = (rule) => JSON.stringify(rule, null, 2);

const dir = join(process.cwd(), 'tmp-eslint-config');
// if (await stat(dir)) {
//   log('Updating second copy of repo to latest main');
//   await runCommand('git', ['reset', '--hard', 'HEAD'], { cwd: dir });
//   await runCommand('git', ['checkout', 'main'], { cwd: dir });
//   await runCommand('git', ['fetch'], { cwd: dir });
//   await runCommand('git', ['reset', '--hard', 'origin/main'], { cwd: dir });
// } else {
//   log('Cloning second copy of repo...');
//   const url = 'https://github.com/cloudfour/eslint-config';
//   await runCommand('git', ['clone', url, dir]);
// }
// log('Updating this branch to be up to date with main');
// await runCommand('git', ['fetch']);
// await runCommand('git', ['merge', 'origin/main']);
// log('Installing/updating dependencies on main');
// await runCommand('npm', ['install'], { cwd: dir });
// log('Building on main');
// await runCommand('npm', ['run', 'build'], { cwd: dir });
// log('Installing/updating dependencies on this branch');
// await runCommand('npm', ['install']);
// log('Building on this branch');
// await runCommand('npm', ['run', 'build']);
log('Parsing out differences');

const mainConf = await loadConfig(dir);
const branchConf = await loadConfig(process.cwd());

const mainRules = mainConf.rules || {};
const branchRules = mainConf.rules || {};

/** @param {string} _ruleName */
const printRuleLink = (_ruleName) => {
  const isBuiltIn = !_ruleName.includes('/');
  const ruleName = removePrefix(_ruleName);
  const fullName = isBuiltIn ? ruleName : prefix + ruleName;
  const rule = branchRules?.[ruleName] || mainRules?.[ruleName];
  const url = isBuiltIn
    ? `https://eslint.org/docs/rules/${fullName}`
    : typeof rule === 'object' && rule?.meta?.docs?.url;
  return url ? `[\`${fullName}\`](${url})` : `\`${fullName}\``;
};

let output = '';

/**
 * @param {string[]} rules
 * @param {string} groupName
 */
const printRuleList = (rules, groupName) => {
  if (rules.length === 0) return;
  output += `
**${groupName}**
${rules.map((r) => `- ${printRuleLink(r)}`).join('\n')}
`;

  console.log(
    `${kleur.blue(kleur.bold(groupName))}
${rules.map((r) => printRuleForCLI(r)).join('\n')}
`,
  );
};

const newRules = Object.keys(branchRules).filter(
  (rule) => !(rule in mainRules),
);
printRuleList(newRules, 'New Rules');

const deletedRules = Object.keys(mainRules).filter(
  (rule) => !(rule in branchRules),
);
printRuleList(deletedRules, 'Deleted Rules');

const isEnabled = (rule) =>
  rule !== undefined &&
  (Array.isArray(rule)
    ? isEnabled(rule[0])
    : rule === 'error' || rule === 2 || rule === 'warn' || rule === 1);

/** @type {{
 * name: string,
 * get: (config: import('eslint').ESLint.Plugin) => Partial<import('eslint').Linter.RulesRecord> | undefined}[]
 * } */
const scopes = [
  {
    name: '`recommended` Config',
    get: (config) => config.configs?.recommended?.rules,
  },
  {
    name: '`recommended` Config » TS Overrides',
    get: (config) => config.configs?.recommended?.overrides?.[0].rules,
  },
  {
    name: '`disable-type-checked` Config',
    get: (config) => config.configs?.['disable-type-checked']?.rules,
  },
];

for (const scope of scopes) {
  const branchScopeRules = scope.get(branchConf) || {};
  const mainScopeRules = scope.get(mainConf) || {};
  const newlyEnabledRules = Object.entries(branchScopeRules)
    .filter(
      ([ruleName, value]) =>
        isEnabled(value) && !isEnabled(mainScopeRules[ruleName]),
    )
    .map(([ruleName]) => ruleName);
  printRuleList(newlyEnabledRules, `Newly Enabled Rules (${scope.name})`);

  const newlyDisabledRules = Object.entries(mainScopeRules)
    .filter(
      ([ruleName, value]) =>
        isEnabled(value) && !isEnabled(branchScopeRules[ruleName]),
    )
    .map(([ruleName]) => ruleName);
  printRuleList(newlyDisabledRules, `Newly Disabled Rules (${scope.name})`);

  let hasOutputReconfiguredRules = false;
  for (const ruleName of Object.keys(branchScopeRules)) {
    const branchConfigPrinted = printRuleConfig(branchScopeRules[ruleName]);
    const mainConfigPrinted = printRuleConfig(mainScopeRules[ruleName]);
    if (
      branchConfigPrinted !== mainConfigPrinted &&
      // Make sure that it is enabled on both branches
      isEnabled(branchScopeRules[ruleName]) &&
      isEnabled(mainScopeRules[ruleName])
    ) {
      if (!hasOutputReconfiguredRules) {
        output += `\n**Reconfigured Rules (${scope.name})**\n`;
        console.log(
          `${kleur.blue(kleur.bold(`Reconfigured Rules (${scope.name})`))}`,
        );
        hasOutputReconfiguredRules = true;
      }
      console.log(printRuleForCLI(ruleName));
      console.log(kleur.red(indent(mainConfigPrinted, '- ')));
      console.log(kleur.green(indent(branchConfigPrinted, '+ ')));

      output += `
- ${printRuleLink(ruleName)}
  \`\`\`diff
${indent(mainConfigPrinted, '  - ')}
${indent(branchConfigPrinted, '  + ')}
  \`\`\``;
    }
  }
}

const pkgName = '@cloudfour/eslint-plugin';

const { versionBump, summary } = await prompts(
  [
    {
      name: 'versionBump',
      type: 'select',
      choices: [
        { title: 'patch', value: 'patch' },
        { title: 'minor', value: 'minor' },
        { title: 'major', value: 'major' },
      ],
      message: `What kind of change is this for ${kleur.green(pkgName)}?`,
    },
    {
      name: 'summary',
      type: 'text',
      message: 'Summary',
    },
  ],
  // eslint-disable-next-line @cloudfour/n/no-process-exit, @cloudfour/unicorn/no-process-exit
  { onCancel: () => process.exit(1) },
);

output = `${summary}\n${output}`;

const changeset = {
  summary: await prettier.format(output, { parser: 'markdown' }),
  releases: [{ name: pkgName, type: versionBump }],
};

const uniqueId = await writeChangeset(changeset, process.cwd());
log(`Wrote changeset to ${join('.changeset', `${uniqueId}.md`)}`);
