import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { ENTITIES } from "./entities.mjs";
import { SEGMENTS as SEGMENTS_A } from "./segments_a.mjs";
import { SEGMENTS_B } from "./segments_b.mjs";
import { BEATS_A } from "./beats_a.mjs";
import { BEATS_B } from "./beats_b.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const STORY_PATH = path.join(ROOT, "doc", "story.md");
const story = fs.readFileSync(STORY_PATH, "utf8");
const SEGMENTS = [...SEGMENTS_A, ...SEGMENTS_B];
const BEATS = [...BEATS_A, ...BEATS_B];

const countChars = (text) =>
  [...(text || "")].filter((ch) => /[\u3400-\u9FFF\u3040-\u30FFA-Za-z0-9]/.test(ch))
    .length;

const sha256 = (text) =>
  crypto.createHash("sha256").update(text, "utf8").digest("hex");

const entityIndex = new Map();
for (const [kind, list] of Object.entries(ENTITIES)) {
  for (const entity of list) entityIndex.set(entity.id, { ...entity, kind });
}

const IDENTITY = {
  char_momo: {
    ethnicity: "East Asian (Japanese)",
    age: "About 20",
    face_and_hair:
      "Fair skin, long light-brown hair in a high ponytail tied with a red ribbon, straight bangs, large warm dark eyes, light freckles",
    physique: "Athletic slim build",
    vibe: "Determined, open, warm, stubborn in a good way",
  },
  char_shiro: {
    ethnicity: "Japanese Shiba Inu",
    age: "Adult",
    face_and_hair: "Tan and cream fur, pointed ears, bright intelligent eyes, curled tail",
    physique: "Compact sturdy body",
    vibe: "Alert, loyal, quiet courage",
  },
  char_gon: {
    ethnicity: "Japanese macaque",
    age: "Adult",
    face_and_hair: "Reddish-brown fur, pale face, expressive dark eyes",
    physique: "Lean wiry body",
    vibe: "Mischievous, quick, secretly loyal",
  },
  char_peach: {
    ethnicity: "Japanese green pheasant",
    age: "Adult",
    face_and_hair: "Iridescent green and copper plumage, long sweeping tail, red face wattles",
    physique: "Slim bird body",
    vibe: "Watchful, proud, noisy",
  },
  char_grandma: {
    ethnicity: "East Asian (Japanese)",
    age: "Late seventies",
    face_and_hair: "Silver hair in a low bun, deep kind wrinkles, weathered hands, gentle steady eyes",
    physique: "Small stooped frame",
    vibe: "Warm, tough, quietly funny",
  },
  char_kiha: {
    ethnicity: "East Asian (Japanese)",
    age: "Late sixties",
    face_and_hair: "Wind-burnt weathered face, grey stubble, matted dark hair, wary deep-set eyes",
    physique: "Broad work-hardened build",
    vibe: "Grave, rustic, burdened by what he saw",
  },
  char_genzo: {
    ethnicity: "East Asian (islander)",
    age: "Late seventies",
    face_and_hair: "Long white hair and beard, gaunt weathered face, deep scars and calluses, hollow proud eyes",
    physique: "Thin, bent, but stubborn",
    vibe: "Frightened, dignified, desperate to protect",
  },
  char_oni_king: {
    ethnicity: "Oni",
    age: "Ancient",
    face_and_hair: "Deep red skin, two black curved horns, burning red eyes, heavy brow and tusks",
    physique: "Mountain-like muscular build",
    vibe: "Colossal, cold, absolute",
  },
  char_oni_general: {
    ethnicity: "Oni",
    age: "Adult",
    face_and_hair: "Red skin, one broken tusk, scarred face, small horns",
    physique: "Pillar-thick arms, massive armoured build",
    vibe: "Brutal, contemptuous, dutiful",
  },
  char_oni_cub: {
    ethnicity: "Oni",
    age: "Young",
    face_and_hair: "Red skin and fur, short horns, round yellow eyes",
    physique: "Small wiry body",
    vibe: "Nervous, hungry, easily bribed",
  },
  char_oni_soldier: {
    ethnicity: "Oni",
    age: "Adult",
    face_and_hair: "Red skin, short horns, tusks, heavy jaw",
    physique: "Squat muscular body",
    vibe: "Disciplined, anonymous, threatening",
  },
  char_akita: {
    ethnicity: "Japanese Akita",
    age: "Adult",
    face_and_hair: "Thick brown and white coat, broad head, dark small eyes",
    physique: "Large heavy build",
    vibe: "Exhausted, gentle, loyal",
  },
  char_villager: {
    ethnicity: "East Asian (Japanese)",
    age: "Middle-aged",
    face_and_hair: "Weathered round face, short black hair, stubble",
    physique: "Stocky build",
    vibe: "Blunt, teasing, secretly fond",
  },
};

