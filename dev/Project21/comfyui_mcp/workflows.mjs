/**
 * The workflow templates in ./workflow, and the small builder that turns tool arguments into a
 * /prompt payload for each of them.
 *
 * Everything here is pure (plus an injected `upload` for image inputs), so the graphs can be
 * unit-tested without a GPU.
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ComfyError } from "./comfy.mjs";

export const WORKFLOW_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "workflow");

const DEFAULT_NEGATIVE =
  "blurry, low quality, deformed, ugly, bad anatomy, bad hands, extra fingers, fewer fingers";

/** Load one template. Always a fresh deep copy, so builders can mutate freely. */
export function loadWorkflow(file) {
  const path = resolve(WORKFLOW_DIR, file);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    throw new ComfyError(`cannot read workflow template ${file}: ${e.code ?? e.message}`, { file: path });
  }
}

export function listWorkflowFiles() {
  try {
    return readdirSync(WORKFLOW_DIR).filter((f) => f.endsWith(".json")).sort();
  } catch {
    return [];
  }
}

/** `"140:131.inputs.prompt"` -> workflow["140:131"].inputs.prompt = value */
export function setPath(target, path, value) {
  const parts = path.split(".");
  let cur = target;
  for (const key of parts.slice(0, -1)) {
    const next = cur[key];
    if (next === null || typeof next !== "object") cur[key] = {};
    cur = cur[key];
  }
  cur[parts.at(-1)] = value;
}

export function dropInput(workflow, nodeId, key) {
  const inputs = workflow[nodeId]?.inputs;
  if (inputs && key in inputs) delete inputs[key];
}

/** Remove whole nodes and any link that pointed at them. */
export function dropNodes(workflow, ids) {
  const gone = new Set(ids);
  for (const id of gone) delete workflow[id];
  for (const node of Object.values(workflow)) {
    for (const [key, value] of Object.entries(node?.inputs ?? {})) {
      if (Array.isArray(value) && value.length === 2 && gone.has(String(value[0]))) {
        delete node.inputs[key];
      }
    }
  }
  return workflow;
}

/** Random 48-bit seed: comfortably inside ComfyUI's int range and readable in logs. */
export function randomSeed() {
  return Math.floor(Math.random() * 2 ** 48);
}

function requirePrompt(args) {
  if (typeof args.prompt !== "string" || args.prompt.trim() === "") {
    throw new ComfyError("prompt is required and must be a non-empty string");
  }
  return args.prompt;
}

function positiveInt(value, fallback, name) {
  if (value === undefined || value === null) return fallback;
  if (!Number.isInteger(value) || value <= 0) throw new ComfyError(`${name} must be a positive integer`, { got: value });
  return value;
}

function clampSeed(value) {
  if (value === undefined || value === null) return randomSeed();
  if (!Number.isInteger(value) || value < 0) throw new ComfyError("seed must be a non-negative integer", { got: value });
  return value;
}

/* ------------------------------------------------------------------ text to image */

/** SDXL-family txt2img: workflow_sdxl_t2i.json, workflow_first_frame.json, workflow_last_frame.json. */
function txt2img(file, defaults, args) {
  const wf = loadWorkflow(file);
  const seed = clampSeed(args.seed);
  const steps = positiveInt(args.steps, defaults.steps, "steps");
  if (args.cfg !== undefined && (typeof args.cfg !== "number" || args.cfg <= 0)) {
    throw new ComfyError("cfg must be a positive number", { got: args.cfg });
  }

  wf["1"].inputs.ckpt_name = args.ckpt_name ?? wf["1"].inputs.ckpt_name;
  wf["2"].inputs.text = requirePrompt(args);
  wf["3"].inputs.text = args.negative_prompt ?? defaults.negative_prompt ?? DEFAULT_NEGATIVE;
  wf["4"].inputs.width = positiveInt(args.width, defaults.width, "width");
  wf["4"].inputs.height = positiveInt(args.height, defaults.height, "height");
  wf["4"].inputs.batch_size = positiveInt(args.batch_size, 1, "batch_size");
  wf["5"].inputs.seed = seed;
  wf["5"].inputs.steps = steps;
  wf["5"].inputs.cfg = args.cfg ?? defaults.cfg;
  wf["5"].inputs.sampler_name = args.sampler_name ?? defaults.sampler_name;
  wf["5"].inputs.scheduler = args.scheduler ?? defaults.scheduler;
  wf["7"].inputs.filename_prefix = args.filename_prefix ?? defaults.filename_prefix;

  return {
    workflow: wf,
    summary: {
      model: wf["1"].inputs.ckpt_name,
      width: wf["4"].inputs.width,
      height: wf["4"].inputs.height,
      batch_size: wf["4"].inputs.batch_size,
      seed,
      steps,
      cfg: wf["5"].inputs.cfg,
      filename_prefix: wf["7"].inputs.filename_prefix
    }
  };
}

