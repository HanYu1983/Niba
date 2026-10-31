/**
 * video-compiler — core compiler for the Omni-Media prompt architecture.
 *
 * Two outputs, same source project:
 *
 *   compileBlock()    section 1.4 shape — a self-contained project JSON holding ONE block,
 *                     its referenced entities, and entity_ref / referenced_blocks intact.
 *                     This is what the MCP `compile_block` tool returns.
 *
 *   compilePayload()  section 6.2 shape — the flat API payload (prompt string, duration_sec,
 *                     dialogue fields). Kept for the upcoming ComfyUI adapter.
 *
 *   entityPrompt()    one entity's reference-image prompt, so the r2v plates can be
 *                     produced or re-checked without opening the whole project.
 *
 * Not implemented yet: `referenced_blocks` expansion (6.1). The ids are validated and
 * preserved, but the referenced blocks are not merged into the prompt text.
 */

export const VERSION = "0.5.0";

/** Compiler-specific failure, so the MCP layer can report it without a stack dump. */
export class CompilerError extends Error {
  constructor(message, details = undefined) {
    super(message);
    this.name = "CompilerError";
    this.details = details;
  }
}

function isObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function requireArray(owner, key, where) {
  const v = owner?.[key];
  if (v === undefined) return [];
  if (!Array.isArray(v)) throw new CompilerError(`${where}.${key} must be an array`);
  return v;
}

function indexById(list, id, kind) {
  const map = new Map();
  for (const item of list) {
    if (isObject(item) && typeof item.id === "string") map.set(item.id, item);
  }
  if (!map.has(id)) {
    throw new CompilerError(`unknown ${kind} id "${id}"`, { known_ids: [...map.keys()] });
  }
  return map.get(id);
}

function findBlock(blocks, blockId) {
  const block = blocks.find((b) => isObject(b) && b.id === blockId);
  if (!block) {
    throw new CompilerError(`block id "${blockId}" not found in project`, {
      known_ids: blocks.map((b) => b?.id).filter((id) => typeof id === "string")
    });
  }
  return block;
}

function assertTimeframe(block) {
  const tf = isObject(block.timeframe) ? block.timeframe : {};
  const { start_sec: start, end_sec: end } = tf;
  if (typeof start !== "number" || typeof end !== "number" || !(end > start)) {
    throw new CompilerError(`block "${block.id}" needs timeframe.start_sec < end_sec`, { timeframe: tf });
  }
  return { start, end };
}

/**
 * Compile one block into a project-shaped JSON (section 1.4).
 *
 * The block is copied verbatim (entity_ref / referenced_blocks untouched) and every
 * entity it points at is pulled in, so the slice can be read without the rest of the story.
 *
 * @param {object} project parsed project JSON
 * @param {string} blockId block to extract
 * @param {{reset_timeframe?: boolean}} [opts] reset_timeframe defaults to true: each compiled slice
 *   starts at 0..duration (section 6.1), since the render API only sees one shot.
 */
