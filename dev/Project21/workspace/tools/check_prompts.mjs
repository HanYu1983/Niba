/**
 * Lint the prompt files against the plan and against each other.
 *
 *   node workspace/tools/check_prompts.mjs --story test_story3
 *   node workspace/tools/check_prompts.mjs --story test_story3 --style-lock 100
 *
 * Catches the failures that only show up after a render:
 *   - a missing prompt, or a prompt whose fields do not match its extension
 *   - a story that drifted into two different style locks
 *   - <d> lines that no longer mirror plan.spoken_text
 *   - symbols the TTS will read aloud (% digits latin quotes colons em-dashes)
 *   - [Shot N] timestamps that go backwards or fall outside the clip
 */
import { boolArg, numArg, parseArgs } from "../lib/args.mjs";
import { loadPlan, quantiseFrames } from "../lib/plan.mjs";
import { dLines, fieldsOf, formatOf, readPrompt, shotOneOpening, spokenChars, spokenSymbolIssues, splitShots } from "../lib/prompt.mjs";
import { promptFileFor, loadStory } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan });
const plan = loadPlan(story.planFile);
const styleChars = numArg(args, "style-lock", 100);

const problems = [];
const warnings = [];
const rows = [];

const cjk = (s) => [...String(s ?? "").replace(/[^\u3400-\u9fff]/g, "")].join("");
const bigrams = (s) => {
  const out = new Set();
  for (let i = 0; i < s.length - 1; i++) out.add(s.slice(i, i + 2));
  return out;
};
/** Sørensen–Dice on character bigrams: 1 = identical text, 0 = nothing in common. */
function dice(a, b) {
  const A = bigrams(a);
  const B = bigrams(b);
  if (!A.size || !B.size) return A.size === B.size ? 1 : 0;
  let hit = 0;
  for (const g of A) if (B.has(g)) hit++;
  return (2 * hit) / (A.size + B.size);
}

for (const seg of plan.segments) {
  const pick = promptFileFor(story, seg.id, args.mode);
  const row = { id: seg.id, kind: seg.kind, mode: pick.mode, issues: [], warnings: [] };

  if (!pick.exists) {
    problems.push(`${seg.id}: missing prompt (${pick.file})`);
    row.issues.push("missing prompt");
    rows.push(row);
    continue;
  }

  const text = readPrompt(pick.file);
  const format = formatOf(text);
  const fields = fieldsOf(text);
  const duration = (seg.estimated_sec ?? 5);
  const maxDuration = quantiseFrames(duration, story.render.fps) / story.render.fps + 0.5;

  if (pick.mode && format !== "unknown" && pick.mode !== format && pick.mode !== "i2v") {
    row.issues.push(`extension says ${pick.mode}, fields say ${format}`);
  }

  const required = format === "r2v"
    ? ["subject_definitions", "summary", "retention_analysis", "detailed_description", "overall_soundscape", "non_diegetic_music"]
    : ["integrated_multimodal_description", "overall_soundscape", "non_diegetic_music"];
  for (const f of required) {
    if (!(f in fields)) row.issues.push(`missing field ${f}`);
  }

  const shots = splitShots(text);
  if (!shots.length) row.issues.push("no [Shot N] markers");
  const anchors = shots.map((s) => s.anchor);
  if (shots[0] && /\bAt\s+\d/.test(shots[0].text.split("[Shot 2]")[0])) row.issues.push("[Shot 1] carries a timestamp");
  for (let i = 1; i < anchors.length; i++) {
    if (anchors[i] <= anchors[i - 1]) row.issues.push(`[Shot ${i + 1}] timestamp is not increasing`);
  }
  for (const a of anchors) {
    if (a > maxDuration) row.issues.push(`shot anchor ${a.toFixed(2)}s exceeds the clip (${maxDuration.toFixed(2)}s)`);
  }

  const hasD = /<d>/i.test(text);
  if (seg.kind === "action" && hasD) row.issues.push("action segment carries a <d> block");
  if (seg.kind !== "action" && !hasD) row.warnings.push("spoken segment has no <d> block");

  // <d> must mirror plan.spoken_text (quotes/brackets are stripped by design, so compare CJK)
  if (seg.spoken_text && hasD) {
    const promptText = cjk(dLines(text).join(""));
    const planText = cjk(seg.spoken_text);
    const score = dice(promptText, planText);
    if (promptText !== planText) {
      row.warnings.push(`<d> differs from plan.spoken_text (similarity ${score.toFixed(2)})`);
    }
    if (score < 0.6) row.issues.push(`<d> barely matches plan.spoken_text (${score.toFixed(2)})`);
  }

  const symbols = spokenSymbolIssues(text);
  for (const s of symbols) row.issues.push(`spoken symbols ${s.symbols.join("/")} in "${s.line.slice(0, 24)}"`);

  if (format !== "r2v" && /<Picture\s+\d+>/i.test(text)) row.issues.push("<Picture N> in a t2v prompt");
  if (format === "r2v") {
    const pictures = [...text.matchAll(/<Picture\s+(\d+)>/gi)].map((m) => Number(m[1]));
    const slots = (seg.reference_images ?? []).length;
    const unique = new Set(pictures);
    if (unique.size !== slots) row.warnings.push(`${unique.size} <Picture N> for ${slots} plan slot(s)`);
  }

  if (!/not anime|no anime/i.test(text) && format !== "r2v") {
    row.warnings.push("negative guard sentence missing (not anime / not cartoon)");
  }

  row.opening = shotOneOpening(text, styleChars);
  row.words = spokenChars(seg.spoken_text ?? "").length;
  row.lines = dLines(text).length;

  for (const x of [...row.issues.map((i) => `${seg.id}: ${i}`)]) problems.push(x);
  for (const x of row.warnings) warnings.push(`${seg.id}: ${x}`);
  rows.push(row);
}

/* ---------------------------------------------------------------- style lock spread */

const openings = rows.filter((r) => r.opening).map((r) => r.opening);
const counts = new Map();
for (const o of openings) counts.set(o, (counts.get(o) ?? 0) + 1);
const [majority, hits] = [...counts].sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
if (majority) {
  for (const row of rows.filter((r) => r.opening && r.opening !== majority)) {
    const msg = `${row.id}: style lock differs from the story majority`;
    warnings.push(msg);
    row.warnings.push("style lock differs from the story majority");
  }
}

const withPrompts = rows.filter((r) => r.mode).length;
const summary = {
  story: story.dir,
  prompts: withPrompts,
  segments: plan.segments.length,
  style_lock_files: majority ? `${hits}/${openings.length} share the same ${styleChars}-char opening` : "n/a",
  problems,
  warnings
};
console.log(JSON.stringify(summary, null, 2));

if (boolArg(args, "verbose", false)) {
  console.log("\nid       mode  lines  chars  issues");
  for (const r of rows) {
    console.log(
      `${r.id} ${String(r.mode ?? "-").padEnd(5)} ${String(r.lines ?? 0).padStart(5)}  ${String(r.words ?? 0).padStart(5)}  ` +
        `${[...r.issues, ...r.warnings.map((w) => `warn: ${w}`)].join("; ")}`
    );
  }
  if (majority) console.log(`\nmajority opening:\n${majority}`);
}

process.exit(problems.length ? 1 : 0);
