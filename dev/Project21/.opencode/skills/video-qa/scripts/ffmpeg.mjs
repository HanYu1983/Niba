/**
 * Locate an ffmpeg binary without assuming the skill has its own node_modules.
 *
 * Order:
 *   1. $FFMPEG              — explicit override (a full path, or a name on PATH)
 *   2. node_modules/ffmpeg-static/ffmpeg(.exe) walking up from the cwd
 *   3. ...and one level *down* from each ancestor, because tools are usually installed in a
 *      sub-project (gen_video/node_modules) rather than at the workspace root
 *   4. the same search starting from this file — covers `node <skill>/scripts/*.mjs`
 *      being run from an unrelated directory
 *   5. plain "ffmpeg"       — a system install on PATH
 *
 * Why not just `import ffmpegPath from "ffmpeg-static"`: Node resolves bare imports
 * relative to the importing file, so a script inside .opencode/skills/ cannot see a
 * package installed in gen_video/node_modules. A directory junction into the skill
 * folder "fixes" it but then the skill only works inside one checkout, and a junction
 * is cleaned up and committed badly. Searching keeps the skill portable.
 */

import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const BIN = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";

function installedIn(dir) {
  const candidate = join(dir, "node_modules", "ffmpeg-static", BIN);
  return existsSync(candidate) ? candidate : null;
}

/** One level down only, and never in huge directories or a drive root. */
function installedNearby(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return null;
  }
  if (entries.length > 60) return null;
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const candidate = installedIn(join(dir, entry.name));
    if (candidate) return candidate;
  }
  return null;
}

function search(start, depth = 6) {
  let dir = resolve(start);
  for (let i = 0; i <= depth; i++) {
    const hit = installedIn(dir) ?? installedNearby(dir);
    if (hit) return hit;
    const parent = dirname(dir);
    if (parent === dir) break; // drive root: nothing above, and scanning it is wasteful
    dir = parent;
  }
  return null;
}

const here = dirname(fileURLToPath(import.meta.url));

export const ffmpegPath =
  process.env.FFMPEG || search(process.cwd()) || search(here) || "ffmpeg";

/** True when the resolved ffmpeg came from $FFMPEG or a local install, not PATH. */
export const ffmpegIsLocal = ffmpegPath !== "ffmpeg" && ffmpegPath !== "ffmpeg.exe";

/** The message a caller should print when spawning ffmpeg fails with ENOENT. */
export const FFMPEG_HINT =
  "ffmpeg not found. Install it with `npm install ffmpeg-static` in the project, " +
  "or set FFMPEG to a full path (on Windows: C:\\path\\to\\ffmpeg.exe).";

/* `node scripts/ffmpeg.mjs` prints the resolved path — the quickest way to debug a setup. */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(ffmpegPath);
}
