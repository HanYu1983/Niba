/**
 * Generate one reference still or one reference-to-video clip from a METHOD_2 prompts JSON.
 *
 *   node workspace/tools/method2_segment.mjs \
 *     --json test_story4/prompts.ch0_15s.json --segment 01 --image \
 *     --out test_story4/output/refs/ch0_15s/01.png
 *
 *   node workspace/tools/method2_segment.mjs \
 *     --json test_story4/prompts.ch0_15s.json --segment 01 --video \
 *     --ref test_story4/output/refs/ch0_15s/01.png \
 *     --out test_story4/output/video/ch0_15s/01.mp4
 *
 * `--image` submits `segment.image_generation_prompt.english` to z_image_t2i and puts the
 * finished still at `--out` (an existing folder, a folder path, or a file path).
 *
 * `--video` submits minimax_r2v at `segment.estimated_duration_seconds` with every `--ref`
 * (comma-separated or repeated), and the prompt is the segment object minus
 * `segment_id` / `estimated_duration_seconds` / `image_generation_prompt` /
 * `keyframe_anchors`, serialised as JSON.
 *
 * Both modes download into a scratch folder first, then move the result to `--out`, because
 * ComfyUI names its own files (`..._00001_.png`) and the job ledger is patched to the final
 * path afterwards. `--dry-run` resolves everything and does not touch the box.
 *
 * `--story <dir>` is optional: when its story.json has `refs` / `render`, those values seed
 * the model, size, fps and turbo defaults instead of the built-ins.
 */
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, resolve } from "node:path";

import { updateJob } from "../../comfyui_mcp/jobs.mjs";
import { runTool } from "../../comfyui_mcp/runner.mjs";
import { boolArg, listArg, numArg, parseArgs, usage } from "../lib/args.mjs";
import { quantiseFrames } from "../lib/plan.mjs";

const argv = process.argv.slice(2);
const args = parseArgs(argv);
const jsonArg = args.json ?? args._[0];

if (!jsonArg || jsonArg === true) {
  usage("missing --json", [
    "usage: node workspace/tools/method2_segment.mjs --json <prompts.json> --segment <id> (--image | --video)",
    "",
    "  --json FILE           METHOD_2 JSON: an array, or an object with segments[]",
    "  --segment ID          segment_id to use (01, 1, seg_01 all match)",
    "  --image               z_image_t2i from image_generation_prompt.english",
    "  --video               minimax_r2v from estimated_duration_seconds + --ref",
    "  --ref PATH[,PATH]     reference image for --video (repeatable, at least one)",
    "  --out PATH            output file, or folder (default: <json dir>/output/method2/)",
    "  --story DIR           optional story.json for refs/render defaults",
    "  --seed N              sampler seed (default 100)",
    "  --width / --height    default: 2x the story render size, else 704x1216",
    "  --fps N               default from story.json (24)",
    "  --no-turbo            full sampler instead of the turbo LoRA (--video)",
    "  --ref-size match|max  r2v reference sizing (default match)",
    "  --model / --clip / --vae / --steps / --cfg / --shift",
    "                        z_image overrides (--image only)",
    "  --sampler / --scheduler",
    "                        z_image sampler overrides (--image only)",
    "  --timeout-sec N       default 900",
    "  --force               overwrite an existing --out file",
    "  --dry-run             resolve the payload, do not submit",
    "  --verbose             print the exact prompt sent to the box"
  ]);
}

const jsonFile = resolve(String(jsonArg));
if (!existsSync(jsonFile)) {
  console.error(`prompts json not found: ${jsonFile}`);
  process.exit(2);
}

/** `--ref a --ref b` plus `--ref a,b`: parseArgs keeps only the last of a repeated key. */
function repeatedArg(argv, name) {
  const out = [];
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === `--${name}`) {
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        out.push(next);
        i++;
      }
    } else if (token.startsWith(`--${name}=`)) {
      out.push(token.slice(name.length + 3));
    }
  }
  return out;
}

const splitList = (values) =>
  values.flatMap((v) => String(v).split(",")).map((v) => v.trim()).filter(Boolean);

const unique = (values) => [...new Set(values)];

const doImage = boolArg(args, "image", false);
const doVideo = boolArg(args, "video", false);
if (doImage === doVideo) {
  console.error("pick exactly one of --image / --video");
  process.exit(2);
}
const mode = doImage ? "image" : "video";

/** `01`, `1` and `seg_01` name the same segment. */
const normaliseId = (value) =>
  String(value ?? "").trim().replace(/^seg[_-]?/i, "").replace(/^0+(?=\d)/, "");

const raw = JSON.parse(readFileSync(jsonFile, "utf8"));
const segments = Array.isArray(raw)
  ? raw
  : Array.isArray(raw?.segments)
    ? raw.segments
    : null;
