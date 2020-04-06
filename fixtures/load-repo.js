#!/usr/bin/env node
const kleur = require('kleur');
const path = require('path');
const { spawn } = require('child_process');
const mkdir = require('mkdirplz');
const rm = require('eliminate');
const walk = require('powerwalker');
const { promisify } = require('util');
const { readFile, writeFile, existsSync } = require('fs');
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const babel = require('@babel/core');
const CLIEngine = require('eslint').CLIEngine;
const prettier = require('prettier');
const prompts = require('prompts');

const fixturesDir = __dirname;
const reposDir = path.join(fixturesDir, 'repos');
const prettierOpts = {
  parser: 'babel',
  ...require('../package.json').prettier,
};

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

/**
 * @param {string} name
 */
const getRepoDir = (name) => path.join(reposDir, name);

/**
 * @param {string} name
 * @param {string} url
 */
const cloneRepo = async (name, url) => {
  console.log(kleur.bold().blue(`Cloning repo: ${name} from ${url}`));
  // Clear out all existing repos
  if (existsSync(reposDir)) await rm(reposDir);
  await mkdir(reposDir);
  await runCommand('git', ['clone', url, getRepoDir(name)]);
  console.log(kleur.bold().blue(`Done cloning repo: ${name}`));
};

const main = async () => {
  const { url } = await prompts({
    name: 'url',
    type: 'text',
    message: 'GitHub Repo URL',
  });
  const name = url.replace(/\.git$/, '').replace(/.*\//, '');
  await cloneRepo(name, url);
  const files = await walk(name, { filesonly: true, cwd: reposDir });

  console.log(kleur.bold().blue('Looking for files to lint'));

  const interestingFiles = await Promise.all(
    files
      .filter((f) => f.endsWith('.js') && !f.replace(name, '').includes('test'))
      .map(async (file) => {
        const contents = await readFileAsync(path.join(reposDir, file), 'utf8');
        return { file, contents };
      })
  );

  const eslint = new CLIEngine({
    configFile: path.join(fixturesDir, '.eslintrc.js'),
    fix: true,
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
      const filenameRelative = path.join(reposDir, file);
      try {
        // Attempts to parse each file with babel
        // Traverses the file and counts up the number of node types and number of nodes
        // Files with more node types tend to be more interesting and better candidates for lint testing
        parsed = await babel.parseAsync(contents, {
          parserOpts: {
            plugins: [
              'jsx',
              'classProperties',
              'dynamicImport',
              'nullishCoalescingOperator',
              'optionalChaining',
            ],
          },
          filenameRelative,
        });
      } catch (error) {
        return invalidResult;
      }

      babel.traverse(parsed, {
        enter(path) {
          numNodes++;
          seenNodeTypes.add(path.type);
        },
      });

      const numNodeTypes = seenNodeTypes.size;

      let eslintReport;
      try {
        eslintReport = eslint.executeOnText(contents).results[0];
      } catch (error) {
        console.log('eslint error', file, error);
        return invalidResult;
      }

      const numLintErrors = eslintReport.errorCount + eslintReport.warningCount;
      const eslintFixedContents = eslintReport.output || contents;

      let prettifiedContents;

      try {
        prettifiedContents = prettier.format(eslintFixedContents, prettierOpts);
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
    }
  );

  const filesWithNumNodeTypes = await Promise.all(
    filesWithNumNodeTypesPromises
  );

  const sortedFiles = filesWithNumNodeTypes
    // Make sure it parsed correctly, has a reasonable number of errors, and is not too short
    .filter(
      (file) => file.score > 0 && file.numLintErrors < 100 && file.loc > 50
    )
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

  await Promise.all(
    chosenFiles.map(async ({ file, contents }) => {
      const outPath = path.join(fixturesDir, file);
      await mkdir(path.dirname(outPath));
      await writeFileAsync(outPath, contents);
    })
  );

  console.log(kleur.bold().blue('Imported files'));

  await runCommand('npm', ['run', 'lint']).catch((error) => {
    console.log(
      '\nRead ./fixtures/README.md to learn how to resolve these lint errors'
    );
    // eslint-disable-next-line no-process-exit
    process.exit(error);
  });
};

main();
