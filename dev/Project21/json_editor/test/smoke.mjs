/**
 * Smoke test: path engine unit checks + end-to-end MCP calls over an in-memory transport.
 * Run: node test/smoke.mjs
 */

import assert from "node:assert/strict";
import { mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createMcpServer } from "../mcp_core.mjs";
import { parsePath, formatPath, expand, getSingle, setAtPath, removeAtPath, typeOf } from "../lib/jsonpath.mjs";
import { stripJsonc, readJson } from "../lib/jsonfile.mjs";

const TMP = resolve("test/.tmp");
let pass = 0;

function check(name, fn) {
  fn();
  pass++;
  console.log(`ok  ${name}`);
}

// ---------- unit: paths ----------

check("parse + format roundtrip", () => {
  const cases = [
    ["$", "$"],
    ["$.cards[0].name", "$.cards[0].name"],
    ["$['a b']['c-d']", "$['a b']['c-d']"],
    ["$.cards[-1]", "$.cards[-1]"],
    ["cards[0].name", "$.cards[0].name"]
  ];
  for (const [input, expected] of cases) {
    const tokens = parsePath(input);
    const segs = tokens.map((t) => (t.type === "key" ? t.name : t.type === "index" ? t.index : null)).filter((s) => s !== null);
    assert.equal(formatPath(segs), expected, input);
  }
});

check("expand: wildcard, recursive, slice", () => {
  const data = { a: { n: 1 }, b: [{ n: 2 }, { n: 3 }] };
  assert.equal(expand(data, parsePath("$..n")).map((x) => x.value).join(","), "1,2,3");
  assert.equal(expand(data, parsePath("$.b[*].n")).length, 2);
  assert.equal(expand(data, parsePath("$.b[0:1].n")).length, 1);
  assert.equal(expand(data, parsePath("$.b[-1].n"))[0].value, 3);
  assert.ok(expand(data, parsePath("$.*")).length >= 2);
});

check("setAtPath creates chain and reports change", () => {
  const data = { cards: [{ id: 1 }] };
  const r = setAtPath(data, parsePath("$.cards[0].skills[0].name"), "beam", { create: true });
  assert.equal(r.changed, true);
  assert.equal(data.cards[0].skills[0].name, "beam");
  const same = setAtPath(data, parsePath("$.cards[0].skills[0].name"), "beam");
  assert.equal(same.changed, false);
  const root = setAtPath(data, parsePath("$"), { replaced: true });
  assert.equal(typeOf(root.data), "object");
  assert.deepEqual(root.data, { replaced: true });
});

check("removeAtPath splices arrays", () => {
  const data = { list: [1, 2, 3] };
  removeAtPath(data, parsePath("$.list[1]"));
  assert.deepEqual(data.list, [1, 3]);
  assert.throws(() => removeAtPath(data, parsePath("$.list[9]")), /out of range/);
});

check("stripJsonc removes comments and trailing commas", () => {
  const src = `{ // head\n "a": 1, /* mid */ "b": [1,2,], }`;
  const parsed = JSON.parse(stripJsonc(src));
  assert.deepEqual(parsed, { a: 1, b: [1, 2] });
});

// ---------- e2e: MCP ----------

rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const sample = {
  cards: [
    { id: 1, name: "RX-78", skills: [{ name: "beam", power: 10 }] },
    { id: 2, name: "Zaku", skills: [] }
  ],
  meta: { version: 1 }
};
const samplePath = join(TMP, "sample.json");
writeFileSync(samplePath, JSON.stringify(sample, null, 4).replace(/\n/g, "\r\n") + "\r\n", "utf-8");

const server = createMcpServer();
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
await server.connect(serverTransport);

const client = new Client({ name: "smoke", version: "0" }, { capabilities: {} });
await client.connect(clientTransport);

async function call(name, args = {}) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content?.[0]?.text ?? "";
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { isError: res.isError === true, data, text };
}

const listed = (await client.listTools()).tools.map((t) => t.name).sort();
assert.deepEqual(listed, [
  "json_array_op",
  "json_diff",
  "json_find",
  "json_format",
  "json_get",
  "json_inspect",
  "json_merge",
  "json_patch",
  "json_query",
  "json_remove",
  "json_set",
  "json_validate"
]);
pass++;
console.log("ok  tools/list exposes 12 tools");

const root = await call("json_inspect", { file: samplePath, sort: "size" });
assert.ok(!root.isError, root.text);
assert.equal(root.data.type, "object");
assert.deepEqual(root.data.children.map((c) => c.path), ["$.cards", "$.meta"]);
assert.equal(root.data.children[1].key, "meta");
pass++;
console.log("ok  json_inspect sorts children by size");

const one = await call("json_get", { file: samplePath, path: "$.cards[0].name" });
assert.equal(one.data.value, "RX-78");

const q = await call("json_query", { file: samplePath, path: "$.cards[*].id" });
assert.deepEqual(q.data.matches.map((m) => m.value), [1, 2]);
assert.deepEqual(q.data.matches.map((m) => m.path), ["$.cards[0].id", "$.cards[1].id"]);

