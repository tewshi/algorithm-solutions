function runLength(inp: string): string {
  if (!inp) return inp;
  
  const options = inp.split('')
  let result = '';
  const mapped: Record<string, number> = {};

  options.reduce((acc, curr, i) => {
    if (!acc[curr]) {
      acc[curr] = 0;
    }

    acc[curr]++;

    if (i > 0 && curr === options[i - 1]) {}

    return acc;
  }, mapped);

  console.log(mapped);
  

  return result;
}

console.log(runLength('abcdeee'));

