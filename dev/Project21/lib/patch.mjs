/**
 * RFC 6902 style patch, applied on top of the JSONPath subset.
 *
 *   {op:"add",     path, value}     object: set/replace key; array: insert at index; [ - ] appends
 *   {op:"remove",  path}
 *   {op:"replace", path, value}     path must exist
 *   {op:"move",    from, path}
 *   {op:"copy",    from, path}
 *   {op:"test",    path, value}     throws if the value differs
 *
 * Difference from strict RFC 6902: "add" creates missing parent containers by default,
 * because that is what an editing agent almost always wants. Set create_parents=false to be strict.
 */

import {
  parsePath,
  getSingle,
  setAtPath,
  removeAtPath,
  isSinglePath,
  deepEqual,
  formatPath,
  isContainer
} from "./jsonpath.mjs";

function replaceRoot(data, value) {
  return { data: value, changed: true, before: data };
}

/** Insert instead of overwrite when the parent of the last token is an array. */
function addAtPath(data, tokens, value, { createParents = true } = {}) {
  if (tokens.length === 0) return replaceRoot(data, value);

  const last = tokens[tokens.length - 1];
  const parentTokens = tokens.slice(0, -1);

  if (!createParents) return setAtPath(data, tokens, value, { create: false });

  // Ensure the parent exists, then decide insert vs set.
  const parentHit = parentTokens.length === 0 ? { found: true, value: data, segs: [] } : getSingle(data, parentTokens);
  if (!parentHit.found) {
    // let setAtPath build the whole chain
    return setAtPath(data, tokens, value, { create: true });
  }

  const parent = parentHit.value;

  if (Array.isArray(parent)) {
    if (last.type === "dash") {
      parent.push(value);
      return { data, changed: true, before: undefined, created: true };
    }
    if (last.type !== "index") {
      throw new Error(`cannot add "${last.type}" into an array at ${parentHit.path}`);
    }
    let idx = last.index < 0 ? parent.length + last.index : last.index;
    if (idx < 0 || idx > parent.length) {
      throw new Error(`add index ${last.index} out of range at ${parentHit.path} (length ${parent.length})`);
    }
    parent.splice(idx, 0, value);
    return { data, changed: true, before: undefined, created: true };
  }

  if (!isContainer(parent)) {
    // parent is a primitive: overwrite it through setAtPath (which will throw unless create)
    return setAtPath(data, tokens, value, { create: true });
  }

  const exists = last.type === "key" && Object.prototype.hasOwnProperty.call(parent, last.name);
  const before = exists ? parent[last.name] : undefined;
  const res = setAtPath(data, tokens, value, { create: true });
  return { ...res, before, changed: !exists || !deepEqual(before, value) };
}

export function applyPatch(rawData, ops, { createParents = true } = {}) {
  let data = rawData;
  const applied = [];

  ops.forEach((op, n) => {
    const where = `op #${n} (${op.op})`;
    try {
      if (!op || typeof op.op !== "string") throw new Error("missing op");
      const tokens = parsePath(op.path);

      switch (op.op) {
        case "add": {
          if (op.value === undefined) throw new Error("add requires value");
          const res = addAtPath(data, tokens, op.value, { createParents });
          data = res.data;
          applied.push({ op: "add", path: op.path });
          break;
        }
        case "remove": {
          const res = removeAtPath(data, tokens);
          data = res.data;
          applied.push({ op: "remove", path: formatPath(tokens.map((t) => (t.type === "key" ? t.name : t.index))) });
          break;
        }
        case "replace": {
          if (op.value === undefined) throw new Error("replace requires value");
          if (!isSinglePath(tokens)) throw new Error("replace path must be a single location");
          const hit = getSingle(data, tokens);
          if (!hit.found) throw new Error(`path not found: ${op.path}`);
          const res = setAtPath(data, tokens, op.value, { create: false });
          data = res.data;
          applied.push({ op: "replace", path: hit.path });
          break;
        }
        case "test": {
          const hit = getSingle(data, tokens);
          if (!hit.found) throw new Error(`path not found: ${op.path}`);
          if (!deepEqual(hit.value, op.value)) {
            throw new Error(`test failed: ${hit.path} is ${JSON.stringify(hit.value)?.slice(0, 120)}, expected ${JSON.stringify(op.value)?.slice(0, 120)}`);
          }
          applied.push({ op: "test", path: hit.path, ok: true });
          break;
        }
        case "move":
        case "copy": {
          if (!op.from) throw new Error(`${op.op} requires from`);
          const fromTokens = parsePath(op.from);
          const hit = getSingle(data, fromTokens);
          if (!hit.found) throw new Error(`from path not found: ${op.from}`);
          const value = op.op === "copy" ? structuredClone(hit.value) : hit.value;
          if (op.op === "move") {
            const rm = removeAtPath(data, fromTokens);
            data = rm.data;
          }
          const add = addAtPath(data, tokens, value, { createParents });
          data = add.data;
          applied.push({ op: op.op, from: hit.path, path: op.path });
          break;
        }
        default:
          throw new Error(`unknown op "${op.op}" (use add/remove/replace/move/copy/test)`);
      }
    } catch (err) {
      throw new Error(`patch failed at ${where}: ${err.message}`);
    }
  });

  return { data, applied };
}