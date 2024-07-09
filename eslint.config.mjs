import unnecessaryAbstractions from "./src/index.js";

export default [
  {
    plugins: { "unnecessary-abstractions": unnecessaryAbstractions },
    rules: {
      "unnecessary-abstractions/no-ternary-wrappers": "error",
    },
  },
];
