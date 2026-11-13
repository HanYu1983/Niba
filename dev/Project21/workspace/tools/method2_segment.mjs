/**
 * Generate reference stills or reference-to-video clips from a METHOD_2 prompts JSON.
 *
 *   node workspace/tools/method2_segment.mjs \
 *     --json test_story4/prompts.ch0_15s.json --from 01 --to 05 --image \
 *     --out test_story4/output/refs/ch0_15s
 *
 *   node workspace/tools/method2_segment.mjs \
 *     --json test_story4/prompts.ch0_15s.json --from 01 --to 05 --video \
 *     --out test_story4/output/video/ch0_15s
 *
 * `--image` submits `segment.image_generation_prompt.english` to z_image_t2i.
 * `--video` submits minimax_r2v at `segment.estimated_duration_seconds`; the prompt is the
 * segment object minus `segment_id` / `estimated_duration_seconds` / `image_generation_prompt` /
 * `keyframe_anchors`, serialised as JSON.
 *
 * Output layout: when `--out` is a folder (or omitted), each segment gets
 *   <out>/<json basename>/seg_001/<comfyui filename>
 * so a batch run can never mix two segments. `--out` ending in a media extension is an exact
 * file and is only accepted for a single segment.
 *
 * `--ref` (comma-separated or repeated, up to nine) applies to every selected segment. Without
 * it, `--video` uses the newest images already sitting in that segment's own folder, which is
 * what a preceding `--image` run leaves behind.
 *
 * Both modes download into a scratch folder first, then move the result, because ComfyUI names
 * its own files (`..._00001_.png`); the job ledger is patched to the final path afterwards.
 * `--dry-run` resolves every payload and does not touch the box.
 *
 * `--story <dir>` is optional: when its story.json has `refs` / `render`, those values seed
 * the model, size, fps and turbo defaults instead of the built-ins.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync
} from "node:fs";
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
    "usage: node workspace/tools/method2_segment.mjs --json <prompts.json> (--segment ID | --from ID --to ID) (--image | --video)",
    "",
    "  --json FILE           METHOD_2 JSON: an array, or an object with segments[]",
    "  --segment ID          one segment (01, 1, seg_01 all match)",
    "  --from ID / --to ID   inclusive range in JSON order (either end is optional)",
    "  --image               z_image_t2i from image_generation_prompt.english",
    "  --video               minimax_r2v from estimated_duration_seconds",
    "  --ref PATH[,PATH]     reference image(s) for --video (repeatable, max 9)",
    "                        default: the newest images in that segment's folder",
    "  --out PATH            folder root, or an exact file for a single segment",
    "                        default: <json dir>/output/<json basename>/<segment_id>/",
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
    "  --timeout-sec N       per job (default 900)",
    "  --force               overwrite a file that already exists at the target",
    "  --dry-run             resolve the payloads, do not submit",
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
const idOf = (segment) => normaliseId(segment.segment_id ?? segment.id);

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

/* ------------------------------------------------------------------ selection */

const listIds = () => segments.map((s) => s.segment_id ?? "(no id)").join(", ");
const hasSegment = args.segment !== undefined && args.segment !== true;
const hasFrom = args.from !== undefined && args.from !== true;
const hasTo = args.to !== undefined && args.to !== true;

let selected;
if (hasSegment) {
  if (hasFrom || hasTo) {
    console.error("use --segment for one segment, or --from/--to for a range, not both");
    process.exit(2);
  }
  const found = segments.find((s) => idOf(s) === normaliseId(args.segment));
  if (!found) {
    console.error(`segment not found: ${args.segment}\nthis json has: ${listIds()}`);
    process.exit(2);
  }
  selected = [found];
} else {
  if (!hasFrom && !hasTo) {
    console.error(`missing --segment or --from/--to\nthis json has: ${listIds()}`);
    process.exit(2);
  }
  const indexOf = (value, fallback) => {
    if (value === undefined) return fallback;
    const at = segments.findIndex((s) => idOf(s) === normaliseId(value));
    if (at < 0) {
      console.error(`segment not found: ${value}\nthis json has: ${listIds()}`);
      process.exit(2);
    }
    return at;
  };
  const from = indexOf(hasFrom ? args.from : undefined, 0);
  const to = indexOf(hasTo ? args.to : undefined, segments.length - 1);
  if (from > to) {
    console.error(`--from is after --to (${from} > ${to})`);
    process.exit(2);
  }
  selected = segments.slice(from, to + 1);
}

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

