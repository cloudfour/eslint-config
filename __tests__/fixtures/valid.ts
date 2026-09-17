// Every construct in this file is something our TypeScript overrides
// deliberately allow. If a dependency upgrade re-enables one of these rules,
// this fixture starts reporting and the test fails.
//
// Fixtures are excluded from Prettier so that reformatting can never silently
// change which rules fire.

// `@typescript-eslint/no-explicit-any` is off — `any` is an escape hatch.
export const parse = (input: any): any => input;

// The `@typescript-eslint/no-unsafe-*` family is off, so `any` stays usable.
export const callAnything = (value: any) => value.whatever();

// `@typescript-eslint/restrict-template-expressions` runs with xo's options,
// which leave `allowAny` at its default. Interpolating an `any` stays allowed,
// so the escape hatch survives the rule being on. See invalid.ts for what it
// does report.
export const label = (value: any) => `value: ${value}`;

// `@typescript-eslint/no-floating-promises` runs with xo's `ignoreVoid`, so
// `void` marks a promise as deliberately unawaited. Without it this reports;
// see invalid.ts.
export const deliberatelyUnawaited = (run: () => Promise<void>) => {
	void run();
};

// `@typescript-eslint/strict-boolean-expressions` is off, so a string, an
// optional string and a number can all be tested directly. xo enables it; these
// are the three shapes that made up almost all of its reports on real code, and
// in each one `''`, `0` and absent legitimately mean the same thing. See #719.
export const firstNonEmpty = (text: string, fallback?: string, index = 0) => {
	if (text) {
		return text;
	}

	if (fallback) {
		return fallback;
	}

	return index % 2 ? 'odd' : 'even';
};

// `no-unused-vars` and `@typescript-eslint/no-unused-vars` are both off,
// because TypeScript reports these itself.
export const withUnused = (used: string) => {
	const unused = 1;
	return used;
};

// `@typescript-eslint/no-empty-function` is off.
export function empty() {}

// `@typescript-eslint/no-confusing-void-expression` runs with
// `ignoreArrowShorthand: true`.
export const shorthandVoid = (run: () => void) => run();

// `@typescript-eslint/explicit-module-boundary-types` is off, so an inferred
// return type on an exported function is fine.
export const inferred = (count: number) => count * 2;
