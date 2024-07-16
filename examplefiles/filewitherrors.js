function foo(a, b, c) {
  console.log(a, b, c);
  return a ? b : c;
}

const lmao = (a, b, c) => {
  return a ? b : c;
};

const lolazo = (a, b, c) => (a ? b : c);
