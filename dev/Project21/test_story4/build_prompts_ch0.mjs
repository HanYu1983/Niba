/**
 * Build the t2v prompts for ch0 out of plan.ch0.json + data_prompts_ch0.mjs.
 *
 * Why a builder instead of 173 hand-written files:
 *   - the style lock is emitted from one string, so it can never drift between files;
 *   - the character feature anchor is read from plan.entities[].anchor_en, the same string
 *     the plan calls the identity definition, so prompt and plan cannot disagree;
 *   - <d> is generated from plan.spoken_text, so the TTS can never read a line the script
 *     does not contain;
 *   - a re-plan (new segment ids) rebuilds every file instead of silently orphaning them.
 *
 * The authored part — action, camera, sound, music — lives in data_prompts_ch0.mjs.
 *
 * Run: node build_prompts_ch0.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { loadStory } from "../workspace/lib/story.mjs";
import { beats } from "./data_prompts_ch0.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const story = loadStory({ story: HERE });
const plan = JSON.parse(readFileSync(story.planFile, "utf8"));

/* ------------------------------------------------------------------ anchors */

const lc = (s) => {
  const t = String(s ?? "").trim().replace(/\.$/, "");
  return t.charAt(0).toLowerCase() + t.slice(1);
};

/** The style lock. Only the light clause changes; everything before it is byte-identical. */
const LOCK = (light) =>
  `Photorealistic live-action Chinese period drama, 35mm film, fine grain, natural skin texture, real-world photography, shallow depth of field, grounded historical realism, ${lc(light)} — not anime, not cartoon, not illustration, not cel shading, not an advertisement, not slow motion, no on-screen text.`;

/**
 * Scene anchors: one set of nouns per location, used verbatim in every prompt that
 * happens there. `set` carries the fixed objects and a depth cue, `palette` the
 * chapter's colour rule, `light` the shared light sentence that touches subject and
 * background at once (method §2.4).
 */
const SCENES = {
  loc_poster_split: {
    set: "A split poster frame: on the left a deep crimson ground with gold silk and an empty wooden chair, on the right a grey-blue ground of patched cloth and a low stone railing, the two halves meeting on the centre line, and one embroidered cushion set exactly on the seam.",
    palette: "The palette stays crimson and gold on one side, grey-blue and rice white on the other.",
    light: "The same soft poster light falls flat and even across both halves, the chair and the railing to the same value."
  },
  loc_mirror_room: {
    set: "A princess's dressing room before dawn: a bronze mirror on a dark wood table, a row of jewellery boxes, red gauze curtains at the window, a low couch with one cushion, and the room falling away into warm shadow behind it.",
    palette: "The palette stays deep crimson, black and gold.",
    light: "The same flat dawn light comes through the paper window and lies across her shoulder, the gauze and the rim of the bronze mirror behind her."
  },
  loc_palace_hall: {
    set: "The deep throne hall: red lacquer columns, a gold dragon throne on a raised dais, twelve steps of red-gold carpet running down to the camera, and incense smoke hanging in the shafts of light above the dais.",
    palette: "The palette stays deep crimson, black and gold.",
    light: "The same low warm shaft light and incense haze cross the carpet, the throne and the shoulders of everyone standing there."
  },
  loc_balcony_night: {
    set: "A high palace balcony at night: a carved stone railing in the foreground, hanging lanterns along the eaves, a large moon low over the roofs, and the city lights spread out far below.",
    palette: "The palette stays cold blue-black, warm lantern amber and gold.",
    light: "The same low lantern light and moon wash touch the railing, her sleeve and the roofs below."
  },
  loc_market_day: {
    set: "A morning market street: vegetable stalls leaning in from both sides, steam rising off a food pot, cloth awnings overhead, baskets stacked on the wet stone paving, and the street narrowing away into the crowd.",
    palette: "The palette stays grey-blue, rice white and ochre.",
    light: "The same flat dawn light comes under the awnings and sits on the wet paving, the greens and her hands alike."
  },
  loc_embroidery: {
    set: "An embroidery workshop: a long wooden table, a standing embroidery frame, spools of thread, small scissors, bolts of cloth stacked against the wall, and a lattice window throwing a grid of light across the boards.",
    palette: "The palette stays grey-blue, rice white and ochre, with one warm red on the paper.",
    light: "The same afternoon light comes through the lattice and lies in a grid across the table, the frame and her sleeves."
  },
  loc_palace_steps: {
    set: "The white stone palace stairs: wide steps climbing out of frame, carved balustrades on both sides, cherry trees shedding petals overhead, guards standing along the edges, and the steps receding upward into pale haze.",
    palette: "The palette stays white stone, crimson and gold against grey-blue cloth.",
    light: "The same cool daylight comes over the balustrade and falls on the steps, the armour and both women at once."
  },
  loc_market_night: {
    set: "A lantern-lit night market street: paper lanterns strung across the street, stalls with hanging cat masks and streamers, a crowd packed shoulder to shoulder, and the lantern lines converging into the distance.",
    palette: "The palette stays lantern amber, deep red and black night.",
    light: "The same practical lantern light falls from above on the paving, the stall cloth and her face."
  },
  loc_rain_steps: {
    set: "Rain-soaked stone stairs at night: wet steps running down out of frame, red leaves stuck to the stone, lanterns blurred into soft discs by the rain, dark trees on one side, and shallow puddles holding the light.",
    palette: "The palette stays wet black stone, lantern amber and one deep red.",
    light: "The same rainy lantern light glistens on the steps, both umbrellas and the water at their feet."
  },
  loc_study_night: {
    set: "A candlelit study at night: a low wooden table, a hand-drawn map held flat by a brush rest, scrolls and an ink stone at the edge, a chessboard half out of frame, and the dark room falling off behind the candle.",
    palette: "The palette stays warm candle amber, black and aged paper.",
    light: "The same single candle lights the map, her hands and the edge of the table, then falls away into black."
  },
  loc_carriage: {
    set: "The inside of a six-horse carriage at night: dark wood panelling, two padded benches facing each other, a small hanging lamp between them, and windows on both sides where the city lights slide past.",
    palette: "The palette stays dark lacquer, amber lamp and moving gold lights.",
    light: "The same small lamp sways between them, and the passing lights run across the wood and both faces."
  },
  loc_boat_cabin: {
    set: "A boat cabin at dusk: a wooden interior, a wide window framing water and distant hills, a low table with a map, scrolls, jade bracelets and an incense burner, and the cabin door standing open to the deck.",
    palette: "The palette stays dusk amber, dark wood and river grey.",
    light: "The same low amber dusk light comes through the window and lies across the table, the open box and her hands."
  }
};

