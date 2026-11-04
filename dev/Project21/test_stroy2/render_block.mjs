#!/usr/bin/env node
/**
 * Compile one block and hand it to ComfyUI's MiniMax H3 r2v.
 *
 *   node render_block.mjs momotaro.json block_035_victory_stand
 *   node render_block.mjs momotaro.json block_035_victory_stand --width 960 --height 544
 *   node render_block.mjs momotaro.json block_002_dock_zhao --wait
 *   node render_block.mjs momotaro.json block_035 --dry-run
 *
 * `block` accepts the full id or an unambiguous prefix. The block is compiled with
 * gen_video/compiler.mjs, and EVERY plate the block needs is uploaded — scene first, then
 * characters, then props — because identity survives only if the plate is actually attached.
 * The prompt opens with a slot legend so the model knows which plate is which.
 *
 * Options (all optional):
 *   --width 608            --height 352          generation size, multiples of 32
 *   --duration 4           seconds; default = the block's own duration
 *   --fps 24               --seed 20261166        default = 20261100 + block index
 *   --no-turbo             20 steps instead of the 4-step reference LoRA
 *   --wait                 block until the file is downloaded (default: return prompt_id)
 *   --timeout-sec 900      only meaningful with --wait
 *   --output-dir <dir>     plate root; default = comfyui.output_dir from gen_video/metadata.json
 *   --filename-prefix <p>  default render/<project>/<block_id>
 *   --label-project <p>    ledger tag; default = the project file name without .json
 *   --allow-missing-refs   submit even when an entity has no plate (default: refuse)
 *   --dry-run              print the prompt + slot table, submit nothing
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { compileBlock, CompilerError } from "../gen_video/compiler.mjs";
import { runTool } from "../comfyui_mcp/runner.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.dirname(HERE);
const METADATA_FILE = path.join(PROJECT_ROOT, "gen_video", "metadata.json");
const MAX_REFS = 9;

const USAGE = `usage: node render_block.mjs <project.json> <block_id|prefix> [options]

  --width 608 --height 352   generation size (multiples of 32)
  --duration 4 --fps 24      default: the block's own duration / 24
  --seed 20261166            default: 20261100 + block index
  --no-turbo                 use the 20-step sampler
  --wait                     block until the mp4 is downloaded
  --dry-run                  print prompt + reference slots, submit nothing
  --allow-missing-refs       submit even if an entity plate is missing
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

function plateRoot(args) {
  if (typeof args["output-dir"] === "string") return path.resolve(args["output-dir"]);
  try {
    const metadata = JSON.parse(readFileSync(METADATA_FILE, "utf8"));
    const dir = metadata?.comfyui?.output_dir;
    if (typeof dir === "string" && dir.trim() !== "") return path.resolve(dir);
  } catch {
    /* fall through to the repo default */
  }
  return path.join(PROJECT_ROOT, "output");
}

/** entity.reference.image is a folder (ComfyUI names its own files); take the newest plate in it. */
function newestPlate(root, entity) {
  const ref = entity?.reference?.image;
  if (typeof ref !== "string" || ref.trim() === "") return null;
  const target = path.resolve(root, ref);
  if (!existsSync(target)) return { entity: entity.id, path: null, why: `missing folder ${target}` };
  if (statSync(target).isFile()) return { entity: entity.id, path: target };

  const files = readdirSync(target)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .map((f) => ({ file: path.join(target, f), time: statSync(path.join(target, f)).mtimeMs }))
    .sort((a, b) => b.time - a.time);
  if (files.length === 0) return { entity: entity.id, path: null, why: `no image in ${target}` };
  return { entity: entity.id, path: files[0].file };
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
  if (!projectArg || !blockArg) {
    console.error(USAGE);
    return 1;
  }

  const projectFile = resolveProject(projectArg);
  const project = JSON.parse(readFileSync(projectFile, "utf8"));
  const blockId = resolveBlock(project, blockArg);

  let compiled;
  try {
    compiled = compileBlock(project, blockId);
  } catch (e) {
    if (e instanceof CompilerError) throw new Error(`cannot compile ${blockId}: ${e.message}`);
    throw e;
  }
  const { prompt, metadata } = compiled;

  // Slot order: scene, then characters, then props — same order the legend prints.
  const slots = [
    ...metadata.entities.locations.map((e) => ({ kind: "scene", entity_ref: e.id, entity: e })),
    ...metadata.entities.characters.map((e) => ({ kind: "character", entity_ref: e.id, entity: e })),
    ...metadata.entities.props.map((e) => ({ kind: "prop", entity_ref: e.id, entity: e }))
  ];

  const root = plateRoot(args);
  const missing = [];
  for (const slot of slots) {
    const found = newestPlate(root, slot.entity);
    if (!found || !found.path) {
      missing.push(`${slot.entity_ref}: ${found?.why ?? "no reference.image"}`);
      slot.path = null;
    } else {
      slot.path = found.path;
    }
  }
  if (missing.length > 0) {
    console.error(`missing reference plates (${root}):\n  ${missing.join("\n  ")}`);
    if (args["allow-missing-refs"] !== "true") {
      console.error("\nrefusing to submit without them; pass --allow-missing-refs to go ahead anyway");
      return 1;
    }
  }

  const refs = slots.filter((s) => s.path);
  if (refs.length === 0) throw new Error("no reference plate at all: r2v needs at least one image");
  if (refs.length > MAX_REFS) {
    throw new Error(`${refs.length} plates for one shot, MiniMax takes at most ${MAX_REFS}`);
  }

  const width = number(args.width, 608, "width");
  const height = number(args.height, 352, "height");
  const duration = number(args.duration, metadata.duration_sec, "duration");
  const fps = number(args.fps, 24, "fps");
  const seed = number(args.seed, 20261100 + metadata.block_index, "seed");
  const projectDir = path.basename(path.dirname(projectFile));
  const filenamePrefix =
    (typeof args["filename-prefix"] === "string" && args["filename-prefix"]) || `render/${projectDir}/${blockId}`;
  const labelProject = typeof args["label-project"] === "string" ? args["label-project"] : projectDir;
  const text = buildPrompt(prompt, refs);

  for (const [i, slot] of refs.entries()) {
    console.log(`slot ${i}  ${slot.kind.padEnd(9)} ${slot.entity_ref.padEnd(20)} ${slot.path}`);
  }
  console.log(
    `${blockId}  ${width}x${height}  ${fps}fps  ${duration}s  seed ${seed}  turbo ${args["no-turbo"] !== "true"}  ${refs.length} refs`
  );
  console.log(`out ${filenamePrefix}_#####_.mp4   label ${labelProject} / ${blockId}`);

  if (args["dry-run"] === "true") {
    console.log("\n--- prompt ---\n" + text);
    return 0;
  }

  const result = await runTool(
    "minimax_r2v",
    {
      prompt: text,
      reference_images: refs.map((s) => s.path),
      width,
      height,
      duration_sec: duration,
      fps,
      turbo: args["no-turbo"] !== "true",
      seed,
      filename_prefix: filenamePrefix
    },
    {
      label: {
        project: labelProject,
        block_id: blockId,
        refs: String(refs.length)
      },
      wait: args.wait === "true",
      timeout_sec: number(args["timeout-sec"], 900, "timeout-sec")
    }
  );

  console.log(JSON.stringify(result, null, 2));
  if (result.status !== "success") {
    console.log(`\ncollect it later: node ../comfyui_mcp/cli.mjs --job ${result.prompt_id} --wait true`);
  }
  return 0;
}

try {
  process.exitCode = await main();
} catch (e) {
  console.error(e.message);
  process.exitCode = 2;
}
