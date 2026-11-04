/**
 * Reconcile the render manifest with comfyui_mcp's job ledger.
 *
 * The ledger is the source of truth: every submission writes one file the moment ComfyUI
 * accepts it, and the status is refreshed whenever anyone asks about the job. The manifest
 * next to the story is a convenience index ("which take of block 12 is the keeper"), and it
 * can drift — a job that timed out in the renderer but finished on the GPU, or the two
 * blocks that were rendered by hand before the batch existed.
 *
 *   node sync_manifest.mjs            # report what would change
 *   node sync_manifest.mjs --write    # apply
 *
 * For each block the newest successful ledger entry wins; failures never overwrite a keeper.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const HERE = "D:\\han\\Niba\\dev\\Project21";
const JOBS_DIR = resolve(HERE, "comfyui_mcp/jobs");
const MANIFEST = resolve(HERE, "test_story1/ch04_render_manifest.json");

const write = process.argv.includes("--write");

const manifest = existsSync(MANIFEST)
  ? JSON.parse(readFileSync(MANIFEST, "utf8"))
  : { version: "1.0", project: "test_story1/ch04_from_plan.json", blocks: {} };
manifest.blocks ??= {};

const PROJECT_LABEL = manifest.project ?? "test_story1/ch04_from_plan.json";

const jobs = readdirSync(JOBS_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    try {
      return JSON.parse(readFileSync(resolve(JOBS_DIR, f), "utf8"));
    } catch {
      return null;
    }
  })
  .filter((j) => j && j.tool === "minimax_r2v" && String(j.label?.project ?? "").startsWith(PROJECT_LABEL) && j.label?.block_id);

/** Newest success per block, keyed by block_id. */
const keepers = new Map();
for (const job of jobs) {
  if (job.status !== "success") continue;
  const file = job.files?.[0];
  if (!file?.path) continue;
  const id = job.label.block_id;
  const prev = keepers.get(id);
  if (!prev || String(job.submitted_at) > String(prev.submitted_at)) keepers.set(id, job);
}

const changes = [];
for (const [id, job] of keepers) {
  const file = job.files[0];
  const have = manifest.blocks[id];
  if (have?.prompt_id === job.prompt_id) continue;
  changes.push({
    id,
    from: have ? `${have.prompt_id?.slice(0, 8) ?? "(no job)"} take ${have.take ?? "?"}` : "(absent)",
    to: `${job.prompt_id.slice(0, 8)} take ${job.label.take}`,
    file: file.path
  });
  manifest.blocks[id] = {
    block_id: id,
    prompt_id: job.prompt_id,
    take: Number(job.label.take ?? 1),
    seed: job.summary?.seed ?? null,
    status: job.status,
    duration_sec: file.duration_sec ?? null,
    frames: file.frame_count ?? job.summary?.frames ?? null,
    audio_mode: have?.audio_mode ?? null,
    references: have?.references ?? [],
    file: file.path,
    bytes: file.bytes ?? null,
    submitted_at: job.submitted_at ?? null
  };
}

/* Entries that point at files which no longer exist are worse than no entry at all. */
for (const [id, entry] of Object.entries(manifest.blocks)) {
  if (entry.file && !existsSync(entry.file)) {
    changes.push({ id, from: `${entry.prompt_id?.slice(0, 8)} take ${entry.take}`, to: "(dropped: file missing)" });
    delete manifest.blocks[id];
  }
}

console.log(`ledger jobs ${jobs.length}   successful blocks ${keepers.size}   manifest blocks ${Object.keys(manifest.blocks).length}`);
for (const c of changes) console.log(`  ${c.id}  ${c.from} -> ${c.to}`);

if (write && changes.length > 0) {
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`wrote ${MANIFEST}`);
} else if (changes.length > 0) {
  console.log("(dry run; pass --write to apply)");
}
