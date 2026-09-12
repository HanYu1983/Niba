import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const FFMPEG = require("ffmpeg-static");

function parseOutputDuration(stdout) {
  const ms = stdout.match(/out_time_ms=(\d+)/g);
  if (!ms || !ms.length) return null;
  return (+ms[ms.length - 1].split("=")[1]) / 1e6;
}

function summarize(files, total) {
  return {
    merged: files.length,
    total_seconds: total,
    total_hhmmss: new Date(total * 1000).toISOString().substr(11, 8)
  };
}

async function probeAudio(ffmpeg, file) {
  try {
    const { stderr } = await execFileAsync(ffmpeg, ["-i", file]);
    return stderr.includes("Audio:");
  } catch (e) {
    return /Audio:/.test(e.stderr || "");
  }
}

export async function mergeVideos({ files, out, resolution = "352:608" }) {
  if (!files || files.length < 2) {
    throw new Error("merge_videos requires at least 2 files");
  }

  mkdirSync(out, { recursive: true });

  const [w, h] = resolution.split(":").map(Number);
  if (!w || !h) throw new Error(`bad resolution: ${resolution}`);

  for (const f of files) {
    const { access } = await import("node:fs/promises");
    await access(f);
  }

  const withAudio = [];
  for (const f of files) {
    withAudio.push(await probeAudio(FFMPEG, f));
  }
  const useAudio = withAudio.every(Boolean);

  // build ffmpeg args
  const args = [];
  files.forEach((f) => { args.push("-i", f); });

  const n = files.length;
  const parts = [];
  for (let i = 0; i < n; i++) {
    parts.push(
      `[${i}:v]scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24[v${i}]`
    );
    if (useAudio) {
      parts.push(
        `[${i}:a]aresample=async=1:first_pts=0,asetpts=PTS-STARTPTS[a${i}]`
      );
    }
  }
  const concatInputs = useAudio
    ? Array.from({ length: n }, (_, i) => `[v${i}][a${i}]`).join("")
    : Array.from({ length: n }, (_, i) => `[v${i}]`).join("");
  parts.push(
    `${concatInputs}concat=n=${n}:v=1${useAudio ? ":a=1" : ""}[vout]${useAudio ? "[aout]" : ""}`
  );

  const filterArg = parts.join(";");
  args.push("-filter_complex", filterArg);
  args.push("-map", "[vout]");
  if (useAudio) args.push("-map", "[aout]");
  args.push(
    "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p"
  );
  if (useAudio) args.push("-c:a", "aac", "-b:a", "192k");
  args.push("-movflags", "+faststart");

  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const dest = join(out, `merged_${stamp}.mp4`);
  args.push("-progress", "pipe:1", "-nostats", "-y", dest);

  const { stdout } = await execFileAsync(FFMPEG, args, { maxBuffer: 64 * 1024 * 1024 });
  const total = parseOutputDuration(stdout);

  return {
    file: dest,
    ...(total ? summarize(files, total) : { merged_files: files.length })
  };
}