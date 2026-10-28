/**
 * Minimal JSONPath for the json-editor MCP server.
 *
 * Supported:
 *   $                  root
 *   .key  ['key']      object member (quoted form allows any character)
 *   [0]  [-1]          array index (negative counts from the end)
 *   [1:5]  [::2]       array slice
 *   [*]  .*            all members / all elements
 *   $..key  $..[*]     recursive descent
 *   [-]                append marker (only meaningful for patch "add")
 *
 * Not supported: filter expressions [?(@.x == 1)], functions, script expressions.
 * Those belong in json_find, which searches by key/value instead.
 */

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

export const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
export const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

export function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

export function isContainer(v) {
  return v !== null && typeof v === "object";
}

// ---------- parsing ----------

export function parsePath(input = "$") {
  let src = String(input ?? "$").trim();
  if (src === "" || src === "$") return [];

  let i = 0;
  if (src[0] === "$") {
    i = 1;
  } else if (src[0] !== "." && src[0] !== "[") {
    src = "$" + src; // tolerate paths written without the leading $
    i = 1;
  }

  const fail = (msg) => {
    throw new Error(`invalid path "${input}": ${msg} (offset ${i})`);
  };
  const tokens = [];

  const readName = () => {
    const start = i;
    while (i < src.length && !".[]".includes(src[i])) i++;
    const name = src.slice(start, i).trim();
    if (!name) fail("empty key name");
    return name;
  };

  const skipWs = () => {
    while (i < src.length && (src[i] === " " || src[i] === "\t")) i++;
  };

  const readQuoted = () => {
    const q = src[i];
    i++;
    let s = "";
    while (i < src.length) {
      const c = src[i];
      if (c === "\\") {
        const n = src[i + 1];
        if (n === "u") {
          s += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16));
          i += 6;
          continue;
        }
        s += { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f", "/": "/", "\\": "\\", "'": "'", '"': '"' }[n] ?? n;
        i += 2;
        continue;
      }
      if (c === q) {
        i++;
        return s;
      }
      s += c;
      i++;
    }
    fail("unterminated quoted key");
  };

  while (i < src.length) {
    const c = src[i];

    if (c === ".") {
      if (src[i + 1] === ".") {
        i += 2;
        if (src[i] === "*") {
          tokens.push({ type: "recursive" });
          i++;
          continue;
        }
        if (src[i] === "[") {
          tokens.push({ type: "recursive" });
          continue;
        }
        tokens.push({ type: "recursive", name: readName() });
        continue;
      }
      i++;
      if (src[i] === "*") {
        tokens.push({ type: "wildcard" });
        i++;
        continue;
      }
      tokens.push({ type: "key", name: readName() });
      continue;
    }

    if (c === "[") {
      i++;
      skipWs();
      if (src[i] === "]") {
        i++;
        tokens.push({ type: "key", name: "" });
        continue;
      }
      if (src[i] === "'" || src[i] === '"') {
        const name = readQuoted();
        skipWs();
        if (src[i] !== "]") fail("expected ]");
        i++;
        tokens.push({ type: "key", name });
        continue;
      }
      const start = i;
      while (i < src.length && src[i] !== "]") i++;
      if (src[i] !== "]") fail("unterminated [");
      const body = src.slice(start, i).trim();
      i++;
      if (body === "*") {
        tokens.push({ type: "wildcard" });
        continue;
      }
      if (body === "-") {
        tokens.push({ type: "dash" });
        continue;
      }
      if (body.includes(":")) {
        const parts = body.split(":");
        if (parts.length > 3) fail(`bad slice [${body}]`);
        const nums = parts.map((p) => (p.trim() === "" ? undefined : Number(p.trim())));
        if (nums.some((n) => n !== undefined && !Number.isInteger(n))) fail(`bad slice [${body}]`);
        tokens.push({ type: "slice", start: nums[0], end: nums[1], step: nums[2] });
        continue;
      }
      if (!/^-?\d+$/.test(body)) fail(`bad index "${body}" (quote string keys: ['${body}'])`);
      tokens.push({ type: "index", index: Number(body) });
      continue;
    }

    if (c === "*") {
      tokens.push({ type: "wildcard" });
      i++;
      continue;
    }
    if (c === "]") {
      i++;
      continue;
    }
    if (i === 1 && src[0] === "$") {
      tokens.push({ type: "key", name: readName() });
      continue;
    }
    fail(`unexpected character "${c}"`);
  }

  return tokens;
}

