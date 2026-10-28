/** Read-only views used by the inspection tools: tree walk, query, search, stats. */

import { isObj, typeOf, parsePath, expand, walk, getSingle, formatPath } from "./jsonpath.mjs";

const MAX_VALUE_CHARS_DEFAULT = 200;

export function previewValue(v, maxChars = MAX_VALUE_CHARS_DEFAULT) {
  if (typeof v === "string") {
    return v.length <= maxChars ? v : `${v.slice(0, maxChars)}…(+${v.length - maxChars} chars)`;
  }
  if (v === null || typeof v !== "object") return v;
  let s;
  try {
    s = JSON.stringify(v);
  } catch {
    s = String(v);
  }
  if (s === undefined) return null;
  if (s.length <= maxChars) return JSON.parse(s);
  return `${s.slice(0, maxChars)}…(+${s.length - maxChars} chars, ${s.length} total)`;
}

export function approxSize(v) {
  try {
    const s = JSON.stringify(v);
    return s === undefined ? 0 : s.length;
  } catch {
    return 0;
  }
}

function entriesOf(value) {
  if (Array.isArray(value)) return value.map((v, i) => ({ key: i, value: v, path: i }));
  if (isObj(value)) return Object.keys(value).map((k) => ({ key: k, value: value[k], path: k }));
  return null;
}

/**
 * One level (or N levels) of the tree.
 * Callers drill down by calling again with the returned child paths.
 */
export function inspectAt(data, pathStr, opts = {}) {
  const tokens = parsePath(pathStr);
  const hit = getSingle(data, tokens);
  if (!hit.found) throw new Error(`path not found: ${pathStr}`);

  const optsFull = {
    depth: opts.depth ?? 1,
    offset: opts.offset ?? 0,
    limit: opts.limit ?? 50,
    child_limit: opts.child_limit ?? 30,
    sort: opts.sort ?? "none",
    key_match: opts.key_match,
    show_values: opts.show_values ?? true,
    show_sizes: opts.show_sizes ?? true,
    max_value_chars: opts.max_value_chars ?? 120
  };

  const root = expandNode(hit.value, hit.segs, 0, optsFull, true);
  return { path: hit.path, ...root };
}
function sortEntries(entries, sort, sizes) {
  if (sort === "key") {
    return [...entries].sort((a, b) => String(a.key).localeCompare(String(b.key)));
  }
  if (sort === "size") {
    return [...entries].sort((a, b) => (sizes.get(b.key) ?? 0) - (sizes.get(a.key) ?? 0));
  }
  if (sort === "type") {
    return [...entries].sort((a, b) => typeOf(a.value).localeCompare(typeOf(b.value)));
  }
  return entries;
}

function expandNode(value, segs, level, opts, isRoot, key) {
  const type = typeOf(value);
  const path = formatPath(segs);
  const node = { path, type };
  if (key !== undefined) {
    node.key = key;
    node.index = typeof key === "number" ? key : undefined;
    if (node.index === undefined) delete node.index;
  }

  const entries = entriesOf(value);
  if (entries === null) {
    node.value = opts.show_values ? previewValue(value, opts.max_value_chars) : undefined;
    if (node.value === undefined) delete node.value;
    return node;
  }

  node.total = entries.length;
  if (opts.show_sizes) node.size = approxSize(value);
  if (level >= opts.depth) return node;

  const sizes = new Map();
  if (opts.show_sizes) for (const e of entries) sizes.set(e.key, approxSize(e.value));

  let filtered = entries;
  if (opts.key_match) {
    const re = new RegExp(opts.key_match);
    filtered = entries.filter((e) => re.test(String(e.key)));
  }

  let list;
  if (isRoot) {
    const sorted = sortEntries(filtered, opts.sort, sizes);
    list = sorted.slice(opts.offset, opts.offset + opts.limit);
    node.offset = opts.offset;
    node.limit = opts.limit;
    node.has_more = sorted.length > opts.offset + list.length;
    if (node.has_more) node.next_offset = opts.offset + list.length;
    if (filtered.length !== entries.length) node.matched_keys = filtered.length;
  } else {
    list = sortEntries(filtered, opts.sort, sizes).slice(0, opts.child_limit);
    if (filtered.length > list.length) {
      node.truncated = true;
      node.shown = list.length;
    }
  }

  node.children = list.map((e) =>
    expandNode(e.value, [...segs, e.path], level + 1, opts, false, e.path)
  );

  return node;
}

