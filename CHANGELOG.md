# 10.0.0 - 2020-04-27

## Major/Breaking Changes

- Updated `eslint-plugin-unicorn` to v19
- Add `eslint-plugin-jsdoc` v24 to lint JSDoc comments (#97)

## Minor Changes

- Updated `jest` to v25.4.0
- Updated `prettier` to v2.0.5
- Updated `eslint-config-prettier` to v6.11.0
- Add fixtures to make testing new releases more reliable (#91)
- Disabled a few unicorn v19 rules (#104)

# 9.0.0 - 2020-03-30

## Major/Breaking Changes

- Updated `eslint-plugin-unicorn` to v18

## Minor Changes

- Updated `jest` to v25.2.4

# 8.0.0 - 2020-03-24

Edit: @calebeby pointed out that this didn't need to be a major release because prettier is a devDependency, so it won't affect our users. Sorry for the false alarm!

## Major/Breaking Changes

- Updated `prettier` to v2

## Minor Changes

- Updated `eslint-config-prettier` to v6.10.1
- Updated `eslint-config-standard` to v14.1.1

# 7.0.0 - 2020-03-09

## Major/Breaking Changes

- Updated `eslint-plugin-unicorn` to v17

## Minor Changes

- Updated `eslint-config-xo` to v0.29.1

# 6.0.0 - 2020-02-07

## Major/Breaking Changes

- Updated `jest` to v25
- Updated `eslint-plugin-node` to v11
- Updated `eslint-plugin-unicorn` to v16

## Minor Changes

- Updated `eslint` to v6.8.0
- Updated `eslint-config-prettier` to v6.10.0

# 5.0.0 - 2019-12-03

## Major/Breaking Changes

- Updated `eslint-plugin-unicorn` to v14

## Minor Changes

- Updated `eslint` to v6.7.2

# 4.0.0 - 2019-11-19

## Major/Breaking Changes

- Updated `eslint` to v6.6.0
- Updated `eslint-plugin-unicorn` to v13
- Updated `eslint-config-prettier` to v6
- Updated `eslint-config-standard` to v14
- Updated `eslint-plugin-node` to v10

## Minor Changes

- Updated `eslint-config-xo` to v0.27.2
- Updated `prettier` to v1.19.1

# 3.0.0 - 2019-06-17

## Major/Breaking Changes

- Updated `eslint-plugin-node` to v9
- Updated `eslint-config-prettier` to v5
- Updated `eslint-plugin-unicorn` to v9
- Enabled `no-unused-expressions` for ternaries and short-circuit (#18)

## Minor Changes

- Added itself as a `devDep` (#17)
- Updated `prettier` to v1.18

# 2.0.1 - 2018-12-06

- Update `package.json` `files` to include `src/rules/**/*.js` (#15)

# 2.0.0 - 2018-12-06

## Changed

- Added build process to snapshot config and reduce peerDependencies (#9)
- Changed package name from `@cloudfour/eslint-config` to `@cloudfour/eslint-plugin`
  Instead of referencing this in your ESLint config as `@cloudfour/eslint-config`, use `plugin:@cloudfour/recommended`
- Updated dependencies
- Enable more rules from [C4 JS guide](https://github.com/cloudfour/guides/tree/master/javascript) (#11)
- Enable `eslint-plugin-node` `recommended` rules (#11)
- Enable `eslint-plugin-unicorn` `recommended` rules (#12)

# 1.0.0 - 2018-07-05

- Initial release
