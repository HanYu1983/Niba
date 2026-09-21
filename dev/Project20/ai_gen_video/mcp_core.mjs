import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createRequire } from "node:module";
import { z } from "zod";
import { dirname, resolve, join, basename, parse, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeVideos } from "./merge_service.mjs";

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const FFMPEG = require("ffmpeg-static");

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVER = process.env.COMFY_SERVER || "http://192.168.0.193:8000";
const POLL_INTERVAL = 3000;
const POLL_TIMEOUT = 30 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function comfyGet(path) {
  const res = await fetch(`${SERVER}${path}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

async function comfyPost(path, body, raw = false) {
  const res = await fetch(`${SERVER}${path}`, {
    method: "POST",
    headers: raw ? {} : { "Content-Type": "application/json" },
    body: raw ? body : JSON.stringify(body)
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

async function uploadFile(filename, buf) {
  const form = new FormData();
  form.append("image", new Blob([buf], { type: "application/octet-stream" }), filename);
  form.append("overwrite", "true");
  return comfyPost("/upload/image", form, true);
}

function outArg(subdir) {
  if (!subdir) return resolve(HERE, "output");
  return isAbsolute(subdir) ? subdir : resolve(HERE, "output", subdir);
}

function setIfSet(inputs, key, value) {
  if (value !== undefined) inputs[key] = value;
}

function buildImageWorkflow(wfFile, { prompt, seed, width, height, negative_prompt, ckpt, unet, clip, weightDtype, shift, steps, cfg, samplerName, scheduler, denoise, batchSize }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, wfFile), "utf-8"));
  const nodes = Object.entries(wf);
  const nodeByClass = (cls) => nodes.find(([, n]) => n.class_type === cls)?.[1];
  const posNode = nodeByClass("CLIPTextEncode");
  const negNode = nodes.filter(([, n]) => n.class_type === "CLIPTextEncode")[1]?.[1];
  const sampler = nodeByClass("KSampler");
  const latent = nodeByClass("EmptySD3LatentImage") || nodeByClass("EmptyLatentImage");
  const ckptLoader = nodeByClass("CheckpointLoaderSimple");
  const unetLoader = nodeByClass("UNETLoader");
  const clipLoader = nodeByClass("CLIPLoader");
  const samplingNode = nodeByClass("ModelSamplingAuraFlow");
  if (posNode && prompt) posNode.inputs.text = prompt;
  if (negNode && negative_prompt) negNode.inputs.text = negative_prompt;
  if (sampler) {
    setIfSet(sampler.inputs, "seed", seed);
    setIfSet(sampler.inputs, "steps", steps);
    setIfSet(sampler.inputs, "cfg", cfg);
    setIfSet(sampler.inputs, "sampler_name", samplerName);
    setIfSet(sampler.inputs, "scheduler", scheduler);
    setIfSet(sampler.inputs, "denoise", denoise);
  }
  if (latent) {
    setIfSet(latent.inputs, "width", width);
    setIfSet(latent.inputs, "height", height);
    setIfSet(latent.inputs, "batch_size", batchSize);
  }
  if (ckptLoader) setIfSet(ckptLoader.inputs, "ckpt_name", ckpt);
  if (unetLoader) {
    setIfSet(unetLoader.inputs, "unet_name", unet);
    setIfSet(unetLoader.inputs, "weight_dtype", weightDtype);
  }
  if (clipLoader) setIfSet(clipLoader.inputs, "clip_name", clip);
  if (samplingNode) setIfSet(samplingNode.inputs, "shift", shift);
  return wf;
}

function buildVideoWorkflow({ prompt, seed, duration, firstFile, lastFile, width, height }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, "video_minimax_h3_t2v.json"), "utf-8"));
  wf["140:133"].inputs.value = duration;
  if (seed !== undefined) wf["140:129"].inputs.noise_seed = seed;
  if (prompt) wf["140:131"].inputs.prompt = prompt;
  if (width !== undefined) wf["140:131"].inputs.width = width;
  if (height !== undefined) wf["140:131"].inputs.height = height;
  if (firstFile) wf.load_first.inputs.image = firstFile;
  if (lastFile) wf.load_last.inputs.image = lastFile;
  if (!firstFile && !lastFile) {
    delete wf.load_first;
    delete wf.load_last;
    delete wf.scale_first;
    delete wf.scale_last;
    delete wf["140:131"].inputs.first_frame;
    delete wf["140:131"].inputs.last_frame;
  } else if (firstFile && !lastFile) {
    delete wf.load_last;
    delete wf.scale_last;
    delete wf["140:131"].inputs.last_frame;
    if (width !== undefined) wf.scale_first.inputs.width = width;
    if (height !== undefined) wf.scale_first.inputs.height = height;
  } else {
    if (width !== undefined) {
      wf.scale_first.inputs.width = width;
      wf.scale_last.inputs.width = width;
    }
    if (height !== undefined) {
      wf.scale_first.inputs.height = height;
      wf.scale_last.inputs.height = height;
    }
  }
  return wf;
}

function buildR2vWorkflow({ prompt, seed, duration, refImages = [], refVideos = [], refAudios = [], width, height }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, "video_minimax_h3_r2v.json"), "utf-8"));
  if (prompt) wf["138"].inputs.value = prompt;
  if (seed !== undefined) wf["129"].inputs.noise_seed = seed;
  if (duration !== undefined) wf["132"].inputs.value = duration;
  const target = wf["136"];
  const used = new Set(Object.keys(wf));
  const nextId = () => { let n = 900; while (used.has(String(n))) n++; used.add(String(n)); return String(n); };

  const clearRef = (prefix) => {
    for (const k of Object.keys(target.inputs)) {
      if (k.startsWith(prefix)) delete target.inputs[k];
    }
  };
  clearRef("ref_images.");
  clearRef("ref_videos.");
  clearRef("ref_video_audios.");
  clearRef("ref_audios.");
  for (const [id, node] of Object.entries(wf)) {
    if (node.class_type === "LoadImage" && !Object.values(target.inputs).some((v) => Array.isArray(v) && v[0] === id)) {
      delete wf[id];
    }
  }

  refImages.forEach((file, i) => {
    const id = nextId();
    wf[id] = { inputs: { image: file }, class_type: "LoadImage" };
    target.inputs[`ref_images.ref_image_${i}`] = [id, 0];
  });

  refVideos.forEach((file, i) => {
    const vidId = nextId();
    wf[vidId] = { inputs: { file }, class_type: "LoadVideo" };
    const compId = nextId();
    wf[compId] = { inputs: { video: [vidId, 0] }, class_type: "GetVideoComponents" };
    target.inputs[`ref_videos.ref_video_${i}`] = [compId, 0];
    target.inputs[`ref_video_audios.ref_video_audio_${i}`] = [compId, 1];
  });

  refAudios.forEach((file, i) => {
    const id = nextId();
    wf[id] = { inputs: { audio: file }, class_type: "LoadAudio" };
    target.inputs[`ref_audios.ref_audio_${i}`] = [id, 0];
  });

  if (width !== undefined) target.inputs.width = width;
  if (height !== undefined) target.inputs.height = height;
  return wf;
}

function buildUpscaleWorkflow({ file, model }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, "utility-gan_upscaler.json"), "utf-8"));
  wf["9"].inputs.file = file;
  if (model) wf["1"].inputs.model_name = model;
  return wf;
}

function buildTextGenWorkflow({ imageFile, prompt, maxLength, seed, temperature }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, "llm_qwen3_5_text_gen.json"), "utf-8"));
  wf["2"].inputs.image = imageFile;
  if (prompt !== undefined) wf["3"].inputs.prompt = prompt;
  if (maxLength !== undefined) wf["3"].inputs.max_length = maxLength;
  if (seed !== undefined) wf["3"].inputs["sampling_mode.seed"] = seed;
  if (temperature !== undefined) wf["3"].inputs["sampling_mode.temperature"] = temperature;
  return wf;
}

async function downloadAndSave(filename, subfolder, type, outDir, meta) {
  const params = new URLSearchParams({ filename, subfolder: subfolder || "", type: type || "output" });
  const res = await fetch(`${SERVER}/view?${params.toString()}`);
  if (!res.ok) throw new Error(`download failed ${filename}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const destDir = join(outDir, subfolder || "");
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, basename(filename));
  writeFileSync(dest, buf);
  if (meta) {
    const lines = [
      `prompt: ${meta.prompt}`,
      `seed: ${meta.seed ?? "n/a"}`,
      meta.duration !== undefined ? `duration: ${meta.duration}` : null,
      meta.width !== undefined ? `width: ${meta.width}` : null,
      meta.height !== undefined ? `height: ${meta.height}` : null,
      `model: ${meta.model}`,
      ...(meta.extra || []).map((e) => `${e.key}: ${e.value}`),
      `date: ${new Date().toISOString()}`
    ].filter(Boolean);
    writeFileSync(dest + ".txt", lines.join("\n") + "\n");
  }
  return dest;
}

