/**
 * Server-side metadata: paths that belong to the machine, not to the story.
 *
 * The project JSON keeps `reference.image` as a RELATIVE folder (`refs/char_judge_xu`)
 * so the story can be moved around. Where ComfyUI actually drops its output is a local
 * fact, so it lives here:
 *
 *   metadata.json
 *     { "version": "1.0", "comfyui": { "output_dir": "D:\\ComfyUI\\output" } }
 *
 * `entity_prompt` joins the two: `output_dir` + `reference.image` => absolute folder.
 * Override the file location with VIDEO_COMPILER_METADATA (the smoke test does this).
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { CompilerError } from "./compiler.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_METADATA_FILE = resolve(HERE, "metadata.json");

export const EMPTY_METADATA = { version: "1.0", comfyui: { output_dir: null } };

/** Where the metadata lives: env override, else metadata.json next to this file. */
export function metadataFile() {
  const override = process.env.VIDEO_COMPILER_METADATA;
  return typeof override === "string" && override.trim() !== "" ? resolve(override) : DEFAULT_METADATA_FILE;
}

/** Read metadata. A missing file is not an error: it means "nothing configured yet". */
export function readMetadata(file = metadataFile()) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return { file, exists: false, data: structuredClone(EMPTY_METADATA) };
    throw new CompilerError(`cannot read metadata file: ${e.code ?? e.message}`, { file });
  }
  try {
    const data = JSON.parse(text);
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("metadata must be a JSON object");
    }
    return { file, exists: true, data };
  } catch (e) {
    throw new CompilerError(`invalid JSON in metadata file: ${e.message}`, { file });
  }
}

/** `comfyui.output_dir` as an absolute path, or null when not configured. */
export function comfyuiOutputDir(data) {
  const v = data?.comfyui?.output_dir;
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string") throw new CompilerError("metadata.comfyui.output_dir must be a string or null", { got: v });
  if (!isAbsolute(v)) {
    throw new CompilerError("metadata.comfyui.output_dir must be an absolute path", { got: v });
  }
  return resolve(v);
}

function assertOutputDir(v) {
  if (v === null || v === undefined) return;
  if (typeof v !== "string" || v.trim() === "") {
    throw new CompilerError("comfyui_output_dir must be a non-empty absolute path, or null to clear it", { got: v });
  }
  if (!isAbsolute(v)) {
    throw new CompilerError("comfyui_output_dir must be an absolute path", { got: v });
  }
}

/** One-level-deep merge, enough for `{ comfyui: { … } }` without clobbering other keys. */
function mergeMetadata(base, patch) {
  const out = structuredClone(base);
  for (const [key, value] of Object.entries(patch ?? {})) {
    const isNested = value !== null && typeof value === "object" && !Array.isArray(value);
    const baseIsNested = out[key] !== null && typeof out[key] === "object" && !Array.isArray(out[key]);
    out[key] = isNested && baseIsNested ? { ...out[key], ...structuredClone(value) } : structuredClone(value);
  }
  return out;
}

/**
 * Patch metadata.json (`comfyui_output_dir` is the one field the tools set). The folder is
 * created when `createDir` is not false, so ComfyUI has somewhere to write.
 */
export function updateMetadata(patch, opts = {}) {
  const file = opts.file ?? metadataFile();
  const { data } = readMetadata(file);

  const clean = {};
  if (patch.comfyui_output_dir !== undefined) {
    assertOutputDir(patch.comfyui_output_dir);
    clean.comfyui = { output_dir: patch.comfyui_output_dir };
  }
  if (patch.version !== undefined) clean.version = patch.version;
  if (Object.keys(clean).length === 0) {
    throw new CompilerError("nothing to update: pass comfyui_output_dir");
  }

  const next = mergeMetadata(data, clean);
  const dir = comfyuiOutputDir(next);

  let created = false;
  if (dir && opts.createDir !== false && !existsSync(dir)) {
    try {
      mkdirSync(dir, { recursive: true });
      created = true;
    } catch (e) {
      throw new CompilerError(`cannot create comfyui.output_dir: ${e.code ?? e.message}`, { dir });
    }
  }

  writeFileSync(file, JSON.stringify(next, null, 2) + "\n", "utf8");
  return { file, data: next, comfyui_output_dir: dir, created };
}

/**
 * Absolute folder for one entity's reference plate.
 *
 *   absolute `reference.image` -> used as-is
 *   relative + metadata        -> comfyui.output_dir / <reference.image>
 *   relative, no metadata      -> sibling of the project file (portable fallback)
 *
 * Returns null only when an inline project has no metadata to anchor to.
 */
export function locateReference(projectFile, image) {
  if (typeof image !== "string" || image.trim() === "") return null;

  if (isAbsolute(image)) {
    return { dir: resolve(image), source: "absolute" };
  }

  const { file, data } = readMetadata();
  const root = comfyuiOutputDir(data);
  if (root) return { dir: resolve(root, image), source: "metadata", metadata_file: file };

  if (!projectFile) return null;
  return { dir: resolve(dirname(projectFile), image), source: "project", metadata_file: file };
}

/** Plate files already sitting in a reference folder, newest first. */
const IMAGE_EXT = /\.(png|jpe?g|webp|avif)$/i;

export function listPlates(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const plates = [];
  for (const entry of entries) {
    if (!entry.isFile() || !IMAGE_EXT.test(entry.name)) continue;
    let mtime = 0;
    try {
      mtime = statSync(resolve(dir, entry.name)).mtimeMs;
    } catch {
      // keep 0
    }
    plates.push({ name: entry.name, mtime });
  }
  return plates.sort((a, b) => b.mtime - a.mtime).map((p) => p.name);
}
