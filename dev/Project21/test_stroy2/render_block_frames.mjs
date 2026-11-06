#!/usr/bin/env node
/**
 * Compile block(s) and hand them to ComfyUI's MiniMax H3 r2v — but with the reference images
 * taken from the storyboard frames in doc/image_story instead of the entity plates.
 *
 *   node render_block_frames.mjs momotaro.json block_005_veranda_stretch
 *   node render_block_frames.mjs momotaro.json --dry-run
 *   node render_block_frames.mjs momotaro.json block_020 --window 7 --width 544 --height 960
 *   node render_block_frames.mjs momotaro.json                       # every block in the project
 *
 * Which frames: by default the number in the block id picks the centre. `block_005` uses frame03,
 * frame04, frame05, frame06, frame07 — five frames in total, two before and two after. A frame
 * that does not exist is simply not attached (the end of the story only has up to frame37, so
 * block_038 gets two frames instead of five).
 *
 * The frames can also be named explicitly, and then every block uses that same set — the id
 * number is no longer looked up, only used as a label:
 *   --frames 3,4,5,6,7      explicit list, kept in the order given (max 9)
 *   --start 3 --count 5     frame03..frame07
 *   --start 3 --end 7       same range, written with an inclusive end
 * Numbers only; missing files are still skipped. Everything else — compiling, slot order, seed,
 * output filename, ledger label — is the same as render_block.mjs.
 *
 * Options (all optional):
 *   --frames-dir doc/image_story   where frameNN.jpg lives
 *   --window 5                     total number of frames around the block number
 *   --frames a,b,c                 explicit frame numbers (max 9)
 *   --start N --count N            first frame + how many
 *   --start N --end N              first frame + last frame (inclusive)
 *   --width 608            --height 352          generation size, multiples of 32
 *   --duration 4           seconds; default = each block's own duration
 *   --fps 24               --seed 20261166        default = 20261100 + block index
 *   --no-turbo             20 steps instead of the 4-step reference LoRA
 *   --wait                 block until each file is downloaded (default: return prompt_ids)
 *   --timeout-sec 900      only meaningful with --wait
 *   --limit 5              only the first N blocks (all-blocks mode)
 *   --verbose              print the slot table and compiled payload for every block
 *   --filename-prefix <p>  default render/<project>/<block_id>; explicit value becomes the folder
 *   --label-project <p>    ledger tag; default = the project's folder name
 *   --dry-run              print what would be sent, submit nothing
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { compileBlock, CompilerError } from "../gen_video/compiler.mjs";
import { runTool } from "../comfyui_mcp/runner.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MAX_REFS = 9;

const USAGE = `usage: node render_block_frames.mjs <project.json> [block_id|prefix] [options]

  no block name              submit every block in the project
  --frames-dir doc/image_story  storyboard frame folder
  --window 5                 total frames around the block number (2 before + 2 after)
  --frames 3,4,5,6,7         explicit frame numbers, same for every block
  --start 3 --count 5        first frame + how many
  --start 3 --end 7          first frame + last frame (inclusive)
  --width 608 --height 352   generation size (multiples of 32)
  --duration 4 --fps 24      default: each block's own duration / 24
  --seed 20261166            default: 20261100 + block index
  --no-turbo                 use the 20-step sampler
  --wait                     block until the mp4 is downloaded
  --limit 5                  only the first N blocks
  --verbose                  slot table + compiled payload for every block
  --dry-run                  print what would be sent, submit nothing
  see the header of this file for the rest`;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      out._.push(token);
      continue;
    }
    const eq = token.indexOf("=");
    let key;
    let value;
    if (eq !== -1) {
      key = token.slice(2, eq);
      value = token.slice(eq + 1);
    } else {
      key = token.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        value = next;
        i++;
      } else {
        value = "true";
      }
    }
    out[key] = value;
  }
  return out;
}

function number(value, fallback, name) {
  if (value === undefined) return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`--${name} must be a number, got "${value}"`);
  return n;
}

function resolveProject(file) {
  for (const candidate of [path.resolve(file), path.resolve(HERE, file)]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`project file not found: ${file}`);
}

/** Full id, or a prefix that only one block matches. */
function resolveBlock(project, wanted) {
  const ids = project.blocks.map((b) => b.id);
  if (ids.includes(wanted)) return wanted;
  const hits = ids.filter((id) => id.startsWith(wanted));
  if (hits.length === 1) return hits[0];
  if (hits.length > 1) throw new Error(`"${wanted}" is ambiguous: ${hits.slice(0, 8).join(", ")}`);
  throw new Error(`no block "${wanted}"; the project has ${ids.length} blocks, e.g. ${ids.slice(0, 3).join(", ")}`);
}

