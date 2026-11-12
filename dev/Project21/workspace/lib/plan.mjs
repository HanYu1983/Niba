/**
 * Plan loading, entity lookup and generic validation.
 *
 * The plan is the single source of truth for *what* a segment is: its source slice,
 * its spoken text, its scene/character/prop refs and its planned duration. Prompts hold
 * only the words that go to the model.
 */
import { readFileSync } from "node:fs";

export function loadPlan(file) {
  const plan = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(plan.segments)) throw new Error(`${file}: plan.segments must be an array`);
  return plan;
}

export function segmentsOf(plan) {
  return [...plan.segments].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function segmentById(plan, id) {
  return plan.segments.find((s) => s.id === id || String(s.order) === String(id)) ?? null;
}

export function entitiesOf(plan) {
  return [
    ...(plan.entities?.characters ?? []).map((e) => ({ ...e, kind: "character" })),
    ...(plan.entities?.props ?? []).map((e) => ({ ...e, kind: "prop" })),
    ...(plan.entities?.locations ?? []).map((e) => ({ ...e, kind: "location" }))
  ];
}

export function entityIndex(plan) {
  return new Map(entitiesOf(plan).map((e) => [e.id, e]));
}

export function plannedSeconds(plan) {
  return plan.segments.reduce((n, s) => n + (s.estimated_sec ?? 0), 0);
}

/**
 * MiniMax H3 pads to the 17k+5 frame grid at 24 fps, so a requested 12 s becomes 294 frames
 * (12.25 s). Report the length the render will actually have.
 */
export function quantiseFrames(seconds, fps = 24) {
  const raw = Math.max(5, Math.round(seconds * fps));
  return raw + (((5 - (raw % 17)) % 17) + 17) % 17;
}

const KINDS = new Set(["dialogue", "narration", "action"]);
// "mixed" = several delivery modes inside one segment; the per-line truth is in
// segment.utterances[].kind (see MAKE_PLAN.md §1.6).
const VOICES = new Set(["spoken_on_screen", "spoken_on_screen_intense", "internal_monologue", "remembered_voice", "narrator", "mixed", "none"]);

/**
 * Structural checks that apply to every story. Story-specific rules (anchor slicing,
 * callback ids) belong in that story's builder, not here.
 */
export function validatePlan(plan, { sceneFirst = true, maxRefs = 9 } = {}) {
  const problems = [];
  const warnings = [];
  const ids = new Set();
  const byId = entityIndex(plan);
  const segs = segmentsOf(plan);

  if (!segs.length) problems.push("plan has no segments");

  for (const [i, s] of segs.entries()) {
    const id = s.id ?? `#${i}`;
    if (!s.id) problems.push(`segment ${i} has no id`);
    if (ids.has(s.id)) problems.push(`${id}: duplicate id`);
    ids.add(s.id);

    if (s.kind && !KINDS.has(s.kind)) problems.push(`${id}: unknown kind "${s.kind}"`);
    if (s.voice_intent && !VOICES.has(s.voice_intent)) problems.push(`${id}: unknown voice_intent "${s.voice_intent}"`);
    if (!(s.estimated_sec > 0)) problems.push(`${id}: estimated_sec must be > 0`);

    // source slicing, when the builder recorded offsets
    if (typeof s.source_start === "number" && typeof s.source_end === "number") {
      if (s.source_end <= s.source_start) problems.push(`${id}: source_end <= source_start`);
      if (typeof s.source === "string" && s.source.length !== s.source_end - s.source_start) {
        problems.push(`${id}: source length != offset span`);
      }
      const prev = segs[i - 1];
      if (prev && typeof prev.source_end === "number" && prev.source_end !== s.source_start) {
        problems.push(`${id}: gap or overlap at offset ${s.source_start}`);
      }
    }

    // speech contract
    const speaks = s.kind === "dialogue" || s.kind === "narration" || s.voice_intent === "narrator" || s.voice_intent === "internal_monologue";
    if (s.kind === "action" && s.spoken_text) problems.push(`${id}: action must not carry spoken_text`);
    if (s.kind !== "action" && !s.spoken_text) problems.push(`${id}: ${s.kind} needs spoken_text`);
    if (s.kind === "dialogue" && !s.speaker_ref && !s.voice_note) warnings.push(`${id}: dialogue without speaker_ref or voice_note`);
    if (s.kind !== "action" && !speaks) warnings.push(`${id}: non-action segment with an unspeaking voice_intent`);

    // refs
    const refs = s.reference_images ?? [];
    if (sceneFirst && refs[0] && refs[0].role !== "scene") problems.push(`${id}: first reference is not the scene`);
    if (!refs.length) warnings.push(`${id}: no reference_images (fine for pure t2v)`);
    if (refs.length > maxRefs) problems.push(`${id}: ${refs.length} reference plates, max ${maxRefs}`);
    for (const r of refs) {
      const e = byId.get(r.ref);
      if (!e) {
        // t2v-only stories may list plates they never bind; keep it a warning
        warnings.push(`${id}: unknown entity ${r.ref}`);
        continue;
      }
      const expected = r.role === "scene" ? "location" : r.role;
      if (expected && e.kind !== expected) problems.push(`${id}: ${r.ref} is a ${e.kind}, used as ${r.role}`);
    }
    if (s.location_ref && byId.get(s.location_ref)?.kind !== "location") {
      problems.push(`${id}: bad location_ref ${s.location_ref}`);
    }
    for (const c of s.character_refs ?? []) {
      if (byId.get(c)?.kind !== "character") problems.push(`${id}: bad character_ref ${c}`);
    }
    for (const p of s.prop_refs ?? []) {
      if (byId.get(p)?.kind !== "prop") problems.push(`${id}: bad prop_ref ${p}`);
    }
  }

  // every inventory entity should be used somewhere; unused ones are dead weight
  const used = new Set();
  for (const s of segs) {
    for (const ref of [s.location_ref, ...(s.character_refs ?? []), ...(s.prop_refs ?? [])]) {
      if (ref) used.add(ref);
    }
  }
  for (const e of entitiesOf(plan)) {
    if (!used.has(e.id)) warnings.push(`entity ${e.id} is never used by a segment`);
  }

  return { problems, warnings, segments: segs.length, entities: byId.size };
}
