# Contributing Guide

## Release Process

To publish an updated version, follow these steps:

1. Ensure tests pass.
1. Update `CHANGELOG.md` with the new version number and a list of relevant changes.
1. Update the version number in `package.json` and `package-lock.json`.
1. Commit your changes.
1. Push your changes to GitHub.
1. Run `npm publish`
1. Create a GitHub release using your changelog notes.

`npm publish` will handle several release steps, including building the code,
running the linter, publishing to npm, adding a new tag, pushing tags to GitHub.
