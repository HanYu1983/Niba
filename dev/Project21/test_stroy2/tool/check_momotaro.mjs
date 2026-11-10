import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { compileBlock, entityPrompt } from "../../gen_video/compiler.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const story = fs.readFileSync(path.join(ROOT, "doc", "story.md"), "utf8");
const plan = JSON.parse(fs.readFileSync(path.join(ROOT, "plan.momotaro.json"), "utf8"));
const project = JSON.parse(fs.readFileSync(path.join(ROOT, "momotaro.json"), "utf8"));

const sha256 = (text) =>
  crypto.createHash("sha256").update(text, "utf8").digest("hex");
const countChars = (text) =>
  [...(text || "")].filter((ch) => /[\u3400-\u9FFF\u3040-\u30FFA-Za-z0-9]/.test(ch)).length;

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);

// 1. Plan source integrity.
if (plan.stage !== "plan") fail("plan.stage is not plan");
const joined = plan.segments.map((s) => s.source).join("");
const declared = story.slice(plan.source.range.start, plan.source.range.end);
if (joined !== declared) fail("plan segments do not reassemble the declared range");
if (sha256(joined) !== plan.source.sha256) fail("plan sha256 does not match source");
if (sha256(declared) !== plan.source.sha256) fail("plan sha256 does not match story slice");
if (declared.length !== plan.source.chars) fail("plan source.chars mismatch");
if (joined.length !== plan.source.chars) fail("joined length mismatch");

for (let i = 0; i < plan.segments.length; i += 1) {
  const s = plan.segments[i];
  if (s.order !== i + 1) fail(`${s.id}: order ${s.order} != ${i + 1}`);
  if (s.source_end - s.source_start !== s.source.length) fail(`${s.id}: source length mismatch`);
  if (i > 0 && plan.segments[i - 1].source_end !== s.source_start) fail(`${s.id}: not contiguous`);
  if (!["dialogue", "narration", "action"].includes(s.kind)) fail(`${s.id}: bad kind`);
  if (!s.reference_images.length || s.reference_images[0].role !== "scene") {
    fail(`${s.id}: first reference image is not scene`);
  }
  if (s.kind === "action" && s.spoken_text !== null) fail(`${s.id}: action has spoken_text`);
  if (s.kind !== "action" && !s.spoken_text) fail(`${s.id}: missing spoken_text`);
  for (const ref of s.references) {
    const target = plan.segments.find((x) => x.id === ref.segment_ref);
    if (!target || target.order >= s.order) fail(`${s.id}: reference ${ref.segment_ref} is not earlier`);
  }
  const ownBlocks = project.blocks.filter((b) => b.id.startsWith(`block_${s.id.slice(4)}_`));
  if (ownBlocks.length < s.render_blocks) {
    fail(`${s.id}: only ${ownBlocks.length} blocks for render_blocks ${s.render_blocks}`);
  }
  const rate = s.voice_intent === "internal_monologue" ? 4 : 5;
  const estimate =
    s.kind === "action" ? 5 : Math.max(5, Math.ceil(s.char_count / rate) + 1);
  if (s.estimated_sec !== estimate) fail(`${s.id}: estimated_sec ${s.estimated_sec} != ${estimate}`);
}

// 2. Entities and references.
const byId = new Map();
for (const group of ["characters", "props", "locations"]) {
  for (const entity of project.entities[group]) {
    if (byId.has(entity.id)) fail(`duplicate entity ${entity.id}`);
    byId.set(entity.id, { ...entity, group });
    let prompt;
    try {
      prompt = entityPrompt(project, entity.id);
    } catch (error) {
      fail(`${entity.id}: entityPrompt failed: ${error.message}`);
      continue;
    }
    if (prompt.prompt_source !== "reference") {
      warnings.push(`${entity.id}: prompt_source is ${prompt.prompt_source}, not reference`);
    }
  }
}

