/**
 * Render-plan checks: the deterministic half of the pipeline.
 * Run: node test/render_plan.mjs
 *
 * These are cheap and offline — no ComfyUI, no MCP. They pin the rules that, when broken,
 * show up as a bad mp4 twenty minutes later: where a sentence is split, what gets replaced,
 * how many frames a duration becomes, and whether every block in ch04 can compile at all.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { compileAll, compileRenderJob, lineIssues, normaliseText, quantiseFrames, splitNarration } from "../render_plan.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");

let passed = 0;
function ok(name, fn) {
  fn();
  passed++;
  console.log(`ok  ${name}`);
}

ok("splitNarration keeps one sentence per line", () => {
  const lines = splitNarration("被告席上坐著的不是罪犯，而是他的恩師。曾被譽為司法界最後良心的退休法官。");
  assert.deepEqual(lines, ["被告席上坐著的不是罪犯，而是他的恩師。", "曾被譽為司法界最後良心的退休法官。"]);
});

ok("splitNarration cuts an over-long sentence at a comma and closes it", () => {
  const long = "他在判決書中詳細列舉了銀行斷線與匯款單時間的矛盾，並在旁註記了三個日期。";
  const lines = splitNarration(long, 22);
  assert.ok(lines.length >= 2, `expected a split, got ${JSON.stringify(lines)}`);
  /* The cut lands on the last comma that still fits, so the first piece can be a few
     characters over the 22 target — but never over lineIssues' hard limit of 26. */
  for (const line of lines) assert.ok([...line].length <= 26, `line over the hard limit: ${line}`);
  assert.ok(lines[0].endsWith("。"), "the comma that became a cut must become a full stop");
  assert.ok(!lines[0].includes("，並"), "the cut must fall on the comma, not after it");
  assert.ok(lines[1].startsWith("並在旁註記"), `second piece starts wrong: ${lines[1]}`);
});

ok("splitNarration leaves a sentence that already fits alone", () => {
  assert.deepEqual(splitNarration("他的手慢慢握緊椅子的扶手。"), ["他的手慢慢握緊椅子的扶手。"]);
});

ok("normaliseText rewrites simplified characters", () => {
  const r = normaliseText("逻辑");
  assert.equal(r.text, "邏輯");
  assert.equal(r.changed, true);
  assert.equal(normaliseText("邏輯").changed, false);
});

ok("lineIssues flags the characters a TTS would read out", () => {
  for (const bad of ["「標籤之雨」", "他說：走吧。", "百分之二%", "第 45 號", "a b", "甲——乙"]) {
    assert.ok(lineIssues(bad).length > 0, `expected an issue for ${bad}`);
  }
  assert.equal(lineIssues("他的手停在紙頁邊緣。").length, 0);
});

ok("lineIssues reports a line over the limit with its length", () => {
  const issues = lineIssues("一".repeat(30), { maxChars: 26 });
  assert.equal(issues[0].kind, "long-line");
  assert.equal(issues[0].length, 30);
});

ok("quantiseFrames lands on 17k+5", () => {
  assert.equal(quantiseFrames(4, 24), 107); // 96 frames -> 5 + 17*6
  assert.equal(quantiseFrames(5, 24), 124); // 120 -> 5 + 17*7
  assert.equal(quantiseFrames(8, 24), 192); // 192 -> exact
  for (const sec of [4, 5, 6, 7, 8]) {
    const frames = quantiseFrames(sec, 24);
    assert.equal((frames - 5) % 17, 0, `${sec}s -> ${frames} frames is not 17k+5`);
    assert.ok(frames >= sec * 24, `${sec}s quantised down to ${frames} frames`);
  }
});

/* --------------------------------------------------------------- the real chapter */

const projectFile = resolve(ROOT, "test_story1/ch04_from_plan.json");
const notesFile = resolve(ROOT, "test_story1/ch04_shot_notes.json");
const project = JSON.parse(readFileSync(projectFile, "utf8"));
const notes = JSON.parse(readFileSync(notesFile, "utf8"));

