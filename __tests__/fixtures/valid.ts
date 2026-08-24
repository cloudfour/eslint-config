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

// `@typescript-eslint/restrict-template-expressions` is off.
export const label = (value: any) => `value: ${value}`;

// `@typescript-eslint/no-floating-promises` is off — humans decide when to catch.
export const fireAndForget = (run: () => Promise<void>) => {
	run();
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
