/**
 * Build + validate plan.ch0.json and story_ch0.txt from data_ch0.mjs.
 *
 * One beat in data_ch0.mjs = one plan segment. The builder:
 *   1. writes the readable script (story_ch0.txt) with speaker labels and stage directions;
 *   2. records exact offsets, so source slices are contiguous by construction;
 *   3. derives char_count / estimated_sec / render_blocks / first_seen / voice profiles;
 *   4. resolves callback references by beat key (never by hard-coded seg ids);
 *   5. refuses to write a plan that breaks workspace/lib/plan.mjs.
 *
 * Run: node build_plan_ch0.mjs
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { validatePlan } from "../workspace/lib/plan.mjs";
import { chapter, framing } from "./data_ch0.mjs";
import { entities } from "./data_entities_ch0.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE_FILE = resolve(HERE, "story_ch0.txt");
const PLAN_FILE = resolve(HERE, "plan.ch0.json");

/* ------------------------------------------------------------------ inventory */

const allEntities = [
  ...entities.characters.map((e) => ({ ...e, kind: "character" })),
  ...entities.props.map((e) => ({ ...e, kind: "prop" })),
  ...entities.locations.map((e) => ({ ...e, kind: "location" }))
];
const byId = new Map(allEntities.map((e) => [e.id, e]));

const problems = [];
const warnings = [];

for (const e of allEntities) {
  if (!e.reference || e.reference.status !== "ready") warnings.push(`entity ${e.id} has no ready reference plate`);
}
for (const c of entities.characters) {
  if (!c.voice) problems.push(`character ${c.id} has no voice profile`);
  if (!c.source_label) problems.push(`character ${c.id} has no source_label`);
}

/* ------------------------------------------------------------------ source text */

const parts = [];
let offset = 0;
const beats = [];

function countChars(text) {
  const CN_ALNUM = /[\u3400-\u4dbf\u4e00-\u9fff0-9A-Za-z]/u;
  return [...text].filter((ch) => CN_ALNUM.test(ch)).length;
}

function labelOf(who) {
  const e = byId.get(who);
  return e?.source_label ?? e?.name ?? who;
}

chapter.scenes.forEach((scene, sceneIndex) => {
  if (!byId.get(scene.loc) || byId.get(scene.loc).kind !== "location") {
    problems.push(`scene ${scene.key}: bad loc ${scene.loc}`);
  }
  for (const c of scene.chars) {
    if (byId.get(c)?.kind !== "character") problems.push(`scene ${scene.key}: bad character ${c}`);
  }
  for (const p of scene.props) {
    if (byId.get(p)?.kind !== "prop") problems.push(`scene ${scene.key}: bad prop ${p}`);
  }
  if (!Array.isArray(scene.beats) || !scene.beats.length) problems.push(`scene ${scene.key} has no beats`);
  if (!framing[scene.key]) warnings.push(`scene ${scene.key}: no framing / background note`);

  let sceneHeaderStart = null;
  if (sceneIndex > 0) {
    sceneHeaderStart = offset;
    const header = `\n【${scene.title}】\n`;
    parts.push(header);
    offset += header.length;
  }

  let firstBeatInScene = true;
  for (const beat of scene.beats ?? []) {
    let line;
    if (beat.voice === "scene") {
      if (!beat.stage) problems.push(`scene ${scene.key}: silent beat has no stage`);
      if (beat.line) problems.push(`scene ${scene.key}: silent beat must not carry a line`);
      line = `（${beat.stage}）`;
    } else {
      const who = byId.get(beat.who);
      if (!who || who.kind !== "character") {
        problems.push(`scene ${scene.key}: unknown speaker ${beat.who}`);
        continue;
      }
      if (!beat.line) problems.push(`scene ${scene.key}: ${beat.voice} beat has no line`);
      const tag =
        beat.sourceTag ??
        (beat.voice === "inner" ? (beat.who === "char_cat" ? "（心聲）" : "（旁白）") : "");
      const stage = beat.stage ? `（${beat.stage}）` : "";
      line = `${labelOf(beat.who)}${tag}：${stage}${beat.line ?? ""}`;
    }

    const start = firstBeatInScene && sceneHeaderStart !== null ? sceneHeaderStart : offset;
    firstBeatInScene = false;
    const text = `${line}\n`;
    parts.push(text);
    offset += text.length;

    beats.push({
      ...beat,
      scene,
      sceneIndex,
      order: beats.length + 1,
      source_start: start,
      source_end: null,
      source_line: line,
      source: null
    });
  }
});

