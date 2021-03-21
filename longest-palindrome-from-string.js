function isPalindrome(str) {
  if (str.length <= 2) {
    return false;
  }

  const left = str.substring(0, Math.floor(str.length / 2));
  const right = str.substring(Math.ceil(str.length / 2));

  return left === right.split("").reverse().join("");
}

function longestPalindrome(str) {
  let output = "none";
  const strlen = str.length;

  for (let i = 0; i < strlen; i++) {
    for (let j = 0; j <= i; j++) {
      let word = str.substring(j, strlen - i + j);
      if (isPalindrome(word)) {
        output = word;
        break;
      }
    }

    if (output !== "none") {
      break;
    }
  }

  return output;
}

let word = "hellosannasmith";

console.log(longestPalindrome(word));
