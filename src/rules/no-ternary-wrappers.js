const errorMessages = {
  UNNECESSARY_TERNARY_WRAPPER:
    "This is an unnecessary abstraction. Prefer using the ternary expression directly instead of wrapping it in a function.",
};

/**
 * Checks if an identifier name is part of the parameters
 * of the function node that was provided
 * @param {string} identifierName The identifier name to be checked
 * @param {ASTNode} functionNode The node to be checked for it's parameters if its an appropriate node
 * @returns {boolean} whether the identifier name has the same name as one of the parameters
 */
const checkIfLocalParam = (identifierName, functionNode) => {
  if (!identifierName) {
    throw Error("A valid identifierName was not provided");
  }
  const validFunctionNodeTypes = [
    "FunctionExpression",
    "ArrowFunctionExpression",
    "FunctionDeclaration",
  ];

  if (!validFunctionNodeTypes.includes(functionNode.type)) {
    throw Error("The checked node is not a valid function node");
  }

  return functionNode.params.some((param) => param.name === identifierName);
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

    const arrowOrNormalFunctionCheck = (functionNode) => {
      //If there are significant operations then we dont have to check anything
      if (info.significantOperations) return;

      let ternary;

      if (functionNode.body.type === "ConditionalExpression") {
        ternary = functionNode.body;
      }

      if (functionNode.body.type === "BlockStatement") {
        const bodyElements = functionNode.body.body;
        if (
          bodyElements.length === 1 &&
          bodyElements[0].type === "ReturnStatement" &&
          bodyElements[0].argument?.type === "ConditionalExpression"
        ) {
          ternary = bodyElements[0].argument;
        }
      }

      if (ternary) {
        const onlyIdentifiersInTernary = [
          ternary.test,
          ternary.consequent,
          ternary.alternate,
        ].every((x) => x.type === "Identifier");

        if (!onlyIdentifiersInTernary) return;

        const ternaryFromArguments = [
          ternary.test.name,
          ternary.consequent.name,
          ternary.alternate.name,
        ].every((identifierName) =>
          checkIfLocalParam(identifierName, functionNode),
        );
        if (ternaryFromArguments) {
          context.report({
            node: functionNode,
            message: errorMessages.UNNECESSARY_TERNARY_WRAPPER,
          });
        }
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
      "ArrowFunctionExpression:exit": arrowOrNormalFunctionCheck,
      "FunctionExpression:exit": arrowOrNormalFunctionCheck,
      "FunctionDeclaration:exit": arrowOrNormalFunctionCheck,
    };
  },
};