const MEDIA_RE = /\.(png|jpe?g|webp|gif|mp4|webm|mov)$/i;
const IMAGE_RE = /\.(png|jpe?g|webp)$/i;

const jsonBase = basename(jsonFile, ".json");
const outArg = args.out && args.out !== true ? resolve(String(args.out)) : null;
const exactOut =
  outArg && (MEDIA_RE.test(outArg) || (existsSync(outArg) && statSync(outArg).isFile())) ? outArg : null;

if (exactOut && selected.length > 1) {
  console.error(`${selected.length} segments selected but --out is a file (${exactOut}); pass a folder instead`);
  process.exit(2);
}

const outRoot = exactOut ? dirname(exactOut) : outArg ?? resolve(dirname(jsonFile), "output");
const folderRoot = resolve(outRoot, jsonBase);

/**
 * Folder name for a segment: `seg_001`, like the plan ids, whatever the json calls it
 * (`01`, `1` or `seg_01` all become `seg_001`).
 */
const folderIdOf = (segment) => {
  const key = idOf(segment);
  return /^\d+$/.test(key) ? `seg_${key.padStart(3, "0")}` : `seg_${key}`;
};
const dirFor = (segment) => resolve(folderRoot, folderIdOf(segment));

const explicitRefs = unique(splitList(repeatedArg(argv, "ref").length ? repeatedArg(argv, "ref") : listArg(args, "ref")));
const explicitRefPaths = explicitRefs.map((ref) => {
  const local = resolve(ref);
  return existsSync(local) ? local : ref;
});

