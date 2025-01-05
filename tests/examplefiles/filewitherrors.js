// Valid

let test, left, right;
const validByUsingGlobalStuff = () => {
  return test ? left : right;
};

function validByUsingLocalStuff(test, left, right) {
  const sum = left + right;
  const max = Math.max(left, right);

  return test ? sum : max;
}

function technicallyValid(a, b, c) {
  console.log(a, b, c);
  return a ? b : c;
}

// Invalid

(a, b, c) => (a ? b : c);

const arrowNoBrackets = (a, b, c) => (a ? b : c);

const arrowBrackets = (a, b, c) => {
  return a ? b : c;
};

function normalFunc(a, b, c) {
  return a ? b : c;
}
