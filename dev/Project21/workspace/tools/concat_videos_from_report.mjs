/**
 * Concatenate clips listed in a render_jobs.json into one film.
 *
 *   node workspace/tools/concat_videos_from_report.mjs .\test_story5\output\video\render_jobs.json
 *   node workspace/tools/concat_videos_from_report.mjs --jobs ... --reencode
 *   node workspace/tools/concat_videos_from_report.mjs --jobs ... --from shot_1_1 --to shot_2_1 --out .\final.mp4
 *
 * For each shot id this looks under the jobs' output root for the folder with the newest
 * creation time (`<id>` or `<id>_...` / `<id>-...`), then takes the newest video file inside it.
 * Order comes from the jobs' shots[] array (the order the jobs were submitted).
 * Stream copy is the default; --reencode forces H.264/AAC when a join drifts.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";

import { boolArg, parseArgs, usage } from "../lib/args.mjs";
import { created, newestOwnedFolder } from "../lib/folders.mjs";
import { concat } from "../lib/media.mjs";

const VIDEO_RE = /\.(mp4|webm|mov|mkv)$/i;
const args = parseArgs();

const jobsArg = args.jobs ?? args.json ?? args.report ?? args._[0];
if (!jobsArg || jobsArg === true) {
  usage("missing --jobs <render_jobs.json>", [
    "usage: node workspace/tools/concat_videos_from_report.mjs --jobs <render_jobs.json> [--out <file>] [--reencode]"
  ]);
}

const jobsFile = resolve(String(jobsArg));
let jobs;
try {
  jobs = JSON.parse(readFileSync(jobsFile, "utf8"));
} catch (e) {
  usage(`cannot read ${jobsFile}: ${e.message}`, ["--jobs must point to a readable render_jobs.json"]);
}
if (!Array.isArray(jobs?.shots)) {
  usage(`${jobsFile} has no shots[] array`, ["expected the render_jobs.json written by generate_videos_from_json.mjs"]);
}
// Use every job id, not just the selected range, so overlapping ids cannot
// steal another shot's folder.
const knownShotIds = jobs.shots.map((s) => s?.id).filter(Boolean);

const rootArg = args.root ?? args.output ?? args["output-root"];
const outputRoot = rootArg && rootArg !== true ? resolve(String(rootArg)) : resolve(String(jobs.output ?? dirname(jobsFile)));
const out = resolve(String(args.out ?? resolve(outputRoot, "merged.mp4")));
const reencode = boolArg(args, "reencode", false);
const dryRun = boolArg(args, "dry-run", false);

let shots = jobs.shots;
if (args.from && args.from !== true) {
  const idx = shots.findIndex((s) => s.id === String(args.from));
  if (idx < 0) usage(`--from ${args.from} is not in the jobs`, ["available: " + shots.map((s) => s.id).join(", ")]);
  shots = shots.slice(idx);
}
if (args.to && args.to !== true) {
  const idx = shots.findIndex((s) => s.id === String(args.to));
  if (idx < 0) usage(`--to ${args.to} is not in the jobs`, ["available: " + shots.map((s) => s.id).join(", ")]);
  shots = shots.slice(0, idx + 1);
}

/** Newest folder owned by this shot id, never another overlapping id. */
const newestDirFor = (id) => newestOwnedFolder(outputRoot, id, knownShotIds);

function newestVideo(dir) {
  if (!dir || !existsSync(dir)) return null;
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && VIDEO_RE.test(e.name))
    .map((e) => {
      const file = resolve(dir, e.name);
      try {
        return { file, stat: statSync(file) };
      } catch {
        return null;
      }
    })
    .filter((r) => r && r.stat.size > 0)
    .sort((a, b) => created(b.stat) - created(a.stat) || b.stat.mtimeMs - a.stat.mtimeMs)[0]?.file ?? null;
}

const clips = [];
const skipped = [];
for (const shot of shots) {
  const id = shot?.id;
  if (!id) {
    skipped.push({ id: null, reason: "no id in jobs entry" });
    continue;
  }
  let dir;
  try {
    dir = newestDirFor(id);
  } catch (e) {
    skipped.push({ id, reason: e.message });
    continue;
  }
  if (!dir) {
    skipped.push({ id, reason: "no folder for id", root: outputRoot });
    continue;
  }
  const file = newestVideo(dir);
  if (!file) {
    skipped.push({ id, reason: "no video file in newest folder", dir });
    continue;
  }
  clips.push({ id, dir, file });
}

console.log(
  JSON.stringify(
    {
      jobs: jobsFile,
      root: outputRoot,
      output: out,
      clips: clips.length,
      skipped: skipped.length,
      mode: reencode ? "reencode" : "copy",
      total_mb: Number((clips.reduce((n, c) => n + statSync(c.file).size, 0) / 1048576).toFixed(1)),
      first: clips[0]?.id ?? null,
      last: clips.at(-1)?.id ?? null,
      ...(dryRun ? { dry_run: true } : {})
    },
    null,
    2
  )
);

if (!clips.length) {
  console.error("no clips found to concatenate");
  process.exitCode = 2;
} else if (dryRun) {
  for (const c of clips) console.log(`${c.id} -> ${c.dir} -> ${c.file}`);
  process.exitCode = skipped.length ? 1 : 0;
} else {
  const list = resolve(dirname(out), `${basename(out, extname(out))}_concat.txt`);
  const info = concat({ files: clips.map((c) => c.file), out, listFile: list, reencode });

  console.log(
    JSON.stringify(
      {
        output: out,
        list,
        mb: Number((info.bytes / 1048576).toFixed(2)),
        duration_sec: info.duration_sec,
        resolution: `${info.width}x${info.height}`,
        fps: info.fps,
        first_clip: basename(clips[0].file),
        last_clip: basename(clips.at(-1).file),
        skipped
      },
      null,
      2
    )
  );
  process.exitCode = skipped.length ? 1 : 0;
}
