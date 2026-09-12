import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { z } from "zod";
import { dirname, resolve, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeVideos } from "./merge_service.mjs";

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
  return subdir ? resolve(HERE, "output", subdir) : resolve(HERE, "output");
}

function buildImageWorkflow(wfFile, { prompt, seed, width, height }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, wfFile), "utf-8"));
  const nodes = Object.entries(wf);
  const posNode = nodes.find(([, n]) => n.class_type === "CLIPTextEncode")?.[1];
  const sampler = nodes.find(([, n]) => n.class_type === "KSampler")?.[1];
  const latent = nodes.find(([, n]) => ["EmptySD3LatentImage", "EmptyLatentImage"].includes(n.class_type))?.[1];
  if (posNode && prompt) posNode.inputs.text = prompt;
  if (sampler) sampler.inputs.seed = seed;
  if (latent) {
    if (width) latent.inputs.width = width;
    if (height) latent.inputs.height = height;
  }
  return wf;
}

function buildVideoWorkflow({ prompt, seed, duration, firstFile, lastFile }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, "video_minimax_h3_t2v.json"), "utf-8"));
  wf["140:133"].inputs.value = duration;
  if (seed !== undefined) wf["140:129"].inputs.noise_seed = seed;
  if (prompt) wf["140:131"].inputs.prompt = prompt;
  if (firstFile) wf.load_first.inputs.image = firstFile;
  if (lastFile) wf.load_last.inputs.image = lastFile;
  if (!firstFile && !lastFile) {
    delete wf.load_first;
    delete wf.load_last;
    delete wf.scale_first;
    delete wf.scale_last;
    delete wf["140:131"].inputs.first_frame;
    delete wf["140:131"].inputs.last_frame;
  }
  return wf;
}

function buildR2vWorkflow({ prompt, seed, duration, ref0, ref1, ref2 }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, "video_minimax_h3_r2v.json"), "utf-8"));
  if (prompt) wf["138"].inputs.value = prompt;
  if (seed !== undefined) wf["129"].inputs.noise_seed = seed;
  if (duration !== undefined) wf["132"].inputs.value = duration;
  if (ref0) wf["137"].inputs.image = ref0;
  if (ref1) wf["139"].inputs.image = ref1;
  if (ref2) wf["147"].inputs.image = ref2;
  return wf;
}

