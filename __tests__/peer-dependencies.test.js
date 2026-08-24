import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

// The semver package is CommonJS, so its helpers come off the default export.
import semver from 'semver';

const readPackage = (path) => JSON.parse(readFileSync(path, 'utf8'));

const pkg = readPackage('package.json');

// Same idea as the engines test, applied to the ESLint version we ask consumers
// for. Our peer range is a promise, and it is only as good as the narrowest
// range among the configs and plugins we re-export. Without this, a bump can
// quietly raise a dependency's floor above ours and consumers find out through
// peer warnings on install.
const declared = pkg.peerDependencies.eslint;

const dependencies = Object.keys(pkg.dependencies)
	.map((name) => ({
		name,
		range: readPackage(`node_modules/${name}/package.json`).peerDependencies
			?.eslint,
	}))
	.filter((dependency) => dependency.range !== undefined);

describe('peerDependencies.eslint', () => {
	it('has dependencies installed to check against', () => {
		assert.ok(dependencies.length > 0);
	});

	for (const { name, range } of dependencies) {
		it(`is a range ${name} also supports`, () => {
			assert.ok(
				semver.subset(declared, range),
				`We ask for eslint "${declared}" but ${name} only supports "${range}", ` +
					`so there are ESLint versions we accept that it does not.`,
			);
		});
	}
});