if (!segments) {
  console.error(`${jsonFile} is not a METHOD_2 array (or an object with segments[])`);
  process.exit(2);
}

const segmentId = args.segment ?? args.seg;
if (!segmentId || segmentId === true) {
  console.error(`missing --segment; this json has: ${segments.map((s) => s.segment_id ?? "(no id)").join(", ")}`);
  process.exit(2);
}

const segment = segments.find((s) => normaliseId(s.segment_id ?? s.id) === normaliseId(segmentId));
if (!segment) {
  console.error(`segment not found: ${segmentId}\nthis json has: ${segments.map((s) => s.segment_id ?? "(no id)").join(", ")}`);
  process.exit(2);
}
const id = String(segment.segment_id ?? segment.id);

/* ------------------------------------------------------------------ defaults */

const storyDir = args.story && args.story !== true ? resolve(String(args.story)) : null;
const storyFile = storyDir ? resolve(storyDir, "story.json") : null;
const storyCfg = storyFile && existsSync(storyFile) ? JSON.parse(readFileSync(storyFile, "utf8")) : {};
const refsCfg = storyCfg.refs ?? {};
const renderCfg = storyCfg.render ?? {};

const to16 = (n) => Math.max(16, Math.round(n / 16) * 16);
const baseWidth = Number(renderCfg.width ?? 352);
const baseHeight = Number(renderCfg.height ?? 608);
const fps = numArg(args, "fps", Number(renderCfg.fps ?? 24));
const seed = numArg(args, "seed", 100);
const turbo = boolArg(args, "turbo", renderCfg.turbo ?? true);
const timeoutSec = numArg(args, "timeout-sec", 900);
const dryRun = boolArg(args, "dry-run", false);
const verbose = boolArg(args, "verbose", false);
const force = boolArg(args, "force", false);

const width = numArg(args, "width", doImage ? to16(baseWidth * 2) : baseWidth);
const height = numArg(args, "height", doImage ? to16(baseHeight * 2) : baseHeight);
const prefix = String(args.prefix ?? `method2/${basename(jsonFile, ".json")}/${id}`);

const MEDIA_RE = /\.(png|jpe?g|webp|gif|mp4|webm|mov)$/i;

/** `--out` is a file when it carries a media extension, otherwise a folder. */
function resolveTarget(outArg, extension) {
  const name = `${id}_${doImage ? "ref" : "r2v"}${extension}`;
  if (!outArg || outArg === true) return resolve(dirname(jsonFile), "output", "method2", name);
  const given = resolve(String(outArg));
  if (MEDIA_RE.test(given)) return given;
  if (existsSync(given) && statSync(given).isFile()) return given;
  return resolve(given, name);
}

function moveInto(source, target) {
  if (existsSync(target) && !force) {
    throw new Error(`${target} already exists — pass --force to overwrite`);
  }
  mkdirSync(dirname(target), { recursive: true });
  try {
    renameSync(source, target);
  } catch {
    // Scratch and destination can sit on different drives (tmpdir is usually C:).
    copyFileSync(source, target);
    rmSync(source, { force: true });
  }
  return statSync(target).size;
}

/* ------------------------------------------------------------------- payload */

let tool;
let payload;
let refs = [];
let warnings = [];
let duration = null;
let frames = null;

if (doImage) {
  const prompt = segment.image_generation_prompt?.english;
  if (typeof prompt !== "string" || prompt.trim() === "") {
    console.error(`${id}: image_generation_prompt.english is missing or empty`);
    process.exit(2);
  }
  tool = "z_image_t2i";
  payload = {
    prompt,
    width,
    height,
    steps: numArg(args, "steps", 8),
    cfg: numArg(args, "cfg", 1),
    shift: numArg(args, "shift", 3),
    sampler_name: String(args.sampler ?? "res_multistep"),
    scheduler: String(args.scheduler ?? "simple"),
    unet_name: String(args.model ?? refsCfg.model ?? "moodyRealMix_zitV7.safetensors"),
    clip_name: String(args.clip ?? refsCfg.clip ?? "qwen_3_4b.safetensors"),
    vae_name: String(args.vae ?? refsCfg.vae ?? "ae.safetensors"),
    filename_prefix: prefix,
    seed
  };
} else {
  const requested = Number(segment.estimated_duration_seconds);
  if (!Number.isFinite(requested) || requested <= 0) {
    console.error(`${id}: estimated_duration_seconds is missing or not a positive number`);
    process.exit(2);
  }
  duration = requested;
  frames = quantiseFrames(requested, fps);

  const warningList = [];
  // repeatedArg keeps `--ref a --ref b` in order; parseArgs would only remember the last.
  const repeatedRefs = repeatedArg(argv, "ref");
  refs = unique(splitList(repeatedRefs.length ? repeatedRefs : listArg(args, "ref")));  if (refs.length === 0) {
    console.error(`${id}: --video needs at least one --ref image`);
    process.exit(2);
  }
  if (refs.length > 9) {
    console.error(`${id}: minimax_r2v accepts at most 9 reference images, got ${refs.length}`);
    process.exit(2);
  }
  refs = refs.map((ref) => {
    const local = resolve(ref);
    if (existsSync(local)) return local;
    warningList.push(`reference not found locally, passing through as a ComfyUI input name: ${ref}`);
    return ref;
  });
  warnings = warningList;

  // Everything except the four keys the tool derives itself. The rest is the shot.
  const {
    segment_id: _segmentId,
    estimated_duration_seconds: _duration,
    image_generation_prompt: _imagePrompt,
    keyframe_anchors: _keyframeAnchors,
    ...shot
  } = segment;
  const prompt = JSON.stringify(shot);

  tool = "minimax_r2v";
  payload = {
    prompt,
    width,
    height,
    duration_sec: duration,
    frames,
    fps,
    turbo,
    seed,
    filename_prefix: prefix,
    reference_images: refs,
    ref_image_size: String(args["ref-size"] ?? "match")
  };
}

