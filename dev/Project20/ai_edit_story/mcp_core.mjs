import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync, readdirSync, statSync } from "node:fs";
import { z } from "zod";
import { dirname, resolve, isAbsolute, join, extname } from "node:path";
import { callComfyTool } from "./comfy_bridge.mjs";

const TYPES = ["t2i", "t2v", "i2v", "r2v"];
const VOICES = ["scene", "dialogue", "narration"]; // 場景 / 對白 / 旁白

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
    throw new Error(`story JSON must be a JSON object, got: ${typeof data}`);
  }
  if (data.story !== undefined && !Array.isArray(data.story)) {
    throw new Error(`story JSON field "story" must be an array of {id,...} (dict format retired in v2; migrate keys to id fields)`);
  }
  if (data.plan !== undefined && !Array.isArray(data.plan)) {
    throw new Error(`story JSON field "plan" must be an array of {id, voice, duration, lines}`);
  }
  if (!data.story) data.story = [];
  if (!data.plan) data.plan = [];
  if (data.phase === undefined) data.phase = 1;
  if (data.description === undefined) data.description = "";
  if (data.story_md === undefined) data.story_md = "";
  return data;
}

function saveStory(outAbs, data) {
  mkdirSync(dirname(outAbs), { recursive: true });
  const tmp = outAbs + `.tmp_${Date.now()}_${process.pid}_${Math.floor(Math.random() * 1e9)}`;
  writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  renameSync(tmp, outAbs);
}

// ---------- array helpers ----------

function findById(arr, id) {
  return arr.find((e) => e && e.id === id);
}

function requireUnique(arr, label) {
  const seen = new Set();
  for (const e of arr) {
    if (!e || typeof e.id !== "string" || !e.id) throw new Error(`${label} has an element with missing/empty id`);
    if (seen.has(e.id)) throw new Error(`${label} has duplicate id: "${e.id}"`);
    seen.add(e.id);
  }
}

function normalizeRefs(refs) {
  if (refs === undefined || refs === null) return [];
  if (typeof refs === "string") return refs === "" ? [] : [refs];
  if (Array.isArray(refs)) return refs.filter((x) => typeof x === "string" && x !== "");
  throw new Error(`refs must be string | string[], got: ${typeof refs}`);
}

// ---------- phase gates ----------

function requirePhase(data, want) {
  if (data.phase !== want) {
    if (want === 2) {
      const missing = planProblems(data.plan);
      throw new Error(
        `phase1 規劃階段：story 尚未開放填寫。請先用 plan_add_element 建立分鏡（每塊需 id／voice／duration，dialogue／narration 另需 lines），` +
        `用 plan_get 檢查字幕表與累積秒數，完成後 story_set_phase → 2 再填 story 元素。` +
        (missing.length ? `目前 plan 問題：${missing.join("；")}` : `目前 plan 為空。`)
      );
    } else {
      throw new Error(
        `phase2 已鎖定規劃：plan 不可再改。如需修改 plan，先 story_set_phase → 1 解鎖（注意：既有 story 保留，但可能與 plan 脫鉤，story_validate 會標 warnings）。`
      );
    }
  }
}

function planProblems(plan) {
  const problems = [];
  if (!plan.length) return ["plan 為空"];
  const seen = new Set();
  for (const p of plan) {
    if (!p || typeof p.id !== "string" || !p.id) { problems.push("plan 有缺 id 的項目"); continue; }
    if (seen.has(p.id)) problems.push(`plan id 重複："${p.id}"`);
    seen.add(p.id);
    if (!VOICES.includes(p.voice)) problems.push(`"${p.id}" voice 非法（須為 ${VOICES.join("/")})`);
    if (typeof p.duration !== "number" || !(p.duration >= 1 && p.duration <= 60)) problems.push(`"${p.id}" duration 須為 1~60 秒`);
    const lines = Array.isArray(p.lines) ? p.lines : [];
    if ((p.voice === "dialogue" || p.voice === "narration") && !lines.filter((l) => typeof l === "string" && l.trim()).length) {
      problems.push(`"${p.id}"（${p.voice}）缺 lines 對白／旁白逐句`);
    }
    if (p.voice === "scene" && lines.filter((l) => typeof l === "string" && l.trim()).length) {
      problems.push(`"${p.id}"（scene）不應有 lines`);
    }
  }
  return problems;
}

// 累積起點表（規劃秒）：跟 6.5 字幕表的累積起點同義
function planTable(plan) {
  let acc = 0;
  const rows = plan.map((p) => {
    const lines = (Array.isArray(p.lines) ? p.lines : []).filter((l) => typeof l === "string" && l.trim());
    const row = {
      id: p.id,
      voice: p.voice,
      duration: p.duration,
      start: acc,
      italic: p.voice === "narration",
      lines
    };
    acc += p.duration;
    return row;
  });
  return { rows, total: acc };
}

// ---------- <d> mirror ----------

function extractDLines(prompt) {
  const m = typeof prompt === "string" ? prompt.match(/<d>([\s\S]*?)<\/d>/) : null;
  if (!m) return null;
  return m[1].split("\n").map((s) => s.trim()).filter((s) => s && s !== "[中文]");
}

const normLines = (ls) => (ls || []).map((s) => String(s).trim()).filter(Boolean);

// ---------- dependency chain (array-based, deps-first) ----------

function collectChain(story, startId) {
  const byId = new Map(story.map((e) => [e.id, e]));
  const visited = new Set();
  const order = [];
  const missing = [];
  const cycles = [];
  const dfs = (id, path) => {
    if (visited.has(id)) return;
    const el = byId.get(id);
    if (!el) { if (!missing.includes(id)) missing.push(id); return; }
    if (path.includes(id)) { cycles.push([...path, id].join(" -> ")); return; }
    path.push(id);
    for (const r of normalizeRefs(el.refs)) dfs(r, path);
    path.pop();
    visited.add(id);
    order.push(id);
  };
  dfs(startId, []);
  return { order, missing, cycles };
}

const IMG_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const VID_EXTS = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const extsFor = (type) => (type === "t2i" ? IMG_EXTS : VID_EXTS);

function walkFiles(dir, acc = []) {
  let ents;
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of ents) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, acc);
    else if (e.isFile()) acc.push(p);
  }
  return acc;
}

