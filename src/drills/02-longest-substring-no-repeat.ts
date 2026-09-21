/**
 * DRILL 2 — Longest Substring Without Repeating Characters
 * Amazon frequency: very high. The canonical sliding window.
 *
 * Given a string s, return the length of the longest substring without
 * repeating characters.
 *
 * SUBSTRING, not subsequence — the characters must be contiguous.
 * For "pwwkew" the answer is 3 ("wke"). It is NOT 4: "pwke" is a
 * subsequence, and does not count.
 *
 * Constraints:
 *   - 0 <= s.length <= 5 * 10^4
 *   - s may contain letters, digits, symbols, and spaces
 *
 * THE LADDER:
 *   rung 1  check every substring for uniqueness
 *   rung 2  sliding window + Set, shrink the left edge one step at a time
 *   rung 3  sliding window + last-seen index map, JUMP the left edge   <-- write this
 *
 * Write rung 3. If you stall, write rung 2 first and then optimise it —
 * but rung 3 is the target, because it is where the interesting bug lives.
 *
 * ============================================================================
 * STOP. Fill in ANALYSIS below before you write a single line of code.
 * You lost points on drill 1 for stating complexity loosely and for
 * describing what a data structure IS instead of what your loop MAINTAINS.
 * This is that muscle.
 * ============================================================================
 *
 * Run it:  npm run dev -- src/drills/02-longest-substring-no-repeat.ts
 */

import { drill } from "../_drill.ts";

const ANALYSIS = {
  /** Rung 1 — time AND space. Be exact; "fast" and "slow" are not answers. */
  rung1: "time: O(n^3), space: O(1)",

  /** Rung 2 — time AND space. Justify the time: how often can each index move? */
  rung2: "time: O(n log k), space: O(1)",

  /** Rung 3 — time AND space. What does the space depend on, n or something else? */
  rung3: "time: O(n log k), space: O(1)",

  /**
   * THE INVARIANT — one sentence, true at the top of every iteration.
   * Of the form: "<window> always contains ___, because ___."
   * Not "a map stores characters". What does your WINDOW guarantee?
   */
  invariant: "window always contains the longest substring because we start by checking the longest unique substring, and shrink the size down",

  /**
   * Once you have the invariant, answer this — it is the whole drill:
   * can the left edge ever move BACKWARDS? Why does that matter?
   */
  leftEdge: "yes it can move backwards, it matters because if it doesn't move backwards then we will not be able to get all substrings in certain cases",
};

function isUnique(s: string): boolean {
  return new Set(s.split('')).size === s.length;
}

function isUniform(s: string): boolean {
  return new Set(s.split('')).size === 1;
}

export function lengthOfLongestSubstring(s: string): number {
  const l = s.length;
  if (l <= 1) {
    return l;
  }

  if (isUniform(s)) {
    return 1;
  }

  if (isUnique(s)) {
    return l;
  }

  for (let i = l - 1; i >= 2; i--) {
    for (let j = 0; j <= l - i; j++) {
      const substr = s.substring(j, i + j);
      const sublengthL = substr.length;
      if (isUnique(substr)) {
        return sublengthL;
      }
    }
  }

  return 1;
}

// ---------------------------------------------------------------------------
// Below the line is mine. Don't edit it — it's the interviewer.
// ---------------------------------------------------------------------------

if (Object.values(ANALYSIS).some((v) => v === "TODO")) {
  console.log(
    "\n  ┌─────────────────────────────────────────────────────────────┐\n" +
      "  │  ANALYSIS is unfinished. Fill it in BEFORE coding — that is  │\n" +
      "  │  the part of the interview you are currently losing.         │\n" +
      "  └─────────────────────────────────────────────────────────────┘",
  );
}

/** Deliberately quadratic reference: correct, but nowhere near your target. */
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

drill("lengthOfLongestSubstring", lengthOfLongestSubstring, {
  cases: [
    { args: ["abcabcbb"], want: 3 },
    { args: ["bbbbb"], want: 1, note: "all identical" },
    { args: ["pwwkew"], want: 3, note: "substring, NOT subsequence" },
    { args: [""], want: 0, note: "empty" },
    { args: ["a"], want: 1, note: "single" },
    { args: [" "], want: 1, note: "a space is a character" },
    { args: ["au"], want: 2, note: "no repeats at all" },
    { args: ["abba"], want: 2, note: "<-- this one breaks naive jumps" },
    { args: ["dvdf"], want: 3, note: "<-- and so does this one" },
    { args: ["tmmzuxt"], want: 5, note: "<-- and this one" },
    { args: ["abcdefghijklmnopqrstuvwxyz"], want: 26, note: "whole string is the answer" },
    { args: ["aab"], want: 2, note: "repeat at the front" },
    { args: ["cdd"], want: 2, note: "repeat at the back" },
  ],
  reference,
  gen: (rng) => {
    const alphabet = "abc"; // tiny on purpose: maximum collision density
    const n = Math.floor(rng() * 14);
    let s = "";
    for (let i = 0; i < n; i++) s += alphabet[Math.floor(rng() * alphabet.length)];
    return [s] as Parameters<typeof lengthOfLongestSubstring>;
  },
  trials: 4000,
});
