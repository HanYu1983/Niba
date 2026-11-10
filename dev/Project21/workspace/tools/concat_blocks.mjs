/**
 * Concatenate a block-rendered film in block order.
 *
 * A block plan (render_block_frames.mjs / render_block.mjs) writes `render_manifest.json`
 * with a `blocks[]` array, not the `segments{}` map that concat_renders.mjs reads. This tool
 * takes that manifest, orders the clips by `index`, checks they share one resolution / fps /
 * stream layout, and joins them with the ffmpeg concat demuxer.
 *
 *   node workspace/tools/concat_blocks.mjs --story test_stroy2
 *   node workspace/tools/concat_blocks.mjs --story test_stroy2 --reencode
 *   node workspace/tools/concat_blocks.mjs --story test_stroy2 --from block_010 --to block_020
 *   node workspace/tools/concat_blocks.mjs --story test_stroy2 --out output/video/full.mp4
 *
 * Stream copy is the default (lossless, seconds instead of minutes). Use --reencode when the
 * join drifts or when clips were produced by different workflows.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import { boolArg, listArg, parseArgs, usage } from "../lib/args.mjs";
import { concat, probe } from "../lib/media.mjs";

const args = parseArgs();

if (args.help || args.h) {
  usage("usage: node workspace/tools/concat_blocks.mjs --story <dir> [options]", [
    "  --story <dir>        story folder holding render_manifest.json",
    "  --manifest <file>    explicit manifest (default <story>/render_manifest.json)",
    "  --out <file>         output mp4 (default ../output/video/<story>/<project>_full_<w>x<h>.mp4)",
    "  --name <stem>        output stem when --out is not given (default: manifest project)",
    "  --from <block_id>    start at this block (inclusive)",
    "  --to <block_id>      stop at this block (inclusive)",
    "  --reencode           H.264 CRF 18 + AAC 192k instead of stream copy",
    "  --dry-run            print the plan and probe the clips, write nothing"
  ]);
}

const storyArg = args.story && args.story !== true ? String(args.story) : args._[0];
if (!storyArg) usage("missing --story <dir>", ["  e.g. --story test_stroy2"]);
const storyDir = resolve(storyArg);

const manifestFile = resolve(
  args.manifest && args.manifest !== true ? String(args.manifest) : join(storyDir, "render_manifest.json")
);
if (!existsSync(manifestFile)) throw new Error(`manifest not found: ${manifestFile}`);

const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
const allBlocks = Array.isArray(manifest.blocks) ? manifest.blocks : [];
if (!allBlocks.length) throw new Error(`${manifestFile} has no blocks[]`);

// Stable order by index; ties keep manifest order.
let blocks = [...allBlocks].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

const fromId = args.from && args.from !== true ? String(args.from) : null;
const toId = args.to && args.to !== true ? String(args.to) : null;
if (fromId) {
  const i = blocks.findIndex((b) => b.block_id === fromId);
  if (i < 0) throw new Error(`--from ${fromId} is not in the manifest`);
  blocks = blocks.slice(i);
}
if (toId) {
  const i = blocks.findIndex((b) => b.block_id === toId);
  if (i < 0) throw new Error(`--to ${toId} is not in the manifest`);
  blocks = blocks.slice(0, i + 1);
}
if (!blocks.length) throw new Error("nothing to concatenate");

const clips = [];
for (const b of blocks) {
  if (!b.file) throw new Error(`${b.block_id}: no file recorded in the manifest`);
  if (!existsSync(b.file)) throw new Error(`${b.block_id}: file missing on disk -> ${b.file}`);
  clips.push({
    id: b.block_id ?? `block_${String(b.index).padStart(3, "0")}`,
    file: b.file,
    seconds: b.seconds ?? null,
    bytes: statSync(b.file).size
  });
}

// One codec / resolution / fps for a clean stream copy.
const first = probe(clips[0].file);
for (const c of clips) {
  const p = probe(c.file);
  c.probe = p;
  if (p.width !== first.width || p.height !== first.height) {
    throw new Error(
      `${c.id}: ${p.width}x${p.height} does not match ${first.width}x${first.height}; ` +
        `re-render or pass --reencode after normalising`
    );
  }
  if (p.fps !== first.fps) throw new Error(`${c.id}: ${p.fps} fps does not match ${first.fps} fps`);
  if (p.hasAudio !== first.hasAudio) throw new Error(`${c.id}: audio stream presence differs`);
}

const width = first.width;
const height = first.height;
const stem = args.name && args.name !== true ? String(args.name) : String(manifest.project ?? basename(storyDir));
const out = args.out && args.out !== true
  ? resolve(String(args.out))
  : resolve(storyDir, "..", "output", "video", basename(storyDir), `${stem}_full_${width}x${height}.mp4`);
const list = join(dirname(out), `${stem}_concat.txt`);

const totalMb = clips.reduce((n, c) => n + c.bytes, 0) / 1048576;
const expected = clips.reduce((n, c) => n + (c.probe.duration_sec ?? 0), 0);

console.log(
  JSON.stringify(
    {
      story: basename(storyDir),
      project: manifest.project ?? null,
      manifest: manifestFile,
      mode: boolArg(args, "reencode", false) ? "reencode" : "copy",
      blocks: clips.length,
      first: clips[0].id,
      last: clips.at(-1).id,
      resolution: `${width}x${height}`,
      fps: first.fps,
      audio: first.hasAudio,
      total_mb: Number(totalMb.toFixed(1)),
      expected_duration_sec: Number(expected.toFixed(2)),
      list,
      output: out
    },
    null,
    2
  )
);

if (boolArg(args, "dry-run", false)) process.exit(0);

const info = concat({
  files: clips.map((c) => c.file),
  out,
  listFile: list,
  reencode: boolArg(args, "reencode", false)
});

console.log(
  JSON.stringify(
    {
      output: out,
      mb: Number((info.bytes / 1048576).toFixed(2)),
      duration_sec: info.duration_sec,
      resolution: `${info.width}x${info.height}`,
      fps: info.fps,
      drifts_sec: Number((info.duration_sec - expected).toFixed(2))
    },
    null,
    2
  )
);
