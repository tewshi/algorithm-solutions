/**
 * Create a function that returns the sum of the values of a generator.
 */
function* gen(): Generator<number> {
  for (let i = 0; i < 5; i++) {
    yield i;
  }
}

const myGen = gen();

function rec(g: any): number {
  const next = g.next()
  if (next.done) {
    return 0;
  } else {
    return next.value + rec(g);
  }
}

console.log(rec(myGen));
