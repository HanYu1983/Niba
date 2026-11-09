/**
 * Render one plan segment.
 *
 *   node workspace/tools/render_segment.mjs --story test_story3 --seg seg_017
 *   node workspace/tools/render_segment.mjs --story test_story3 --seg seg_002 --mode r2v
 *   node workspace/tools/render_segment.mjs --story test_story3 --seg seg_017 --dry-run
 *   node workspace/tools/render_segment.mjs --story test_story3 --seg seg_017 --async
 *
 * Mode is inferred from the prompt file (`.r2v.txt` → reference images, `.t2v.txt` → text
 * only). `--first-frame` turns a t2v prompt into an i2v render.
 */
import { parseArgs, boolArg, numArg, usage } from "../lib/args.mjs";
import { loadPlan, segmentById } from "../lib/plan.mjs";
import { pollCommand, renderSegment } from "../lib/render.mjs";
import { describeStory, loadStory } from "../lib/story.mjs";

const args = parseArgs();
const [posStory, posSeg, posPrompt] = args._;
const segId = String(args.seg ?? posSeg ?? "");
const storyArg = args.story ?? posStory;

if (!segId) {
  usage("missing --seg", [
    "usage: node workspace/tools/render_segment.mjs --story <dir> --seg <seg_id> [options]",
    "",
    "  --mode t2v|r2v|i2v   default: inferred from the prompt file name",
    "  --prompt FILE        default: <story>/prompts/<seg>.<mode>.txt",
    "  --take N             manifest take number (default 1)",
    "  --seed N             sampler seed (default: time-based)",
    "  --duration S         override segment.estimated_sec",
    "  --width / --height   override story.json render size",
    "  --fps N              default from story.json (24)",
    "  --no-turbo           full sampler instead of the turbo LoRA",
    "  --first-frame FILE   i2v: opening still",
    "  --last-frame FILE    i2v: optional closing still",
    "  --ref-size match|max default match (r2v only)",
    "  --async              submit and return immediately (alias --submit-only)",
    "  --dry-run            resolve plates + payload, do not submit",
    "  --force              submit even if <Picture N> count mismatches the slots"
  ]);
}

const story = loadStory({ story: storyArg, plan: args.plan, prompts: args.prompts, manifest: args.manifest });
const plan = loadPlan(story.planFile);
const segment = segmentById(plan, segId);
if (!segment) {
  console.error(`segment not found: ${segId}\nplan has: ${plan.segments.map((s) => s.id).join(", ")}`);
  process.exit(2);
}

const submitOnly = boolArg(args, "async", false) || boolArg(args, "submit-only", false) || !boolArg(args, "wait", true);

const { descriptor, result, record, manifest } = await renderSegment(story, plan, segment, {
  mode: args.mode,
  prompt: args.prompt ?? posPrompt,
  take: numArg(args, "take", 1),
  seed: args.seed !== undefined ? numArg(args, "seed", null) : undefined,
  duration: args.duration !== undefined ? numArg(args, "duration", null) : undefined,
  width: args.width !== undefined ? numArg(args, "width", null) : undefined,
  height: args.height !== undefined ? numArg(args, "height", null) : undefined,
  fps: args.fps !== undefined ? numArg(args, "fps", null) : undefined,
  turbo: boolArg(args, "turbo", story.render.turbo),
  firstFrame: args["first-frame"] && args["first-frame"] !== true ? args["first-frame"] : null,
  lastFrame: args["last-frame"] && args["last-frame"] !== true ? args["last-frame"] : null,
  refSize: args["ref-size"],
  prefix: args.prefix,
  timeoutSec: args["timeout-sec"],
  dryRun: Boolean(args["dry-run"]),
  wait: !submitOnly,
  force: Boolean(args.force)
});

console.log(JSON.stringify({ ...describeStory(story), ...descriptor }, null, 2));

if (args["dry-run"]) {
  console.log("dry run: not submitting");
  process.exit(0);
}

const queued = result.status === "queued" || result.status === "running";
console.log(
  JSON.stringify(
    {
      status: result.status,
      prompt_id: result.prompt_id,
      files: (result.files ?? []).map((f) => f.path),
      ...(queued ? { queue_position: result.queue_position ?? null, poll: pollCommand(result.prompt_id) } : {}),
      manifest,
      record
    },
    null,
    2
  )
);

// Queued is a success for submit-only: the job exists, we just chose not to wait.
process.exitCode = result.status === "success" || (submitOnly && queued) ? 0 : 1;
