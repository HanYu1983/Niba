/**
 * One-off audit: ask ComfyUI which of the 79 submitted jobs actually exist in /history,
 * and list their output files. Writes a report next to the manifest; downloads nothing.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const base = "http://100.106.154.88:8000";
const manifest = JSON.parse(readFileSync(resolve("test_story3/render_manifest.json"), "utf8"));

const ids = Object.values(manifest.segments).map((s) => ({
  seg: s.segment_id,
  prompt_id: s.prompt_id,
  status: s.status
}));

const report = [];
let done = 0;
let missing = 0;

for (const item of ids) {
  let entry = { ...item, in_history: false, outputs: [], comfy_status: null };
  try {
    const res = await fetch(`${base}/history/${item.prompt_id}`);
    if (res.ok) {
      const body = await res.json();
      const rec = body[item.prompt_id];
      if (rec) {
        entry.in_history = true;
        entry.comfy_status = rec.status?.status_str ?? null;
        entry.completed = rec.status?.completed ?? null;
        for (const node of Object.values(rec.outputs ?? {})) {
          for (const key of ["gifs", "videos", "images"]) {
            for (const f of node[key] ?? []) {
              entry.outputs.push({ filename: f.filename, subfolder: f.subfolder ?? "", type: f.type ?? "output", key });
            }
          }
        }
      }
    }
  } catch (e) {
    entry.error = e.message;
  }
  if (entry.outputs.length) done++;
  else missing++;
  report.push(entry);
}

const summary = {
  checked_at: new Date().toISOString(),
  total: report.length,
  with_outputs: done,
  without_outputs: missing,
  segments: report
};
writeFileSync(resolve("test_story3/render_history_report.json"), JSON.stringify(summary, null, 2) + "\n", "utf8");

console.log(JSON.stringify({ total: summary.total, with_outputs: done, without_outputs: missing }, null, 2));
for (const r of report) {
  if (r.outputs.length) console.log(r.seg, r.prompt_id, r.comfy_status, r.outputs.map((o) => o.filename).join(","));
}
