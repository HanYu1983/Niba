/**
 * Concatenate the rendered clips of one plan into a single film, in plan order.
 *
 *   node workspace/tools/concat_renders.mjs --story test_story3
 *   node workspace/tools/concat_renders.mjs --story test_story3 --reencode
 *   node workspace/tools/concat_renders.mjs --story test_story3 --from seg_040 --to seg_079
 *
 * Order comes from the plan, never from directory sort. Stream copy is lossless and is the
 * default because every clip of a story is rendered at one resolution / fps / codec.
 * Falls back to a re-encode (H.264 CRF 18 + AAC 192k) when a join drifts.
 */
import { existsSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";

import { boolArg, parseArgs } from "../lib/args.mjs";
import { readManifest } from "../lib/manifest.mjs";
import { probe, concat } from "../lib/media.mjs";
import { loadPlan, segmentsOf } from "../lib/plan.mjs";
import { describeStory, loadStory } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan, prompts: args.prompts, manifest: args.manifest });
const plan = loadPlan(story.planFile);
const manifest = readManifest(story.manifestFile, story.planFile);

let segments = segmentsOf(plan);
if (args.from && args.from !== true) {
  const idx = segments.findIndex((s) => s.id === String(args.from));
  if (idx < 0) throw new Error(`--from ${args.from} is not in the plan`);
  segments = segments.slice(idx);
}
if (args.to && args.to !== true) {
  const idx = segments.findIndex((s) => s.id === String(args.to));
  if (idx < 0) throw new Error(`--to ${args.to} is not in the plan`);
  segments = segments.slice(0, idx + 1);
}

const clips = [];
for (const s of segments) {
  const rec = manifest.segments[s.id];
  if (!rec) throw new Error(`${s.id}: no manifest entry`);
  const file = (rec.files ?? [])[0];
  if (!file) throw new Error(`${s.id}: no file recorded`);
  if (!existsSync(file)) throw new Error(`${s.id}: file missing on disk -> ${file}`);
  clips.push({ id: s.id, file, duration: rec.duration_sec ?? s.estimated_sec ?? null, bytes: statSync(file).size });
}
if (!clips.length) throw new Error("nothing to concatenate");

const first = probe(clips[0].file);
const width = first.width ?? "x";
const height = first.height ?? "y";
const out = resolve(
  String(args.out ?? resolve(story.videoDir, `${story.planBase}_full_${width}x${height}.mp4`))
);
const list = resolve(story.videoDir, `${story.planBase}_concat.txt`);
const expected = clips.reduce((n, c) => n + (c.duration ?? 0), 0);

console.log(
  JSON.stringify(
    {
      ...describeStory(story),
      mode: boolArg(args, "reencode", false) ? "reencode" : "copy",
      clips: clips.length,
      resolution: `${width}x${height}`,
      total_mb: Number((clips.reduce((n, c) => n + c.bytes, 0) / 1048576).toFixed(1)),
      expected_duration_sec: Number(expected.toFixed(3)),
      list,
      output: out
    },
    null,
    2
  )
);

const info = concat({ files: clips.map((c) => c.file), out, listFile: list, reencode: boolArg(args, "reencode", false) });

console.log(
  JSON.stringify(
    {
      output: out,
      mb: Number((info.bytes / 1048576).toFixed(2)),
      duration_sec: info.duration_sec,
      resolution: `${info.width}x${info.height}`,
      fps: info.fps,
      first_clip: basename(clips[0].file),
      last_clip: basename(clips.at(-1).file)
    },
    null,
    2
  )
);