/** Wardrobe per location. Clothing is a variable, so it is kept out of the anchor. */
const WEAR = {
  loc_poster_split: {
    char_anian: "in a mended robe, a market basket resting on her knees",
    char_zhaoning: "in a twelve-fold crimson and gold robe, the cat-ear gold crown on her head",
    char_cat: "with a small blank plaque hanging beneath the bell, no legible text"
  },
  loc_mirror_room: {
    char_zhaoning: "in a loose crimson inner robe, red gauze sliding off one shoulder",
    char_qinghe: "with her hands folded at her waist",
    char_anian: "in the crimson and gold court robe, her hair half pinned"
  },
  loc_palace_hall: {
    char_zhaoning: "in a twelve-fold crimson and gold court robe, the cat-ear gold crown on her head, a round silk fan in her hand",
    char_cui: "in a dark red eunuch's robe, sleeves folded"
  },
  loc_balcony_night: {
    char_zhaoning: "in a crimson robe with wide sleeves, the cat-ear gold crown still on her head"
  },
  loc_market_day: {
    char_anian: "in a mended robe, a full basket of greens on her hip",
    char_vendor: "in a brown cotton jacket, hands still wet from the water jar",
    char_cat: "in a small felt cape and a bow"
  },
  loc_embroidery: {
    char_anian: "in a mended robe, sleeves pinned back, a needle between her fingers",
    char_zhaoning: "in a pale violet everyday robe, a cat-painted round fan in her hand"
  },
  loc_palace_steps: {
    char_zhaoning: "in a twelve-fold crimson and gold robe, the cat-ear gold crown on her head",
    char_anian: "in a mended patched robe, a vegetable basket beside her knees",
    char_qinghe: "with her hands folded, holding a tray",
    char_guard: "with one hand on the hilt at his waist"
  },
  loc_market_night: {
    char_anian: "in a mended robe, a cart rope over one shoulder",
    char_zhaoning: "in a hooded black cloak, the hood pulled low, the gold crown bound out of sight beneath it"
  },
  loc_rain_steps: {
    char_zhaoning: "with a red oil-paper umbrella held low",
    char_anian: "with a torn ochre umbrella on her knees, the cat in her arms",
    char_cat: "fur damp from the rain"
  },
  loc_study_night: {
    char_zhaoning: "in a crimson robe, sleeves rolled back",
    char_anian: "in a mended robe"
  },
  loc_carriage: {
    char_zhaoning: "in a crimson robe, the crown set aside on the bench",
    char_anian: "in a mended robe"
  },
  loc_boat_cabin: {
    char_zhaoning: "in a crimson robe, a cat-painted round fan on her knee",
    char_anian: "in a mended robe, a cloth bundle against her chest"
  }
};

const ROLE = {
  char_anian: "the market woman",
  char_zhaoning: "the princess",
  char_cat: "the grey-white Persian cat",
  char_qinghe: "the maid",
  char_cui: "the court eunuch",
  char_vendor: "the vegetable vendor",
  char_guard: "the guard captain"
};

const TONE = {
  char_anian: "soft and unhurried",
  char_zhaoning: "low and clipped",
  char_cat: "low and amused",
  char_qinghe: "light and careful",
  char_cui: "thin and dry",
  char_vendor: "rough and warm",
  char_guard: "hard and loud"
};

const ENTITY = new Map(
  [...plan.entities.characters, ...plan.entities.props, ...plan.entities.locations].map((e) => [e.id, e])
);

