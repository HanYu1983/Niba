/**
 * Download finished clips listed in a render_jobs.json produced by
 * generate_videos_from_json.mjs. Every clip lands in <output>/<shot.id>/.
 *
 *   node workspace/tools/download_videos_from_json.mjs --jobs .\test_story5\output\video\render_jobs.json --output .\test_story5\output\video
 *   node workspace/tools/download_videos_from_json.mjs .\test_story5\output\video\render_jobs.json --output .\test_story5\output\video --id shot_1_1
 *   node workspace/tools/download_videos_from_json.mjs --jobs ... --output ... --no-wait
 *
 * `--jobs` / the first positional arg is the path to render_jobs.json.
 * `--output` is the download root; each entry is written to <output>/<id>/.
 * By default this waits for queued/running jobs then downloads (`wait:true`). Use `--no-wait`
 * to fetch only clips already present in ComfyUI history and leave the rest pending.
 *
 * A summary is written to <output>/download_report.json.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { inspectJob } from "../../comfyui_mcp/runner.mjs";
import { boolArg, listArg, numArg, parseArgs, usage } from "../lib/args.mjs";

const VIDEO_RE = /\.(mp4|webm|mov|mkv)$/i;
const args = parseArgs();

const jobsArg = args.jobs ?? args.json ?? args._[0];
const outputArg = args.output ?? args.out;
if (!jobsArg || jobsArg === true) {
  usage("missing --jobs <render_jobs.json>", [
    "usage: node workspace/tools/download_videos_from_json.mjs --jobs <render_jobs.json> --output <dir> [--id <shot_id>]"
  ]);
}
if (!outputArg || outputArg === true) {
  usage("missing --output <dir>", ["clips are downloaded to <output>/<shot.id>/"]);
}

const jobsFile = resolve(String(jobsArg));
const outputRoot = resolve(String(outputArg));
const reportFile = resolve(outputRoot, "download_report.json");

let info;
try {
  info = JSON.parse(readFileSync(jobsFile, "utf8"));
} catch (e) {
  usage(`cannot read ${jobsFile}: ${e.message}`, ["--jobs must point to a readable render_jobs.json"]);
}
if (!Array.isArray(info?.shots)) {
  usage(`${jobsFile} has no shots[] array`, ["expected the render_jobs.json written by generate_videos_from_json.mjs"]);
}

const requestedIds = [...new Set([...listArg(args, "id"), ...listArg(args, "shot")])];
const force = boolArg(args, "force", false);
const dryRun = boolArg(args, "dry-run", false);
const wait = boolArg(args, "wait", true);
const timeoutSec = numArg(args, "timeout_sec", Number(info.comfyui?.timeout_sec ?? 900));
const entries = requestedIds.length ? info.shots.filter((s) => requestedIds.includes(s.id)) : info.shots;

/** Match generate_videos_from_json.mjs so folders line up. */
function folderName(id) {
  const safe = String(id).replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "");
  if (!safe || safe === "." || safe === "..") throw new Error(`unsafe id: ${JSON.stringify(id)}`);
  return safe;
}
const dirFor = (id) => resolve(outputRoot, folderName(id));

function existingVideos(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && VIDEO_RE.test(e.name) && statSync(resolve(dir, e.name)).size > 0)
    .map((e) => resolve(dir, e.name));
}

const todo = [];
const skipped = [];
for (const shot of entries) {
  const id = shot?.id;
  if (!id || !shot.prompt_id) {
    skipped.push({ id: id ?? null, reason: "no prompt_id" });
    continue;
  }
  const destDir = dirFor(id);
  if (!force && existingVideos(destDir).length) {
    skipped.push({ id, reason: "already downloaded", dir: destDir });
    continue;
  }
  todo.push({ shot, destDir });
}

console.log(
  JSON.stringify(
    {
      jobs: jobsFile,
      output: outputRoot,
      comfyui_url: info.comfyui?.url ?? null,
      entries: entries.length,
      downloading: todo.length,
      skipped: skipped.length,
      wait,
      timeout_sec: timeoutSec,
      ...(force ? { force: true } : {}),
      ...(dryRun ? { dry_run: true } : {})
    },
    null,
    2
  )
);

if (dryRun) {
  for (const { shot, destDir } of todo) console.log(`${shot.id} -> ${destDir}`);
  process.exitCode = skipped.length ? 1 : 0;
} else {
  mkdirSync(outputRoot, { recursive: true });

  const rows = [];
  const failed = [];
  const pending = [];

  for (const [i, { shot, destDir }] of todo.entries()) {
    const tag = `[${i + 1}/${todo.length}] ${shot.id}`;
    mkdirSync(destDir, { recursive: true });
    try {
      const result = await inspectJob(shot.prompt_id, {
        wait,
        timeout_sec: timeoutSec,
        download: true,
        output_dir: destDir
      });
      const files = (result.files ?? []).map((f) => f.path ?? f);
      const row = {
        id: shot.id,
        prompt_id: shot.prompt_id,
        status: result.status,
        output_dir: destDir,
        files,
        ...(result.completed !== undefined ? { completed: result.completed } : {}),
        ...(result.errors?.length ? { errors: result.errors } : {})
      };
      rows.push(row);
      if (result.status === "success") {
        console.log(`${tag} success ${files.length} file(s) -> ${destDir}`);
      } else if (!wait && ["queued", "running"].includes(result.status)) {
        pending.push({ id: shot.id, prompt_id: shot.prompt_id, status: result.status });
        console.log(`${tag} ${result.status} (not ready yet)`);
      } else {
        failed.push({ id: shot.id, status: result.status, error: result.errors ?? null });
        console.error(`${tag} ${result.status}`);
      }
    } catch (e) {
      rows.push({ id: shot.id, prompt_id: shot.prompt_id, status: "failed", error: e.message, output_dir: destDir });
      failed.push({ id: shot.id, status: "failed", error: e.message });
      console.error(`${tag} FAILED ${e.message}`);
    }
  }

  const report = {
    jobs: jobsFile,
    output: outputRoot,
    comfyui: info.comfyui ?? null,
    downloaded_at: new Date().toISOString(),
    wait,
    skipped,
    shots: rows,
    pending,
    failed
  };
  writeFileSync(reportFile, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(
    JSON.stringify(
      {
        downloaded: rows.filter((r) => r.status === "success").length,
        pending,
        failed,
        report: reportFile
      },
      null,
      2
    )
  );
  // process.exitCode, not process.exit(): pending fetch sockets can abort stdout on Windows.
  process.exitCode = failed.length ? 1 : 0;
}
