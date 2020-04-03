# Fixtures Files

## Purpose

We have collected various JS files from a variety of public open source projects on GitHub.

These files help us ensure that future updates to this ESLint config/plugin do not break existing code that passes linting. When a new rule is created, or when an existing rule is updated, these files will help make us aware of scenarios where the updates do not work as expected.

## What Happens If a Plugin/Config Update Breaks Fixtures?

- If the rule is catching something that is not actually a problem:
  - Reconfigure, disable, or modify the lint rule
- If the rule is catching something that is actually a problem in the fixtures code:
  - Whichever is easiest:
    - [Add `// eslint-disable-next-line some-rule` comments](https://eslint.org/docs/2.13.1/user-guide/configuring#disabling-rules-with-inline-comments)
    - Fix the error manually
    - Delete the code with the lint error. The fixture files don't have to _work_, so sometimes this is the easiest option.

## Finding Projects to Use as Fixtures

- Try to use repos that come from a diverse set of authors or projects rather than a bunch of related projects from the same author
- Try to use repos from different parts of the javascript ecosystem (browser, node, transpiling, etc.)
- Try to use repos that use different parts and versions of javascript syntax

[`awesome-nodejs`](https://github.com/sindresorhus/awesome-nodejs) and [`awesome-javascript`](https://github.com/sorrycc/awesome-javascript) have lists of packages that could be used.

## Adding Fixture Files

1. From the project root, run `npm run load-fixture-repo`
1. Paste in the URL of the git repo to add fixtures from
1. Wait for the repo to be cloned, and scanned for files
1. The importer will suggest files to import based on 3 factors:
   - Maximize number of individual syntax features used in file
   - Maximize number of tokens in file (overall file size)
   - Minimize number of non-auto-fixable lint errors
1. Use the arrow keys and space bar to select files to import
1. `npm run lint` will be run automatically. Fix the lint errors in the newly imported fixture files via whichever is easiest:
   - [Adding `// eslint-disable-next-line some-rule` comments](https://eslint.org/docs/2.13.1/user-guide/configuring#disabling-rules-with-inline-comments)
   - Fixing the error manually
   - Deleting the code with the lint error. The fixture files don't have to _work_, so sometimes this is the easiest option.
