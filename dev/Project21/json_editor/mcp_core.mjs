/**
 * json-editor MCP server — edit JSON by path instead of rewriting files.
 *
 * Why: on multi-MB JSON (e.g. a 4 MB card database) reading/rewriting the whole file
 * costs tokens and one stray brace corrupts everything. Every write here is:
 *   read -> mutate in memory -> diff -> (dry_run?) -> atomic tmp+rename write
 * and every write returns the sha256 so the next call can pass expect_sha256.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { readJson, writeJsonAtomic, backupFile, formatJson } from "./lib/jsonfile.mjs";
import { parsePath, getSingle, setAtPath, removeAtPath, arrayOpAtPath, mergePatch, typeOf, isSinglePath } from "./lib/jsonpath.mjs";
import { diffJson } from "./lib/diff.mjs";
import { applyPatch } from "./lib/patch.mjs";
import { inspectAt, queryNodes, findNodes, analyze, previewValue, approxSize } from "./lib/inspect.mjs";

const VERSION = "1.0.0";

const ok = (obj) => ({ content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] });

const shaOpt = z
  .string()
  .optional()
  .describe("optimistic lock: if set, the write fails unless the file's current sha256 matches (get it from a previous call)");

const dryRunOpt = z.boolean().optional().describe("compute the diff but do not write (default false)");
const backupOpt = z.boolean().optional().describe("copy the file to <file>.bak before writing (default false)");
const lenientOpt = z.boolean().optional().describe("tolerate comments and trailing commas (JSONC). Writes drop them, so lossy is reported");

function mutate(file, opts, fn) {
  const doc = readJson(file, { lenient: opts.lenient === true });

  if (opts.expect_sha256 && doc.sha256 !== opts.expect_sha256) {
    throw new Error(
      `sha256 mismatch for ${doc.abs}: the file changed since it was read ` +
        `(current ${doc.sha256}, expected ${opts.expect_sha256}). Re-read and retry.`
    );
  }

  const before = structuredClone(doc.data);
  const res = fn(doc.data) ?? {};
  const after = res.data !== undefined ? res.data : doc.data;

  const maxValueChars = opts.max_value_chars ?? 200;
  const diff = diffJson(before, after, { maxOps: opts.max_ops ?? 50 });

  const base = {
    file: doc.abs,
    ...(res.info ?? {}),
    changes: diff.changes,
    diff: diff.ops.map((op) => ({
      ...op,
      before: op.before === undefined ? undefined : previewValue(op.before, maxValueChars),
      after: op.after === undefined ? undefined : previewValue(op.after, maxValueChars)
    })),
    diff_truncated: diff.truncated || undefined,
    sha256_before: doc.sha256
  };

  if (diff.changes === 0) return { status: "unchanged", ...base };
  if (opts.dry_run) return { status: "dry-run", ...base, would_change: diff.changes };
  if (opts.backup) base.backup = backupFile(doc.abs);

  const written = writeJsonAtomic(doc.abs, after, doc);
  return {
    status: "updated",
    ...base,
    ...written,
    bytes_before: doc.size,
    lossy: doc.lossy || undefined,
    warning: doc.lossy ? "input was JSONC; comments/trailing commas were not preserved" : undefined
  };
}

function sortKeysDeep(v) {
  if (Array.isArray(v)) return v.map(sortKeysDeep);
  if (v !== null && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = sortKeysDeep(v[k]);
    return out;
  }
  return v;
}

export function createMcpServer() {
  const server = new McpServer({ name: "json-editor", version: VERSION });

  // ---------- read side ----------

  server.registerTool(
    "json_inspect",
    {
      title: "json_inspect",
      description:
        "List ONE level of a JSON tree: keys or indices with their type and size, paginated. Drill down by calling again with a child path. " +
        "Cheapest way to understand a large file without dumping it. sort=size surfaces the big blobs.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        path: z.string().optional().describe("node to inspect, default $ (root); e.g. $.cards or $.cards[0]"),
        depth: z.number().int().min(1).max(6).optional().describe("how many levels to expand (default 1)"),
        offset: z.number().int().min(0).optional().describe("skip N children (default 0)"),
        limit: z.number().int().min(1).max(500).optional().describe("max children at this level (default 50)"),
        sort: z.enum(["none", "key", "size", "type"]).optional().describe("child order (default none = document order)"),
        key_match: z.string().optional().describe("only children whose key matches this regex"),
        show_values: z.boolean().optional().describe("include primitive values (default true)"),
        show_sizes: z.boolean().optional().describe("include approximate serialized size in chars (default true)"),
        max_value_chars: z.number().int().min(10).max(4000).optional().describe("truncate shown values (default 120)"),
        lenient: lenientOpt
      }
    },
    async (p) => {
      const doc = readJson(p.file, { lenient: p.lenient === true });
      const node = inspectAt(doc.data, p.path ?? "$", p);
      return ok({
        file: doc.abs,
        bytes: doc.size,
        sha256: doc.sha256,
        ...node
      });
    }
  );

  server.registerTool(
    "json_get",
    {
      title: "json_get",
      description: "Read the value at ONE path (no wildcards). Returns type, size and the value, truncated to max_chars.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        path: z.string().describe('single location, e.g. $.cards[12].name or $["weird key"]'),
        max_chars: z.number().int().min(50).max(200000).optional().describe("truncate the value (default 4000)"),
        lenient: lenientOpt
      }
    },
    async (p) => {
      const doc = readJson(p.file, { lenient: p.lenient === true });
      const tokens = parsePath(p.path);
      if (!isSinglePath(tokens)) {
        throw new Error(`json_get needs a single location; "${p.path}" has wildcards/slices. Use json_query instead.`);
      }
      const hit = getSingle(doc.data, tokens);
      if (!hit.found) throw new Error(`path not found: ${p.path}`);
      return ok({
        file: doc.abs,
        path: hit.path,
        type: typeOf(hit.value),
        size: approxSize(hit.value),
        value: previewValue(hit.value, p.max_chars ?? 4000)
      });
    }
  );

  server.registerTool(
    "json_query",
    {
      title: "json_query",
      description:
        "Evaluate a JSONPath and return every match with its concrete path. Supports .key ['key'] [0] [-1] [a:b] [*] .* and $..key. " +
        "Use this to find 'all items matching a shape', then json_set each returned path.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        path: z.string().describe("JSONPath, e.g. $.cards[*].id or $..name"),
        offset: z.number().int().min(0).optional(),
        limit: z.number().int().min(1).max(1000).optional().describe("default 50"),
        max_value_chars: z.number().int().min(10).max(4000).optional().describe("default 200"),
        lenient: lenientOpt
      }
    },
    async (p) => {
      const doc = readJson(p.file, { lenient: p.lenient === true });
      const res = queryNodes(doc.data, p.path, p);
      return ok({ file: doc.abs, ...res });
    }
  );

  server.registerTool(
    "json_find",
    {
      title: "json_find",
      description:
        "Search the whole tree by key name and/or value (eq|contains|regex|gt|gte|lt|lte|type). Returns paths. " +
        "Use when you know the data but not where it lives, e.g. find the card whose id is 179901.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        key: z.string().optional().describe("exact key name to match"),
        key_match: z.string().optional().describe("regex on the key name"),
        value: z.any().optional().describe("value to compare against (primitives only)"),
        match: z.enum(["eq", "contains", "regex", "gt", "gte", "lt", "lte", "type"]).optional().describe("default eq"),
        depth: z.number().int().min(0).max(50).optional().describe("stop descending past this depth"),
        offset: z.number().int().min(0).optional(),
        limit: z.number().int().min(1).max(1000).optional().describe("default 50"),
        max_value_chars: z.number().int().min(10).max(4000).optional(),
        lenient: lenientOpt
      }
    },
    async (p) => {
      const doc = readJson(p.file, { lenient: p.lenient === true });
      const res = findNodes(doc.data, p);
      return ok({ file: doc.abs, ...res });
    }
  );

  // ---------- write side ----------

  server.registerTool(
    "json_set",
    {
      title: "json_set",
      description:
        "Set one location (replace, or create with create=true). Returns the path-level diff and the new sha256. " +
        "path=$ replaces the whole document. Prefer this over rewriting the file.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        path: z.string().describe("single location, e.g. $.cards[12].skills[0].name"),
        value: z.any().describe("new value (any JSON)"),
        create: z.boolean().optional().describe("create missing keys/indices on the way (default false)"),
        dry_run: dryRunOpt,
        backup: backupOpt,
        expect_sha256: shaOpt,
        max_value_chars: z.number().int().min(10).max(4000).optional().describe("truncate diff values (default 200)"),
        lenient: lenientOpt
      }
    },
    async (p) => {
      if (p.value === undefined) throw new Error("value is required; use json_remove to delete");
      const tokens = parsePath(p.path);
      if (!isSinglePath(tokens)) throw new Error("json_set needs a single location (no *, .., slices); set each result of json_query separately");
      return ok(mutate(p.file, p, (data) => setAtPath(data, tokens, p.value, { create: p.create === true })));
    }
  );

  server.registerTool(
    "json_merge",
    {
      title: "json_merge",
      description:
        "RFC 7386 merge-patch into the node at path (default $). Objects merge recursively, null deletes a key, arrays/primitives replace. " +
        "Good for 'update these 3 fields' without restating the object.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        path: z.string().optional().describe("node to merge into (default $)"),
        patch: z.any().describe("merge patch object"),
        dry_run: dryRunOpt,
        backup: backupOpt,
        expect_sha256: shaOpt,
        max_value_chars: z.number().int().min(10).max(4000).optional(),
        lenient: lenientOpt
      }
    },
    async (p) => {
      const tokens = parsePath(p.path ?? "$");
      return ok(
        mutate(p.file, p, (data) => {
          if (tokens.length === 0) return { data: mergePatch(data, p.patch).value };
          const hit = getSingle(data, tokens);
          if (!hit.found) throw new Error(`path not found: ${p.path}`);
          const merged = mergePatch(hit.value, p.patch);
          return setAtPath(data, tokens, merged.value, { create: false });
        })
      );
    }
  );

  server.registerTool(
    "json_remove",
    {
      title: "json_remove",
      description: "Delete the node at one path. Array elements are spliced (following items shift down, unlike a null-out).",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        path: z.string().describe("single location to delete"),
        ignore_missing: z.boolean().optional().describe("return unchanged instead of failing when absent (default false)"),
        dry_run: dryRunOpt,
        backup: backupOpt,
        expect_sha256: shaOpt,
        lenient: lenientOpt
      }
    },
    async (p) => {
      const tokens = parsePath(p.path);
      if (!isSinglePath(tokens)) throw new Error("json_remove needs a single location (no *, .., slices)");
      return ok(mutate(p.file, p, (data) => removeAtPath(data, tokens, { ignoreMissing: p.ignore_missing === true })));
    }
  );

  server.registerTool(
    "json_array_op",
    {
      title: "json_array_op",
      description:
        "Array surgery at one path: push/unshift/insert/pop/shift/remove_index. " +
        "Avoids hand-computing indices when appending a generated item.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        path: z.string().describe("path of the array, e.g. $.cards"),
        op: z.enum(["push", "unshift", "insert", "pop", "shift", "remove_index"]),
        value: z.any().optional().describe("item for push/unshift/insert"),
        index: z.number().int().optional().describe("position for insert/remove_index (negative counts from end)"),
        count: z.number().int().min(1).optional().describe("how many to remove for remove_index (default 1)"),
        dry_run: dryRunOpt,
        backup: backupOpt,
        expect_sha256: shaOpt,
        lenient: lenientOpt
      }
    },
    async (p) => {
      if (["push", "unshift", "insert"].includes(p.op) && p.value === undefined) {
        throw new Error(`${p.op} requires value`);
      }
      const tokens = parsePath(p.path);
      return ok(
        mutate(p.file, p, (data) => {
          const res = arrayOpAtPath(data, tokens, p);
          return {
            data,
            info: {
              array_op: p.op,
              at: res.at,
              removed: res.removed === undefined ? undefined : previewValue(res.removed, 200),
              length: res.arr.length
            }
          };
        })
      );
    }
  );

  server.registerTool(
    "json_patch",
    {
      title: "json_patch",
      description:
        "Apply several RFC 6902-ish ops in ONE read/write cycle (atomic: if any op fails, nothing is written). " +
        "ops: {op:add|remove|replace|move|copy|test, path, from?, value?}. [ - ] appends. " +
        "This is the tool for multi-edit batches: 20 field changes = 1 file write.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        ops: z
          .array(
            z.object({
              op: z.enum(["add", "remove", "replace", "move", "copy", "test"]),
              path: z.string(),
              from: z.string().optional(),
              value: z.any().optional()
            })
          )
          .min(1)
          .describe("operations, applied in order"),
        create_parents: z.boolean().optional().describe("add() creates missing parents (default true)"),
        dry_run: dryRunOpt,
        backup: backupOpt,
        expect_sha256: shaOpt,
        max_value_chars: z.number().int().min(10).max(4000).optional(),
        lenient: lenientOpt
      }
    },
    async (p) => {
      return ok(
        mutate(p.file, p, (data) => {
          const res = applyPatch(data, p.ops, { createParents: p.create_parents !== false });
          return { data: res.data, info: { applied: res.applied } };
        })
      );
    }
  );

  server.registerTool(
    "json_diff",
    {
      title: "json_diff",
      description: "Structural diff of two files (or two nodes inside them). Returns path-level add/remove/replace ops, capped at max_ops.",
      inputSchema: {
        file_a: z.string().describe("baseline file"),
        file_b: z.string().describe("changed file"),
        path_a: z.string().optional().describe("node inside file_a (default $)"),
        path_b: z.string().optional().describe("node inside file_b (default $)"),
        max_ops: z.number().int().min(1).max(2000).optional().describe("default 100"),
        max_value_chars: z.number().int().min(10).max(4000).optional().describe("default 120"),
        lenient: lenientOpt
      }
    },
    async (p) => {
      const a = readJson(p.file_a, { lenient: p.lenient === true });
      const b = readJson(p.file_b, { lenient: p.lenient === true });
      const pick = (doc, path) => {
        if (!path || path === "$") return doc.data;
        const hit = getSingle(doc.data, parsePath(path));
        if (!hit.found) throw new Error(`path not found: ${path} in ${doc.abs}`);
        return hit.value;
      };
      const diff = diffJson(pick(a, p.path_a), pick(b, p.path_b), { maxOps: p.max_ops ?? 100 });
      const maxChars = p.max_value_chars ?? 120;
      return ok({
        file_a: a.abs,
        file_b: b.abs,
        identical: diff.changes === 0,
        changes: diff.changes,
        diff_truncated: diff.truncated || undefined,
        ops: diff.ops.map((op) => ({
          ...op,
          before: op.before === undefined ? undefined : previewValue(op.before, maxChars),
          after: op.after === undefined ? undefined : previewValue(op.after, maxChars)
        }))
      });
    }
  );

  server.registerTool(
    "json_validate",
    {
      title: "json_validate",
      description: "Parse-check files and report structure stats (size, nodes, depth, indent, EOL, BOM, sha256). No writes.",
      inputSchema: {
        files: z.array(z.string()).min(1).describe("files to check"),
        lenient: lenientOpt
      }
    },
    async (p) => {
      const results = p.files.map((f) => {
        const item = { file: f, ok: false };
        try {
          const doc = readJson(f, { lenient: p.lenient === true });
          const stats = analyze(doc.data);
          return {
            ...item,
            ok: true,
            path: doc.abs,
            bytes: doc.size,
            sha256: doc.sha256,
            root: typeOf(doc.data),
            indent: doc.indent === "\t" ? "tab" : `${doc.indent} spaces`,
            eol: doc.eol === "\r\n" ? "crlf" : "lf",
            bom: doc.bom,
            nodes: stats.nodes,
            max_depth: stats.max_depth,
            types: stats.types,
            lenient_used: doc.lossy || undefined
          };
        } catch (err) {
          return { ...item, error: err.message };
        }
      });
      return ok({ all_ok: results.every((r) => r.ok), results });
    }
  );

  server.registerTool(
    "json_format",
    {
      title: "json_format",
      description:
        "Rewrite a file with a chosen indent/EOL (and optionally sorted keys) without changing the data. " +
        "Useful to normalize generated output; reports unchanged when bytes already match.",
      inputSchema: {
        file: z.string().describe("path to the JSON file"),
        output: z.string().optional().describe("write somewhere else instead of overwriting"),
        indent: z.union([z.number().int().min(0).max(8), z.literal("tab")]).optional().describe("default: keep the detected indent"),
        eol: z.enum(["keep", "lf", "crlf"]).optional().describe("default keep"),
        sort_keys: z.boolean().optional().describe("sort object keys recursively (default false)"),
        dry_run: dryRunOpt,
        backup: backupOpt,
        expect_sha256: shaOpt,
        lenient: lenientOpt
      }
    },
    async (p) => {
      const doc = readJson(p.file, { lenient: p.lenient === true });
      if (p.expect_sha256 && doc.sha256 !== p.expect_sha256) {
        throw new Error(`sha256 mismatch for ${doc.abs}: file changed since read`);
      }
      const data = p.sort_keys ? sortKeysDeep(doc.data) : doc.data;
      const overrides = {};
      if (p.indent !== undefined) overrides.indent = p.indent === "tab" ? "\t" : p.indent;
      if (p.eol === "lf") overrides.eol = "\n";
      if (p.eol === "crlf") overrides.eol = "\r\n";

      const text = formatJson(data, doc, overrides);
      const same = text === doc.raw;

      if (same) return ok({ status: "unchanged", file: doc.abs, sha256: doc.sha256, bytes: doc.size });
      if (p.dry_run) {
        return ok({ status: "dry-run", file: doc.abs, bytes_before: doc.size, bytes_after: Buffer.byteLength(text), would_write: true });
      }

      const target = p.output ? p.output : doc.abs;
      const result = { status: "updated", file: target };
      if (p.backup) result.backup = backupFile(doc.abs);

      writeJsonAtomic(target, data, doc, overrides);
      return ok({
        ...result,
        bytes_before: doc.size,
        bytes_after: Buffer.byteLength(text),
        lossy: doc.lossy || undefined,
        warning: doc.lossy ? "input was JSONC; comments/trailing commas were not preserved" : undefined
      });
    }
  );

  return server;
}

export { VERSION };
