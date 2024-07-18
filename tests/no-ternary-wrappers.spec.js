const { RuleTester } = require("eslint");
const noUnnecessaryTernaryWrappers = require("../src/rules/no-unnecessary-ternary-wrappers.js");

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
    // This should be valid as well since we're not only returning the ternary
    // but instead we're doing some other stuff
    // However there should be an option to flag this as a possible error
    {
      code: `export const getSwitchTextByCampaignStrategy = (
  campaignGoalStrategy,
  campaignGoalType,
  labels
)=>
  typeof _.get(labels, [campaignGoalStrategy]) === 'string'
    ? _.get(labels, [campaignGoalStrategy], labels.default)
    : _.get(labels, [campaignGoalStrategy, campaignGoalType], labels.default);`,
    },
  ],
  invalid: [
    {
      name: "(a) Arrow function with brackets around the return statement",
      code: `const someFunction = (a, b, c) => {return a ? b : c};`,
      errors: 1,
    },
    {
      name: "(a)Arrow function without brackets around the return statement",
      code: `const someFunction = (a, b, c) => a ? b : c;`,
      errors: 1,
    },
    {
      name: "(a)normal function without brackets around the return statement",
      code: `function someFunction(a, b, c) { return a ? b : c}`,
      errors: 1,
    },
    {
      name: "(b) Arrow function with brackets around the return statement",
      code: `const someFunction = (a, b, c) => {return b ? a : c};`,
      errors: 1,
    },
    {
      name: "(b)Arrow function without brackets around the return statement",
      code: `const someFunction = (a, b, c) => b ? a : c;`,
      errors: 1,
    },
    {
      name: "(b)normal function without brackets around the return statement",
      code: `function someFunction(a, b, c) { return b ? a : c}`,
      errors: 1,
    },
    {
      name: "(c) Arrow function with brackets around the return statement",
      code: `const someFunction = (a, b, c) => {return c ? b : a};`,
      errors: 1,
    },
    {
      name: "(c)Arrow function without brackets around the return statement",
      code: `const someFunction = (a, b, c) => c ? b : a;`,
      errors: 1,
    },
    {
      name: "(c)normal function without brackets around the return statement",
      code: `function someFunction(a, b, c) { return c ? b : a}`,
      errors: 1,
    },
  ],
});
