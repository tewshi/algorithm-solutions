# Amazon SDE II — night-before sheet

## 0a. Phone screen ≠ the loop — read this first

**Format:** ~45–60 min. Usually 1–2 LP questions up front (~10–15 min), then ONE
coding problem. **No system design.** The bar is "solves it cleanly and communicates
well", not "instantly produces the optimal answer".

**You probably cannot run the code.** Amazon phone screens use a shared editor that
often does not execute. Every habit you have built — write it, run the harness, see
green — is unavailable. You must verify by *reading*:

- Before saying "done", **hand-trace the trickiest input out loud.** For a sliding
  window that is `"abba"`; for an in-place two-pointer it is a two-element array.
- Check the boundaries by reading: empty input, single element, and **the last
  iteration**. Trailing-element bugs are the ones that survive casual testing.
- State your test cases even though you cannot run them. "I would check empty,
  all-identical, all-distinct, and a repeat at the very end."

**Talk continuously.** On a phone call, silence reads as being stuck. Narrate while
typing. If you need to think, say "let me think about the edge case here" out loud.

**Clarify explicitly** — there is no body language, so ask your constraint questions
as direct questions and wait for answers.

**What phone screens actually ask:** arrays, strings, hash maps, two pointers,
sliding window, simple BFS. Rarely DP. Rarely hard graphs. Sections 2, 3 and 7 below
are the core; skim 4 and 5, and do not lose sleep over anything else.

**LP at this stage:** 1–2 questions, not the full battery. Two solid stories is enough
for tomorrow. Save the other four for the loop.

## 0. The script (worth more than any single algorithm)

1. **Ask for 90 seconds before coding.** Input size? Value ranges? Duplicates? Sorted?
   Can I mutate the input? Does output order matter? — *constraints tell you the target
   complexity before you write anything.*
2. **Say the key observation out loud.** Unspoken insight scores zero.
3. **Give 2–3 approaches with time AND space, then justify your pick against the constraints.**
   Name the one you reject and why.
4. **State the invariant in one sentence** before the loop. If you can't, you don't have
   the algorithm yet.
5. **Hand-trace 3 elements.** Catches most off-by-ones before they are typed.
6. Code. Narrate while typing.
7. **Test out loud**: empty, single, all-same, all-distinct, the *last* element.
8. Restate complexity. Volunteer the caveat before they find it.

## 1. Complexity — say it precisely

| Thing | Time |
|---|---|
| Comparison sort (`Array.sort`) | `O(n log n)` — **never** `O(n)` |
| Hash map get/set | `O(1)` average |
| Heap push/pop | `O(log size)` |
| Building a heap of k, n pushes | `O(n log k)` |
| BFS / DFS | `O(V + E)`; grid `O(rows × cols)` |
| Binary search | `O(log n)` |
| Sliding window | `O(n)` — each index enters once, leaves once |

Say **both** time and space. Say whether a win is a *complexity* win or a
*constant-factor* win. Don't reuse the previous question's complexity — derive this one.

## 2. Sliding window (variable size)

> **Invariant:** `s[left..right]` contains no repeated character, because whenever
> adding `s[right]` would break that, we advance `left` past the previous occurrence.

```ts
export function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    const prev = lastSeen.get(c);

    // max() is the whole trick: left must NEVER move backwards, or the window
    // re-admits a character it already excluded. Breaks on "abba", "dvdf".
    if (prev !== undefined && prev >= left) left = prev + 1;

    lastSeen.set(c, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}
```

`O(n)` time, `O(min(n, σ))` space. No special cases, no early-outs — if you need
them, the invariant is wrong.

**Left never moves backwards** is why it's `O(n)`: each index is passed at most once.

## 3. Two pointers, in place

> **Invariant:** everything strictly left of `write` is unique and in order.

```ts
function removeDuplicates(nums: number[]): number {   // sorted input
  if (nums.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) nums[write++] = nums[read];
  }
  return write;
}
```

`O(n)` time, `O(1)` space. Write pointer starts at 1 because element 0 is always kept.

## 4. Tree BFS — level order

> **Invariant:** at the top of each outer iteration the queue holds exactly one level.

```ts
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const out: number[][] = [];
  let queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const level: number[] = [];
    const next: TreeNode[] = [];
    for (const node of queue) {              // snapshot = exactly one level
      level.push(node.val);
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    out.push(level);
    queue = next;                            // avoid shift(): it is O(n) in JS
  }
  return out;
}
```

`O(n)` time, `O(width)` space. **Never use `queue.shift()` in a hot loop** — it is
`O(n)` per call in V8. Swap arrays, or keep a read index.

DFS is just recursion: `dfs(node.left); visit(node); dfs(node.right)` for in-order.
Mention the `O(h)` stack, and that a skewed tree makes `h = n`.

## 5. Grid BFS — number of islands

> **Invariant:** every cell already marked visited belongs to a counted island.

```ts
function numIslands(grid: string[][]): number {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1") continue;
      count++;
      const stack = [[r, c]];
      grid[r][c] = "0";                       // mark on PUSH, not on pop
      while (stack.length > 0) {
        const [y, x] = stack.pop() as number[];
        for (const [dy, dx] of [[1,0],[-1,0],[0,1],[0,-1]]) {
          const ny = y + dy, nx = x + dx;
          if (ny < 0 || nx < 0 || ny >= rows || nx >= cols) continue;
          if (grid[ny][nx] !== "1") continue;
          grid[ny][nx] = "0";
          stack.push([ny, nx]);
        }
      }
    }
  }
  return count;
}
```

`O(rows × cols)` time and space. **Mark visited when you push, not when you pop** —
otherwise the same cell enters the queue many times. Say out loud that you are
mutating the input, and offer a separate `visited` array if that is not acceptable.

Rotting Oranges is this with a multi-source queue and a level counter.

## 6. Top-K with a bounded heap — you already know this one

> **Invariant:** the heap holds the k best seen so far; being a max-heap, its root is
> the worst survivor, so a new item is interesting iff it beats the root.

Guard before you push: if the heap is full and the item cannot beat the root, reject
it in `O(1)`. `O(n log k)` time, `O(k)` space. Works on an unbounded stream — that is
the argument for it over quickselect.

## 7. Binary search

```ts
let lo = 0, hi = n - 1;
while (lo <= hi) {
  const mid = lo + ((hi - lo) >> 1);          // overflow-safe habit
  if (a[mid] === target) return mid;
  if (a[mid] < target) lo = mid + 1; else hi = mid - 1;
}
return -1;
```

For "first index where predicate is true": `while (lo < hi) { mid…; if (ok(mid)) hi = mid;
else lo = mid + 1; } return lo;`

## 8. STAR stories — write these tonight

An SDE II loop is 4–5 rounds; only about two are pure coding. **Six stories from real
production work**, each with a number in the result. Rules: real work not exercises,
"I" not "we", and the *action* should show the investigation, not just the fix.

| Principle | Prompt |
|---|---|
| Customer Obsession | Pushed back on a request that wasn't what the customer needed |
| Ownership | Took on something outside your scope / fixed what wasn't yours |
| Dive Deep | Found what the tests weren't catching — how you *investigated* |
| Bias for Action | Decided without complete information; what you'd do differently |
| Deliver Results | Shipped under pressure or scope pressure |
| Invent and Simplify | Removed complexity rather than adding it |

Shape: **S** context and stakes → **T** what was yours to do → **A** what *you* did,
especially how you found the problem → **R** **a number**, plus what you changed after.

Expect "what would you do differently?" on every one. Have an answer that isn't "nothing".
