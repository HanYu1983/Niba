/**
 * Generate every reference plate in the inventory with moodyRealMix_zitV7.
 *
 *   node generate_refs.mjs             # everything still missing
 *   node generate_refs.mjs char_taylor loc_riverbed_wreck
 *   node generate_refs.mjs --force     # re-render plates that already exist
 *
 * One plate per entity, written to <comfyui.output_dir>/refs/<entity_id>/ by ComfyUI.
 * The run is sequential on purpose: the box has a single GPU and the plates are small.
 * Results land in refs_report.json; the entity statuses in data_entities.mjs flip to
 * "ready" for every id that now has a file on disk.
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { entities } from "./data_entities.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT = resolve(HERE, "..");
const CLI = resolve(PROJECT, "comfyui_mcp/cli.mjs");
const METADATA = resolve(PROJECT, "comfyui_mcp/metadata.json");
const REPORT = resolve(HERE, "refs_report.json");

const MODEL = "moodyRealMix_zitV7.safetensors";
const CLIP = "qwen_3_4b.safetensors";
const VAE = "ae.safetensors";

/** Portrait for people, square for objects, 16:9 for rooms. */
const SIZE = {
  character: { width: 832, height: 1024 },
  prop: { width: 1024, height: 1024 },
  location: { width: 1344, height: 768 }
};

const outputDir = JSON.parse(readFileSync(METADATA, "utf8")).comfyui.output_dir;

const argv = process.argv.slice(2);
const force = argv.includes("--force");
const only = argv.filter((a) => !a.startsWith("--"));

const inventory = [
  ...entities.characters.map((e) => ({ ...e, kind: "character" })),
  ...entities.props.map((e) => ({ ...e, kind: "prop" })),
  ...entities.locations.map((e) => ({ ...e, kind: "location" }))
].filter((e) => (only.length ? only.includes(e.id) : true));

function plates(id) {
  const dir = resolve(outputDir, "refs", id);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
}

function runTool(tool, args) {
  return new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [CLI, tool, ...args], { cwd: PROJECT });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("close", (code) => resolvePromise({ code, out, err }));
  });
}

const report = [];
const todo = inventory.filter((e) => force || plates(e.id).length === 0);

console.log(
  JSON.stringify(
    {
      model: MODEL,
      output_dir: outputDir,
      inventory: inventory.length,
      already_present: inventory.length - todo.length,
      queued: todo.length
    },
    null,
    2
  )
);

for (const [i, entity] of todo.entries()) {
  const { width, height } = SIZE[entity.kind];
  const args = [
    "--prompt", entity.reference.prompt,
    "--width", String(width),
    "--height", String(height),
    "--steps", "8",
    "--cfg", "1",
    "--shift", "3",
    "--sampler_name", "res_multistep",
    "--scheduler", "simple",
    "--unet_name", MODEL,
    "--clip_name", CLIP,
    "--vae_name", VAE,
    "--filename_prefix", `refs/${entity.id}/plate`,
    "--wait", "true",
    "--timeout_sec", "900",
    "--download", "true",
    "--label", JSON.stringify({ project: "test_story3/plan.ch0.json", entity_id: entity.id, model: MODEL })
  ];

  const started = Date.now();
  const { code, out, err } = await runTool("z_image_t2i", args);
  let parsed = null;
  try {
    parsed = JSON.parse(out);
  } catch {
    /* keep raw below */
  }

  const files = parsed?.files?.map((f) => f.path) ?? [];
  const entry = {
    id: entity.id,
    kind: entity.kind,
    size: `${width}x${height}`,
    status: parsed?.status ?? (code === 0 ? "unknown" : "failed"),
    seconds: Math.round((Date.now() - started) / 100) / 10,
    files,
    ...(parsed?.prompt_id ? { prompt_id: parsed.prompt_id } : {}),
    ...(parsed?.status === "success" ? {} : { stderr: err.trim().slice(0, 800), stdout: out.trim().slice(0, 800) })
  };
  report.push(entry);
  console.log(`[${i + 1}/${todo.length}] ${entity.id} ${entry.status} ${entry.seconds}s ${files[0] ?? ""}`);
}

/* ------------------------------------------------------------------ statuses */

const generated = new Set(
  inventory.filter((e) => plates(e.id).length > 0).map((e) => e.id)
);

const entitiesFile = resolve(HERE, "data_entities.mjs");
let source = readFileSync(entitiesFile, "utf8");
let flipped = 0;
for (const id of generated) {
  const pattern = new RegExp(`(id: "${id}"[\\s\\S]*?status: )"to_generate"`);
  if (pattern.test(source)) {
    source = source.replace(pattern, '$1"ready"');
    flipped += 1;
  }
}
writeFileSync(entitiesFile, source, "utf8");

writeFileSync(
  REPORT,
  JSON.stringify(
    {
      model: MODEL,
      output_dir: outputDir,
      generated_at: new Date().toISOString(),
      total_plates_on_disk: generated.size,
      statuses_flipped: flipped,
      runs: report
    },
    null,
    2
  ) + "\n",
  "utf8"
);

const failed = report.filter((r) => r.status !== "success");
console.log(JSON.stringify({ finished: report.length, failed: failed.map((f) => f.id), statuses_flipped: flipped }, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