// 3. Blocks.
const blockIds = new Set();
let total = 0;
for (const block of project.blocks) {
  if (blockIds.has(block.id)) fail(`duplicate block ${block.id}`);
  blockIds.add(block.id);
  const duration = block.timeframe.end_sec - block.timeframe.start_sec;
  if (duration < 4 || duration > 8) fail(`${block.id}: duration ${duration}`);
  if (block.timeframe.start_sec !== total) fail(`${block.id}: timeframe gap at ${block.timeframe.start_sec}`);
  total = block.timeframe.end_sec;

  if (!block.reference_images?.length) fail(`${block.id}: no reference_images`);
  else if (block.reference_images[0].role !== "scene") fail(`${block.id}: first ref not scene`);
  for (const ref of block.reference_images || []) {
    const entity = byId.get(ref.entity_ref);
    if (!entity) fail(`${block.id}: unknown ref ${ref.entity_ref}`);
    else if (ref.image !== entity.reference.image) fail(`${block.id}: image mismatch ${ref.entity_ref}`);
  }
  for (const entry of block.present_characters || []) {
    const entity = byId.get(entry.entity_ref);
    if (!entity || entity.group !== "characters") fail(`${block.id}: bad character ${entry.entity_ref}`);
    if (!entry.outfit) fail(`${block.id}: ${entry.entity_ref} missing outfit`);
    if (!entry.facial_state) fail(`${block.id}: ${entry.entity_ref} missing facial_state`);
  }
  for (const entry of block.present_props || []) {
    const entity = byId.get(entry.entity_ref);
    if (!entity || entity.group !== "props") fail(`${block.id}: bad prop ${entry.entity_ref}`);
  }
  const audio = block.audio_control;
  if (audio.speech_present) {
    if (!audio.dialogue?.original_text) fail(`${block.id}: no original_text`);
    if (audio.dialogue?.speaker_ref && !block.present_characters.some((c) => c.entity_ref === audio.dialogue.speaker_ref)) {
      fail(`${block.id}: speaker not present`);
    }
    const text = audio.dialogue?.original_text || "";
    if (/[「」『』：——%&#@*]|[0-9]|[A-Za-z]/.test(text)) fail(`${block.id}: dialogue not TTS-clean`);
    for (const line of text.split("\n")) {
      if (!line.trim()) fail(`${block.id}: blank dialogue line`);
      if ((line.match(/[。！？]/g) || []).length > 1) fail(`${block.id}: multiple sentences on one line`);
      if ([...line].length > 20) warnings.push(`${block.id}: line >20 chars (${[...line].length})`);
    }
    if (audio.lip_sync_enabled && audio.dialogue?.type !== "spoken_on_screen") {
      fail(`${block.id}: lip sync on non-dialogue mode`);
    }
  } else if (audio.dialogue) {
    fail(`${block.id}: silent block carries dialogue`);
  }
  for (const ref of block.referenced_blocks || []) {
    if (!blockIds.has(ref)) fail(`${block.id}: forward/dangling ref ${ref}`);
  }
  try {
    compileBlock(project, block.id);
  } catch (error) {
    fail(`${block.id}: compileBlock failed: ${error.message}`);
  }
}

const statuses = {};
for (const group of ["characters", "props", "locations"]) {
  for (const entity of plan.entities[group]) {
    statuses[entity.reference.status] = (statuses[entity.reference.status] ?? 0) + 1;
  }
}

console.log(
  JSON.stringify(
    {
      plan_segments: plan.segments.length,
      blocks: project.blocks.length,
      runtime_sec: total,
      source_chars: plan.source.chars,
      sha256: plan.source.sha256,
      entity_counts: {
        characters: plan.entities.characters.length,
        props: plan.entities.props.length,
        locations: plan.entities.locations.length,
      },
      reference_status: statuses,
      errors,
      warnings: warnings.length,
      warning_sample: warnings.slice(0, 12),
    },
    null,
    2
  )
);

if (errors.length) process.exitCode = 1;
