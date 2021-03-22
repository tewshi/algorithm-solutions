// https://leetcode.com/problems/longest-common-prefix/

// Write a function to find the longest common prefix string amongst an array of strings.

// If there is no common prefix, return an empty string "".

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  const len = strs.length;
  if (len === 0) {
    return "";
  }

  const first = strs[0].split("");
  if (len === 1) {
    return first.join("");
  }

  let prefix = [];
  for (let i = 0; i < first.length; i++) {
    const alpha = first[i];
    const isCommon = strs.every(function (str) {
      return str[i] === alpha;
    });

    if (isCommon) {
      prefix.push(alpha);
    } else {
      break;
    }
  }

  return prefix.join("");
};

console.log(longestCommonPrefix(["frank", "france", "fnca"]));
console.log(longestCommonPrefix(["frank", "france", "franca"]));
console.log(longestCommonPrefix(["flower", "flow", "flight"]));
console.log(longestCommonPrefix(["dog", "racecar", "car"]));
console.log(longestCommonPrefix(["dog"]));
console.log(longestCommonPrefix([""]));
console.log(longestCommonPrefix([]));