const prompt = payload.prompt;

const summary = {
  json: jsonFile,
  segment_id: id,
  mode,
  tool,
  out: resolveTarget(args.out, doImage ? ".png" : ".mp4"),
  size: `${width}x${height}`,
  seed,
  ...(doImage
    ? {
        model: payload.unet_name,
        steps: payload.steps,
        prompt_chars: prompt.length
      }
    : {
        seconds: { requested: duration, frames, actual: Number((frames / fps).toFixed(2)) },
        fps,
        turbo,
        references: refs,
        prompt_chars: prompt.length
      }),
  ...(warnings.length ? { warnings } : {}),
  ...(verbose || dryRun ? { prompt } : {})
};

if (dryRun) {
  console.log(JSON.stringify({ ...summary, dry_run: true }, null, 2));
  console.log("dry run: not submitting");
  process.exitCode = 0;
} else {
  // Fail before spending a render: the move guard below is the only overwrite gate.
  const plannedTarget = resolveTarget(args.out, doImage ? ".png" : ".mp4");
  if (existsSync(plannedTarget) && !force) {
    console.error(`${plannedTarget} already exists — pass --force to overwrite`);
    process.exit(2);
  }

  const stage = mkdtempSync(resolve(tmpdir(), "method2-seg-"));
  let keepStage = false;
  try {
    const result = await runTool(tool, payload, {
      label: { project: basename(jsonFile, ".json"), segment_id: id, mode },
      output_dir: stage,
      wait: true,
      timeout_sec: timeoutSec
    });

    if (result.status !== "success") {
      console.log(
        JSON.stringify(
          {
            ...summary,
            status: result.status,
            prompt_id: result.prompt_id,
            ...(result.hint ? { hint: result.hint } : {})
          },
          null,
          2
        )
      );
      console.error(`${result.status}: the job is still on the box; poll it with comfy_job`);
      process.exitCode = 1;
    } else {
      const files = result.files ?? [];
      if (files.length === 0) throw new Error("the job succeeded but produced no downloadable file");

      const extension = extname(files[0].path) || (doImage ? ".png" : ".mp4");
      const target = resolveTarget(args.out, extension);
      const moved = [];
      try {
        for (const [index, file] of files.entries()) {
          const destination =
            index === 0
              ? target
              : resolve(dirname(target), `${basename(target, extname(target))}_${index + 1}${extname(file.path)}`);
          const bytes = moveInto(file.path, destination);
          moved.push({ path: destination, bytes, kind: file.kind ?? null });
        }
      } catch (e) {
        // A render already ran; never delete the only copy because the move was refused.
        keepStage = true;
        throw e;
      }

      // The ledger was written before the move, so point it at where the files really are.
      updateJob(result.prompt_id, {
        output_dir: dirname(target),
        files: files.map((file, index) => ({ ...file, path: moved[index].path, bytes: moved[index].bytes }))
      });

      console.log(
        JSON.stringify(
          {
            ...summary,
            out: target,
            status: result.status,
            prompt_id: result.prompt_id,
            elapsed_sec: result.elapsed_sec,
            files: moved
          },
          null,
          2
        )
      );
      process.exitCode = 0;
    }
  } catch (e) {
    console.error(`${mode} failed: ${e.message}`);
    process.exitCode = 1;
  } finally {
    if (keepStage) console.error(`the finished file is still at ${stage}`);
    else rmSync(stage, { recursive: true, force: true });
  }
}