// ---- Background job: poll ComfyUI + auto-download + write .txt ----

const jobs = new Map();

function startBackgroundJob(promptId, meta) {
  const job = { status: "processing", files: [], error: null };
  jobs.set(promptId, job);

  (async () => {
    const deadline = Date.now() + POLL_TIMEOUT;
    while (Date.now() < deadline) {
      let history;
      try {
        history = await comfyGet(`/api/history/${promptId}`);
      } catch (e) {
        process.stderr.write(`[mcp] job ${promptId} poll error: ${e.message}\n`);
        await sleep(POLL_INTERVAL);
        continue;
      }
      if (!history || !history[promptId]) { await sleep(POLL_INTERVAL); continue; }
      const entry = history[promptId];
      const s = entry.status || {};
      if (s.status_str === "error" || s.completed === false) {
        job.status = "error";
        job.error = s.messages;
        process.stderr.write(`[mcp] job ${promptId} failed: ${JSON.stringify(s.messages)}\n`);
        return;
      }
      for (const nodeOutput of Object.values(entry.outputs || {})) {
        for (const value of Object.values(nodeOutput)) {
          if (!Array.isArray(value)) continue;
          for (const item of value) {
            if (item?.filename) {
              try {
                const txtMeta = { prompt: meta.prompt, seed: meta.seed, duration: meta.duration, model: meta.model, width: meta.width, height: meta.height, extra: meta.extra };
                job.files.push(await downloadAndSave(item.filename, item.subfolder, item.type, meta.out, txtMeta));
              } catch (e) {
                process.stderr.write(`[mcp] job ${promptId} download ${item.filename} error: ${e.message}\n`);
              }
            }
          }
        }
      }
      const text = extractTextFromHistory(entry);
      if (text.length) {
        job.text = text;
        try {
          mkdirSync(meta.out, { recursive: true });
          const dest = join(meta.out, `llm_text_${promptId}.txt`);
          writeFileSync(dest, text.join("\n\n") + "\n");
          job.textFile = dest;
          if (!job.files.includes(dest)) job.files.push(dest);
        } catch (e) {
          process.stderr.write(`[mcp] job ${promptId} save text error: ${e.message}\n`);
        }
      }
      job.status = "completed";
      process.stderr.write(`[mcp] job ${promptId} completed: ${job.files.length} file(s)\n`);
      return;
    }
    job.status = "timeout";
    process.stderr.write(`[mcp] job ${promptId} timed out\n`);
  })().catch((e) => {
    job.status = "error";
    job.error = e.message;
    process.stderr.write(`[mcp] job ${promptId} fatal error: ${e.message}\n`);
  });

  return job;
}

