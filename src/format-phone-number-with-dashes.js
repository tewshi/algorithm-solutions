/** @format */
function solution(S) {
  // write your code in JavaScript (Node.js 8.9.4)
  const result = S.replace(/[^0-9]/g, "");
  const splits = [];

  for (let i = 0; i < result.length; i += 3) {
    splits.push(result.substring(i, i + 3));
  }

  const last = splits[splits.length - 1];

  if (splits.length > 1 && last.length === 1) {
    splits[splits.length - 1] = `${splits[splits.length - 2].substring(
      2
    )}${last}`;
    splits[splits.length - 2] = splits[splits.length - 2].substring(0, 2);
  }

  return splits.join("-");
}

console.log(solution("022-298324"));
