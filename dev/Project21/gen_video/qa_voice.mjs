/**
 * Is the narrator the same person in every clip?
 *
 * MiniMax generates the voice together with the picture, so each block is an independent
 * synthesis. If the sampled narrator drifts between clips, the chapter sounds like a
 * radio drama with a rotating cast — and no single still frame can tell you that.
 *
 * This measures the one thing that carries identity across a 49-clip chapter: pitch. It
 * decodes the audio to mono 16 kHz and takes an autocorrelation F0 over the voiced frames,
 * then reports the median and the spread. Blocks that sit far from the chapter median are
 * the ones to re-take.
 *
 *   node qa_voice.mjs                  # every rendered block, plus a summary
 *   node qa_voice.mjs --only block_002
 */

import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";

import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);

const HERE = "D:\\han\\Niba\\dev\\Project21";
const MANIFEST = resolve(HERE, "test_story1/ch04_render_manifest.json");
const SR = 16000;
const F0_MIN = 70;
const F0_MAX = 300;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
      continue;
    }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
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

/** Median F0 over windows the speaker is actually voicing (loud enough, periodic enough). */
function measure(samples) {
  const win = Math.round(0.04 * SR);
  const hop = Math.round(0.02 * SR);
  const minLag = Math.floor(SR / F0_MAX);
  const maxLag = Math.ceil(SR / F0_MIN);
  const f0s = [];
  let rmsSum = 0;
  let frames = 0;

  for (let start = 0; start + win + maxLag < samples.length; start += hop) {
    let rms = 0;
    for (let i = 0; i < win; i++) rms += samples[start + i] ** 2;
    rms = Math.sqrt(rms / win);
    rmsSum += rms;
    frames++;
    if (rms < 0.02) continue; // silence or room tone

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
    if (bestLag === 0) continue;
    /* Normalise by the frame's own energy so a quiet frame is not rejected on amplitude alone. */
    let energy = 0;
    for (let i = 0; i < win; i++) energy += samples[start + i] ** 2;
    if (best / energy < 0.3) continue; // too aperiodic to trust
    f0s.push(SR / bestLag);
  }

  f0s.sort((a, b) => a - b);
  const pick = (q) => (f0s.length ? f0s[Math.min(f0s.length - 1, Math.floor(q * f0s.length))] : null);
  return {
    median: pick(0.5),
    p25: pick(0.25),
    p75: pick(0.75),
    voiced: f0s.length,
    rms: frames ? rmsSum / frames : 0
  };
}

const args = parseArgs(process.argv.slice(2));
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
let blocks = Object.values(manifest.blocks ?? {}).filter((b) => b.file && existsSync(b.file));
if (typeof args.only === "string") {
  const wanted = args.only.split(",").map((s) => s.trim()).filter(Boolean);
  blocks = blocks.filter((b) => wanted.some((w) => b.block_id === w || b.block_id.startsWith(w)));
}

const rows = [];
for (const block of blocks) {
  const samples = await decodeMono(block.file);
  const m = measure(samples);
  rows.push({ id: block.block_id, mode: block.audio_mode, ...m });
  console.log(
    `${block.block_id.padEnd(30)} ${String(m.median?.toFixed(1) ?? "-").padStart(6)}Hz  ` +
      `iqr ${m.p25?.toFixed(0) ?? "-"}-${m.p75?.toFixed(0) ?? "-"}  voiced ${m.voiced}  rms ${m.rms.toFixed(3)}`
  );
}

const voicedRows = rows.filter((r) => r.median && r.voiced > 30);
if (voicedRows.length >= 3) {
  const meds = voicedRows.map((r) => r.median).sort((a, b) => a - b);
  const median = meds[Math.floor(meds.length / 2)];
  const off = voicedRows.filter((r) => Math.abs(r.median - median) > Math.max(18, median * 0.12));
  console.log(`\nchapter median F0 ${median.toFixed(1)}Hz over ${voicedRows.length} blocks`);
  if (off.length) {
    console.log("pitch outliers (check that the narrator is the same person):");
    for (const r of off) console.log(`  ${r.id}  ${r.median.toFixed(1)}Hz`);
  } else {
    console.log("no pitch outliers");
  }
}
