/** @format */

const plusMinus = (arr: Array<number>) => {
  const size = arr.length;
  let positives = 0,
    avgPositives = "";
  let negatives = 0,
    avgNegatives = "";
  let zeros = 0,
    avgZeros = "";

  arr.forEach((x) => {
    if (x < 0) {
      negatives++;
    } else if (x > 0) {
      positives++;
    } else {
      zeros++;
    }
  });

  avgPositives = (positives / size).toPrecision(6);
  avgNegatives = (negatives / size).toPrecision(6);
  avgZeros = (zeros / size).toPrecision(6);

  console.log(avgPositives);
  console.log(avgNegatives);
  console.log(avgZeros);
};

const array = [-4, 3, -9, 0, 4, 1];

plusMinus(array);
