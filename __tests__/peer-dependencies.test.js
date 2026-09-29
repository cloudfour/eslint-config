import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { describe, it } from 'node:test';

// The semver package is CommonJS, so its helpers come off the default export.
import semver from 'semver';

const readPackage = (file) => JSON.parse(readFileSync(file, 'utf8'));

const pkg = readPackage('package.json');

/**
 * Finds the copy of a package that Node would load from `from`, walking up
 * through `node_modules` directories the way module resolution does.
 *
 * @param {string} from Directory of the package that depends on it.
 * @param {string} name The package to look for, e.g. `typescript-eslint`.
 * @returns {string | undefined} Path to its `package.json`, if installed.
 */
const findPackage = (from, name) => {
	for (let directory = from; ; directory = path.dirname(directory)) {
		const file = path.join(directory, 'node_modules', name, 'package.json');
		if (existsSync(file)) {
			return file;
		}

		if (directory === path.dirname(directory)) {
			return undefined;
		}
	}
};

// Every package a consumer installs because of us, not only our direct
// dependencies. The ranges that matter most are usually further down: the
// TypeScript ceiling comes from typescript-eslint, which eslint-config-xo
// depends on, not us.
const installed = new Map();
const queue = Object.keys(pkg.dependencies).map((name) => [
	process.cwd(),
	name,
]);
while (queue.length > 0) {
	const [from, name] = queue.shift();
	const file = findPackage(from, name);
	if (!file || installed.has(file)) {
		continue;
	}

	const dependency = readPackage(file);
	installed.set(file, dependency);
	for (const next of Object.keys({
		...dependency.dependencies,
		...dependency.optionalDependencies,
	})) {
		queue.push([path.dirname(file), next]);
	}
}

// Same idea as the engines test, applied to the peers we ask consumers for. Our
// peer range is a promise, and it is only as good as the narrowest range among
// the packages we bring in. Without this, a bump can quietly raise a floor above
// ours, or lower a ceiling below it, and consumers find out through peer
// conflicts on install. It cannot tell when our range is narrower than it needs
// to be: widening the TypeScript range when typescript-eslint supports a new
// major is still a manual step.
for (const [peer, declared] of Object.entries(pkg.peerDependencies)) {
	const constraints = new Map(
		installed
			.values()
			.filter((dependency) => dependency.peerDependencies?.[peer])
			.map((dependency) => [
				`${dependency.name}@${dependency.version}`,
				dependency.peerDependencies[peer],
			]),
	)
		.entries()
		.toArray();

	describe(`peerDependencies.${peer}`, () => {
		it('has dependencies installed to check against', () => {
			assert.ok(constraints.length > 0);
		});

		for (const [name, range] of constraints) {
			it(`is a range ${name} also supports`, () => {
				assert.ok(
					semver.subset(declared, range),
					`We ask for ${peer} "${declared}" but ${name} only supports "${range}", ` +
						`so there are ${peer} versions we accept that it does not.`,
				);
			});
		}
	});
}