// ---- History helpers ----

function collectStrings(value, acc) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") { if (item.trim()) acc.push(item.trim()); }
      else if (item && typeof item === "object" && !item.filename) collectStrings(item, acc);
    }
  } else if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectStrings(v, acc);
  }
  return acc;
}

function extractTextFromHistory(entry) {
  const acc = [];
  for (const nodeOutput of Object.values(entry.outputs || {})) {
    collectStrings(nodeOutput, acc);
  }
  return [...new Set(acc)];
}

function summarizeHistoryEntry(id, entry) {
  const s = entry.status || {};
  const outputs = Object.values(entry.outputs || {})
    .flatMap((no) => Object.values(no))
    .flatMap((v) => (Array.isArray(v) ? v : []))
    .filter((i) => i && i.filename)
    .map((i) => ({ filename: i.filename, subfolder: i.subfolder || "", type: i.type || "output" }));
  return {
    prompt_id: id,
    status: s.status_str || "?",
    completed: s.completed ?? undefined,
    outputsCount: outputs.length,
    outputs
  };
}

function extractMetaFromHistory(entry) {
  const wf = entry.prompt || {};
  let prompt, seed, duration;
  for (const n of Object.values(wf)) {
    const inp = n && n.inputs ? n.inputs : {};
    if (prompt === undefined && (inp.prompt || inp.text)) prompt = inp.prompt || inp.text;
    if (seed === undefined && inp.noise_seed !== undefined) seed = inp.noise_seed;
    if (duration === undefined && typeof inp.value === "number" && inp.value >= 1 && inp.value <= 60) duration = inp.value;
  }
  return { prompt, seed, duration };
}

// ---- Tools ----