export function isSinglePath(tokens) {
  return tokens.every((t) => t.type === "key" || t.type === "index");
}

export function isArrayIndex(t) {
  return t.type === "index" || t.type === "dash";
}

// ---------- canonical formatting ----------

function quoteKey(k) {
  return `['${String(k).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}']`;
}

export function formatPath(segs) {
  let out = "$";
  for (const s of segs) out += typeof s === "number" ? `[${s}]` : IDENT_RE.test(s) ? `.${s}` : quoteKey(s);
  return out;
}

// ---------- traversal ----------

export function walk(value, segs, fn, level = 0) {
  fn(value, segs, level);
  if (Array.isArray(value)) {
    for (let k = 0; k < value.length; k++) walk(value[k], [...segs, k], fn, level + 1);
  } else if (isObj(value)) {
    for (const k of Object.keys(value)) walk(value[k], [...segs, k], fn, level + 1);
  }
}

export function expand(root, tokens) {
  let cur = [{ value: root, segs: [] }];
  for (const t of tokens) {
    const out = [];
    for (const node of cur) applyToken(node, t, out);
    cur = out;
    if (cur.length === 0) break;
  }
  return cur.map((n) => ({ path: formatPath(n.segs), value: n.value, segs: n.segs }));
}

function applyToken(node, t, out) {
  const v = node.value;
  const segs = node.segs;

  if (t.type === "key") {
    if (isObj(v) && hasOwn(v, t.name)) out.push({ value: v[t.name], segs: [...segs, t.name] });
    return;
  }

  if (t.type === "index") {
    if (!Array.isArray(v)) return;
    const idx = t.index < 0 ? v.length + t.index : t.index;
    if (idx >= 0 && idx < v.length) out.push({ value: v[idx], segs: [...segs, idx] });
    return;
  }

  if (t.type === "slice") {
    if (!Array.isArray(v)) return;
    const n = v.length;
    const step = t.step ?? 1;
    if (step === 0) throw new Error("slice step cannot be 0");
    if (step > 0) {
      const norm = (x, dflt) => (x === undefined ? dflt : x < 0 ? n + x : x);
      const start = Math.max(0, Math.min(n, norm(t.start, 0)));
      const end = Math.max(0, Math.min(n, norm(t.end, n)));
      for (let k = start; k < end; k += step) out.push({ value: v[k], segs: [...segs, k] });
    } else {
      const norm = (x, dflt) => (x === undefined ? dflt : x < 0 ? n + x : x);
      const start = Math.max(-1, Math.min(n - 1, norm(t.start, n - 1)));
      const end = Math.max(-1, norm(t.end, -1));
      for (let k = start; k > end && k >= 0; k += step) out.push({ value: v[k], segs: [...segs, k] });
    }
    return;
  }

  if (t.type === "wildcard") {
    if (Array.isArray(v)) {
      for (let k = 0; k < v.length; k++) out.push({ value: v[k], segs: [...segs, k] });
    } else if (isObj(v)) {
      for (const k of Object.keys(v)) out.push({ value: v[k], segs: [...segs, k] });
    }
    return;
  }

  if (t.type === "recursive") {
    walk(v, segs, (val, s) => {
      if (t.name === undefined) out.push({ value: val, segs: s });
      else if (isObj(val) && hasOwn(val, t.name)) out.push({ value: val[t.name], segs: [...s, t.name] });
    });
    return;
  }

  if (t.type === "dash") return; // only meaningful inside patch "add"

  throw new Error(`unsupported path token: ${t.type}`);
}

export function getSingle(root, tokens) {
  let cur = root;
  const segs = [];
  for (const t of tokens) {
    if (t.type === "key") {
      if (!isObj(cur) || !hasOwn(cur, t.name)) return { found: false, path: formatPath(segs), segs };
      cur = cur[t.name];
      segs.push(t.name);
    } else if (t.type === "index") {
      if (!Array.isArray(cur)) return { found: false, path: formatPath(segs), segs };
      const idx = t.index < 0 ? cur.length + t.index : t.index;
      if (idx < 0 || idx >= cur.length) return { found: false, path: formatPath(segs), segs };
      cur = cur[idx];
      segs.push(idx);
    } else {
      throw new Error(`path is not a single location (uses ${t.type}); use json_query for wildcards`);
    }
  }
  return { found: true, value: cur, path: formatPath(segs), segs };
}

