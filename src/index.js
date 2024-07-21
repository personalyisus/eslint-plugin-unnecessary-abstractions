const noUnnecessaryTernaryWrappers = require("./rules/no-ternary-wrappers.js");

module.exports = {
  meta: {
    name: "unnecessary-abstractions",
    version: "0.1.3",
  },
  rules: {
    "no-ternary-wrappers": noUnnecessaryTernaryWrappers,
  },
};
