/**
 * Contact sheets for reviewing blocks: six frames from each clip, tiled into one PNG.
 *
 *   node qa_sheet.mjs                        # every rendered block
 *   node qa_sheet.mjs --only block_01,block_02
 *   node qa_sheet.mjs --step 1.5             # denser sampling
 *
 * One image per block is the point: reading 49 separate frames costs more than reading 49
 * six-frame contact sheets, and a single still hides the thing that actually goes wrong —
 * framing that drifts, a face that changes between seconds. Sheets land in
 * `output/render/ch04/qa/` and are never committed (the whole `output/` tree is ignored).
 */

import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { promisify } from "node:util";

import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);

const HERE = "D:\\han\\Niba\\dev\\Project21";
const MANIFEST = resolve(HERE, "test_story1/ch04_render_manifest.json");
const OUT_DIR = resolve(HERE, "output/render/ch04/qa");

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

const args = parseArgs(process.argv.slice(2));
const step = Number(args.step ?? 0);
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));

let blocks = Object.values(manifest.blocks ?? {}).filter((b) => b.file && existsSync(b.file));
if (typeof args.only === "string") {
  const wanted = args.only.split(",").map((s) => s.trim()).filter(Boolean);
  blocks = blocks.filter((b) => wanted.some((w) => b.block_id === w || b.block_id.startsWith(w)));
}

mkdirSync(OUT_DIR, { recursive: true });

for (const block of blocks) {
  const out = resolve(OUT_DIR, `${block.block_id}.png`);
  /* Six samples spread over the clip: fps=1/step then tile 3x2. */
  const duration = block.duration_sec ?? 6;
  const gap = step > 0 ? step : Math.max(0.5, duration / 6);
  const cols = 3;
  const rows = Math.ceil(6 / cols);
  try {
    await run(ffmpegPath, [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", block.file,
      "-vf", `fps=1/${gap},scale=304:176,tile=${cols}x${rows}:padding=2:margin=2`,
      "-frames:v", "1",
      out
    ]);
    console.log(`ok  ${block.block_id}  ${basename(out)}`);
  } catch (e) {
    console.log(`FAIL  ${block.block_id}  ${String(e.stderr ?? e.message).split("\n").slice(-2).join(" ")}`);
  }
}
