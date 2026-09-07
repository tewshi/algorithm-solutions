# algorithm-solutions
All solved problems

## Setup

Requires Node 22.6+ (tested on Node 26), which runs `.ts` files natively by
stripping types — no `ts-node` or build step involved.

```
npm install
```

## Usage

Run a solution with nodemon, which re-runs it whenever a file in `src` changes:

```
npm run dev -- src/run-length-encoding.ts
```

Works for `.js` files too:

```
npm run dev -- src/fibo.js
```

To run a file once without watching:

```
node src/run-length-encoding.ts
```

Type-check everything in `src`:

```
npm run typecheck
```

## Notes

Node strips types rather than compiling them, so syntax that needs real code
generation won't run: `enum`, `namespace`, and constructor parameter properties.
`erasableSyntaxOnly` is on in `tsconfig.json`, so your editor and
`npm run typecheck` flag these before you hit them at runtime.
