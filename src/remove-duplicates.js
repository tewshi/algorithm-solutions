/**
 * @format
 * @param {number[]} nums
 * @return {number}
 */

var removeDuplicates = function (nums) {
  const unique = {};

  for (let i = 0; i < nums.length; i++) {
    let n = nums[i];
    unique[n] = true;
  }

  return Object.keys(unique);
};

let nums = [1, 9, 1, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6];

console.log(((s) => [...new Set(s)])(nums));
console.log(removeDuplicates(nums));
