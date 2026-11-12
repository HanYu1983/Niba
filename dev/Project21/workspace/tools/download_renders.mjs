/**
 * Download every completed clip listed in render_history_report.json into the story's
 * output folder, then fold the paths back into render_manifest.json.
 *
 *   node workspace/tools/download_renders.mjs --story test_story3
 *   node workspace/tools/download_renders.mjs --story test_story3 --force
 *
 * This is the recovery path: `render_segment` already downloads on success, but a box
 * restart or a cancelled queue loses the automatic download while the job still exists
 * in /history.
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { boolArg, parseArgs } from "../lib/args.mjs";
import { readManifest, writeManifest } from "../lib/manifest.mjs";
import { describeStory, loadStory } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan, prompts: args.prompts, manifest: args.manifest });
const manifest = readManifest(story.manifestFile, story.planFile);
const reportFile = resolve(story.dir, "render_history_report.json");

if (!existsSync(reportFile)) {
  console.error(`missing ${reportFile} — run audit_renders.mjs first`);
  process.exit(2);
}

const report = JSON.parse(readFileSync(reportFile, "utf8"));
const base = String(args.url ?? story.comfy.url ?? report.comfyui ?? "").replace(/\/+$/, "");
const force = boolArg(args, "force", false);

const jobs = [];
for (const entry of report.segments) {
  if (!entry.outputs?.length) continue;
  const files = [];
  for (const out of entry.outputs) {
    const parts = String(out.subfolder ?? "").split(/[\\/]+/).filter(Boolean);
    const dest = resolve(story.outputDir, ...parts, out.filename);
    jobs.push({ entry, out, dest });
    files.push(dest);
  }
  entry._destFiles = files;
}

let downloaded = 0;
let skipped = 0;
const failed = [];

async function downloadOne({ entry, out, dest }) {
  mkdirSync(dirname(dest), { recursive: true });
  if (!force && existsSync(dest) && statSync(dest).size > 0) {
    skipped++;
    return dest;
  }
  const url = `${base}/view?filename=${encodeURIComponent(out.filename)}&subfolder=${encodeURIComponent(out.subfolder ?? "")}&type=${encodeURIComponent(out.type || "output")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${entry.seg} ${out.filename}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) throw new Error(`${entry.seg} ${out.filename}: empty body`);
  writeFileSync(dest, buf);
  downloaded++;
  return dest;
}

// Four at a time keeps the box's HTTP server happy without going serial.
const queue = jobs.slice();
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const job = queue.shift();
      try {
        await downloadOne(job);
      } catch (e) {
        failed.push({ seg: job.entry.seg, file: job.out.filename, error: e.message });
      }
    }
  })
);

// Only fold a segment back when every one of its outputs landed.
for (const entry of report.segments) {
  if (!entry.outputs?.length) continue;
  const rec = manifest.segments[entry.seg];
  if (!rec) continue;
  const landed = (entry._destFiles ?? []).filter((p) => existsSync(p));
  if (!landed.length) continue;
  rec.status = landed.length === entry._destFiles.length ? "success" : "partial";
  rec.queued = false;
  rec.files = landed;
  rec.downloaded_at = new Date().toISOString();
}
writeManifest(story.manifestFile, manifest);

const totalBytes = report.segments
  .flatMap((e) => e._destFiles ?? [])
  .filter((p) => existsSync(p))
  .reduce((n, p) => n + statSync(p).size, 0);

console.log(
  JSON.stringify(
    {
      ...describeStory(story),
      segments_with_outputs: report.segments.filter((e) => e.outputs?.length).length,
      files: jobs.length,
      downloaded,
      skipped_existing: skipped,
      failed,
      total_mb: Number((totalBytes / 1048576).toFixed(1))
    },
    null,
    2
  )
);
// process.exitCode, not process.exit(): the downloads above leave keep-alive sockets
// closing, and a hard exit can abort inside libuv on Windows before stdout is flushed.
process.exitCode = failed.length ? 1 : 0;
