/** One-off: collect the newest 74 completed test_stroy2 jobs from ComfyUI history. */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { inspectJob } from "../../comfyui_mcp/runner.mjs";

const JOBS = "D:\\han\\Niba\\dev\\Project21\\comfyui_mcp\\jobs";
const JOBS_DIR = path.dirname(JOBS);

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
  .sort((a, b) => String(a.submitted_at).localeCompare(String(b.submitted_at)))
  .slice(-74);

console.log(`${jobs.length} jobs, ${jobs[0].submitted_at} .. ${jobs.at(-1).submitted_at}`);
void JOBS_DIR;

const results = [];
for (let i = 0; i < jobs.length; i += 4) {
  const chunk = jobs.slice(i, i + 4);
  const settled = await Promise.allSettled(
    chunk.map((j) => inspectJob(j.prompt_id, { wait: true, download: true, timeout_sec: 60 }))
  );
  settled.forEach((s, k) => {
    const job = chunk[k];
    results.push({
      block_id: job.label.block_id,
      prompt_id: job.prompt_id,
      status: s.status === "fulfilled" ? s.value.status : "error",
      file: s.status === "fulfilled" ? (s.value.files?.[0]?.path ?? null) : null,
      error: s.status === "fulfilled" ? null : String(s.reason).slice(0, 160)
    });
  });
  process.stdout.write(`\r${results.length}/${jobs.length}`);
}
console.log("");

const ok = results.filter((r) => r.status === "success" && r.file);
const bad = results.filter((r) => !(r.status === "success" && r.file));
console.log(JSON.stringify({ total: results.length, downloaded: ok.length, failed: bad.length }, null, 2));
for (const b of bad) console.log(`${b.block_id}  ${b.status}  ${b.error ?? "no file"}`);
