/** @format */

const getChange = (M, P) => {
  const denominations = [1, 5, 10, 25, 50, 100];
  const results = [0, 0, 0, 0, 0, 0];

  let diff = M * 100 - P * 100;

  while (diff > 0) {
    if (diff > denominations[5]) {
      diff -= denominations[5];
      results[5]++;
    } else if (diff >= denominations[4]) {
      diff -= denominations[4];
      results[4]++;
    } else if (diff >= denominations[3]) {
      diff -= denominations[3];
      results[3]++;
    } else if (diff >= denominations[2]) {
      diff -= denominations[2];
      results[2]++;
    } else if (diff >= denominations[1]) {
      diff -= denominations[1];
      results[1]++;
    } else if (diff >= denominations[0]) {
      diff -= denominations[0];
      results[0]++;
    }
  }

  return results;
};

console.log(getChange(4.01, 4)); // should return [1,0,0,0,0,0]
console.log(getChange(5, 0.99)); // should return [1,0,0,0,0,4]
console.log(getChange(3.14, 1.99)); // should return [0,1,1,0,0,1]
console.log(getChange(4, 3.14)); // should return [1,0,1,1,1,0]
console.log(getChange(0.45, 0.34)); // should return [1,0,1,0,0,0]