// ---------- writing ----------

export function deepEqual(a, b) {
  if (a === b) return true;
  const ta = typeOf(a);
  if (ta !== typeOf(b)) return false;
  if (ta === "array") {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (ta === "object") {
    const ka = Object.keys(a);
    if (ka.length !== Object.keys(b).length) return false;
    for (const k of ka) if (!hasOwn(b, k) || !deepEqual(a[k], b[k])) return false;
    return true;
  }
  return false;
}

const missing = (tokens, k) =>
  new Error(`path not found: ${formatPath(tokens.slice(0, k).map((t) => (t.type === "key" ? t.name : t.index)))}`);

/**
 * Write a single location. Returns { data, changed, before, created }.
 * `data` may be a new root when the path is "$".
 */
export function setAtPath(root, tokens, value, { create = false } = {}) {
  if (tokens.length === 0) {
    return { data: value, changed: !deepEqual(root, value), before: root, created: true };
  }
  if (!isSinglePath(tokens)) throw new Error("json_set path must be a single location (no *, .., slices)");

  let cur = root;
  const segs = [];
  if (!isContainer(cur)) {
    if (!create) throw new Error(`root is ${typeOf(cur)}, not a container; pass create=true`);
    cur = isArrayIndex(tokens[0]) ? [] : {};
    root = cur;
  }

  for (let k = 0; k < tokens.length - 1; k++) {
    const t = tokens[k];
    const wantArray = isArrayIndex(tokens[k + 1]);
    if (t.type === "key") {
      if (!isObj(cur)) throw new Error(`expected an object at ${formatPath(segs)}, got ${typeOf(cur)}`);
      if (!hasOwn(cur, t.name)) {
        if (!create) throw missing(tokens, k + 1);
        cur[t.name] = wantArray ? [] : {};
      } else if (!isContainer(cur[t.name])) {
        if (!create) throw new Error(`expected a container at ${formatPath([...segs, t.name])}, got ${typeOf(cur[t.name])}`);
        cur[t.name] = wantArray ? [] : {};
      }
      cur = cur[t.name];
      segs.push(t.name);
    } else if (t.type === "index") {
      if (!Array.isArray(cur)) throw new Error(`expected an array at ${formatPath(segs)}, got ${typeOf(cur)}`);
      let idx = t.index < 0 ? cur.length + t.index : t.index;
      if (idx < 0) throw new Error(`index ${t.index} out of range at ${formatPath(segs)} (length ${cur.length})`);
      if (idx >= cur.length) {
        if (!create) throw new Error(`index ${idx} out of range at ${formatPath(segs)} (length ${cur.length}); pass create=true`);
        while (cur.length < idx) cur.push(null);
        cur.push(wantArray ? [] : {});
      } else if (!isContainer(cur[idx])) {
        if (!create) throw new Error(`expected a container at ${formatPath([...segs, idx])}, got ${typeOf(cur[idx])}`);
        cur[idx] = wantArray ? [] : {};
      }
      cur = cur[idx];
      segs.push(idx);
    } else {
      throw new Error("json_set path must be a single location (no *, .., slices)");
    }
  }

  const last = tokens[tokens.length - 1];

  if (last.type === "key") {
    if (!isObj(cur)) throw new Error(`expected an object at ${formatPath(segs)}, got ${typeOf(cur)}`);
    const existed = hasOwn(cur, last.name);
    if (!existed && !create) {
      throw new Error(`key "${last.name}" not found at ${formatPath(segs)}; pass create=true to add it`);
    }
    const before = existed ? cur[last.name] : undefined;
    cur[last.name] = value;
    return { data: root, changed: !existed || !deepEqual(before, value), before, created: !existed };
  }

  if (!Array.isArray(cur)) throw new Error(`expected an array at ${formatPath(segs)}, got ${typeOf(cur)}`);
  let idx = last.index < 0 ? cur.length + last.index : last.index;
  if (idx < 0) throw new Error(`index ${last.index} out of range at ${formatPath(segs)} (length ${cur.length})`);
  if (idx >= cur.length) {
    if (!create) throw new Error(`index ${idx} out of range at ${formatPath(segs)} (length ${cur.length}); pass create=true to grow`);
    while (cur.length < idx) cur.push(null);
    cur.push(value);
    return { data: root, changed: true, before: undefined, created: true };
  }
  const before = cur[idx];
  cur[idx] = value;
  return { data: root, changed: !deepEqual(before, value), before, created: false };
}

export function removeAtPath(root, tokens, { ignoreMissing = false } = {}) {
  if (tokens.length === 0) throw new Error('refusing to remove the root; use json_set with path "$" or delete the file');
  if (!isSinglePath(tokens)) throw new Error("json_remove path must be a single location (no *, .., slices)");

  const parent = getSingle(root, tokens.slice(0, -1));
  if (!parent.found) {
    if (ignoreMissing) return { data: root, changed: false };
    throw new Error(`parent path not found: ${parent.path}`);
  }

  const last = tokens[tokens.length - 1];
  const node = parent.value;

  if (last.type === "key") {
    if (!isObj(node) || !hasOwn(node, last.name)) {
      if (ignoreMissing) return { data: root, changed: false };
      throw new Error(`path not found: ${formatPath(tokens.map((t) => (t.type === "key" ? t.name : t.index)))}`);
    }
    const before = node[last.name];
    delete node[last.name];
    return { data: root, changed: true, before };
  }

  if (!Array.isArray(node)) throw new Error(`expected an array at ${parent.path}, got ${typeOf(node)}`);
  const idx = last.index < 0 ? node.length + last.index : last.index;
  if (idx < 0 || idx >= node.length) {
    if (ignoreMissing) return { data: root, changed: false };
    throw new Error(`index ${last.index} out of range at ${parent.path} (length ${node.length})`);
  }
  const [before] = node.splice(idx, 1);
  return { data: root, changed: true, before };
}

export function arrayOpAtPath(root, tokens, { op, value, index, count = 1 }) {
  const target = getSingle(root, tokens);
  if (!target.found) throw new Error(`path not found: ${formatPath(tokens.map((t) => (t.type === "key" ? t.name : t.index)))}`);
  const arr = target.value;
  if (!Array.isArray(arr)) throw new Error(`expected an array at ${target.path}, got ${typeOf(arr)}`);

  switch (op) {
    case "push":
      arr.push(value);
      return { arr, changed: true, at: arr.length - 1 };
    case "unshift":
      arr.unshift(value);
      return { arr, changed: true, at: 0 };
    case "insert": {
      const i = index ?? 0;
      const at = i < 0 ? arr.length + i : i;
      if (at < 0 || at > arr.length) throw new Error(`insert index ${i} out of range (length ${arr.length})`);
      arr.splice(at, 0, value);
      return { arr, changed: true, at };
    }
    case "pop": {
      if (arr.length === 0) throw new Error("cannot pop from an empty array");
      const removed = arr.pop();
      return { arr, changed: true, removed, at: arr.length };
    }
    case "shift": {
      if (arr.length === 0) throw new Error("cannot shift from an empty array");
      const removed = arr.shift();
      return { arr, changed: true, removed, at: 0 };
    }
    case "remove_index": {
      if (arr.length === 0) throw new Error("cannot remove from an empty array");
      const i = index ?? 0;
      const at = i < 0 ? arr.length + i : i;
      if (at < 0 || at >= arr.length) throw new Error(`index ${i} out of range (length ${arr.length})`);
      const removed = arr.splice(at, Math.max(1, count));
      return { arr, changed: true, removed, at };
    }
    default:
      throw new Error(`unknown array op: ${op}`);
  }
}

/** RFC 7386 merge patch. null deletes a key. */
export function mergePatch(target, patch) {
  if (!isObj(patch)) return { value: patch, changed: !deepEqual(target, patch) };
  let base = isObj(target) ? target : {};
  let changed = false;
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) {
      if (hasOwn(base, k)) {
        delete base[k];
        changed = true;
      }
      continue;
    }
    const r = mergePatch(base[k], v);
    if (r.changed) {
      base[k] = r.value;
      changed = true;
    }
  }
  return { value: base, changed };
}