function imagesIn(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => IMAGE_RE.test(file))
    .map((file) => ({ file, mtime: statSync(resolve(dir, file)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
    .map(({ file }) => resolve(dir, file));
}

/* -------------------------------------------------------------------- payload */

function buildJob(segment, id, dir) {
  const warnings = [];
  const folder = folderIdOf(segment);

  if (doImage) {
    const prompt = segment.image_generation_prompt?.english;
    if (typeof prompt !== "string" || prompt.trim() === "") {
      throw new Error(`${id}: image_generation_prompt.english is missing or empty`);
    }
    return {
      tool: "z_image_t2i",
      prompt,
      warnings,
      payload: {
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
        filename_prefix: `method2/${jsonBase}/${folder}`,
        seed
      }
    };
  }

  const requested = Number(segment.estimated_duration_seconds);
  if (!Number.isFinite(requested) || requested <= 0) {
    throw new Error(`${id}: estimated_duration_seconds is missing or not a positive number`);
  }
  const frames = quantiseFrames(requested, fps);

  let refs;
  let refSource;
  if (explicitRefPaths.length) {
    if (explicitRefPaths.length > 9) {
      throw new Error(`${id}: minimax_r2v accepts at most 9 reference images, got ${explicitRefPaths.length}`);
    }
    refs = explicitRefPaths;
    refSource = "flag";
    for (const ref of refs) {
      if (!existsSync(ref)) {
        warnings.push(`reference not found locally, passing through as a ComfyUI input name: ${ref}`);
      }
    }
  } else {
    refs = imagesIn(dir);
    refSource = "segment_folder";
    if (refs.length === 0) {
      if (dryRun) {
        warnings.push(`${id}: no images in ${dir} yet (run --image for this segment first)`);
      } else {
        throw new Error(`${id}: no --ref given and no images in ${dir} — run --image for this segment first`);
      }
    }
    if (refs.length > 9) {
      warnings.push(`${id}: ${refs.length} images in ${dir}, using the newest 9`);
      refs = refs.slice(0, 9);
    }
  }

  // Everything except the four keys the tool derives itself. The rest is the shot.
  const {
    segment_id: _segmentId,
    estimated_duration_seconds: _duration,
    image_generation_prompt: _imagePrompt,
    keyframe_anchors: _keyframeAnchors,
    ...shot
  } = segment;
  const prompt = JSON.stringify(shot);

  return {
    tool: "minimax_r2v",
    prompt,
    warnings,
    refs,
    refSource,
    duration: requested,
    frames,
    payload: {
      prompt,
      width,
      height,
      duration_sec: requested,
      frames,
      fps,
      turbo,
      seed,
      filename_prefix: `method2/${jsonBase}/${folder}`,
      reference_images: refs,
      ref_image_size: String(args["ref-size"] ?? "match")
    }
  };
}

/* ---------------------------------------------------------------------- run */

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

const results = [];
let failed = 0;

for (const [position, segment] of selected.entries()) {
  const id = String(segment.segment_id ?? segment.id);
  const folder = folderIdOf(segment);
  const dir = dirFor(segment);
  const tag = `[${position + 1}/${selected.length}] ${folder}`;

  let job;
  try {
    job = buildJob(segment, id, dir);
  } catch (e) {
    failed++;
    results.push({ segment_id: id, status: "failed", error: e.message });
    console.error(`${tag} FAILED ${e.message}`);
    continue;
  }

  const entry = {
    segment_id: id,
    folder,
    out: exactOut ?? null,
    out_dir: dir,
    prompt_chars: job.prompt.length,
    ...(job.warnings.length ? { warnings: job.warnings } : {}),
    ...(doVideo
      ? {
          seconds: { requested: job.duration, frames: job.frames, actual: Number((job.frames / fps).toFixed(2)) },
          references: job.refs,
          references_from: job.refSource
        }
      : {}),
    ...(verbose ? { prompt: job.prompt } : {})
  };

  if (dryRun) {
    results.push(entry);
    console.error(`${tag} dry-run ${entry.out ?? entry.out_dir}`);
    continue;
  }

  // Fail before spending a render: the move guard below is the only overwrite gate.
  if (exactOut && existsSync(exactOut) && !force) {
    failed++;
    results.push({ ...entry, status: "failed", error: `${exactOut} already exists — pass --force to overwrite` });
    console.error(`${tag} FAILED ${exactOut} already exists`);
    continue;
  }

  const stage = mkdtempSync(resolve(tmpdir(), "method2-seg-"));
  let keepStage = false;
  try {
    const result = await runTool(job.tool, job.payload, {
      label: { project: jsonBase, segment_id: id, mode },
      output_dir: stage,
      wait: true,
      timeout_sec: timeoutSec
    });

    if (result.status !== "success") {
      results.push({
        ...entry,
        status: result.status,
        prompt_id: result.prompt_id,
        ...(result.hint ? { hint: result.hint } : {})
      });
      console.error(`${tag} ${result.status}: the job is still on the box; poll it with comfy_job`);
      failed++;
      continue;
    }

    const files = result.files ?? [];
    if (files.length === 0) throw new Error("the job succeeded but produced no downloadable file");

    const target = exactOut ?? resolve(dir, basename(files[0].path));
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

    results.push({
      ...entry,
      out: target,
      status: result.status,
      prompt_id: result.prompt_id,
      elapsed_sec: result.elapsed_sec,
      files: moved
    });
    console.error(`${tag} success ${result.elapsed_sec}s ${target}`);
  } catch (e) {
    failed++;
    results.push({ ...entry, status: "failed", error: e.message, ...(keepStage ? { stage } : {}) });
    console.error(`${tag} FAILED ${e.message}`);
  } finally {
    if (keepStage) console.error(`${tag} the finished file is still at ${stage}`);
    else rmSync(stage, { recursive: true, force: true });
  }
}

const warnings = [...new Set(results.flatMap((r) => r.warnings ?? []))];

console.log(
  JSON.stringify(
    {
      json: jsonFile,
      mode,
      tool: doImage ? "z_image_t2i" : "minimax_r2v",
      layout: exactOut ? "file" : "json_segment_folder",
      out: exactOut ?? folderRoot,
      size: `${width}x${height}`,
      seed,
      ...(doImage
        ? { model: String(args.model ?? refsCfg.model ?? "moodyRealMix_zitV7.safetensors"), steps: numArg(args, "steps", 8) }
        : { fps, turbo, refs_from: explicitRefs.length ? "flag" : "segment_folder" }),
      ...(dryRun ? { dry_run: true } : {}),
      totals: { selected: selected.length, succeeded: selected.length - failed, failed },
      ...(warnings.length ? { warnings } : {}),
      segments: results
    },
    null,
    2
  )
);

// process.exitCode, not process.exit(): submissions leave keep-alive sockets closing.
process.exitCode = failed ? 1 : 0;
