/**
 * Build an ffmpeg concat list for the portrait (544x960) takes, in story order.
 *
 *   node build/concat_portrait.mjs
 *
 * Picks, for every block in momotaro.json, the newest downloaded 544x960 job from the ledger,
 * and writes build/concat_portrait.txt (absolute paths, ffconcat quoting).
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const PROJECT_ROOT = path.dirname(ROOT);
const JOBS = path.join(PROJECT_ROOT, "comfyui_mcp", "jobs");
const WIDTH = 544;
const HEIGHT = 960;

const project = JSON.parse(readFileSync(path.join(ROOT, "momotaro.json"), "utf8"));

const jobs = readdirSync(JOBS)
  .filter((f) => f.endsWith(".json"))
  .map((f) => {
    try {
      return JSON.parse(readFileSync(path.join(JOBS, f), "utf8"));
    } catch {
      return null;
    }
  })
  .filter((j) => j && String(j.label?.project ?? "").startsWith("test_stroy2"))
  .filter((j) => j.status !== "cancelled" && j.label?.block_id)
  .filter((j) => j.summary?.width === WIDTH && j.summary?.height === HEIGHT)
  .filter((j) => {
    const file = j.files?.[0]?.path;
    return Boolean(file) && existsSync(file);
  });

const newest = (a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at));

const missing = [];
const picks = project.blocks.map((block) => {
  const job = jobs.filter((j) => j.label.block_id === block.id).sort(newest)[0];
  if (!job) {
    missing.push(block.id);
    return null;
  }
  const file = job.files[0];
  return {
    block_id: block.id,
    prompt_id: job.prompt_id,
    path: file.path,
    seconds: file.duration_sec ?? job.summary?.duration_sec ?? null,
    frames: file.frame_count ?? job.summary?.frames ?? null
  };
});

if (missing.length > 0) {
  console.error(`no ${WIDTH}x${HEIGHT} take for: ${missing.join(", ")}`);
  process.exitCode = 1;
}

const list = picks.filter(Boolean);
const total = list.reduce((a, p) => a + (p.seconds ?? 0), 0);
const frames = list.reduce((a, p) => a + (p.frames ?? 0), 0);
const bytes = list.reduce((a, p) => a + statSync(p.path).size, 0);

const concat = list.map((p) => `file '${p.path.replace(/\\/g, "/")}'`).join("\n") + "\n";
writeFileSync(path.join(HERE, "concat_portrait.txt"), concat, "utf8");

console.log(
  JSON.stringify(
    {
      clips: list.length,
      total_sec: Number(total.toFixed(2)),
      total_frames: frames,
      total_mb: Number((bytes / 1048576).toFixed(1)),
      first: list[0]?.block_id,
      last: list.at(-1)?.block_id,
      list: path.join(HERE, "concat_portrait.txt")
    },
    null,
    2
  )
);
