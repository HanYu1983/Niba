/**
 * Chapter 1 prompt builder.
 *
 * The prose lives in `data_prompts_ch1_{a,b,c}.mjs`; this file only assembles it:
 *
 *   - the style lock is prepended to every `[Shot 1]` (the light clause is the only variable)
 *   - the scene anchor is prepended once, so every file names the place the same way
 *   - dialogue is mirrored from `plan.ch1.json → spoken_text`; it is never retyped here
 *   - `At MM:SS.mmm` anchors are derived from `estimated_sec` and the shot count
 *
 * The output is UTF-8 without BOM and LF-only, which the render tools expect.
 *
 *   node test_story3/build_prompts_ch1.mjs --story test_story3 --plan test_story3/plan.ch1.json
 *   node test_story3/build_prompts_ch1.mjs --story test_story3 --plan test_story3/plan.ch1.json --dry-run
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { boolArg, parseArgs } from "../workspace/lib/args.mjs";
import { loadPlan, quantiseFrames } from "../workspace/lib/plan.mjs";
import { loadStory } from "../workspace/lib/story.mjs";

import { promptsA } from "./data_prompts_ch1_a.mjs";
import { promptsB } from "./data_prompts_ch1_b.mjs";
import { promptsC } from "./data_prompts_ch1_c.mjs";

/* ------------------------------------------------------------------ style lock */

const LOCK_PREFIX =
  "Photorealistic live-action 35mm film, fine grain, natural skin texture, real-world photography, " +
  "muted olive and cold grey palette, ";
const LOCK_SUFFIX =
  ", shallow depth of field, grounded documentary realism — not anime, not cartoon, not illustration, " +
  "not cel shading, not an advertisement, not slow motion, no on-screen text.";

const LIGHT = {
  noon: "harsh flat noon light",
  boat: "dim green-grey daylight through open hatches"
};

const SCENES = {
  loc_riverbank_noon:
    "The riverside embankment at harsh noon: gravel and dry grass, a dense green tree line on one side " +
    "and the wide canal on the other, hard short shadows and no shelter.",
  loc_canal_water_noon:
    "The wide canal at harsh noon: turbid green-brown water, broken concrete bridge debris, survivors " +
    "and pale figures thrashing near the bank, unnatural dark red blooms thinning in the current.",
  loc_city_skyline_noon:
    "A distant city skyline at noon, seen over the riverbank treeline: hazy towers, stalled traffic and " +
    "a thin column of black smoke.",
  loc_fishing_boat_exterior:
    "A large derelict fishing trawler grounded and half-tilted on the riverbank: barnacles crusting the " +
    "hull, rusted rails, cracked paint and a muddy waterline.",
  loc_fishing_boat_deck:
    "Inside the flooded three-level fishing boat: a narrow wet wooden corridor, turbid water rising in " +
    "the lowest deck, peeling paint and dim light falling through open hatches.",
  loc_boat_captain_cabin:
    "A small derelict captain's cabin: a white door with a faded Chinese nameplate, a rotting wooden " +
    "floor, scattered charts and a sailor's corpse."
};

const TITLE_SLATE =
  "Photorealistic 35mm film slate filling the entire frame in pure black, fine silver grain drifting " +
  "slowly across the surface, individual dust motes and short hairs catching the light, a few hairline " +
  "scratches running vertically, faint gate weave and a soft vignette breathing at the edges. The " +
  "texture is physical film, not a flat digital black; the blacks stay deep but never crushed. The " +
  "frame carries no lettering, no numbers, no logos, no watermark and no on-screen text of any kind; " +
  "the slate stays empty so titles can be laid over it in post.";

/* ------------------------------------------------------------------ timing */

const pad = (n, w = 2) => String(n).padStart(w, "0");

function stamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  const whole = Math.floor(s);
  const ms = Math.round((s - whole) * 1000);
  return `${pad(m)}:${pad(whole)}.${pad(ms, 3)}`;
}

/**
 * Split a plan line into short TTS lines without dropping a character.
 * Sentence enders break first; very long clauses break again on a comma.
 */
