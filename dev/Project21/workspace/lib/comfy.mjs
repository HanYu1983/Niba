/**
 * Where the box is, where downloads land, and which ffmpeg to use.
 *
 * The ComfyUI connection is machine-level, not story-level: url / output root live in
 * `comfyui_mcp/metadata.json` and are shared by every story. A story can override only
 * its own download root (`story.output`) and its asset root (`story.assetRoot`).
 */
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { comfyuiSettings, readMetadata } from "../../comfyui_mcp/metadata.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Repository root (the folder that holds comfyui_mcp/, gen_video/, workspace/). */
export const PROJECT_ROOT = resolve(HERE, "../..");

export function comfyConfig() {
  const { file, data } = readMetadata();
  const settings = comfyuiSettings(data);
  return {
    metadataFile: file,
    url: settings.url,
    clientId: settings.clientId,
    timeoutSec: settings.timeoutSec,
    /** Shared download root: refs live here unless a story overrides `refs.root`. */
    outputDir: settings.outputDir ?? resolve(PROJECT_ROOT, "output")
  };
}

/**
 * The only ffmpeg on this box is the one bundled with gen_video. Keep the lookup in one
 * place so a machine with a system ffmpeg can just set FFMPEG_PATH.
 */
export function ffmpegPath() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  const bundled = resolve(PROJECT_ROOT, "gen_video/node_modules/ffmpeg-static/ffmpeg.exe");
  if (existsSync(bundled)) return bundled;
  return "ffmpeg";
}
