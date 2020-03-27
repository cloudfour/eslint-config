'use strict';

/**
 * Add autogenerated stuff to our docs (`docs/index.md`)
 * @see https://npm.im/markdown-magic
 * @private
 * @module
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const markdownToc = require('markdown-toc');
const stripAnsi = require('strip-ansi');

exports.transforms = {
  /**
   * Takes STDOUT of some command and injects it into the markdown
   */
  usage: (content, options) => {
    const { executable } = options;
    const flag = options.flag || '--help';
    const header = options.header || '\n```text';
    const footer = options.footer || '```\n';
    const output = stripAnsi(
      String(
        execSync(`"${process.execPath}" ${executable} ${flag}`, {
          cwd: path.join(__dirname, '..'),
        })
      ).trim()
    );
    return [header, output, footer].join('\n\n');
  },
  /**
   * We can't use the builtin `TOC` plugin in markdown-magic
   * because it's simply not flexible enough; we can't pad with newlines,
   * nor can we provide a custom filter.  the custom filter would be required
   * since the `TOC` plugin supplies its own which means we can't use the
   * `maxdepth` option, which we need!
   */
  toc: (content, options, config) => {
    const IGNORED_HEADINGS_REGEXP = /features|table of contents/i;
    const toc = markdownToc(config.outputContent, {
      slugify: require('uslug'),
      bullets: options.bullets,
      firsth1: false,
      // If filter is supplied, maxdepth is apparently ignored,
      // so we have to do it ourselves.
      filter: (str, ele) => ele.lvl < 2 && !IGNORED_HEADINGS_REGEXP.test(str),
    }).content;
    return `\n${toc}\n`;
  },
  manifest: require('markdown-magic-package-json'),
  /**
   * Inserts the contents of a file; takes same options as builtin CODE plugin,
   * but does not fetch remote URLs, tries to replace relative paths, and
   * formats in a way our markdown linter likes.
   */
  file: (content, options, config) => {
    let output;
    if (!options.src) {
      return false;
    }

    const fileDir = path.dirname(config.originalPath);
    const filePath = path.join(fileDir, options.src);
    const rootDir = path.join(__dirname, '..');
    const relativeDir = path.relative(path.dirname(filePath), rootDir);

    const syntax = options.syntax || path.extname(filePath).replace(/^./, '');
    try {
      output = fs.readFileSync(filePath, 'utf8', (err, contents) => {
        if (err) {
          console.log(`FILE NOT FOUND: ${filePath}`);
          throw err;
        }

        return contents;
      });
    } catch (error) {
      console.log(`FILE NOT FOUND: ${filePath}`);
      throw error;
    }

    // Replace relative paths in `require()` to root with "mocha".
    // might not work in the general case. not gonna parse an AST for this
    // e.g. `require('../../lib/foo')` => `require('mocha/lib/foo')`
    // also trim any trailing whitespace
    output = output
      .replace(
        new RegExp(`require\\(['"]${relativeDir}(.*?)['"]\\)`, 'g'),
        "require('mocha$1')"
      )
      .trim();

    let header = '';
    if (options.header) {
      header = `\n${options.header}`;
    }

    return `
\`\`\`${syntax}${header}
${output}
\`\`\`
`;
  },
};
