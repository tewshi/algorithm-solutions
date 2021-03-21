/** @format */
// by moses

const getChange = (M, P) => {
  const denominations = [1, 5, 10, 25, 50, 100];
  const results = [0, 0, 0, 0, 0, 0];

  let dif = M * 100 - P * 100;

  results[5] = Math.floor(dif / denominations[5]);
  dif = dif % denominations[5];
  results[4] = Math.floor(dif / denominations[4]);
  dif = dif % denominations[4];
  results[3] = Math.floor(dif / denominations[3]);
  dif = dif % denominations[3];
  results[2] = Math.floor(dif / denominations[2]);
  dif = dif % denominations[2];
  results[1] = Math.floor(dif / denominations[1]);
  dif = dif % denominations[1];
  results[0] = Math.floor(dif / denominations[0]);
  dif = dif % denominations[0];

  return results;
};

console.log(getChange(4.01, 4)); // should return [1,0,0,0,0,0]
console.log(getChange(5, 0.99)); // should return [1,0,0,0,0,4]
console.log(getChange(3.14, 1.99)); // should return [0,1,1,0,0,1]
console.log(getChange(4, 3.14)); // should return [1,0,1,1,1,0]
console.log(getChange(0.45, 0.34)); // should return [1,0,1,0,0,0]
