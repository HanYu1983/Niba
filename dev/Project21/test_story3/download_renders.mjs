/**
 * Download every completed clip listed in render_history_report.json from ComfyUI
 * into the configured output root, preserving the output subfolder, then fold the
 * result back into render_manifest.json.
 *
 *   node test_story3/download_renders.mjs
 */
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const BASE = "http://100.106.154.88:8000";
const ROOT = resolve("output");
const REPORT = resolve("test_story3/render_history_report.json");
const MANIFEST = resolve("test_story3/render_manifest.json");

const report = JSON.parse(readFileSync(REPORT, "utf8"));
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));

const jobs = [];
for (const entry of report.segments) {
  if (!entry.outputs.length) continue;
  const files = [];
  for (const out of entry.outputs) {
    const parts = out.subfolder.split(/[\\/]+/).filter(Boolean);
    const dest = resolve(ROOT, ...parts, out.filename);
    jobs.push({ entry, out, dest });
    files.push(dest);
  }
  entry._destFiles = files;
}

let ok = 0;
let skipped = 0;
const failed = [];

async function downloadOne({ entry, out, dest }) {
  mkdirSync(dirname(dest), { recursive: true });
  if (existsSync(dest) && statSync(dest).size > 0) {
    skipped++;
    return dest;
  }
  const url = `${BASE}/view?filename=${encodeURIComponent(out.filename)}&subfolder=${encodeURIComponent(out.subfolder)}&type=${encodeURIComponent(out.type || "output")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${entry.seg} ${out.filename}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) throw new Error(`${entry.seg} ${out.filename}: empty body`);
  writeFileSync(dest, buf);
  ok++;
  return dest;
}

// Four at a time keeps the box's HTTP server happy without going serial.
const queue = jobs.slice();
const workers = Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const job = queue.shift();
    try {
      await downloadOne(job);
    } catch (e) {
      failed.push({ seg: job.entry.seg, file: job.out.filename, error: e.message });
    }
  }
});
await Promise.all(workers);

// Fold the successful downloads back into the per-segment manifest.
for (const entry of report.segments) {
  if (!entry.outputs.length) continue;
  const rec = manifest.segments[entry.seg];
  if (!rec) continue;
  rec.status = "success";
  rec.queued = false;
  rec.files = entry._destFiles;
  rec.downloaded_at = new Date().toISOString();
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");

const totalBytes = report.segments
  .flatMap((e) => e._destFiles ?? [])
  .filter((p) => existsSync(p))
  .reduce((n, p) => n + statSync(p).size, 0);

console.log(
  JSON.stringify(
    {
      segments_with_outputs: report.segments.filter((e) => e.outputs.length).length,
      files: jobs.length,
      downloaded: ok,
      skipped_existing: skipped,
      failed,
      total_bytes: totalBytes,
      manifest: MANIFEST
    },
    null,
    2
  )
);
