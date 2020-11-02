import { declare } from '@babel/helper-plugin-utils';
import { template, types as t } from '@babel/core';

import transformWithoutHelper from './no-helper-implementation';

export default declare((api, options) => {
  api.assertVersion(7);

  const { loose, assumeArray } = options;

  if (loose === true && assumeArray === true) {
    throw new Error(
      `The loose and assumeArray options cannot be used together in @babel/plugin-transform-for-of`
    );
  }

  if (assumeArray) {
    return {
      name: 'transform-for-of',

      visitor: {
        ForOfStatement(path) {
          const { scope } = path;
          const { left, right, await: isAwait } = path.node;
          if (isAwait) {
            return;
          }

          const i = scope.generateUidIdentifier('i');
          let array = scope.maybeGenerateMemoised(right, true);

          const inits = [t.variableDeclarator(i, t.numericLiteral(0))];
          if (array) {
            inits.push(t.variableDeclarator(array, right));
          } else {
            array = right;
          }

          const item = t.memberExpression(
            t.cloneNode(array),
            t.cloneNode(i),
            true
          );
          let assignment;
          if (t.isVariableDeclaration(left)) {
            assignment = left;
            assignment.declarations[0].init = item;
          } else {
            assignment = t.expressionStatement(
              t.assignmentExpression('=', left, item)
            );
          }

          let blockBody;
          const body = path.get('body');
          if (
            body.isBlockStatement() &&
            Object.keys(path.getBindingIdentifiers()).some((id) =>
              body.scope.hasOwnBinding(id)
            )
          ) {
            blockBody = t.blockStatement([assignment, body.node]);
          } else {
            blockBody = t.toBlock(body.node);
            blockBody.body.unshift(assignment);
          }

          path.replaceWith(
            t.forStatement(
              t.variableDeclaration('let', inits),
              t.binaryExpression(
                '<',
                t.cloneNode(i),
                t.memberExpression(t.cloneNode(array), t.identifier('length'))
              ),
              t.updateExpression('++', t.cloneNode(i)),
              blockBody
            )
          );
        },
      },
    };
  }

  const buildForOfArray = template(`
    for (var KEY = 0, NAME = ARR; KEY < NAME.length; KEY++) BODY;
  `);

  const buildForOfLoose = template.statements(`
    for (var ITERATOR_HELPER = CREATE_ITERATOR_HELPER(OBJECT), STEP_KEY;
        !(STEP_KEY = ITERATOR_HELPER()).done;) BODY;
  `);

  const buildForOf = template.statements(`
    var ITERATOR_HELPER = CREATE_ITERATOR_HELPER(OBJECT), STEP_KEY;
    try {
      for (ITERATOR_HELPER.s(); !(STEP_KEY = ITERATOR_HELPER.n()).done;) BODY;
    } catch (err) {
      ITERATOR_HELPER.e(err);
    } finally {
      ITERATOR_HELPER.f();
    }
  `);

  const builder = loose
    ? {
        build: buildForOfLoose,
        helper: 'createForOfIteratorHelperLoose',
        getContainer: (nodes) => nodes,
      }
    : {
        build: buildForOf,
        helper: 'createForOfIteratorHelper',
        getContainer: (nodes) => nodes[1].block.body,
      };

  function _ForOfStatementArray(path) {
    const { node, scope } = path;

    const right = scope.generateUidIdentifierBasedOnNode(node.right, 'arr');
    const iterationKey = scope.generateUidIdentifier('i');

    const loop = buildForOfArray({
      BODY: node.body,
      KEY: iterationKey,
      NAME: right,
      ARR: node.right,
    });

    t.inherits(loop, node);
    t.ensureBlock(loop);

    const iterationValue = t.memberExpression(
      t.cloneNode(right),
      t.cloneNode(iterationKey),
      true
    );

    const left = node.left;
    if (t.isVariableDeclaration(left)) {
      left.declarations[0].init = iterationValue;
      loop.body.body.unshift(left);
    } else {
      loop.body.body.unshift(
        t.expressionStatement(t.assignmentExpression('=', left, iterationValue))
      );
    }

    return loop;
  }

  return {
    name: 'transform-for-of',
    visitor: {
      ForOfStatement(path, state) {
        const right = path.get('right');
        if (
          right.isArrayExpression() ||
          right.isGenericType('Array') ||
          t.isArrayTypeAnnotation(right.getTypeAnnotation())
        ) {
          path.replaceWith(_ForOfStatementArray(path));
          return;
        }

        if (!state.availableHelper(builder.helper)) {
          // Babel <7.9.0 doesn't support this helper
          transformWithoutHelper(loose, path, state);
          return;
        }

        const { node, parent, scope } = path;
        const left = node.left;

        const stepKey = scope.generateUid('step');
        const stepValue = t.memberExpression(
          t.identifier(stepKey),
          t.identifier('value')
        );

        const declar = t.isVariableDeclaration(left)
          ? t.variableDeclaration(left.kind, [
              t.variableDeclarator(left.declarations[0].id, stepValue),
            ])
          : t.expressionStatement(t.assignmentExpression('=', left, stepValue));

        // Ensure that it's a block so we can take all its statements
        path.ensureBlock();

        node.body.body.unshift(declar);

        const nodes = builder.build({
          CREATE_ITERATOR_HELPER: state.addHelper(builder.helper),
          ITERATOR_HELPER: scope.generateUidIdentifier('iterator'),
          STEP_KEY: t.identifier(stepKey),
          OBJECT: node.right,
          BODY: node.body,
        });
        const container = builder.getContainer(nodes);

        t.inherits(container[0], node);
        t.inherits(container[0].body, node.body);

        if (t.isLabeledStatement(parent)) {
          container[0] = t.labeledStatement(parent.label, container[0]);

          path.parentPath.replaceWithMultiple(nodes);
          path.remove();
        } else {
          path.replaceWithMultiple(nodes);
        }
      },
    },
  };
});
