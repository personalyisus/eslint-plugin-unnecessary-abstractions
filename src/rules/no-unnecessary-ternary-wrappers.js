module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow unnecessary ternary wrappers",
      category: "Best Practices",
      recommended: true,
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      ConditionalExpression(node) {
        // if node parent is ReturnStatement
        // check that the ancestor  ArrowFunctionExpression or FunctionDeclaration doesnt have the same identifiers
        const functionAncestor = sourceCode
          .getAncestors(node.parent)
          .reverse()
          .find(
            (ancestor) =>
              ancestor.type === "ArrowFunctionExpression" ||
              ancestor.type === "FunctionDeclaration",
          );
        if (node.parent.type === "ReturnStatement" && functionAncestor) {
          const parameters = functionAncestor.params;

          if (
            parameters.length === 3 &&
            [node.test.name, node.consequent.name, node.alternate.name].some(
              (ternaryIdentifier) => {
                return !parameters.includes(ternaryIdentifier);
              },
            )
          ) {
            context.report({
              node,
              message:
                "Don't create a function just to wrap a ternary, prefer using the ternary directly instead",
            });
          }
        } else if (node.parent.type === "ArrowFunctionExpression") {
          const parameters = node.parent.params;

          if (
            parameters.length === 3 &&
            [node.test.name, node.consequent.name, node.alternate.name].some(
              (ternaryIdentifier) => {
                return !parameters.includes(ternaryIdentifier);
              },
            )
          ) {
            context.report({
              node,
              message:
                "Don't create a function just to wrap a ternary, prefer using the ternary directly instead",
            });
          }
        }
      },
    };
  },
};