function ttsLines(text) {
  const clean = String(text ?? "").replace(/\s+/g, "").replace(/：/g, "。");
  const sentences = [];
  let buf = "";
  for (const ch of clean) {
    buf += ch;
    if ("。！？".includes(ch)) {
      sentences.push(buf);
      buf = "";
    }
  }
  if (buf) sentences.push(buf);

  // "看棒————！！" splits into a line ending "！" and a line that is only "！";
  // fold punctuation-only fragments back into the previous line.
  const merged = [];
  for (const line of sentences) {
    if (/[\u3400-\u9fffA-Za-z0-9]/.test(line) || !merged.length) merged.push(line);
    else merged[merged.length - 1] += line;
  }

  const out = [];
  for (const line of merged) {
    if ([...line].length <= 22) {
      out.push(line);
      continue;
    }
    let cur = "";
    for (const ch of line) {
      cur += ch;
      if ("，、".includes(ch) && [...cur].length >= 12) {
        out.push(cur);
        cur = "";
      }
    }
    if (cur) out.push(cur);
  }
  return out;
}

/** Distribute lines across the shots that carry speech, keeping their order. */
function distribute(lines, slots) {
  const k = slots.length;
  if (!k) return [];
  if (k === 1) return [lines];
  if (!lines.length) return slots.map(() => []);
  if (lines.length < k) return distribute(lines, slots.slice(0, lines.length));
  if (lines.length === k) return lines.map((l) => [l]);

  const n = lines.length;
  const pref = [0];
  for (const line of lines) pref.push(pref[pref.length - 1] + [...line].length);
  const target = pref[n] / k;
  const memo = new Map();

  // Split the ordered lines into k consecutive groups, minimising squared deviation.
  function best(start, groups) {
    const key = `${start}:${groups}`;
    if (memo.has(key)) return memo.get(key);
    if (groups === 1) {
      const result = { cost: (pref[n] - pref[start] - target) ** 2, cuts: [] };
      memo.set(key, result);
      return result;
    }
    let winner = null;
    for (let end = start + 1; end <= n - (groups - 1); end++) {
      const cost = (pref[end] - pref[start] - target) ** 2;
      const rest = best(end, groups - 1);
      const total = cost + rest.cost;
      if (!winner || total < winner.cost) winner = { cost: total, cuts: [end, ...rest.cuts] };
    }
    memo.set(key, winner);
    return winner;
  }

  const { cuts } = best(0, k);
  const out = [];
  let prev = 0;
  for (const cut of cuts) {
    out.push(lines.slice(prev, cut));
    prev = cut;
  }
  out.push(lines.slice(prev));
  return out;
}

/* ------------------------------------------------------------------ build */

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0] ?? ".", plan: args.plan });
const plan = loadPlan(story.planFile);
const dryRun = boolArg(args, "dry-run", false);
const fps = story.render.fps;
// Chapter prompts live in a subfolder so ch0's prompt files are not overwritten.
const outDir = args.prompts ? resolve(String(args.prompts)) : resolve(story.promptsDir, "ch1");
if (!dryRun) mkdirSync(outDir, { recursive: true });

const data = { ...promptsA, ...promptsB, ...promptsC };
const ids = new Set(plan.segments.map((s) => s.id));

const problems = [];
const written = [];

for (const id of Object.keys(data)) {
  if (!ids.has(id)) problems.push(`${id}: prompt data has no matching plan segment`);
}

