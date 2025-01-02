const errorMessages = {
  UNNECESSARY_TERNARY_WRAPPER:
    "This is an unnecessary abstraction. Prefer using the ternary expression directly instead of wrapping it in a function.",
};

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Points out unnecessary ternary wrappers",
      category: "Best Practices",
      recommended: true,
    },
  },
  create(context) {
    // ContextObject

    const info = {
      significantOperations: false,
    };

    const blockStatementCheck = (node) => {
      //If there are significant operations then we dont have to check anything
      if (info.significantOperations) return;

      // If the node.parent.type isn't one that
      // interests us, we don't need to do anything
      const applicableParentTypes = [
        "FunctionExpression",
        "ArrowFunctionExpression",
        "MethodDefinition",
        "FunctionDeclaration",
      ];

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
          message: errorMessages.UNNECESSARY_TERNARY_WRAPPER,
        });
      }
    };

    const arrowFunctionCheck = (node) => {
      //If there are significant operations then we dont have to check anything
      if (info.significantOperations) return;

      // If the only child of the arrow function
      // is a ternary expression, report an error
      if (node.body.type === "ConditionalExpression") {
        context.report({
          node,
          message: errorMessages.UNNECESSARY_TERNARY_WRAPPER,
        });
      }
    };

    //Yisustodo: use this method to set info.significantOperations
    //to true if there are significant operations
    //like mutations or some assignments, side effects, etc

    /**
     * Checks if there are any significant operations
     * like assignments, calls, or other transformations
     * done on the arguments of the ternary
     * @returns {boolean} whether or not there are any significant operations
     * */
    const checkIfSignificantOperations = () => {};

    return {
      "BlockStatement:exit": blockStatementCheck,
      "ArrowFunctionExpression:exit": arrowFunctionCheck,
    };
  },
};
