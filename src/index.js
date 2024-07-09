const noUnnecessaryTernaryWrappers = require("./rules/no-unnecessary-ternary-wrappers.js");

module.exports = {
  meta: {
    name: "unnecessary-abstractions",
    version: "0.1.0",
  },
  rules: {
    "no-ternary-wrappers": noUnnecessaryTernaryWrappers,
  },
};
