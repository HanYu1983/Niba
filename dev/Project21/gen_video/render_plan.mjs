/**
 * Block -> ComfyUI MiniMax H3 r2v job.
 *
 * The project JSON is the creative source and stays English. This module turns each block
 * into the thing the model actually reads: a Chinese prompt that a TTS pass can pronounce.
 *
 *   project block  +  ch04_shot_notes.json   ->   { prompt, reference_images, width, … }
 *
 * Why a notes file instead of generating the text: a shot has exactly one correct Chinese
 * sentence ("the judge's fingertips tap the bench once"), and no rule can derive it from
 * `action.description` deterministically. Keeping the Chinese in one reviewable file means
 * the compiler stays deterministic, re-runnable, and diffable — a change to a shot shows up
 * as one line in git, not as a different sample from a language model.
 *
 * The compiler's real job is everything around that sentence: resolve the newest reference
 * plate for each entity, keep scene-first slot order, quantise the duration, and refuse to
 * emit anything that breaks the pronounceability rules in PROMPT_TECHNIQUES.md.
 */

import { CompilerError } from "./compiler.mjs";
import { listPlates, locateReference } from "./metadata.mjs";

/* --------------------------------------------------------------- pronounceability */

/**
 * Simplified forms that must not reach the TTS. The chapter is written in traditional
 * Chinese, so a stray simplified glyph is a typo in the source, not a style choice.
 */
const SIMPLIFIED_TO_TRADITIONAL = {
  逻: "邏", 辑: "輯", 断: "斷", 伪: "偽", 帐: "帳", 户: "戶", 汇: "匯", 线: "線",
  这: "這", 个: "個", 么: "麼", 没: "沒", 让: "讓", 门: "門", 义: "義", 张: "張",
  处: "處", 实: "實", 见: "見", 长: "長", 问: "問", 题: "題", 觉: "覺", 应: "應",
  该: "該", 会: "會", 说: "說", 对: "對", 时: "時", 后: "後", 来: "來", 过: "過",
  还: "還", 进: "進", 动: "動", 现: "現", 点: "點", 场: "場", 车: "車", 员: "員",
  国: "國", 学: "學", 体: "體", 边: "邊", 关: "關", 开: "開", 无: "無", 与: "與",
  为: "為", 万: "萬", 号: "號", 条: "條", 纸: "紙", 证: "證", 据: "據", 权: "權",
  结: "結", 罚: "罰", 决: "決", 讯: "訊", 认: "認", 续: "續", 总: "總", 归: "歸",
  难: "難", 从: "從", 众: "眾", 历: "歷", 压: "壓", 剧: "劇", 众: "眾", 乡: "鄉",
  书: "書", 们: "們", 东: "東", 语: "語", 说: "說", 华: "華", 严: "嚴", 复: "復"
};

