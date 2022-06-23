/** @type {import('eslint').Rule.RuleModule} */

/**
 * @param {import('estree').Statement} statement
 * @returns {statement is import('estree').IfStatement}
 */
function isLonelyIfStatement(statement) {
  return statement.type === 'IfStatement' && statement.alternate === null;
}

module.exports = {
  meta: {
    docs: {
      description:
        'Prefer early returns over full-body conditional wrapping in function declarations.',
      category: 'Best Practices',
      recommended: false,
      uri: 'https://github.com/cloudfour/eslint-config/blob/main/src/rules/prefer-early-return/README.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maximumStatements: {
            type: 'integer',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || { maximumStatements: 2 };
    const maxStatements = options.maximumStatements;

    /** @param {import('estree').Statement} consequent */
    function isOffendingConsequent(consequent) {
      return (
        (consequent.type === 'ExpressionStatement' && maxStatements === 0) ||
        (consequent.type === 'BlockStatement' &&
          consequent.body.length > maxStatements)
      );
    }

    /** @param {import('estree').Statement} statement */
    function isOffendingIfStatement(statement) {
      return (
        isLonelyIfStatement(statement) &&
        isOffendingConsequent(statement.consequent)
      );
    }

    /** @param {import('estree').BlockStatement} functionBody */
    function hasSimplifiableConditionalBody(functionBody) {
      const body = functionBody.body;
      return (
        functionBody.type === 'BlockStatement' &&
        body.length === 1 &&
        isOffendingIfStatement(body[0])
      );
    }

    /** @param {import('estree').FunctionDeclaration} functionNode */
    function checkFunctionBody(functionNode) {
      const body = functionNode.body;

      if (hasSimplifiableConditionalBody(body)) {
        context.report(
          body,
          'Prefer an early return to a conditionally-wrapped function body'
        );
      }
    }

    return {
      FunctionDeclaration: checkFunctionBody,
      FunctionExpression: checkFunctionBody,
      ArrowFunctionExpression: checkFunctionBody,
    };
  },
};
