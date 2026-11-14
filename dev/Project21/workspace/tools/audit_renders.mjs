/**
 * Ask ComfyUI which submitted jobs still exist in /history, and list their output files.
 *
 *   node workspace/tools/audit_renders.mjs --story test_story3
 *
 * Writes `render_history_report.json` next to the manifest; downloads nothing.
 * Use it after a `render_all --async` batch, or when the automatic download was lost
 * because the box restarted or the queue was cancelled.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { parseArgs } from "../lib/args.mjs";
import { readManifest } from "../lib/manifest.mjs";
import { describeStory, loadStory } from "../lib/story.mjs";
import { exit } from "node:process";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan, prompts: args.prompts, manifest: args.manifest });
const manifest = readManifest(story.manifestFile, story.planFile);
const base = String(args.url ?? story.comfy.url ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("ComfyUI url is not configured (comfyui_mcp/metadata.json)");
  process.exit(2);
}

const entries = Object.values(manifest.segments).filter((r) => r.prompt_id);
const report = [];
let done = 0;
let missing = 0;

for (const item of entries) {
  const entry = { seg: item.segment_id, prompt_id: item.prompt_id, mode: item.mode ?? null, status: item.status, in_history: false, outputs: [], comfy_status: null };
  try {
    console.log(`handle: ${item.segment_id}`)
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
      } else{
        console("rec not found")
      }
    } else {
      console.log("res.ok not true")
    }
  } catch (e) {
    console.log(e.message)
    entry.error = e.message;
  }
  if (entry.outputs.length) done++;
  else missing++;
  report.push(entry);
}

const reportFile = resolve(story.dir, "render_history_report.json");
writeFileSync(
  reportFile,
  JSON.stringify(
    {
      checked_at: new Date().toISOString(),
      comfyui: base,
      plan: story.planBase,
      total: report.length,
      with_outputs: done,
      without_outputs: missing,
      segments: report
    },
    null,
    2
  ) + "\n",
  "utf8"
);

console.log(JSON.stringify({ ...describeStory(story), total: report.length, with_outputs: done, without_outputs: missing, report: reportFile }, null, 2));
if (report.some((r) => r.error)) console.log(`fetch errors: ${report.filter((r) => r.error).length} (see report)`);
// process.exitCode, not process.exit(): the history fetches above leave keep-alive sockets
// closing, and a hard exit can abort inside libuv on Windows before stdout is flushed.
process.exitCode = missing ? 1 : 0;
