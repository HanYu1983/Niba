/**
 * Server-side metadata: the ComfyUI box, not the story.
 *
 *   metadata.json
 *   {
 *     "version": "1.0",
 *     "comfyui": {
 *       "url": "http://100.106.154.88:8000",
 *       "output_dir": "D:\\han\\Niba\\dev\\Project21\\output",
 *       "timeout_sec": 900,
 *       "client_id": "comfyui-mcp"
 *     }
 *   }
 *
 * `output_dir` is a LOCAL download root: ComfyUI runs on another machine, so results are
 * pulled back over HTTP and mirrored under this folder (remote subfolder is preserved).
 * Override the file location with COMFYUI_MCP_METADATA (the smoke test does this).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_METADATA_FILE = resolve(HERE, "metadata.json");

export const EMPTY_METADATA = {
  version: "1.0",
  comfyui: { url: null, output_dir: null, timeout_sec: 900, client_id: "comfyui-mcp" }
};

export class MetadataError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "MetadataError";
    this.details = details;
  }
}

/** Where the metadata lives: env override, else metadata.json next to this file. */
export function metadataFile() {
  const override = process.env.COMFYUI_MCP_METADATA;
  return typeof override === "string" && override.trim() !== "" ? resolve(override) : DEFAULT_METADATA_FILE;
}

/** Read metadata. A missing file is not an error: it means "nothing configured yet". */
export function readMetadata(file = metadataFile()) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return { file, exists: false, data: structuredClone(EMPTY_METADATA) };
    throw new MetadataError(`cannot read metadata file: ${e.code ?? e.message}`, { file });
  }
  try {
    const parsed = JSON.parse(text);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("metadata must be a JSON object");
    }
    return { file, exists: true, data: parsed };
  } catch (e) {
    throw new MetadataError(`invalid JSON in metadata file: ${e.message}`, { file });
  }
}

function normalizeUrl(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new MetadataError("comfyui.url must be a non-empty http(s) URL, or null to clear it", { got: value });
  }
  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    throw new MetadataError("comfyui.url is not a valid URL", { got: value });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new MetadataError("comfyui.url must be http or https", { got: value });
  }
  return parsed.origin + parsed.pathname.replace(/\/+$/, "");
}

/**
 * Settings the runtime needs, all optional:
 *   url         ComfyUI base URL (null = not configured)
 *   outputDir   absolute local download root (null = <cwd>/output)
 *   timeoutSec  default wait budget for one job
 *   clientId    how ComfyUI labels our submissions
 */
export function comfyuiSettings(data) {
  const c = data?.comfyui ?? {};

  let url = null;
  if (c.url !== undefined && c.url !== null && c.url !== "") url = normalizeUrl(c.url);

  let outputDir = null;
  if (c.output_dir !== undefined && c.output_dir !== null && c.output_dir !== "") {
    if (typeof c.output_dir !== "string") {
      throw new MetadataError("comfyui.output_dir must be a string or null", { got: c.output_dir });
    }
    if (!isAbsolute(c.output_dir)) {
      throw new MetadataError("comfyui.output_dir must be an absolute path", { got: c.output_dir });
    }
    outputDir = resolve(c.output_dir);
  }

  const timeoutSec =
    typeof c.timeout_sec === "number" && Number.isFinite(c.timeout_sec) && c.timeout_sec > 0 ? c.timeout_sec : 900;
  const clientId = typeof c.client_id === "string" && c.client_id.trim() !== "" ? c.client_id.trim() : "comfyui-mcp";

  return { url, outputDir, timeoutSec, clientId };
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

function assertOutputDir(v) {
  if (v === null || v === undefined) return;
  if (typeof v !== "string" || v.trim() === "") {
    throw new MetadataError("comfyui_output_dir must be a non-empty absolute path, or null to clear it", { got: v });
  }
  if (!isAbsolute(v)) throw new MetadataError("comfyui_output_dir must be an absolute path", { got: v });
}

/**
 * Patch metadata.json. `url` / `output_dir` accept null to clear. The download folder is
 * created when `createDir` is not false, so results have somewhere to land.
 */
export function updateMetadata(patch, opts = {}) {
  const file = opts.file ?? metadataFile();
  const { data } = readMetadata(file);

  const comfyui = {};
  if (patch.url !== undefined) comfyui.url = patch.url === null ? null : normalizeUrl(patch.url);
  if (patch.output_dir !== undefined) {
    assertOutputDir(patch.output_dir);
    comfyui.output_dir = patch.output_dir === null ? null : patch.output_dir;
  }
  if (patch.timeout_sec !== undefined) {
    const v = patch.timeout_sec;
    if (v !== null && (typeof v !== "number" || !Number.isFinite(v) || v <= 0)) {
      throw new MetadataError("comfyui_timeout_sec must be a positive number, or null to clear it", { got: v });
    }
    comfyui.timeout_sec = v;
  }
  if (patch.client_id !== undefined) {
    if (patch.client_id !== null && (typeof patch.client_id !== "string" || patch.client_id.trim() === "")) {
      throw new MetadataError("comfyui_client_id must be a non-empty string, or null to clear it", { got: patch.client_id });
    }
    comfyui.client_id = patch.client_id === null ? null : patch.client_id.trim();
  }
  if (Object.keys(comfyui).length === 0) {
    throw new MetadataError("nothing to update: pass comfyui_url / comfyui_output_dir / comfyui_timeout_sec / comfyui_client_id");
  }

  const next = mergeMetadata(data, { comfyui });
  const settings = comfyuiSettings(next);

  let created = false;
  if (settings.outputDir && opts.createDir !== false && !existsSync(settings.outputDir)) {
    try {
      mkdirSync(settings.outputDir, { recursive: true });
      created = true;
    } catch (e) {
      throw new MetadataError(`cannot create comfyui.output_dir: ${e.code ?? e.message}`, { dir: settings.outputDir });
    }
  }

  writeFileSync(file, JSON.stringify(next, null, 2) + "\n", "utf8");
  return { file, data: next, ...settings, created };
}
