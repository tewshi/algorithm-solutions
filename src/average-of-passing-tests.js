/** @format */
// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(T, R) {
  const groups = {};

  T.forEach((test, i) => {
    const result = R[i];
    const group = `${test}`.match(/[0-9]+/)[0];
    const groupName = `test${group}`;

    if (groups[groupName]) {
      groups[groupName].letter++;
    } else {
      groups[groupName] = { letter: 1, passed: 0 };
    }

    groups[groupName].passed += result === "OK" ? 1 : 0;
  });

  const passed = Object.keys(groups).filter(
    (group) => groups[group].letter === groups[group].passed
  );

  const value = Math.floor((passed.length * 100) / Object.keys(groups).length);

  return value;
}
// taskname groupnumber
// taskname groupnumber smallletter

// (passed / 100) * (total groups)

const T = ["test1a", "test11", "test1b", "test1c", "test3"];
const R = ["Wrong", "OK", "Error", "OK", "Limit"];

console.log(solution(T, R));
