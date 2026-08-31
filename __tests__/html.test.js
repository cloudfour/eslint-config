import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { format, lintFixture, rulesFired } from './helpers.js';

describe('HTML config', () => {
	it('does not demand Open Graph tags or a meta description', async () => {
		// The fixture is a plausible demo page: it has a lang, a charset, a
		// viewport and a title, but no OGP tags and no description. Both of those
		// are content decisions per page, so neither should be reported.
		const messages = await lintFixture('__tests__/fixtures/valid.html');

		assert.deepEqual(
			rulesFired(messages),
			[],
			`Expected no rules to fire on the HTML fixture, got:\n${format(messages)}`,
		);
	});
});
