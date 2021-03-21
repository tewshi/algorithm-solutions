/** @format */
// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(A, B, P) {
  // write your code in JavaScript (Node.js 8.9.4)
  const matches = [];

  B.forEach((phone, index) => {
    if (phone.match(P)) {
      matches.push(A[index]);
    }
  });

  if (matches.length === 0) {
    return "NO CONTACT";
  }

  return matches.sort((a, b) => a.localeCompare(b))[0];
}

// todo: names = A[]
// todo: phones = B[]

// todo: returns only one
// todo: returns 'NO CONTACT'
console.log(
  solution(
    ["michael", "sander", "anny", "ann"],
    ["1111", "1234", "12443", "128"],
    "11"
  )
);