const source = parts.join("");

/* absolute offsets for source_end */
beats.forEach((b, i) => {
  b.source_end = i + 1 < beats.length ? beats[i + 1].source_start : source.length;
  b.source = source.slice(b.source_start, b.source_end);
  if (!b.source.includes(b.source_line)) problems.push(`beat ${b.order}: slice does not contain its line`);
  if (b.source_start !== (i === 0 ? 0 : beats[i - 1].source_end)) problems.push(`beat ${b.order}: offset gap`);
});

const sha256 = createHash("sha256").update(source).digest("hex");
if (beats.map((b) => b.source).join("") !== source) problems.push("segments do not reassemble the source");
if (beats[0]?.source_start !== 0) problems.push("first beat does not start at 0");
if (beats.at(-1)?.source_end !== source.length) problems.push("last beat does not end at EOF");

/* ------------------------------------------------------------------ plan segments */

const RATE = {
  dialogue: 5.0,
  dialogue_intense: 4.5,
  inner: 4.0,
  narration: 5.0
};

const firstSeen = new Map();
const keyToId = new Map();

const segments = beats.map((b) => {
  const scene = b.scene;
  const id = `seg_${String(b.order).padStart(3, "0")}`;
  if (b.key) keyToId.set(b.key, id);

  const isSilent = b.voice === "scene";
  const structuralKind = isSilent ? "action" : b.voice === "dialogue" ? "dialogue" : "narration";
  const voiceIntent = isSilent
    ? "none"
    : b.voice === "dialogue"
      ? b.intense
        ? "spoken_on_screen_intense"
        : "spoken_on_screen"
      : "internal_monologue";

  const spoken = isSilent ? null : b.line;
  const chars = spoken ? countChars(spoken) : 0;

  let rate = null;
  let estimated;
  let blocks;
  if (isSilent) {
    estimated = b.sec ?? 5;
    if (!(estimated >= 4 && estimated <= 8)) problems.push(`${id}: silent beat sec out of 4-8`);
    blocks = 1;
  } else {
    rate = b.voice === "dialogue" ? (b.intense ? RATE.dialogue_intense : RATE.dialogue) : RATE.inner;
    estimated = Math.max(5, Math.ceil(chars / rate) + 1);
    blocks = Math.ceil(estimated / 7);
  }

  const speaker = isSilent ? null : b.who;
  const ent = speaker ? byId.get(speaker) : null;
  const voice = isSilent
    ? { kind: "scene", speaker: null, pov: null }
    : {
        kind: b.voice,
        speaker,
        pov: b.who,
        gender: ent.voice.gender,
        age: ent.voice.age,
        timbre: ent.voice.timbre
      };

  const shotChars = b.chars ?? scene.chars;
  const shotProps = b.props ?? scene.props;

  const refImages = [
    { role: "scene", ref: scene.loc, note: scene.sceneNote ?? "" },
    ...shotChars.map((ref) => ({ role: "character", ref, note: "identity plate, shared across the chapter" })),
    ...shotProps.map((ref) => ({ role: "prop", ref, note: "prop plate, shared across the chapter" }))
  ];
  if (refImages.length > 9) problems.push(`${id}: ${refImages.length} reference plates, max 9`);

  const prev = beats[b.order - 2];
  let splitReason;
  if (b.order === 1) splitReason = "chapter_start";
  else if (b.sceneIndex !== prev.sceneIndex) splitReason = prev.scene.loc === scene.loc ? "time_shift" : "location_change";
  else if (isSilent) splitReason = "focus_change";
  else if (prev.voice === b.voice && prev.who === b.who) splitReason = "paragraph_break";
  else splitReason = "voice_change";

  const shotFraming = b.framing ?? framing[scene.key] ?? "keep the location readable behind the subject";

  const focus = isSilent
    ? `${b.stage}（無對白）`
    : b.voice === "inner"
      ? `${labelOf(b.who)} 的心聲，畫面人物嘴唇不動${b.stage ? `；${b.stage}` : ""}`
      : `${labelOf(b.who)}開口${b.stage ? `；${b.stage}` : ""}`;

  for (const ref of [scene.loc, ...shotChars, ...shotProps]) {
    if (!firstSeen.has(ref)) firstSeen.set(ref, id);
  }

  return {
    id,
    order: b.order,
    source_start: b.source_start,
    source_end: b.source_end,
    source: b.source,
    kind: structuralKind,
    split_reason: splitReason,
    location_ref: scene.loc,
    character_refs: [...shotChars],
    prop_refs: [...shotProps],
    reference_images: refImages,
    context: scene.context,
    visual_context: `${scene.visual}｜景別與背景：${shotFraming}｜本格焦點：${focus}`,
    continuity: scene.continuity,
    voice_intent: voiceIntent,
    voice,
    ...(b.voice === "inner" ? { voice_note: "inner monologue bound to the POV character; on-screen lips stay still, no narrator" } : {}),
    ...(b.voice === "dialogue" ? { speaker_ref: speaker } : {}),
    spoken_text: spoken,
    char_count: chars,
    rate_chars_per_sec: rate,
    estimated_sec: estimated,
    render_blocks: blocks,
    references: []
  };
});

