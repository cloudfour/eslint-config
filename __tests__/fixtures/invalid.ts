// Each construct in this file trips exactly one rule that our TypeScript
// overrides turn on or reconfigure. The test asserts the exact set of rules
// that fire, so both adding and losing a rule will fail it.
//
// Fixtures are excluded from Prettier so that reformatting can never silently
// change which rules fire.

// `@typescript-eslint/consistent-type-imports` — Config is only used as a type.
// `import-x/no-duplicates` with `prefer-inline` — these should be one statement.
import { Config } from './types.js';
import { VERSION } from './types.js';

// `@typescript-eslint/array-type` is set to `array`, so this should be `string[]`.
export const names: Array<string> = [];

// `@typescript-eslint/no-non-null-assertion` is an error for us, not a warning.
export const shout = (config: Config | undefined) => config!.name;

// `@typescript-eslint/no-unnecessary-boolean-literal-compare`
export const isReady = (ready: boolean) => ready === true;

// `@typescript-eslint/prefer-optional-chain`
export const nameOf = (config: Config | undefined) => config && config.name;

// `@typescript-eslint/no-unnecessary-condition` — VERSION is never undefined.
export const hasVersion = VERSION !== undefined;

// `@typescript-eslint/no-floating-promises` — started and abandoned, with no
// `await`, `.catch()` or `void`. valid.ts has the `void` form that passes.
export const fireAndForget = (run: () => Promise<void>) => {
	run();
};

// `@typescript-eslint/restrict-template-expressions` — a `never` cannot be
// stringified, which is what this reports on real code: a type guard narrows
// its own failure branch to `never`, so the error message built from it is
// unreachable per the types. `any`, numbers and nullish stay allowed under xo's
// options; valid.ts covers that.
export const describeImpossible = (value: never) => `value: ${value}`;
