#!/usr/bin/env node
/**
 * Contact sheet: N evenly spaced frames from each video, tiled into one PNG.
 *
 *   node sheet.mjs clip.mp4
 *   node sheet.mjs render/*.mp4 --out qa
 *   node sheet.mjs clip.mp4 --frames 8 --tile 4x2 --width 380
 *   node sheet.mjs clip.mp4 --step 1.5          # fixed sampling interval instead of even spread
 *
 * Why a sheet: one still cannot show that a 5-second insert dissolves into a wide shot. Six
 * frames in one image can, and 49 sheets cost a fraction of what 294 separate frames cost.
 *
 * Needs an ffmpeg binary: `npm install ffmpeg-static` in the project, or $FFMPEG, or
 * ffmpeg on PATH — see scripts/ffmpeg.mjs for the resolution order.
 */

import { execFile } from "node:child_process";
import { mkdirSync } from "node:fs";
import { basename, extname, resolve } from "node:path";
import { promisify } from "node:util";

import { FFMPEG_HINT, ffmpegPath } from "./ffmpeg.mjs";
import { expandFiles, parseArgs } from "./cli.mjs";

const run = promisify(execFile);

/** ffmpeg exits non-zero when given only `-i`, but the header is what we want. */
export async function probeDuration(file) {
  const parse = (text) => {
    const m = /Duration:\s*(\d+):(\d+):(\d+\.\d+)/.exec(text);
    return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : null;
  };
  try {
    const { stderr } = await run(ffmpegPath, ["-hide_banner", "-i", file], { maxBuffer: 1 << 24 });
    return parse(stderr);
  } catch (e) {
    return parse(String(e.stderr ?? ""));
  }
}

const args = parseArgs(process.argv.slice(2));
args.files = expandFiles(args.files);
if (args.files.length === 0) {
  console.error("usage: node sheet.mjs <video...> [--out DIR] [--frames 6] [--tile 3x2] [--width 304] [--step SEC]");
  process.exit(2);
}

const frames = Number(args.frames ?? 6);
const [cols, rows] = String(args.tile ?? (frames > 6 ? "4x2" : "3x2")).split("x").map(Number);
const width = Number(args.width ?? 304);
const step = args.step ? Number(args.step) : null;
const outDir = resolve(typeof args.out === "string" ? args.out : ".");
mkdirSync(outDir, { recursive: true });

for (const file of args.files) {
  const duration = (await probeDuration(file)) ?? 5;
  /* Sample inside the clip, not on its first/last frame: the first frame is often a fade and
     the last is often a held duplicate. */
  const gap = step ?? Math.max(0.4, (duration - 0.2) / frames);
  const out = resolve(outDir, `${basename(file, extname(file))}.png`);
  try {
    await run(ffmpegPath, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", file,
      "-vf", `fps=1/${gap},scale=${width}:-2,tile=${cols}x${rows}:padding=2:margin=2`,
      "-frames:v", "1",
      out
    ]);
    console.log(`${basename(out)}  ${duration.toFixed(2)}s  every ${gap.toFixed(2)}s`);
  } catch (e) {
    const msg = e.code === "ENOENT" ? FFMPEG_HINT : String(e.stderr ?? e.message).split("\n").slice(-2).join(" ");
    console.error(`FAIL ${file}: ${msg}`);
    if (e.code === "ENOENT") process.exit(1);
    process.exitCode = 1;
  }
}
