/**
 * Build `plan.ch0_15s.json` — the 15-second cut of ch0, first five segments only.
 *
 *   node build_plan_ch0_15s.mjs
 *
 * The words still come from `story_ch0.txt` (verbatim slices, contiguous offsets);
 * `plan.ch0.json` supplies the entity inventory, plates and voice profiles so this
 * sample keeps the same anchors as the 173-segment plan.
 *
 * Segmentation follows MAKE_PLAN.md §1.3 / §1.7:
 *   - one segment holds at most 15 seconds and is filled as far as the next beat allows
 *   - `utterances[]` carries one row per spoken line (kind, speaker, text, clean_text,
 *     tone, line_sec, lipsync); the segment's kind/voice_intent/spoken_text/char_count/
 *     estimated_sec are aggregates of those rows
 *   - a line whose `line_sec` would push the segment past 15 s is split at a sentence
 *     boundary and marked `duration_split`
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const readJson = (file) => JSON.parse(readFileSync(resolve(HERE, file), "utf8"));

const story = readFileSync(resolve(HERE, "story_ch0.txt"), "utf8");
const old = readJson("plan.ch0.json");

const byId = new Map();
for (const group of ["characters", "props", "locations"]) {
  for (const entity of old.entities[group] ?? []) byId.set(entity.id, entity);
}

/** Default pace from MAKE_PLAN.md §1.7; slower values are a per-line decision. */
const RATE = { dialogue: 3.5, inner: 3.5, narration: 3.5 };
const countChars = (text) => (text.match(/[\u4e00-\u9fffA-Za-z0-9]/g) ?? []).length;
const lineSeconds = (text, rate) => Math.ceil(countChars(text) / rate);
const ttsClean = (text) =>
  text
    .replace(/[「」『』（）()《》〈〉【】…—－·、，。！？：；,.!?:;"'“”‘’]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const L = {
  title: "（黑底片名卡：別境 · 雙生換命。紅金與灰藍各一線，從畫面中央慢慢分開。）\n",
  poster:
    "（封面。紅金與灰藍各佔一半，兩個女人背靠背坐著，一隻灰白長毛波斯貓坐在正中央的繡墩上，胸前掛牌「波斯貓大人」，副題「雙生換命」。）\n",
  anian:
    "阿念（旁白）：我娘說，撿到我的那天，天上沒下雨，地上卻全是水。我問她為什麼。她說，因為有人在宮裡哭，哭了一整夜。\n",
  zhaoningA: "昭寧（旁白）：我從十四歲開始穿這件衣裳。它教會我怎麼站、怎麼看人、怎麼在笑的時候不動眼睛。",
  zhaoningB: "它唯一沒教我的，是怎麼把一個和自己一樣的人，從地上扶起來。\n",
  chair:
    "（同一張椅子，昭寧坐著，阿念坐在旁邊的石欄上，菜籃放在膝頭，貓在兩人中間的繡墩上。兩個人沒有看對方，看的都是鏡頭外的一個方向。）\n",
  cat: "波斯貓大人（心聲）：左邊那個坐得太直，右邊那個坐得太隨意。本座坐在中間，剛好。\n",
  anianLine: "阿念：大人，你說，天底下真有長得一模一樣的兩個人嗎？\n"
};

const PLATES = [
  { role: "scene", ref: "loc_poster_split", note: "split poster, cat on the seam, then a still two-shot on the chair and railing" },
  ...["char_anian", "char_zhaoning", "char_cat"].map((ref) => ({
    role: "character",
    ref,
    note: "identity plate, shared across the chapter"
  }))
];

const CONTINUITY = "全片命題：一張臉，兩段人生；貓是見證者。兩段『旁白』其實是各角色的第一人稱心聲，拍不到，plan 標 inner，不用中性旁白唸。";
const POSTER_CONTEXT = "封面海報與並置畫面：紅金與灰藍各佔一半，兩個女人背靠背，貓在正中央。";

/**
 * One entry per segment. `action_sec` is time spent on silent beats; `utterances`
 * are the spoken lines in order. Everything else is derived below.
 */
const SPECS = [
  {
    id: "seg_001",
    split_reason: "chapter_start",
    source: L.title + L.poster,
    action_sec: 10,
    context: POSTER_CONTEXT,
    visual_context:
      "平面式海報構圖：紅金與灰藍各佔一半，兩個女人背靠背坐著，貓在中央繡墩上，胸前掛牌。｜景別與背景：full-frame black title card, no location, no people; then a wide symmetrical poster｜本格焦點：黑底片名卡，接著切到封面海報（無對白）",
    continuity: CONTINUITY,
    utterances: []
  },
  {
    id: "seg_002",
    split_reason: "paragraph_break",
    source: L.anian,
    action_sec: 0,
    context: "封面海報上的第一段第一人稱心聲；阿念先說自己的來歷。",
    visual_context:
      "平面式海報構圖：紅金與灰藍各佔一半，兩個女人背靠背坐著，貓在中央繡墩上，胸前掛牌。｜景別與背景：wide symmetrical poster; the second shot is a locked wide two-shot with the chair and railing filling the frame｜本格焦點：阿念 的心聲，畫面人物嘴唇不動",
    continuity: CONTINUITY,
    utterances: [
      {
        kind: "inner",
        speaker_ref: "char_anian",
        text: "我娘說，撿到我的那天，天上沒下雨，地上卻全是水。我問她為什麼。她說，因為有人在宮裡哭，哭了一整夜。",
        tone: "soft and warm, unhurried, telling a bedtime story to herself"
      }
    ]
  },
  {
    id: "seg_003",
    split_reason: "duration_split",
    source: L.zhaoningA,
    action_sec: 0,
    context: "封面海報上的第二段第一人稱心聲；昭寧說那件衣裳教了她什麼。",
    visual_context:
      "平面式海報構圖：紅金與灰藍各佔一半，兩個女人背靠背坐著，貓在中央繡墩上，胸前掛牌。｜景別與背景：wide symmetrical poster; the second shot is a locked wide two-shot with the chair and railing filling the frame｜本格焦點：昭寧 的心聲（前半），畫面人物嘴唇不動",
    continuity: CONTINUITY,
    utterances: [
      {
        kind: "inner",
        speaker_ref: "char_zhaoning",
        text: "我從十四歲開始穿這件衣裳。它教會我怎麼站、怎麼看人、怎麼在笑的時候不動眼睛。",
        tone: "low and clipped, measuring every word"
      }
    ]
  },
  {
    id: "seg_004",
    split_reason: "duration_split",
    source: L.zhaoningB + L.chair,
    action_sec: 5,
    context: "昭寧的心聲收在『把一個和自己一樣的人從地上扶起來』；接著切到同一張椅子上的無聲並置。",
    visual_context:
      "平面式海報構圖接著落到同一張椅子：昭寧坐著、阿念坐在旁邊石欄，菜籃放膝頭，兩人看著鏡頭外的不同方向。｜景別與背景：wide symmetrical poster; a locked wide two-shot on the chair and railing｜本格焦點：昭寧 的心聲（後半），接著是無對白的並置畫面",
    continuity: CONTINUITY,
    utterances: [
      {
        kind: "inner",
        speaker_ref: "char_zhaoning",
        text: "它唯一沒教我的，是怎麼把一個和自己一樣的人，從地上扶起來。",
        tone: "quiet, the first crack in the order"
      }
    ]
  },
  {
    id: "seg_005",
    split_reason: "paragraph_break",
    source: L.cat + L.anianLine,
    action_sec: 0,
    context: "同一張椅子上，貓先評點兩人的坐姿，阿念接著開口問那句話。",
    visual_context:
      "鎖定的雙人景：昭寧坐直、阿念坐得隨意，貓在兩人中間的繡墩上。｜景別與背景：locked wide two-shot, chair and railing filling the frame｜本格焦點：貓的心聲先起，接著阿念開口；兩人都不看對方",
    continuity: CONTINUITY,
    voice_note:
      "cat inner monologue first (lips still, no narrator), then the market woman (S1) speaks on screen; the two lines never overlap",
    utterances: [
      {
        kind: "inner",
        speaker_ref: "char_cat",
        text: "左邊那個坐得太直，右邊那個坐得太隨意。本座坐在中間，剛好。",
        tone: "low, amused, close and dry, a little theatrical"
      },
      {
        kind: "dialogue",
        speaker_ref: "char_anian",
        text: "大人，你說，天底下真有長得一模一樣的兩個人嗎？",
        tone: "easy, curious, half-laughing"
      }
    ]
  }
];

const problems = [];
let cursor = 0;

const segments = SPECS.map((spec, index) => {
  const start = story.indexOf(spec.source, cursor);
  if (start < 0) problems.push(`${spec.id}: source slice not found after offset ${cursor}`);
  if (start !== cursor) problems.push(`${spec.id}: source starts at ${start}, expected ${cursor} (gap or overlap)`);
  const source_start = start < 0 ? cursor : start;
  const source_end = source_start + spec.source.length;
  cursor = source_end;

  const utterances = spec.utterances.map((line, i) => {
    const rate = RATE[line.kind];
    const chars = countChars(line.text);
    return {
      order: i + 1,
      kind: line.kind,
      speaker_ref: line.speaker_ref,
      text: line.text,
      clean_text: ttsClean(line.text),
      tone: line.tone,
      char_count: chars,
      rate_chars_per_sec: rate,
      estimated_sec: lineSeconds(line.text, rate),
      lipsync: line.kind === "dialogue"
    };
  });

  for (const u of utterances) {
    if (!spec.source.includes(u.text)) problems.push(`${spec.id}: utterance text is not in source: ${u.text}`);
  }

  const speechSec = utterances.reduce((n, u) => n + u.estimated_sec, 0);
  const spokenChars = utterances.reduce((n, u) => n + u.char_count, 0);
  const estimated = Math.max(5, Math.ceil(speechSec + spec.action_sec + (utterances.length ? 1 : 0)));
  if (estimated > 15) problems.push(`${spec.id}: ${estimated}s exceeds the 15-second cap`);

  const lipsync = utterances.find((u) => u.lipsync);
  const primary = lipsync ?? utterances[0] ?? null;
  const kinds = new Set(utterances.map((u) => u.kind));
  const voiceIntent = !utterances.length
    ? "none"
    : kinds.size > 1
      ? "mixed"
      : kinds.has("dialogue")
        ? "spoken_on_screen"
        : kinds.has("inner")
          ? "internal_monologue"
          : "narrator";

  const profile = primary ? byId.get(primary.speaker_ref)?.voice ?? null : null;

  return {
    id: spec.id,
    order: index + 1,
    source_start,
    source_end,
    source: spec.source,
    kind: !utterances.length ? "action" : lipsync ? "dialogue" : "narration",
    split_reason: spec.split_reason,
    location_ref: "loc_poster_split",
    character_refs: ["char_anian", "char_zhaoning", "char_cat"],
    prop_refs: [],
    reference_images: PLATES,
    context: spec.context,
    visual_context: spec.visual_context,
    continuity: spec.continuity,
    voice_intent: voiceIntent,
    ...(primary
      ? {
          voice: {
            ...(profile ?? {}),
            kind: primary.kind === "inner" ? "inner" : "dialogue",
            speaker: primary.speaker_ref,
            pov: primary.kind === "inner" ? primary.speaker_ref : null
          },
          speaker_ref: primary.speaker_ref
        }
      : { voice: { kind: "scene", speaker: null, pov: null } }),
    spoken_text: utterances.length ? utterances.map((u) => u.text).join("") : null,
    char_count: spokenChars,
    rate_chars_per_sec: !utterances.length
      ? null
      : new Set(utterances.map((u) => u.rate_chars_per_sec)).size === 1
        ? utterances[0].rate_chars_per_sec
        : Number((spokenChars / Math.max(1, speechSec)).toFixed(1)),
    estimated_sec: estimated,
    render_blocks: Math.ceil(estimated / 7),
    references: [],
    utterances,
    ...(spec.voice_note
      ? { voice_note: spec.voice_note }
      : utterances.length && utterances.every((u) => u.kind === "inner")
        ? {
            voice_note:
              "inner monologue bound to the POV character; on-screen lips stay still, no narrator"
          }
        : {})
  };
});

const covered = cursor;
const joined = segments.map((s) => s.source).join("");
if (joined !== story.slice(0, covered)) problems.push("segments do not reassemble the planned prefix");
if (segments.some((s) => s.estimated_sec > 15)) problems.push("a segment exceeds 15 seconds");

if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  const total = segments.reduce((n, s) => n + s.estimated_sec, 0);
  const plan = {
    version: "1.0",
    stage: "plan",
    variant: "ch0-15s-prefix",
    project_title: `${old.project_title}（15 秒版 · 前 5 段）`,
    source: {
      ...old.source,
      range: { start: 0, end: covered },
      coverage: "prefix",
      note: "15 秒版：只規劃 ch0 的前 5 段（片名卡到阿念的第一句問話），其餘段落不在這份 plan；source 位移仍對齊 story_ch0.txt"
    },
    style: old.style,
    voice_guide: {
      rule: "one segment may carry several utterances; keep every line's speaker and delivery in utterances[]",
      dialogue: "on-screen speaker, lips move; maps to dialogue_spoken",
      inner: "POV inner voice, close and dry, lips stay still; maps to monologue_internal",
      narration: "objective narrator; maps to narrator",
      scene: "no utterance at all"
    },
    entities: old.entities,
    totals: {
      segments: segments.length,
      estimated_sec: total,
      utterances: segments.reduce((n, s) => n + s.utterances.length, 0)
    },
    segments
  };

  const file = resolve(HERE, "plan.ch0_15s.json");
  writeFileSync(file, JSON.stringify(plan, null, 2) + "\n", "utf8");
  console.log(
    JSON.stringify(
      {
        file,
        segments: segments.length,
        covered_chars: covered,
        planned_sec: total,
        per_segment: segments.map((s) => ({
          id: s.id,
          sec: s.estimated_sec,
          kind: s.kind,
          voice_intent: s.voice_intent,
          utterances: s.utterances.length,
          chars: s.char_count
        }))
      },
      null,
      2
    )
  );
}
