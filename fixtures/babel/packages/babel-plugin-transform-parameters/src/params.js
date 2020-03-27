import { template, types as t } from '@babel/core';

const buildDefaultParam = template(`
  let VARIABLE_NAME =
    arguments.length > ARGUMENT_KEY && arguments[ARGUMENT_KEY] !== undefined ?
      arguments[ARGUMENT_KEY]
    :
      DEFAULT_VALUE;
`);

const buildLooseDefaultParam = template(`
  if (ASSIGNMENT_IDENTIFIER === UNDEFINED) {
    ASSIGNMENT_IDENTIFIER = DEFAULT_VALUE;
  }
`);

const buildLooseDestructuredDefaultParam = template(`
  let ASSIGNMENT_IDENTIFIER = PARAMETER_NAME === UNDEFINED ? DEFAULT_VALUE : PARAMETER_NAME ;
`);

const buildSafeArgumentsAccess = template(`
  let $0 = arguments.length > $1 ? arguments[$1] : undefined;
`);

const iifeVisitor = {
  'ReferencedIdentifier|BindingIdentifier'(path, state) {
    const { scope, node } = path;
    const { name } = node;

    if (
      name === 'eval' ||
      (scope.getBinding(name) === state.scope.parent.getBinding(name) &&
        state.scope.hasOwnBinding(name))
    ) {
      state.needsOuterBinding = true;
      path.stop();
    }
  },
};

// eslint-disable-next-line complexity
export default function convertFunctionParams(path, loose) {
  const params = path.get('params');

  const isSimpleParameterList = params.every((param) => param.isIdentifier());
  if (isSimpleParameterList) return false;

  const { node, scope } = path;

  const state = {
    stop: false,
    needsOuterBinding: false,
    scope,
  };

  const body = [];
  const shadowedParams = new Set();

  for (const param of params) {
    for (const name of Object.keys(param.getBindingIdentifiers())) {
      const constantViolations = scope.bindings[name].constantViolations;
      if (constantViolations) {
        for (const redeclarator of constantViolations) {
          const node = redeclarator.node;
          // If a constant violation is a var or a function declaration,
          // we first check to see if it's a var without an init.
          // If so, we remove that declarator.
          // Otherwise, we have to wrap it in an IIFE.
          // eslint-disable-next-line default-case, max-depth
          switch (node.type) {
            case 'VariableDeclarator': {
              // eslint-disable-next-line max-depth
              if (node.init === null) {
                const declaration = redeclarator.parentPath;
                // The following uninitialized var declarators should not be removed
                // for (var x in {})
                // for (var x;;)
                // eslint-disable-next-line max-depth
                if (
                  !declaration.parentPath.isFor() ||
                  declaration.parentPath.get('body') === declaration
                ) {
                  redeclarator.remove();
                  break;
                }
              }

              shadowedParams.add(name);
              break;
            }

            case 'FunctionDeclaration':
              shadowedParams.add(name);
              break;
          }
        }
      }
    }
  }

  if (shadowedParams.size === 0) {
    for (const param of params) {
      if (!param.isIdentifier()) param.traverse(iifeVisitor, state);
      if (state.needsOuterBinding) break;
    }
  }

  let firstOptionalIndex = null;

  for (const [i, param] of params.entries()) {
    const paramIsAssignmentPattern = param.isAssignmentPattern();
    if (paramIsAssignmentPattern && (loose || node.kind === 'set')) {
      const left = param.get('left');
      const right = param.get('right');

      const undefinedNode = scope.buildUndefinedNode();

      if (left.isIdentifier()) {
        body.push(
          buildLooseDefaultParam({
            ASSIGNMENT_IDENTIFIER: t.cloneNode(left.node),
            DEFAULT_VALUE: right.node,
            UNDEFINED: undefinedNode,
          })
        );
        param.replaceWith(left.node);
      } else if (left.isObjectPattern() || left.isArrayPattern()) {
        const paramName = scope.generateUidIdentifier();
        body.push(
          buildLooseDestructuredDefaultParam({
            ASSIGNMENT_IDENTIFIER: left.node,
            DEFAULT_VALUE: right.node,
            PARAMETER_NAME: t.cloneNode(paramName),
            UNDEFINED: undefinedNode,
          })
        );
        param.replaceWith(paramName);
      }
    } else if (paramIsAssignmentPattern) {
      if (firstOptionalIndex === null) firstOptionalIndex = i;

      const left = param.get('left');
      const right = param.get('right');

      const defNode = buildDefaultParam({
        VARIABLE_NAME: left.node,
        DEFAULT_VALUE: right.node,
        ARGUMENT_KEY: t.numericLiteral(i),
      });
      body.push(defNode);
    } else if (firstOptionalIndex !== null) {
      const defNode = buildSafeArgumentsAccess([
        param.node,
        t.numericLiteral(i),
      ]);
      body.push(defNode);
    } else if (param.isObjectPattern() || param.isArrayPattern()) {
      const uid = path.scope.generateUidIdentifier('ref');

      const defNode = t.variableDeclaration('let', [
        t.variableDeclarator(param.node, uid),
      ]);
      body.push(defNode);

      param.replaceWith(t.cloneNode(uid));
    }
  }

  // We need to cut off all trailing parameters
  if (firstOptionalIndex !== null) {
    node.params = node.params.slice(0, firstOptionalIndex);
  }

  // Ensure it's a block, useful for arrow functions
  path.ensureBlock();

  if (state.needsOuterBinding || shadowedParams.size > 0) {
    body.push(buildScopeIIFE(shadowedParams, path.get('body').node));

    path.set('body', t.blockStatement(body));

    // We inject an arrow and then transform it to a normal function, to be
    // sure that we correctly handle this and arguments.
    const bodyPath = path.get('body.body');
    const arrowPath = bodyPath[bodyPath.length - 1].get('argument.callee');
    arrowPath.arrowFunctionToExpression();
  } else {
    path.get('body').unshiftContainer('body', body);
  }

  return true;
}

function buildScopeIIFE(shadowedParams, body) {
  const args = [];
  const params = [];

  for (const name of shadowedParams) {
    // We create them twice; the other option is to use t.cloneNode
    args.push(t.identifier(name));
    params.push(t.identifier(name));
  }

  return t.returnStatement(
    t.callExpression(t.arrowFunctionExpression(params, body), params)
  );
}
