'use strict';

const errors = require('../errors');
const Suite = require('../suite');
const createMissingArgumentError = errors.createMissingArgumentError;

/**
 * Functions common to more than one interface.
 *
 * @param {Suite[]} suites
 * @param {Context} context
 * @param {Mocha} mocha
 * @returns {object} An object containing common functions.
 */
module.exports = function (suites, context, mocha) {
  /**
   * Check if the suite should be tested.
   *
   * @private
   * @param {Suite} suite - suite to check
   * @returns {boolean}
   */
  function shouldBeTested(suite) {
    return (
      !mocha.options.grep ||
      (mocha.options.grep &&
        mocha.options.grep.test(suite.fullTitle()) &&
        !mocha.options.invert)
    );
  }

  return {
    /**
     * This is only present if flag --delay is passed into Mocha. It triggers
     * root suite execution.
     *
     * @param {Suite} suite The root suite.
     * @returns {() => void} A function which runs the root suite
     */
    runWithSuite: function runWithSuite(suite) {
      return function run() {
        suite.run();
      };
    },

    /**
     * Execute before running tests.
     *
     * @param {string} name
     * @param {() => void} fn
     */
    before(name, fn) {
      suites[0].beforeAll(name, fn);
    },

    /**
     * Execute after running tests.
     *
     * @param {string} name
     * @param {() => void} fn
     */
    after(name, fn) {
      suites[0].afterAll(name, fn);
    },

    /**
     * Execute before each test case.
     *
     * @param {string} name
     * @param {() => void} fn
     */
    beforeEach(name, fn) {
      suites[0].beforeEach(name, fn);
    },

    /**
     * Execute after each test case.
     *
     * @param {string} name
     * @param {() => void} fn
     */
    afterEach(name, fn) {
      suites[0].afterEach(name, fn);
    },

    suite: {
      /**
       * Create an exclusive Suite; convenience function
       * See docstring for create() below.
       *
       * @param {object} opts
       * @returns {Suite}
       */
      only: function only(opts) {
        opts.isOnly = true;
        return this.create(opts);
      },

      /**
       * Create a Suite, but skip it; convenience function
       * See docstring for create() below.
       *
       * @param {object} opts
       * @returns {Suite}
       */
      skip: function skip(opts) {
        opts.pending = true;
        return this.create(opts);
      },

      /**
       * Creates a suite.
       *
       * @param {object} opts Options
       * @param {string} opts.title Title of Suite
       * @param {() => void} [opts.fn] Suite Function (not always applicable)
       * @param {boolean} [opts.pending] Is Suite pending?
       * @param {string} [opts.file] Filepath where this Suite resides
       * @param {boolean} [opts.isOnly] Is Suite exclusive?
       * @returns {Suite}
       */
      create: function create(opts) {
        const suite = Suite.create(suites[0], opts.title);
        suite.pending = Boolean(opts.pending);
        suite.file = opts.file;
        suites.unshift(suite);
        if (opts.isOnly) {
          if (mocha.options.forbidOnly && shouldBeTested(suite)) {
            throw new Error('`.only` forbidden');
          }

          suite.parent.appendOnlySuite(suite);
        }

        if (
          suite.pending &&
          mocha.options.forbidPending &&
          shouldBeTested(suite)
        ) {
          throw new Error('Pending test forbidden');
        }

        if (typeof opts.fn === 'function') {
          opts.fn.call(suite);
          suites.shift();
        } else if (opts.fn === undefined && !suite.pending) {
          throw createMissingArgumentError(
            `Suite "${suite.fullTitle()}" was defined but no callback was supplied. ` +
              `Supply a callback or explicitly skip the suite.`,
            'callback',
            'function',
          );
        } else if (!opts.fn && suite.pending) {
          suites.shift();
        }

        return suite;
      },
    },

    test: {
      /**
       * Exclusive test-case.
       *
       * @param {object} mocha
       * @param {() => void} test
       * @returns {any}
       */
      only(mocha, test) {
        test.parent.appendOnlyTest(test);
        return test;
      },

      /**
       * Pending test case.
       *
       * @param {string} title
       */
      skip(title) {
        context.test(title);
      },

      /**
       * Number of retry attempts
       *
       * @param {number} n
       */
      retries(n) {
        context.retries(n);
      },
    },
  };
};
