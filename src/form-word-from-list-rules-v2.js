/** @format */

const findWord = (arr) => {
  const filtered = [];
  const sorted = [];
  const map = {};

  let first = "";
  let last = "";

  arr.forEach((rule) => {
    const [a, _, b] = rule.split("");
    if (!filtered.includes(a)) {
      filtered.push(a);
      if (!first) {
        const isFirst = arr.every((x) => x[2] !== a);
        if (isFirst) {
          first = a;
        }
      }
    }
    if (!filtered.includes(b)) {
      filtered.push(b);
      if (!last) {
        const isLast = arr.every((x) => x[0] !== b);
        if (isLast) {
          last = b;
        }
      }
    }

    map[a] = b;
  });

  filtered.splice(filtered.indexOf(first), 1);
  filtered.splice(filtered.indexOf(last), 1);
  sorted.push(first, last);

  let current = first;
  for (let i = 0; i < filtered.length; i++) {
    sorted.splice(i + 1, 0, map[current]);
    current = map[current];
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
