/** @format */

const findWord = (arr) => {
  const sorted = [];
  const map = {};
  let next = "";

  arr.forEach((rule) => {
    const [a, _, b] = rule.split("");
    if (!next) {
      const isFirst = arr.every((x) => x[2] !== a);
      if (isFirst) {
        next = a;
      }
    }
    map[a] = b;
  });

  const filtered = Object.keys(map);

  sorted.push(next);

  for (let i = 0; i <= filtered.length; i++) {
    sorted.push(map[next]);
    next = map[next];
  }

  return sorted.join("");
};

let x = ["R>U", "P>E", "E>R"];
let word = findWord(x);
console.log(word);
x = ["P>A", "I>N", "A>I", "S>P"];
word = findWord(x);
console.log(word);
x = ["U>N", "G>A", "R>Y", "H>U", "N>G", "A>R"];
word = findWord(x);
console.log(word);
x = ["S>W", "F>T", "I>F", "W>I"];
word = findWord(x);
console.log(word);
x = ["P>O", "O>R", "G>A", "T>U", "U>G", "R>T", "A>L"];
word = findWord(x);
console.log(word);
x = ["W>I", "R>L", "T>Z", "Z>E", "S>W", "E>R", "L>A", "A>N", "N>D", "I>T"];
word = findWord(x);
console.log(word);
