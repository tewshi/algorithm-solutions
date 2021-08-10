function* gen() {
	for (let i = 0; i < 5; i++) {
		yield i;
	}
}

const myGen = gen();

function rec(g) {
	const next = g.next()
	if (next.done) {
		return 0;
	}

	return next.value + rec(g);
}

console.log(rec(myGen));