function buildUpscaleWorkflow({ file, model }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, "utility-gan_upscaler.json"), "utf-8"));
  wf["9"].inputs.file = file;
  if (model) wf["1"].inputs.model_name = model;
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
      `model: ${meta.model}`,
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
    try {
      while (Date.now() < deadline) {
        const history = await comfyGet(`/api/history/${promptId}`);
        if (!history[promptId]) { await sleep(POLL_INTERVAL); continue; }
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
                const txtMeta = { prompt: meta.prompt, seed: meta.seed, duration: meta.duration, model: meta.model };
                job.files.push(await downloadAndSave(item.filename, item.subfolder, item.type, meta.out, txtMeta));
              }
            }
          }
        }
        job.status = "completed";
        process.stderr.write(`[mcp] job ${promptId} completed: ${job.files.length} file(s)\n`);
        return;
      }
      job.status = "timeout";
      process.stderr.write(`[mcp] job ${promptId} timed out\n`);
    } catch (e) {
      job.status = "error";
      job.error = e.message;
      process.stderr.write(`[mcp] job ${promptId} error: ${e.message}\n`);
    }
  })();

  return job;
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
      out: z.string().optional().describe("subdirectory under output/, e.g. 'car'")
    },
    async (p) => {
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const wf = buildImageWorkflow("workflow_sdxl_t2i.json", { prompt: p.prompt, seed, width: p.width, height: p.height });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, model: "sdxl" });
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
      out: z.string().optional().describe("subdirectory under output/, e.g. 'car'")
    },
    async (p) => {
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const wf = buildImageWorkflow("workflow_z_image_turbo.json", { prompt: p.prompt, seed, width: p.width, height: p.height });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, model: "z-image-turbo" });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed }, null, 2) }] };
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
      out: z.string().optional().describe("subdirectory under output/, e.g. 'fight'")
    },
    async (p) => {
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const duration = p.duration ?? 5;
      const wf = buildVideoWorkflow({ prompt: p.prompt, seed, duration });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, duration, model: "minimax-h3" });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed, duration }, null, 2) }] };
    }
  );

  // ---------------- Video: Image-to-Video (MiniMax H3) ----------------
  server.tool(
    "gen_i2v_video",
    "Submit an image-to-video job (MiniMax H3). first_frame/last_frame are local image paths (auto-uploaded). Returns prompt_id immediately; background auto-downloads when done.",
    {
      prompt: z.string().min(1),
      first_frame: z.string().describe("local path to first frame image"),
      last_frame: z.string().describe("local path to last frame image"),
      seed: z.number().int().nonnegative().optional(),
      duration: z.number().min(1).max(60).default(5).optional(),
      out: z.string().optional().describe("subdirectory under output/")
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
      const lastFile = await up(resolve(p.last_frame));
      const wf = buildVideoWorkflow({ prompt: p.prompt, seed, duration, firstFile, lastFile });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, duration, model: "minimax-h3-i2v" });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed, duration, first_frame: firstFile, last_frame: lastFile }, null, 2) }] };
    }
  );

  // ---------------- Video: Reference-to-Video (MiniMax H3 r2v) ----------------
  server.tool(
    "gen_r2v_video",
    "Submit a reference-to-video job (MiniMax H3 ref2va). Up to 3 reference images establish characters/scene consistency. Prompt uses the structured A/B/C/D format. Returns prompt_id immediately; background auto-downloads when done.",
    {
      prompt: z.string().min(1).describe("structured prompt, sections A/B/C/D, referencing 參考圖1/2/3"),
      ref_image_0: z.string().describe("local path to first reference image (參考圖1)"),
      ref_image_1: z.string().optional().describe("local path to second reference image (參考圖2)"),
      ref_image_2: z.string().optional().describe("local path to third reference image (參考圖3)"),
      seed: z.number().int().nonnegative().optional(),
      duration: z.number().min(1).max(60).default(5).optional(),
      out: z.string().optional().describe("subdirectory under output/")
    },
    async (p) => {
      const seed = p.seed ?? Math.floor(Math.random() * 2 ** 32);
      const duration = p.duration ?? 5;
      const up = async (file) => {
        const name = basename(file);
        await uploadFile(name, readFileSync(file));
        return name;
      };
      const ref0 = await up(resolve(p.ref_image_0));
      const ref1 = p.ref_image_1 ? await up(resolve(p.ref_image_1)) : undefined;
      const ref2 = p.ref_image_2 ? await up(resolve(p.ref_image_2)) : undefined;
      const wf = buildR2vWorkflow({ prompt: p.prompt, seed, duration, ref0, ref1, ref2 });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, duration, model: "minimax-h3-r2v" });
      return { content: [{ type: "text", text: JSON.stringify({
        status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed, duration,
        ref_images: [ref0, ref1, ref2].filter(Boolean)
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
        error: job.error
      }, null, 2) }] };
    }
  );

  // ---------------- Upscale: GAN video upscaler ----------------
  server.tool(
    "upscale_video",
    "GAN-upscale a local mp4 with the RealESRGAN x4 model through ComfyUI (LoadVideo -> GetVideoComponents -> ImageUpscaleWithModel -> CreateVideo -> SaveVideo). Uploads the video to ComfyUI input, submits the upscale workflow, and background-downloads the enlarged video.",
    {
      file: z.string().describe("local path to the mp4 video to upscale"),
      out: z.string().optional().describe("subdirectory under output/, e.g. 'upscaled'"),
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
      out: z.string().describe("subdirectory under output/, e.g. 'final', 'story1_ch1'"),
      resolution: z.string().optional().describe("target W:H, default '352:608' (use one fixed resolution across the whole project for clean assembly)")
    },
    async (p) => {
      const result = await mergeVideos({ files: p.files, out: outArg(p.out), resolution: p.resolution ?? "352:608" });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已合併完成", ...result }, null, 2) }] };
    }
  );

  return server;
}