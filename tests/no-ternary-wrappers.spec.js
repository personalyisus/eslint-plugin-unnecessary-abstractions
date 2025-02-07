const { RuleTester } = require("eslint");
const noUnnecessaryTernaryWrappers = require("../src/rules/no-ternary-wrappers.js");

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  languageOptions: { ecmaVersion: 2015 },
});

ruleTester.run("no-ternary-wrappers", noUnnecessaryTernaryWrappers, {
  valid: [
    {
      code: `const someFunction = (a, b, c) => {
      return Math.max(a, b, c); };`,
    },
    // Using Math.max with three parameters
    {
      code: "function maxOfThree(a, b, c) { return Math.max(a, b, c); }",
    },
    {
      code: "const maxOfThree = (a, b, c) => Math.max(a, b, c);",
    },
    // Using Array.prototype.reduce
    {
      code: "function sumArray(arr) { return arr.reduce((acc, val) => acc + val, 0); }",
    },
    {
      code: "const sumArray = arr => arr.reduce((acc, val) => acc + val, 0);",
    },
    // Creating an array from parameters and performing reduce operation
    {
      code: "function sumOfThree(a, b, c) { return [a, b, c].reduce((acc, val) => acc + val, 0); }",
    },
    {
      code: "const sumOfThree = (a, b, c) => [a, b, c].reduce((acc, val) => acc + val, 0);",
    },
    // Mapping over an array
    {
      code: "function doubleValues(arr) { return arr.map(x => x * 2); }",
    },
    {
      code: "const doubleValues = arr => arr.map(x => x * 2);",
    },
    // Filtering an array
    {
      code: "function filterEvens(arr) { return arr.filter(x => x % 2 === 0); }",
    },
    {
      code: "const filterEvens = arr => arr.filter(x => x % 2 === 0);",
    },
    // Because we do other stuff apart from returning the ternary,
    // we TECHNICALLY don't have an unnecessary abstraction.
    {
      code: "const technicallyValid = (a, b, c) => { var max = Math.max(a, b, c); return a ? b : c;}",
    },
    // Some extra cases
    // Valid cases where the rule should not trigger

    // No function abstraction wrapping ternary
    {
      code: `const result = isRightHanded ? user.rightHand : user.leftHand;`,
    },

    // Functions that return a wrapped ternary but use externally declared variables,
    // either partially or completely, so they should be valid
    {
      name: "valid: completely externally defined symbols ternary",
      code: `
        function chooseHand() {
          return isRightHanded ? globalRightHand : globalLeftHand;
        }
      `,
    },
    {
      name: "valid: partially externally defined symbols ternary",
      code: `
        function chooseHand(localRightHand) {
          return isRightHanded ? localRightHand : globalLeftHand;
        }
      `,
    },
    // A function that does not return a ternary
    {
      code: `function add(a, b) { return a + b; }`,
    },

    // A function that returns a wrapped ternary but after doing some significant
    // alterations of the arguments used for the ternary
    {
      code: `
        function processHandData(rightHanded, rightHand, leftHand) {
          const processedRightHand = rightHand.trim();
          const processedLeftHand = leftHand.toLowerCase();
          return rightHanded ? processedRightHand : processedLeftHand;
        }
      `,
    },

    // Function wrapping a ternary but with other logic
    {
      code: `
        function getHand(rightHanded, rightHand, leftHand) {
          const hand = rightHanded ? rightHand : leftHand;
          return hand.toUpperCase();
        }
      `,
    },
    // This should be valid as well since we're not only returning the ternary
    // but instead we're doing some other stuff
    // However there should be an option to flag this as a possible error
    // TODO: Add an option to flag this as a possible error
    {
      name: "valid: Some other contrived ternary wrapper",
      code: `export const someContrivedTernary = (
                someFirstValue,
                someEnum,
                labels
              )=>
                typeof _.get(labels, [someFirstValue]) === 'string'
                  ? _.get(labels, [someFirstValue], labels.default)
                  : _.get(labels, [someFirstValue, someEnum], labels.default);`,
    },
    // These three functions are valid for now but there should
    // really be an option to flag this as a possible error,
    // since no meaningful operations are being done there
    // TODO: Add an option to flag this as a possible error
    {
      code: `
        function getHandWithLog(rightHanded, rightHand, leftHand) {
          console.log('Determining hand');
          return rightHanded ? rightHand : leftHand;
        }
      `,
    },

    // Function with unused variables trying to bypass the rule
    // TODO: Add an option to flag this as a possible error
    {
      code: `
        function chooseHandWithExtras(rightHanded, rightHand, leftHand) {
          const extra = 'extra logic';
          return rightHanded ? rightHand : leftHand;
        }
      `,
    },

    // Function indirectly wrapping a ternary with unnecessary indirection
    // TODO: Add an option to flag this as a possible error
    {
      code: `
        function getChoice(optionA, optionB, condition) {
          const result = condition ? optionA : optionB;
          return result;
        }
      `,
    },
  ],
  invalid: [
    // more cases for completion's sake
    // Invalid cases where the rule should trigger

    // Simple function wrapping a ternary
    {
      code: `
        function isUserRightHanded(rightHanded, rightHand, leftHand) {
          return rightHanded ? rightHand : leftHand;
        }
      `,
      errors: 1,
    },

    // Arrow function wrapping a ternary
    {
      code: `const isUserRightHanded = (rightHanded, rightHand, leftHand) => rightHanded ? rightHand : leftHand;`,
      errors: 1,
    },

    // Function declaration wrapping a ternary
    {
      code: `
        function chooseHand(rightHanded, rightHand, leftHand) {
          return rightHanded ? rightHand : leftHand;
        }
      `,
      errors: 1,
    },
    {
      name: "Arrow function with brackets around the return statement",
      code: `const someFunction = (a, b, c) => {return a ? b : c};`,
      errors: 1,
    },
    {
      name: "jarrow function without brackets around the return statement",
      code: `const someFunction = (a, b, c) => a ? b : c;`,
      errors: 1,
    },
    {
      name: "normal function with brackets around the return statement",
      code: `function someFunction(a, b, c) { return a ? b : c}`,
      errors: 1,
    },
    {
      name: "Arrow function that returns a sequence expression",
      code: `const sneaky = (a, b, c)=> (1, a ? b : c);`,
      errors: 1,
    },
    {
      name: "normal function that returns a squence expression",
      code: `
        function sneaky(test, left, right){
          return 1,test ? left : right;
        }
      `,
      errors: 1,
    },
  ],
});
