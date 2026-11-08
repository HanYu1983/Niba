/**
 * Submit every plan segment that is not already in the manifest.
 *
 *   node workspace/tools/render_all.mjs --story test_story3
 *   node workspace/tools/render_all.mjs --story test_story3 --from seg_040 --to seg_079
 *   node workspace/tools/render_all.mjs --story test_story3 --only seg_009,seg_051 --force
 *   node workspace/tools/render_all.mjs --story test_story3 --async --no-turbo --seed 100
 *
 * Sequential on purpose: the box has a single GPU and the queue is easier to read when
 * submissions come in plan order. `--async` returns as soon as ComfyUI accepts each job;
 * collect them later with audit_renders.mjs + download_renders.mjs.
 */
import { existsSync } from "node:fs";

import { boolArg, listArg, numArg, parseArgs, usage } from "../lib/args.mjs";
import { readManifest } from "../lib/manifest.mjs";
import { loadPlan, segmentsOf } from "../lib/plan.mjs";
import { keeperFile } from "../lib/manifest.mjs";
import { renderSegment } from "../lib/render.mjs";
import { describeStory, loadStory } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan });
const plan = loadPlan(story.planFile);
const manifest = readManifest(story.manifestFile, story.planFile);

const only = listArg(args, "only");
const from = args.from && args.from !== true ? String(args.from) : null;
const to = args.to && args.to !== true ? String(args.to) : null;
const limit = numArg(args, "limit", Infinity);
const force = Boolean(args.force);
const submitOnly = boolArg(args, "async", false) || boolArg(args, "submit-only", false) || !boolArg(args, "wait", true);

let queue = segmentsOf(plan);
if (only.length) queue = queue.filter((s) => only.includes(s.id));
if (from) {
  const idx = queue.findIndex((s) => s.id === from);
  if (idx < 0) usage(`--from ${from} is not in the plan`, []);
  queue = queue.slice(idx);
}
if (to) {
  const idx = queue.findIndex((s) => s.id === to);
  if (idx < 0) usage(`--to ${to} is not in the plan`, []);
  queue = queue.slice(0, idx + 1);
}

const pending = [];
const skipped = [];
for (const s of queue) {
  const rec = manifest.segments[s.id];
  if (force || !rec) {
    pending.push(s);
    continue;
  }
  const keeper = keeperFile(rec);
  const ready = rec.status === "success" && keeper && existsSync(keeper);
  const inflight = rec.status === "queued" || rec.status === "running";
  if (ready || inflight) skipped.push({ id: s.id, status: rec.status, file: keeper });
  else pending.push(s);
}

const batch = pending.slice(0, Number.isFinite(limit) ? limit : pending.length);

console.log(
  JSON.stringify(
    {
      ...describeStory(story),
      planned: queue.length,
      skipped: skipped.length,
      submitting: batch.length,
      mode: args.mode ?? "auto",
      async: submitOnly,
      seed: args.seed ?? "time-based",
      turbo: boolArg(args, "turbo", story.render.turbo)
    },
    null,
    2
  )
);

if (!batch.length) process.exit(0);
if (args["dry-run"]) {
  // Touch nothing, but show what each job would resolve to.
  for (const s of batch) {
    const { descriptor } = await renderSegment(story, plan, s, {
      mode: args.mode,
      dryRun: true,
      turbo: boolArg(args, "turbo", story.render.turbo),
      width: args.width !== undefined ? numArg(args, "width", null) : undefined,
      height: args.height !== undefined ? numArg(args, "height", null) : undefined
    });
    console.log(`${s.id} ${descriptor.mode} ${descriptor.duration_sec}s ${descriptor.width}x${descriptor.height} ${descriptor.warnings.join("; ")}`);
  }
  process.exit(0);
}

const started = Date.now();
const failures = [];

for (const [i, seg] of batch.entries()) {
  const tag = `[${i + 1}/${batch.length}] ${seg.id}`;
  try {
    const { descriptor, result } = await renderSegment(story, plan, seg, {
      mode: args.mode,
      take: numArg(args, "take", 1),
      seed: args.seed !== undefined ? numArg(args, "seed", null) : undefined,
      duration: args.duration !== undefined ? numArg(args, "duration", null) : undefined,
      width: args.width !== undefined ? numArg(args, "width", null) : undefined,
      height: args.height !== undefined ? numArg(args, "height", null) : undefined,
      fps: args.fps !== undefined ? numArg(args, "fps", null) : undefined,
      turbo: boolArg(args, "turbo", story.render.turbo),
      refSize: args["ref-size"],
      prefix: args.prefix,
      timeoutSec: args["timeout-sec"],
      wait: !submitOnly,
      force: Boolean(args.force)
    });
    const queued = result.status === "queued" || result.status === "running";
    console.log(
      `${tag} ${descriptor.mode} ${descriptor.duration_sec}s ${result.status}` +
        `${queued ? ` pos=${result.queue_position ?? "?"}` : ` ${(result.files ?? []).length} file(s)`}` +
        `${descriptor.warnings.length ? `  WARN ${descriptor.warnings.join("; ")}` : ""}`
    );
  } catch (e) {
    failures.push({ id: seg.id, error: e.message });
    console.error(`${tag} FAILED ${e.message}`);
  }
}

const elapsed = Math.round((Date.now() - started) / 1000);
console.log(
  JSON.stringify(
    {
      submitted: batch.length - failures.length,
      failed: failures,
      skipped: skipped.length,
      seconds: elapsed,
      manifest: story.manifestFile,
      ...(submitOnly ? { next: "node workspace/tools/audit_renders.mjs --story " + story.dir } : {})
    },
    null,
    2
  )
);
process.exit(failures.length ? 1 : 0);
