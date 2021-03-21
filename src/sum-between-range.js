/** @format */

const sumBetween = (a, b) => {
  let total = 0;
  for (let i = Math.min(a, b); i < Math.max(a, b); i++) {
    if (i % 3 === 0 || i % 5 === 0) {
      total += i;
    }
  }
  return total;
};

console.log(sumBetween(1, 10));