/* ------------------------------------------------------------------ callbacks */

for (const [i, b] of beats.entries()) {
  if (!b.refs?.length) continue;
  const seg = segments[i];
  for (const r of b.refs) {
    const target = keyToId.get(r.key);
    if (!target) {
      problems.push(`${seg.id}: callback key "${r.key}" not found`);
      continue;
    }
    const targetSeg = segments.find((s) => s.id === target);
    if (!targetSeg || targetSeg.order >= seg.order) {
      problems.push(`${seg.id}: callback ${target} is not earlier`);
      continue;
    }
    seg.references.push({ segment_ref: target, why: r.why, manifestation: r.manifestation });
  }
}

/* ------------------------------------------------------------------ checks */

const used = new Set();
for (const s of segments) {
  for (const ref of [s.location_ref, ...s.character_refs, ...s.prop_refs]) used.add(ref);
}
for (const e of allEntities) {
  if (!firstSeen.has(e.id)) problems.push(`entity ${e.id} is never used by a segment`);
  if (!used.has(e.id)) problems.push(`entity ${e.id} is not in any segment ref list`);
}

const withFirstSeen = (list) => list.map((e) => ({ ...e, first_seen: firstSeen.get(e.id) ?? null }));

const plan = {
  version: "1.0",
  stage: "plan",
  project_title: "別境 · 雙生換命 — Chapter 00 相遇與換命",
  source: {
    file: "story_ch0.txt",
    original_file: "doc/story.md",
    extraction:
      "data_ch0.mjs → story_ch0.txt: dialogue transcribed from doc/story.md 序章至場七（frame01–frame17），舞台指示以全形括號保留；旁白段落判為角色第一人稱心聲（inner），不用中性旁白",
    chapter: 0,
    title: "相遇與換命",
    frames: "frame01–frame17",
    ends_at: "換衣完成（frame17 扣上項圈）",
    chars: source.length,
    sha256,
    eol: "lf",
    range: { start: 0, end: source.length }
  },
  style: {
    look:
      "Photorealistic live-action Chinese period drama, 35mm film, fine grain, natural skin texture, real-world photography, shallow depth of field, grounded historical realism — not anime, not cartoon, not illustration, not cel shading, not an advertisement, not slow motion, no on-screen text",
    palace_palette: "deep crimson, black and gold; silk sheen, embroidered surfaces, jewellery that catches light",
    market_palette: "grey-blue, rice white and ochre; patched cloth with small embroidered flowers, clean but worn",
    crossing_rule: "the two palettes never collide except in the exchange scenes, where one garment is worn by the other woman",
    motif:
      "two identical faces; a gold crown shaped like cat ears; the grey-white Persian cat sits on the central axis of almost every shot",
    light: {
      dawn_interior: "soft flat dawn light through paper windows",
      throne_hall: "low warm shaft light and incense haze",
      night_exterior: "low-key practical lantern light",
      rain: "soft overcast rainy night light with wet reflections",
      dusk_boat: "low amber dusk light through the cabin window",
      candle: "single warm candle key with deep falloff"
    }
  },
  voice_guide: {
    rule: "one voice per segment; never mix dialogue and inner monologue in the same shot",
    dialogue: "on-screen speaker, lips move, voice profile comes from the character entity",
    inner: "the POV character's own voice, close and dry, no room reverb; on-screen lips stay still",
    narration: "reserved for a single narrator voice; not used in ch0",
    scene: "no <d> block at all"
  },
  entities: {
    characters: withFirstSeen(entities.characters),
    props: withFirstSeen(entities.props),
    locations: withFirstSeen(entities.locations)
  },
  segments
};

