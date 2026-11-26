/**
 * Generate reference plates from a plain story.json `references` list (z-image turbo).
 *
 *   node workspace/tools/generate_refs_from_json.mjs --json ./test_story5/story.json --output ./test_story5/output/refs
 *   node workspace/tools/generate_refs_from_json.mjs --json ./test_story5/story.json --id ref_xin_er --output ./test_story5/output/refs
 *   node workspace/tools/generate_refs_from_json.mjs --json ./test_story5/story.json --id ref_xin_er,ref_mr_liang --output ./test_story5/output/refs --force
 *
 * `--id` may be repeated or comma separated. Without it every `references` entry is generated.
 * Each result is downloaded to `<output>/<reference.id>/`, e.g.
 *   ./test_story5/output/refs/ref_xin_er/plate_00001.png
 *
 * Options: --json <file> (or the first positional arg), --id <id...>, --output <dir>,
 *          --force, --dry-run, --width, --height, --steps, --cfg, --shift, --seed,
 *          --model, --clip, --vae, --timeout_sec, --no-report.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { runTool } from "../../comfyui_mcp/runner.mjs";
import { boolArg, listArg, numArg, parseArgs, usage } from "../lib/args.mjs";

const IMAGE_RE = /\.(png|jpe?g|webp)$/i;

const args = parseArgs();
const jsonArg = args.json ?? args._[0];
const outputArg = args.output ?? args.out;

if (!jsonArg || jsonArg === true) {
  usage("missing --json <story.json>", [
    "usage: node workspace/tools/generate_refs_from_json.mjs --json <story.json> --output <dir> [--id <ref_id>]",
    "example: node workspace/tools/generate_refs_from_json.mjs --json ./test_story5/story.json --output ./test_story5/output/refs"
  ]);
}
if (!outputArg || outputArg === true) {
  usage("missing --output <dir>", ["the download root is required; images land in <output>/<reference.id>/"]);
}

const jsonFile = resolve(String(jsonArg));
const outputRoot = resolve(String(outputArg));

let story;
try {
  story = JSON.parse(readFileSync(jsonFile, "utf8"));
} catch (e) {
  usage(`cannot read ${jsonFile}: ${e.message}`, ["--json must point to a readable JSON file"]);
}
if (!Array.isArray(story?.references)) {
  usage(`${jsonFile} has no references[] array`, ["expected a top-level \"references\": [{ id, prompt }]"]);
}
const refsConfig = story.refs ?? {}; // story.json overrides defaults; explicit CLI flags win

const requestedIds = listArg(args, "id");
const availableIds = story.references.map((r) => r?.id).filter(Boolean);
const unknown = requestedIds.filter((id) => !availableIds.includes(id));
if (unknown.length) {
  usage(`unknown reference id(s): ${unknown.join(", ")}`, [`available: ${availableIds.join(", ") || "(none)"}`]);
}

const targets = requestedIds.length ? story.references.filter((r) => requestedIds.includes(r.id)) : story.references;
const force = boolArg(args, "force", false);
const dryRun = boolArg(args, "dry-run", false);
const writeReport = boolArg(args, "report", true);

const MODEL = String(args.model ?? refsConfig.model ?? "moodyRealMix_zitV7.safetensors");
const CLIP = String(args.clip ?? refsConfig.clip ?? "qwen_3_4b.safetensors");
const VAE = String(args.vae ?? refsConfig.vae ?? "ae.safetensors");
const WIDTH = numArg(args, "width", 832);
const HEIGHT = numArg(args, "height", 1024);
const STEPS = numArg(args, "steps", 8);
const SHIFT = numArg(args, "shift", 3);
const TIMEOUT = numArg(args, "timeout_sec", 900);
const SEED = args.seed === undefined ? undefined : numArg(args, "seed", null);
const CFG = numArg(args, "cfg", 1);

/** Keep ids as simple folder names; never let a JSON id escape the output root. */
function folderFor(id) {
  const safe = String(id).replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "");
  if (!safe || safe === "." || safe === "..") throw new Error(`unsafe reference id: ${JSON.stringify(id)}`);
  return resolve(outputRoot, safe);
}

const existingPlates = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => IMAGE_RE.test(f)) : [];

const todo = [];
const skipped = [];
for (const ref of targets) {
  const id = ref?.id;
  if (!id || typeof ref.prompt !== "string" || !ref.prompt.trim()) {
    skipped.push({ id: id ?? null, reason: "missing id or prompt" });
    continue;
  }
  const destDir = folderFor(id);
  if (!force && existingPlates(destDir).length) {
    skipped.push({ id, reason: "already generated", dir: destDir });
    continue;
  }
  todo.push({ ref, destDir });
}

console.log(
  JSON.stringify(
    {
      json: jsonFile,
      output: outputRoot,
      references: targets.length,
      queued: todo.length,
      skipped: skipped.length,
      model: MODEL,
      size: `${WIDTH}x${HEIGHT}`,
      ...(dryRun ? { dry_run: true } : {})
    },
    null,
    2
  )
);

if (dryRun) {
  for (const { ref, destDir } of todo) console.log(`${ref.id} -> ${destDir}/plate`);
  process.exitCode = skipped.length ? 1 : 0;
} else {
  mkdirSync(outputRoot, { recursive: true });

  const report = [];
  for (const [i, { ref, destDir }] of todo.entries()) {
    const tag = `[${i + 1}/${todo.length}] ${ref.id}`;
    mkdirSync(destDir, { recursive: true });
    const started = Date.now();
    try {
      const result = await runTool(
        "z_image_t2i",
        {
          prompt: ref.prompt.trim(),
          width: WIDTH,
          height: HEIGHT,
          steps: STEPS,
          cfg: CFG,
          shift: SHIFT,
          sampler_name: "res_multistep",
          scheduler: "simple",
          unet_name: MODEL,
          clip_name: CLIP,
          vae_name: VAE,
          filename_prefix: "plate",
          seed: SEED
        },
        {
          label: { project: "story_refs", json: jsonFile, ref_id: ref.id, model: MODEL },
          output_dir: destDir,
          wait: true,
          timeout_sec: TIMEOUT
        }
      );
      const files = (result.files ?? []).map((f) => f.path);
      const row = {
        id: ref.id,
        status: result.status,
        dir: destDir,
        seconds: Math.round((Date.now() - started) / 100) / 10,
        files,
        ...(result.prompt_id ? { prompt_id: result.prompt_id } : {})
      };
      report.push(row);
      console.log(`${tag} ${result.status} ${row.seconds}s ${files[0] ?? ""}`);
    } catch (e) {
      report.push({ id: ref.id, status: "failed", dir: destDir, error: e.message });
      console.error(`${tag} FAILED ${e.message}`);
    }
  }

  const failed = report.filter((r) => r.status !== "success");
  if (writeReport) {
    const reportFile = resolve(outputRoot, "refs_report.json");
    writeFileSync(
      reportFile,
      JSON.stringify(
        { json: jsonFile, generated_at: new Date().toISOString(), model: MODEL, skipped, runs: report },
        null,
        2
      ) + "\n",
      "utf8"
    );
    console.log(JSON.stringify({ finished: report.length, failed: failed.map((f) => f.id), report: reportFile }, null, 2));
  } else {
    console.log(JSON.stringify({ finished: report.length, failed: failed.map((f) => f.id) }, null, 2));
  }
  // process.exitCode, not process.exit(): pending fetch sockets can abort stdout flushing on Windows.
  process.exitCode = failed.length || skipped.length ? 1 : 0;
}
