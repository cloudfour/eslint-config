import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

// The semver package is CommonJS, so its helpers come off the default export.
import semver from 'semver';

const readPackage = (path) => JSON.parse(readFileSync(path, 'utf8'));

const pkg = readPackage('package.json');

// Read what is actually installed rather than querying the registry: this tests
// the tree CI resolves from the lockfile, needs no network, and stays
// deterministic. A Renovate PR that bumps a dependency into a narrower Node
// range fails here instead of silently shipping a range we cannot honour.
const dependencies = Object.keys({
	...pkg.dependencies,
	...pkg.devDependencies,
})
	.map((name) => ({
		name,
		range: readPackage(`node_modules/${name}/package.json`).engines?.node,
	}))
	.filter((dependency) => dependency.range !== undefined);

describe('engines.node', () => {
	it('has dependencies installed to check against', () => {
		assert.ok(dependencies.length > 0);
	});

	for (const { name, range } of dependencies) {
		it(`is a range ${name} also supports`, () => {
			assert.ok(
				semver.subset(pkg.engines.node, range),
				`We declare "${pkg.engines.node}" but ${name} only supports "${range}", ` +
					`so there are Node versions we claim to support that it does not.`,
			);
		});
	}
});
