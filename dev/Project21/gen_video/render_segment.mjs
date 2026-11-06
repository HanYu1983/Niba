/**
 * Render one plan segment as a MiniMax H3 Ref2VA (r2v) clip.
 *
 *   node render_segment.mjs --plan test_story3/plan.ch0.json --seg seg_002 \
 *        --prompt test_story3/prompts/seg_002.r2v.txt
 *   node render_segment.mjs test_story3/plan.ch0.json seg_002 test_story3/prompts/seg_002.r2v.txt
 *
 * The plan is the source of truth for *which* pictures to send: `segment.reference_images`
 * is already in slot order (scene first), so the script only has to turn each `ref` into the
 * newest plate in that entity's folder. Nothing about the shot is re-derived here — the
 * prompt file supplies the words, the plan supplies the plates and the duration.
 *
 * Dry run prints the resolved job without touching the GPU:
 *
 *   node render_segment.mjs --plan … --seg seg_002 --prompt … --dry-run
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { runTool } from "../comfyui_mcp/runner.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const METADATA_FILE = resolve(HERE, "../comfyui_mcp/metadata.json");

const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const MAX_SLOTS = 9;

/* ------------------------------------------------------------------ args */

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
      continue;
    }
    const eq = a.indexOf("=");
    if (eq !== -1) {
      out[a.slice(2, eq)] = a.slice(eq + 1);
      continue;
    }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

/** `--flag false` / `--no-flag` both work; everything else is a string. */
function boolArg(args, name, fallback) {
  if (args[`no-${name}`] === true) return false;
  const v = args[name];
  if (v === undefined) return fallback;
  if (v === true) return true;
  return !["false", "0", "no", "off"].includes(String(v).toLowerCase());
}

const args = parseArgs(process.argv.slice(2));
const [posPlan, posSeg, posPrompt] = args._;
const planArg = args.plan ?? posPlan;
const promptArg = args.prompt ?? posPrompt;
const segId = String(args.seg ?? posSeg ?? "");
const planFile = planArg ? resolve(String(planArg)) : "";
const promptFile = promptArg ? resolve(String(promptArg)) : "";

if (!planFile || !segId || !promptFile || !existsSync(planFile) || !existsSync(promptFile)) {
  console.error(
    [
      "usage: node render_segment.mjs --plan <plan.json> --seg <seg_id> --prompt <prompt.txt> [options]",
      "",
      "  --take N           manifest take number (default 1)",
      "  --seed N           sampler seed (default: time-based)",
      "  --duration S       override the plan's estimated_sec",
      "  --width / --height default 608x352 (16:9 storyboard)",
      "  --fps N            default 24",
      "  --prefix P         default render/<plan name>/<seg id>",
      "  --ref-size match|max  default match",
      "  --no-turbo         full 20-step sampler instead of the 4-step ref LoRA",
      "  --dry-run          resolve plates + payload, do not submit",
      "  --force            submit even if the <Picture N> count mismatches the slots"
    ].join("\n")
  );
  process.exit(2);
}

/* ------------------------------------------------------------------ plan */

const plan = JSON.parse(readFileSync(planFile, "utf8"));
const segment = plan.segments?.find((s) => s.id === segId || String(s.order) === segId);
if (!segment) {
  const available = (plan.segments ?? []).map((s) => s.id).join(", ");
  console.error(`segment not found: ${segId}\nplan has: ${available}`);
  process.exit(2);
}

const outputDir = JSON.parse(readFileSync(METADATA_FILE, "utf8")).comfyui.output_dir;
const entities = new Map(
  [...(plan.entities?.characters ?? []), ...(plan.entities?.props ?? []), ...(plan.entities?.locations ?? [])].map(
    (e) => [e.id, e]
  )
);

