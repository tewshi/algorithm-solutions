/** @format */

const fibo = (max = 100) => {
  const result = [1, 2];
  const even = [2];
  for (let i = 2; result.length < max; i++) {
    const num = result[i - 2] + result[i - 1];
    result.push(num);
    if (num % 2 === 0) {
      even.push(num);
    }
  }

  return even.reduce((acc, curr) => acc + curr, 0);
};

// console.log(fibo(10))
console.log(fibo(400));
