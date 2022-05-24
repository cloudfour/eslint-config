# @cloudfour/eslint-plugin

## 19.0.0

### Major Changes

- [#364](https://github.com/cloudfour/eslint-config/pull/364) [`20c9859`](https://github.com/cloudfour/eslint-config/commit/20c9859149cc21fc0b67f68376925ac284685026) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependency `eslint-plugin-unicorn` to `v42`

  **New Rules**

  - [`@cloudfour/unicorn/no-unreadable-iife`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/no-unreadable-iife.md)
  - [`@cloudfour/unicorn/no-useless-switch-case`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/no-useless-switch-case.md)
  - [`@cloudfour/unicorn/prefer-modern-math-apis`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/prefer-modern-math-apis.md)
  - [`@cloudfour/unicorn/prefer-native-coercion-functions`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/prefer-native-coercion-functions.md)

  **Newly Enabled Rules**

  - [`@cloudfour/unicorn/no-unreadable-iife`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/no-unreadable-iife.md)
  - [`@cloudfour/unicorn/no-useless-switch-case`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/no-useless-switch-case.md)
  - [`@cloudfour/unicorn/prefer-modern-math-apis`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/prefer-modern-math-apis.md)
  - [`@cloudfour/unicorn/prefer-native-coercion-functions`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/prefer-native-coercion-functions.md)

  **Reconfigured Rules**

  - [`@cloudfour/unicorn/template-indent`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v42.0.0/docs/rules/template-indent.md)
    ```diff
    - "warn"
    + "error"
    ```

* [#366](https://github.com/cloudfour/eslint-config/pull/366) [`d156896`](https://github.com/cloudfour/eslint-config/commit/d156896b0aff88c656098abc12f76dc5d34c376c) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependency `eslint-plugin-jsdoc` to `v39`

  No new rules, but there are some parsing and rule enforcement changes.

  Node 12 is no longer supported

  Node 18 is supported

## 18.0.1

### Patch Changes

- [#362](https://github.com/cloudfour/eslint-config/pull/362) [`0625daf`](https://github.com/cloudfour/eslint-config/commit/0625dafc4233fc34a9f24024962538778b6ecf62) Thanks [@calebeby](https://github.com/calebeby)! - Fix dependency version for eslint-plugin-import

## 18.0.0

### Major Changes

- [#293](https://github.com/cloudfour/eslint-config/pull/293) [`c24a70e`](https://github.com/cloudfour/eslint-config/commit/c24a70e182b6b58a2bc00b86b1086d9cabc74c4f) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to `v35`

  **New Rules**

  - [`@cloudfour/unicorn/no-useless-length-check`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v35.0.0/docs/rules/no-useless-length-check.md)
  - [`@cloudfour/unicorn/no-useless-spread`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v35.0.0/docs/rules/no-useless-spread.md)
  - [`@cloudfour/unicorn/prefer-object-from-entries`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v35.0.0/docs/rules/prefer-object-from-entries.md)

  **Newly Enabled Rules**

  - [`@cloudfour/unicorn/no-useless-length-check`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v35.0.0/docs/rules/no-useless-length-check.md)
  - [`@cloudfour/unicorn/no-useless-spread`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v35.0.0/docs/rules/no-useless-spread.md)
  - [`@cloudfour/unicorn/prefer-object-from-entries`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v35.0.0/docs/rules/prefer-object-from-entries.md)

* [#306](https://github.com/cloudfour/eslint-config/pull/306) [`62e271d`](https://github.com/cloudfour/eslint-config/commit/62e271deea1b985501dd23c9a849ffd0e3ad951f) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to v37

  **New Rules (all are enabled by default)**

  - [`@cloudfour/unicorn/no-invalid-remove-event-listener`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v37.0.1/docs/rules/no-invalid-remove-event-listener.md)
  - [`@cloudfour/unicorn/no-useless-fallback-in-spread`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v37.0.1/docs/rules/no-useless-fallback-in-spread.md)
  - [`@cloudfour/unicorn/template-indent`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v37.0.1/docs/rules/template-indent.md)

- [#339](https://github.com/cloudfour/eslint-config/pull/339) [`ce3d6ab`](https://github.com/cloudfour/eslint-config/commit/ce3d6abf1775e2cd32badbbe4f236cfceff7669c) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to `v41`

  **New Rules**

  - [`@cloudfour/unicorn/no-await-expression-member`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/no-await-expression-member.md)
  - [`@cloudfour/unicorn/no-empty-file`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/no-empty-file.md)
  - [`@cloudfour/unicorn/no-thenable`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/no-thenable.md)
  - [`@cloudfour/unicorn/no-useless-promise-resolve-reject`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/no-useless-promise-resolve-reject.md)
  - [`@cloudfour/unicorn/prefer-code-point`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/prefer-code-point.md)
  - [`@cloudfour/unicorn/prefer-export-from`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/prefer-export-from.md)
  - [`@cloudfour/unicorn/prefer-json-parse-buffer`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/prefer-json-parse-buffer.md)
  - [`@cloudfour/unicorn/relative-url-style`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/relative-url-style.md)
  - [`@cloudfour/unicorn/text-encoding-identifier-case`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/text-encoding-identifier-case.md)

  **Newly Enabled Rules**

  - [`@cloudfour/unicorn/no-await-expression-member`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/no-await-expression-member.md)
  - [`@cloudfour/unicorn/no-empty-file`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/no-empty-file.md)
  - [`@cloudfour/unicorn/no-thenable`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/no-thenable.md)
  - [`@cloudfour/unicorn/no-useless-promise-resolve-reject`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/no-useless-promise-resolve-reject.md)
  - [`@cloudfour/unicorn/prefer-code-point`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/prefer-code-point.md)
  - [`@cloudfour/unicorn/prefer-export-from`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/prefer-export-from.md)
  - [`@cloudfour/unicorn/relative-url-style`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/relative-url-style.md)
  - [`@cloudfour/unicorn/text-encoding-identifier-case`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/text-encoding-identifier-case.md)

  **Newly Disabled Rules**

  - [`@cloudfour/unicorn/require-post-message-target-origin`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v41.0.1/docs/rules/require-post-message-target-origin.md)

* [#344](https://github.com/cloudfour/eslint-config/pull/344) [`db15314`](https://github.com/cloudfour/eslint-config/commit/db15314132da74a1fc6b558afcdbddcc5c87e576) Thanks [@calebeby](https://github.com/calebeby)! - Require eslint `^8.0.0`. [Migration guide for eslint v8](https://eslint.org/docs/8.0.0/user-guide/migrating-to-8.0.0).

- [#351](https://github.com/cloudfour/eslint-config/pull/351) [`bb7da9e`](https://github.com/cloudfour/eslint-config/commit/bb7da9e8d251d7fe649d9cf85491e3db6f478677) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-jsdoc` to `v38`

* [#307](https://github.com/cloudfour/eslint-config/pull/307) [`739814c`](https://github.com/cloudfour/eslint-config/commit/739814cae2076f9f4fe24dcc7b5f263287eb3d40) Thanks [@renovate](https://github.com/apps/renovate)! - Updates the `typescript-eslint` packages to 5.0.0.

  **Newly Enabled Rules**

  - [`@cloudfour/typescript-eslint/no-confusing-void-expression`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-confusing-void-expression.md)
  - [`@cloudfour/typescript-eslint/no-meaningless-void-operator`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-meaningless-void-operator.md)
  - [`@cloudfour/typescript-eslint/no-unnecessary-type-constraint`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-unnecessary-type-constraint.md)

  **New Rules (not enabled by default)**

  - [`@cloudfour/typescript-eslint/comma-dangle`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/comma-dangle.md)
  - [`@cloudfour/typescript-eslint/consistent-indexed-object-style`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/consistent-indexed-object-style.md)
  - [`@cloudfour/typescript-eslint/no-confusing-void-expression`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-confusing-void-expression.md)
  - [`@cloudfour/typescript-eslint/no-duplicate-imports`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-duplicate-imports.md)
  - [`@cloudfour/typescript-eslint/no-loop-func`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-loop-func.md)
  - [`@cloudfour/typescript-eslint/no-meaningless-void-operator`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-meaningless-void-operator.md)
  - [`@cloudfour/typescript-eslint/no-non-null-asserted-nullish-coalescing`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-non-null-asserted-nullish-coalescing.md)
  - [`@cloudfour/typescript-eslint/no-restricted-imports`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-restricted-imports.md)
  - [`@cloudfour/typescript-eslint/no-unnecessary-type-constraint`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-unnecessary-type-constraint.md)
  - [`@cloudfour/typescript-eslint/no-unsafe-argument`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/no-unsafe-argument.md)
  - [`@cloudfour/typescript-eslint/non-nullable-type-assertion-style`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/non-nullable-type-assertion-style.md)
  - [`@cloudfour/typescript-eslint/object-curly-spacing`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/object-curly-spacing.md)
  - [`@cloudfour/typescript-eslint/padding-line-between-statements`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/padding-line-between-statements.md)
  - [`@cloudfour/typescript-eslint/prefer-return-this-type`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/prefer-return-this-type.md)
  - [`@cloudfour/typescript-eslint/sort-type-union-intersection-members`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/sort-type-union-intersection-members.md)
  - [`@cloudfour/typescript-eslint/space-infix-ops`](https://github.com/typescript-eslint/typescript-eslint/blob/v5.0.0/packages/eslint-plugin/docs/rules/space-infix-ops.md)

  **Deleted Rules**

  - [`@cloudfour/typescript-eslint/no-unused-vars-experimental`](https://github.com/typescript-eslint/typescript-eslint/blob/v4.0.0/packages/eslint-plugin/docs/rules/no-unused-vars-experimental.md)

### Minor Changes

- [#290](https://github.com/cloudfour/eslint-config/pull/290) [`eb96b8c`](https://github.com/cloudfour/eslint-config/commit/eb96b8ceb64b91bc3f41a303bac217325bac03e5) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-jsdoc` to `v36`

  **New Rules**

  - [`@cloudfour/jsdoc/match-name`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-match-name) (not enabled by default)

## 17.1.0

### Minor Changes

- [#287](https://github.com/cloudfour/eslint-config/pull/287) [`3cb6588`](https://github.com/cloudfour/eslint-config/commit/3cb65887f785e9b944efc4dba3b5b600100d94c6) Thanks [@calebeby](https://github.com/calebeby)! - Disable unicorn/prefer-node-protocol

## 17.0.1

### Patch Changes

- [`ec422d2`](https://github.com/cloudfour/eslint-config/commit/ec422d214d53c4d721ac0c5ab7196d6b08a188e6) Thanks [@calebeby](https://github.com/calebeby)! - Fix main field

## 17.0.0

### Major Changes

- [`bbde55f`](https://github.com/cloudfour/eslint-config/commit/bbde55f53b18e7a9a29f4d9873d7f2954cdf8c2e) Thanks [@calebeby](https://github.com/calebeby)! - Update eslint-plugin-jsdoc to v35

  New rules, enabled by default:

  - [`@cloudfour/jsdoc/multiline-blocks`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-multiline-blocks)
  - [`@cloudfour/jsdoc/no-multi-asterisks`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-no-multi-asterisks)
  - [`@cloudfour/jsdoc/tag-lines`](https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-tag-lines)

* [#252](https://github.com/cloudfour/eslint-config/pull/252) [`f88d3f6`](https://github.com/cloudfour/eslint-config/commit/f88d3f657797347db7b9701472480d571f9d0a34) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-config-xo` to `v0.36.0`

  - Add more deprecated Node.js modules to [`no-restricted-imports`](https://eslint.org/docs/rules/no-restricted-imports)
  - Remove unnecessary [`no-restricted-syntax`](https://eslint.org/docs/rules/no-restricted-syntax) rule
  - Enable [`prefer-arrow-callback`](https://eslint.org/docs/rules/prefer-arrow-callback)
  - Enable [`prefer-numeric-literals`](https://eslint.org/docs/rules/prefer-numeric-literals)

- [#279](https://github.com/cloudfour/eslint-config/pull/279) [`4728476`](https://github.com/cloudfour/eslint-config/commit/4728476a98b99ed4a5041538e18132e5b2ef6175) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to `v34`

  **New Rules**

  - [`@cloudfour/unicorn/no-array-method-this-argument`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/no-array-method-this-argument.md)
  - [`@cloudfour/unicorn/prefer-at`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/prefer-at.md)
  - [`@cloudfour/unicorn/prefer-object-has-own`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/prefer-object-has-own.md)
  - [`@cloudfour/unicorn/prefer-prototype-methods`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/prefer-prototype-methods.md)
  - [`@cloudfour/unicorn/prefer-top-level-await`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/prefer-top-level-await.md)
  - [`@cloudfour/unicorn/require-array-join-separator`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/require-array-join-separator.md)
  - [`@cloudfour/unicorn/require-number-to-fixed-digits-argument`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/require-number-to-fixed-digits-argument.md)
  - [`@cloudfour/unicorn/require-post-message-target-origin`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/require-post-message-target-origin.md)

  **Newly Enabled Rules**

  - [`@cloudfour/unicorn/no-array-method-this-argument`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/no-array-method-this-argument.md)
  - [`@cloudfour/unicorn/prefer-prototype-methods`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/prefer-prototype-methods.md)
  - [`@cloudfour/unicorn/require-array-join-separator`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/require-array-join-separator.md)
  - [`@cloudfour/unicorn/require-number-to-fixed-digits-argument`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/require-number-to-fixed-digits-argument.md)
  - [`@cloudfour/unicorn/require-post-message-target-origin`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v34.0.0/docs/rules/require-post-message-target-origin.md)

* [#274](https://github.com/cloudfour/eslint-config/pull/274) [`186580d`](https://github.com/cloudfour/eslint-config/commit/186580d0c0b95a9857cee43ca32e923cf5c627b4) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-config-xo` to `v0.37.0`

  **Newly Enabled Rules**

  - [`arrow-body-style`](https://eslint.org/docs/rules/arrow-body-style)

- [#262](https://github.com/cloudfour/eslint-config/pull/262) [`cd2038f`](https://github.com/cloudfour/eslint-config/commit/cd2038f56bbf502a5b6601f6faf96cd34a64f7eb) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to v32

  - New rule: [`@cloudfour/unicorn/no-document-cookie`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-document-cookie.md) (enabled by default)
  - Enable rule: [`@cloudfour/unicorn/numeric-separators-style`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/numeric-separators-style.md)
  - Enable rule: [`@cloudfour/unicorn/prefer-array-flat`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-flat.md)
  - Enable rule: [`@cloudfour/unicorn/prefer-array-flat-map`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-flat-map.md)

* [#256](https://github.com/cloudfour/eslint-config/pull/256) [`ad9f8bd`](https://github.com/cloudfour/eslint-config/commit/ad9f8bddc186082dea179cf7859538a1f77fb273) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to v31

  - Enabled new rule [`@cloudfour/unicorn/prefer-node-protocol`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-node-protocol.md)

### Minor Changes

- [#280](https://github.com/cloudfour/eslint-config/pull/280) [`ed92e21`](https://github.com/cloudfour/eslint-config/commit/ed92e2109445359e126da3646213c132be04004f) Thanks [@calebeby](https://github.com/calebeby)! - Disable [`padding-line-between-statements`](https://eslint.org/docs/rules/padding-line-between-statements)

  We decided that since devs can use blank lines to create logical groupings in code, it is best not to have ESLint enforce adding newlines

* [#285](https://github.com/cloudfour/eslint-config/pull/285) [`243954a`](https://github.com/cloudfour/eslint-config/commit/243954acc0a31f5099c4e686a011872e26912cd9) Thanks [@calebeby](https://github.com/calebeby)! - Make capitalized-comments ignore most commented code

## 16.0.0

### Major Changes

- [#206](https://github.com/cloudfour/eslint-config/pull/206) [`4e2b9fb`](https://github.com/cloudfour/eslint-config/commit/4e2b9fb0454cf6d0165d9557232caf1db5f42392) Thanks [@spaceninja](https://github.com/spaceninja)! - Update dependency `eslint-config-prettier` to [v7](https://togithub.com/prettier/eslint-config-prettier/blob/master/CHANGELOG.md#Version-700-2020-12-05)

  - Changed: At least ESLint 7.0.0 is now required.

* [#176](https://github.com/cloudfour/eslint-config/pull/176) [`404c42d`](https://github.com/cloudfour/eslint-config/commit/404c42d6f55fb30e11de6949530fd23cc0bef81a) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to [`23.0.0`](https://github.com/sindresorhus/eslint-plugin-unicorn/releases/tag/v23.0.0)

  - New rule: [`unicorn/prefer-math-trunc`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v23.0.0/docs/rules/prefer-math-trunc.md) (enabled by default)
  - New rule: [`unicorn/prefer-ternary`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v23.0.0/docs/rules/prefer-ternary.md) (enabled by default)
  - New rule: [`numeric-separators-style`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v23.0.0/docs/rules/numeric-separators-style.md) (not enabled by default yet)

- [#187](https://github.com/cloudfour/eslint-config/pull/187) [`a1f68c2`](https://github.com/cloudfour/eslint-config/commit/a1f68c2d3754b6ecb72e28914b40224602b50650) Thanks [@spaceninja](https://github.com/spaceninja)! - Upgraded to v15 of eslint-config-standard, which adds several rules:

  - Require indentation for values of ternary expressions (indent)
  - Enforce newlines between operands of ternary expressions if the expression spans multiple lines (multiline-ternary)
  - Disallow loops with a body that allows only one iteration (no-unreachable-loop)
  - Disallow useless backreferences in regular expressions (no-useless-backreference)
  - Enforce default clauses in switch statements to be last (default-case-last)
  - Disallow Number Literals That Lose Precision (no-loss-of-precision)

* [#242](https://github.com/cloudfour/eslint-config/pull/242) [`58c7204`](https://github.com/cloudfour/eslint-config/commit/58c7204c38092f137dba8a6c94425c0b7d06ceb2) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-plugin-unicorn` to `v29`

  New rules:

  - [`@cloudfour/unicorn/no-array-for-each`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-for-each.md)
  - [`@cloudfour/unicorn/no-array-push-push`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-push-push.md)
  - [`@cloudfour/unicorn/no-this-assignment`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-this-assignment.md)
  - [`@cloudfour/unicorn/no-lonely-if`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-lonely-if.md)
  - [`@cloudfour/unicorn/empty-brace-spaces`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/empty-brace-spaces.md) (not enabled by default)
  - [`@cloudfour/unicorn/prefer-date-now`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-date-now.md)
  - [`@cloudfour/unicorn/no-new-array`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-new-array.md)
  - [`@cloudfour/unicorn/prefer-array-index-of`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-index-of.md)
  - [`@cloudfour/unicorn/prefer-regexp-test`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-regexp-test.md)
  - [`@cloudfour/unicorn/consistent-destructuring`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-destructuring.md) (not enabled by default)
  - [`@cloudfour/unicorn/prefer-array-some`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-some.md)
  - [`@cloudfour/unicorn/prefer-default-parameters`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-default-parameters.md)
  - [`@cloudfour/unicorn/no-static-only-class`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-static-only-class.md)
  - [`@cloudfour/unicorn/prefer-array-flat`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-array-flat.md) (not enabled by default)

  Disabled rules:

  - [`@cloudfour/unicorn/import-index`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/import-index.md) (due to Node ESM resolution implementation)

  Rename rules:

  - `@cloudfour/unicorn/no-fn-reference-in-iterator` → `@cloudfour/unicorn/no-array-callback-reference`
  - `@cloudfour/unicorn/no-array-instanceof` → `@cloudfour/unicorn/no-instanceof-array`
  - `@cloudfour/unicorn/no-reduce` → `@cloudfour/unicorn/no-array-reduce`
  - `@cloudfour/unicorn/prefer-dataset` → `@cloudfour/unicorn/prefer-dom-node-dataset`
  - `@cloudfour/unicorn/prefer-flat-map` → `@cloudfour/unicorn/prefer-array-flat-map`
  - `@cloudfour/unicorn/prefer-replace-all` → `@cloudfour/unicorn/prefer-string-replace-all`
  - `@cloudfour/unicorn/prefer-starts-ends-with` → `@cloudfour/unicorn/prefer-string-starts-ends-with`
  - `@cloudfour/unicorn/prefer-text-content` → `@cloudfour/unicorn/prefer-dom-node-text-content`
  - `@cloudfour/unicorn/prefer-trim-start-end` → `@cloudfour/unicorn/prefer-string-trim-start-end`
  - `@cloudfour/unicorn/prefer-event-key` → `@cloudfour/unicorn/prefer-keyboard-event-key`
  - `@cloudfour/unicorn/prefer-node-append` → `@cloudfour/unicorn/prefer-dom-node-append`
  - `@cloudfour/unicorn/prefer-node-remove` → `@cloudfour/unicorn/prefer-dom-node-remove`

  There were many improvements/changes to individual rules, listed [here](https://github.com/cloudfour/eslint-config/pull/242)

- [#191](https://github.com/cloudfour/eslint-config/pull/191) [`7f732b6`](https://github.com/cloudfour/eslint-config/commit/7f732b63a2a3fa2ec3cea53bf4592afb896e2840) Thanks [@renovate](https://github.com/apps/renovate)! - Update `eslint-config-standard` to `16.0.1`

  - Remove `eslint-plugin-standard` since all of the rules from it now live in other plugins
  - `camelcase` rule now allows variables starting with `UNSAFE_` (from react) and known globals
  - `no-unused-vars` now ignores unused caught errors (`unicorn/prefer-optional-catch-binding` handles this use case)
  - `prefer-regex-literals`: Enabled [`disallowRedundantWrapping` option](https://eslint.org/docs/rules/prefer-regex-literals#disallowredundantwrapping)
  - `array-callback-return`: Change [`allowImplicit`](https://eslint.org/docs/rules/array-callback-return#allowimplicit) to `false`.
  - `use-isnan`: Change [`enforceForIndexOf`](https://eslint.org/docs/rules/use-isnan#enforceforindexof) to `true`.

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
