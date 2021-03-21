/** @format */
// solved by moses

const findWord = (arr) => {
  let mapping = {};
  let position = {};
  for (let i = 0; i < arr.length; i++) {
    let data = arr[i].split(">");
    mapping[data[0]] = data[1];
    if (position[data[0]]) {
      delete position[data[0]];
    } else {
      position[data[0]] = "start";
    }
    if (position[data[1]]) {
      delete position[data[1]];
    } else {
      position[data[1]] = "end";
    }
  }
  // get start and end
  let [start, end] = ["", ""];
  for (let pos in position) {
    if (position[pos] === "start") {
      start = pos;
    } else {
      end = pos;
    }
  }
  let starter = start;
  while (true) {
    if (!mapping[starter]) {
      break;
    }
    start += mapping[starter];
    starter = mapping[starter];
  }
  return start;
};

let x = ["R>U", "E>R", "P>E"];
console.log(findWord(x));
x = ["I>N", "A>I", "P>A", "S>P"];
console.log(findWord(x));
x = ["U>N", "G>A", "R>Y", "H>U", "N>G", "A>R"];
console.log(findWord(x));
x = ["I>F", "W>I", "S>W", "F>T"];
console.log(findWord(x));
x = ["R>T", "A>L", "P>O", "O>R", "G>A", "T>U", "U>G"];
console.log(findWord(x));
x = ["W>I", "R>L", "T>Z", "Z>E", "S>W", "E>R", "L>A", "A>N", "N>D", "I>T"];
console.log(findWord(x));
