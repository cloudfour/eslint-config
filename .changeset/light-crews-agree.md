---
'@cloudfour/eslint-plugin': major
---

Upgraded to v15 of eslint-config-standard, which adds several rules:

- Require indentation for values of ternary expressions (indent)
- Enforce newlines between operands of ternary expressions if the expression spans multiple lines (multiline-ternary)
- Disallow loops with a body that allows only one iteration (no-unreachable-loop)
- Disallow useless backreferences in regular expressions (no-useless-backreference)
- Enforce default clauses in switch statements to be last (default-case-last)
- Disallow Number Literals That Lose Precision (no-loss-of-precision)