export function queryNodes(data, pathStr, opts = {}) {
  const tokens = parsePath(pathStr);
  const all = expand(data, tokens);
  const offset = opts.offset ?? 0;
  const limit = opts.limit ?? 50;
  const maxChars = opts.max_value_chars ?? 200;
  const slice = all.slice(offset, offset + limit);
  return {
    path: pathStr,
    matched: all.length,
    offset,
    limit,
    has_more: all.length > offset + slice.length,
    next_offset: all.length > offset + slice.length ? offset + slice.length : undefined,
    matches: slice.map((n) => ({
      path: n.path,
      type: typeOf(n.value),
      value: previewValue(n.value, maxChars),
      size: opts.show_sizes === false ? undefined : approxSize(n.value)
    }))
  };
}

function matchValue(actual, expected, mode) {
  switch (mode) {
    case "eq":
      return actual === expected || JSON.stringify(actual) === JSON.stringify(expected);
    case "contains":
      if (typeof actual === "string") return actual.includes(String(expected));
      if (Array.isArray(actual)) return actual.some((x) => JSON.stringify(x) === JSON.stringify(expected));
      return false;
    case "regex":
      return typeof actual === "string" && new RegExp(String(expected)).test(actual);
    case "gt":
      return typeof actual === "number" && actual > Number(expected);
    case "gte":
      return typeof actual === "number" && actual >= Number(expected);
    case "lt":
      return typeof actual === "number" && actual < Number(expected);
    case "lte":
      return typeof actual === "number" && actual <= Number(expected);
    case "type":
      return typeOf(actual) === String(expected);
    default:
      throw new Error(`unknown match mode: ${mode}`);
  }
}

export function findNodes(data, opts = {}) {
  const { key, value, match = "eq", depth, key_match, limit = 50, offset = 0, max_value_chars = 200 } = opts;
  if (key === undefined && value === undefined && key_match === undefined) {
    throw new Error("json_find needs at least one of: key, key_match, value");
  }

  const keyRe = key_match ? new RegExp(key_match) : null;
  const matches = [];
  let matched = 0;

  const rec = (node, segs, level, keyName) => {
    const tooDeep = depth !== undefined && level > depth;

    const keyOk =
      (key === undefined || keyName === key) && (keyRe === null || (keyName !== undefined && keyRe.test(String(keyName))));
    const valueOk =
      value === undefined ||
      (typeof node !== "object" || node === null ? matchValue(node, value, match) : false);

    if (keyName !== undefined && keyOk && valueOk) {
      matched++;
      if (matched > offset && matches.length < limit) {
        matches.push({
          path: formatPath(segs),
          key: keyName,
          type: typeOf(node),
          value: previewValue(node, max_value_chars),
          size: approxSize(node)
        });
      }
    }

    if (tooDeep) return;
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) rec(node[i], [...segs, i], level + 1, i);
    } else if (isObj(node)) {
      for (const k of Object.keys(node)) rec(node[k], [...segs, k], level + 1, k);
    }
  };

  rec(data, [], 0, undefined);

  return {
    matched,
    offset,
    limit,
    has_more: matched > offset + matches.length,
    next_offset: matched > offset + matches.length ? offset + matches.length : undefined,
    matches
  };
}

export function analyze(data) {
  let nodes = 0;
  let maxDepth = 0;
  const types = { object: 0, array: 0, string: 0, number: 0, boolean: 0, null: 0 };
  walk(data, [], (_v, _segs, level) => {
    nodes++;
    if (level > maxDepth) maxDepth = level;
    types[typeOfAll(_v)]++;
  });
  return { nodes, max_depth: maxDepth, types };
}

function typeOfAll(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}
