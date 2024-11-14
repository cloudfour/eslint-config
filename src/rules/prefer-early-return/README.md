# Prefer early returns over full-body conditional wrapping in function declarations. (prefer-early-return)

(This rule is originally from https://github.com/Shopify/web-configs/blob/main/packages/eslint-plugin/docs/rules/prefer-early-return.md)

A function whose entire body is nested under a conditional statement adds unnecessary nesting and makes the code harder to read. An early return often makes the block more readable.

## Rule Details

The following patterns are considered warnings:

```js
function foo() {
	if (a) {
		b();
		c();
		d();
	}
}
```

The following patterns are not warnings:

```js
function foo() {
	if (!a) {
		return;
	}

	b();
	c();
}

function bar() {
	if (a) {
		b();
		c();
	}

	d();
}

function baz() {
	if (a) {
		b();
		c();
	} else {
		d();
	}
}
```

### Options

This plugin takes one option: an object with a integer `maximumStatements` property. This property specifies the maximum number of statements in the conditional for which a full-function body conditional should be allowed. By default, this value is `2`, so the following will **not** be considered a warning:

```js
function foo() {
	if (a) {
		b();
		c();
	}
}
```

Setting `maximumStatements` to `1` or `0` will cause the above to be a warning. Setting `maximumStatements` to `3` would cause the following **not** to be considered a warning:

```js
function foo() {
	if (a) {
		b();
		c();
		d();
	}
}
```

## When Not To Use It

If you don't care about conditionals that span the entire body of functions, or dislike early returns, you can safely disable this rule.
