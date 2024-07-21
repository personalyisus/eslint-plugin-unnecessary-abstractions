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
        // First check that all the elements of the ternary arent identifiers
        if (
          node.test.type !== "Identifier" ||
          node.consequent.type !== "Identifier" ||
          node.alternate.type !== "Identifier"
        ) {
          return;
        }

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
          const parameters = functionAncestor.params.map((param) => param.name);

          const { body: blockStatement } = functionAncestor;

          const functionBlockElements = blockStatement.body;

          // If all three ternary identifiers are part of the function parameters
          // report an error
          if (
            functionBlockElements.length === 1 &&
            parameters.length === 3 &&
            [node.test.name, node.consequent.name, node.alternate.name].every(
              (ternaryIdentifier) => {
                return parameters.includes(ternaryIdentifier);
              },
            )
          ) {
            context.report({
              node,
              message:
                "This is an unnecessary abstraction. Prefer using the ternary expression directly instead of wrapping it in a function.",
            });
          }
        } else if (node.parent.type === "ArrowFunctionExpression") {
          const parameters = node.parent.params.map((param) => param.name);

          if (
            parameters.length === 3 &&
            [node.test.name, node.consequent.name, node.alternate.name].every(
              (ternaryIdentifier) => {
                return parameters.includes(ternaryIdentifier);
              },
            )
          ) {
            context.report({
              node,
              message:
                "This is an unnecessary abstraction. Prefer using the ternary expression directly instead of wrapping it in a function.",
            });
          }
        }
      },
    };
  },
};
