/**
 * DRILL 2 — worked example. All three rungs, mine.
 * Your stub in 02-longest-substring-no-repeat.ts is untouched.
 *
 * Run:  npm run dev -- src/drills/02-worked-example.ts
 */

import { drill } from "../_drill.ts";

/**
 * This is what the ANALYSIS block should have looked like. Compare it to
 * yours — the shape of the answers matters as much as the values.
 *
 * σ ("sigma") is the alphabet size. Saying O(min(n, σ)) rather than O(n)
 * shows you noticed the window can never hold more distinct characters
 * than the alphabet has.
 */
const ANALYSIS = {
  rung1:
    "time O(n^3) — O(n^2) substrings, each checked in O(len). " +
    "space O(min(n, σ)) for the Set, plus O(n) if you materialise each substring.",

  rung2:
    "time O(n) — right advances n times; left only ever advances, so it moves " +
    "at most n times in total. At most 2n pointer moves, i.e. amortised O(1) per " +
    "character, NOT O(n) per character just because there is a nested while. " +
    "space O(min(n, σ)).",

  rung3:
    "time O(n), single pass, no inner loop. space O(min(n, σ)) — bounded by the " +
    "alphabet, not by n. NOTE: this is the same complexity class as rung 2. It is " +
    "a constant-factor and clarity win, not an asymptotic one. Say which you mean.",

  invariant:
    "s[left..right] contains no repeated character, because whenever adding " +
    "s[right] would break that, we advance left past the previous occurrence.",

  leftEdge:
    "No — left must NEVER move backwards. Moving it back would re-admit a " +
    "character the window had already excluded, breaking the invariant: on 'abba' " +
    "at right=3, left is already 2, and jumping to lastSeen['a']+1 = 1 would " +
    "readmit the second 'b' and report 3 instead of 2. Monotonic left is also " +
    "what makes it O(n): each index is passed at most once.",
};

/** RUNG 1 — enumerate every substring, check each for uniqueness. O(n^3). */
export function rung1(s: string): number {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const sub = s.slice(i, j + 1);
      if (new Set(sub).size === sub.length) best = Math.max(best, sub.length);
    }
  }
  return best;
}

/** RUNG 2 — sliding window + Set, shrink the left edge one step at a time. O(n). */
export function rung2(s: string): number {
  const window = new Set<string>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    // Shrink until the invariant holds again. Looks nested, but `left` only
    // ever moves forward, so this runs at most n times across the whole loop.
    while (window.has(s[right])) {
      window.delete(s[left]);
      left++;
    }
    window.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

/** RUNG 3 — last-seen index map, jump the left edge. O(n), no inner loop. */
export function rung3(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    const prev = lastSeen.get(c);

    // `prev >= left` is the guard that keeps left monotonic. Without it,
    // "abba" and "dvdf" break. Equivalent to left = Math.max(left, prev + 1).
    if (prev !== undefined && prev >= left) left = prev + 1;

    lastSeen.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// ---------------------------------------------------------------------------

const reference = (s: string): number => {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      best = Math.max(best, seen.size);
    }
  }
  return best;
};

const cases = [
  { args: ["abcabcbb"] as [string], want: 3 },
  { args: ["bbbbb"] as [string], want: 1, note: "all identical" },
  { args: ["pwwkew"] as [string], want: 3, note: "substring, NOT subsequence" },
  { args: [""] as [string], want: 0, note: "empty" },
  { args: ["a"] as [string], want: 1, note: "single" },
  { args: [" "] as [string], want: 1, note: "a space is a character" },
  { args: ["au"] as [string], want: 2, note: "no repeats at all" },
  { args: ["abba"] as [string], want: 2, note: "left must not move back" },
  { args: ["dvdf"] as [string], want: 3, note: "same trap" },
  { args: ["tmmzuxt"] as [string], want: 5, note: "same trap" },
  { args: ["abcdefghijklmnopqrstuvwxyz"] as [string], want: 26, note: "whole string" },
  { args: ["aab"] as [string], want: 2, note: "repeat at the front" },
  { args: ["cdd"] as [string], want: 2, note: "repeat at the back" },
];

const gen = (rng: () => number): [string] => {
  const n = Math.floor(rng() * 14);
  let s = "";
  for (let i = 0; i < n; i++) s += "abc"[Math.floor(rng() * 3)];
  return [s];
};

for (const [name, fn] of [["rung1", rung1], ["rung2", rung2], ["rung3", rung3]] as const) {
  drill(name, fn, { cases, reference, gen, trials: 4000 });
}
