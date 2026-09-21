import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from "node:fs";
import { z } from "zod";
import { dirname, resolve, isAbsolute } from "node:path";

const TYPES = ["t2i", "t2v", "i2v", "r2v"];

// ---------- JSON IO (input/output path, same => overwrite) ----------

function resolveIO(input, output) {
  const inAbs = resolve(input);
  const outAbs = output ? resolve(output) : inAbs;
  return { inAbs, outAbs };
}

function loadStory(inAbs) {
  if (!existsSync(inAbs)) throw new Error(`input file not found: ${inAbs}`);
  let data;
  try {
    data = JSON.parse(readFileSync(inAbs, "utf-8"));
  } catch (e) {
    throw new Error(`invalid JSON in ${inAbs}: ${e.message}`);
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error(`story JSON must be a JSON object with {description, story}, got: ${typeof data}`);
  }
  if (data.story !== undefined && (typeof data.story !== "object" || data.story === null || Array.isArray(data.story))) {
    throw new Error(`story JSON field "story" must be dict[key,object], got: ${typeof data.story}`);
  }
  if (!data.story) data.story = {};
  if (data.description === undefined) data.description = "";
  return data;
}

function saveStory(outAbs, data) {
  mkdirSync(dirname(outAbs), { recursive: true });
  const tmp = outAbs + `.tmp_${Date.now()}`;
  writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  renameSync(tmp, outAbs);
}

// ---------- element helpers ----------

function normalizeRefs(refs) {
  if (refs === undefined || refs === null) return [];
  if (typeof refs === "string") return refs === "" ? [] : [refs];
  if (Array.isArray(refs)) return refs.filter((x) => typeof x === "string" && x !== "");
  throw new Error(`refs must be string | string[], got: ${typeof refs}`);
}

function getElement(data, key) {
  const el = data.story[key];
  if (!el) throw new Error(`element not found: "${key}" (available: ${Object.keys(data.story).join(", ") || "(empty)"})`);
  return el;
}

// dependency closure, deps-first order; throws on cycle
function collectChain(story, startKey) {
  const visited = new Set();
  const order = [];
  const missing = [];
  const cyclePath = [];
  const dfs = (key, path) => {
    if (visited.has(key)) return;
    const el = story[key];
    if (!el) { if (!missing.includes(key)) missing.push(key); return; }
    if (path.includes(key)) {
      cyclePath.push([...path, key].join(" -> "));
      return;
    }
    path.push(key);
    for (const r of normalizeRefs(el.refs)) dfs(r, path);
    path.pop();
    visited.add(key);
    order.push(key);
  };
  dfs(startKey, []);
  return { order, missing, cycles: cyclePath };
}

function checkOutputExists(jsonDir, baseDir, output) {
  if (!output || (typeof output === "string" && output.trim() === "")) {
    return { exists: false, reason: "no output field", checked: [] };
  }
  const candidates = [];
  if (isAbsolute(output)) {
    candidates.push(output);
  } else {
    if (baseDir) candidates.push(resolve(baseDir, output));
    candidates.push(resolve(jsonDir, output));
    candidates.push(resolve(output));
  }
  const checked = [];
  for (const c of candidates) {
    const ok = existsSync(c);
    checked.push(c);
    if (ok) return { exists: true, matched: c, checked };
  }
  return { exists: false, checked };
}

const ElementInput = z.object({
  description: z.string().optional().describe("AI-facing note for this element (each level has description)"),
  type: z.enum(["t2i", "t2v", "i2v", "r2v"]).describe("element type"),
  prompt: z.string().min(1).describe("prompt text for this element"),
  refs: z.union([z.string(), z.array(z.string())]).optional().describe('keys of other elements this one depends on, e.g. ["ref1"] or "ref1"'),
  seed: z.number().int().nonnegative().optional(),
  duration: z.number().min(1).max(60).optional(),
  out: z.string().optional().describe("output subdir name, e.g. ch12_l0_video"),
  output: z.string().optional().describe("produced file path after generation, used for dependency output check"),
  extra: z.record(z.any()).optional().describe("AI自由運用的額外資訊欄（object）：提交 ComfyUI 生成時參考用，可放 engine、ckpt/unet、negative_prompt、ref_videos/ref_audios、字幕文字、QA備註、v2重試紀錄等；不參與依賴鏈與 output 檢查")
}).passthrough();

const ElementPatch = z.object({
  description: z.string().optional(),
  type: z.enum(["t2i", "t2v", "i2v", "r2v"]).optional(),
  prompt: z.string().min(1).optional(),
  refs: z.union([z.string(), z.array(z.string())]).optional(),
  seed: z.number().int().nonnegative().optional().nullable(),
  duration: z.number().min(1).max(60).optional().nullable(),
  out: z.string().optional().nullable(),
  output: z.string().optional().nullable(),
  extra: z.record(z.any()).optional().nullable().describe("AI自由運用的額外資訊欄（object）：提交 ComfyUI 生成時參考用，可放 engine、ckpt/unet、negative_prompt、ref_videos/ref_audios、字幕文字、QA備註、v2重試紀錄等；不參與依賴鏈與 output 檢查")
}).passthrough();

