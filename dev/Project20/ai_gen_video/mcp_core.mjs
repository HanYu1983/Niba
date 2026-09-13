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

function buildR2vWorkflow({ prompt, seed, duration, ref0, ref1, ref2, width, height }) {
  const wf = JSON.parse(readFileSync(resolve(HERE, "video_minimax_h3_r2v.json"), "utf-8"));
  if (prompt) wf["138"].inputs.value = prompt;
  if (seed !== undefined) wf["129"].inputs.noise_seed = seed;
  if (duration !== undefined) wf["132"].inputs.value = duration;
  if (ref0) wf["137"].inputs.image = ref0;
  const optionalRef = (nodeId, refFile, inputKey) => {
    if (refFile) {
      wf[nodeId].inputs.image = refFile;
      return;
    }
    delete wf[nodeId];
    delete wf["136"].inputs[inputKey];
  };
  optionalRef("139", ref1, "ref_images.ref_image_1");
  optionalRef("147", ref2, "ref_images.ref_image_2");
  if (width !== undefined) wf["136"].inputs.width = width;
  if (height !== undefined) wf["136"].inputs.height = height;
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
      meta.width !== undefined ? `width: ${meta.width}` : null,
      meta.height !== undefined ? `height: ${meta.height}` : null,
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
                const txtMeta = { prompt: meta.prompt, seed: meta.seed, duration: meta.duration, model: meta.model, width: meta.width, height: meta.height };
                job.files.push(await downloadAndSave(item.filename, item.subfolder, item.type, meta.out, txtMeta));
              } catch (e) {
                process.stderr.write(`[mcp] job ${promptId} download ${item.filename} error: ${e.message}\n`);
              }
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
  })().catch((e) => {
    job.status = "error";
    job.error = e.message;
    process.stderr.write(`[mcp] job ${promptId} fatal error: ${e.message}\n`);
  });

  return job;
}

// ---- History helpers ----

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
      width: z.number().int().min(64).max(4096).step(32).optional().describe("video width, default from workflow (e.g. 512)"),
      height: z.number().int().min(64).max(4096).step(32).optional().describe("video height, default from workflow"),
      out: z.string().optional().describe("subdirectory under output/, e.g. 'fight'")
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
    "Submit an image-to-video job (MiniMax H3). first_frame/last_frame are local image paths (auto-uploaded). Returns prompt_id immediately; background auto-downloads when done.",
    {
      prompt: z.string().min(1),
      first_frame: z.string().describe("local path to first frame image"),
      last_frame: z.string().describe("local path to last frame image"),
      seed: z.number().int().nonnegative().optional(),
      duration: z.number().min(1).max(60).default(5).optional(),
      width: z.number().int().min(64).max(4096).step(32).optional().describe("video width, default from workflow (e.g. 512)"),
      height: z.number().int().min(64).max(4096).step(32).optional().describe("video height, default from workflow"),
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
      const wf = buildVideoWorkflow({ prompt: p.prompt, seed, duration, firstFile, lastFile, width: p.width, height: p.height });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, duration, model: "minimax-h3-i2v", width: p.width, height: p.height });
      return { content: [{ type: "text", text: JSON.stringify({ status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed, duration, first_frame: firstFile, last_frame: lastFile, width: p.width ?? null, height: p.height ?? null }, null, 2) }] };
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
      width: z.number().int().min(64).max(4096).step(32).optional().describe("video width, default from workflow (352)"),
      height: z.number().int().min(64).max(4096).step(32).optional().describe("video height, default from workflow (608)"),
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
      const wf = buildR2vWorkflow({ prompt: p.prompt, seed, duration, ref0, ref1, ref2, width: p.width, height: p.height });
      const res = await comfyPost("/prompt", { prompt: wf, client_id: `mcp-${Date.now()}` });
      startBackgroundJob(res.prompt_id, { out: outArg(p.out), seed, prompt: p.prompt, duration, model: "minimax-h3-r2v", width: p.width, height: p.height });
      return { content: [{ type: "text", text: JSON.stringify({
        status: "已提交，背景自動下載中", prompt_id: res.prompt_id, seed, duration,
        ref_images: [ref0, ref1, ref2].filter(Boolean),
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
      out: z.string().optional().describe("subdirectory under output/ (default 'recovered')"),
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