// Each construct in this file trips exactly one rule that our config turns on
// or reconfigures. The test asserts the exact set of rules that fire, so both
// adding and losing a rule will fail it.
//
// Fixtures are excluded from Prettier so that reformatting can never silently
// change which rules fire.

// `n/file-extension-in-import` is set to 'always'.
import { sibling } from './sibling';

// `no-var`
var legacy = 1;

// `object-shorthand`
export const wrapped = { legacy: legacy };

// `prefer-template`
export const greeting = 'hello ' + legacy;

// `no-return-assign` — parenthesised assignments are allowed, bare ones are not.
export function assign(target) {
	return target.count = legacy;
}

// lowercase sentence comments trip `capitalized-comments`
export const flagged = sibling.length;

// `unicorn/prefer-early-return` — more than two statements under a lone `if`.
export function guard(value) {
	if (value) {
		console.log(value);
		console.log(legacy);
		console.log(sibling);
	}
}

// `no-unused-expressions` runs with `allowShortCircuit: false`.
export function shortCircuit(value) {
	value && console.log(value);
}