// ---------------------------------------------------------------------------
// 1. Source slices
// ---------------------------------------------------------------------------
let cursor = story.indexOf(SEGMENTS[0].start);
if (cursor < 0) throw new Error("first segment marker not found");
const rangeStart = cursor;

const planSegments = SEGMENTS.map((seg, index) => {
  const start = story.indexOf(seg.start, cursor);
  if (start < 0) throw new Error(`${seg.key}: start marker not found: ${seg.start}`);
  if (start !== cursor) {
    throw new Error(
      `${seg.key}: gap or overlap before segment (expected ${cursor}, got ${start})`
    );
  }
  const end = seg.end === null ? story.length : story.indexOf(seg.end, start + 1);
  if (end < 0) throw new Error(`${seg.key}: end marker not found: ${seg.end}`);
  if (end <= start) throw new Error(`${seg.key}: empty segment`);
  cursor = end;
  const source = story.slice(start, end);
  const beats = BEATS.filter((b) => b.seg === seg.key);
  if (beats.length === 0) throw new Error(`${seg.key}: no beats`);

  const referenceImages = [
    { role: "scene", ref: seg.loc, note: `${entityIndex.get(seg.loc).name} establishing plate` },
    ...seg.chars.map((id) => ({
      role: "character",
      ref: id,
      note: "same identity plate across the chapter",
    })),
  ];

  const charCount = countChars(seg.spoken);
  const rate = seg.voice === "internal_monologue" ? 4.0 : 5.0;
  const estimatedSec =
    seg.kind === "action" ? 5 : Math.max(5, Math.ceil(charCount / rate) + 1);
  const renderBlocks = seg.kind === "action" ? 1 : Math.max(1, Math.ceil(estimatedSec / 7));

  return {
    id: seg.key,
    order: index + 1,
    source_start: start,
    source_end: end,
    source,
    kind: seg.kind,
    split_reason: seg.split,
    location_ref: seg.loc,
    character_refs: seg.chars,
    prop_refs: seg.props,
    reference_images: referenceImages,
    context: seg.context,
    visual_context: seg.visual,
    continuity: seg.continuity,
    voice_intent: seg.voice,
    spoken_text: seg.spoken,
    char_count: charCount,
    rate_chars_per_sec: seg.spoken ? rate : null,
    estimated_sec: estimatedSec,
    render_blocks: renderBlocks,
    references: seg.refs || [],
    ...(seg.source_note ? { source_note: seg.source_note } : {}),
  };
});

const declaredRange = story.slice(rangeStart, planSegments[planSegments.length - 1].source_end);
const joined = planSegments.map((s) => s.source).join("");
if (joined !== declaredRange) throw new Error("segments do not reassemble the declared range");
if (sha256(joined) !== sha256(declaredRange)) throw new Error("sha256 mismatch");
for (let i = 0; i < planSegments.length; i += 1) {
  const s = planSegments[i];
  if (s.source_end - s.source_start !== s.source.length) {
    throw new Error(`${s.id}: source length mismatch`);
  }
  if (i > 0 && planSegments[i - 1].source_end !== s.source_start) {
    throw new Error(`${s.id}: not contiguous`);
  }
}

// first_seen
const firstSeen = new Map();
for (const seg of planSegments) {
  const ids = new Set([seg.location_ref, ...seg.character_refs, ...seg.prop_refs]);
  for (const id of ids) if (!firstSeen.has(id)) firstSeen.set(id, seg.id);
}