const result = compileAll(project, notes, { projectFile });

ok("every ch04 block compiles", () => {
  assert.deepEqual(result.errors, []);
  assert.equal(result.summary.compiled, project.blocks.length);
  assert.equal(result.summary.failed, 0);
});

ok("every block is 4-8 seconds and gets at most three references, scene first", () => {
  for (const job of result.jobs) {
    assert.ok(job.duration_sec >= 4 && job.duration_sec <= 8, `${job.block_id}: ${job.duration_sec}s`);
    assert.ok(job.reference_images.length >= 1 && job.reference_images.length <= 3, `${job.block_id}: ${job.reference_images.length} refs`);
    assert.ok(job.reference_images[0].includes("refs" + (job.reference_images[0].includes("\\") ? "\\" : "/")), `${job.block_id}: slot 1 is not a reference plate`);
  }
});

ok("only the deliberate issues remain", () => {
  const kinds = new Set(result.jobs.flatMap((j) => j.issues.map((i) => i.kind)));
  const allowed = new Set(["refs-override", "script-normalised"]);
  for (const kind of kinds) assert.ok(allowed.has(kind), `unexpected issue kind: ${kind}`);
  /* Every override is a shot where a plate would drag a second face into frame:
     001 = an empty court with the judge far away, 030 = a flashback of Zhao alone,
     038 = the judge reading the verdict. */
  const overrides = result.jobs.filter((j) => j.issues.some((i) => i.kind === "refs-override")).map((j) => j.block_id);
  assert.deepEqual(overrides, [
    "block_001_court_wide",
    "block_008_eyes",
    "block_016_frozen_eyes",
    "block_030_remembered_line",
    "block_038_verdict_read"
  ]);
});

ok("every prompt asks for a clean frame (no burned-in subtitles)", () => {
  /* Two clips in the first batch came back with Chinese subtitles seared into the lower third. */
  for (const job of result.jobs) {
    assert.ok(job.prompt.includes("沒有任何字幕"), `${job.block_id}: missing the subtitle guard`);
  }
});

ok("narration is pronounceable and short enough for the block", () => {
  for (const job of result.jobs) {
    /* A room-tone block is deliberately silent; anything with speech must have text. */
    if (!job.speech_present) {
      assert.equal(job.narration_lines.length, 0, `${job.block_id}: speech_present=false but has text`);
      continue;
    }
    assert.ok(job.narration_lines.length > 0, `${job.block_id}: speech_present=true but no text`);
    const spoken = job.narration_lines.join("").replace(/[。！？]/g, "");
    for (const line of job.narration_lines) assert.equal(lineIssues(line, { maxChars: 26 }).length, 0, `${job.block_id}: ${line}`);
    assert.ok(spoken.length <= job.duration_sec * 8, `${job.block_id}: ${spoken.length} chars in ${job.duration_sec}s is too dense`);
  }
});

ok("the prompt carries no forbidden characters", () => {
  for (const job of result.jobs) {
    for (const line of job.prompt.split("\n").filter(Boolean)) {
      for (const issue of lineIssues(line, { maxChars: 60 })) {
        assert.notEqual(issue.kind, "forbidden", `${job.block_id}: ${issue.value} in ${line}`);
      }
    }
  }
});

ok("a take changes the seed but not the prompt", () => {
  const take1 = compileRenderJob(project, notes, "block_002_dock_zhao", { projectFile, take: 1 });
  const take2 = compileRenderJob(project, notes, "block_002_dock_zhao", { projectFile, take: 2 });
  assert.equal(take1.prompt, take2.prompt);
  assert.notEqual(take1.seed, take2.seed);
});

ok("an unknown block is an error, not a silent empty job", () => {
  assert.throws(() => compileRenderJob(project, notes, "block_999_nope", { projectFile }), /unknown block id/);
});

console.log(`\n${passed} checks passed`);
