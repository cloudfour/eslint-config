# Contributing Guide

## Tests

```sh
npm test          # run once
npm run test:watch
```

The suite uses [`node --test`](https://nodejs.org/api/test.html), so there is no
test framework to install. It covers five things:

- **Fixture behaviour** (`__tests__/javascript.test.js`, `__tests__/typescript.test.js`)
  lints `__tests__/fixtures/` with our config and asserts the exact set of rules
  that fire. The `valid` fixtures are the interesting half: everything in them is
  something we deliberately allow, so they fail if a dependency re-enables a rule
  we turned off.
- **Declared support ranges** (`__tests__/engines.test.js`,
  `__tests__/peer-dependencies.test.js`) assert that every Node version we
  advertise in `engines.node`, and every ESLint version we accept in
  `peerDependencies`, is one that each installed dependency also supports.
- **Prettier conflicts** (`__tests__/prettier-conflicts.test.js`) runs the
  `eslint-config-prettier` CLI, which reports any enabled rule that fights
  Prettier.
- **Deprecations** (`__tests__/deprecated-rules.test.js`) fails when a dependency
  bump deprecates a rule we still enable.
- **Rule inventory** (`__tests__/rule-inventory.test.js`) compares every rule the
  config leaves on, with its options, against a committed snapshot. See
  [Reviewing a major dependency bump](#reviewing-a-major-dependency-bump).

When a dependency bump changes which rules fire, that is a real behaviour change
for consumers: update the fixtures and record it in `CHANGELOG.md`.

Locally the suite only ever runs against the ESLint version in the lockfile. CI
also runs it against the oldest ESLint our `peerDependencies` range allows,
which is where a bump that quietly raises our real floor shows up. To reproduce
that run:

```sh
npm install --no-save eslint@$(node --print "require('semver').minVersion(require('./package.json').peerDependencies.eslint).version")
npm test
npm ci   # restore the lockfile version
```

Fixtures are excluded from ESLint and Prettier so that autofixing can never
silently change what they test.

## Reviewing a major dependency bump

Almost all of what we ship is someone else's rules, so a Renovate PR bumping
`eslint-config-xo` is not really a dependency update — it is a change to the
config we publish, arriving with no description of what it changed. **A green CI
run does not mean the bump is behaviour-neutral.** The fixture tests assert the
rules that fire on `__tests__/fixtures/`, which only covers rules we turn on or
reconfigure ourselves. A rule a dependency newly enables fires nowhere in the
fixtures, so the suite stays green while consumers gain new errors.

There are three questions to answer, and they need different tools.

### 1. Which rules changed?

```sh
npm test    # the rule inventory fails if anything changed
```

`__tests__/rule-inventory.snapshot.txt` lists every rule the config leaves on,
with its options, for a JavaScript, TypeScript, HTML and `package.json` file. The
test fails when that set changes and names the rules that moved. Regenerate it
with:

```sh
UPDATE_RULE_INVENTORY=1 npm test
```

Review the resulting diff before committing it — that diff _is_ the behaviour
change, and it belongs in `CHANGELOG.md`. Committing the regenerated snapshot in
the same PR puts the change in front of a reviewer instead of leaving it to be
discovered downstream. The snapshot deliberately records options as well as rule
names, because a bump that retunes an existing rule breaks consumers just as
happily as one that adds a rule.

Resolved options include the defaults ESLint injects from each core rule's
`meta.defaultOptions`, and those change between ESLint releases. So under
`validate-oldest-eslint`, which swaps ESLint out deliberately, the test compares
only which rules are enabled and leaves their options alone — otherwise it would
report ESLint's own churn as if it were ours.

### 2. What does it do to real code?

The inventory cannot see a rule that kept its configuration but changed what it
reports — upstream bug fixes and broadened checks both look identical from the
config's point of view. The only way to find those is to lint a real codebase.

Pick a project of ours that uses this config and has enough code to be
representative, and lint it read-only: point ESLint at a throwaway config that
imports this repo's `eslint.config.js` by absolute path, pass
`--no-config-lookup` so the project's own config is ignored, and override
`parserOptions.tsconfigRootDir` to that project so type-aware rules resolve.
Never modify the project you are measuring against.

Count reports per rule before and after, and compare those counts rather than
eyeballing totals. The project's own overrides are not applied by this method, so
the absolute number is meaningless — the _delta_ is the number worth quoting.

### 3. Does it still support what we claim to?

`engines.test.js` and `peer-dependencies.test.js` cover this, and CI runs the
suite against the oldest ESLint our `peerDependencies` range allows. That job is
what catches a bump quietly raising our real floor, so do not dismiss it as
redundant with the main run.

### When to add a test

Not every bump needs one. Add a fixture case when **we** make a decision worth
protecting: turning a rule off, reconfiguring it, or deliberately accepting
something a dependency now flags. Those belong in `__tests__/fixtures/` because
a later bump could silently undo them.

Do not add a fixture case for a rule that simply arrives from a dependency
untouched. `invalid.js` asserts it flags "exactly the rules we turn on or
reconfigure", and padding it with upstream rules makes that claim mean less. The
inventory snapshot already covers those.

### Choosing the version number

A new rule at error severity can break a consumer's build, so it is a major
release even when the diff is one line. Turning a rule off, or widening what one
accepts, is a minor. Record the reasoning in `CHANGELOG.md`, including the
measured effect on a real project — "roughly 250 new reports across 64
TypeScript files" tells a reader far more than the number of rules involved.

## Writing a rule entry

Almost everything we publish is xo's. `eslint.config.js` is a list of deviations
from it, which makes the reason for each deviation the most valuable thing in the
file — and the easiest to lose. Reconstructing why two rules were turned off in
2020 (#718) took four commits, a closed issue whose body was a bare URL, and a
review thread where nobody felt able to evaluate the rules.

An entry should answer three things.

**What is it, relative to xo?** Overriding a rule xo enables, retuning xo's
options, adding a rule xo does not have, or restating a value xo already sets.
This is the one that is never recorded and matters most, because it is what tells
a reviewer whether they are looking at a decision or a leftover.

**Why?** Not what the rule does — its own docs cover that. Why _we_ disagree with
the upstream default. Where the decision was measured, cite the number and the
project, the way changelog entries are already expected to.

**What would change our mind?** Where a decision rests on something that can
shift — a rule being buggy, a Prettier conflict, a pattern in our code — say so,
so a later reader knows to re-test it rather than treating it as permanent.

```js
// xo: error with `never`, which bans naming a function expression. Off here
// since the original 2018 config, with no reason recorded anywhere.
'func-names': 'off',

// Not in xo. Added in 90cb908 (2018); no reason recorded
'prefer-template': 'error',
```

"No reason recorded" is a useful comment. It tells the next reader not to assume
there is hidden wisdom behind the line.

Cite issues and commits rather than people. The number stays accurate and keeps
pointing at the reasoning; a name rots faster and reads as blame.

### Checking whether an entry still does anything

An entry that resolves to exactly xo's value changes nothing about what we
publish. To find those, diff the resolved config against xo's:

```sh
# ours
npx eslint --print-config probe.ts > ours.json

# xo's, from a temporary config file in the repo root containing:
#   import configXO from 'eslint-config-xo';
#   export default configXO({ prettier: 'compat' });
npx eslint --no-config-lookup -c xo-only.config.js --print-config probe.ts > xo.json
```

Compare per rule, and do it for a `.js`, `.ts`, `.html`, `package.json` and
`package-lock.json` path separately — a rule set in one layer and re-set in a
narrower one is misattributed otherwise.

Do this rather than writing "same as xo" in a comment. Such a marker is a claim
about a moving target: the moment xo changes, it is wrong and nothing checks it.
The diff above stays correct as both sides move, and the rule inventory already
does the pinning job for every rule rather than only the ones someone thought to
restate.

Deleting an entry proven inert is safe by definition, and the inventory snapshot
is the proof — it must come back unchanged. What it does change is the future: a
rule we no longer name is one we would inherit if xo's position on it moved. Keep
the entry when the comment records a position we would re-assert in that case,
and drop it when we are only agreeing with xo out loud.

## Release Process

[How to publish an updated version](https://cloudfour.com/thinks/how-to-publish-an-updated-version-of-an-npm-package/)
