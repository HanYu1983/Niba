/**
 * Concatenate the 79 rendered clips of plan.ch0 into one film, in segment order.
 *
 *   node test_story3/concat_renders.mjs            # stream copy (fast, lossless)
 *   node test_story3/concat_renders.mjs --reencode # H.264 CRF 18 + AAC 192k
 *
 * The list is built from render_manifest.json, so segment order comes from the plan,
 * not from directory sort. Falls back to nothing: it fails loudly if a file is missing.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const FFMPEG = resolve("gen_video/node_modules/ffmpeg-static/ffmpeg.exe");
const MANIFEST = resolve("test_story3/render_manifest.json");
const OUT_DIR = resolve("output/video");
const OUT = resolve(OUT_DIR, "plan.ch0_full_352x608.mp4");
const LIST = resolve(OUT_DIR, "plan.ch0_concat.txt");
const REENCODE = process.argv.includes("--reencode");

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));

const clips = [];
for (let i = 1; i <= 79; i++) {
  const id = `seg_${String(i).padStart(3, "0")}`;
  const rec = manifest.segments[id];
  if (!rec) throw new Error(`${id}: no manifest entry`);
  const file = (rec.files ?? [])[0];
  if (!file) throw new Error(`${id}: no file recorded`);
  if (!existsSync(file)) throw new Error(`${id}: file missing on disk -> ${file}`);
  clips.push({ id, file, duration: rec.duration_sec ?? null, bytes: statSync(file).size });
}

mkdirSync(OUT_DIR, { recursive: true });

// ffmpeg concat demuxer: forward slashes, single-quoted, single quotes escaped.
const lines = clips.map(
  (c) => `file '${c.file.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`
);
writeFileSync(LIST, lines.join("\n") + "\n", "utf8");

const expected = clips.reduce((n, c) => n + (c.duration ?? 0), 0);

const args = ["-hide_banner", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", LIST];
if (REENCODE) {
  args.push(
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
    "-r", "24", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"
  );
} else {
  args.push("-c", "copy");
}
args.push("-movflags", "+faststart", OUT);

console.log(JSON.stringify({
  mode: REENCODE ? "reencode" : "copy",
  clips: clips.length,
  total_bytes: clips.reduce((n, c) => n + c.bytes, 0),
  expected_duration_sec: +expected.toFixed(3),
  list: LIST,
  output: OUT
}, null, 2));

const run = spawnSync(FFMPEG, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const tail = (run.stderr || "").trim().split(/\r?\n/).slice(-6).join("\n");
if (run.status !== 0) {
  console.error(tail);
  process.exit(run.status ?? 1);
}

// Confirm the real duration and geometry with ffmpeg's own demuxer report.
const probe = spawnSync(FFMPEG, ["-hide_banner", "-i", OUT], { encoding: "utf8" });
const info = (probe.stderr || "").split(/\r?\n/);
const duration = info.find((l) => l.includes("Duration:"));
const video = info.find((l) => l.includes("Video:"));
const audio = info.find((l) => l.includes("Audio:"));

console.log(JSON.stringify({
  output: OUT,
  bytes: statSync(OUT).size,
  mb: +(statSync(OUT).size / 1048576).toFixed(2),
  duration_line: duration?.trim() ?? null,
  video: video?.trim() ?? null,
  audio: audio?.trim() ?? null,
  first_clip: basename(clips[0].file),
  last_clip: basename(clips[clips.length - 1].file)
}, null, 2));