/** "the princess (S2), 24, East Asian, …" — verbatim from the plan's feature anchor. */
const anchorOf = (id) => ENTITY.get(id)?.anchor_en ?? id;
const roleOf = (id) => ROLE[id] ?? anchorOf(id).split(" (")[0];

const ACCENT =
  "All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.";

/* ------------------------------------------------------------------ assembly */

const oneLine = (s) => String(s ?? "").trim().replace(/\s+/g, " ");
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** Split the plan's spoken_text into TTS sentences; punctuation is kept verbatim. */
function speakable(text) {
  return (text.match(/[^。！？]+[。！？]?/g) ?? [])
    .map((s) => s.trim())
    .filter(Boolean);
}

function voiceIntro(seg, toneOverride) {
  const v = seg.voice;
  if (v.kind === "scene") return "";
  if (v.kind === "dialogue") {
    const role = roleOf(v.speaker);
    const tone = toneOverride ?? TONE[v.speaker] ?? "evenly";
    return `${role} (${anchorOf(v.speaker).match(/\((S\d)\)/)?.[1]}) says, ${tone}:`;
  }
  if (v.kind === "inner") {
    if (v.speaker === "char_cat") {
      return `The grey-white Persian cat's inner voice, close and dry, a man's low voice, amused, no room reverb, the cat's mouth closed:`;
    }
    const who = v.gender === "female" ? "a woman's voice" : "a man's voice";
    return `${roleOf(v.speaker)}'s inner voice, close and dry, ${who} inside her own head, no room reverb, her lips do not move:`;
  }
  return `A single narrator's voice, off-screen, low and even, speaks:`;
}

function build(seg, beat) {
  const scene = SCENES[seg.location_ref];
  const set = beat.set ?? scene.set;
  const palette = beat.palette ?? scene.palette;
  const light = beat.light ?? scene.light;
  const cast = beat.cast ?? seg.character_refs;
  const wear = { ...(WEAR[seg.location_ref] ?? {}), ...(beat.wear ?? {}) };

  const people = cast
    .map((id) => [anchorOf(id), wear[id]].filter(Boolean).join(", "))
    .join("; ");
  const peopleLine = people ? `${people.charAt(0).toUpperCase()}${people.slice(1)}.` : "";

  const shots = [{ a: beat.a, c: beat.c }, ...(beat.shots ?? [])];
  const parts = [];

  shots.forEach((shot, i) => {
    const head = i === 0
      ? [`[Shot 1] ${LOCK(light)}`, set, palette, peopleLine, oneLine(shot.a)].filter(Boolean).join(" ")
      : `[Shot ${i + 1}] At ${shot.at}, ${lc(oneLine(shot.a).replace(/\.$/, ""))}.`;
    const camera = oneLine(shot.c) ? `The camera ${oneLine(shot.c).replace(/\.$/, "")}.` : "";
    const intro = i === shots.length - 1 ? cap(voiceIntro(seg, beat.tone)) : "";
    parts.push([head, camera, intro].filter(Boolean).join(" "));
  });

  const dialogue = seg.kind === "action" ? "" : `<d>\n[中文]\n${speakable(seg.spoken_text).join("\n")}\n</d>`;

  const sound = oneLine(beat.s);
  // The accent anchor is only meaningful where someone speaks; a silent shot ends on "No dialogue."
  const noVoice =
    seg.kind === "action" ? " No dialogue." : seg.voice.kind === "inner" ? " No narrator." : "";
  const soundscape =
    seg.kind === "action" ? `${sound}${noVoice}` : `${sound}${noVoice} ${ACCENT}`;

  const text = [
    `integrated_multimodal_description: ${parts.join("\n\n")}${dialogue ? `\n${dialogue}` : ""}`,
    "",
    `overall_soundscape: ${soundscape}`,
    "",
    `non_diegetic_music: ${oneLine(beat.m)}`,
    ""
  ].join("\n");

  return text;
}

/* ------------------------------------------------------------------ write */

mkdirSync(story.promptsDir, { recursive: true });

const known = new Set(plan.segments.map((s) => s.id));
const orphaned = Object.keys(beats).filter((id) => !known.has(id));
const missing = plan.segments.filter((s) => !beats[s.id]).map((s) => s.id);
if (orphaned.length) {
  console.error(`data_prompts_ch0.mjs has ids the plan does not: ${orphaned.join(", ")}`);
  process.exit(1);
}

let written = 0;
const short = [];
for (const seg of plan.segments) {
  const beat = beats[seg.id];
  if (!beat) continue;
  for (const key of ["a", "c", "s", "m"]) {
    if (!beat[key]) short.push(`${seg.id}: missing ${key}`);
  }
  const text = build(seg, beat);
  writeFileSync(resolve(story.promptsDir, `${seg.id}.t2v.txt`), text, "utf8");
  written++;
}

console.log(
  JSON.stringify(
    {
      prompts: written,
      planned: plan.segments.length,
      missing,
      short,
      words: plan.segments.reduce((n, s) => n + (s.spoken_text?.length ?? 0), 0)
    },
    null,
    2
  )
);
if (missing.length || short.length) process.exit(1);
