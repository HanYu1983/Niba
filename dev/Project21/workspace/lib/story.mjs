/**
 * One story = one folder. Code lives in workspace/, data lives in the story folder.
 *
 *   <story>/
 *     story.json          optional; everything in it has a default
 *     plan.ch0.json       the stage-1 plan (entities + segments)
 *     prompts/            seg_001.t2v.txt, seg_002.r2v.txt, seg_003.i2v.txt
 *     output/             render/, video/ (large artifacts, gitignored)
 *     render_manifest.json  written by the render tools
 *
 * Nothing below hardcodes a story name: every path is resolved from `--story <dir>`
 * (default: the current directory).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, isAbsolute, resolve } from "node:path";

import { comfyConfig } from "./comfy.mjs";

const PROMPT_MODES = ["r2v", "t2v", "i2v"];

/**
 * Resolve a story folder into absolute paths.
 *
 * @param {{ story?: string, plan?: string }} opts
 */
export function loadStory(opts = {}) {
  const dir = resolve(String(opts.story ?? "."));
  if (!existsSync(dir)) throw new Error(`story folder not found: ${dir}`);

  const configFile = resolve(dir, "story.json");
  const config = existsSync(configFile) ? JSON.parse(readFileSync(configFile, "utf8")) : {};

  const planFile = resolvePlanFile(dir, config, opts.plan);
  const promptsDir = resolve(dir, config.prompts ?? "prompts");
  const outputDir = resolve(dir, config.output ?? "output");
  const manifestFile = resolve(dir, config.manifest ?? "render_manifest.json");
  const name = config.name ?? basename(dir);
  const planBase = basename(planFile).replace(/\.json$/i, "");

  // Refs are a shared asset cache keyed by entity id, because the t2i plates live under the
  // ComfyUI download root. A story can still point at its own folder with refs.root.
  const comfy = comfyConfig();
  const assetRoot = config.refs?.root ? resolve(dir, config.refs.root) : comfy.outputDir;

  return {
    dir,
    name,
    config,
    configFile: existsSync(configFile) ? configFile : null,
    planFile,
    planBase,
    promptsDir,
    outputDir,
    manifestFile,
    renderDir: resolve(outputDir, "render", planBase),
    videoDir: resolve(outputDir, "video"),
    assetRoot,
    comfy,
    render: { width: 352, height: 608, fps: 24, turbo: true, ...(config.render ?? {}) },
    subtitles: { lang: "zh-Hant", rate: 6.2, maxLine: 15, ...(config.subtitles ?? {}) }
  };
}

function resolvePlanFile(dir, config, planArg) {
  if (planArg && planArg !== true) return resolve(String(planArg));
  if (config.plan) return resolve(dir, config.plan);

  const candidates = readdirSync(dir)
    .filter((f) => /^plan.*\.json$/i.test(f))
    .sort();
  if (candidates.length === 0) {
    throw new Error(`no plan json in ${dir} — pass --plan, or set "plan" in story.json`);
  }
  const preferred = candidates.includes("plan.ch0.json") ? "plan.ch0.json" : candidates[0];
  return resolve(dir, preferred);
}

/** Absolute folder holding this entity's plates. */
export function plateDir(story, entity) {
  const rel = entity.reference?.image;
  if (rel) return isAbsolute(rel) ? rel : resolve(story.assetRoot, rel);
  // New stories get their own namespace so `char_hero` never collides across stories.
  return resolve(story.assetRoot, "refs", story.name, entity.id);
}

/**
 * Path to write a plate into, relative to the ComfyUI download root.
 * Explicit `entity.reference.image` wins (that is what test_story3 recorded); otherwise
 * fall back to the per-story namespace.
 */
export function platePrefix(story, entity) {
  const rel = entity.reference?.image;
  if (rel && !isAbsolute(rel)) return rel.replace(/\\/g, "/");
  if (rel) return rel; // absolute: the caller must handle it; generation refuses below
  return `refs/${story.name}/${entity.id}`;
}

/** Which prompt file a segment has, and in which format. */
export function promptFileFor(story, segId, mode) {
  if (mode && mode !== true) {
    const file = resolve(story.promptsDir, `${segId}.${mode}.txt`);
    // 不存在就找其它的
    const exists = existsSync(file)
    if(exists != true){
      for (const m of PROMPT_MODES) {
        const file = resolve(story.promptsDir, `${segId}.${m}.txt`);
        if (existsSync(file)) return { mode: m, file, exists: true };
      }
    }
    return { mode, file, exists: existsSync(file) };
  }
  for (const m of PROMPT_MODES) {
    const file = resolve(story.promptsDir, `${segId}.${m}.txt`);
    if (existsSync(file)) return { mode: m, file, exists: true };
  }
  return { mode: null, file: resolve(story.promptsDir, `${segId}.t2v.txt`), exists: false };
}

/** Mode implied by the prompt's own fields, as a second opinion on the file extension. */
export function modeFromText(text) {
  if (/^\s*subject_definitions\s*:/im.test(text)) return "r2v";
  if (/^\s*integrated_multimodal_description\s*:/im.test(text)) return "t2v";
  return "unknown";
}

/** Newest `*_full_*.mp4` (or the only mp4) in output/video. */
export function newestFilm(story) {
  if (!existsSync(story.videoDir)) return null;
  const files = readdirSync(story.videoDir)
    .filter((f) => /\.mp4$/i.test(f))
    .map((f) => {
      const path = resolve(story.videoDir, f);
      // A hand-made duplicate ("… - 複製.mp4", "… copy.mp4") is newer than the real film but
      // is not the film the subtitles should be named after.
      const copy = /(?:copy|複製|副本)/i.test(f) ? 0 : 1;
      return { path, copy, mtime: statSync(path).mtimeMs };
    })
    .sort((a, b) => b.copy - a.copy || b.mtime - a.mtime);
  if (!files.length) return null;
  const full = files.filter((x) => /_full_/i.test(basename(x.path)));
  return (full[0] ?? files[0]).path;
}

export function describeStory(story) {
  return {
    story: story.dir,
    name: story.name,
    plan: story.planFile,
    prompts: story.promptsDir,
    output: story.outputDir,
    manifest: story.manifestFile,
    assets: story.assetRoot,
    comfyui: story.comfy.url
  };
}
