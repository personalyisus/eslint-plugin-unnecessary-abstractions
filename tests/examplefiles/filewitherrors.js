function technicallyValid(a, b, c) {
  console.log(a, b, c);
  return a ? b : c;
}

const invalid = (a, b, c) => {
  return a ? b : c;
};

const alsoInvalid = (a, b, c) => (a ? b : c);