const MetaPatch = z.object({
  description: z.string().optional().describe("project-level description for AI"),
  width: z.number().int().min(64).max(4096).optional().nullable().describe("project-level width, applies to all elements"),
  height: z.number().int().min(64).max(4096).optional().nullable().describe("project-level height, applies to all elements")
}).passthrough();

const ok = (obj) => ({ content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] });

// ---------- server ----------

export function createMcpServer() {
  const server = new McpServer({ name: "story-editor", version: "1.1.0" });

  server.tool(
    "story_init",
    "Create an empty Story JSON file {description, width, height, story:{}}. story is dict[key,object]; every level has a description field for AI. width/height live at project level and apply to all elements.",
    {
      file: z.string().describe("path of JSON file to create"),
      description: z.string().optional().describe("project-level description for AI"),
      width: z.number().int().min(64).max(4096).optional().describe("project-level width"),
      height: z.number().int().min(64).max(4096).optional().describe("project-level height"),
      overwrite: z.boolean().optional().describe("overwrite if file exists (default false)")
    },
    async (p) => {
      const abs = resolve(p.file);
      if (existsSync(abs) && !p.overwrite) {
        throw new Error(`file exists: ${abs} (pass overwrite=true to replace)`);
      }
      saveStory(abs, {
        description: p.description ?? "",
        ...(p.width !== undefined ? { width: p.width } : {}),
        ...(p.height !== undefined ? { height: p.height } : {}),
        story: {}
      });
      return ok({ status: "created", file: abs });
    }
  );

  server.tool(
    "story_edit_meta",
    "Edit top-level project fields (description/width/height). Reads input JSON, writes to output JSON (omit output or same path = overwrite). width/height live here, not inside elements.",
    {
      input: z.string().describe("input Story JSON path"),
      output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
      patch: MetaPatch.describe("partial top-level fields to merge (null deletes the field)")
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      for (const [k, v] of Object.entries(p.patch)) {
        if (v === undefined) continue;
        if (v === null) delete data[k];
        else data[k] = v;
      }
      saveStory(outAbs, data);
      return ok({ status: "meta-edited", input: inAbs, output: outAbs, description: data.description, width: data.width ?? null, height: data.height ?? null });
    }
  );

  server.tool(
    "story_add_element",
    "Add a new element into story dict. Reads input JSON, writes to output JSON (omit output or same path = overwrite). Fails if key exists unless overwrite=true.",
    {
      input: z.string().describe("input Story JSON path"),
      output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
      key: z.string().min(1).describe('element key, e.g. "ref1", "scene1"'),
      element: ElementInput,
      overwrite: z.boolean().optional().describe("overwrite existing key (default false)")
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      if (data.story[p.key] && !p.overwrite) {
        throw new Error(`key exists: "${p.key}" (pass overwrite=true to replace)`);
      }
      data.story[p.key] = {
        description: p.element.description ?? "",
        type: p.element.type,
        prompt: p.element.prompt,
        refs: normalizeRefs(p.element.refs),
        ...(p.element.seed !== undefined ? { seed: p.element.seed } : {}),
        ...(p.element.duration !== undefined ? { duration: p.element.duration } : {}),
        ...(p.element.out !== undefined ? { out: p.element.out } : {}),
        ...(p.element.output !== undefined ? { output: p.element.output } : {}),
        ...(p.element.extra !== undefined ? { extra: p.element.extra } : {})
      };
      saveStory(outAbs, data);
      return ok({ status: "added", key: p.key, input: inAbs, output: outAbs, count: Object.keys(data.story).length });
    }
  );

  server.tool(
    "story_edit_element",
    "Edit an existing element (partial patch merge). Reads input JSON, writes to output JSON (omit output or same path = overwrite). Patch fields replace old values; refs replaced wholesale.",
    {
      input: z.string().describe("input Story JSON path"),
      output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
      key: z.string().min(1),
      patch: ElementPatch.describe("partial fields to merge into the element")
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      const el = getElement(data, p.key);
      const next = { ...el };
      for (const [k, v] of Object.entries(p.patch)) {
        if (v === undefined) continue;
        if (k === "width" || k === "height") {
          throw new Error(`"${k}" lives at project top-level now, not inside elements (use story_edit_meta)`);
        }
        if (k === "refs") next.refs = normalizeRefs(v);
        else if (v === null) delete next[k];
        else next[k] = v;
      }
      if (next.type !== undefined && !TYPES.includes(next.type)) {
        throw new Error(`invalid type "${next.type}", must be one of ${TYPES.join(",")}`);
      }
      data.story[p.key] = next;
      saveStory(outAbs, data);
      return ok({ status: "edited", key: p.key, input: inAbs, output: outAbs, element: next });
    }
  );

  server.tool(
    "story_delete_element",
    "Delete an element by key. Reads input JSON, writes to output JSON (omit output or same path = overwrite).",
    {
      input: z.string().describe("input Story JSON path"),
      output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
      key: z.string().min(1)
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      getElement(data, p.key);
      delete data.story[p.key];
      saveStory(outAbs, data);
      return ok({ status: "deleted", key: p.key, input: inAbs, output: outAbs, count: Object.keys(data.story).length });
    }
  );

  server.tool(
    "story_get_element",
    "Read a single element by key.",
    {
      file: z.string().describe("Story JSON path"),
      key: z.string().min(1)
    },
    async (p) => {
      const data = loadStory(resolve(p.file));
      return ok({ key: p.key, element: getElement(data, p.key) });
    }
  );

  server.tool(
    "story_list_elements",
    "Read all elements (keys + summary). Filter by type; summary mode truncates prompt/description.",
    {
      file: z.string().describe("Story JSON path"),
      type: z.enum(["t2i", "t2v", "i2v", "r2v"]).optional().describe("filter by type"),
      summary: z.boolean().optional().describe("truncate prompt/description to 120 chars (default true)"),
      limit: z.number().int().min(1).max(1000).optional(),
      offset: z.number().int().min(0).optional()
    },
    async (p) => {
      const data = loadStory(resolve(p.file));
      const sum = p.summary ?? true;
      const trunc = (s, n = 120) => (typeof s === "string" && s.length > n ? s.slice(0, n) + "…" : s);
      let entries = Object.entries(data.story).map(([key, el]) => ({
        key,
        type: el.type,
        description: sum ? trunc(el.description) : el.description,
        prompt: sum ? trunc(el.prompt) : el.prompt,
        refs: normalizeRefs(el.refs),
        seed: el.seed, duration: el.duration, out: el.out, output: el.output
      }));
      if (p.type) entries = entries.filter((e) => e.type === p.type);
      const total = entries.length;
      if (p.offset) entries = entries.slice(p.offset);
      if (p.limit) entries = entries.slice(0, p.limit);
      return ok({ file: resolve(p.file), project_description: data.description, project_width: data.width ?? null, project_height: data.height ?? null, total, count: entries.length, entries });
    }
  );

  server.tool(
    "story_get_chain",
    "Read all elements in the dependency chain of a key (recursive via refs, deps-first order). Reports missing refs and cycles.",
    {
      file: z.string().describe("Story JSON path"),
      key: z.string().min(1).describe("start element key, chain includes itself last")
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      getElement(data, p.key);
      const { order, missing, cycles } = collectChain(data.story, p.key);
      const chain = order.map((k) => ({ key: k, element: data.story[k] }));
      return ok({ start: p.key, depth: chain.length, chain, missing_refs: missing, cycles });
    }
  );

  server.tool(
    "story_check_chain_outputs",
    "Check whether each ref-output in the dependency chain exists on disk. Uses each element's output field; resolves relative paths against base_dir then the JSON dir.",
    {
      file: z.string().describe("Story JSON path"),
      key: z.string().min(1).describe("start element key"),
      base_dir: z.string().optional().describe("base dir for relative output paths (e.g. ai_gen_video dir); default = cwd")
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      getElement(data, p.key);
      const { order, missing, cycles } = collectChain(data.story, p.key);
      const jsonDir = dirname(abs);
      const baseDir = p.base_dir ? resolve(p.base_dir) : process.cwd();
      const rows = order.map((k) => {
        const el = data.story[k];
        const r = checkOutputExists(jsonDir, baseDir, el.output);
        return { key: k, type: el.type, output: el.output ?? null, exists: r.exists, matched: r.matched ?? null, checked: r.checked, reason: r.reason ?? null };
      });
      const allExist = rows.every((r) => r.exists);
      return ok({ start: p.key, all_exist: allExist, ready: allExist && !missing.length && !cycles.length, missing_refs: missing, cycles, rows });
    }
  );

  server.tool(
    "story_validate",
    "Validate the whole Story JSON: unknown types, missing refs, self-refs, cycles, empty prompts, per-type ref limits (r2v<=9, i2v<=2).",
    {
      file: z.string().describe("Story JSON path")
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const issues = [];
      for (const [key, el] of Object.entries(data.story)) {
        if (!TYPES.includes(el?.type)) issues.push({ key, issue: `unknown type "${el?.type}"` });
        if (typeof el?.prompt !== "string" || !el.prompt.trim()) issues.push({ key, issue: "empty prompt" });
        const refs = normalizeRefs(el?.refs);
        for (const r of refs) {
          if (r === key) issues.push({ key, issue: "self-ref" });
          else if (!data.story[r]) issues.push({ key, issue: `missing ref "${r}"` });
        }
        if (el?.type === "r2v" && refs.length > 9) issues.push({ key, issue: `r2v refs=${refs.length} exceeds 9` });
        if (el?.type === "i2v" && refs.length > 2) issues.push({ key, issue: `i2v refs=${refs.length} exceeds 2 (first/last frame)` });
      }
      // cycle scan across all keys
      const cycles = [];
      for (const key of Object.keys(data.story)) {
        const { cycles: c } = collectChain(data.story, key);
        for (const s of c) if (!cycles.includes(s)) cycles.push(s);
      }
      return ok({ file: abs, count: Object.keys(data.story).length, valid: !issues.length && !cycles.length, issues, cycles });
    }
  );

  return server;
}