const SDXL_DEFAULTS = {
  width: 1024,
  height: 1024,
  steps: 25,
  cfg: 7,
  sampler_name: "euler_ancestral",
  scheduler: "normal",
  filename_prefix: "sdxl"
};

export function buildSdxlT2I(args) {
  return txt2img("workflow_sdxl_t2i.json", SDXL_DEFAULTS, args);
}

export function buildFirstFrame(args) {
  return txt2img(
    "workflow_first_frame.json",
    { ...SDXL_DEFAULTS, steps: 20, filename_prefix: "frame_first" },
    args
  );
}

export function buildLastFrame(args) {
  return txt2img(
    "workflow_last_frame.json",
    { ...SDXL_DEFAULTS, steps: 20, filename_prefix: "frame_last" },
    args
  );
}

/**
 * z-image turbo: distilled, 8 steps, cfg 1 on a zeroed negative (so there is no negative prompt
 * slot at all). The template's UNET/CLIP/VAE are all overridable.
 */
export function buildZImageT2I(args) {
  const wf = loadWorkflow("workflow_z_image_turbo.json");
  const seed = clampSeed(args.seed);

  if (args.unet_name) wf["1"].inputs.unet_name = args.unet_name;
  if (args.clip_name) wf["2"].inputs.clip_name = args.clip_name;
  if (args.vae_name) wf["4"].inputs.vae_name = args.vae_name;
  if (args.shift !== undefined) wf["3"].inputs.shift = args.shift;

  wf["5"].inputs.width = positiveInt(args.width, 1024, "width");
  wf["5"].inputs.height = positiveInt(args.height, 1024, "height");
  wf["5"].inputs.batch_size = positiveInt(args.batch_size, 1, "batch_size");
  wf["6"].inputs.text = requirePrompt(args);
  wf["8"].inputs.seed = seed;
  wf["8"].inputs.steps = positiveInt(args.steps, 8, "steps");
  wf["8"].inputs.cfg = args.cfg ?? 1;
  wf["8"].inputs.sampler_name = args.sampler_name ?? wf["8"].inputs.sampler_name;
  wf["8"].inputs.scheduler = args.scheduler ?? wf["8"].inputs.scheduler;
  wf["10"].inputs.filename_prefix = args.filename_prefix ?? "zimage";

  return {
    workflow: wf,
    summary: {
      model: wf["1"].inputs.unet_name,
      width: wf["5"].inputs.width,
      height: wf["5"].inputs.height,
      batch_size: wf["5"].inputs.batch_size,
      seed,
      steps: wf["8"].inputs.steps,
      cfg: wf["8"].inputs.cfg,
      filename_prefix: wf["10"].inputs.filename_prefix
    }
  };
}

/* ------------------------------------------------------------------ video */

/**
 * MiniMax H3 duration is quantised to 17-frame blocks at 24 fps by the template's math node, so a
 * requested 12 s turns into 294 frames (12.25 s). Override `frames` to bypass the conversion.
 */
function quantiseFrames(requested) {
  // The model pads to the 17k+5 frame grid (verified on the box: 48 -> 56), so round up here
  // instead of reporting a duration the render will not have.
  const raw = Math.max(5, requested);
  return raw + (((5 - (raw % 17)) % 17) + 17) % 17;
}

