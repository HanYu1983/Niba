/**
 * ffmpeg helpers: probe, loudness envelope, speech-region detection, concat.
 *
 * There is no ffprobe on this machine, so `probe()` reads the demuxer report from
 * `ffmpeg -i`, exactly like the concat tool did before the refactor.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { ffmpegPath } from "./comfy.mjs";

export function ffmpeg(args, { encoding = "utf8" } = {}) {
  return spawnSync(ffmpegPath(), args, { encoding, maxBuffer: 64 * 1024 * 1024 });
}

export function probe(file) {
  const r = ffmpeg(["-hide_banner", "-i", file]);
  const lines = (r.stderr || "").split(/\r?\n/);
  const durationLine = lines.find((l) => l.includes("Duration:"));
  const d = durationLine?.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
  const v = lines.find((l) => l.includes("Video:"));
  const a = lines.find((l) => l.includes("Audio:"));
  const size = v?.match(/(\d{2,5})x(\d{2,5})/);
  const fps = v?.match(/(\d+(?:\.\d+)?)\s*fps/);
  return {
    file,
    bytes: statSync(file).size,
    duration_sec: d ? Number(d[1]) * 3600 + Number(d[2]) * 60 + Number(d[3]) : null,
    width: size ? Number(size[1]) : null,
    height: size ? Number(size[2]) : null,
    fps: fps ? Number(fps[1]) : null,
    video: v?.trim() ?? null,
    audio: a?.trim() ?? null,
    hasAudio: Boolean(a)
  };
}

/** Per-frame RMS in dBFS, 32 ms windows at the source sample rate. */
export function rmsProfile(file) {
  const r = ffmpeg([
    "-hide_banner", "-nostats", "-i", file,
    "-af", "astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-",
    "-f", "null", "-"
  ]);
  const frames = [];
  let t = null;
  for (const line of (r.stdout || "").split(/\r?\n/)) {
    const m = line.match(/pts_time:([0-9.]+)/);
    if (m) {
      t = Number(m[1]);
      continue;
    }
    const v = line.match(/RMS_level=(-?[0-9.]+(?:e-?[0-9]+)?)/);
    if (v && t !== null) {
      frames.push({ t, db: Number(v[1]) });
      t = null;
    }
  }
  return frames;
}

/**
 * Speech onsets from the loudness envelope. A region has to clear `regionDb` and last
 * `minDur`; a pause shorter than `hangover` does not split it (mid-sentence breaths).
 */
export function speechRegions(frames, { regionDb = -38, minDur = 0.35, hangover = 0.18, step = 0.05 } = {}) {
  if (!frames.length) return [];
  const end = frames[frames.length - 1].t + step;
  const buckets = [];
  for (let t = 0; t < end; t += step) {
    let peak = -99;
    for (const f of frames) if (f.t >= t && f.t < t + step && f.db > peak) peak = f.db;
    buckets.push(peak);
  }

  const regions = [];
  let cur = null;
  for (let i = 0; i < buckets.length; i++) {
    const t = i * step;
    if (buckets[i] > regionDb) {
      if (!cur) cur = { start: t, end: t + step };
      else cur.end = t + step;
    } else if (cur && t - cur.end > hangover) {
      if (cur.end - cur.start >= minDur) regions.push(cur);
      cur = null;
    }
  }
  if (cur && cur.end - cur.start >= minDur) regions.push(cur);
  return regions;
}

export function loudRatio(frames, from, to, silentDb = -45) {
  const win = frames.filter((f) => f.t >= from && f.t < to);
  if (!win.length) return 0;
  return win.filter((f) => f.db > silentDb).length / win.length;
}

/** ffmpeg concat demuxer list: forward slashes, single-quoted, quotes escaped. */
function concatLine(file) {
  return `file '${file.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`;
}

export function concat({ files, out, listFile, reencode = false }) {
  for (const f of files) statSync(f); // fail loudly on a missing clip
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(listFile, files.map(concatLine).join("\n") + "\n", "utf8");

  const args = ["-hide_banner", "-nostdin", "-y", "-f", "concat", "-safe", "0", "-i", listFile];
  if (reencode) {
    args.push(
      "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
      "-r", "24", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"
    );
  } else {
    args.push("-c", "copy");
  }
  args.push("-movflags", "+faststart", out);

  const run = ffmpeg(args);
  if (run.status !== 0) {
    const tail = (run.stderr || "").trim().split(/\r?\n/).slice(-8).join("\n");
    throw new Error(`ffmpeg concat failed (${run.status})\n${tail}`);
  }
  return probe(out);
}