for (const seg of plan.segments) {
  const entry = data[seg.id];
  if (!entry) {
    problems.push(`${seg.id}: no prompt data`);
    continue;
  }

  const shots = entry.shots ?? [];
  if (!shots.length) problems.push(`${seg.id}: prompt data has no shots`);
  if (shots.length !== (seg.render_blocks ?? 1)) {
    problems.push(`${seg.id}: ${shots.length} shots but plan says ${seg.render_blocks} render blocks`);
  }
  for (const [i, shot] of shots.entries()) {
    if (!shot.text) problems.push(`${seg.id}: shot ${i + 1} has no text`);
  }

  const title = Boolean(entry.title);
  const light = entry.light ?? (title ? null : LIGHT[entry.lightKey ?? "noon"]);
  if (!title && !light) problems.push(`${seg.id}: unknown light key "${entry.lightKey}"`);

  const duration = seg.estimated_sec ?? 5;
  const maxDuration = quantiseFrames(duration, fps) / fps + 0.5;
  const step = duration / shots.length;
  const anchors = shots.map((_, i) => Math.round(i * step * 10) / 10);
  for (let i = 1; i < anchors.length; i++) {
    if (anchors[i] <= anchors[i - 1]) problems.push(`${seg.id}: shot ${i + 1} anchor does not increase`);
    if (anchors[i] > maxDuration) problems.push(`${seg.id}: shot ${i + 1} anchor ${anchors[i]}s exceeds ${maxDuration.toFixed(2)}s`);
  }

  const lines = seg.spoken_text ? ttsLines(seg.spoken_text) : [];
  // Narration runs across the whole segment: every shot can carry a slice of the voice-over.
  // Dialogue is tied to the shot that authors it with `say`.
  const speechSlots =
    seg.kind === "narration" && shots.length > 1
      ? shots.map((_, i) => i)
      : shots.map((s, i) => (s.say ? i : -1)).filter((i) => i >= 0);
  const voiceIntro = shots.find((s) => typeof s.say === "string" && s.say.trim())?.say?.trim() ?? "";
  if (seg.kind === "action" && (speechSlots.length || lines.length)) {
    problems.push(`${seg.id}: action segment must not carry dialogue`);
  }
  if (seg.kind !== "action" && !speechSlots.length) problems.push(`${seg.id}: spoken segment has no say slot`);
  if (seg.kind !== "action" && speechSlots.length && !lines.length) problems.push(`${seg.id}: spoken segment has no lines`);
  if (seg.kind !== "action" && !voiceIntro) problems.push(`${seg.id}: spoken segment has no speaker attribution`);

  const groups = distribute(lines, speechSlots);

  const blocks = shots.map((shot, i) => {
    let head;
    if (i === 0) {
      if (title) head = `[Shot 1] ${TITLE_SLATE}`;
      else head = `[Shot 1] ${LOCK_PREFIX}${light}${LOCK_SUFFIX} ${entry.scene ?? SCENES[seg.location_ref] ?? ""}`.trimEnd();
      return `${head} ${shot.text.charAt(0).toUpperCase()}${shot.text.slice(1)}`;
    }
    head = `[Shot ${i + 1}] At ${stamp(anchors[i])}, the camera cuts to`;
    return `${head} ${shot.text}`;
  });

  // attach <d> blocks to the shots that speak
  let speechIndex = 0;
  const withDialogue = blocks.map((block, i) => {
    const slot = speechSlots.indexOf(i);
    if (slot === -1) return block;
    const spoken = groups[speechIndex++] ?? [];
    const lead = slot === 0 && voiceIntro ? ` ${voiceIntro}` : "";
    const d = ["<d>", "[中文]", ...spoken, "</d>"].join("\n");
    return `${block}${lead}\n${d}`;
  });

  const sound = entry.sound ?? "";
  const hasSpeech = speechSlots.length > 0;
  const dialogueAnchor = hasSpeech
    ? " All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese."
    : "";

  const text = [
    `integrated_multimodal_description: ${withDialogue[0]}`,
    "",
    ...withDialogue.slice(1).flatMap((b) => [b, ""]),
    `overall_soundscape: ${sound}${dialogueAnchor}`.trimEnd(),
    "",
    `non_diegetic_music: ${entry.music ?? "N/A"}`,
    ""
  ].join("\n");

  const file = resolve(outDir, `${seg.id}.t2v.txt`);
  if (!dryRun) writeFileSync(file, text.replace(/\r\n/g, "\n"), "utf8");
  written.push({ id: seg.id, shots: shots.length, lines: lines.length, chars: [...text].length });
}

const summary = {
  story: story.dir,
  plan: story.planFile,
  prompts: story.promptsDir,
  out: outDir,
  dry_run: dryRun,
  written: written.length,
  shots: written.reduce((n, w) => n + w.shots, 0),
  function_words: written.reduce((n, w) => n + w.lines, 0),
  problems
};
console.log(JSON.stringify(summary, null, 2));

if (boolArg(args, "verbose", false)) {
  for (const w of written) console.log(`${w.id} shots=${w.shots} lines=${w.lines} bytes=${w.chars}`);
}

process.exit(problems.length ? 1 : 0);
