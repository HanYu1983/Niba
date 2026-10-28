/** Structural diff between two parsed JSON values, reported as path-level ops. */

import { isObj, typeOf, formatPath, deepEqual, hasOwn } from "./jsonpath.mjs";

export function diffJson(before, after, { maxOps = 100 } = {}) {
  const ops = [];
  let changes = 0;

  const push = (op, segs, a, b) => {
    changes++;
    if (ops.length < maxOps) {
      const entry = { op, path: formatPath(segs) };
      if (op !== "add") entry.before = a;
      if (op !== "remove") entry.after = b;
      ops.push(entry);
    }
  };

  const rec = (a, b, segs) => {
    if (deepEqual(a, b)) return;
    const ta = typeOf(a);
    const tb = typeOf(b);

    if (ta !== tb || (ta !== "object" && ta !== "array")) {
      push("replace", segs, a, b);
      return;
    }

    if (ta === "array") {
      const len = Math.max(a.length, b.length);
      for (let i = 0; i < len; i++) {
        if (i >= a.length) push("add", [...segs, i], undefined, b[i]);
        else if (i >= b.length) push("remove", [...segs, i], a[i], undefined);
        else rec(a[i], b[i], [...segs, i]);
      }
      return;
    }

    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (!hasOwn(a, k)) push("add", [...segs, k], undefined, b[k]);
      else if (!hasOwn(b, k)) push("remove", [...segs, k], a[k], undefined);
      else rec(a[k], b[k], [...segs, k]);
    }
  };

  rec(before, after, []);
  return { changes, truncated: changes > ops.length, ops };
}

export { isObj };