const FORBIDDEN = [
  { re: /[「」『』]/, why: "quotation marks get read aloud as noise" },
  { re: /[：:]/, why: "a colon makes the model split and repeat the sentence" },
  { re: /%/, why: "percent is spoken as \"PiFen\"" },
  { re: /[0-9０-９]/, why: "Arabic digits are read inconsistently; spell them in Chinese" },
  { re: /[&@#*]/, why: "symbols are treated as text to be read" },
  { re: /——/, why: "an em dash becomes a cut point for inserted gibberish" },
  { re: /[A-Za-z]/, why: "Latin letters trigger English or mixed-language speech" }
];

/** Character-level fixes only; anything else is reported rather than guessed at. */
export function normaliseText(text) {
  let changed = false;
  const out = [...String(text ?? "")]
    .map((ch) => {
      const fixed = SIMPLIFIED_TO_TRADITIONAL[ch];
      if (fixed) changed = true;
      return fixed ?? ch;
    })
    .join("");
  return { text: out, changed };
}

/** Everything in one line that the TTS would trip over. */
export function lineIssues(line, { maxChars = 24, kind = "line" } = {}) {
  const issues = [];
  for (const { re, why } of FORBIDDEN) {
    if (re.test(line)) issues.push({ kind: "forbidden", value: line.match(re)[0], why, line });
  }
  if ([...line].length > maxChars) {
    issues.push({ kind: "long-line", length: [...line].length, max: maxChars, line });
  }
  for (const ch of line) {
    if (/[\u3000\s]/.test(ch) && kind === "narration") {
      issues.push({ kind: "whitespace", value: "", why: "stray whitespace inside spoken text", line });
      break;
    }
  }
  return issues;
}

/**
 * One sentence per line, each at most `maxChars`. A sentence that is too long is cut at the
 * last comma that still fits, and that comma becomes a period — the same edit the QA notes
 * made by hand (「被告席上坐著的不是罪犯，而是他的恩師。」／「曾被譽為…」).
 */
export function splitNarration(text, maxChars = 22) {
  const sentences = String(text ?? "")
    .split(/(?<=[。！？])/)
    .map((s) => s.trim())
    .filter(Boolean);

  const lines = [];
  for (const sentence of sentences) {
    if ([...sentence].length <= maxChars) {
      lines.push(sentence);
      continue;
    }
    let rest = sentence;
    while ([...rest].length > maxChars) {
      const chars = [...rest];
      // Prefer the last comma that still fits; if the only comma is further out, still cut
      // there — a half-sentence beats a 40-character line the TTS has to invent pauses for.
      let cut = -1;
      for (let i = Math.min(maxChars - 1, chars.length - 1); i > 0; i--) {
        if ("，、".includes(chars[i])) {
          cut = i;
          break;
        }
      }
      if (cut === -1) {
        for (let i = maxChars - 1; i < chars.length - 1; i++) {
          if ("，、".includes(chars[i])) {
            cut = i;
            break;
          }
        }
      }
      if (cut === -1) break; // no punctuation to cut at; leave it long and let the check shout
      lines.push(chars.slice(0, cut).join("") + "。");
      rest = chars.slice(cut + 1).join("");
    }
    if (rest !== "") lines.push(rest);
  }
  return lines;
}

/* --------------------------------------------------------------- helpers */

function need(map, key, what) {
  const value = map?.[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new CompilerError(`shot notes are missing a Chinese ${what} for "${key}"`, { key });
  }
  return value;
}

/** 17k + 5 frames, the lengths MiniMax H3 accepts (same rule as the workflow builder). */
export function quantiseFrames(durationSec, fps) {
  const target = Math.round(durationSec * fps);
  let frames = 5 + 17 * Math.max(0, Math.floor((target - 5) / 17));
  if (frames < target) frames += 17;
  return frames;
}

/**
 * Newest plate in the entity's reference folder, as an absolute path. `entity_prompt` reports
 * the same file, so what a human sees in that tool is exactly what gets uploaded here.
 */
export function referenceFileFor(projectFile, entity) {
  const image = entity?.reference?.image;
  const located = locateReference(projectFile, image);
  if (!located) {
    throw new CompilerError(`entity "${entity?.id}" has no reference.image and no metadata to anchor it`);
  }
  const plates = listPlates(located.dir);
  if (plates.length === 0) {
    throw new CompilerError(`no reference plate found for "${entity?.id}"`, { dir: located.dir });
  }
  return { path: resolveJoin(located.dir, plates[0]), name: plates[0], dir: located.dir, source: located.source };
}

function resolveJoin(dir, name) {
  const sep = dir.includes("\\") ? "\\" : "/";
  return dir.endsWith(sep) ? dir + name : dir + sep + name;
}

function indexById(list, id, kind) {
  const hit = (list ?? []).find((x) => x && x.id === id);
  if (!hit) throw new CompilerError(`unknown ${kind} id "${id}"`);
  return hit;
}

/* --------------------------------------------------------------- the compiler */

/**
 * Assemble the prompt text for one block.
 *
 * Layout, in the order that worked in testing:
 *   reference legend -> shot size + camera move -> the action lines -> wardrobe/expression
 *   -> silence -> light -> sound -> the spoken lines.
 */
function assemblePrompt({ notes, note, project, block, refs, narrationLines }) {
  const entities = project.entities ?? {};
  const characters = entities.characters ?? [];
  const locations = entities.locations ?? [];
  const props = entities.props ?? [];

  const legend = [];
  refs.forEach((entityId, i) => {
    const entry = notes.entities?.[entityId];
    if (!entry) throw new CompilerError(`shot notes have no Chinese name for "${entityId}"`);
    const ok = (characters.some((c) => c.id === entityId) || locations.some((l) => l.id === entityId) || props.some((p) => p.id === entityId));
    if (!ok) throw new CompilerError(`"${entityId}" is not an entity in the project`);
    if (i === 0 && entry.kind !== "character") {
      legend.push(`參考圖一是場景，${entry.zh}。`);
    } else if (entry.kind === "character") {
      legend.push(`參考圖${["一", "二", "三"][i]}是${entry.zh}，${entry.who ?? "人物"}。`);
    } else {
      legend.push(`參考圖${["一", "二", "三"][i]}是${entry.zh}。`);
    }
  });

  const present = block.present_characters ?? [];
  const wardrobe = [];
  /* An insert shot (a hand, a page, a pen) must not be told what the character is wearing or
     what their face is doing: naming a robe and a jaw pulls a torso and a face into frame. */
  for (const entry of note.no_wardrobe ? [] : present) {
    const persona = notes.entities?.[entry.entity_ref];
    if (!persona?.zh) throw new CompilerError(`shot notes have no Chinese name for "${entry.entity_ref}"`);
    const outfit = entry.outfit ? need(notes.outfits, entry.outfit, "outfit") : null;
    const face = entry.facial_state ? need(notes.faces, entry.facial_state, "facial state") : null;
    if (outfit) wardrobe.push(`${persona.zh}穿著${outfit}。`);
    if (face) wardrobe.push(`${persona.zh}，${face}。`);
  }

  const audio = block.audio_control ?? {};
  const mode = audio.audio_mode ?? "narrator_voiceover";
  const voice = notes.voices?.[mode] ?? notes.voices.narrator_voiceover;

  const light = note.light ?? need(notes.light, block.location_ref, "light for this location");
  const sound = mode === "vintage_film_room_tone" ? notes.sound.vintage_film_room_tone : notes.sound.default;

  const parts = [];
  parts.push(...legend);
  parts.push("");
  if (note.shot) parts.push(`鏡別焦段，${note.shot}。`);
  if (note.move && note.move !== "完全不動") parts.push(`運鏡，${note.move}。`);
  parts.push(...note.lines);
  parts.push(...wardrobe);
  if (note.no_wardrobe) parts.push("沒有人說話。");
  else if (voice.silence) parts.push(`${voice.silence}。`);
  /* Two clips in the first batch had a subtitle burned into the lower third. The template
     prompt carries the same instruction (「畫面完全無任何字幕」), and blocks that kept it
     stayed clean. */
  parts.push("畫面裡沒有任何字幕，也沒有浮水印。");
  parts.push(`打光，${light}。`);
  parts.push(`音效，${sound}。`);

  if (narrationLines.length > 0) {
    parts.push("");
    parts.push(`${voice.speaker}，${voice.desc}。`);
    parts.push(...narrationLines);
  }

  return parts.join("\n");
}

/**
 * Compile one block into everything `minimax_r2v` needs, plus the reasons it might be wrong.
 *
 * @param {object} project parsed project JSON
 * @param {object} notes parsed shot-notes JSON
 * @param {string} blockId
 * @param {{ projectFile?: string, index?: number, take?: number, prefix?: string }} [opts]
 */
export function compileRenderJob(project, notes, blockId, opts = {}) {
  const block = indexById(project.blocks ?? [], blockId, "block");
  const note = notes.blocks?.[blockId];
  if (!note) throw new CompilerError(`shot notes have no entry for block "${blockId}"`, { block_id: blockId });

  const index = opts.index ?? (project.blocks ?? []).findIndex((b) => b?.id === blockId);
  const take = opts.take ?? 1;
  const projectFile = opts.projectFile ?? null;

  const tf = block.timeframe ?? {};
  const duration = Number(tf.end_sec) - Number(tf.start_sec);
  const size = notes.size ?? { width: 608, height: 352, fps: 24 };

  /* reference slots: the notes may narrow the plan's list (a character who is not in frame
     would otherwise be merged into the person who is). */
  const planRefs = (block.reference_images ?? []).map((r) => r.entity_ref).filter(Boolean);
  const refs = Array.isArray(note.refs) && note.refs.length > 0 ? note.refs : planRefs;

  const issues = [];
  if (refs.length === 0) issues.push({ kind: "no-reference", why: "r2v needs at least one reference image" });
  if (refs.length > 3) issues.push({ kind: "too-many-references", count: refs.length, max: 3 });
  if (!(duration >= 4 && duration <= 8)) {
    issues.push({ kind: "duration", value: duration, why: "one block must be 4-8 seconds" });
  }
  /* A pure face insert (an eye, a mouth) is better anchored on the person's plate; the scene
     plate only gives the model permission to pull back into a wide. */
  if (!note.no_scene && refs[0] !== block.location_ref) {
    issues.push({ kind: "slot-order", why: "the scene must sit in slot 1", got: refs[0], expected: block.location_ref });
  }
  if (Array.isArray(note.refs) && note.refs.join() !== planRefs.join()) {
    issues.push({
      kind: "refs-override",
      note: "the shot notes narrow the plan's reference list",
      plan: planRefs,
      used: refs
    });
  }

  const entities = project.entities ?? {};
  const all = [...(entities.characters ?? []), ...(entities.locations ?? []), ...(entities.props ?? [])];
  const referenceImages = refs.map((id) => {
    const entity = indexById(all, id, "entity");
    return referenceFileFor(projectFile, entity).path;
  });

  /* narration */
  const dialogue = block.audio_control?.dialogue ?? null;
  const raw = typeof dialogue?.original_text === "string" ? dialogue.original_text : "";
  const normalised = normaliseText(raw);
  if (normalised.changed) {
    issues.push({ kind: "script-normalised", why: "simplified characters replaced with traditional", from: raw, to: normalised.text });
  }
  const narrationLines = splitNarration(normalised.text);
  for (const line of narrationLines) issues.push(...lineIssues(line, { kind: "narration", maxChars: 26 }));
  if (block.audio_control?.speech_present === true && narrationLines.length === 0) {
    issues.push({ kind: "missing-dialogue", why: "speech_present is true but there is no original_text" });
  }
  if (block.audio_control?.speech_present === false && narrationLines.length > 0) {
    issues.push({ kind: "unexpected-dialogue", why: "speech_present is false but original_text exists" });
  }

  const prompt = assemblePrompt({ notes, note, project, block, refs, narrationLines });
  for (const line of prompt.split("\n")) {
    if (line.trim() === "") continue;
    issues.push(...lineIssues(line, { kind: "prompt", maxChars: 40 }));
  }

  const seed = Number(notes.seed_base ?? 0) + index + (take - 1) * 1000;

  return {
    block_id: blockId,
    prompt,
    reference_images: referenceImages,
    width: size.width,
    height: size.height,
    fps: size.fps,
    duration_sec: duration,
    frames: quantiseFrames(duration, size.fps),
    seed,
    filename_prefix: `${opts.prefix ?? "render/ch04"}/${blockId}`,
    label: { project: notes.project ?? null, block_id: blockId, take: String(take) },
    audio_mode: block.audio_control?.audio_mode ?? null,
    speech_present: block.audio_control?.speech_present === true,
    lip_sync: block.audio_control?.lip_sync_enabled === true,
    narration_lines: narrationLines,
    issues
  };
}

/** Every block, in timeline order. Blocks with notes but no plan entry are reported too. */
export function compileAll(project, notes, opts = {}) {
  const jobs = [];
  const errors = [];
  const blocks = project.blocks ?? [];

  for (const [index, block] of blocks.entries()) {
    try {
      jobs.push(compileRenderJob(project, notes, block.id, { ...opts, index }));
    } catch (e) {
      errors.push({ block_id: block?.id ?? `#${index}`, error: e.message, details: e.details ?? null });
    }
  }

  const planIds = new Set(blocks.map((b) => b?.id));
  const unusedNotes = Object.keys(notes.blocks ?? {}).filter((id) => !planIds.has(id));

  return {
    jobs,
    errors,
    unused_notes: unusedNotes,
    summary: {
      blocks: blocks.length,
      compiled: jobs.length,
      failed: errors.length,
      with_issues: jobs.filter((j) => j.issues.length > 0).length,
      total_sec: Number(jobs.reduce((a, j) => a + j.duration_sec, 0).toFixed(2))
    }
  };
}
