/**
 * Build + validate plan.ch0.json from story_ch0.txt.
 *
 * The anchors are the contract: each segment starts at an exact substring, so the slices
 * are contiguous by construction and `join("")` reproduces the source. The builder also
 * derives char_count / estimated_sec / render_blocks and first_seen, then refuses to write
 * a plan that breaks the workflow's hard rules.
 *
 * Run: node build_plan.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { entities } from "./data_entities.mjs";
import { segmentsA } from "./data_segments_a.mjs";
import { segmentsB } from "./data_segments_b.mjs";
import { segmentsC } from "./data_segments_c.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const STORY_FILE = resolve(HERE, "story_ch0.txt");
const PLAN_FILE = resolve(HERE, "plan.ch0.json");

const source = readFileSync(STORY_FILE, "utf8");
const sha256 = createHash("sha256").update(source).digest("hex");

/* ------------------------------------------------------------------ callbacks */

/**
 * A handful of real callbacks. Keyed by the segment's anchor so the data files stay
 * purely descriptive; the builder turns these into `references` entries.
 */
const callbacks = {
  "深夜———": [
    {
      segment_ref: "seg_013",
      why: "白天目送泰洛伊離開時，上校的笑容轉為陰沉；這裡揭露他正在策劃什麼。",
      manifestation: "白天操場上那張笑意退去的臉"
    }
  ],
  "「我的老天……」小劉驚訝得": [
    {
      segment_ref: "seg_030",
      why: "小劉的興奮直接回應上一段方舟的解釋。",
      manifestation: "窗外那片被稱為「上等人避難所」的萬家燈火"
    }
  ],
  "混亂像瘟疫一樣擴散": [
    {
      segment_ref: "seg_032",
      why: "整段混亂源自路口的撞車與咬人事件。",
      manifestation: "路口那台被撞翻的外送機車"
    }
  ],
  "嘟嚕嚕——嘟嚕嚕——": [
    {
      segment_ref: "seg_011",
      why: "上校在電話裡重提恐龍背包，正是白天那段玩笑。",
      manifestation: "泰洛伊腦中閃過的那個綠色暴龍背包"
    }
  ],
  "方才那個被撕掉大半個身體": [
    {
      segment_ref: "seg_065",
      why: "他剛剛才被怪物咬穿背部，現在卻站了起來。",
      manifestation: "背部仍敞開的傷口與裸露的脊椎"
    }
  ],
  "在泰洛伊眼前，整座艾伯塔市依然平靜": [
    {
      segment_ref: "seg_063",
      why: "她在河床抬頭看城市，與腳下的斷橋形成兩個世界。",
      manifestation: "遠方完好無煙的天際線"
    }
  ]
};

/* ------------------------------------------------------------------ helpers */

const CN_ALNUM = /[\u3400-\u4dbf\u4e00-\u9fff0-9A-Za-z]/u;
const RATE = {
  spoken_on_screen: 5.0,
  spoken_on_screen_intense: 4.5,
  remembered_voice: 4.5,
  internal_monologue: 4.0,
  narrator: 5.0
};

function countChars(text) {
  return [...text].filter((ch) => CN_ALNUM.test(ch)).length;
}

/** Anonymous crowd lines have no on-screen speaker to lip-sync; say so for stage 2. */
function anonymousVoiceNote(entry) {
  if (entry.kind !== "dialogue" || entry.speaker) return entry.voiceNote;
  return (
    entry.voiceNote ??
    "anonymous bystander voice, no on-screen speaker; frame the group/background with faces out of focus and keep lip-sync off"
  );
}

const allEntities = [
  ...entities.characters.map((e) => ({ ...e, kind: "character" })),
  ...entities.props.map((e) => ({ ...e, kind: "prop" })),
  ...entities.locations.map((e) => ({ ...e, kind: "location" }))
];
const byId = new Map(allEntities.map((e) => [e.id, e]));

const data = [...segmentsA, ...segmentsB, ...segmentsC];
const problems = [];
const warnings = [];

/* ------------------------------------------------------------------ slicing */

