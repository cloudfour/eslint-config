# Contributing Guide

## Running @cloudfour/eslint-config on itself

In order to run `npm run lint` on this project, it needs to have a symlink to itself in `node_modules`, so that ESLint can find it. To set up this symlink, run `npm link` and then `npm link @cloudfour/eslint-config`. Then you should be able to run `npm run lint`.

## Release Process

[How to publish an updated version](https://cloudfour.com/thinks/how-to-publish-an-updated-version-of-an-npm-package/)