/** Newest plate in the entity's folder; ComfyUI names files, the plan only names folders. */
function newestPlate(entityId) {
  const entity = entities.get(entityId);
  if (!entity) throw new Error(`unknown entity in reference_images: ${entityId}`);

  const rel = entity.reference?.image ?? `refs/${entityId}`;
  const dir = isAbsolute(rel) ? rel : resolve(outputDir, rel);
  if (!existsSync(dir)) throw new Error(`${entityId}: reference folder missing (${dir})`);

  const plate = readdirSync(dir)
    .filter((f) => IMAGE_RE.test(f))
    .map((f) => ({ f, mtime: statSync(resolve(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0];

  if (!plate) throw new Error(`${entityId}: no plate in ${dir} — run generate_refs.mjs first`);
  return { entityId, role: null, path: resolve(dir, plate.f), file: plate.f, dir };
}

const slots = (segment.reference_images ?? []).map((r) => {
  const plate = newestPlate(r.ref);
  return { ...plate, role: r.role, note: r.note ?? "" };
});

if (slots.length === 0) throw new Error(`${segId}: segment has no reference_images`);
if (slots.length > MAX_SLOTS) throw new Error(`${segId}: ${slots.length} plates, H3 accepts at most ${MAX_SLOTS}`);

/* ------------------------------------------------------------------ prompt */

const prompt = readFileSync(promptFile, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();
if (prompt === "") throw new Error(`prompt file is empty: ${promptFile}`);

// The six-field r2v prompt names its pictures; a mismatch means the wrong plate is in a slot.
const referenced = new Set([...prompt.matchAll(/<Picture\s+(\d+)>/gi)].map((m) => Number(m[1])));
const wrongSlots = [...referenced].filter((n) => n < 1 || n > slots.length);
if (wrongSlots.length > 0 || (referenced.size > 0 && referenced.size !== slots.length)) {
  const detail = `${segId}: prompt references ${referenced.size} picture(s) [${[...referenced].sort((a, b) => a - b).join(", ")}], plan has ${slots.length} slot(s)`;
  if (!args.force) throw new Error(`${detail} — fix the prompt or pass --force`);
  console.warn(`WARN ${detail}`);
}
if (!/<d>/i.test(prompt)) console.warn(`WARN ${segId}: prompt has no <d> block`);

/* ------------------------------------------------------------------ timing */

const requestedDuration = Number(args.duration ?? segment.estimated_sec ?? 5);
const fps = Number(args.fps ?? 24);
/** H3 pads to the 17k+5 frame grid; report the length the render will actually have. */
function quantiseFrames(seconds) {
  const raw = Math.max(5, Math.round(seconds * fps));
  return raw + (((5 - (raw % 17)) % 17) + 17) % 17;
}
const frames = quantiseFrames(requestedDuration);
const duration = frames / fps;

const seed = Number(args.seed ?? (Math.floor(Date.now() / 1000) % 2_000_000_000));
const take = Number(args.take ?? 1);
const planName = basename(planFile).replace(/\.json$/i, "");
const prefix = String(args.prefix ?? `render/${planName}/${segId}`);
const width = Number(args.width ?? 608);
const height = Number(args.height ?? 352);
const turbo = boolArg(args, "turbo", true);
const wait = boolArg(args, "wait", true);

const job = {
  tool: "minimax_r2v",
  prompt,
  reference_images: slots.map((s) => s.path),
  width,
  height,
  duration_sec: Number(duration.toFixed(2)),
  frames,
  fps,
  turbo,
  seed,
  ref_image_size: String(args["ref-size"] ?? "match"),
  filename_prefix: prefix,
  label: { project: planName, segment_id: segId, take: String(take), prompt: basename(promptFile) }
};

console.log(
  JSON.stringify(
    {
      plan: planFile,
      segment: { id: segment.id, kind: segment.kind, location_ref: segment.location_ref },
      prompt_file: promptFile,
      slots: slots.map((s, i) => ({ picture: i + 1, role: s.role, entity: s.entityId, plate: s.file })),
      duration_sec: job.duration_sec,
      frames,
      seed,
      take,
      turbo,
      prefix
    },
    null,
    2
  )
);

if (args["dry-run"]) {
  console.log("dry run: not submitting");
  process.exit(0);
}

/* ------------------------------------------------------------------ submit */

const started = Date.now();
const result = await runTool("minimax_r2v", job, {
  label: job.label,
  wait,
  timeout_sec: Number(args["timeout-sec"] ?? 900)
});

// A local manifest makes "which take of seg_002 is the keeper" answerable from the repo.
const manifestFile = resolve(dirname(planFile), "render_manifest.json");
const manifest = existsSync(manifestFile)
  ? JSON.parse(readFileSync(manifestFile, "utf8"))
  : { version: "1.0", plan: basename(planFile), segments: {} };
manifest.segments[segment.id] = {
  segment_id: segment.id,
  take,
  prompt_id: result.prompt_id,
  prompt_file: promptFile,
  status: result.status,
  seed,
  turbo,
  duration_sec: job.duration_sec,
  frames,
  references: job.reference_images,
  files: (result.files ?? []).map((f) => f.path),
  submitted_at: new Date().toISOString()
};
writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      status: result.status,
      prompt_id: result.prompt_id,
      seconds: Math.round((Date.now() - started) / 100) / 10,
      files: (result.files ?? []).map((f) => f.path),
      manifest: manifestFile
    },
    null,
    2
  )
);
process.exitCode = result.status === "success" ? 0 : 1;
