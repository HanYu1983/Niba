/**
 * Is every entity's reference plate on disk?
 *
 *   node workspace/tools/check_refs.mjs --story test_story3
 *   node workspace/tools/check_refs.mjs --story test_story3 --json
 *
 * t2v does not bind these plates, but they are the shared appearance anchor, so a story
 * without them has nothing to keep its characters from drifting.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";

import { boolArg, parseArgs } from "../lib/args.mjs";
import { entitiesOf, loadPlan } from "../lib/plan.mjs";
import { loadStory, plateDir } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan });
const plan = loadPlan(story.planFile);

const rows = entitiesOf(plan).map((e) => {
  const dir = plateDir(story, e);
  const plates = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
        .map((f) => ({ f, mtime: statSync(resolve(dir, f)).mtimeMs }))
        .sort((a, b) => b.mtime - a.mtime)
    : [];
  return {
    id: e.id,
    kind: e.kind,
    declared: e.reference?.status ?? null,
    dir,
    plates: plates.map((p) => p.f)
  };
});

if (!boolArg(args, "json", false)) {
  for (const r of rows) {
    console.log(
      `${r.plates.length ? "OK  " : "MISS"} ${r.kind.padEnd(9)} ${r.id.padEnd(24)} ${String(r.declared ?? "-").padEnd(11)} ${r.plates.join(",") || "-"}`
    );
  }
}

const missing = rows.filter((r) => r.plates.length === 0);
const stale = rows.filter((r) => r.declared === "ready" && r.plates.length === 0);
const summary = {
  story: story.dir,
  asset_root: story.assetRoot,
  total: rows.length,
  with_plate: rows.length - missing.length,
  missing: missing.map((m) => m.id),
  declared_ready_but_missing: stale.map((m) => m.id),
  extra_plates: rows.filter((r) => r.plates.length > 1).map((r) => `${r.id}:${r.plates.length}`)
};
console.log(JSON.stringify(summary, null, 2));
process.exit(missing.length ? 1 : 0);
