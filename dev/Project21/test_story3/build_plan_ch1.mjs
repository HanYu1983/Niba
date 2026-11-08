/**
 * Build + validate plan.ch1.json from story_ch1.txt.
 *
 * Entities are not copied by hand. `data_entities.mjs` is the story-wide registry; this builder
 * merges it with the chapter-1 additions/variants, then emits only the entities that the chapter
 * actually references. `first_seen` is recomputed per chapter, so it points at a segment id that
 * exists in this plan.
 *
 * Run: node test_story3/build_plan_ch1.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { entities } from "./data_entities.mjs";
import { additions, overrides } from "./data_entities_ch1.mjs";
import { segmentsA } from "./data_segments_ch1_a.mjs";
import { segmentsB } from "./data_segments_ch1_b.mjs";
import { segmentsC } from "./data_segments_ch1_c.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const STORY_FILE = resolve(HERE, "story_ch1.txt");
const PLAN_FILE = resolve(HERE, "plan.ch1.json");

const source = readFileSync(STORY_FILE, "utf8");
const sha256 = createHash("sha256").update(source).digest("hex");

const problems = [];
const warnings = [];

/* ------------------------------------------------------------------ entity registry */

const flatten = (groups, origin) => [
  ...(groups.characters ?? []).map((e) => ({ ...e, kind: "character", origin })),
  ...(groups.props ?? []).map((e) => ({ ...e, kind: "prop", origin })),
  ...(groups.locations ?? []).map((e) => ({ ...e, kind: "location", origin }))
];

const registry = new Map();

for (const e of flatten(entities, "registry")) {
  if (registry.has(e.id)) problems.push(`duplicate entity id in registry: ${e.id}`);
  else registry.set(e.id, e);
}

for (const e of flatten(additions, "ch1")) {
  if (registry.has(e.id)) problems.push(`ch1 entity ${e.id} already exists in the registry (use overrides or a new id)`);
  else registry.set(e.id, e);
}

for (const [id, patch] of Object.entries(overrides)) {
  const base = registry.get(id);
  if (!base) {
    problems.push(`override targets unknown entity: ${id}`);
    continue;
  }
  registry.set(id, { ...base, ...patch, id });
}

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

const data = [...segmentsA, ...segmentsB, ...segmentsC];

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

  const refImages = [{ role: "scene", ref: entry.loc, note: entry.sceneNote ?? "" }];
  for (const ref of entry.chars) refImages.push({ role: "character", ref, note: "identity plate, same folder across the chapter" });
  for (const ref of entry.props) refImages.push({ role: "prop", ref, note: "prop plate, shared across the chapter" });

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
    ...(entry.kind === "dialogue" ? { speaker_ref: entry.speaker ?? null } : {}),
    spoken_text: spoken,
    char_count: charCount,
    rate_chars_per_sec: rate,
    estimated_sec: estimated,
    render_blocks: blocks,
    references: []
  };
});

