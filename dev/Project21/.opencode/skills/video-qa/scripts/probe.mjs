#!/usr/bin/env node
/**
 * Probe rendered clips: duration, size, fps, loudness envelope and median pitch.
 *
 *   node probe.mjs clip.mp4
 *   node probe.mjs render/*.mp4 --json
 *
 * The point of the audio half: generated video synthesises the voice per clip, so a 49-clip
 * chapter can quietly contain several narrators. Loudness tells you whether anyone speaks at
 * all (and where); median F0 tells you whether it is plausibly the same person. Pitch alone
 * cannot prove identity — the same speaker moves with intonation — but a clip flagged at
 * max(18 Hz, 12 %) from the chapter median is worth listening to before it ships.
 *
 * Needs an ffmpeg binary: `npm install ffmpeg-static` in the project, or $FFMPEG, or
 * ffmpeg on PATH — see scripts/ffmpeg.mjs for the resolution order.
 */

import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { promisify } from "node:util";

import { FFMPEG_HINT, ffmpegPath } from "./ffmpeg.mjs";
import { expandFiles, parseArgs } from "./cli.mjs";

const run = promisify(execFile);

const SR = 16000;
const F0_MIN = 70;
const F0_MAX = 300;

/** ffmpeg prints the stream header to stderr and exits non-zero when there is no output. */
async function header(file) {
  const text = await run(ffmpegPath, ["-hide_banner", "-i", file], { maxBuffer: 1 << 24 })
    .then((r) => r.stderr)
    .catch((e) => {
      if (e.code === "ENOENT") throw e; // ffmpeg itself is missing, not the input
      return String(e.stderr ?? "");
    });
  const duration = /Duration:\s*(\d+):(\d+):(\d+\.\d+)/.exec(text);
  const size = /,\s*(\d{2,5})x(\d{2,5})[\s,]/.exec(text);
  const fps = /,\s*([\d.]+)\s*fps/.exec(text);
  const hasAudio = /Stream #\d+:\d+.*: Audio:/.test(text);
  return {
    duration: duration ? Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]) : null,
    width: size ? Number(size[1]) : null,
    height: size ? Number(size[2]) : null,
    fps: fps ? Number(fps[1]) : null,
    audio: hasAudio
  };
}

async function decodeMono(file) {
  const { stdout } = await run(
    ffmpegPath,
    ["-hide_banner", "-loglevel", "error", "-i", file, "-ac", "1", "-ar", String(SR), "-f", "s16le", "-"],
    { maxBuffer: 1 << 28, encoding: "buffer" }
  );
  const buf = Buffer.isBuffer(stdout) ? stdout : Buffer.from(stdout);
  const samples = new Float32Array(buf.length >> 1);
  for (let i = 0; i < samples.length; i++) samples[i] = buf.readInt16LE(i << 1) / 32768;
  return samples;
}

/** Loudness per 0.25 s window, then median F0 over the windows that are actually voiced. */
function measure(samples) {
  const envelope = [];
  const envWin = Math.round(0.25 * SR);
  for (let i = 0; i + envWin <= samples.length; i += envWin) {
    let sum = 0;
    for (let j = i; j < i + envWin; j++) sum += samples[j] * samples[j];
    envelope.push({ t: Number((i / SR).toFixed(2)), rms: Number(Math.sqrt(sum / envWin).toFixed(3)) });
  }

  const win = Math.round(0.04 * SR);
  const hop = Math.round(0.02 * SR);
  const minLag = Math.floor(SR / F0_MAX);
  const maxLag = Math.ceil(SR / F0_MIN);
  const f0s = [];
  for (let start = 0; start + win + maxLag < samples.length; start += hop) {
    let energy = 0;
    for (let i = 0; i < win; i++) energy += samples[start + i] ** 2;
    if (Math.sqrt(energy / win) < 0.02) continue; // silence or room tone

    let best = 0;
    let bestLag = 0;
    for (let lag = minLag; lag <= maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < win; i++) sum += samples[start + i] * samples[start + i + lag];
      if (sum > best) {
        best = sum;
        bestLag = lag;
      }
    }
    if (bestLag === 0 || best / energy < 0.3) continue; // too aperiodic to trust
    f0s.push(SR / bestLag);
  }

  f0s.sort((a, b) => a - b);
  const q = (p) => (f0s.length ? Number(f0s[Math.min(f0s.length - 1, Math.floor(p * f0s.length))].toFixed(1)) : null);
  const peak = envelope.reduce((a, e) => Math.max(a, e.rms), 0);
  const speaking = envelope.filter((e) => e.rms > Math.max(0.02, peak * 0.25));
  return {
    envelope,
    peakRms: Number(peak.toFixed(3)),
    speechStart: speaking.length ? speaking[0].t : null,
    speechEnd: speaking.length ? speaking[speaking.length - 1].t : null,
    voicedFrames: f0s.length,
    f0Median: q(0.5),
    f0Iqr: [q(0.25), q(0.75)]
  };
}

const args = parseArgs(process.argv.slice(2));
args.files = expandFiles(args.files);
if (args.files.length === 0) {
  console.error("usage: node probe.mjs <video...> [--json]");
  process.exit(2);
}

const rows = [];
for (const file of args.files) {
  if (!existsSync(file)) {
    /* Missing input is the most common mistake (wrong take number); say so instead of
       reporting a 0-second "silent" clip. */
    console.error(`MISSING ${file}`);
    process.exitCode = 1;
    continue;
  }
  try {
    const h = await header(file);
    const audio = h.audio ? measure(await decodeMono(file)) : null;
    rows.push({ file, name: basename(file), ...h, ...(audio ?? {}) });
  } catch (e) {
    if (e.code === "ENOENT") {
      console.error(FFMPEG_HINT);
      process.exit(1);
    }
    console.error(`FAIL ${file}: ${String(e.stderr ?? e.message).split("\n").slice(-2).join(" ")}`);
    process.exitCode = 1;
  }
}
if (rows.length === 0) process.exit(1);

if (args.json) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  for (const r of rows) {
    const speech = r.speechStart == null ? "silent" : `speech ${r.speechStart}-${r.speechEnd}s`;
    console.log(
      `${r.name.padEnd(40)} ${String(r.duration?.toFixed(2) ?? "?").padStart(6)}s  ` +
        `${r.width}x${r.height} ${r.fps ?? "?"}fps  ${speech.padEnd(18)} ` +
        `${r.f0Median ? `${r.f0Median}Hz` : "-"}`
    );
  }

  const pitched = rows.filter((r) => r.f0Median && r.voicedFrames > 30);
  if (pitched.length >= 3) {
    const meds = pitched.map((r) => r.f0Median).sort((a, b) => a - b);
    const median = meds[Math.floor(meds.length / 2)];
    const off = pitched.filter((r) => Math.abs(r.f0Median - median) > Math.max(18, median * 0.12));
    console.log(`\nmedian F0 ${median}Hz over ${pitched.length} clips`);
    if (off.length) {
      console.log("pitch outliers — listen before shipping:");
      for (const r of off) console.log(`  ${r.name}  ${r.f0Median}Hz`);
    } else {
      console.log("no pitch outliers");
    }
  }

  const silent = rows.filter((r) => r.speechStart == null);
  if (silent.length) console.log(`\nsilent clips: ${silent.map((r) => r.name).join(", ")}`);
}
