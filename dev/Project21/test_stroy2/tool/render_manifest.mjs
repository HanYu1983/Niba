/**
 * Join the ComfyUI job ledger with the project's block list.
 *
 *   node build/render_manifest.mjs
 *
 * Writes ../render_manifest.json: one row per block, newest non-cancelled job first,
 * so "which prompt_id / file belongs to block N" is answerable from the repository.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const PROJECT_ROOT = path.dirname(ROOT);
const JOBS = path.join(PROJECT_ROOT, "comfyui_mcp", "jobs");

const project = JSON.parse(readFileSync(path.join(ROOT, "momotaro.json"), "utf8"));

const jobs = [];
for (const file of readdirSync(JOBS)) {
  if (!file.endsWith(".json")) continue;
  try {
    const job = JSON.parse(readFileSync(path.join(JOBS, file), "utf8"));
    // "test_stroy2" and "test_stroy2/momotaro.json" both mean this project.
    if (String(job?.label?.project ?? "").startsWith("test_stroy2")) jobs.push(job);
  } catch {
    /* a half-written ledger file is not worth failing over */
  }
}

const newest = (a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at));

/* 選片規則（刻意保持簡單，讓「刪檔」就是唯一的人工控制手段）：
 *   1. 只看這個 block 的 job，排除 cancelled；
 *   2. 由新到舊排；
 *   3. 跳過「檔案已經不存在」的 job —— 刪掉影片檔就等於淘汰那個 take；
 *   4. 取第一個還存在的檔案。
 * 沒有 files[0].path 的 job 是提交後沒被收回來的（wait:false），它們不是「被刪掉的 take」，
 * 所以另外算在 uncollected，不影響選片。
 * 不做任何「品質」判斷：manifest 只回答「這個 block 現在該用哪個檔」。 */
const rows = project.blocks.map((block, index) => {
  const mine = jobs
    .filter((j) => j.label?.block_id === block.id && j.status !== "cancelled")
    .sort(newest);
  const withFile = mine.filter((j) => Boolean(j.files?.[0]?.path));
  const alive = withFile.filter((j) => existsSync(j.files[0].path));
  const job = alive[0] ?? null;
  const deleted = withFile.length - alive.length;
  const uncollected = mine.length - withFile.length;
  return {
    index,
    block_id: block.id,
    seconds: block.timeframe.end_sec - block.timeframe.start_sec,
    prompt_id: job?.prompt_id ?? null,
    status:
      job?.status ?? (deleted > 0 ? "file-deleted" : uncollected > 0 ? "uncollected" : "not-rendered"),
    frames: job?.summary?.frames ?? null,
    size: job ? `${job.summary?.width}x${job.summary?.height}` : null,
    seed: job?.summary?.seed ?? null,
    file: job?.files?.[0]?.path ?? null,
    skipped_deleted: deleted,
    uncollected,
  };
});

const summary = rows.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] ?? 0) + 1;
  return acc;
}, {});

const payload = {
  project: "test_stroy2",
  generated_at: new Date().toISOString(),
  settings: { width: 608, height: 352, fps: 24, turbo: true, prompt: "compiled JSON payload" },
  summary,
  blocks: rows,
};

writeFileSync(path.join(ROOT, "render_manifest.json"), JSON.stringify(payload, null, 2) + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      summary,
      not_rendered: rows.filter((r) => r.status === "not-rendered").map((r) => r.block_id),
      needs_rerender: rows.filter((r) => r.status === "file-deleted").map((r) => r.block_id),
      superseded_by_deleting: rows.filter((r) => r.skipped_deleted > 0).map((r) => `${r.block_id} (-${r.skipped_deleted})`),
    },
    null,
    2
  )
);