if (segments.some((s) => s === null)) {
  console.error(problems.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}

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
const validVoices = new Set(["spoken_on_screen", "spoken_on_screen_intense", "internal_monologue", "remembered_voice", "narrator", "none"]);

const joined = segments.map((s) => s.source).join("");
if (joined !== source) problems.push("segments do not reassemble story_ch1.txt");
if (createHash("sha256").update(joined).digest("hex") !== sha256) problems.push("joined sha256 mismatch");
if (segments[0].source_start !== 0) problems.push("first segment does not start at 0");
if (segments.at(-1).source_end !== source.length) problems.push("last segment does not end at EOF");

const ids = new Set();
const used = new Set();

for (const [i, s] of segments.entries()) {
  if (ids.has(s.id)) problems.push(`duplicate id ${s.id}`);
  ids.add(s.id);
  if (!validKinds.has(s.kind)) problems.push(`${s.id}: bad kind ${s.kind}`);
  if (!validReasons.has(s.split_reason)) problems.push(`${s.id}: bad split_reason ${s.split_reason}`);
  if (!validVoices.has(s.voice_intent)) problems.push(`${s.id}: bad voice_intent ${s.voice_intent}`);
  if (s.source_end - s.source_start !== s.source.length) problems.push(`${s.id}: source length != offset span`);
  if (i > 0 && segments[i - 1].source_end !== s.source_start) problems.push(`${s.id}: gap or overlap at offset ${s.source_start}`);
  if (s.source.length === 0) problems.push(`${s.id}: empty source`);

  if (s.reference_images[0]?.role !== "scene") problems.push(`${s.id}: first reference is not the scene`);
  if (s.reference_images.length > 9) problems.push(`${s.id}: more than 9 reference plates`);

  for (const ref of [s.location_ref, ...s.character_refs, ...s.prop_refs]) used.add(ref);

  for (const r of s.reference_images) {
    const e = registry.get(r.ref);
    if (!e) {
      problems.push(`${s.id}: unknown entity ${r.ref}`);
      continue;
    }
    const expected = r.role === "scene" ? "location" : r.role;
    if (e.kind !== expected) problems.push(`${s.id}: ${r.ref} is ${e.kind}, used as ${r.role}`);
  }
  if (registry.get(s.location_ref)?.kind !== "location") problems.push(`${s.id}: bad location_ref ${s.location_ref}`);
  for (const c of s.character_refs) {
    if (registry.get(c)?.kind !== "character") problems.push(`${s.id}: bad character_ref ${c}`);
  }
  for (const p of s.prop_refs) {
    if (registry.get(p)?.kind !== "prop") problems.push(`${s.id}: bad prop_ref ${p}`);
  }
  if (s.kind === "dialogue" && s.speaker_ref && registry.get(s.speaker_ref)?.kind !== "character") {
    problems.push(`${s.id}: bad speaker_ref ${s.speaker_ref}`);
  }

  if (s.kind !== "action" && s.render_blocks !== Math.ceil(s.estimated_sec / 7)) {
    problems.push(`${s.id}: render_blocks does not match estimated_sec`);
  }
  if (s.kind === "action" && s.render_blocks !== 1) problems.push(`${s.id}: action must be 1 block`);
  if (s.kind !== "action" && s.char_count !== countChars(s.spoken_text)) {
    problems.push(`${s.id}: char_count mismatch`);
  }
}

// first_seen, recomputed for this chapter only
const firstSeen = new Map();
for (const s of segments) {
  for (const ref of [s.location_ref, ...s.character_refs, ...s.prop_refs]) {
    if (!firstSeen.has(ref)) firstSeen.set(ref, s.id);
  }
}

const pickUsed = (list) =>
  list
    .filter((e) => used.has(e.id))
    .map(({ kind, origin, ...e }) => ({ ...e, first_seen: firstSeen.get(e.id) ?? null }));

const planEntities = {
  characters: pickUsed([
    ...entities.characters,
    ...additions.characters
  ]),
  props: pickUsed([
    ...entities.props,
    ...additions.props
  ]),
  locations: pickUsed([
    ...entities.locations,
    ...additions.locations
  ])
};

if (problems.length > 0) {
  console.error("PLAN INVALID\n" + problems.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}

/* ------------------------------------------------------------------ output */

const plan = {
  version: "1.0",
  stage: "plan",
  project_title: "Chapter_01_The_Price_Of_Kindness",
  source: {
    file: "story_ch1.txt",
    original_file: "story_ch1.html",
    extraction:
      "workspace/tools/extract_penana.mjs: Penana <p> paragraphs, per-paragraph watermark spans and display:none blocks removed, paragraphs joined with LF; the txt has no trailing newline",
    chapter: 1,
    title: "第一話：好人的代價",
    chars: [...source].length,
    sha256,
    eol: "lf",
    range: { start: 0, end: source.length }
  },
  entities: planEntities,
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
      plan: "plan.ch1.json",
      segments: segments.length,
      chars: [...source].length,
      sha256,
      estimated_sec: totals.seconds,
      render_blocks: totals.blocks,
      entity_usage: {
        registry: flatten(entities, "registry").length,
        ch1_additions: flatten(additions, "ch1").length,
        emitted: planEntities.characters.length + planEntities.props.length + planEntities.locations.length
      },
      first_seen: {
        characters: planEntities.characters.map((e) => [e.id, e.first_seen]),
        props: planEntities.props.map((e) => [e.id, e.first_seen]),
        locations: planEntities.locations.map((e) => [e.id, e.first_seen])
      },
      warnings
    },
    null,
    2
  )
);
