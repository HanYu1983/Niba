/**
 * Batch renderer: compile every block, submit it to ComfyUI, record what came back.
 *
 *   node render_blocks.mjs --only block_003_indictment       # one block, for review
 *   node render_blocks.mjs --from block_004 --wait           # the rest, blocking each
 *   node render_blocks.mjs --take 2 --only block_016_frozen_eyes   # a corrected retake
 *
 * Renders are strictly sequential: the GPU box is shared, and one 8-second clip already
 * saturates it. Each submission is recorded by comfyui_mcp's job ledger (prompt_id +
 * label), and this script keeps a smaller manifest next to the story so that "which take
 * of block 12 is the keeper" is answerable from the repository, not from a chat log.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { runTool } from "../comfyui_mcp/runner.mjs";
import { compileAll } from "./render_plan.mjs";

const HERE = "D:\\han\\Niba\\dev\\Project21";
const DEFAULTS = {
  project: resolve(HERE, "test_story1/ch04_from_plan.json"),
  notes: resolve(HERE, "test_story1/ch04_shot_notes.json"),
  manifest: resolve(HERE, "test_story1/ch04_render_manifest.json")
};

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
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

const args = parseArgs(process.argv.slice(2));
const projectFile = resolve(args.project ?? DEFAULTS.project);
const notesFile = resolve(args.notes ?? DEFAULTS.notes);
const manifestFile = resolve(args.manifest ?? DEFAULTS.manifest);
const take = Number(args.take ?? 1);
const prefix = args.prefix ?? "render/ch04";

const project = JSON.parse(readFileSync(projectFile, "utf8"));
const notes = JSON.parse(readFileSync(notesFile, "utf8"));
const { jobs, errors, summary } = compileAll(project, notes, { projectFile, take, prefix });

for (const err of errors) console.log(`compile failed  ${err.block_id}  ${err.error}`);

/** A job is worth submitting only if nothing in it breaks the hard rules. */
function blockers(job) {
  return job.issues.filter((i) => i.kind !== "refs-override" && i.kind !== "script-normalised");
}

let queue = jobs;
if (typeof args.only === "string") {
  const pattern = args.only.split(",").map((s) => s.trim()).filter(Boolean);
  const wanted = new Set(
    jobs.filter((j) => pattern.some((p) => j.block_id === p || j.block_id.startsWith(p))).map((j) => j.block_id)
  );
  queue = queue.filter((j) => wanted.has(j.block_id));
}
if (typeof args.from === "string") {
  const at = jobs.findIndex((j) => j.block_id === args.from || j.block_id.startsWith(`${args.from}_`));
  if (at === -1) throw new Error(`--from: unknown block ${args.from}`);
  queue = queue.slice(at);
}
if (typeof args.blocks === "string") {
  queue = queue.slice(0, Number(args.blocks));
}

const manifest = existsSync(manifestFile)
  ? JSON.parse(readFileSync(manifestFile, "utf8"))
  : { version: "1.0", project: notes.project ?? null, blocks: {} };

function save() {
  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

console.log(
  `queue ${queue.length}/${jobs.length} blocks, ${queue.reduce((a, j) => a + j.duration_sec, 0)}s of video, ` +
    `take ${take}, prefix ${prefix}`
);
save();

let ok = 0;
let skipped = 0;
let failed = 0;

for (const [n, job] of queue.entries()) {
  const label = `[${n + 1}/${queue.length}] ${job.block_id}`;
  const bad = blockers(job);
  if (bad.length > 0) {
    skipped++;
    console.log(`${label}  SKIP  ${bad.map((b) => `${b.kind}:${b.line ?? b.why ?? ""}`).join(" | ")}`);
    continue;
  }

  const started = Date.now();
  try {
    const result = await runTool(
      "minimax_r2v",
      {
        prompt: job.prompt,
        reference_images: job.reference_images,
        width: job.width,
        height: job.height,
        duration_sec: job.duration_sec,
        fps: job.fps,
        turbo: true,
        seed: job.seed,
        filename_prefix: job.filename_prefix
      },
      { label: job.label, wait: true, timeout_sec: Number(args.timeout_sec ?? 900) }
    );

    const file = result.files?.[0] ?? null;
    manifest.blocks[job.block_id] = {
      block_id: job.block_id,
      prompt_id: result.prompt_id,
      take,
      seed: job.seed,
      status: result.status,
      duration_sec: job.duration_sec,
      frames: job.frames,
      audio_mode: job.audio_mode,
      references: job.reference_images,
      file: file?.path ?? null,
      bytes: file?.bytes ?? null,
      submitted_at: new Date().toISOString()
    };
    save();

    if (result.status === "success") {
      ok++;
      const secs = ((Date.now() - started) / 1000).toFixed(0);
      console.log(`${label}  ok  ${secs}s  ${file?.filename ?? "(no file)"}`);
    } else {
      console.log(`${label}  ${result.status}  prompt_id ${result.prompt_id} (collect it later with comfy_job)`);
    }
  } catch (e) {
    failed++;
    console.log(`${label}  FAIL  ${e.message}`);
    manifest.blocks[job.block_id] = {
      block_id: job.block_id,
      take,
      seed: job.seed,
      status: "error",
      duration_sec: job.duration_sec,
      error: e.message,
      at: new Date().toISOString()
    };
    save();
  }
}

console.log(`done  ok ${ok}  failed ${failed}  skipped ${skipped}  manifest ${manifestFile}`);
process.exitCode = failed > 0 ? 1 : 0;