const plan = {
  version: "1.0",
  stage: "plan",
  project_title: "New_Momotaro_Girl",
  source: {
    file: "doc/story.md",
    chapter: 0,
    chars: declaredRange.length,
    sha256: sha256(declaredRange),
    eol: story.includes("\r\n") ? "crlf" : "lf",
    range: { start: rangeStart, end: rangeStart + declaredRange.length },
  },
  entities: {
    characters: ENTITIES.characters.map((e) => ({
      id: e.id,
      name: e.name,
      aliases: e.aliases,
      traits: e.traits,
      first_seen: firstSeen.get(e.id) ?? planSegments[0].id,
      reference: e.reference,
    })),
    props: ENTITIES.props.map((e) => ({
      id: e.id,
      name: e.name,
      aliases: e.aliases,
      traits: e.traits,
      first_seen: firstSeen.get(e.id) ?? planSegments[0].id,
      reference: e.reference,
    })),
    locations: ENTITIES.locations.map((e) => ({
      id: e.id,
      name: e.name,
      aliases: e.aliases,
      traits: e.traits,
      first_seen: firstSeen.get(e.id) ?? planSegments[0].id,
      reference: e.reference,
    })),
  },
  segments: planSegments,
};

// ---------------------------------------------------------------------------
// 2. Blocks (generated from plan data only)
// ---------------------------------------------------------------------------
const projectEntities = {
  characters: ENTITIES.characters.map((e) => ({
    id: e.id,
    name: e.name,
    identity_features: IDENTITY[e.id],
    reference: e.reference,
  })),
  props: ENTITIES.props.map((e) => ({
    id: e.id,
    name: e.name,
    appearance: e.traits,
    reference: e.reference,
  })),
  locations: ENTITIES.locations.map((e) => ({
    id: e.id,
    name: e.name,
    description: e.traits,
    reference: e.reference,
  })),
};

const projectSegments = new Map(planSegments.map((s) => [s.id, s]));
const blockIds = new Set();
const blocks = [];
let t = 0;

const VOICE_MODES = {
  spoken_on_screen: {
    mode: "clean_dialogue_with_room_tone",
    type: "spoken_on_screen",
  },
  internal_monologue: {
    mode: "internal_monologue_with_room_tone",
    type: "internal_monologue",
  },
  narrator: { mode: "narrator_voiceover", type: "narration" },
};

const VOICE_PROMPTS = {
  char_momo:
    "Young Japanese woman, warm and natural, close-mic, tired but playful when relaxed, steady and defiant in battle",
  char_gon:
    "Small boyish monkey voice, bright and curious, deadpan, slightly raspy",
  char_grandma:
    "Aged Japanese grandmother, warm and frayed, fond and scolding",
  char_kiha:
    "Old Japanese fisherman, gravelly, rustic formal speech, grave and burdened",
  char_genzo:
    "Old Japanese island elder, trembling but dignified, desperate and proud",
  char_oni_general:
    "Deep rumbling oni warrior, contemptuous and slow",
  char_oni_cub:
    "Small squeaky oni-cub voice, suspicious then sulky",
  char_oni_soldier:
    "Low guttural oni soldier chorus, threatening",
  char_villager:
    "Middle-aged Japanese fisherman, blunt and teasing, shouted across the dock",
  narrator:
    "Measured Japanese narrator, warm and cinematic, broadcast-clear, slightly nostalgic",
};

