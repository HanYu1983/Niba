/**
 * Concatenate the clips listed in a download_report.json into one film.
 *
 *   node workspace/tools/concat_videos_from_report.mjs .\test_story5\output\video\download_report.json
 *   node workspace/tools/concat_videos_from_report.mjs --report .\test_story5\output\video\download_report.json --reencode
 *   node workspace/tools/concat_videos_from_report.mjs --report ... --from shot_1_1 --to shot_2_1 --out .\final.mp4
 *
 * Order comes from the report's shots[] array (the order the jobs were submitted).
 * Stream copy is the default; --reencode forces H.264/AAC when a join drifts.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, isAbsolute, resolve } from "node:path";

import { boolArg, parseArgs, usage } from "../lib/args.mjs";
import { concat, probe } from "../lib/media.mjs";

const VIDEO_RE = /\.(mp4|webm|mov|mkv)$/i;
const args = parseArgs();

const reportArg = args.report ?? args.json ?? args._[0];
if (!reportArg || reportArg === true) {
  usage("missing --report <download_report.json>", [
    "usage: node workspace/tools/concat_videos_from_report.mjs --report <download_report.json> [--out <file>] [--reencode]"
  ]);
}

const reportFile = resolve(String(reportArg));
let report;
try {
  report = JSON.parse(readFileSync(reportFile, "utf8"));
} catch (e) {
  usage(`cannot read ${reportFile}: ${e.message}`, ["--report must point to a readable download_report.json"]);
}
if (!Array.isArray(report?.shots)) {
  usage(`${reportFile} has no shots[] array`, ["expected the download_report.json written by download_videos_from_json.mjs"]);
}

const outputRoot = resolve(String(report.output ?? dirname(reportFile)));
const out = resolve(String(args.out ?? resolve(outputRoot, "merged.mp4")));
const reencode = boolArg(args, "reencode", false);
const dryRun = boolArg(args, "dry-run", false);

let shots = report.shots;
if (args.from && args.from !== true) {
  const idx = shots.findIndex((s) => s.id === String(args.from));
  if (idx < 0) usage(`--from ${args.from} is not in the report`, ["available: " + shots.map((s) => s.id).join(", ")]);
  shots = shots.slice(idx);
}
if (args.to && args.to !== true) {
  const idx = shots.findIndex((s) => s.id === String(args.to));
  if (idx < 0) usage(`--to ${args.to} is not in the report`, ["available: " + shots.map((s) => s.id).join(", ")]);
  shots = shots.slice(0, idx + 1);
}

/** Report paths are normally absolute; tolerate relative ones next to the report. */
function abs(file) {
  return isAbsolute(file) ? file : resolve(dirname(reportFile), file);
}

function videoOf(shot) {
  const files = (shot.files ?? [])
    .map((f) => (typeof f === "string" ? f : f?.path))
    .filter((f) => typeof f === "string" && f.trim() !== "")
    .map(abs)
    .filter((f) => VIDEO_RE.test(f));
  const file = files.find((f) => /\.mp4$/i.test(f)) ?? files[0] ?? null;
  if (!file) return { file: null, reason: "no video file in report" };
  if (!existsSync(file)) return { file, reason: "file missing on disk" };
  if (statSync(file).size <= 0) return { file, reason: "empty file" };
  return { file, reason: null };
}

const clips = [];
const skipped = [];
for (const shot of shots) {
  const { file, reason } = videoOf(shot);
  if (reason) skipped.push({ id: shot.id, reason, file: file ?? null });
  else clips.push({ id: shot.id, file });
}

console.log(
  JSON.stringify(
    {
      report: reportFile,
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
  console.error("no downloaded clips to concatenate");
  process.exitCode = 2;
} else if (dryRun) {
  for (const c of clips) console.log(`${c.id} -> ${c.file}`);
  process.exitCode = skipped.length ? 1 : 0;
} else {
  const first = probe(clips[0].file);
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
