const arrowFunctionCheck = (node, context) => {
  // If the only child of the arrow function
  // is a ternary expression, report an error
  if (node.body.type === "ConditionalExpression") {
    context.report({
      node,
      message:
        "This is an unnecessary abstraction. Prefer using the ternary expression directly instead of wrapping it in a function.",
    });
  }
};

const blockStatementCheck = (node, context) => {
  const applicableParentTypes = [
    "FunctionExpression",
    "ArrowFunctionExpression",
    "MethodDefinition",
    "FunctionDeclaration",
  ];

  // If the node.parent.type isn't one that
  // interests us, we don't need to do anything
  if (!applicableParentTypes.includes(node.parent.type)) {
    return;
  }

  // If the only child of the function
  // is a ternary expression, report an error
  if (
    node.body.length === 1 &&
    node.body[0].type === "ReturnStatement" &&
    node.body[0].argument.type === "ConditionalExpression"
  ) {
    context.report({
      node,
      message:
        "This is an unnecessary abstraction. Prefer using the ternary expression directly instead of wrapping it in a function.",
    });
  }
};

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Point out unnecessary ternary wrappers",
      category: "Best Practices",
      recommended: true,
    },
  },
  create(context) {
    return {
      BlockStatement(node) {
        blockStatementCheck(node, context);
      },
      ArrowFunctionExpression(node) {
        arrowFunctionCheck(node, context);
      },
    };
  },
};
