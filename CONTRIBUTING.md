# Contributing Guide

## Pull Requests

If you are submitting a pull request that includes changes that will affect places where this ESLint config is installed, add a Changeset file to describe the outward-facing changes:

- On your feature branch, run `npx changeset`.

  - First it will ask you what [kind of change it is](https://semver.org/#summary):

    - **Major changes** include
      - Enabling rules
      - Removing rules
      - Bugfixes to rules that are likely to error on more code than before
      - Removing support for Node or ESLint or TypeScript versions
    - **Minor changes** include
      - Creating rules that are not enabled by default
      - Adding support for Node or ESLint or TypeScript versions
      - Bugfixes to rules that are not likely to error on more code than before
    - **Patch releases** include
      - Bugfixes/refactorings that will not change the functionality

    Dependency updates can fall into any of the three categories, consider how the dependency change will affect consumers of this ESLint config.

  - Next it will ask you to describe your changes. This message will appear in the Changelog. You can press enter before you type anything to edit the message in your editor.

## Releasing

- [Changesets Action](https://github.com/changesets/action) will create and maintain release PR's whenever changes are pushed to master. Merge the "Publish Next Version" PR to release all unreleased changes on `master`. All of the changes will get combined into a single release. Changesets will handle updating the changelog, pushing git tags, and publishing to npm.
