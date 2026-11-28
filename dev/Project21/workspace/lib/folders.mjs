/**
 * Shared folder naming / lookup for story ids and reference ids.
 *
 * A folder belongs to an id when its name is exactly the id, or `<id>_...` /
 * `<id>-...`. When id prefixes overlap (e.g. `ref_kairong` and
 * `ref_kairong_father`), the longest matching known id wins, so
 * `ref_kairong_father_v2` is not mistaken for a take of `ref_kairong`.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

/** Keep ids as simple folder names; never let an id escape its output root. */
export function folderName(id) {
  const safe = String(id).replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "");
  if (!safe || safe === "." || safe === "..") throw new Error(`unsafe id: ${JSON.stringify(id)}`);
  return safe;
}

export function created(stat) {
  return stat.birthtimeMs || stat.ctimeMs || stat.mtimeMs;
}

function matchesIdFolder(name, id) {
  return name === id || name.startsWith(`${id}_`) || name.startsWith(`${id}-`);
}

/** Longest known id that owns `name`, or null. */
function ownerFor(name, ids) {
  let owner = null;
  for (const id of ids) {
    if (!matchesIdFolder(name, id)) continue;
    if (owner === null || id.length > owner.length) owner = id;
  }
  return owner;
}

function compareNewest(a, b) {
  const byCreated = created(a.stat) - created(b.stat);
  if (byCreated) return byCreated;
  const byModified = a.stat.mtimeMs - b.stat.mtimeMs;
  if (byModified) return byModified;
  return a.dir.localeCompare(b.dir);
}

/**
 * Newest directory under `root` owned by `id`.
 * `knownIds` disambiguates overlapping ids (all reference ids / all shot ids).
 */
export function newestOwnedFolder(root, id, knownIds = []) {
  if (!existsSync(root)) return null;
  const safe = folderName(id);
  const owners = [];
  for (const raw of [...knownIds, id]) {
    try {
      owners.push(folderName(raw));
    } catch {
      // Ignore an unusable sibling id; it cannot own a real folder here.
    }
  }

  let best = null;
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (ownerFor(entry.name, owners) !== safe) continue;
    const dir = resolve(root, entry.name);
    let stat;
    try {
      stat = statSync(dir);
    } catch {
      continue;
    }
    const candidate = { dir, stat };
    if (!best || compareNewest(candidate, best) > 0) best = candidate;
  }
  return best?.dir ?? null;
}