export function compileBlock(project, blockId, opts = {}) {
  if (!isObject(project)) throw new CompilerError("project must be a JSON object");
  if (typeof blockId !== "string" || blockId.length === 0) {
    throw new CompilerError("block_id must be a non-empty string");
  }

  const blocks = requireArray(project, "blocks", "project");
  const block = findBlock(blocks, blockId);
  const { start, end } = assertTimeframe(block);

  const entities = isObject(project.entities) ? project.entities : {};
  const characters = requireArray(entities, "characters", "entities");
  const props = requireArray(entities, "props", "entities");
  const locations = requireArray(entities, "locations", "entities");

  // Every pointer must resolve, otherwise the slice would carry a dangling ref.
  const usedCharacterIds = new Set();
  for (const entry of requireArray(block, "present_characters", `blocks[${blockId}]`)) {
    if (!isObject(entry) || typeof entry.entity_ref !== "string") {
      throw new CompilerError("present_characters entries need an entity_ref string", { entry });
    }
    indexById(characters, entry.entity_ref, "character");
    usedCharacterIds.add(entry.entity_ref);
  }

  const usedPropIds = new Set();
  for (const entry of requireArray(block, "present_props", `blocks[${blockId}]`)) {
    if (!isObject(entry) || typeof entry.entity_ref !== "string") {
      throw new CompilerError("present_props entries need an entity_ref string", { entry });
    }
    indexById(props, entry.entity_ref, "prop");
    usedPropIds.add(entry.entity_ref);
  }
  if (typeof block.action?.target_ref === "string" && props.some((p) => p?.id === block.action.target_ref)) {
    usedPropIds.add(block.action.target_ref);
  }

  const usedLocationIds = new Set();
  if (typeof block.location_ref === "string") {
    indexById(locations, block.location_ref, "location");
    usedLocationIds.add(block.location_ref);
  }

  const blockIds = new Set(blocks.map((b) => b?.id).filter(Boolean));
  const referenced = requireArray(block, "referenced_blocks", `blocks[${blockId}]`);
  const missingRefs = referenced.filter((ref) => !blockIds.has(ref));
  if (missingRefs.length > 0) {
    throw new CompilerError(`block "${blockId}" references missing blocks`, { missing_refs: missingRefs });
  }

  const outBlock = structuredClone(block);
  if (opts.reset_timeframe !== false) outBlock.timeframe = { start_sec: 0, end_sec: end - start };

  const pick = (list, used) => list.filter((x) => used.has(x?.id)).map((x) => structuredClone(x));

  const out = {
    version: project.version ?? null,
    project_title: project.project_title ?? null,
    ...(isObject(project.global_settings) ? { global_settings: structuredClone(project.global_settings) } : {}),
    entities: {
      characters: pick(characters, usedCharacterIds),
      props: pick(props, usedPropIds),
      locations: pick(locations, usedLocationIds)
    },
    blocks: [outBlock]
  };

  return out;
}

const ENTITY_KINDS = [
  { key: "characters", kind: "character" },
  { key: "props", kind: "prop" },
  { key: "locations", kind: "location" }
];

/** Trim a prose field down to one clause, dropping a trailing period so it can be joined. */
function sentence(v) {
  return typeof v === "string" && v.trim() !== "" ? v.trim().replace(/\.+$/, "") : "";
}

/**
 * Build a reference-image prompt from the entity's own fields, for the plates that
 * have no `reference.prompt` yet. Characters get a portrait plate, props a top-down
 * plate, locations a wide empty establishing plate.
 */
function derivedEntityPrompt(entity, kind) {
  const name = entity.name ?? entity.id;

  if (kind === "character") {
    const f = isObject(entity.identity_features) ? entity.identity_features : {};
    const features = [f.ethnicity, f.age, f.face_and_hair, f.physique, f.vibe].filter(Boolean).join(", ");
    const traits = sentence(entity.traits);
    const look = features || traits;
    return {
      source: features ? "identity_features" : traits ? "traits" : "name",
      prompt:
        ["Neutral front-facing portrait", look, "plain grey backdrop, soft key light, 16:9 crop, no text"]
          .filter(Boolean)
          .join(", ") + "."
    };
  }

  if (kind === "prop") {
    const look = sentence(entity.appearance);
    return {
      source: "appearance",
      prompt: [`Top-down plate of ${name}`, look, "plain dark surface, 35mm film grain, no captions"].filter(Boolean).join(", ") + "."
    };
  }

  const look = sentence(entity.description);
  return {
    source: "description",
    prompt: [`Wide establishing plate of ${name}`, look, "empty of people, no text, 16:9, 35mm film grain"].filter(Boolean).join(", ") + "."
  };
}

/**
 * Return one entity's reference-image prompt.
 *
 * A project entity may carry `reference: { image, status, prompt }`. When `prompt` is there
 * it wins verbatim — that string is what actually produced (or will produce) the plate.
 * Otherwise the prompt is derived from `identity_features` / `traits` / `appearance` /
 * `description`, so an entity written before the r2v rules still answers.
 *
 * @param {object} project parsed project JSON
 * @param {string} entityId character / prop / location id
 */