function setLength(wf, promptNodeId, args, defaultDuration) {
  if (args.frames !== undefined) {
    const frames = quantiseFrames(positiveInt(args.frames, null, "frames"));
    wf[promptNodeId].inputs.length = frames;
    return { frames, duration_sec: Number((frames / 24).toFixed(2)) };
  }
  const duration = args.duration_sec ?? defaultDuration;
  if (typeof duration !== "number" || !(duration > 0)) {
    throw new ComfyError("duration_sec must be a positive number", { got: duration });
  }
  // The math node is already wired; just move the primitive it reads from.
  const floatNode = Object.values(wf).find(
    (n) => n.class_type === "PrimitiveFloat" && n._meta?.title?.toLowerCase().includes("duration")
  );
  if (!floatNode) throw new ComfyError("template changed: no PrimitiveFloat duration node found");
  floatNode.inputs.value = duration;

  const frames = quantiseFrames(Math.round(duration * 24));
  return { frames, duration_sec: Number((frames / 24).toFixed(2)) };
}

function setTurbo(wf, enabled) {
  const boolNode = Object.entries(wf).find(([, n]) => n.class_type === "PrimitiveBoolean");
  if (!boolNode) throw new ComfyError("template changed: no PrimitiveBoolean turbo switch found");
  boolNode[1].inputs.value = Boolean(enabled);
}

function setFps(wf, fps, createVideoNodeId) {
  if (fps === undefined) return wf[createVideoNodeId].inputs.fps;
  if (typeof fps !== "number" || !(fps > 0)) throw new ComfyError("fps must be a positive number", { got: fps });
  wf[createVideoNodeId].inputs.fps = fps;
  return fps;
}

function assertSize(value, fallback, name) {
  const out = positiveInt(value, fallback, name);
  if (out % 32 !== 0) throw new ComfyError(`${name} must be a multiple of 32`, { got: out });
  return out;
}

/** workflow_minimax_h3_t2v.json — text (plus optional first/last frame stills) to video+audio. */
export async function buildMinimaxT2V(args, ctx) {
  const wf = loadWorkflow("video_minimax_h3_t2v.json");
  const width = assertSize(args.width, 512, "width");
  const height = assertSize(args.height, 512, "height");
  const seed = clampSeed(args.seed);
  const turbo = Boolean(args.turbo);

  wf["140:131"].inputs.prompt = requirePrompt(args);
  wf["140:131"].inputs.width = width;
  wf["140:131"].inputs.height = height;
  const timing = setLength(wf, "140:131", args, 12);
  wf["140:129"].inputs.noise_seed = seed;
  setTurbo(wf, turbo);
  wf["92"].inputs.filename_prefix = args.filename_prefix ?? "video/MiniMax_H3";
  const fps = setFps(wf, args.fps, "140:130");

  // Keep the still frames at the generation size, otherwise ImageScale fights the prompt node.
  wf.scale_first.inputs.width = width;
  wf.scale_first.inputs.height = height;
  wf.scale_last.inputs.width = width;
  wf.scale_last.inputs.height = height;
  wf.scale_first.inputs.upscale_method = args.scale_method ?? wf.scale_first.inputs.upscale_method;
  wf.scale_last.inputs.upscale_method = wf.scale_first.inputs.upscale_method;
  wf.scale_first.inputs.crop = args.crop ?? wf.scale_first.inputs.crop;
  wf.scale_last.inputs.crop = wf.scale_first.inputs.crop;

  const inputs = {};
  if (args.first_frame) {
    inputs.first_frame = await ctx.upload(args.first_frame);
    wf.load_first.inputs.image = inputs.first_frame;
  } else {
    dropInput(wf, "140:131", "first_frame");
    dropNodes(wf, ["load_first", "scale_first"]);
  }
  if (args.last_frame) {
    inputs.last_frame = await ctx.upload(args.last_frame);
    wf.load_last.inputs.image = inputs.last_frame;
  } else {
    dropInput(wf, "140:131", "last_frame");
    dropNodes(wf, ["load_last", "scale_last"]);
  }

  return {
    workflow: wf,
    summary: {
      model: wf["140:127"].inputs.unet_name,
      width,
      height,
      fps,
      turbo,
      seed,
      ...timing,
      filename_prefix: wf["92"].inputs.filename_prefix,
      ...inputs
    }
  };
}