/** block_005_veranda_stretch -> 5. The number is the storyboard frame this shot is built on. */
function blockNumber(blockId) {
  const match = /^block_(\d+)/.exec(blockId);
  return match ? Number(match[1]) : null;
}

/** frame5.jpg / frame05.jpg / frame05.png ... whichever exists for that number. */
function findFrame(dir, frameNumber) {
  if (!existsSync(dir)) return null;
  const pattern = new RegExp(`^frame0*${frameNumber}\\.(png|jpe?g|webp)$`, "i");
  const hit = readdirSync(dir)
    .filter((file) => pattern.test(file))
    .sort()[0];
  return hit ? path.join(dir, hit) : null;
}

/** A positive integer option, or null when the flag was not given. */
function positiveInt(args, key, what) {
  const raw = args[key];
  if (raw === undefined) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) throw new Error(`--${key} must be a positive ${what}, got "${raw}"`);
  return n;
}

/** "3,4,5,6,7" -> [3,4,5,6,7]. Spaces and full-width commas are accepted too. */
function parseFrameList(value) {
  const parts = String(value)
    .split(/[,，\s]+/)
    .filter(Boolean);
  if (parts.length === 0) throw new Error("--frames needs at least one frame number");
  const numbers = parts.map((part) => {
    const n = Number(part);
    if (!Number.isInteger(n) || n < 1) throw new Error(`--frames: "${part}" is not a positive frame number`);
    return n;
  });
  return [...new Set(numbers)];
}

/**
 * null -> use the window around the block number. Anything else -> the exact numbers to attach,
 * in order, for every block.
 */
function resolveFrameSpec(args) {
  const explicit = ["frames", "start", "count", "end"].some((key) => args[key] !== undefined);
  if (!explicit) return null;
  if (args.window !== undefined) {
    throw new Error("use either --window or --frames/--start/--count/--end, not both");
  }

  if (args.frames !== undefined) {
    if (["start", "count", "end"].some((key) => args[key] !== undefined)) {
      throw new Error("--frames cannot be combined with --start/--count/--end");
    }
    const numbers = parseFrameList(args.frames);
    if (numbers.length > MAX_REFS) {
      throw new Error(`--frames lists ${numbers.length} frames; MiniMax takes at most ${MAX_REFS}`);
    }
    return { numbers, label: `frames ${numbers.join(",")}` };
  }

  const start = positiveInt(args, "start", "frame number");
  if (start === null) throw new Error("--count/--end need --start <first frame>");
  const count = positiveInt(args, "count", "count");
  const end = positiveInt(args, "end", "frame number");
  if (count === null && end === null) throw new Error("--start needs --count or --end");
  if (count !== null && end !== null && start + count - 1 !== end) {
    throw new Error(`--start ${start} --count ${count} ends at ${start + count - 1}, but --end is ${end}`);
  }
  const total = count ?? end - start + 1;
  if (total < 1) throw new Error(`--end ${end} is before --start ${start}`);
  if (total > MAX_REFS) throw new Error(`asked for ${total} frames; MiniMax takes at most ${MAX_REFS}`);
  const numbers = Array.from({ length: total }, (_, i) => start + i);
  return { numbers, label: count !== null ? `start ${start} count ${count}` : `start ${start} end ${end}` };
}