let cursor = 0;
const segments = data.map((entry, i) => {
  const id = `seg_${String(i + 1).padStart(3, "0")}`;
  const start = source.indexOf(entry.anchor, cursor);
  if (start === -1) {
    problems.push(`${id}: anchor not found after offset ${cursor}: ${entry.anchor}`);
    return null;
  }
  const end = i + 1 < data.length ? source.indexOf(data[i + 1].anchor, start) : source.length;
  if (end === -1) {
    problems.push(`${id}: next anchor not found after ${start}: ${data[i + 1].anchor}`);
    return null;
  }
  const text = source.slice(start, end);
  if (!text.startsWith(entry.anchor)) problems.push(`${id}: slice does not start at anchor`);
  if (text.length === 0) problems.push(`${id}: empty slice`);

  const spoken = entry.kind === "action" ? null : entry.spoken ?? null;
  if (entry.kind !== "action" && !spoken) problems.push(`${id}: ${entry.kind} needs spoken_text`);
  if (entry.kind === "action" && entry.spoken) problems.push(`${id}: action must not have spoken_text`);

  const charCount = spoken ? countChars(spoken) : 0;
  let rate = null;
  let estimated;
  let blocks;
  if (entry.kind === "action") {
    estimated = entry.sec ?? 6;
    if (!(estimated >= 4 && estimated <= 8)) problems.push(`${id}: action sec out of 4-8`);
    if (estimated > 6) warnings.push(`${id}: action beat longer than 6s`);
    blocks = 1;
  } else {
    const key = entry.intense ? "spoken_on_screen_intense" : entry.voice;
    rate = RATE[key];
    if (!rate) problems.push(`${id}: no rate for voice "${entry.voice}"`);
    estimated = Math.max(5, Math.ceil(charCount / rate) + 1);
    blocks = Math.ceil(estimated / 7);
  }

  const scenes = [entry.loc];
  const refImages = [{ role: "scene", ref: entry.loc, note: entry.sceneNote ?? "" }];
  for (const ref of entry.chars) refImages.push({ role: "character", ref, note: "identity plate, same folder across the chapter" });
  for (const ref of entry.props) refImages.push({ role: "prop", ref, note: "prop plate, shared across the chapter" });

  const refs = (callbacks[entry.anchor] ?? []).map((r) => ({
    segment_ref: r.segment_ref,
    why: r.why,
    manifestation: r.manifestation
  }));

  cursor = end;

  return {
    id,
    order: i + 1,
    source_start: start,
    source_end: end,
    source: text,
    kind: entry.kind,
    split_reason: entry.reason,
    location_ref: entry.loc,
    character_refs: [...entry.chars],
    prop_refs: [...entry.props],
    reference_images: refImages,
    context: entry.context,
    visual_context: entry.visual,
    continuity: entry.continuity,
    voice_intent: entry.voice,
    ...(anonymousVoiceNote(entry) ? { voice_note: anonymousVoiceNote(entry) } : {}),
    ...(entry.kind === "dialogue" ? { speaker_ref: entry.speaker ?? null } : {}),
    spoken_text: spoken,
    char_count: charCount,
    rate_chars_per_sec: rate,
    estimated_sec: estimated,
    render_blocks: blocks,
    references: refs
  };
});

/* ------------------------------------------------------------------ checks */

const validReasons = new Set([
  "chapter_start",
  "paragraph_break",
  "time_shift",
  "location_change",
  "focus_change",
  "voice_change",
  "duration_split"
]);
const validKinds = new Set(["dialogue", "narration", "action"]);
const validVoices = new Set(["spoken_on_screen", "internal_monologue", "remembered_voice", "narrator", "none"]);

if (segments.some((s) => s === null)) {
  console.error(problems.join("\n"));
  process.exit(1);
}

const joined = segments.map((s) => s.source).join("");
if (joined !== source) problems.push("segments do not reassemble story_ch0.txt");
if (createHash("sha256").update(joined).digest("hex") !== sha256) problems.push("joined sha256 mismatch");
if (segments[0].source_start !== 0) problems.push("first segment does not start at 0");
if (segments.at(-1).source_end !== source.length) problems.push("last segment does not end at EOF");

