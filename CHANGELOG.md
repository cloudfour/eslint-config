# @cloudfour/eslint-plugin

## 15.0.1

### Patch Changes

- [`e14e2ba`](https://github.com/cloudfour/eslint-config/commit/e14e2baf3215a07007ff710bd7a414edb4def692) [#193](https://github.com/cloudfour/eslint-config/pull/193) Thanks [@calebeby](https://github.com/calebeby)! - Fix published files so `@cloudfour/prefer-early-return` is included

## 15.0.0

### Major Changes

- [`2d8f332`](https://github.com/cloudfour/eslint-config/commit/2d8f3320896e156e06720774e09fb82275443bdf) [#171](https://github.com/cloudfour/eslint-config/pull/171) Thanks [@calebeby](https://github.com/calebeby)! - Add `@cloudfour/prefer-early-return` rule (enabled by default)

  This rule suggests to change code like this:

  ```js
  function a() {
    if (_) {
      a();
      b();
      c();
    }
  }
  ```

  into:

  ```js
  function a() {
    if (!_) return;
    a();
    b();
    c();
  }
  ```

### Minor Changes

- [`f4e2715`](https://github.com/cloudfour/eslint-config/commit/f4e2715df26dfc5cb57b14cf32263b78bd65e9ea) [#164](https://github.com/cloudfour/eslint-config/pull/164) Thanks [@renovate](https://github.com/apps/renovate)! - Update [`eslint-plugin-unicorn` to v22](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/v22.0.0)

  The new [`unicorn/import-style`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v22.0.0/docs/rules/import-style.md) rule is disabled by default, so this is not a breaking change.

## 14.0.0

### Major Changes

- [`43b7918`](https://github.com/cloudfour/eslint-config/commit/43b7918e529bca4ecfecdc1c252430685518f3b1) [#155](https://github.com/cloudfour/eslint-config/pull/155) Thanks [@renovate](https://github.com/apps/renovate)! - Update typescript-eslint to v4

  - [Require `@ts-expect-error` comments to have a description explaining why](https://github.com/typescript-eslint/typescript-eslint/pull/2351)
  - [New scope analyzer](https://github.com/typescript-eslint/typescript-eslint/pull/2039). This is mostly bugfixes, but it is possible that it could cause rules to (correctly) trigger on code that they didn't before.
  - Enabled the new [`@typescript-eslint/consistent-type-imports`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-imports.md) rule, which will auto-fix type imports to use the new [`import type` syntax](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)
  - Enabled [`@typescript-eslint/no-unnecessary-condition`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-condition.md) and [`@typescript-eslint/no-unnecessary-boolean-literal-compare`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unnecessary-boolean-literal-compare.md). If either of these rules trigger on your code, then that means that either your types are incorrect (likely missing `| null` or `| undefined`), or the condition is not necessary (meaning it either always runs or never runs).

### Minor Changes

- [`1c5f202`](https://github.com/cloudfour/eslint-config/commit/1c5f202bcfc476ac9ca2e10b75f15e14ab0f7d0e) [#160](https://github.com/cloudfour/eslint-config/pull/160) Thanks [@calebeby](https://github.com/calebeby)! - Disable `node/no-missing-*` rules for TS, so that it doesn't error for importing `*.ts` files

## 13.0.0

### Major Changes

- [`5943663`](https://github.com/cloudfour/eslint-config/commit/594366386a8e9313005f1955160ec8260476c7e8) [#137](https://github.com/cloudfour/eslint-config/pull/137) Thanks [@calebeby](https://github.com/calebeby)! - Remove rule: @cloudfour/no-param-reassign

  This change is breaking if you have `// eslint-disable-next-line @cloudfour/no-param-reassign` in your code, or if you are manually enabling/configuring this rule. In either case, the migration path is to remove the rule configuration

- [`3112bb7`](https://github.com/cloudfour/eslint-config/commit/3112bb704d3eed0b4dcb1dbd1146c8927ee79127) [#136](https://github.com/cloudfour/eslint-config/pull/136) Thanks [@calebeby](https://github.com/calebeby)! - Add support for linting TypeScript files

  If you have .ts or .tsx files, ESLint should automatically start linting them once you update.

  If typescript-eslint is unable to automatically infer your `tsconfig.json` location, you may need to [manually configure that](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md)

## 12.0.0 - 2020-07-20

### Major/Breaking Changes

- Update dependency `eslint-plugin-unicorn` to v21

### Minor Changes

- Update dependency `eslint` to v7.5.0
- Update dependency `eslint-config-xo` to v0.32.1
- Update dependency `eslint-formatter-pretty` to v4
- Update dependency `eslint-plugin-jsdoc` to v30
- Update dependency `kleur` to v4.0.2
- Update `jest` monorepo to v26.1.0

## 11.0.0 - 2020-05-11

### Major/Breaking Changes

- Updated `eslint-plugin-jsdoc` to v25

### Minor Changes

- Updated `jest` to v26.0.1
- Updated `eslint` to v7

## 10.0.0 - 2020-04-27

### Major/Breaking Changes

- Updated `eslint-plugin-unicorn` to v19
- Add `eslint-plugin-jsdoc` v24 to lint JSDoc comments (#97)

### Minor Changes

- Updated `jest` to v25.4.0
- Updated `prettier` to v2.0.5
- Updated `eslint-config-prettier` to v6.11.0
- Add fixtures to make testing new releases more reliable (#91)
- Disabled a few unicorn v19 rules (#104)

## 9.0.0 - 2020-03-30

### Major/Breaking Changes

- Updated `eslint-plugin-unicorn` to v18

### Minor Changes

- Updated `jest` to v25.2.4

## 8.0.0 - 2020-03-24

Edit: @calebeby pointed out that this didn't need to be a major release because prettier is a devDependency, so it won't affect our users. Sorry for the false alarm!

### Major/Breaking Changes

- Updated `prettier` to v2

### Minor Changes

- Updated `eslint-config-prettier` to v6.10.1
- Updated `eslint-config-standard` to v14.1.1

## 7.0.0 - 2020-03-09

### Major/Breaking Changes

- Updated `eslint-plugin-unicorn` to v17

### Minor Changes

- Updated `eslint-config-xo` to v0.29.1

## 6.0.0 - 2020-02-07

### Major/Breaking Changes

- Updated `jest` to v25
- Updated `eslint-plugin-node` to v11
- Updated `eslint-plugin-unicorn` to v16

### Minor Changes

- Updated `eslint` to v6.8.0
- Updated `eslint-config-prettier` to v6.10.0

## 5.0.0 - 2019-12-03

### Major/Breaking Changes

- Updated `eslint-plugin-unicorn` to v14

### Minor Changes

- Updated `eslint` to v6.7.2

## 4.0.0 - 2019-11-19

### Major/Breaking Changes

- Updated `eslint` to v6.6.0
- Updated `eslint-plugin-unicorn` to v13
- Updated `eslint-config-prettier` to v6
- Updated `eslint-config-standard` to v14
- Updated `eslint-plugin-node` to v10

### Minor Changes

- Updated `eslint-config-xo` to v0.27.2
- Updated `prettier` to v1.19.1

## 3.0.0 - 2019-06-17

### Major/Breaking Changes

- Updated `eslint-plugin-node` to v9
- Updated `eslint-config-prettier` to v5
- Updated `eslint-plugin-unicorn` to v9
- Enabled `no-unused-expressions` for ternaries and short-circuit (#18)

### Minor Changes

- Added itself as a `devDep` (#17)
- Updated `prettier` to v1.18

## 2.0.1 - 2018-12-06

- Update `package.json` `files` to include `src/rules/**/*.js` (#15)

## 2.0.0 - 2018-12-06

### Changed

- Added build process to snapshot config and reduce peerDependencies (#9)
- Changed package name from `@cloudfour/eslint-config` to `@cloudfour/eslint-plugin`
  Instead of referencing this in your ESLint config as `@cloudfour/eslint-config`, use `plugin:@cloudfour/recommended`
- Updated dependencies
- Enable more rules from [C4 JS guide](https://github.com/cloudfour/guides/tree/master/javascript) (#11)
- Enable `eslint-plugin-node` `recommended` rules (#11)
- Enable `eslint-plugin-unicorn` `recommended` rules (#12)

## 1.0.0 - 2018-07-05

- Initial release