// 從資料夾挑檔：建立時間最晚者（均無則取排序第一個；.txt 旁注一律忽略）
function pickMediaFile(dir, exts) {
  const files = walkFiles(dir).filter((p) => exts.has(extname(p).toLowerCase()));
  if (!files.length) return null;
  let best = null, bestT = -1;
  for (const f of files) {
    const t = fileTime(f);
    if (t >= bestT) { bestT = t; best = f; }
  }
  return best;
}

// 建立時間（birthtime 不可得時退回修改時間），無再退回 -1
function fileTime(file) {
  try {
    const st = statSync(file);
    if (st.birthtimeMs && st.birthtimeMs > 0) return st.birthtimeMs;
    if (st.ctimeMs && st.ctimeMs > 0) return st.ctimeMs;
    if (st.mtimeMs && st.mtimeMs > 0) return st.mtimeMs;
  } catch {}
  return -1;
}

// ref 輸出解析：output 可為檔案或資料夾（資料夾自動挑建立時間最晚的媒體）；output 為空則退回 out 目錄
function resolveRefPath(el, jsonDir, baseDir) {
  const sources = [];
  if (el.output && String(el.output).trim()) sources.push(["output", String(el.output).trim()]);
  if (el.out && String(el.out).trim()) sources.push(["out", String(el.out).trim()]);
  const tried = [];
  for (const [key, raw] of sources) {
    const paths = isAbsolute(raw) ? [raw] : [resolve(baseDir, raw), resolve(baseDir, "output", raw), resolve(jsonDir, raw)];
    for (const c of paths) {
      tried.push(c);
      let st = null;
      try { st = statSync(c); } catch { continue; }
      if (st.isFile()) {
        if (!extsFor(el.type).has(extname(c).toLowerCase())) continue;
        return { path: c, via: key, kind: "file", tried };
      }
      if (st.isDirectory()) {
        const pick = pickMediaFile(c, extsFor(el.type));
        if (pick) return { path: pick, via: key, kind: "dir-pick", tried };
      }
    }
  }
  return { path: null, tried };
}

// ---------- SRT ----------

