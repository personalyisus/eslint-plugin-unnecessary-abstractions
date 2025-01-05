# eslint-plugin-unnecessary-abstractions

This ESLint plugin provides rules to detect and prevent some unnecessary code abstractions.
## Rules
### no-ternary-wrappers


Creating functions to abstract ternaries used only once or twice is considered bad practice. 

Rather than reducing or effectively hiding complexity, this adds unnecessary overhead and can result in less maintainable code.

```javascript
// Incorrect: Don't create a function just to wrap a ternary ❌  
function getMainHand(userIsRightHanded, rightHand, leftHand) {
  return userIsRightHanded ? rightHand : leftHand;
  // Unnecessary abstraction:
  // Use the ternary expression directly
  // instead of wrapping it in a function.
}

const mainHand = getMainHand(userIsRightHanded, user.rightHand, user.leftHand);

------------------------------------

// Correct: Use the ternary directly ✅ 
const mainHand = userIsRightHanded ? user.rightHand : user.leftHand;

```

## Installation

Install it as part of your `devDependencies`
```sh
npm i --save-dev eslint-plugin-unnecessary-abstractions
```

### ESLint 9
Import the plugin and add it as a configuration object to the array of configurations on your ESLint  configuration file, including the rules you want to use
```js
// eslint.config.js
import unnecessaryAbstractions from "eslint-plugin-unnecessary-abstractions";

export default [
  {
    // ... other configurations
  },
  {
    plugins: { "unnecessary-abstractions": unnecessaryAbstractions },
    rules: {
       // Add the desired rule
      "unnecessary-abstractions/no-ternary-wrappers": "warn" // or "error",
    },
  },
];
```

### ESLint 8 

Add `"unnecessary-abstractions"` to the plugins array of your ESLint configuration and include the rules you want to use
```js
// .eslintrc.js

module.exports = {
  // Add the plugin to the plugins array
  plugins: [/* ... */ , "unnecessary-abstractions"],
  rules: {
    // Add the rules you want
    "unnecessary-abstractions/no-ternary-wrappers": "warn" // or "error"
  },
};

```
