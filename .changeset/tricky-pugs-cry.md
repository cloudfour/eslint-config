---
'@cloudfour/eslint-plugin': major
---

Add `@cloudfour/prefer-early-return` rule (enabled by default)

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
