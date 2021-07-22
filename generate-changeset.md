# Changeset Generator Script

The changeset generator can be run using `node ./generate-changeset.mjs`. It will create a changeset containing the rule changes between the current branch and `main`.

It was created to automate the tedious part of making changesets for this repo: Figuring out which rules changed, which rule changes are actually applicable, and creating/formatting markdown links.

It works by cloning a second copy of the repo on `main`, and running the build both on the current branch, and on `main`, and then diffing the config and rules.