const f = await call("json_find", { file: samplePath, value: "beam" });
assert.equal(f.data.matched, 1);
assert.equal(f.data.matches[0].path, "$.cards[0].skills[0].name");
pass++;
console.log("ok  query + find return concrete paths");

const set1 = await call("json_set", { file: samplePath, path: "$.meta.version", value: 2 });
assert.equal(set1.data.status, "updated");
assert.equal(set1.data.changes, 1);
assert.equal(set1.data.diff[0].path, "$.meta.version");

// format preservation: 4 spaces + CRLF + trailing newline must survive a write
const rawAfter = readFileSync(samplePath, "utf-8");
assert.ok(rawAfter.includes("\r\n"), "CRLF preserved");
assert.ok(rawAfter.includes('\r\n    "cards"'), "4-space indent preserved");
assert.ok(rawAfter.endsWith("\r\n"), "trailing newline preserved");
pass++;
console.log("ok  writes preserve indent / EOL / trailing newline");

const set2 = await call("json_set", { file: samplePath, path: "$.cards[0].skills[1].name", value: "saber", create: true });
assert.equal(set2.data.status, "updated");

const stale = await call("json_set", { file: samplePath, path: "$.meta.version", value: 3, expect_sha256: set1.data.sha256_before });
assert.ok(stale.isError);
assert.match(stale.text, /sha256 mismatch/);
pass++;
console.log("ok  expect_sha256 rejects a stale write");

const dry = await call("json_set", { file: samplePath, path: "$.meta.version", value: 99, dry_run: true });
assert.equal(dry.data.status, "dry-run");
const stillTwo = await call("json_get", { file: samplePath, path: "$.meta.version" });
assert.equal(stillTwo.data.value, 2);
pass++;
console.log("ok  dry_run leaves the file untouched");

const patch = await call("json_patch", {
  file: samplePath,
  ops: [
    { op: "add", path: "$.cards[2]", value: { id: 3, name: "Gouf", skills: [] } },
    { op: "replace", path: "$.cards[0].name", value: "RX-78-2" },
    { op: "test", path: "$.cards[1].id", value: 2 },
    { op: "add", path: "$.meta.tags", value: ["uc", "0079"] },
    { op: "remove", path: "$.cards[1].skills" }
  ]
});
assert.equal(patch.data.changes >= 4, true, JSON.stringify(patch.data));
const afterPatch = await call("json_get", { file: samplePath, path: "$.cards[2].name" });
assert.equal(afterPatch.data.value, "Gouf");
const gone = await call("json_get", { file: samplePath, path: "$.cards[1].skills" });
assert.ok(gone.isError);
pass++;
console.log("ok  json_patch applies add/replace/test/remove atomically");

const append = await call("json_array_op", { file: samplePath, path: "$.cards", op: "push", value: { id: 4, name: "Dom" } });
assert.equal(append.data.array_op, "push");
assert.equal(append.data.length, 4);
const popped = await call("json_array_op", { file: samplePath, path: "$.cards", op: "pop" });
assert.equal(popped.data.removed.name, "Dom");
pass++;
console.log("ok  json_array_op push/pop");

const merged = await call("json_merge", { file: samplePath, path: "$.meta", patch: { version: 5, editor: "mcp" } });
assert.equal(merged.data.changes, 2);
const afterMerge = await call("json_get", { file: samplePath, path: "$.meta" });
assert.deepEqual(afterMerge.data.value, { version: 5, editor: "mcp", tags: ["uc", "0079"] });
pass++;
console.log("ok  json_merge keeps untouched keys");

const removed = await call("json_remove", { file: samplePath, path: "$.cards[0].skills[1]" });
assert.equal(removed.data.changes, 1);

const otherPath = join(TMP, "other.json");
writeFileSync(otherPath, JSON.stringify({ ...JSON.parse(readFileSync(samplePath, "utf-8")), meta: { version: 6 } }, null, 2));
const diff = await call("json_diff", { file_a: samplePath, file_b: otherPath });
assert.equal(diff.data.changes, 3); // version replace + editor/tags removed
pass++;
console.log("ok  json_diff reports path-level ops");

const invalidPath = join(TMP, "invalid.json");
writeFileSync(invalidPath, '{ "a": 1, }', "utf-8");
const bad = await call("json_validate", { files: [samplePath, invalidPath] });
assert.equal(bad.data.all_ok, false);
assert.equal(bad.data.results[1].ok, false);
assert.match(bad.data.results[1].error, /invalid JSON/);

const badLenient = await call("json_validate", { files: [invalidPath], lenient: true });
assert.equal(badLenient.data.all_ok, true);
pass++;
console.log("ok  json_validate reports errors and accepts JSONC when lenient");

const fmt = await call("json_format", { file: samplePath, indent: 2, eol: "lf" });
assert.equal(fmt.data.status, "updated");
const fmt2 = await call("json_format", { file: samplePath, indent: 2, eol: "lf" });
assert.equal(fmt2.data.status, "unchanged");
pass++;
console.log("ok  json_format is idempotent");

const missing = await call("json_get", { file: samplePath, path: "$.nope" });
assert.ok(missing.isError);
assert.match(missing.text, /path not found/);
pass++;
console.log("ok  missing path returns isError");

await client.close();
await server.close();

console.log(`\n${pass} checks passed`);