for (const beat of BEATS) {
  const seg = SEGMENTS.find((s) => s.key === beat.seg);
  const planSeg = projectSegments.get(beat.seg);
  if (!seg || !planSeg) throw new Error(`${beat.slug}: unknown segment ${beat.seg}`);

  const chars = beat.chars ?? seg.chars;
  const props = beat.props ?? seg.props;
  const voice = beat.voice ?? seg.voice;
  const speaker = beat.speaker ?? seg.speaker ?? null;
  const silent = Boolean(beat.silent) || voice === "none";
  const blockId = `block_${beat.seg.replace("seg_", "")}_${beat.slug}`;
  if (blockIds.has(blockId)) throw new Error(`duplicate block id ${blockId}`);

  let duration;
  if (silent) {
    duration = beat.secs ?? 5;
  } else {
    const n = countChars((beat.lines || []).join(""));
    const rate = voice === "internal_monologue" ? 4 : 5;
    duration = Math.min(8, Math.max(4, Math.ceil(n / rate) + 1));
  }
  if (duration < 4 || duration > 8) throw new Error(`${blockId}: duration ${duration} out of 4-8s`);

  const reference_images = [
    {
      role: "scene",
      entity_ref: seg.loc,
      image: entityIndex.get(seg.loc).reference.image,
    },
    ...chars.map((id) => ({
      role: "character",
      entity_ref: id,
      image: entityIndex.get(id).reference.image,
    })),
  ];

  const present_characters = chars.map((id) => ({
    entity_ref: id,
    outfit: seg.outfits[id] ?? "Standard travel clothes",
    facial_state: beat.facial?.[id] ?? "Neutral, focused",
  }));

  const present_props = props.map((id) => ({ entity_ref: id }));

  let audio_control;
  if (silent) {
    audio_control = {
      audio_mode: "vintage_film_room_tone",
      speech_present: false,
      lip_sync_enabled: false,
      soundtrack_specification:
        beat.sound ??
        seg.sound ??
        "Continuous heavy 35mm optical film projector hiss, warm analog room tone filling the entire frequency spectrum.",
      visual_sound_sync:
        beat.sync ??
        "Purely mechanical and environmental acoustic design, closed sealed lips, zero vocalization, zero speech.",
    };
  } else {
    const vm = VOICE_MODES[voice];
    if (!vm) throw new Error(`${blockId}: unsupported voice ${voice}`);
    audio_control = {
      audio_mode: vm.mode,
      speech_present: true,
      lip_sync_enabled: voice === "spoken_on_screen",
      dialogue: {
        ...(speaker ? { speaker_ref: speaker } : {}),
        type: vm.type,
        language: "ja-JP",
        original_text: (beat.lines || []).join("\n"),
        voice_prompt:
          beat.voicePrompt ??
          (speaker ? VOICE_PROMPTS[speaker] : null) ??
          seg.voicePrompt,
      },
      soundtrack_specification:
        beat.sound ??
        seg.sound ??
        "Continuous warm analog room tone with vintage optical film hiss under the voice.",
      visual_sound_sync:
        beat.sync ??
        (voice === "spoken_on_screen"
          ? "Mouth moves in sync with the Japanese line; no other voice."
          : voice === "internal_monologue"
            ? "Lips sealed tight, jaw motionless; the voice is internal, no lip sync."
            : "No on-screen mouth movement; the narration is non-diegetic."),
    };
  }

  const referenced = [];
  const previousInSegment = [...blocks].reverse().find((b) => b._seg === beat.seg);
  if (previousInSegment) referenced.push(previousInSegment.id);
  for (const [refSeg, refSlug] of beat.refs || []) {
    const id = `block_${refSeg.replace("seg_", "")}_${refSlug}`;
    if (!blockIds.has(id)) throw new Error(`${blockId}: dangling ref ${id}`);
    if (!referenced.includes(id)) referenced.push(id);
  }
  // Plan references must survive into the block layer. The first block of a
  // segment carries any plan `references` not already expressed by a beat.
  if (!previousInSegment) {
    for (const ref of planSeg.references || []) {
      const prefix = `block_${ref.segment_ref.replace("seg_", "")}_`;
      if (referenced.some((id) => id.startsWith(prefix))) continue;
      const target = [...blocks].reverse().find((b) => b._seg === ref.segment_ref);
      if (!target) throw new Error(`${blockId}: plan ref ${ref.segment_ref} has no earlier block`);
      referenced.push(target.id);
    }
  }

  const block = {
    id: blockId,
    timeframe: { start_sec: t, end_sec: t + duration },
    location_ref: seg.loc,
    reference_images,
    present_characters,
    present_props,
    action: {
      ...(chars.length ? { subject_ref: speaker && chars.includes(speaker) ? speaker : chars[0] } : {}),
      ...(props.length ? { target_ref: props[0] } : {}),
      description: beat.action,
    },
    ...(referenced.length ? { referenced_blocks: referenced } : {}),
    audio_control,
  };
  Object.defineProperty(block, "_seg", { value: beat.seg, enumerable: false });
  blocks.push(block);
  blockIds.add(blockId);
  t += duration;
}

