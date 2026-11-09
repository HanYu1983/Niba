/**
 * Generate the reference plates for a story's entity inventory (Z-Image / `zit`).
 *
 *   node workspace/tools/generate_refs.mjs --story test_story3
 *   node workspace/tools/generate_refs.mjs --story test_story3 --only char_taylor,loc_riverbed
 *   node workspace/tools/generate_refs.mjs --story test_story3 --force
 *
 * One plate per entity, written to the story's asset root:
 *   explicit entity.reference.image  -> that folder (test_story3: refs/<entity>)
 *   otherwise                        -> refs/<story>/<entity>
 *
 * Reference plates are a *text anchor source* for t2v: the prompt copy stays consistent,
 * but nothing is bound into the render unless a segment switches to r2v.
 */
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { runTool } from "../../comfyui_mcp/runner.mjs";
import { boolArg, listArg, numArg, parseArgs } from "../lib/args.mjs";
import { entitiesOf, loadPlan } from "../lib/plan.mjs";
import { describeStory, loadStory, plateDir, platePrefix } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan, prompts: args.prompts, manifest: args.manifest });
const plan = loadPlan(story.planFile);

const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const cfg = story.config.refs ?? {};

const MODEL = cfg.model ?? "moodyRealMix_zitV7.safetensors";
const CLIP = cfg.clip ?? "qwen_3_4b.safetensors";
const VAE = cfg.vae ?? "ae.safetensors";
const SIZE = {
  character: { width: 832, height: 1024 },
  prop: { width: 1024, height: 1024 },
  location: { width: 1344, height: 768 },
  ...(cfg.sizes ?? {})
};
const QUALITY = { steps: 8, cfg: 1, shift: 3, sampler_name: "res_multistep", scheduler: "simple", ...(cfg.quality ?? {}) };

const only = listArg(args, "only");
const force = Boolean(args.force);
const dryRun = Boolean(args["dry-run"]);
const writeStatus = boolArg(args, "status", true);

const inventory = entitiesOf(plan).filter((e) => (only.length ? only.includes(e.id) : true));
const platesOnDisk = (entity) => {
  const dir = plateDir(story, entity);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => IMAGE_RE.test(f));
};

const todo = inventory.filter((e) => force || platesOnDisk(e).length === 0);

console.log(
  JSON.stringify(
    {
      ...describeStory(story),
      model: MODEL,
      inventory: inventory.length,
      already_present: inventory.length - todo.length,
      queued: todo.length,
      ...(dryRun ? { dry_run: true } : {})
    },
    null,
    2
  )
);

const report = [];
const flipped = [];

for (const [i, entity] of todo.entries()) {
  const size = SIZE[entity.kind] ?? SIZE.prop;
  const prefix = platePrefix(story, entity);
  const prompt = entity.reference?.prompt;
  const tag = `[${i + 1}/${todo.length}] ${entity.id}`;

  if (!prompt) {
    report.push({ id: entity.id, kind: entity.kind, status: "skipped", reason: "no reference.prompt" });
    console.log(`${tag} SKIP no reference.prompt`);
    continue;
  }
  if (prefix.includes(":") || prefix.startsWith("/")) {
    report.push({ id: entity.id, kind: entity.kind, status: "skipped", reason: "reference.image is absolute" });
    console.log(`${tag} SKIP reference.image is absolute; set a path relative to the asset root`);
    continue;
  }
  if (dryRun) {
    console.log(`${tag} ${size.width}x${size.height} -> ${prefix}/plate`);
    continue;
  }

  const started = Date.now();
  try {
    const result = await runTool(
      "z_image_t2i",
      {
        prompt,
        width: size.width,
        height: size.height,
        steps: numArg(args, "steps", QUALITY.steps),
        cfg: QUALITY.cfg,
        shift: QUALITY.shift,
        sampler_name: QUALITY.sampler_name,
        scheduler: QUALITY.scheduler,
        unet_name: MODEL,
        clip_name: CLIP,
        vae_name: VAE,
        filename_prefix: `${prefix}/plate`,
        seed: args.seed !== undefined ? numArg(args, "seed", null) : undefined
      },
      { label: { project: story.name, plan: story.planBase, entity_id: entity.id, model: MODEL }, output_dir: story.assetRoot, wait: true, timeout_sec: 900 }
    );

    const files = (result.files ?? []).map((f) => f.path);
    report.push({
      id: entity.id,
      kind: entity.kind,
      size: `${size.width}x${size.height}`,
      status: result.status,
      seconds: Math.round((Date.now() - started) / 100) / 10,
      files,
      ...(result.prompt_id ? { prompt_id: result.prompt_id } : {})
    });
    if (files.length) flipped.push(entity.id);
    console.log(`${tag} ${result.status} ${report.at(-1).seconds}s ${files[0] ?? ""}`);
  } catch (e) {
    report.push({ id: entity.id, kind: entity.kind, status: "failed", error: e.message });
    console.error(`${tag} FAILED ${e.message}`);
  }
}

/* ---------------------------------------------------------------- plan statuses */

if (writeStatus && !dryRun && flipped.length) {
  const byId = new Set(flipped);
  for (const [list, kind] of [
    [plan.entities?.characters, "character"],
    [plan.entities?.props, "prop"],
    [plan.entities?.locations, "location"]
  ]) {
    for (const e of list ?? []) {
      if (!byId.has(e.id)) continue;
      const prefix = platePrefix(story, e);
      e.reference = { ...(e.reference ?? {}), image: e.reference?.image ?? prefix, status: "ready" };
    }
  }
  writeFileSync(story.planFile, JSON.stringify(plan, null, 2) + "\n", "utf8");
}

const reportFile = resolve(story.dir, "refs_report.json");
if (!dryRun) {
  writeFileSync(
    reportFile,
    JSON.stringify(
      {
        model: MODEL,
        asset_root: story.assetRoot,
        generated_at: new Date().toISOString(),
        statuses_flipped: flipped.length,
        runs: report
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
}

const failed = report.filter((r) => r.status !== "success" && r.status !== "skipped");
console.log(JSON.stringify({ finished: report.length, failed: failed.map((f) => f.id), report: dryRun ? null : reportFile }, null, 2));
process.exit(failed.length ? 1 : 0);