export function createMcpServer() {
  const server = new McpServer({ name: "comfy-video-gen", version: "4.0.0" });

  // ---------------- Image: SDXL ----------------
  server.tool(
    "gen_sdxl_image",
    "Submit an SDXL image generation job. Returns prompt_id immediately; background auto-downloads when done.",
    {
      prompt: z.string().min(1),
      seed: z.number().int().nonnegative().optional(),
      width: z.number().int().min(64).max(4096).step(32).optional(),
      height: z.number().int().min(64).max(4096).step(32).optional(),
      ckpt: z.string().optional().describe("checkpoint model filename (CheckpointLoaderSimple ckpt_name), default 'nostrarealisticmix_v20SDXLVAE.safetensors'"),
      steps: z.number().int().min(1).max(150).optional(),
      cfg: z.number().min(0).max(30).optional(),
      sampler_name: z.string().optional().describe("e.g. euler, euler_ancestral, dpmpp_2m, dpmpp_sde"),
      scheduler: z.string().optional().describe("e.g. normal, karras, exponential, sgm_uniform"),
      denoise: z.number().min(0).max(1).optional(),
      batch_size: z.number().int().min(1).max(16).optional(),
      negative_prompt: z.string().optional().describe("override the default negative prompt"),
      out: z.string().optional().describe("output directory: subdirectory under output/ (e.g. 'car') or an absolute path")
    },
    async (p) => {
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const wf = buildImageWorkflow("workflow_sdxl_t2i.json", {
        prompt: p.prompt, seed, width: p.width, height: p.height,
        negative_prompt: p.negative_prompt, ckpt: p.ckpt, steps: p.steps, cfg: p.cfg, samplerName: p.sampler_name,
        scheduler: p.scheduler, denoise: p.denoise, batchSize: p.batch_size
      });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, {
        out: outArg(p.out), seed, prompt: p.prompt, model: `sdxl:${p.ckpt ?? "nostrarealisticmix_v20SDXLVAE.safetensors"}`,
        extra: [["ckpt", p.ckpt], ["steps", p.steps], ["cfg", p.cfg], ["sampler_name", p.sampler_name], ["scheduler", p.scheduler], ["denoise", p.denoise], ["batch_size", p.batch_size]].filter(([, v]) => v !== undefined).map(([k, v]) => ({ key: k, value: v }))
      });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed }, null, 2) }] };
    }
  );

  // ---------------- Image: Z-Image Turbo ----------------
  server.tool(
    "gen_zit_image",
    "Submit a Z-Image Turbo image generation job. Returns prompt_id immediately; background auto-downloads when done.",
    {
      prompt: z.string().min(1),
      seed: z.number().int().nonnegative().optional(),
      width: z.number().int().min(64).max(4096).step(32).optional(),
      height: z.number().int().min(64).max(4096).step(32).optional(),
      unet: z.string().optional().describe("UNET model filename (UNETLoader unet_name), default 'zImageUltimateNSFW_v20.safetensors'"),
      clip: z.string().optional().describe("CLIP model filename (CLIPLoader clip_name), default 'qwen_3_4b.safetensors'"),
      weight_dtype: z.enum(["default", "fp8_e4m3fn", "fp8_e4m3fn_fast", "fp8_e5m2", "fp16"]).optional(),
      shift: z.number().optional().describe("ModelSamplingAuraFlow shift, default 3"),
      steps: z.number().int().min(1).max(150).optional(),
      cfg: z.number().min(0).max(8).optional(),
      sampler_name: z.string().optional().describe("e.g. res_multistep (default), euler"),
      scheduler: z.string().optional().describe("e.g. simple (default), karras, normal"),
      denoise: z.number().min(0).max(1).optional(),
      batch_size: z.number().int().min(1).max(16).optional(),
      out: z.string().optional().describe("output directory: subdirectory under output/ (e.g. 'car') or an absolute path")
    },
    async (p) => {
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const wf = buildImageWorkflow("workflow_z_image_turbo.json", {
        prompt: p.prompt, seed, width: p.width, height: p.height,
        unet: p.unet, clip: p.clip, weightDtype: p.weight_dtype, shift: p.shift,
        steps: p.steps, cfg: p.cfg, samplerName: p.sampler_name,
        scheduler: p.scheduler, denoise: p.denoise, batchSize: p.batch_size
      });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, {
        out: outArg(p.out), seed, prompt: p.prompt, model: `z-image-turbo:${p.unet ?? "zImageUltimateNSFW_v20.safetensors"}`,
        extra: [["unet", p.unet], ["clip", p.clip], ["weight_dtype", p.weight_dtype], ["shift", p.shift], ["steps", p.steps], ["cfg", p.cfg], ["sampler_name", p.sampler_name], ["scheduler", p.scheduler], ["denoise", p.denoise], ["batch_size", p.batch_size]].filter(([, v]) => v !== undefined).map(([k, v]) => ({ key: k, value: v }))
      });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed }, null, 2) }] };
    }
  );

  // ---------------- Misc: list available model files ----------------
  server.tool(
    "list_models",
    "List the model filenames available on the ComfyUI server for the image generation loaders (checkpoints, UNETs, CLIP, VAE). Useful for picking valid values for gen_sdxl_image (ckpt) and gen_zit_image (unet/clip).",
    {
      kind: z.enum(["checkpoint", "unet", "clip", "vae"]).optional().describe("only list one kind; omit to list all")
    },
    async (p) => {
      const info = await comfyGet("/object_info");
      const collect = (cls) => {
        const node = info[cls];
        const req = node?.input?.required || {};
        for (const [, spec] of Object.entries(req)) {
          if (Array.isArray(spec) && Array.isArray(spec[0]) && spec[0].every((x) => typeof x === "string")) {
            return spec[0];
          }
        }
        return [];
      };
      const kinds = p.kind ? [p.kind] : ["checkpoint", "unet", "clip", "vae"];
      const map = {
        checkpoint: ["CheckpointLoaderSimple", "ckpt"],
        unet: ["UNETLoader", "unet"],
        clip: ["CLIPLoader", "clip"],
        vae: ["VAELoader", "vae"]
      };
      const result = {};
      for (const k of kinds) {
        const [cls] = map[k];
        result[k] = collect(cls);
      }
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ---------------- LLM: Qwen3.5 4B image -> text prompt ----------------
  server.tool(
    "gen_txt_from_image",
    "Extract an image-to-text description / prompt using the Qwen3.5 4B vision-text LLM (TextGenerate + PreviewAny workflow). Uploads the image, submits the job, and background-polls ComfyUI; the generated text is saved as a .txt under output/ and queryable via query_comfy_result.",
    {
      image: z.string().min(1).describe("local path to the image to describe"),
      prompt: z.string().optional().describe("system prompt override (default from workflow: detailed image description suitable for AI image generation)"),
      max_length: z.number().int().min(1).optional().describe("max generated tokens (default 256)"),
      seed: z.number().int().nonnegative().optional().describe("sampling seed (default 0)"),
      temperature: z.number().min(0).max(2).optional().describe("sampling temperature (default 0.7)"),
      out: z.string().optional().describe("output directory for the generated .txt: subdirectory under output/ or an absolute path")
    },
    async (p) => {
      const name = `mcp_${Date.now()}_${basename(p.image)}`;
      await uploadFile(name, readFileSync(resolve(p.image)));
      const wf = buildTextGenWorkflow({ imageFile: name, prompt: p.prompt, maxLength: p.max_length, seed: p.seed, temperature: p.temperature });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed: p.seed, prompt: p.prompt || "(workflow default)", model: "qwen3.5-4b-textgen" });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動生成中", prompt_id: res.prompt_id, image: name }, null, 2) }] };
    }
  );

  // ---------------- Video: Text-to-Video (MiniMax H3) ----------------
  server.tool(
    "gen_t2v_video",
    "Submit a text-to-video job (MiniMax H3). Returns prompt_id immediately; background auto-downloads when done.",
    {
      prompt: z.string().min(1),
      seed: z.number().int().nonnegative().optional(),
      duration: z.number().min(1).max(60).default(5).optional(),
      width: z.number().int().min(64).max(4096).step(32).optional().describe("video width, default from workflow (e.g. 512)"),
      height: z.number().int().min(64).max(4096).step(32).optional().describe("video height, default from workflow"),
      out: z.string().optional().describe("output directory: subdirectory under output/ (e.g. 'fight') or an absolute path")
    },
    async (p) => {
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const duration = p.duration ?? 5;
      const wf = buildVideoWorkflow({ prompt: p.prompt, seed, duration, width: p.width, height: p.height });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, duration, model: "minimax-h3", width: p.width, height: p.height });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed, duration, width: p.width ?? null, height: p.height ?? null }, null, 2) }] };
    }
  );

  // ---------------- Video: Image-to-Video (MiniMax H3) ----------------
  server.tool(
    "gen_i2v_video",
    "Submit an image-to-video job (MiniMax H3). first_frame is a local image path (auto-uploaded); last_frame is optional. Provide both frames to animate from first to last; omit last_frame for a first-frame-only animation. Returns prompt_id immediately; background auto-downloads when done.",
    {
      prompt: z.string().min(1),
      first_frame: z.string().describe("local path to first frame image"),
      last_frame: z.string().optional().describe("local path to last frame image (optional; omit for first-frame-only animation)"),
      seed: z.number().int().nonnegative().optional(),
      duration: z.number().min(1).max(60).default(5).optional(),
      width: z.number().int().min(64).max(4096).step(32).optional().describe("video width, default from workflow (e.g. 512)"),
      height: z.number().int().min(64).max(4096).step(32).optional().describe("video height, default from workflow"),
      out: z.string().optional().describe("output directory: subdirectory under output/ or an absolute path")
    },
    async (p) => {
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const duration = p.duration ?? 5;
      const up = async (file) => {
        const name = basename(file);
        await uploadFile(name, readFileSync(file));
        return name;
      };
      const firstFile = await up(resolve(p.first_frame));
      const lastFile = p.last_frame ? await up(resolve(p.last_frame)) : undefined;
      const wf = buildVideoWorkflow({ prompt: p.prompt, seed, duration, firstFile, lastFile, width: p.width, height: p.height });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, duration, model: "minimax-h3-i2v", width: p.width, height: p.height });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed, duration, first_frame: firstFile, last_frame: lastFile, width: p.width ?? null, height: p.height ?? null }, null, 2) }] };
    }
  );

  // ---------------- Video: Reference-to-Video (MiniMax H3 r2v) ----------------
  server.tool(
    "gen_r2v_video",
    "Submit a reference-to-video job (MiniMax H3 ref2va). Accepts up to 9 reference images, 3 reference videos, and 3 reference audios (total 12 files max). Reference images establish character/scene consistency. Prompt uses the structured A/B/C/D format. Returns prompt_id immediately; background auto-downloads when done.",
    {
      prompt: z.string().min(1).describe("structured prompt, sections A/B/C/D, referencing 參考圖1/2/3 etc."),
      ref_image_0: z.string().describe("local path to first reference image (參考圖1)"),
      ref_image_1: z.string().optional().describe("local path to second reference image (參考圖2)"),
      ref_image_2: z.string().optional().describe("local path to third reference image (參考圖3)"),
      ref_image_3: z.string().optional().describe("local path to fourth reference image (參考圖4)"),
      ref_image_4: z.string().optional().describe("local path to fifth reference image (參考圖5)"),
      ref_image_5: z.string().optional().describe("local path to sixth reference image (參考圖6)"),
      ref_image_6: z.string().optional().describe("local path to seventh reference image (參考圖7)"),
      ref_image_7: z.string().optional().describe("local path to eighth reference image (參考圖8)"),
      ref_image_8: z.string().optional().describe("local path to ninth reference image (參考圖9)"),
      ref_video_0: z.string().optional().describe("local path to first reference video (mp4)"),
      ref_video_1: z.string().optional().describe("local path to second reference video (mp4)"),
      ref_video_2: z.string().optional().describe("local path to third reference video (mp4)"),
      ref_audio_0: z.string().optional().describe("local path to first reference audio"),
      ref_audio_1: z.string().optional().describe("local path to second reference audio"),
      ref_audio_2: z.string().optional().describe("local path to third reference audio"),
      seed: z.number().int().nonnegative().optional(),
      duration: z.number().min(1).max(60).default(5).optional(),
      width: z.number().int().min(64).max(4096).step(32).optional().describe("video width, default from workflow (352)"),
      height: z.number().int().min(64).max(4096).step(32).optional().describe("video height, default from workflow (608)"),
      out: z.string().optional().describe("output directory: subdirectory under output/ or an absolute path")
    },
    async (p) => {
      const images = [p.ref_image_0, p.ref_image_1, p.ref_image_2, p.ref_image_3, p.ref_image_4, p.ref_image_5, p.ref_image_6, p.ref_image_7, p.ref_image_8].filter(Boolean);
      const videos = [p.ref_video_0, p.ref_video_1, p.ref_video_2].filter(Boolean);
      const audios = [p.ref_audio_0, p.ref_audio_1, p.ref_audio_2].filter(Boolean);
      if (!images.length) throw new Error("gen_r2v_video requires at least one reference image (ref_image_0)");
      if (images.length > 9 || videos.length > 3 || audios.length > 3 || images.length + videos.length + audios.length > 12) {
        throw new Error(`too many reference files: ${images.length} images, ${videos.length} videos, ${audios.length} audios (max 9 images, 3 videos, 3 audios, 12 total)`);
      }
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const duration = p.duration ?? 5;
      const up = async (file) => {
        const name = basename(file);
        await uploadFile(name, readFileSync(file));
        return name;
      };
      const refImages = [];
      for (const f of images) refImages.push(await up(resolve(f)));
      const refVideos = [];
      for (const f of videos) refVideos.push(await up(resolve(f)));
      const refAudios = [];
      for (const f of audios) refAudios.push(await up(resolve(f)));
      const wf = buildR2vWorkflow({ prompt: p.prompt, seed, duration, refImages, refVideos, refAudios, width: p.width, height: p.height });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, {
        out: outArg(p.out), seed, prompt: p.prompt, duration, model: "minimax-h3-r2v", width: p.width, height: p.height,
        extra: [["ref_images", refImages.length], ["ref_videos", refVideos.length], ["ref_audios", refAudios.length]].map(([k, v]) => ({ key: k, value: v }))
      });
      return { content: [{ type: "text", text: JSON.stringify({
        status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed, duration,
        ref_images: refImages, ref_videos: refVideos, ref_audios: refAudios,
        width: p.width ?? null, height: p.height ?? null
      }, null, 2) }] };
    }
  );

  // ---------------- Query: queue ----------------
  server.tool(
    "query_comfy_queue",
    "Query the current ComfyUI queue status (running and pending jobs).",
    {},
    async () => {
      const q = await comfyGet("/queue");
      const fmt = (list) => (list || []).map(([n, id]) => ({ number: n, prompt_id: id }));
      return { content: [{ type: "text", text: JSON.stringify({ running: fmt(q.queue_running), pending: fmt(q.queue_pending) }, null, 2) }] };
    }
  );

  // ---------------- Query: job status ----------------
  server.tool(
    "query_comfy_result",
    "Check the status of a submitted generation job. Returns current state and file paths if completed.",
    {
      prompt_id: z.string().min(1).describe("The prompt_id returned by a generation tool")
    },
    async (p) => {
      const job = jobs.get(p.prompt_id);
      if (!job) {
        return { content: [{ type: "text", text: JSON.stringify({
          status: "unknown", prompt_id: p.prompt_id,
          message: "此 job 無背景記錄（可能 server 重啟過）"
        }, null, 2) }] };
      }
      return { content: [{ type: "text", text: JSON.stringify({
        status: job.status, prompt_id: p.prompt_id,
        files: job.files.length ? job.files : undefined,
        text: job.text,
        textFile: job.textFile,
        error: job.error
      }, null, 2) }] };
    }
  );

  // ---------------- Query: ComfyUI history ----------------
  server.tool(
    "query_history",
    "Query the ComfyUI execution history. Without prompt_id, lists the most recent finished jobs (with their output filenames). With prompt_id, returns that job's status and output file list.",
    {
      prompt_id: z.string().optional().describe("A prompt_id returned by a generation tool; omit to list recent history"),
      limit: z.number().int().min(1).max(500).optional().describe("max recent entries to list when prompt_id is omitted (default 40)")
    },
    async (p) => {
      if (p.prompt_id) {
        const h = await comfyGet(`/api/history/${p.prompt_id}`);
        const entry = h[p.prompt_id];
        if (!entry) {
          return { content: [{ type: "text", text: JSON.stringify({ prompt_id: p.prompt_id, status: "not_found", message: "prompt_id 不在 history 中（可能仍未完成、被清除或從未執行）" }, null, 2) }] };
        }
        return { content: [{ type: "text", text: JSON.stringify(summarizeHistoryEntry(p.prompt_id, entry), null, 2) }] };
      }
      const h = await comfyGet(`/api/history?max_items=${(p.limit ?? 40) + 1}`);
      const entries = Object.entries(h).slice(0, p.limit ?? 40)
        .map(([id, e]) => summarizeHistoryEntry(id, e));
      return { content: [{ type: "text", text: JSON.stringify({ count: entries.length, entries }, null, 2) }] };
    }
  );

  // ---------------- Download: recover outputs from history ----------------
  server.tool(
    "download_from_history",
    "Download finished output files for a prompt_id from the ComfyUI history into output/. Use this to recover jobs whose background auto-download was lost (timeout, server restart, or queue cancellation).",
    {
      prompt_id: z.string().min(1).describe("A finished prompt_id present in ComfyUI history"),
      out: z.string().optional().describe("output directory: subdirectory under output/ (default 'recovered') or an absolute path"),
      filename: z.string().optional().describe("only download outputs whose filename matches (basename, e.g. MiniMax_H3_00161_.mp4)")
    },
    async (p) => {
      const h = await comfyGet(`/api/history/${p.prompt_id}`);
      const entry = h[p.prompt_id];
      if (!entry) {
        return { content: [{ type: "text", text: JSON.stringify({ prompt_id: p.prompt_id, status: "not_found", message: "prompt_id 不在 history 中（無法下載）" }, null, 2) }] };
      }
      const items = Object.values(entry.outputs || {})
        .flatMap((no) => Object.values(no))
        .flatMap((v) => (Array.isArray(v) ? v : []))
        .filter((i) => i && i.filename && (!p.filename || i.filename === p.filename))
        .map((i) => ({ filename: i.filename, subfolder: i.subfolder || "", type: i.type || "output" }));
      if (!items.length) {
        return { content: [{ type: "text", text: JSON.stringify({ prompt_id: p.prompt_id, status: "no_outputs", message: "history 中此 job 沒有可下載的輸出檔" }, null, 2) }] };
      }
      const meta = extractMetaFromHistory(entry);
      const saved = [];
      for (const it of items) {
        const dest = await downloadAndSave(it.filename, it.subfolder, it.type, outArg(p.out), meta);
        saved.push(dest);
      }
      return { content: [{ type: "text", text: JSON.stringify({ prompt_id: p.prompt_id, status: "downloaded", files: saved }, null, 2) }] };
    }
  );

  // ---------------- Upscale: GAN video upscaler ----------------
  server.tool(
    "upscale_video",
    "GAN-upscale a local mp4 with the RealESRGAN x4 model through ComfyUI (LoadVideo -> GetVideoComponents -> ImageUpscaleWithModel -> CreateVideo -> SaveVideo). Uploads the video to ComfyUI input, submits the upscale workflow, and background-downloads the enlarged video.",
    {
      file: z.string().describe("local path to the mp4 video to upscale"),
      out: z.string().optional().describe("output directory: subdirectory under output/ (e.g. 'upscaled') or an absolute path"),
      model: z.string().optional().describe("UpscaleModelLoader model filename, default RealESRGAN_x4plus.safetensors")
    },
    async (p) => {
      const name = `mcp_${Date.now()}_${basename(p.file)}`;
      await uploadFile(name, readFileSync(resolve(p.file)));
      const wf = buildUpscaleWorkflow({ file: name, model: p.model });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed: null, prompt: p.file, model: "GAN-upscale-x4" });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, uploaded: name }, null, 2) }] };
    }
  );

  // ---------------- Merge: concatenate local videos ----------------
  server.tool(
    "merge_videos",
    "Concatenate multiple local mp4 videos into a single mp4 in the given order. All inputs are re-encoded to a uniform resolution (default 352x608, 2:3) so mixed sizes merge cleanly without black bars or stretching; audio tracks are mixed and re-encoded together.",
    {
      files: z.array(z.string()).min(2).describe("ordered absolute paths to the mp4 files to merge (first file plays first)"),
      out: z.string().describe("output directory: subdirectory under output/ (e.g. 'final', 'story1_ch1') or an absolute path"),
      resolution: z.string().optional().describe("target W:H, default '352:608' (use one fixed resolution across the whole project for clean assembly)")
    },
    async (p) => {
      const result = await mergeVideos({ files: p.files, out: outArg(p.out), resolution: p.resolution ?? "352:608" });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已合併完成", ...result }, null, 2) }] };
    }
  );

  // ---------------- FFmpeg: extract frames / last frame from video ----------------
  server.tool(
    "extract_frames",
    "Extract every frame of a local mp4 video into PNG images using ffmpeg-static. Output files are written as <video>_f0001.png ... into the given out subdirectory. Use extract_last_frame instead when you only need the final frame (much faster).",
    {
      file: z.string().min(1).describe("local path to the mp4 video to split"),
      out: z.string().optional().describe("output directory: subdirectory under output/ (default 'frames') or an absolute path"),
      name: z.string().optional().describe("output filename prefix, default = video filename without extension")
    },
    async (p) => {
      const videoPath = resolve(p.file);
      const prefix = p.name ?? parse(basename(videoPath)).name;
      const outDir = outArg(p.out ?? "frames");
      mkdirSync(outDir, { recursive: true });
      const pattern = join(outDir, `${prefix}_f%04d.png`);
      await execFileAsync(FFMPEG, ["-y", "-i", videoPath, pattern]);
      return { content: [{ type: "text", text: JSON.stringify({ status: `已拆幀完成`, out_dir: outDir, pattern: `${prefix}_f%04d.png` }, null, 2) }] };
    }
  );

  server.tool(
    "extract_last_frame",
    "Extract the TRUE final frame of a local mp4 video as a single PNG using ffmpeg. It decodes the last ~2 seconds of the clip and keeps the last decoded frame, which is frame-accurate and still far faster than decoding the whole movie. (Note: a plain '-sseof -1 -frames:v 1' trusts the container duration and returns the first frame one second before the end, i.e. ~24 frames early at 24fps.) Useful for grabbing the last frame of an i2v clip to reuse as the next block's first frame or a reference image.",
    {
      file: z.string().min(1).describe("local path to the mp4 video"),
      out: z.string().optional().describe("output directory: subdirectory under output/ (default 'frames') or an absolute path"),
      name: z.string().optional().describe("output file name without extension, default = video filename without extension + '_last'")
    },
    async (p) => {
      const videoPath = resolve(p.file);
      const name = p.name ?? `${parse(basename(videoPath)).name}_last`;
      const outDir = outArg(p.out ?? "frames");
      mkdirSync(outDir, { recursive: true });
      const tmpDir = join(outDir, `.lastframe_${Date.now()}`);
      mkdirSync(tmpDir, { recursive: true });
      try {
        const tailPattern = join(tmpDir, "tail_%04d.png");
        await execFileAsync(FFMPEG, ["-y", "-sseof", "-2", "-i", videoPath, tailPattern]);
        const { readdirSync, copyFileSync, rmSync } = await import("node:fs");
        const files = readdirSync(tmpDir).filter((f) => /^tail_\d{4}\.png$/.test(f)).sort();
        if (!files.length) throw new Error("no tail frames produced by ffmpeg");
        const lastTail = files[files.length - 1];
        const dest = join(outDir, `${name}.png`);
        copyFileSync(join(tmpDir, lastTail), dest);
        rmSync(tmpDir, { recursive: true, force: true });
        return { content: [{ type: "text", text: JSON.stringify({ status: "已提取尾幀完成", file: dest, tail_frames: files.length, used: lastTail }, null, 2) }] };
      } catch (e) {
        const { rmSync } = await import("node:fs");
        try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
        throw e;
      }
    }
  );

  return server;
}