/**
 * Tiny drill harness. Verifies a solution against explicit cases and,
 * optionally, against a brute-force reference on randomized input.
 *
 *   import { drill } from "./_drill";
 *   drill("twoSum", twoSum, {
 *     cases: [{ args: [[2,7,11,15], 9], want: [0,1] }],
 *     reference: bruteForce,
 *     gen: (r) => [randomArray(r), r()],
 *   });
 */

type AnyFn = (...args: never[]) => unknown;

type Case<F extends AnyFn> = {
  args: Parameters<F>;
  want?: ReturnType<F>;
  /** Use instead of `want` when several outputs are acceptable. */
  ok?: (got: ReturnType<F>, args: Parameters<F>) => boolean;
  note?: string;
};

type Opts<F extends AnyFn> = {
  cases: Case<F>[];
  /** Known-correct (possibly slow) implementation for differential testing. */
  reference?: F;
  /** Produces random args; called with a seeded [0,1) rng. Needs `reference`. */
  gen?: (rng: () => number) => Parameters<F>;
  trials?: number;
};

const show = (v: unknown): string =>
  typeof v === "string" ? JSON.stringify(v) : Array.isArray(v) ? `[${v.map(show).join(",")}]` : String(v);

/** Deterministic rng — a failing trial must be reproducible. */
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export function drill<F extends AnyFn>(name: string, fn: F, opts: Opts<F>): boolean {
  const rows: string[] = [];
  let failed = 0;

  for (const c of opts.cases) {
    // Deep-copy args: in-place solutions must not corrupt the expectation.
    const passed = structuredClone(c.args);
    let got: ReturnType<F>, err = "";
    try {
      got = fn(...(passed as never[])) as ReturnType<F>;
    } catch (e) {
      got = undefined as ReturnType<F>;
      err = ` THREW ${(e as Error).message}`;
    }
    const good = err
      ? false
      : c.ok
        ? c.ok(got, passed as Parameters<F>)
        : JSON.stringify(got) === JSON.stringify(c.want);
    if (!good) failed++;
    rows.push(
      `  ${good ? "pass" : "FAIL"}  ${show(c.args).slice(0, 34).padEnd(34)} ` +
        `want ${show(c.want).slice(0, 18).padEnd(18)} got ${show(got).slice(0, 18)}${err}` +
        (c.note ? `   (${c.note})` : ""),
    );
  }

  if (opts.reference && opts.gen) {
    const trials = opts.trials ?? 500;
    let diffs = 0;
    for (let i = 0; i < trials; i++) {
      const args = opts.gen(mulberry32(i));
      const a = structuredClone(args);
      const b = structuredClone(args);
      let got: unknown, want: unknown;
      try {
        got = fn(...(a as never[]));
        want = opts.reference(...(b as never[]));
      } catch (e) {
        got = `THREW ${(e as Error).message}`;
      }
      if (JSON.stringify(got) !== JSON.stringify(want)) {
        if (diffs === 0) {
          rows.push(`  FAIL  differential trial ${i}: ${show(args)}`);
          rows.push(`          reference ${show(want)}  yours ${show(got)}`);
        }
        diffs++;
      }
    }
    if (diffs) failed++;
    rows.push(`  ${diffs ? "FAIL" : "pass"}  ${trials - diffs}/${trials} randomized trials match reference`);
  }

  console.log(`\n${failed ? "✗" : "✓"} ${name}${failed ? `  — ${failed} failing` : ""}`);
  console.log(rows.join("\n"));
  return failed === 0;
}
