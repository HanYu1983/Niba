/**
 * `render_manifest.json` — one record per segment, mapping the plan id to the keeper clip.
 *
 * It is the join between three tools: render writes it, concat reads the order + durations,
 * subtitles reads the actual durations. Nothing else is allowed to guess which take is final.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname } from "node:path";

export function readManifest(file, planFile = null) {
  if (!existsSync(file)) {
    return { version: "1.0", plan: planFile ? basename(planFile) : null, segments: {} };
  }
  const m = JSON.parse(readFileSync(file, "utf8"));
  if (!m.segments) m.segments = {};
  return m;
}

export function writeManifest(file, manifest) {
  writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return file;
}

/** Insert/overwrite one segment's record and persist. */
export function upsertSegment(file, segmentId, record) {
  const manifest = readManifest(file);
  manifest.segments[segmentId] = record;
  writeManifest(file, manifest);
  return record;
}

/** The keeper clip: first entry in `files`, after the download pass folds them in. */
export function keeperFile(record) {
  return (record?.files ?? [])[0] ?? null;
}

/** Segments that have a keeper clip on disk, in plan order. */
export function readySegments(manifest) {
  return Object.values(manifest.segments).filter(
    (r) => r.status === "success" && (r.files ?? []).length > 0
  );
}

export function manifestDir(file) {
  return dirname(file);
}
