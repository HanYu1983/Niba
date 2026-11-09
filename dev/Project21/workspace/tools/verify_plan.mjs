/**
 * Independent re-check of a plan: source coverage, refs, speech contract.
 *
 *   node workspace/tools/verify_plan.mjs --story test_story3
 *   node workspace/tools/verify_plan.mjs --story test_story3 --verbose
 *
 * The story's own builder is responsible for anchor slicing; this tool only checks the
 * invariants every consumer (render/concat/subtitles) relies on.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { boolArg, parseArgs } from "../lib/args.mjs";
import { loadPlan, validatePlan } from "../lib/plan.mjs";
import { describeStory, loadStory } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan, prompts: args.prompts, manifest: args.manifest });
const plan = loadPlan(story.planFile);

const problems = [];
const warnings = [];

/* ---------------------------------------------------------------- source coverage */

const joined = plan.segments.map((s) => s.source ?? "").join("");
const sourceFile = plan.source?.file ? resolve(story.dir, plan.source.file) : null;

if (plan.source?.sha256) {
  const joinedHash = createHash("sha256").update(joined).digest("hex");
  if (joinedHash !== plan.source.sha256) {
    problems.push(`joined segment text does not match plan.source.sha256 (${joinedHash.slice(0, 12)}… != ${plan.source.sha256.slice(0, 12)}…)`);
  }
  if (sourceFile && existsSync(sourceFile)) {
    const fileHash = createHash("sha256").update(readFileSync(sourceFile, "utf8")).digest("hex");
    if (fileHash !== plan.source.sha256) problems.push(`source file on disk does not match plan.source.sha256`);
    if (joined !== readFileSync(sourceFile, "utf8")) problems.push(`segments do not reassemble ${plan.source.file}`);
  } else if (sourceFile) {
    warnings.push(`source file not found: ${sourceFile}`);
  }
}

if (plan.segments.length && plan.segments[0].source_start !== 0) problems.push("first segment does not start at 0");
const last = plan.segments.at(-1);
if (last && typeof last.source_end === "number" && plan.source?.chars && last.source_end !== plan.source.chars) {
  problems.push(`last segment ends at ${last.source_end}, plan.source.chars is ${plan.source.chars}`);
}

/* ---------------------------------------------------------------- structural checks */

const report = validatePlan(plan, { sceneFirst: boolArg(args, "scene-first", true) });
problems.push(...report.problems);
warnings.push(...report.warnings);

const summary = {
  ...describeStory(story),
  segments: report.segments,
  entities: report.entities,
  planned_sec: Number(plan.segments.reduce((n, s) => n + (s.estimated_sec ?? 0), 0).toFixed(2)),
  problems,
  warnings
};
console.log(JSON.stringify(summary, null, 2));

if (boolArg(args, "verbose", false)) {
  console.log("\nid       kind       sec  refs  speaker            source");
  for (const s of plan.segments) {
    console.log(
      `${s.id} ${String(s.kind).padEnd(10)} ${String(s.estimated_sec).padStart(4)} ${String((s.reference_images ?? []).length).padStart(5)}  ` +
        `${String(s.speaker_ref ?? "-").padEnd(18)} ${JSON.stringify((s.source ?? "").slice(0, 34))}`
    );
  }
}

process.exit(problems.length ? 1 : 0);
