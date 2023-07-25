#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as babelDefault from '@babel/core';
import rm from 'eliminate';
import { ESLint } from 'eslint';
// eslint-disable-next-line @cloudfour/n/file-extension-in-import
import kleur from 'kleur';
import mkdir from 'mkdirplz';
import walk from 'powerwalker';
import { format } from 'prettier';
import prompts from 'prompts';

const fixturesDir = dirname(fileURLToPath(import.meta.url));
const reposDir = join(fixturesDir, 'repos');
const require = createRequire(import.meta.url);
const prettierOpts = {
  parser: 'typescript',
  ...require('../package.json').prettier,
};
const { parseAsync, traverse } = babelDefault.default;

// Make process exit when a promise rejection is not handled
process.on('unhandledRejection', (error) => {
  throw error;
});

/**
 * Wraps child_process.spawn to make it promise-friendly and output to stderr/stdout
 *
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

/**
 * @param {string} name
 */
const getRepoDir = (name) => join(reposDir, name);

/**
 * @param {string} name
 * @param {string} url
 */
const cloneRepo = async (name, url) => {
  console.log(kleur.bold().blue(`Cloning repo: ${name} from ${url}`));
  // Clear out all existing repos
  if (existsSync(reposDir)) await rm(reposDir);
  await mkdir(reposDir);
  await runCommand('git', ['clone', url, getRepoDir(name), '--depth', '1']);
  console.log(kleur.bold().blue(`Done cloning repo: ${name}`));
};

const { url } = await prompts({
  name: 'url',
  type: 'text',
  message: 'GitHub Repo URL',
});
const name = url.replace(/\.git$/, '').replace(/.*\//, '');
await cloneRepo(name, url);
/** @type {string[]} */
const files = await walk(name, { filesonly: true, cwd: reposDir });

console.log(kleur.bold().blue('Looking for files to lint'));

const interestingFiles = await Promise.all(
  files
    .filter(
      (f) =>
        f.match(/.[jt]sx?$/) &&
        !f.endsWith('.d.ts') && // ignore declaration files
        !f.replace(name, '').includes('test'),
    )
    .map(async (file) => {
      const contents = await readFile(join(reposDir, file), 'utf8');
      return { file, contents };
    }),
);

const eslint = new ESLint({
  fix: true,
  overrideConfigFile: join(fixturesDir, '.eslintrc.js'),
  ignore: false,
});

const filesWithNumNodeTypesPromises = interestingFiles.map(
  async ({ file, contents }) => {
    const seenNodeTypes = new Set();
    let numNodes = 0;
    let parsed;
    /**
     * This should be returned if the file is invalid
     * This could happen if there is a parsing error or if it is empty
     * or if it has too many linting errors, etc
     */
    const invalidResult = {
      file,
      contents,
      score: 0,
      numLintErrors: 0,
      numNodeTypes: 0,
      loc: 0,
    };
    const filenameRelative = join(reposDir, file);
    try {
      // Attempts to parse each file with babel
      // Traverses the file and counts up the number of node types and number of nodes
      // Files with more node types tend to be more interesting and better candidates for lint testing
      parsed = await parseAsync(contents, {
        parserOpts: {
          plugins: [
            'typescript',
            'jsx',
            'classProperties',
            'dynamicImport',
            'nullishCoalescingOperator',
            'optionalChaining',
          ],
        },
        filenameRelative,
      });
    } catch {
      return invalidResult;
    }

    traverse(parsed, {
      enter(path) {
        numNodes++;
        seenNodeTypes.add(path.type);
      },
    });

    const numNodeTypes = seenNodeTypes.size;

    let eslintReport;
    try {
      const lintResult = await eslint.lintFiles([
        join(fixturesDir, 'repos', file),
      ]);
      eslintReport = lintResult[0];
    } catch (error) {
      console.log('eslint error', file, error);
      return invalidResult;
    }

    const numLintErrors = eslintReport.errorCount + eslintReport.warningCount;
    const eslintFixedContents = eslintReport.output || contents;

    let prettifiedContents;

    try {
      prettifiedContents = format(eslintFixedContents, prettierOpts);
    } catch (error) {
      console.log('prettier error', file, error);
      return invalidResult;
    }

    // Generates a "score" to a file based on the # of nodes, # of node types
    // Used for sorting
    // Each part of the score has a weighting.
    // NumLintErrors is weighted negatively because files with more lint errors should have a lower score
    // NumNodeTypes is weighted much more strongly compared to numNodes
    // because files tend to have a lot of nodes compared to the number of node types
    const score = numNodeTypes * 10 + numNodes / 1000 - numLintErrors * 30;
    return {
      file,
      contents: prettifiedContents,
      score,
      numLintErrors,
      numNodeTypes,
      loc: contents.split('\n').length,
    };
  },
);

const filesWithNumNodeTypes = await Promise.all(filesWithNumNodeTypesPromises);

const sortedFiles = filesWithNumNodeTypes
  // Make sure it parsed correctly, has a reasonable number of errors, and is not too short
  .filter((file) => file.score > 0 && file.numLintErrors < 100 && file.loc > 50)
  .sort((a, b) => b.score - a.score)
  .slice(0, 50);

const { chosenFiles } = await prompts({
  name: 'chosenFiles',
  type: 'multiselect',
  choices: sortedFiles.map((file) => ({
    title: file.file,
    value: file,
    description: `${file.numLintErrors} lint errors, ${file.loc} loc, ${file.numNodeTypes} node types`,
  })),
  message: 'Choose files to import',
});

if (chosenFiles.length === 0) {
  console.log(kleur.bold().yellow('No files selected for import'));
} else {
  await Promise.all(
    chosenFiles.map(async ({ file, contents }) => {
      const outPath = join(fixturesDir, file);
      await mkdir(dirname(outPath));
      await writeFile(outPath, contents);
    }),
  );

  console.log(kleur.bold().blue('Imported files'));

  await runCommand('npm', ['run', 'lint']).catch((error) => {
    console.log(
      '\nRead ./fixtures/README.md to learn how to resolve these lint errors',
    );
    // eslint-disable-next-line @cloudfour/n/no-process-exit
    process.exit(error);
  });
}