const ids = new Set();
for (const [i, s] of segments.entries()) {
  if (ids.has(s.id)) problems.push(`duplicate id ${s.id}`);
  ids.add(s.id);
  if (!validKinds.has(s.kind)) problems.push(`${s.id}: bad kind ${s.kind}`);
  if (!validReasons.has(s.split_reason)) problems.push(`${s.id}: bad split_reason ${s.split_reason}`);
  if (!validVoices.has(s.voice_intent)) problems.push(`${s.id}: bad voice_intent ${s.voice_intent}`);
  if (s.source_end - s.source_start !== s.source.length) problems.push(`${s.id}: source length != offset span`);
  if (i > 0 && segments[i - 1].source_end !== s.source_start) problems.push(`${s.id}: gap or overlap at offset ${s.source_start}`);
  if (s.source.length === 0) problems.push(`${s.id}: empty source`);

  // reference rules
  if (s.reference_images[0]?.role !== "scene") problems.push(`${s.id}: first reference is not the scene`);
  if (s.reference_images.length > 9) problems.push(`${s.id}: more than 9 reference plates`);
  for (const r of s.reference_images) {
    const e = byId.get(r.ref);
    if (!e) {
      problems.push(`${s.id}: unknown entity ${r.ref}`);
      continue;
    }
    const expected = r.role === "scene" ? "location" : r.role;
    if (e.kind !== expected) problems.push(`${s.id}: ${r.ref} is ${e.kind}, used as ${r.role}`);
  }
  if (!byId.get(s.location_ref) || byId.get(s.location_ref).kind !== "location") {
    problems.push(`${s.id}: bad location_ref ${s.location_ref}`);
  }
  for (const c of s.character_refs) {
    if (byId.get(c)?.kind !== "character") problems.push(`${s.id}: bad character_ref ${c}`);
  }
  for (const p of s.prop_refs) {
    if (byId.get(p)?.kind !== "prop") problems.push(`${s.id}: bad prop_ref ${p}`);
  }
  if (s.kind === "dialogue" && s.speaker_ref && byId.get(s.speaker_ref)?.kind !== "character") {
    problems.push(`${s.id}: bad speaker_ref ${s.speaker_ref}`);
  }

  // references may only point backwards
  for (const r of s.references) {
    const target = segments.find((x) => x.id === r.segment_ref);
    if (!target) problems.push(`${s.id}: reference to unknown ${r.segment_ref}`);
    else if (target.order >= s.order) problems.push(`${s.id}: reference not pointing backwards (${r.segment_ref})`);
  }

  // duration sanity
  if (s.kind !== "action" && s.render_blocks !== Math.ceil(s.estimated_sec / 7)) {
    problems.push(`${s.id}: render_blocks does not match estimated_sec`);
  }
  if (s.kind === "action" && s.render_blocks !== 1) problems.push(`${s.id}: action must be 1 block`);
  if (s.kind !== "action" && s.char_count !== countChars(s.spoken_text)) {
    problems.push(`${s.id}: char_count mismatch`);
  }
}

// first_seen, then verify every inventory entity actually appears
const firstSeen = new Map();
for (const s of segments) {
  for (const ref of [s.location_ref, ...s.character_refs, ...s.prop_refs]) {
    if (!firstSeen.has(ref)) firstSeen.set(ref, s.id);
  }
}
for (const e of allEntities) {
  if (!firstSeen.has(e.id)) problems.push(`entity ${e.id} is never used by a segment`);
}

const withFirstSeen = (list) => list.map((e) => ({ ...e, first_seen: firstSeen.get(e.id) ?? null }));

if (problems.length > 0) {
  console.error("PLAN INVALID\n" + problems.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}

/* ------------------------------------------------------------------ output */

const plan = {
  version: "1.0",
  stage: "plan",
  project_title: "Chapter_00_Before_The_Sudden_Change",
  source: {
    file: "story_ch0.txt",
    original_file: "story_ch0.html",
    extraction:
      "extract_story.mjs: Penana <p> paragraphs, per-paragraph watermark spans and display:none blocks removed, paragraphs joined with LF; the txt has no trailing newline",
    chapter: 0,
    title: "序章：驟變之前",
    chars: [...source].length,
    sha256,
    eol: "lf",
    range: { start: 0, end: source.length }
  },
  entities: {
    characters: withFirstSeen(entities.characters),
    props: withFirstSeen(entities.props),
    locations: withFirstSeen(entities.locations)
  },
  segments
};

writeFileSync(PLAN_FILE, JSON.stringify(plan, null, 2) + "\n", "utf8");

const totals = segments.reduce(
  (a, s) => {
    a.seconds += s.estimated_sec;
    a.blocks += s.render_blocks;
    return a;
  },
  { seconds: 0, blocks: 0 }
);

console.log(
  JSON.stringify(
    {
      plan: "plan.ch0.json",
      segments: segments.length,
      chars: [...source].length,
      sha256,
      estimated_sec: totals.seconds,
      render_blocks: totals.blocks,
      entities: {
        characters: entities.characters.length,
        props: entities.props.length,
        locations: entities.locations.length
      },
      warnings,
      callbacks: segments.filter((s) => s.references.length > 0).length
    },
    null,
    2
  )
);