function fmtSrtTime(sec) {
  const ms = Math.max(0, Math.round(sec * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const r = String(ms % 1000).padStart(3, "0");
  return `${h}:${m}:${s},${r}`;
}

// plan + 實際總秒 → SRT cues（6.5：scale 換算；短句置中偏前；長句均分；旁白包 <i>）
function buildSrtCues(plan, totalSeconds) {
  const { rows, total } = planTable(plan);
  if (!total) throw new Error("plan 為空或總規劃秒為 0，無法產 SRT");
  const scale = totalSeconds / total;
  const cues = [];
  for (const r of rows) {
    if (r.voice === "scene" || !r.lines.length) continue;
    const rate = r.voice === "dialogue" ? 4 : 5; // 字／秒
    const est = r.lines.map((l) => Math.max(0.5, [...l].length / rate));
    const sumEst = est.reduce((a, b) => a + b, 0);
    const fit = sumEst > r.duration ? r.duration / sumEst : 1;
    let t = r.start;
    if (r.lines.length === 1) {
      const d = Math.min(est[0] * fit, r.duration);
      const lead = (r.duration - d) * 0.4; // 短句置中偏前
      const s = (t + lead) * scale, e = (t + lead + d) * scale;
      cues.push({ start: s, end: e, text: r.voice === "narration" ? `<i>${r.lines[0]}</i>` : r.lines[0] });
    } else {
      const slot = r.duration / r.lines.length;
      r.lines.forEach((line, i) => {
        const d = Math.min(est[i] * fit, slot);
        const lead = (slot - d) * 0.3;
        const s = (t + slot * i + lead) * scale, e = (t + slot * i + lead + d) * scale;
        cues.push({ start: s, end: e, text: r.voice === "narration" ? `<i>${line}</i>` : line });
      });
    }
  }
  cues.sort((a, b) => a.start - b.start);
  return { cues, scale, plannedTotal: total, actualTotal: totalSeconds };
}

function cuesToSrt(cues) {
  return cues.map((c, i) => `${i + 1}\n${fmtSrtTime(c.start)} --> ${fmtSrtTime(c.end)}\n${c.text}`).join("\n\n") + "\n";
}

// ---------- schemas ----------

const EXTRA_DESC = "AI自由運用的額外資訊欄（object）：提交 ComfyUI 生成時參考用，可放 engine、ckpt/unet、negative_prompt、ref_videos/ref_audios、字幕文字、QA備註、v2重試紀錄等；不參與依賴鏈與 output 檢查";

const PlanInput = z.object({
  id: z.string().min(1).describe("block id, referenced by story elements of the same id"),
  description: z.string().optional().describe("AI-facing note for this block"),
  voice: z.enum(["scene", "dialogue", "narration"]).describe("scene=無字幕場景；dialogue=對白；narration=旁白（匯出斜體）"),
  duration: z.number().min(1).max(60).describe("planned seconds for this block"),
  lines: z.array(z.string()).optional().describe("dialogue/narration verbatim lines (one subtitle cue per line); omit for scene")
});

const PlanPatch = z.object({
  description: z.string().optional().nullable(),
  voice: z.enum(["scene", "dialogue", "narration"]).optional(),
  duration: z.number().min(1).max(60).optional(),
  lines: z.array(z.string()).optional().nullable()
});

const ElementInput = z.object({
  id: z.string().min(1).describe("element id; must match a plan id, except t2i assets which stand alone"),
  description: z.string().optional().describe("AI-facing note for this element (each level has description)"),
  type: z.enum(["t2i", "t2v", "i2v", "r2v"]).describe("element type"),
  prompt: z.string().min(1).describe("prompt text for this element"),
  refs: z.union([z.string(), z.array(z.string())]).optional().describe('ids of other elements this one depends on, e.g. ["ref1"] or "ref1"'),
  seed: z.number().int().nonnegative().optional(),
  out: z.string().optional().describe("output subdir name, e.g. ch12_l0_video"),
  output: z.string().optional().describe("produced file path after generation, used for dependency output check"),
  extra: z.record(z.any()).optional().describe(EXTRA_DESC)
}).passthrough();

const ElementPatch = z.object({
  description: z.string().optional(),
  type: z.enum(["t2i", "t2v", "i2v", "r2v"]).optional(),
  prompt: z.string().min(1).optional(),
  refs: z.union([z.string(), z.array(z.string())]).optional(),
  seed: z.number().int().nonnegative().optional().nullable(),
  out: z.string().optional().nullable(),
  output: z.string().optional().nullable(),
  extra: z.record(z.any()).optional().nullable().describe(EXTRA_DESC)
}).passthrough();

const MetaPatch = z.object({
  description: z.string().optional().describe("project-level description for AI"),
  story_md: z.string().optional().nullable().describe("path (relative or absolute) of the story md this project adapts from"),
  width: z.number().int().min(64).max(4096).optional().nullable().describe("project-level width, applies to all elements"),
  height: z.number().int().min(64).max(4096).optional().nullable().describe("project-level height, applies to all elements")
}).passthrough();

const ok = (obj) => ({ content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] });

// ---------- ComfyUI submit helpers ----------

function buildSubmitBundle(data, id, jsonDir, baseDir) {
  const el = findById(data.story, id);
  if (!el) throw new Error(`story id not found: "${id}"`);
  const plan = findById(data.plan, id);
  const missing = [];
  const refs = [];
  for (const r of normalizeRefs(el.refs)) {
    const rel = findById(data.story, r);
    if (!rel) { missing.push(`${r}（元素不存在）`); continue; }
    const hit = resolveRefPath(rel, jsonDir, baseDir);
    if (!hit.path) { missing.push(`${r}（找不到可用檔案：先生成該參考，輸出目錄已有檔會自動挑建立時間最晚者）`); continue; }
    refs.push({ id: r, type: rel.type, path: hit.path, via: `${hit.via}:${hit.kind}` });
  }
  if (missing.length) {
    throw new Error(`"${id}" 的提交包組不起來，ref 輸出未就緒：\n- ${missing.join("\n- ")}\n先把缺的 refs 生成出來（輸出進其 out 目錄即可，取包時自動挑建立時間最晚者）後重試。`);
  }
  return {
    id,
    type: el.type,
    width: data.width ?? null,
    height: data.height ?? null,
    duration: plan ? plan.duration : null,
    voice: plan ? plan.voice : null,
    seed: el.seed ?? null,
    out: el.out ?? null,
    prompt: el.prompt,
    refs,
    ...(el.extra !== undefined ? { extra: el.extra } : {}),
    _element: el,
    _plan: plan
  };
}

/**
 * Map a story submit bundle → comfy-video-gen tool name + arguments.
 * Optional overrides: seed, width, height, duration, out, engine, extra comfy fields via overrides.comfy
 */
function mapBundleToComfyCall(bundle, overrides = {}) {
  const extra = bundle.extra && typeof bundle.extra === "object" ? bundle.extra : {};
  const seed = overrides.seed !== undefined ? overrides.seed : (bundle.seed ?? undefined);
  const out = overrides.out !== undefined ? overrides.out : (bundle.out ?? undefined);
  const width = overrides.width !== undefined ? overrides.width : (bundle.width ?? undefined);
  const height = overrides.height !== undefined ? overrides.height : (bundle.height ?? undefined);
  const duration = overrides.duration !== undefined ? overrides.duration : (bundle.duration ?? undefined);
  const comfyExtra = overrides.comfy && typeof overrides.comfy === "object" ? overrides.comfy : {};

  const type = bundle.type;
  if (type === "r2v") {
    if (!bundle.refs.length) throw new Error(`"${bundle.id}" r2v 需要至少一張參考圖（refs）`);
    const args = {
      prompt: bundle.prompt,
      ...(seed !== undefined && seed !== null ? { seed } : {}),
      ...(duration != null ? { duration } : {}),
      ...(width != null ? { width } : {}),
      ...(height != null ? { height } : {}),
      ...(out ? { out } : {}),
      ...comfyExtra
    };
    bundle.refs.slice(0, 9).forEach((r, i) => { args[`ref_image_${i}`] = r.path; });
    // optional video/audio refs via extra.ref_videos / extra.ref_audios (absolute paths)
    const vids = Array.isArray(extra.ref_videos) ? extra.ref_videos : [];
    const auds = Array.isArray(extra.ref_audios) ? extra.ref_audios : [];
    vids.slice(0, 3).forEach((p, i) => { if (p) args[`ref_video_${i}`] = p; });
    auds.slice(0, 3).forEach((p, i) => { if (p) args[`ref_audio_${i}`] = p; });
    return { tool: "gen_r2v_video", args };
  }

  if (type === "i2v") {
    if (!bundle.refs.length) throw new Error(`"${bundle.id}" i2v 需要 first_frame（refs[0]）`);
    return {
      tool: "gen_i2v_video",
      args: {
        prompt: bundle.prompt,
        first_frame: bundle.refs[0].path,
        ...(bundle.refs[1] ? { last_frame: bundle.refs[1].path } : {}),
        ...(seed !== undefined && seed !== null ? { seed } : {}),
        ...(duration != null ? { duration } : {}),
        ...(width != null ? { width } : {}),
        ...(height != null ? { height } : {}),
        ...(out ? { out } : {}),
        ...comfyExtra
      }
    };
  }

  if (type === "t2v") {
    return {
      tool: "gen_t2v_video",
      args: {
        prompt: bundle.prompt,
        ...(seed !== undefined && seed !== null ? { seed } : {}),
        ...(duration != null ? { duration } : {}),
        ...(width != null ? { width } : {}),
        ...(height != null ? { height } : {}),
        ...(out ? { out } : {}),
        ...comfyExtra
      }
    };
  }

  if (type === "t2i") {
    const engine = String(overrides.engine || extra.engine || "sdxl").toLowerCase();
    const imgPrompt = (typeof extra.sdxl_prompt === "string" && extra.sdxl_prompt.trim())
      ? extra.sdxl_prompt
      : bundle.prompt;
    const imgW = overrides.width !== undefined ? overrides.width : (extra.width ?? width ?? undefined);
    const imgH = overrides.height !== undefined ? overrides.height : (extra.height ?? height ?? undefined);
    const imgSeed = overrides.seed !== undefined ? overrides.seed : (extra.seed ?? seed ?? undefined);
    const base = {
      prompt: imgPrompt,
      ...(imgSeed !== undefined && imgSeed !== null ? { seed: imgSeed } : {}),
      ...(imgW != null ? { width: imgW } : {}),
      ...(imgH != null ? { height: imgH } : {}),
      ...(out ? { out } : {}),
      ...(extra.steps != null ? { steps: extra.steps } : {}),
      ...(extra.cfg != null ? { cfg: extra.cfg } : {}),
      ...(extra.negative_prompt ? { negative_prompt: extra.negative_prompt } : {}),
      ...(extra.ckpt ? { ckpt: extra.ckpt } : {}),
      ...(extra.unet ? { unet: extra.unet } : {}),
      ...(extra.clip ? { clip: extra.clip } : {}),
      ...(extra.sampler_name ? { sampler_name: extra.sampler_name } : {}),
      ...(extra.scheduler ? { scheduler: extra.scheduler } : {}),
      ...comfyExtra
    };
    if (engine === "zit" || engine === "z-image" || engine === "zimage") {
      return { tool: "gen_zit_image", args: base };
    }
    return { tool: "gen_sdxl_image", args: base };
  }

  throw new Error(`unsupported element type for Comfy submit: "${type}"`);
}

// ---------- server ----------

export function createMcpServer() {
  const server = new McpServer({ name: "story-editor", version: "2.6.0" });

  server.registerTool(
    "story_init",
    {
      title: "story_init",
      description: "Create an empty Story JSON file {description, story_md, width, height, phase:1, plan:[], story:[]}. Arrays carry {id,...}; array order = merge/subtitle order.",
      inputSchema: {
        file: z.string().describe("path of JSON file to create"),
        description: z.string().optional().describe("project-level description for AI"),
        story_md: z.string().optional().describe("path (relative or absolute) of the story md this project adapts from"),
        width: z.number().int().min(64).max(4096).optional().describe("project-level width"),
        height: z.number().int().min(64).max(4096).optional().describe("project-level height"),
        overwrite: z.boolean().optional().describe("overwrite if file exists (default false)")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      if (existsSync(abs) && !p.overwrite) {
        throw new Error(`file exists: ${abs} (pass overwrite=true to replace)`);
      }
      saveStory(abs, {
        description: p.description ?? "",
        story_md: p.story_md ?? "",
        ...(p.width !== undefined ? { width: p.width } : {}),
        ...(p.height !== undefined ? { height: p.height } : {}),
        phase: 1,
        plan: [],
        story: []
      });
      return ok({ status: "created", file: abs, phase: 1 });
    }
  );

  server.registerTool(
    "story_edit_meta",
    {
      title: "story_edit_meta",
      description: "Edit top-level project fields (description/story_md/width/height). Reads input JSON, writes to output JSON (omit output or same path = overwrite).",
      inputSchema: {
        input: z.string().describe("input Story JSON path"),
        output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
        patch: MetaPatch.describe("partial top-level fields to merge (null deletes the field)")
      }
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
      return ok({ status: "meta-edited", input: inAbs, output: outAbs, description: data.description, story_md: data.story_md ?? null, width: data.width ?? null, height: data.height ?? null });
    }
  );

  server.registerTool(
    "story_set_phase",
    {
      title: "story_set_phase",
      description: "Switch creation phase. 1→2 requires a complete plan (every block has id/voice/duration; dialogue/narration have lines) and locks planning. 2→1 unlocks planning (story kept, may drift).",
      inputSchema: {
        input: z.string().describe("input Story JSON path"),
        output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
        phase: z.enum(["1", "2"]).describe("target phase").transform((v) => Number(v))
      }
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      if (p.phase === 2) {
        const problems = planProblems(data.plan);
        if (problems.length) {
          throw new Error(`cannot enter phase2, plan incomplete:\n- ${problems.join("\n- ")}\nFix with plan_add_element / plan_edit_element first.`);
        }
      }
      data.phase = p.phase;
      saveStory(outAbs, data);
      return ok({
        status: "phase-set", phase: p.phase, input: inAbs, output: outAbs,
        ...(p.phase === 2 ? { next: "fill story elements one by one with story_add_element (ids must match plan, except t2i assets)" } : { warning: "planning unlocked; existing story kept but may drift from plan (see story_validate warnings)" })
      });
    }
  );

// ----- plan (editable in any phase; phase2 drift handled by validate) -----

  server.registerTool(
    "plan_add_element",
    {
      title: "plan_add_element",
      description: "Add a plan block {id, voice, duration, lines} (works in any phase). This is the subtitle table (§6.5): id/voice/duration/lines are enough to export YT subtitles before any video exists. Adding in phase2 leaves a plan block without a story element until one is added.",
      inputSchema: {
        input: z.string().describe("input Story JSON path"),
        output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
        item: PlanInput,
        overwrite: z.boolean().optional().describe("overwrite existing plan id (default false)")
      }
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      if (findById(data.plan, p.item.id) && !p.overwrite) {
        throw new Error(`plan id exists: "${p.item.id}" (pass overwrite=true to replace)`);
      }
      const lines = p.item.voice === "scene" ? [] : normLines(p.item.lines);
      const entry = {
        id: p.item.id,
        ...(p.item.description !== undefined ? { description: p.item.description } : {}),
        voice: p.item.voice,
        duration: p.item.duration,
        lines
      };
      const at = data.plan.findIndex((e) => e.id === p.item.id);
      if (at >= 0) data.plan[at] = entry; else data.plan.push(entry);
      saveStory(outAbs, data);
      const { total } = planTable(data.plan);
      return ok({ status: "plan-added", id: p.item.id, blocks: data.plan.length, planned_total_sec: total, input: inAbs, output: outAbs });
    }
  );

  server.registerTool(
    "plan_edit_element",
    {
      title: "plan_edit_element",
      description: "Edit a plan block (partial patch; works in any phase).",
      inputSchema: {
        input: z.string().describe("input Story JSON path"),
        output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
        id: z.string().min(1),
        patch: PlanPatch
      }
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      const el = findById(data.plan, p.id);
      if (!el) throw new Error(`plan id not found: "${p.id}"`);
      const next = { ...el };
      for (const [k, v] of Object.entries(p.patch)) {
        if (v === undefined) continue;
        if (v === null) { if (k === "lines" || k === "description") next[k] = k === "lines" ? [] : ""; continue; }
        next[k] = v;
      }
      if (next.voice === "scene") next.lines = [];
      else if (next.lines !== undefined) next.lines = normLines(next.lines);
      Object.assign(el, next);
      saveStory(outAbs, data);
      const { total } = planTable(data.plan);
      return ok({ status: "plan-edited", id: p.id, planned_total_sec: total, block: el });
    }
  );

  server.registerTool(
    "plan_delete_element",
    {
      title: "plan_delete_element",
      description: "Delete a plan block by id (works in any phase).",
      inputSchema: {
        input: z.string().describe("input Story JSON path"),
        output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
        id: z.string().min(1)
      }
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      const at = data.plan.findIndex((e) => e.id === p.id);
      if (at < 0) throw new Error(`plan id not found: "${p.id}"`);
      data.plan.splice(at, 1);
      saveStory(outAbs, data);
      return ok({ status: "plan-deleted", id: p.id, blocks: data.plan.length });
    }
  );

  server.registerTool(
    "plan_get",
    {
      title: "plan_get",
      description: "Phase1 getter: read the subtitle table (§6.5) with computed cumulative starts, per-line cues, italic flags and planned total. Works in any phase; needs no videos.",
      inputSchema: {
        file: z.string().describe("Story JSON path")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const { rows, total } = planTable(data.plan);
      return ok({ file: abs, phase: data.phase, blocks: rows.length, planned_total_sec: total, table: rows });
    }
  );

  // ----- phase2: story -----

  function checkStoryGate(data, id, type) {
    requirePhase(data, 2);
    if (type !== "t2i" && !findById(data.plan, id)) {
      throw new Error(
        `id "${id}" 不在 plan 內。phase2 的 story 元素須對應 plan 分鏡（t2i 素材除外）。` +
        `請回 phase1 用 plan_add_element 先規劃該分鏡，或確認 id 拼寫。plan 現有：${data.plan.map((e) => e.id).join(", ") || "(空)"}`
      );
    }
  }

  server.registerTool(
    "story_add_element",
    {
      title: "story_add_element",
      description: "Phase2 only: add a story element {id, type, prompt, refs, seed, out, output, extra}. Duration/width/height come from plan/top-level, not here. Non-t2i ids must match a plan id.",
      inputSchema: {
        input: z.string().describe("input Story JSON path"),
        output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
        element: ElementInput,
        overwrite: z.boolean().optional().describe("overwrite existing story id (default false)")
      }
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      checkStoryGate(data, p.element.id, p.element.type);
      if (findById(data.story, p.element.id) && !p.overwrite) {
        throw new Error(`story id exists: "${p.element.id}" (pass overwrite=true to replace)`);
      }
      for (const r of normalizeRefs(p.element.refs)) {
        if (!findById(data.story, r)) {
          throw new Error(`ref "${r}" 不存在於 story。先加入被參照元素（素材 t2i 或同 plan 元素），現有：${data.story.map((e) => e.id).join(", ") || "(空)"}`);
        }
      }
      const entry = {
        id: p.element.id,
        description: p.element.description ?? "",
        type: p.element.type,
        prompt: p.element.prompt,
        refs: normalizeRefs(p.element.refs),
        ...(p.element.seed !== undefined ? { seed: p.element.seed } : {}),
        ...(p.element.out !== undefined ? { out: p.element.out } : {}),
        ...(p.element.output !== undefined ? { output: p.element.output } : {}),
        ...(p.element.extra !== undefined ? { extra: p.element.extra } : {})
      };
      const at = data.story.findIndex((e) => e.id === p.element.id);
      if (at >= 0) data.story[at] = entry; else data.story.push(entry);
      saveStory(outAbs, data);
      return ok({ status: "added", id: p.element.id, input: inAbs, output: outAbs, count: data.story.length });
    }
  );

  server.registerTool(
    "story_edit_element",
    {
      title: "story_edit_element",
      description: "Phase2 only: edit a story element (partial patch merge). duration/width/height live in plan/top-level: passing them errors with guidance.",
      inputSchema: {
        input: z.string().describe("input Story JSON path"),
        output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
        id: z.string().min(1),
        patch: ElementPatch.describe("partial fields to merge into the element")
      }
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      requirePhase(data, 2);
      const el = findById(data.story, p.id);
      if (!el) throw new Error(`story id not found: "${p.id}" (available: ${data.story.map((e) => e.id).join(", ") || "(empty)"})`);
      for (const k of Object.keys(p.patch)) {
        if (k === "width" || k === "height" || k === "duration") {
          throw new Error(`"${k}" 不在元素內：duration 由 plan 擁有，width/height 在頂層（改 plan 或 story_edit_meta）。`);
        }
      }
      const next = { ...el };
      for (const [k, v] of Object.entries(p.patch)) {
        if (v === undefined) continue;
        if (k === "refs") {
          const rs = normalizeRefs(v);
          for (const r of rs) {
            if (!findById(data.story, r)) throw new Error(`ref "${r}" 不存在於 story`);
          }
          next.refs = rs;
        }
        else if (v === null) delete next[k];
        else next[k] = v;
      }
      if (next.type !== undefined && !TYPES.includes(next.type)) {
        throw new Error(`invalid type "${next.type}", must be one of ${TYPES.join(",")}`);
      }
      Object.assign(el, next);
      saveStory(outAbs, data);
      return ok({ status: "edited", id: p.id, input: inAbs, output: outAbs, element: el });
    }
  );

  server.registerTool(
    "story_delete_element",
    {
      title: "story_delete_element",
      description: "Phase2 only: delete a story element by id (array order preserved).",
      inputSchema: {
        input: z.string().describe("input Story JSON path"),
        output: z.string().optional().describe("output Story JSON path (default = overwrite input)"),
        id: z.string().min(1)
      }
    },
    async (p) => {
      const { inAbs, outAbs } = resolveIO(p.input, p.output);
      const data = loadStory(inAbs);
      requirePhase(data, 2);
      const at = data.story.findIndex((e) => e.id === p.id);
      if (at < 0) throw new Error(`story id not found: "${p.id}"`);
      data.story.splice(at, 1);
      saveStory(outAbs, data);
      return ok({ status: "deleted", id: p.id, input: inAbs, output: outAbs, count: data.story.length });
    }
  );

  server.registerTool(
    "story_get_element",
    {
      title: "story_get_element",
      description: "Read a single element by id.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        id: z.string().min(1)
      }
    },
    async (p) => {
      const data = loadStory(resolve(p.file));
      const el = findById(data.story, p.id);
      if (!el) throw new Error(`story id not found: "${p.id}"`);
      const plan = findById(data.plan, p.id);
      return ok({ id: p.id, element: el, ...(plan ? { plan } : {}) });
    }
  );

  server.registerTool(
    "story_list_elements",
    {
      title: "story_list_elements",
      description: "Read all elements in array order (= merge/subtitle order). Filter by type; summary mode truncates prompt/description. Includes plan voice/duration per id.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        type: z.enum(["t2i", "t2v", "i2v", "r2v"]).optional().describe("filter by type"),
        summary: z.boolean().optional().describe("truncate prompt/description to 120 chars (default true)"),
        limit: z.number().int().min(1).max(1000).optional(),
        offset: z.number().int().min(0).optional()
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const sum = p.summary ?? true;
      const trunc = (s, n = 120) => (typeof s === "string" && s.length > n ? s.slice(0, n) + "…" : s);
      let entries = data.story.map((el) => {
        const plan = findById(data.plan, el.id);
        return {
          id: el.id,
          type: el.type,
          description: sum ? trunc(el.description) : el.description,
          prompt: sum ? trunc(el.prompt) : el.prompt,
          refs: normalizeRefs(el.refs),
          seed: el.seed, out: el.out, output: el.output,
          ...(plan ? { voice: plan.voice, duration: plan.duration } : {})
        };
      });
      if (p.type) entries = entries.filter((e) => e.type === p.type);
      const total = entries.length;
      if (p.offset) entries = entries.slice(p.offset);
      if (p.limit) entries = entries.slice(0, p.limit);
      return ok({ file: abs, phase: data.phase, project_description: data.description, project_story_md: data.story_md ?? null, project_width: data.width ?? null, project_height: data.height ?? null, total, count: entries.length, entries });
    }
  );

  server.registerTool(
    "story_get_chain",
    {
      title: "story_get_chain",
      description: "Read all elements in the dependency chain of an id (recursive via refs, deps-first order). Reports missing refs and cycles.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        id: z.string().min(1).describe("start element id, chain includes itself last")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      if (!findById(data.story, p.id)) throw new Error(`story id not found: "${p.id}"`);
      const { order, missing, cycles } = collectChain(data.story, p.id);
      const byId = new Map(data.story.map((e) => [e.id, e]));
      const chain = order.map((id) => ({ id, element: byId.get(id) }));
      return ok({ start: p.id, depth: chain.length, chain, missing_refs: missing, cycles });
    }
  );

  server.registerTool(
    "story_check_chain_outputs",
    {
      title: "story_check_chain_outputs",
      description: "Check whether each ref-output in the dependency chain exists on disk. Uses each element's output field; resolves relative paths against base_dir then the JSON dir.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        id: z.string().min(1).describe("start element id"),
        base_dir: z.string().optional().describe("base dir for relative output paths (e.g. ai_gen_video dir); default = cwd")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      if (!findById(data.story, p.id)) throw new Error(`story id not found: "${p.id}"`);
      const { order, missing, cycles } = collectChain(data.story, p.id);
      const byId = new Map(data.story.map((e) => [e.id, e]));
      const jsonDir = dirname(abs);
      const baseDir = p.base_dir ? resolve(p.base_dir) : process.cwd();
      const rows = order.map((id) => {
        const el = byId.get(id);
        const r = resolveRefPath(el, jsonDir, baseDir);
        return { id, type: el.type, output: el.output ?? null, resolved: r.path, via: r.path ? `${r.via}:${r.kind}` : null, exists: !!r.path };
      });
      const allExist = rows.every((r) => r.exists);
      return ok({ start: p.id, all_exist: allExist, ready: allExist && !missing.length && !cycles.length, missing_refs: missing, cycles, rows });
    }
  );

  server.registerTool(
    "story_submit_bundle",
    {
      title: "story_submit_bundle",
      description: "Build the ComfyUI submission bundle for one element: top-level width/height, plan duration/voice, seed/out/type/prompt, and refs resolved to existing files (output is folder-level; the newest-created media file is auto-picked, first file if undated). Unready refs error out with guidance instead of returning a half bundle.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        id: z.string().min(1).describe("element id to submit to ComfyUI"),
        base_dir: z.string().optional().describe("base dir that relative ref-output paths resolve against (e.g. ai_gen_video dir); default = cwd")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const jsonDir = dirname(abs);
      const baseDir = p.base_dir ? resolve(p.base_dir) : process.cwd();
      const bundle = buildSubmitBundle(data, p.id, jsonDir, baseDir);
      const { _element, _plan, ...publicBundle } = bundle;
      return ok(publicBundle);
    }
  );

  /**
   * Submit one element (mutates data in memory when save_prompt_id). Caller may saveStory.
   */
  async function submitOneComfy(data, id, jsonDir, baseDir, opts = {}) {
    const bundle = buildSubmitBundle(data, id, jsonDir, baseDir);
    let seedOverride = opts.seed;
    if (seedOverride === undefined && opts.bump_seed) {
      const cur = bundle.seed ?? bundle.extra?.seed ?? 0;
      seedOverride = Number(cur) + 1;
    }
    const { tool, args } = mapBundleToComfyCall(bundle, {
      seed: seedOverride,
      engine: opts.engine,
      comfy: opts.comfy
    });
    const { _element, _plan, ...publicBundle } = bundle;

    if (opts.dry_run) {
      return {
        ok: true,
        dry_run: true,
        id,
        comfy_tool: tool,
        comfy_args: args,
        bundle: {
          type: publicBundle.type,
          duration: publicBundle.duration,
          voice: publicBundle.voice,
          width: publicBundle.width,
          height: publicBundle.height,
          out: args.out ?? publicBundle.out,
          refs: publicBundle.refs.map((r) => ({ id: r.id, path: r.path }))
        }
      };
    }

    const comfyResult = await callComfyTool(tool, args);
    const promptId = comfyResult?.prompt_id ?? null;
    const usedSeed = comfyResult?.seed ?? args.seed ?? null;
    const save = opts.save_prompt_id !== false;
    if (save && promptId) {
      const el = findById(data.story, id);
      const prevExtra = el.extra && typeof el.extra === "object" ? { ...el.extra } : {};
      el.extra = {
        ...prevExtra,
        prompt_id: promptId,
        ...(data.width != null ? { v2_width: data.width } : {}),
        ...(data.height != null ? { v2_height: data.height } : {})
      };
      if (usedSeed != null) el.seed = usedSeed;
      if (args.out && !el.out) el.out = args.out;
      if (el.out && !el.output) el.output = el.out.startsWith("output/") ? el.out : `output/${el.out}`;
    }
    return {
      ok: true,
      dry_run: false,
      id,
      status: comfyResult?.status || "submitted",
      comfy_tool: tool,
      prompt_id: promptId,
      seed: usedSeed,
      saved_to_story: !!(save && promptId),
      comfy: comfyResult,
      bundle: {
        type: publicBundle.type,
        duration: publicBundle.duration,
        voice: publicBundle.voice,
        width: publicBundle.width,
        height: publicBundle.height,
        out: args.out ?? publicBundle.out,
        refs: publicBundle.refs.map((r) => ({ id: r.id, path: r.path }))
      }
    };
  }

  server.registerTool(
    "story_submit_comfy",
    {
      title: "story_submit_comfy",
      description:
        "Build the submit bundle for one story element, map params, and call comfy-video-gen MCP " +
        "(gen_r2v_video / gen_i2v_video / gen_t2v_video / gen_sdxl_image / gen_zit_image). " +
        "Auto-fills prompt, seed, duration, width/height, out, and resolved ref file paths. " +
        "By default writes prompt_id (and seed) back into the element's extra/seed. " +
        "Requires ai_gen_video MCP entry (COMFY_MCP_STDIO) and COMFY_SERVER.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        id: z.string().min(1).describe("element id to submit"),
        base_dir: z.string().optional().describe("base dir for relative out/ref paths; default = cwd (use ai_gen_video dir)"),
        seed: z.number().int().nonnegative().optional().describe("override seed (else element.seed / t2i extra.seed)"),
        bump_seed: z.boolean().optional().describe("if true and no seed override, use (seed|0)+1 and persist"),
        engine: z.string().optional().describe("t2i only: sdxl | zit (default from extra.engine or sdxl)"),
        save_prompt_id: z.boolean().optional().describe("write prompt_id back to extra (default true)"),
        dry_run: z.boolean().optional().describe("only build mapped comfy args, do not call ComfyUI"),
        comfy: z.record(z.any()).optional().describe("extra fields merged into the comfy tool arguments")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const jsonDir = dirname(abs);
      const baseDir = p.base_dir ? resolve(p.base_dir) : process.cwd();
      const row = await submitOneComfy(data, p.id, jsonDir, baseDir, p);
      if (!p.dry_run && row.saved_to_story) saveStory(abs, data);
      return ok(row);
    }
  );

  server.registerTool(
    "story_submit_comfy_all",
    {
      title: "story_submit_comfy_all",
      description:
        "Submit many / all story elements to ComfyUI via comfy-video-gen, in story array order (sequential, " +
        "to avoid JSON RMW races). Default types=['r2v'] (skips t2i assets). Use types=['t2i','r2v'] for everything. " +
        "continue_on_error defaults true. Writes prompt_id after each success when save_prompt_id is true.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        base_dir: z.string().optional().describe("base dir for relative out/ref paths; default = cwd (use ai_gen_video dir)"),
        types: z.array(z.enum(["t2i", "t2v", "i2v", "r2v"])).optional()
          .describe("element types to submit (default: ['r2v'])"),
        ids: z.array(z.string()).optional().describe("if set, only these ids (still filtered by types)"),
        skip_ids: z.array(z.string()).optional().describe("ids to skip"),
        bump_seed: z.boolean().optional().describe("bump each element's seed by 1 before submit"),
        engine: z.string().optional().describe("t2i only: sdxl | zit"),
        save_prompt_id: z.boolean().optional().describe("write prompt_id back after each success (default true)"),
        continue_on_error: z.boolean().optional().describe("continue after a failure (default true)"),
        dry_run: z.boolean().optional().describe("map args only, do not call ComfyUI"),
        limit: z.number().int().min(1).optional().describe("max number of elements to submit (after filters)"),
        offset: z.number().int().min(0).optional().describe("skip first N matched elements"),
        comfy: z.record(z.any()).optional().describe("extra fields merged into every comfy tool call")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const jsonDir = dirname(abs);
      const baseDir = p.base_dir ? resolve(p.base_dir) : process.cwd();
      const typeSet = new Set(p.types?.length ? p.types : ["r2v"]);
      const idSet = p.ids?.length ? new Set(p.ids) : null;
      const skipSet = new Set(p.skip_ids || []);
      let matched = data.story.filter((el) => {
        if (!el || !el.id) return false;
        if (!typeSet.has(el.type)) return false;
        if (idSet && !idSet.has(el.id)) return false;
        if (skipSet.has(el.id)) return false;
        return true;
      });
      const offset = p.offset || 0;
      if (offset) matched = matched.slice(offset);
      if (p.limit) matched = matched.slice(0, p.limit);

      const results = [];
      let okCount = 0;
      let failCount = 0;
      const continueOnError = p.continue_on_error !== false;
      const save = p.save_prompt_id !== false && !p.dry_run;

      for (let i = 0; i < matched.length; i++) {
        const el = matched[i];
        try {
          const row = await submitOneComfy(data, el.id, jsonDir, baseDir, {
            bump_seed: p.bump_seed,
            engine: p.engine,
            save_prompt_id: save,
            dry_run: p.dry_run,
            comfy: p.comfy
          });
          if (save && row.saved_to_story) saveStory(abs, data);
          okCount++;
          results.push({ index: i, ...row });
          process.stderr.write(
            `[mcp] story_submit_comfy_all ${i + 1}/${matched.length} OK ${el.id}` +
              (row.prompt_id ? ` → ${row.prompt_id}` : "") +
              "\n"
          );
        } catch (e) {
          failCount++;
          const err = String(e?.message || e);
          results.push({ index: i, ok: false, id: el.id, type: el.type, error: err });
          process.stderr.write(
            `[mcp] story_submit_comfy_all ${i + 1}/${matched.length} FAIL ${el.id}: ${err}\n`
          );
          if (!continueOnError) {
            return ok({
              status: "aborted",
              file: abs,
              total: matched.length,
              submitted: okCount,
              failed: failCount,
              remaining: matched.length - i - 1,
              results
            });
          }
        }
      }

      return ok({
        status: failCount ? (okCount ? "partial" : "failed") : "ok",
        file: abs,
        types: [...typeSet],
        total: matched.length,
        submitted: okCount,
        failed: failCount,
        dry_run: !!p.dry_run,
        results
      });
    }
  );

  server.registerTool(
    "story_comfy_tool",
    {
      title: "story_comfy_tool",
      description:
        "Passthrough: call any comfy-video-gen MCP tool by name (e.g. query_comfy_queue, query_history, " +
        "download_from_history, cancel_comfy_jobs, merge_videos, list_models). Arguments are forwarded as-is.",
      inputSchema: {
        tool: z.string().min(1).describe("comfy-video-gen tool name"),
        args: z.record(z.any()).optional().describe("arguments object for that tool")
      }
    },
    async (p) => {
      const result = await callComfyTool(p.tool, p.args || {});
      return ok({ comfy_tool: p.tool, result });
    }
  );

  server.registerTool(
    "story_get_all_video_paths",
    {
      title: "story_get_all_video_paths",
      description: "Get the merged-video file path of every video element in story array order (= merge order). Each path resolves to the newest-created media file inside its out/output folder, same rule as submit_bundle refs. Includes the plan voice/duration and a ready flag per element.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        base_dir: z.string().optional().describe("base dir that relative output paths resolve against (e.g. ai_gen_video dir); default = cwd")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const jsonDir = dirname(abs);
      const baseDir = p.base_dir ? resolve(p.base_dir) : process.cwd();
      const rows = data.story.map((el) => {
        if (el.type !== "r2v" && el.type !== "i2v" && el.type !== "t2v") return { id: el.id, type: el.type, video: null, ready: false, skipped: true };
        const r = resolveRefPath(el, jsonDir, baseDir);
        const plan = findById(data.plan, el.id);
        return {
          id: el.id,
          type: el.type,
          video: r.path,
          via: r.path ? `${r.via}:${r.kind}` : null,
          ready: !!r.path,
          ...(plan ? { voice: plan.voice, duration: plan.duration } : {})
        };
      });
      const readyRows = rows.filter((x) => x.ready && !x.skipped);
      const missingRows = rows.filter((x) => !x.ready && !x.skipped);
      return ok({
        file: abs,
        base_dir: baseDir,
        total: data.story.length,
        video_total: rows.filter((x) => !x.skipped).length,
        video_ready: readyRows.length,
        missing: missingRows.map((x) => x.id),
        order: readyRows.map((x) => x.video),
        rows
      });
    }
  );

  server.registerTool(
    "story_validate",
    {
      title: "story_validate",
      description: "Validate the whole Story JSON: unique ids, unknown types/voices, missing refs, self-refs, cycles, empty prompts, per-type ref limits (r2v<=9, i2v<=2), phase2 plan coverage, and <d>-vs-plan-lines mirror warnings.",
      inputSchema: {
        file: z.string().describe("Story JSON path")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const issues = [];
      const warnings = [];
      try { requireUnique(data.plan, "plan"); } catch (e) { issues.push(e.message); }
      try { requireUnique(data.story, "story"); } catch (e) { issues.push(e.message); }
      const planById = new Map(data.plan.map((e) => [e.id, e]));
      const storyById = new Map(data.story.map((e) => [e.id, e]));
      for (const pl of data.plan) {
        if (!pl || typeof pl.id !== "string" || !pl.id) continue;
        if (!VOICES.includes(pl?.voice)) issues.push({ id: pl.id, issue: `unknown voice "${pl?.voice}"` });
        if (typeof pl?.duration !== "number" || !(pl.duration >= 1 && pl.duration <= 60)) issues.push({ id: pl.id, issue: "plan duration must be 1~60" });
      }
      for (const [id, el] of storyById) {
        if (!TYPES.includes(el?.type)) issues.push({ id, issue: `unknown type "${el?.type}"` });
        if (typeof el?.prompt !== "string" || !el.prompt.trim()) issues.push({ id, issue: "empty prompt" });
        const refs = normalizeRefs(el?.refs);
        for (const r of refs) {
          if (r === id) issues.push({ id, issue: "self-ref" });
          else if (!storyById.has(r)) issues.push({ id, issue: `missing ref "${r}"` });
        }
        if (el?.type === "r2v" && refs.length > 9) issues.push({ id, issue: `r2v refs=${refs.length} exceeds 9` });
        if (el?.type === "i2v" && refs.length > 2) issues.push({ id, issue: `i2v refs=${refs.length} exceeds 2 (first/last frame)` });
        if (el?.type !== "t2i" && !planById.has(id)) issues.push({ id, issue: `no plan block for non-asset element (add plan in phase1)` });
        if (["width", "height", "duration"].some((k) => k in (el || {}))) issues.push({ id, issue: "duration/width/height must not live inside elements (plan / top-level own them)" });
        // <d> mirror vs plan lines
        const pl = planById.get(id);
        const dLines = extractDLines(el?.prompt);
        if (pl && (pl.voice === "dialogue" || pl.voice === "narration")) {
          if (!dLines) issues.push({ id, issue: `plan voice is ${pl.voice} but prompt has no <d> block` });
          else if (JSON.stringify(dLines) !== JSON.stringify(normLines(pl.lines))) {
            warnings.push({ id, issue: "<d> lines differ from plan lines (plan is source of truth for subtitles)", plan_lines: normLines(pl.lines), prompt_d_lines: dLines });
          }
          if (dLines && dLines.some((l) => /[0-9a-zA-Z]/.test(l))) warnings.push({ id, issue: "<d> contains digits/latin letters (QA: use Chinese numerals, avoid English)" });
        }
        if (pl && pl.voice === "scene" && dLines) issues.push({ id, issue: "scene block must not contain <d>" });
      }
      if (data.phase === 2) {
        for (const pl of data.plan) {
          if (pl && pl.id && !storyById.has(pl.id)) issues.push({ id: pl.id, issue: "plan block has no story element yet (phase2 coverage)" });
        }
      }
      const cycles = [];
      for (const id of storyById.keys()) {
        const { cycles: c } = collectChain(data.story, id);
        for (const s of c) if (!cycles.includes(s)) cycles.push(s);
      }
      return ok({ file: abs, phase: data.phase, plan_blocks: data.plan.length, story_count: data.story.length, valid: !issues.length && !cycles.length, issues, warnings, cycles });
    }
  );

  server.registerTool(
    "story_export_srt",
    {
      title: "story_export_srt",
      description: "Export YouTube SRT (§6.5) from the plan table: scale = total_seconds / planned_total, per-line cues (short lines front-weighted, long blocks split evenly), narration wrapped in <i>. Needs no videos.",
      inputSchema: {
        file: z.string().describe("Story JSON path"),
        total_seconds: z.number().positive().describe("actual merged total seconds (merge_videos回傳的 total_seconds)"),
        out: z.string().optional().describe("SRT output path (default: same dir, same basename + .srt)")
      }
    },
    async (p) => {
      const abs = resolve(p.file);
      const data = loadStory(abs);
      const { cues, scale, plannedTotal, actualTotal } = buildSrtCues(data.plan, p.total_seconds);
      const dest = p.out ? resolve(p.out) : abs.replace(/\.json$/i, "") + ".srt";
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, cuesToSrt(cues), "utf-8");
      return ok({ srt: dest, cues: cues.length, scale: Number(scale.toFixed(4)), planned_total_sec: plannedTotal, actual_total_sec: actualTotal });
    }
  );

  return server;
}
