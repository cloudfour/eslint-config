// @ts-check

import { spawn } from 'node:child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import kleur from 'kleur';
import _writeChangeset from '@changesets/write';
import prompts from 'prompts';
import prettier from 'prettier';

// @ts-expect-error
const writeChangeset = _writeChangeset.default;

/**
 * Wraps child_process.spawn to make it promise-friendly and output to stderr/stdout
 * @param {string} command
 * @param {readonly string[]} args
 * @param {import("child_process").SpawnOptionsWithoutStdio} [opts]
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
const stat = (path) => fs.stat(path).catch(() => /** @type {null} */ (null));

/** @param {string} message */
const log = (message) =>
  console.log(kleur.bold(kleur.green(`\n🌀 ${message}`)));

/** @param {string} dir */
const loadConfig = async (dir) => {
  const configModule = await import(join(dir, 'index.js')).then(
    (m) => m.default
  );
  const allRules = configModule.rules;
  const config = configModule.configs.recommended.rules;
  return [allRules, config];
};

/**
 * @param {string} input
 * @param {string} indenter
 */
const indent = (input, indenter) =>
  indenter + input.split('\n').join(`\n${indenter}`);

const main = async () => {
  const dir = join(process.cwd(), 'tmp-eslint-config');
  if (!(await stat(dir))) {
    log('Cloning second copy of repo...');
    const url = 'https://github.com/cloudfour/eslint-config';
    await runCommand('git', ['clone', url, dir]);
  } else {
    log('Updating second copy of repo to latest main');
    await runCommand('git', ['reset', '--hard', 'HEAD'], { cwd: dir });
    await runCommand('git', ['checkout', 'main'], { cwd: dir });
    await runCommand('git', ['fetch'], { cwd: dir });
    await runCommand('git', ['reset', '--hard', 'origin/main'], { cwd: dir });
  }
  log('Installing/updating dependencies on main');
  await runCommand('npm', ['install'], { cwd: dir });
  log('Building on main');
  await runCommand('npm', ['run', 'build'], { cwd: dir });
  log('Installing/updating dependencies on this branch');
  await runCommand('npm', ['install']);
  log('Building on this branch');
  await runCommand('npm', ['run', 'build']);
  log('Parsing out differences');

  const [mainRules, mainConfig] = await loadConfig(dir);
  const [branchRules, branchConfig] = await loadConfig(process.cwd());

  const prefix = '@cloudfour/';
  /** @param {string} ruleName */
  const removePrefix = (ruleName) =>
    ruleName.startsWith(prefix) ? ruleName.slice(prefix.length) : ruleName;

  /** @param {string} _ruleName */
  const printRuleLink = (_ruleName) => {
    const isBuiltIn = !_ruleName.includes('/');
    const ruleName = removePrefix(_ruleName);
    const fullName = isBuiltIn ? ruleName : `@cloudfour/${ruleName}`;
    const rule = branchRules[ruleName] || mainRules[ruleName];
    const url = isBuiltIn
      ? `https://eslint.org/docs/rules/${fullName}`
      : rule?.meta?.docs?.url;
    return url ? `[\`${fullName}\`](${url})` : `\`${fullName}\``;
  };

  /** @param {string} ruleName */
  const printRuleForCLI = (ruleName) => {
    const isBuiltIn = !ruleName.includes('/');
    return isBuiltIn ? ruleName : `@cloudfour/${ruleName}`;
  };

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
`
    );
  };

  let output = '';

  const newRules = Object.keys(branchRules).filter(
    (rule) => !(rule in mainRules)
  );
  printRuleList(newRules, 'New Rules');

  const deletedRules = Object.keys(mainRules).filter(
    (rule) => !(rule in branchRules)
  );
  printRuleList(deletedRules, 'Deleted Rules');

  const isEnabled = (rule) =>
    Array.isArray(rule) ? isEnabled(rule[0]) : rule === 'error' || rule === 2;

  const newlyEnabledRules = Object.entries(branchConfig)
    .filter(
      ([ruleName, value]) =>
        isEnabled(value) && !isEnabled(mainConfig[ruleName])
    )
    .map(([ruleName]) => ruleName);
  printRuleList(newlyEnabledRules, 'Newly Enabled Rules');

  const newlyDisabledRules = Object.entries(mainConfig)
    .filter(
      ([ruleName, value]) =>
        isEnabled(value) && !isEnabled(branchConfig[ruleName])
    )
    .map(([ruleName]) => ruleName);
  printRuleList(newlyDisabledRules, 'Newly Disabled Rules');

  const printRuleConfig = (rule) => JSON.stringify(rule, null, 2);

  let hasOutputReconfiguredRules = false;
  for (const ruleName in branchConfig) {
    const branchConfigPrinted = printRuleConfig(branchConfig[ruleName]);
    const mainConfigPrinted = printRuleConfig(mainConfig[ruleName]);
    if (
      branchConfigPrinted !== mainConfigPrinted &&
      // Make sure that the enabled status did not change
      isEnabled(branchConfig[ruleName]) === isEnabled(mainConfig[ruleName])
    ) {
      if (!hasOutputReconfiguredRules) {
        output += '\n**Reconfigured Rules**\n';
        console.log(`${kleur.blue(kleur.bold('Reconfigured Rules'))}`);
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
    { onCancel: () => process.exit(1) }
  );

  output = `${summary}\n${output}`;

  const changeset = {
    summary: prettier.format(output, { parser: 'markdown' }),
    releases: [{ name: pkgName, type: versionBump }],
  };

  const uniqueId = await writeChangeset(changeset, process.cwd());
  log(`Wrote changeset to ${join('.changeset', `${uniqueId}.md`)}`);
};

main();