/** workflow_minimax_h3_r2v.json — up to three reference images -> video+audio. */
export async function buildMinimaxR2V(args, ctx) {
  const wf = loadWorkflow("video_minimax_h3_r2v.json");
  const width = assertSize(args.width, 352, "width");
  const height = assertSize(args.height, 608, "height");
  const seed = clampSeed(args.seed);
  const turbo = Boolean(args.turbo);

  const rawRefs = args.reference_images;
  const refs = Array.isArray(rawRefs)
    ? rawRefs
    : typeof rawRefs === "string" && rawRefs.trim() !== ""
      ? [rawRefs]
      : [];
  if (refs.length === 0) {
    throw new ComfyError("reference_images must hold at least one local path or ComfyUI input name");
  }
  if (refs.length > 3) {
    throw new ComfyError("the template has three reference slots", { got: refs.length });
  }

  wf["136"].inputs.prompt = requirePrompt(args);
  wf["136"].inputs.width = width;
  wf["136"].inputs.height = height;
  wf["136"].inputs.ref_image_size = args.ref_image_size ?? "match";
  const timing = setLength(wf, "136", args, 5);
  wf["129"].inputs.noise_seed = seed;
  setTurbo(wf, turbo);
  wf["92"].inputs.filename_prefix = args.filename_prefix ?? "video/MiniMax_H3_r2v";
  const fps = setFps(wf, args.fps, "130");

  const slots = [
    { node: "137", key: "ref_images.ref_image_0" },
    { node: "139", key: "ref_images.ref_image_1" },
    { node: "147", key: "ref_images.ref_image_2" }
  ];
  const uploaded = [];
  for (const [index, slot] of slots.entries()) {
    const source = refs[index];
    if (!source) {
      dropInput(wf, "136", slot.key);
      dropNodes(wf, [slot.node]);
      continue;
    }
    const remote = await ctx.upload(source);
    wf[slot.node].inputs.image = remote;
    uploaded.push({ role: `ref_image_${index}`, name: remote });
  }

  return {
    workflow: wf,
    summary: {
      model: wf["127"].inputs.unet_name,
      width,
      height,
      fps,
      turbo,
      seed,
      ...timing,
      filename_prefix: wf["92"].inputs.filename_prefix,
      reference_images: uploaded
    }
  };
}

/** utility-gan_upscaler.json — 4x a video, keeping its audio and frame rate. */
export async function buildUpscaleVideo(args, ctx) {
  if (typeof args.video !== "string" || args.video.trim() === "") {
    throw new ComfyError("video is required: a local path to upload, or a name already in ComfyUI's input folder");
  }
  const wf = loadWorkflow("utility-gan_upscaler.json");
  wf["9"].inputs.file = await ctx.upload(args.video);
  wf["1"].inputs.model_name = args.model_name ?? wf["1"].inputs.model_name;
  wf["12"].inputs.filename_prefix = args.filename_prefix ?? "video/upscaled";
  if (args.codec) wf["12"].inputs.codec = args.codec;

  return {
    workflow: wf,
    summary: {
      model: wf["1"].inputs.model_name,
      video: wf["9"].inputs.file,
      filename_prefix: wf["12"].inputs.filename_prefix
    }
  };
}

/* ------------------------------------------------------------------ text */

/** llm_qwen3_5_text_gen.json — Qwen3.5 VL, optionally looking at one image. */
export async function buildTextGen(args, ctx) {
  const wf = loadWorkflow("llm_qwen3_5_text_gen.json");
  if (args.clip_name) wf["1"].inputs.clip_name = args.clip_name;

  const node = wf["3"].inputs;
  node.prompt = requirePrompt(args);
  node.max_length = positiveInt(args.max_length, 256, "max_length");
  if (args.thinking !== undefined) node.thinking = Boolean(args.thinking);

  const sampling = args.sampling ?? {};
  node["sampling_mode"] = sampling.mode ?? "on";
  if (node["sampling_mode"] === "on") {
    if (sampling.temperature !== undefined) node["sampling_mode.temperature"] = sampling.temperature;
    if (sampling.top_k !== undefined) node["sampling_mode.top_k"] = sampling.top_k;
    if (sampling.top_p !== undefined) node["sampling_mode.top_p"] = sampling.top_p;
    if (sampling.min_p !== undefined) node["sampling_mode.min_p"] = sampling.min_p;
    if (sampling.repetition_penalty !== undefined) {
      node["sampling_mode.repetition_penalty"] = sampling.repetition_penalty;
    }
    if (sampling.presence_penalty !== undefined) node["sampling_mode.presence_penalty"] = sampling.presence_penalty;
    if (sampling.seed !== undefined) node["sampling_mode.seed"] = clampSeed(sampling.seed);
  }

  if (args.system_prompt) {
    node.system_prompt = args.system_prompt;
    node.use_default_template = false;
  }

  let image = null;
  if (args.image) {
    image = await ctx.upload(args.image);
    wf["2"].inputs.image = image;
  } else {
    dropInput(wf, "3", "image");
    dropNodes(wf, ["2"]);
  }

  return {
    workflow: wf,
    summary: {
      model: wf["1"].inputs.clip_name,
      max_length: node.max_length,
      image,
      filename_prefix: null
    }
  };
}

