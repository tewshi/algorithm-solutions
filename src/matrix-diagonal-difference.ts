/** @format */

const diagonalDifference = (arr: Array<Array<number>>) => {
  const size = arr.length;
  let left = 0;
  let right = 0;
  let result = 0;

  for (let i = 0, j = 0, k = size - 1; j < size; i++, j++, k--) {
    left += arr[i][j];
    right += arr[i][k];
  }

  result = Math.abs(left - right);

  return result;
};

const arr = [
  [11, 2, 4],
  [4, 5, 6],
  [10, 8, -12],
];
console.log(diagonalDifference(arr));
