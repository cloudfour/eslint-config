---
'@cloudfour/eslint-plugin': major
---

Remove rule: @cloudfour/no-param-reassign

This change is breaking if you have `// eslint-disable-next-line @cloudfour/no-param-reassign` in your code, or if you are manually enabling/configuring this rule. In either case, the migration path is to remove the rule configuration