/* ------------------------------------------------------------------ manifest */

/**
 * Tool <-> template map. `requires` is used by comfy_status for a preflight (does the box have
 * the weights this template names?).
 */
export const TOOLS = [
  {
    tool: "sdxl_t2i",
    workflow: "workflow_sdxl_t2i.json",
    kind: "image",
    build: buildSdxlT2I,
    requires: { checkpoints: ["nostrarealisticmix_v20SDXLVAE.safetensors"] }
  },
  {
    tool: "z_image_t2i",
    workflow: "workflow_z_image_turbo.json",
    kind: "image",
    build: buildZImageT2I,
    requires: {
      unets: ["zImageUltimateNSFW_v20.safetensors"],
      clips: ["qwen_3_4b.safetensors"],
      vaes: ["ae.safetensors"]
    }
  },
  {
    tool: "first_frame",
    workflow: "workflow_first_frame.json",
    kind: "image",
    build: buildFirstFrame,
    requires: { checkpoints: ["nostrarealisticmix_v20SDXLVAE.safetensors"] }
  },
  {
    tool: "last_frame",
    workflow: "workflow_last_frame.json",
    kind: "image",
    build: buildLastFrame,
    requires: { checkpoints: ["nostrarealisticmix_v20SDXLVAE.safetensors"] }
  },
  {
    tool: "minimax_t2v",
    workflow: "video_minimax_h3_t2v.json",
    kind: "video",
    build: buildMinimaxT2V,
    requires: {
      unets: ["minimax_h3_fl2va_pruned_int8_convrot.safetensors"],
      clips: ["qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors"],
      vaes: ["minimax_h3_video_vae_fp16.safetensors", "minimax_h3_audio_vae_fp32.safetensors"],
      loras: ["minimax_h3_fl2v_turbo_8step_v1.0_comfyui_bf16.safetensors"]
    }
  },
  {
    tool: "minimax_r2v",
    workflow: "video_minimax_h3_r2v.json",
    kind: "video",
    build: buildMinimaxR2V,
    requires: {
      unets: ["minimax_h3_ref2va_pruned_int8_convrot.safetensors"],
      clips: ["qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors"],
      vaes: ["minimax_h3_video_vae_fp16.safetensors", "minimax_h3_audio_vae_fp32.safetensors"],
      loras: ["minimax_h3_ref2v_turbo_4step_v0.1_comfyui_bf16.safetensors"]
    }
  },
  {
    tool: "upscale_video",
    workflow: "utility-gan_upscaler.json",
    kind: "video",
    build: buildUpscaleVideo,
    requires: { upscalers: ["RealESRGAN_x4plus.safetensors"] }
  },
  {
    tool: "text_gen",
    workflow: "llm_qwen3_5_text_gen.json",
    kind: "text",
    build: buildTextGen,
    requires: { clips: ["qwen3.5_4b_bf16.safetensors"] }
  }
];

export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.tool, t]));

/** Files present on disk but not wired to a tool (and vice versa). */
export function coverage() {
  const files = listWorkflowFiles();
  const mapped = new Set(TOOLS.map((t) => t.workflow));
  return {
    files,
    unmapped_files: files.filter((f) => !mapped.has(f)),
    missing_files: TOOLS.map((t) => t.workflow).filter((f) => !files.includes(f))
  };
}

export { DEFAULT_NEGATIVE, DEFAULT_NEGATIVE as DEFAULT_NEGATIVE_PROMPT };