const structural = validatePlan(plan);
problems.push(...structural.problems);
warnings.push(...structural.warnings);

/* story-specific checks on top of the generic ones */
for (const s of segments) {
  if (!["dialogue", "inner", "narration", "scene"].includes(s.voice.kind)) {
    problems.push(`${s.id}: bad voice.kind ${s.voice.kind}`);
  }
  if (s.voice.kind !== "scene" && !byId.get(s.voice.speaker)) {
    problems.push(`${s.id}: voice.speaker is not an entity`);
  }
  if (s.voice.kind === "inner" && !s.character_refs.includes(s.voice.pov)) {    problems.push(`${s.id}: inner POV ${s.voice.pov} is not in the shot`);
  }
  if (s.kind !== "action" && s.char_count !== countChars(s.spoken_text)) {
    problems.push(`${s.id}: char_count mismatch`);
  }
  if (s.kind !== "action" && s.render_blocks !== Math.ceil(s.estimated_sec / 7)) {
    problems.push(`${s.id}: render_blocks mismatch`);
  }
}

if (problems.length) {
  console.error("PLAN INVALID\n" + problems.map((p) => ` - ${p}`).join("\n"));
  process.exit(1);
}

/* ------------------------------------------------------------------ write */

writeFileSync(SOURCE_FILE, source, "utf8");
writeFileSync(PLAN_FILE, JSON.stringify(plan, null, 2) + "\n", "utf8");

const totals = segments.reduce(
  (a, s) => {
    a.seconds += s.estimated_sec;
    a.blocks += s.render_blocks;
    a.dialogue += s.kind === "dialogue" ? 1 : 0;
    a.inner += s.voice.kind === "inner" ? 1 : 0;
    a.silent += s.kind === "action" ? 1 : 0;
    return a;
  },
  { seconds: 0, blocks: 0, dialogue: 0, inner: 0, silent: 0 }
);

console.log(
  JSON.stringify(
    {
      plan: "plan.ch0.json",
      source: "story_ch0.txt",
      chars: source.length,
      sha256,
      scenes: chapter.scenes.length,
      segments: segments.length,
      dialogue: totals.dialogue,
      inner: totals.inner,
      silent: totals.silent,
      estimated_sec: totals.seconds,
      estimated_min: Number((totals.seconds / 60).toFixed(1)),
      render_blocks: totals.blocks,
      entities: {
        characters: entities.characters.length,
        props: entities.props.length,
        locations: entities.locations.length
      },
      callbacks: segments.filter((s) => s.references.length > 0).map((s) => ({ id: s.id, refs: s.references.map((r) => r.segment_ref) })),
      warnings
    },
    null,
    2
  )
);
