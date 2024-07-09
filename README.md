# eslint-plugin-unnecessary-abstractions

This is a simple ESLint plugin which includes rules to help detect the unnecessary use of certain code abstractions.
## Rules
### no-ternary-wrappers

```javascript
// Incorrect ❌
function isUserRightHanded(rightHanded, rightHand, leftHand) {
  return rightHanded ? rightHand : leftHand; // Don't create a function just to wrap a ternary
}

useHand(isUserRightHanded(isRightHandedUser, user.rightHand, user.leftHand));

// Correct ✅ 
useHand(isRightHandedUser ? user.rightHand : user.leftHand); // Use the ternary directly

```

## Installation

Install it as part of your devDependencies
```sh
npm i --save-dev eslint-plugin-unnecessary-abstractions
```

### ESLint 9
Import the plugin and add it as a configuration object to the array of configurations on your ESLint  configuration file, including the rules you want to use
```js
// eslint.config.js
import unnecessaryAbstractions from "eslint-plugin-unnecessary-abstractions";

export default [
  // ... other configurations
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
  // Add the plugin to the list
  plugins: [/* ... */ , "unnecessary-abstractions"],
  rules: {
    // Add the rules you want
    "unnecessary-abstractions/no-ternary-wrappers": "warn" // or "error
  },
};

```
