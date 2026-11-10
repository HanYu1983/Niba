/**
 * Concatenate a block-rendered film, either from a block manifest or from a ready ffconcat list.
 *
 * Two sources:
 *
 *   --manifest <file>  render_manifest.json with `blocks[]` (render_block_frames.mjs output).
 *                      Clips are ordered by `index`, never by directory sort.
 *   --list <file>      an ffmpeg concat list (`file '...'` lines), e.g. build/concat_portrait.txt
 *                      built by a newer-take picker. Order is taken exactly as written.
 *
 * Both paths probe every clip first and refuse to join clips that differ in resolution, fps or
 * audio presence. Stream copy is the default; --reencode is the fallback when a join drifts.
 *
 *   node workspace/tools/concat_blocks.mjs --story test_stroy2
 *   node workspace/tools/concat_blocks.mjs --story test_stroy2 --list test_stroy2/build/concat_portrait.txt
 *   node workspace/tools/concat_blocks.mjs --story test_stroy2 --list ... --reencode
 *   node workspace/tools/concat_blocks.mjs --story test_stroy2 --from block_010 --to block_020
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import { boolArg, parseArgs, usage } from "../lib/args.mjs";
import { concat, probe } from "../lib/media.mjs";

const args = parseArgs();

if (args.help || args.h) {
  usage("usage: node workspace/tools/concat_blocks.mjs --story <dir> [options]", [
    "  --story <dir>        story folder (used for the default output path)",
    "  --manifest <file>    render_manifest.json with blocks[] (default <story>/render_manifest.json)",
    "  --list <file>        existing ffconcat list; overrides --manifest",
    "  --out <file>         output mp4 (default ../output/video/<story>/<stem>_full_<w>x<h>.mp4)",
    "  --name <stem>        output stem when --out is not given (default: manifest project)",
    "  --from <block_id>    start at this block (manifest mode only, inclusive)",
    "  --to <block_id>      stop at this block (manifest mode only, inclusive)",
    "  --reencode           H.264 CRF 18 + AAC 192k instead of stream copy",
    "  --dry-run            print the plan and probe the clips, write nothing"
  ]);
}

const strArg = (name) => (args[name] && args[name] !== true ? String(args[name]) : null);

const listArg = strArg("list");
const manifestArg = strArg("manifest");

const storyArg = strArg("story") ?? args._[0] ?? (listArg ? dirname(dirname(resolve(listArg))) : null);
if (!storyArg) usage("missing --story <dir>", ["  e.g. --story test_stroy2"]);
const storyDir = resolve(storyArg);

/** ffconcat line -> path. Handles the `'\''` escaping ffmpeg itself uses. */
function parseConcatList(file) {
  const out = [];
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*file\s+'(.*)'\s*$/);
    if (!m) continue;
    out.push(m[1].replace(/'\\''/g, "'"));
  }
  return out;
}

let clips = [];
let projectName = basename(storyDir);
if (listArg) {
  const listFile = resolve(listArg);
  if (!existsSync(listFile)) throw new Error(`list not found: ${listFile}`);
  const files = parseConcatList(listFile);
  if (!files.length) throw new Error(`${listFile} has no "file '...'" lines`);
  clips = files.map((file) => ({
    id: basename(file).replace(/\.mp4$/i, ""),
    file: resolve(file)
  }));
} else {
  const manifestFile = manifestArg ? resolve(manifestArg) : join(storyDir, "render_manifest.json");
  if (!existsSync(manifestFile)) throw new Error(`manifest not found: ${manifestFile}`);
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
  projectName = String(manifest.project ?? basename(storyDir));
  const allBlocks = Array.isArray(manifest.blocks) ? manifest.blocks : [];
  if (!allBlocks.length) throw new Error(`${manifestFile} has no blocks[]`);

  // Stable order by index; ties keep manifest order.
  let blocks = [...allBlocks].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  const fromId = strArg("from");
  const toId = strArg("to");
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

  clips = blocks.map((b) => {
    if (!b.file) throw new Error(`${b.block_id}: no file recorded in the manifest`);
    return { id: b.block_id ?? `block_${String(b.index).padStart(3, "0")}`, file: resolve(b.file) };
  });
}

if (!clips.length) throw new Error("nothing to concatenate");

const missing = clips.filter((c) => !existsSync(c.file));
if (missing.length) {
  throw new Error(
    `missing ${missing.length}/${clips.length} clip(s):\n` + missing.map((c) => `  ${c.id} -> ${c.file}`).join("\n")
  );
}

// One codec / resolution / fps / audio layout for a clean stream copy.
const first = probe(clips[0].file);
let expected = 0;
for (const c of clips) {
  const p = probe(c.file);
  c.probe = p;
  c.bytes = statSync(c.file).size;
  expected += p.duration_sec ?? 0;
  if (p.width !== first.width || p.height !== first.height) {
    throw new Error(
      `${c.id}: ${p.width}x${p.height} does not match ${first.width}x${first.height}; ` +
        `re-render or normalise before joining`
    );
  }
  if (p.fps !== first.fps) throw new Error(`${c.id}: ${p.fps} fps does not match ${first.fps} fps`);
  if (p.hasAudio !== first.hasAudio) throw new Error(`${c.id}: audio stream presence differs`);
}

const width = first.width;
const height = first.height;
const stem = strArg("name") ?? projectName;

const out = strArg("out")
  ? resolve(strArg("out"))
  : resolve(storyDir, "..", "output", "video", basename(storyDir), `${stem}_full_${width}x${height}.mp4`);
const listOut = join(dirname(out), `${stem}_concat.txt`);

const totalMb = clips.reduce((n, c) => n + c.bytes, 0) / 1048576;

console.log(
  JSON.stringify(
    {
      story: basename(storyDir),
      source: listArg ? `list: ${resolve(listArg)}` : `manifest: ${manifestArg ? resolve(manifestArg) : join(storyDir, "render_manifest.json")}`,
      mode: boolArg(args, "reencode", false) ? "reencode" : "copy",
      clips: clips.length,
      first: clips[0].id,
      last: clips.at(-1).id,
      resolution: `${width}x${height}`,
      fps: first.fps,
      audio: first.hasAudio,
      total_mb: Number(totalMb.toFixed(1)),
      expected_duration_sec: Number(expected.toFixed(2)),
      list: listOut,
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
  listFile: listOut,
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
