/**
 * CLI: turn a story project + its Chinese shot notes into r2v jobs.
 *
 *   node compile_blocks.mjs --check                 # validate every block, print the issues
 *   node compile_blocks.mjs --prompt block_002_dock_zhao   # eyeball one assembled prompt
 *   node compile_blocks.mjs --out jobs.json         # write the jobs the renderer consumes
 *
 * Nothing here talks to ComfyUI; render_blocks.mjs does that.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { compileAll, compileRenderJob } from "./render_plan.mjs";

const HERE = "D:\\han\\Niba\\dev\\Project21";
const DEFAULTS = {
  project: resolve(HERE, "test_story1/ch04_from_plan.json"),
  notes: resolve(HERE, "test_story1/ch04_shot_notes.json")
};

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
      continue;
    }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      out[key] = true;
    } else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function readJson(file, what) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    throw new Error(`cannot read ${what} (${file}): ${e.message}`);
  }
}

function printIssues(entry) {
  for (const issue of entry.issues) {
    const tag = issue.kind.padEnd(18);
    const detail = issue.line ? `  ${issue.line}` : issue.why ? `  ${issue.why}` : "";
    console.log(`  ! ${entry.block_id}  ${tag}${detail}`);
  }
}

const args = parseArgs(process.argv.slice(2));
const projectFile = resolve(args.project ?? DEFAULTS.project);
const notesFile = resolve(args.notes ?? DEFAULTS.notes);

const project = readJson(projectFile, "project");
const notes = readJson(notesFile, "shot notes");

try {
  if (typeof args.prompt === "string") {
    const job = compileRenderJob(project, notes, args.prompt, { projectFile, take: Number(args.take ?? 1) });
    console.log(job.prompt);
    console.log("");
    console.log("--- job ---");
    console.log(
      JSON.stringify(
        { ...job, prompt: undefined, issues: job.issues },
        (k, v) => (k === "prompt" ? undefined : v),
        2
      )
    );
    process.exitCode = 0;
  } else {
    const result = compileAll(project, notes, { projectFile, take: Number(args.take ?? 1) });

    console.log(
      `blocks ${result.summary.blocks}  compiled ${result.summary.compiled}  failed ${result.summary.failed}  ` +
        `with issues ${result.summary.with_issues}  total ${result.summary.total_sec}s`
    );

    for (const err of result.errors) {
      console.log(`  x ${err.block_id}  ${err.error}`);
    }
    for (const job of result.jobs) printIssues(job);
    for (const id of result.unused_notes) console.log(`  ~ note has no block: ${id}`);

    if (typeof args.out === "string") {
      writeFileSync(resolve(args.out), JSON.stringify(result.jobs, null, 2) + "\n", "utf8");
      console.log(`wrote ${resolve(args.out)}`);
    }

    const hard = result.errors.length > 0 || result.jobs.some((j) => j.issues.some((i) => i.kind !== "refs-override"));
    process.exitCode = args.check && hard ? 1 : 0;
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 2;
}