/** [3,4,5,6,7] for centre 5 / window 5; anything below 1 falls away. */
function windowNumbers(centre, window) {
  const first = centre - Math.floor(window / 2);
  const numbers = [];
  for (let n = first; n < first + window; n++) if (n >= 1) numbers.push(n);
  return numbers;
}

/** One slot per frame file that exists; a missing number is silently left out. */
function frameSlots(dir, numbers) {
  const slots = [];
  for (const n of numbers) {
    const file = findFrame(dir, n);
    if (file) slots.push({ kind: "storyboard", entity_ref: `frame${String(n).padStart(2, "0")}`, frame: n, path: file });
  }
  return slots;
}

function buildPrompt(prompt, slots) {
  const legend = slots
    .map((s, i) => `${i + 1} = ${s.entity_ref} (${s.kind})`)
    .join(", ");
  return `REFERENCE IMAGES (upload order): ${legend}.\n\n${JSON.stringify(prompt, null, 2)}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [projectArg, blockArg] = args._;
  if (!projectArg) {
    console.error(USAGE);
    return 1;
  }

  const projectFile = resolveProject(projectArg);
  const project = JSON.parse(readFileSync(projectFile, "utf8"));

  const allBlocks = !blockArg;
  const verbose = !allBlocks || args.verbose === "true";
  const dryRun = args["dry-run"] === "true";
  const turbo = args["no-turbo"] !== "true";
  const wait = args.wait === "true";
  const width = number(args.width, 608, "width");
  const height = number(args.height, 352, "height");
  const fps = number(args.fps, 24, "fps");
  const fixedDuration = args.duration === undefined ? null : number(args.duration, 0, "duration");
  const fixedSeed = args.seed === undefined ? null : number(args.seed, 0, "seed");
  const timeoutSec = number(args["timeout-sec"], 900, "timeout-sec");
  const window = number(args.window, 5, "window");
  const framesDir =
    typeof args["frames-dir"] === "string" ? path.resolve(args["frames-dir"]) : path.join(HERE, "doc", "image_story");
  const projectDir = path.basename(path.dirname(projectFile));
  const labelProject = typeof args["label-project"] === "string" ? args["label-project"] : projectDir;
  const spec = resolveFrameSpec(args);

  if (!Number.isInteger(window) || window < 1 || window > MAX_REFS) {
    throw new Error(`--window must be an integer from 1 to ${MAX_REFS}, got "${window}"`);
  }
  if (!existsSync(framesDir)) throw new Error(`frame folder not found: ${framesDir}`);

  let targets = allBlocks ? project.blocks.map((b) => b.id) : [resolveBlock(project, blockArg)];
  if (args.limit !== undefined) targets = targets.slice(0, number(args.limit, targets.length, "limit"));
  if (targets.length === 0) throw new Error("nothing to submit: the project has no blocks");

  const pad = String(targets.length).length;
  const counts = { submitted: 0, skipped: 0, failed: 0, ready: 0 };

  if (allBlocks) {
    console.log(
      `${targets.length} blocks from ${path.basename(projectFile)}  ${width}x${height} ${fps}fps ` +
        `turbo ${turbo}  ${spec ? spec.label : `${window} frames around each block number`} ` +
        `from ${path.relative(HERE, framesDir)}${dryRun ? "  (dry run)" : ""}`
    );
  }

  for (const [n, blockId] of targets.entries()) {
    const tag = allBlocks ? `[${String(n + 1).padStart(pad)}/${targets.length}] ${blockId.padEnd(34)}` : blockId;

    let compiled;
    try {
      compiled = compileBlock(project, blockId);
    } catch (e) {
      counts.failed++;
      const why = e instanceof CompilerError ? e.message : String(e);
      console.error(`${tag}  COMPILE FAILED  ${why}`);
      continue;
    }
    const { prompt, metadata } = compiled;

    // Either the block number is the centre of the storyboard window, or the caller named the
    // frames; missing frames are just dropped.
    let numbers;
    if (spec) {
      numbers = spec.numbers;
    } else {
      const centre = blockNumber(blockId);
      if (centre === null) {
        counts.failed++;
        console.error(`${tag}  FAILED  the id has no block_NN number to look frames up by`);
        continue;
      }
      numbers = windowNumbers(centre, window);
    }
    const refs = frameSlots(framesDir, numbers);

    const have = new Set(refs.map((s) => s.frame));
    const missing = numbers.filter((f) => !have.has(f));

    if (refs.length === 0) {
      counts.failed++;
      console.error(
        `${tag}  FAILED  none of frame${numbers.join(", frame")} exist in ${framesDir}`
      );
      continue;
    }
    if (refs.length > MAX_REFS) {
      counts.failed++;
      console.error(`${tag}  FAILED  ${refs.length} frames for one shot, MiniMax takes at most ${MAX_REFS}`);
      continue;
    }

    const duration = fixedDuration ?? metadata.duration_sec;
    const seed = fixedSeed ?? 20261100 + metadata.block_index;
    const filenamePrefix =
      typeof args["filename-prefix"] === "string" && args["filename-prefix"]
        ? `${args["filename-prefix"]}/${blockId}`
        : `render/${projectDir}/${blockId}`;
    const text = buildPrompt(prompt, refs);

    if (verbose) {
      for (const [i, slot] of refs.entries()) {
        console.log(`slot ${i}  ${slot.kind.padEnd(9)} ${slot.entity_ref.padEnd(20)} ${slot.path}`);
      }
      console.log(
        `${blockId}  ${width}x${height}  ${fps}fps  ${duration}s  seed ${seed}  turbo ${turbo}  ` +
          `${refs.length}/${numbers.length} frames${missing.length ? `  (no frame${missing.join(", frame")})` : ""}`
      );
      console.log(`out ${filenamePrefix}_#####_.mp4   label ${labelProject} / ${blockId}`);
      console.log("\n--- compiled payload ---");
      console.log(JSON.stringify(compiled, null, 2));
    }

    if (dryRun) {
      counts.ready++;
      if (verbose) {
        console.log("\n--- prompt sent ---\n" + text);
      } else {
        console.log(`${tag}  ${refs.length} frames  seed ${seed}  ${duration}s  ready`);
      }
      continue;
    }

    let result;
    try {
      result = await runTool(
        "minimax_r2v",
        {
          prompt: text,
          reference_images: refs.map((s) => s.path),
          width,
          height,
          duration_sec: duration,
          fps,
          turbo,
          seed,
          filename_prefix: filenamePrefix
        },
        {
          label: { project: labelProject, block_id: blockId, refs: String(refs.length) },
          wait,
          timeout_sec: timeoutSec
        }
      );
    } catch (e) {
      counts.failed++;
      console.error(`${tag}  SUBMIT FAILED  ${e.message}`);
      continue;
    }

    counts.submitted++;
    if (verbose) {
      console.log(JSON.stringify(result, null, 2));
      if (result.status !== "success") {
        console.log(`\ncollect it later: node ../comfyui_mcp/cli.mjs --job ${result.prompt_id} --wait true`);
      }
    } else {
      const file = result.files?.[0]?.filename;
      console.log(
        `${tag}  ${refs.length} frames  seed ${seed}  ${duration}s  ${result.status}  ${result.prompt_id}` +
          (file ? `  ${file}` : "")
      );
    }
  }

  if (allBlocks) {
    const bits = [`${counts.submitted} submitted`, `${counts.skipped} skipped`, `${counts.failed} failed`];
    if (dryRun) bits.push(`${counts.ready} ready`);
    console.log(`\n${bits.join(", ")}`);
  }

  return counts.failed > 0 || counts.skipped > 0 ? 1 : 0;
}

try {
  process.exitCode = await main();
} catch (e) {
  console.error(e.message);
  process.exitCode = 2;
}
