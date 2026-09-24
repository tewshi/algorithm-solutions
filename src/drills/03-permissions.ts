/**
 * DRILL 3 — canAccess(user, action, resource)
 * The problem from the 2026-09-22 phone screen, worked properly.
 *
 * Store, as given:
 *   (john,  read,  '/todo.txt')
 *   (john,  write,  'todo.txt')      <-- note: no leading slash
 *   (james, write, '/lorem.txt')
 *
 *   canAccess('john',  'read', 'todo.txt') === true
 *   canAccess('james', 'read', 'todo.txt') === false
 *
 * The first example only passes if 'todo.txt' and '/todo.txt' are the SAME
 * resource — so normalisation is load-bearing, not cosmetic.
 *
 * Run:  npm run dev -- src/drills/03-permissions.ts
 */

import { drill } from "../_drill.ts";

type Rule = [user: string, action: string, resource: string];

const RULES: Rule[] = [
  ["john", "read", "/todo.txt"],
  ["john", "write", "todo.txt"],
  ["james", "write", "/lorem.txt"],
  ["john", "read,write", "/docs"], // "a string that can contain several actions"
  ["kate", "read", "/"],
];

/** '/a//b/', 'a/b' and '/a/b' all collapse to '/a/b'. Root is '/'. */
const normalize = (resource: string): string =>
  "/" + resource.split("/").filter((seg) => seg.length > 0).join("/");

/** NUL cannot appear in a username or a path, so the composite key is unambiguous. */
const SEP = String.fromCharCode(0);
const key = (user: string, action: string, resource: string): string =>
  user + SEP + action + SEP + resource;

/** Every ancestor of a path, nearest first: '/a/b/c' -> /a/b/c, /a/b, /a, / */
function* ancestors(path: string): Generator<string> {
  let p = path;
  for (;;) {
    yield p;
    if (p === "/") return;
    p = p.slice(0, p.lastIndexOf("/")) || "/";
  }
}

/* -------------------------------------------------------------------------
 * RUNG 1 — scan the store on every call. O(r) per query, O(1) extra space.
 * Fine if canAccess is called once. Wrong if it is called in a hot path.
 * ---------------------------------------------------------------------- */
export function canAccessScan(user: string, action: string, resource: string): boolean {
  const target = normalize(resource);
  return RULES.some(
    ([u, a, r]) => u === user && a.split(",").includes(action) && normalize(r) === target,
  );
}

/* -------------------------------------------------------------------------
 * RUNG 2 — index once, then O(1) per query. O(r) space.
 * The answer when canAccess is called many times against a fixed store.
 * ---------------------------------------------------------------------- */
export class FlatPermissions {
  private granted = new Set<string>();

  constructor(rules: Rule[]) {
    for (const [user, actions, resource] of rules) {
      // Normalise ONCE, at build time — not on every query.
      const path = normalize(resource);
      for (const action of actions.split(",")) {
        this.granted.add(key(user, action.trim(), path));
      }
    }
  }

  canAccess(user: string, action: string, resource: string): boolean {
    return this.granted.has(key(user, action, normalize(resource)));
  }
}

/* -------------------------------------------------------------------------
 * RUNG 3 — hierarchical. A grant on an ancestor covers everything beneath it.
 * O(depth) per query, and depth is tiny next to the number of rules.
 * This is the follow-up the "resource is like a file path" hint was aiming at.
 * ---------------------------------------------------------------------- */
export class HierarchicalPermissions {
  private granted = new Set<string>();

  constructor(rules: Rule[]) {
    for (const [user, actions, resource] of rules) {
      const path = normalize(resource);
      for (const action of actions.split(",")) {
        this.granted.add(key(user, action.trim(), path));
      }
    }
  }

  canAccess(user: string, action: string, resource: string): boolean {
    for (const path of ancestors(normalize(resource))) {
      if (this.granted.has(key(user, action, path))) return true;
    }
    return false;
  }
}

// ---------------------------------------------------------------------------
// Below the line is the interviewer.
// ---------------------------------------------------------------------------

const flat = new FlatPermissions(RULES);
const deep = new HierarchicalPermissions(RULES);

const flatRef = (u: string, a: string, r: string): boolean => {
  const target = normalize(r);
  return RULES.some(
    ([ru, ra, rr]) => ru === u && ra.split(",").includes(a) && normalize(rr) === target,
  );
};

const deepRef = (u: string, a: string, r: string): boolean => {
  const target = normalize(r);
  return RULES.some(([ru, ra, rr]) => {
    if (ru !== u || !ra.split(",").includes(a)) return false;
    const grant = normalize(rr);
    if (grant === "/") return true;
    return target === grant || target.startsWith(grant + "/");
  });
};

type Args = [string, string, string];

const cases = [
  { args: ["john", "read", "todo.txt"] as Args, want: true, note: "the interview example" },
  { args: ["james", "read", "todo.txt"] as Args, want: false, note: "the interview example" },
  { args: ["john", "read", "/todo.txt"] as Args, want: true, note: "leading slash" },
  { args: ["john", "write", "/todo.txt"] as Args, want: true, note: "stored without a slash" },
  { args: ["john", "write", "//todo.txt"] as Args, want: true, note: "doubled slash" },
  { args: ["james", "write", "/lorem.txt"] as Args, want: true },
  { args: ["james", "write", "/other.txt"] as Args, want: false, note: "unknown resource" },
  { args: ["nobody", "read", "/todo.txt"] as Args, want: false, note: "unknown user" },
  { args: ["john", "delete", "/todo.txt"] as Args, want: false, note: "unknown action" },
  { args: ["john", "read", "/docs"] as Args, want: true, note: "multi-action rule" },
  { args: ["john", "write", "/docs"] as Args, want: true, note: "multi-action rule" },
];

const users = ["john", "james", "kate", "nobody"];
const actions = ["read", "write", "delete"];
const paths = ["/", "/todo.txt", "todo.txt", "/docs", "/docs/a", "/docs/a/b.txt", "/lorem.txt", "//docs//a", "/docsx/b"];
const gen = (rng: () => number): Args => [
  users[Math.floor(rng() * users.length)],
  actions[Math.floor(rng() * actions.length)],
  paths[Math.floor(rng() * paths.length)],
];

drill("rung 1 — scan, O(r) per query", canAccessScan, { cases, reference: flatRef, gen, trials: 3000 });

drill("rung 2 — indexed, O(1) per query", (u: string, a: string, r: string) => flat.canAccess(u, a, r), {
  cases,
  reference: flatRef,
  gen,
  trials: 3000,
});

drill("rung 3 — hierarchical, O(depth)", (u: string, a: string, r: string) => deep.canAccess(u, a, r), {
  cases: [
    ...cases,
    { args: ["john", "read", "/docs/a/b.txt"] as Args, want: true, note: "inherits from /docs" },
    { args: ["john", "delete", "/docs/a/b.txt"] as Args, want: false, note: "action not granted" },
    { args: ["kate", "read", "/anything/at/all"] as Args, want: true, note: "kate is granted at root" },
    { args: ["kate", "write", "/anything"] as Args, want: false, note: "root grant is read-only" },
    { args: ["john", "read", "/docsx/b"] as Args, want: false, note: "prefix must be a whole SEGMENT" },
  ],
  reference: deepRef,
  gen,
  trials: 3000,
});
