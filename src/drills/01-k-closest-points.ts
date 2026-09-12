/**
 * DRILL 1 — K Closest Points to Origin
 * The single most-reported Amazon coding question. Also a calibration probe:
 * it has a three-rung ladder, and how far you climb tells me where to aim
 * the rest of the two weeks.
 *
 * Given an array of points on the X-Y plane and an integer k, return the k
 * points closest to the origin (0, 0). Distance is Euclidean.
 *
 * The answer may be returned in ANY order. It is guaranteed to be unique
 * except for the order that it is in.
 *
 * Constraints:
 *   - 1 <= k <= points.length <= 10^5
 *   - -10^4 <= xi, yi <= 10^4
 *
 * THE LADDER — do not skip straight to code. Tell me the time and space cost
 * of all three, then implement rung 2:
 *
 *   rung 1  sort everything by distance, take k
 *   rung 2  bounded max-heap of size k        <-- implement this one
 *   rung 3  quickselect / partial partition   <-- we'll discuss, don't write it
 *
 * Two things I'm specifically watching for:
 *   - There is no heap in the JS standard library. You write it.
 *   - There is a one-line observation about the distance metric that removes
 *     a whole class of floating-point trouble. Find it before you code.
 *
 * Run it:  npm run dev -- src/drills/01-k-closest-points.ts
 */

import { drill } from "../_drill.ts";

type Point = number[];
type Points = Point[];
interface Entry {
  d: number;
  p: Point;
}
type Entries = Entry[];
class MaxPointHeap {
  private items: Entries = [];
  private k: number = 0;

  constructor(k: number) {
    this.k = k;
  }

  static from(k: number, points: Points) {
    const maxHeap = new MaxPointHeap(k);
    for (const p of points) {
      const d = p[0]**2 + p[1]**2;
      maxHeap.push({ d, p });
    }

    return maxHeap;
  }

  get size(): number {
    return this.items.length;
  }

  points(): Points {
    return this.items.map(e => e.p);
  }

  entries(): Entries {
    return [...this.items];
  }

  peek(): Entry | undefined {
    return this.items[0];
  }

  /** Bounded push: admit everything, then drop the farthest if we're over k. */
  push(e: Entry): void {
    const root = this.peek();
    let shouldSiftAndPop = this.size < this.k;

    if (!shouldSiftAndPop && root && e.d < root.d) {
      this.pop();
      shouldSiftAndPop = true;
    }

    if (shouldSiftAndPop) {
      this.items.push(e);
      this.siftUp();
    }
  }

  /** Extract-max: swap the root out to the tail, drop it, restore downward. */
  pop(): Entry | undefined {
    const root = this.peek();
    const last = this.items.pop();
    if (!last) return undefined;

    if (this.size > 0) {
      this.items[0] = last;
      this.siftDown();
    }

    return root;
  }

  private siftUp(): void {
    let i: number = this.size - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.items[parent].d >= this.items[i].d) break;

      this.swap(parent, i);
      i = parent;
    }
  }

  private siftDown(): void {
    let i: number = 0;
    for (;;) {
      const left = 2 * i + 1;
      const right = left + 1;
      let largest = i;

      if (left < this.size && this.items[left].d > this.items[largest].d) largest = left;
      if (right < this.size && this.items[right].d > this.items[largest].d) largest = right;
      if (largest === i) break;

      this.swap(largest, i);
      i = largest;
    }
  }

  private swap(i: number, j: number): void {
    [this.items[i], this.items[j]] = [this.items[j], this.items[i]];
  }
}

export function kClosest(points: Points, k: number): Points {
  const maxHeap = MaxPointHeap.from(k, points);

  return maxHeap.points();
}

// ---------------------------------------------------------------------------
// Below the line is mine. Don't edit it — it's the interviewer.
// ---------------------------------------------------------------------------

const d2 = (p: Point): number => p[0] * p[0] + p[1] * p[1];

/**
 * Output order is unconstrained and ties are legal, so we compare the sorted
 * multiset of squared distances — and separately verify every returned point
 * really came from the input.
 */
const probe = (points: Points, k: number): Point => {
  const pool = points.map((p) => p.join(","));
  const got = kClosest(points, k);
  if (!Array.isArray(got) || got.length !== k) return [-1];
  for (const p of got) {
    const i = pool.indexOf(Array.isArray(p) ? p.join(",") : String(p));
    if (i === -1) return [-2]; // fabricated or duplicated a point
    pool.splice(i, 1);
  }
  return got.map(d2).sort((a, b) => a - b);
};

const reference = (points: Points, k: number): Point =>
  points
    .map(d2)
    .sort((a, b) => a - b)
    .slice(0, k);

drill("kClosest", probe, {
  cases: [
    { args: [[[1, 3], [-2, 2]], 1], want: [8] },
    { args: [[[3, 3], [5, -1], [-2, 4]], 2], want: [18, 20] },
    { args: [[[0, 0]], 1], want: [0], note: "the origin itself" },
    { args: [[[1, 1], [1, 1], [1, 1]], 2], want: [2, 2], note: "exact duplicates" },
    { args: [[[1, 0], [0, 1], [-1, 0], [0, -1]], 3], want: [1, 1, 1], note: "all tied — any 3 legal" },
    { args: [[[9, 9], [1, 1]], 2], want: [2, 162], note: "k === n, returns everything" },
    { args: [[[10000, 10000], [-10000, -10000]], 1], want: [200000000], note: "max magnitude" },
    { args: [[[2, 2], [3, 0]], 1], want: [8], note: "8 < 9 — a hair apart" },
  ],
  reference,
  gen: (rng) => {
    const n = 1 + Math.floor(rng() * 10);
    const pts: Points = [];
    for (let i = 0; i < n; i++) {
      pts.push([Math.floor(rng() * 9) - 4, Math.floor(rng() * 9) - 4]);
    }
    return [pts, 1 + Math.floor(rng() * n)] as Parameters<typeof probe>;
  },
  trials: 4000,
});