// ---------------------------------------------------------------------------
// 3. Validations
// ---------------------------------------------------------------------------
for (const s of planSegments) {
  if (!s.reference_images.length || s.reference_images[0].role !== "scene") {
    throw new Error(`${s.id}: first reference image is not scene`);
  }
  for (const ref of s.reference_images) {
    const entity = entityIndex.get(ref.ref);
    if (!entity) throw new Error(`${s.id}: unknown ref ${ref.ref}`);
    const expected = ref.role === "scene" ? "locations" : ref.role === "character" ? "characters" : "props";
    if (entity.kind !== expected) throw new Error(`${s.id}: role/type mismatch for ${ref.ref}`);
  }
  if ((s.kind === "dialogue" || s.kind === "narration") && !s.spoken_text) {
    throw new Error(`${s.id}: missing spoken_text`);
  }
  if (s.kind === "action" && s.spoken_text !== null) {
    throw new Error(`${s.id}: action segment has spoken_text`);
  }
  if (s.kind === "action" && s.render_blocks !== 1) {
    throw new Error(`${s.id}: action segment must render in 1 block`);
  }
  const ownBlocks = blocks.filter((b) => b._seg === s.id);
  if (ownBlocks.length < s.render_blocks) {
    throw new Error(`${s.id}: ${ownBlocks.length} blocks < render_blocks ${s.render_blocks}`);
  }
  for (const ref of s.references) {
    const target = planSegments.find((x) => x.id === ref.segment_ref);
    if (!target || target.order >= s.order) {
      throw new Error(`${s.id}: reference ${ref.segment_ref} is not earlier`);
    }
  }
}

for (const block of blocks) {
  if (block.timeframe.end_sec - block.timeframe.start_sec < 4) {
    throw new Error(`${block.id}: block shorter than 4s`);
  }
  if (block.timeframe.end_sec - block.timeframe.start_sec > 8) {
    throw new Error(`${block.id}: block longer than 8s`);
  }
  const scene = block.reference_images[0];
  if (!scene || scene.role !== "scene") throw new Error(`${block.id}: no scene ref`);
  for (const ref of block.reference_images) {
    const entity = entityIndex.get(ref.entity_ref);
    if (!entity) throw new Error(`${block.id}: unknown ref ${ref.entity_ref}`);
    if (ref.image !== entity.reference.image) throw new Error(`${block.id}: image mismatch ${ref.entity_ref}`);
  }
  const audio = block.audio_control;
  if (audio.speech_present && !audio.dialogue?.original_text) {
    throw new Error(`${block.id}: speech block without original_text`);
  }
  if (!audio.speech_present && audio.dialogue) {
    throw new Error(`${block.id}: silent block carries dialogue`);
  }
  if (audio.dialogue?.speaker_ref) {
    const present = block.present_characters.some(
      (c) => c.entity_ref === audio.dialogue.speaker_ref
    );
    if (!present) throw new Error(`${block.id}: speaker not in present_characters`);
  }
  const spoken = audio.dialogue?.original_text;
  if (spoken) {
    if (/[「」『』：——%&#@*]|[0-9]|[A-Za-z]/.test(spoken)) {
      throw new Error(`${block.id}: dialogue is not TTS-clean`);
    }
    for (const line of spoken.split("\n")) {
      if (!line.trim()) throw new Error(`${block.id}: blank dialogue line`);
      if ((line.match(/[。！？]/g) || []).length > 1) {
        throw new Error(`${block.id}: more than one sentence on a line: ${line}`);
      }
    }
  }
  for (const id of block.referenced_blocks || []) {
    if (!blockIds.has(id)) throw new Error(`${block.id}: dangling ref ${id}`);
  }
}

const project = {
  version: "1.12",
  project_title: "New_Momotaro_Girl",
  global_settings: {
    aspect_ratio: "16:9",
    style:
      "Photorealistic 90s retro-tech Japanese adventure film, 35mm film grain, warm analog color, deep shadows, practical torchlight, practical sea and forest atmospheres",
    default_audio_design:
      "Continuous warm analog room tone with vintage optical film hiss filling the frequency spectrum.",
  },
  entities: projectEntities,
  blocks,
};

fs.writeFileSync(path.join(ROOT, "plan.momotaro.json"), JSON.stringify(plan, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(ROOT, "momotaro.json"), JSON.stringify(project, null, 2) + "\n", "utf8");

console.log(
  JSON.stringify(
    {
      plan: "plan.momotaro.json",
      project: "momotaro.json",
      source_chars: declaredRange.length,
      sha256: plan.source.sha256,
      segments: planSegments.length,
      blocks: blocks.length,
      duration_sec: t,
      entities: {
        characters: ENTITIES.characters.length,
        props: ENTITIES.props.length,
        locations: ENTITIES.locations.length,
      },
    },
    null,
    2
  )
);
