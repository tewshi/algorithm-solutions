// https://leetcode.com/problems/longest-common-prefix/

// Write a function to find the longest common prefix string amongst an array of strings.

// If there is no common prefix, return an empty string "".

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) {
    return "";
  } else if (strs.length === 1) {
    return strs[0];
  }

  let prefix = "";
  const first = strs[0];
  for (let i = 0; i < first.length; i++) {
    const isCommon = strs.every(function (str) {
      return str[i] === first[i];
    });

    if (isCommon) {
      prefix += first[i];
    } else {
      break;
    }
  }

  return prefix;
};

console.log(longestCommonPrefix(["frank", "france", "fnca"]));
