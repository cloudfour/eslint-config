// Every construct in this file is something our config deliberately allows,
// usually because we explicitly turned a rule off. If a dependency upgrade
// re-enables one of them, this fixture starts reporting and the test fails.
//
// Fixtures are excluded from Prettier so that reformatting can never silently
// change which rules fire.

// `unicorn/no-null` is off — null is a legitimate value.
export const nothing = null;

// `unicorn/prevent-abbreviations` is off.
export const props = { i: 0, prev: nothing };

// `no-param-reassign` is off. (Braces are required by xo's `curly`.)
export const clamp = (value) => {
	if (value < 0) {
		value = 0;
	}

	return value;
};

// `unicorn/no-array-reduce` is off.
export const sum = (numbers) => numbers.reduce((total, next) => total + next, 0);

// `unicorn/no-array-callback-reference` is off.
export const toNumbers = (strings) => strings.map(Number);

// `unicorn/prefer-set-has` is off, so repeated `includes` on an array is fine.
const allowed = ['a', 'b'];
export const isAllowed = (value) => allowed.includes(value);

// `unicorn/prefer-number-properties` runs with `checkInfinity: false`.
export const limit = Infinity;

// `func-names` is off, so an anonymous function expression is fine.
export const noop = function () {};

// `capitalized-comments` ignores our pragma list, and both `no-warning-comments`
// and `unicorn/expiring-todo-comments` are off.
// todo: this comment is allowed
export const done = true;

// `prefer-destructuring` runs with `array: false`, so index access is fine.
export const first = (values) => values[0];
