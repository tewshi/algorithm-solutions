/**
 * DRILL 1 — worked example. This is me playing the candidate.
 * Your stub in 01-k-closest-points.ts is untouched.
 *
 * Run:  npm run dev -- src/drills/01-worked-example.ts
 */

import { drill } from "../_drill.ts";

/**
 * Invariant: the heap holds the k smallest squared distances seen so far.
 * Because it is a MAX-heap, its root is the WORST of those k survivors —
 * so a new point is interesting iff it beats the root.
 */
type Entry = { d: number; p: number[] };

class MaxHeap {
  private items: Entry[] = [];

  get size(): number {
    return this.items.length;
  }

  peek(): Entry {
    return this.items[0];
  }

  push(e: Entry): void {
    this.items.push(e);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.items[parent].d >= this.items[i].d) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
      i = parent;
    }
  }

  pop(): Entry {
    const top = this.items[0];
    const last = this.items.pop() as Entry;
    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      const n = this.items.length;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let largest = i;
        if (l < n && this.items[l].d > this.items[largest].d) largest = l;
        if (r < n && this.items[r].d > this.items[largest].d) largest = r;
        if (largest === i) break;
        [this.items[largest], this.items[i]] = [this.items[i], this.items[largest]];
        i = largest;
      }
    }
    return top;
  }

  /** Copy, so callers can't corrupt the heap's backing array. */
  entries(): Entry[] {
    return [...this.items];
  }
}

export function kClosest(points: number[][], k: number): number[][] {
  if (k <= 0 || points.length === 0) return [];

  const heap = new MaxHeap();

  for (const p of points) {
    // Squared distance: sqrt is monotonic, so it cannot change the ordering.
    // |x|,|y| <= 1e4  =>  d <= 2e8, an exact integer. No floats anywhere.
    const d = p[0] * p[0] + p[1] * p[1];

    if (heap.size < k) {
      heap.push({ d, p });
    } else if (d < heap.peek().d) {
      heap.pop();
      heap.push({ d, p });
    }
  }

  return heap.entries().map((e) => e.p);
}

// --- my own cases, written before running anything --------------------------

const d2 = (p: number[]): number => p[0] * p[0] + p[1] * p[1];

const probe = (points: number[][], k: number): number[] => {
  const pool = points.map((p) => p.join(","));
  const got = kClosest(points, k);
  if (!Array.isArray(got) || got.length !== k) return [-1];
  for (const p of got) {
    const i = pool.indexOf(Array.isArray(p) ? p.join(",") : String(p));
    if (i === -1) return [-2];
    pool.splice(i, 1);
  }
  return got.map(d2).sort((a, b) => a - b);
};

const reference = (points: number[][], k: number): number[] =>
  points.map(d2).sort((a, b) => a - b).slice(0, k);

drill("kClosest (heap, O(n log k))", probe, {
  cases: [
    { args: [[[1, 3], [-2, 2]], 1], want: [8] },
    { args: [[[3, 3], [5, -1], [-2, 4]], 2], want: [18, 20] },
    { args: [[[0, 0]], 1], want: [0], note: "origin" },
    { args: [[[1, 1], [1, 1], [1, 1]], 2], want: [2, 2], note: "exact duplicates" },
    { args: [[[1, 0], [0, 1], [-1, 0], [0, -1]], 3], want: [1, 1, 1], note: "all tied" },
    { args: [[[9, 9], [1, 1]], 2], want: [2, 162], note: "k === n" },
    { args: [[[10000, 10000], [-10000, -10000]], 1], want: [200000000], note: "max magnitude" },
    { args: [[[2, 2], [3, 0]], 1], want: [8], note: "8 vs 9" },
    // cases I added that the interviewer's list did not have:
    { args: [[[5, 5], [1, 1], [3, 3], [2, 2], [4, 4]], 1], want: [2], note: "k=1, min is mid-array" },
    { args: [[[1, 1], [2, 2], [3, 3]], 3], want: [2, 8, 18], note: "k===n, already sorted" },
    { args: [[[3, 3], [2, 2], [1, 1]], 3], want: [2, 8, 18], note: "k===n, reverse sorted" },
    { args: [[[-1, -1], [-9, -9]], 1], want: [2], note: "all negative" },
  ],
  reference,
  gen: (rng) => {
    const n = 1 + Math.floor(rng() * 10);
    const pts: number[][] = [];
    for (let i = 0; i < n; i++) pts.push([Math.floor(rng() * 9) - 4, Math.floor(rng() * 9) - 4]);
    return [pts, 1 + Math.floor(rng() * n)] as Parameters<typeof probe>;
  },
  trials: 400,
});
