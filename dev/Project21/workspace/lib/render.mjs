/**
 * Render one plan segment.
 *
 * The plan decides *which* plates to send (r2v) and how long the clip is. The prompt file
 * supplies the words. Nothing about the shot is re-derived here.
 *
 *   t2v  -> minimax_t2v, no reference images (method 1: text anchors only)
 *   r2v  -> minimax_r2v, `segment.reference_images` resolved to the newest plate per entity
 *   i2v  -> minimax_t2v plus a first (and optional last) frame
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

import { runTool } from "../../comfyui_mcp/runner.mjs";
import { entityIndex, quantiseFrames } from "./plan.mjs";
import { formatOf, readPrompt } from "./prompt.mjs";
import { plateDir, promptFileFor } from "./story.mjs";
import { upsertSegment } from "./manifest.mjs";

const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const MAX_SLOTS = 9;

/** Newest plate in the entity's folder; ComfyUI names files, the plan names folders. */
export function newestPlate(story, entity) {
  const dir = plateDir(story, entity);
  if (!existsSync(dir)) throw new Error(`${entity.id}: reference folder missing (${dir})`);
  const plate = readdirSync(dir)
    .filter((f) => IMAGE_RE.test(f))
    .map((f) => ({ f, mtime: statSync(resolve(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0];
  if (!plate) throw new Error(`${entity.id}: no plate in ${dir} — run workspace/tools/generate_refs.mjs first`);
  return { entityId: entity.id, path: resolve(dir, plate.f), file: plate.f, dir };
}

export function resolveSlots(story, plan, segment) {
  const byId = entityIndex(plan);
  const slots = (segment.reference_images ?? []).map((r) => {
    const entity = byId.get(r.ref);
    if (!entity) throw new Error(`${segment.id}: unknown entity in reference_images: ${r.ref}`);
    return { ...newestPlate(story, entity), role: r.role, note: r.note ?? "" };
  });
  if (slots.length > MAX_SLOTS) {
    throw new Error(`${segment.id}: ${slots.length} plates, H3 accepts at most ${MAX_SLOTS}`);
  }
  return slots;
}

/**
 * Build (and optionally submit) one job. Returns a plain descriptor so `--dry-run` and
 * `render_all` can reuse the same code path.
 */
export async function renderSegment(story, plan, segment, opts = {}) {
  const pick = promptFileFor(story, segment.id, opts.mode);
  const promptFile = opts.prompt ? resolve(String(opts.prompt)) : pick.file;
  if (!existsSync(promptFile)) {
    throw new Error(`${segment.id}: prompt file not found (${promptFile}) — expected ${segment.id}.{t2v,r2v,i2v}.txt`);
  }

  const prompt = readPrompt(promptFile);
  if (!prompt || prompt.trim() === "") throw new Error(`prompt file is empty: ${promptFile}`);

  const detected = formatOf(prompt);
  let mode = opts.mode && opts.mode !== true ? String(opts.mode) : null;
  if (!mode) mode = detected !== "unknown" ? detected : pick.mode ?? "t2v";
  if (opts.firstFrame) mode = "i2v";

  const warnings = [];
  if (pick.mode && detected !== "unknown" && pick.mode !== detected && pick.mode !== "i2v") {
    warnings.push(`${segment.id}: file says ${pick.mode} but fields say ${detected}`);
  }

  const slots = mode === "r2v" ? resolveSlots(story, plan, segment) : [];
  if (mode === "r2v") {
    if (slots.length === 0) throw new Error(`${segment.id}: r2v needs at least one reference image`);
    const referenced = new Set([...prompt.matchAll(/<Picture\s+(\d+)>/gi)].map((m) => Number(m[1])));
    const wrong = [...referenced].filter((n) => n < 1 || n > slots.length);
    if (wrong.length || (referenced.size > 0 && referenced.size !== slots.length)) {
      const detail = `${segment.id}: prompt references ${referenced.size} picture(s) [${[...referenced].sort((a, b) => a - b).join(", ")}], plan has ${slots.length} slot(s)`;
      if (!opts.force) throw new Error(`${detail} — fix the prompt or pass --force`);
      warnings.push(detail);
    }
  } else if (/<Picture\s+\d+>/i.test(prompt)) {
    warnings.push(`${segment.id}: t2v prompt contains <Picture N>, which t2v cannot resolve`);
  }

  const hasD = /<d>/i.test(prompt);
  if (!hasD && segment.kind !== "action") warnings.push(`${segment.id}: ${segment.kind} prompt has no <d> block`);
  if (hasD && segment.kind === "action") warnings.push(`${segment.id}: action prompt carries a <d> block`);

  const fps = Number(opts.fps ?? story.render.fps ?? 24);
  const requested = Number(opts.duration ?? segment.estimated_sec ?? 5);
  const frames = quantiseFrames(requested, fps);
  const duration = Number((frames / fps).toFixed(2));

  const seed = Number(opts.seed ?? (Math.floor(Date.now() / 1000) % 2_000_000_000));
  const take = Number(opts.take ?? 1);
  const width = Number(opts.width ?? story.render.width);
  const height = Number(opts.height ?? story.render.height);
  const turbo = opts.turbo ?? story.render.turbo ?? true;
  const prefix = String(opts.prefix ?? `render/${story.planBase}/${segment.id}`);

  const tool = mode === "r2v" ? "minimax_r2v" : "minimax_t2v";
  const args = {
    prompt,
    width,
    height,
    duration_sec: duration,
    frames,
    fps,
    turbo,
    seed,
    filename_prefix: prefix,
    ...(mode === "r2v" ? { reference_images: slots.map((s) => s.path), ref_image_size: String(opts.refSize ?? "match") } : {}),
    ...(opts.firstFrame ? { first_frame: resolve(String(opts.firstFrame)) } : {}),
    ...(opts.lastFrame ? { last_frame: resolve(String(opts.lastFrame)) } : {})
  };

  const label = { project: story.name, plan: story.planBase, segment_id: segment.id, take: String(take), mode, prompt: basename(promptFile) };
  const descriptor = {
    plan: story.planFile,
    segment: { id: segment.id, kind: segment.kind, location_ref: segment.location_ref ?? null },
    mode,
    prompt_file: promptFile,
    slots: slots.map((s, i) => ({ picture: i + 1, role: s.role, entity: s.entityId, plate: s.file })),
    width,
    height,
    duration_sec: duration,
    frames,
    fps,
    seed,
    take,
    turbo,
    prefix,
    tool,
    warnings
  };

  if (opts.dryRun) return { descriptor, result: null };

  const result = await runTool(tool, args, {
    label,
    wait: opts.wait ?? true,
    timeout_sec: Number(opts.timeoutSec ?? story.comfy.timeoutSec ?? 900),
    output_dir: story.outputDir
  });

  const record = {
    segment_id: segment.id,
    take,
    mode,
    prompt_id: result.prompt_id,
    prompt_file: promptFile,
    status: result.status,
    queued: result.status === "queued" || result.status === "running",
    seed,
    turbo,
    width,
    height,
    duration_sec: duration,
    frames,
    references: slots.map((s) => s.path),
    files: (result.files ?? []).map((f) => f.path),
    submitted_at: new Date().toISOString()
  };
  upsertSegment(story.manifestFile, segment.id, record);

  return { descriptor, result, record, manifest: story.manifestFile };
}

/** Poll command printed after an `--async` submit. */
export function pollCommand(promptId) {
  return `node comfyui_mcp/cli.mjs --job --prompt_id ${promptId} --wait true`;
}

/** Human label for a segment's clip, for logs. */
export function clipName(record) {
  const f = (record?.files ?? [])[0];
  return f ? basename(f, extname(f)) : "(not downloaded)";
}