export function entityPrompt(project, entityId) {
  if (!isObject(project)) throw new CompilerError("project must be a JSON object");
  if (typeof entityId !== "string" || entityId.length === 0) {
    throw new CompilerError("entity_id must be a non-empty string");
  }

  const entities = isObject(project.entities) ? project.entities : {};
  const found = [];
  for (const { key, kind } of ENTITY_KINDS) {
    for (const entity of requireArray(entities, key, "entities")) {
      if (isObject(entity) && typeof entity.id === "string") found.push({ entity, kind });
    }
  }

  const hit = found.find(({ entity }) => entity.id === entityId);
  if (!hit) {
    throw new CompilerError(`unknown entity id "${entityId}"`, { known_ids: found.map(({ entity }) => entity.id) });
  }

  const { entity, kind } = hit;
  const reference = isObject(entity.reference) ? entity.reference : null;
  const hasPrompt = typeof reference?.prompt === "string" && reference.prompt.trim() !== "";
  const built = hasPrompt ? null : derivedEntityPrompt(entity, kind);

  const attributes =
    kind === "character"
      ? isObject(entity.identity_features)
        ? entity.identity_features
        : typeof entity.traits === "string"
          ? { traits: entity.traits }
          : {}
      : kind === "prop"
        ? { appearance: entity.appearance ?? null }
        : { description: entity.description ?? null };

  return {
    kind,
    id: entity.id,
    name: entity.name ?? entity.id,
    prompt: hasPrompt ? reference.prompt.trim() : built.prompt,
    prompt_source: hasPrompt ? "reference" : built.source,
    attributes: structuredClone(attributes),
    ...(Array.isArray(entity.aliases) ? { aliases: [...entity.aliases] } : {}),
    ...(reference
      ? {
          reference: {
            image: reference.image ?? null,
            status: reference.status ?? null
          }
        }
      : {})
  };
}

/** "許法官 (Judge Xu) (Late 50s, Sharp jawline...): Outfit: ... . Facial State: ... ." */
function hydrateCharacter(entry, characters) {
  const entity = indexById(characters, entry.entity_ref, "character");
  const f = isObject(entity.identity_features) ? entity.identity_features : {};
  const name = entity.name ?? entry.entity_ref;
  const identity = [f.age, f.face_and_hair].filter(Boolean).join(", ");

  return (
    `${name}${identity ? ` (${identity})` : ""}: ` +
    `Outfit: ${entry.outfit ?? "standard"}. ` +
    `Facial State: ${entry.facial_state ?? "neutral"}.`
  );
}

/**
 * Section 6.2 payload: one flat render request (used by the future ComfyUI adapter).
 */
export function compilePayload(project, blockId) {
  if (!isObject(project)) throw new CompilerError("project must be a JSON object");
  if (typeof blockId !== "string" || blockId.length === 0) {
    throw new CompilerError("block_id must be a non-empty string");
  }

  const blocks = requireArray(project, "blocks", "project");
  const block = findBlock(blocks, blockId);
  const { start, end } = assertTimeframe(block);

  const entities = isObject(project.entities) ? project.entities : {};
  const characters = requireArray(entities, "characters", "entities");
  const presentCharacters = requireArray(block, "present_characters", `blocks[${blockId}]`);
  const characterPrompts = presentCharacters.map((c) => hydrateCharacter(c, characters));

  const action = block.action;
  if (!isObject(action) || typeof action.description !== "string" || action.description.trim() === "") {
    throw new CompilerError(`block "${blockId}" needs action.description`);
  }

  const audioCfg = isObject(block.audio_control) ? block.audio_control : {};
  const soundtrackSpec = typeof audioCfg.soundtrack_specification === "string" ? audioCfg.soundtrack_specification : "";

  const segments = [action.description.trim()];
  if (characterPrompts.length > 0) segments.push(`Characters involved: ${characterPrompts.join(" ")}`);
  if (soundtrackSpec) segments.push(`Acoustic & Soundtrack Environment: ${soundtrackSpec}`);

  const payload = {
    block_id: block.id,
    prompt: segments.join(" "),
    duration_sec: end - start,
    audio_mode: audioCfg.audio_mode ?? null,
    lip_sync_enabled: audioCfg.lip_sync_enabled === true,
    speech_present: audioCfg.speech_present === true
  };

  if (isObject(audioCfg.dialogue)) {
    const d = audioCfg.dialogue;
    if (typeof d.original_text !== "string" || d.original_text.trim() === "") {
      throw new CompilerError(`block "${blockId}" has dialogue without original_text`);
    }
    payload.dialogue_script = d.original_text;
    payload.voice_prompt = d.voice_prompt ?? "";
    payload.dialogue_type = d.type ?? null;
    payload.dialogue_language = d.language ?? null;
  }

  return payload;
}
