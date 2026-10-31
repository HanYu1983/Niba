/**
 * Thin ComfyUI HTTP client.
 *
 * The box lives on another machine (Tailscale), so nothing is shared through the filesystem:
 * inputs are POSTed to /upload/image, results are pulled back with GET /view and mirrored into
 * the local download root.
 *
 * Endpoints used:
 *   GET  /system_stats        version, devices, vram
 *   GET  /queue               running / pending prompts
 *   POST /prompt              submit an API-format workflow
 *   GET  /history/<id>        finished job (outputs + status)
 *   GET  /view                download one output
 *   POST /upload/image        put a local file into ComfyUI's input folder
 *   POST /interrupt           stop the running job
 *   POST /queue {delete:[id]} drop a pending job
 */

import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, dirname, resolve, sep } from "node:path";

export const DEFAULT_TIMEOUT_MS = 30_000;

export class ComfyError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ComfyError";
    this.details = details;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIDEO_EXT = /\.(mp4|webm|mov|mkv|avi)$/i;

function kindOf(item) {
  const meta = item?.metadata ?? {};
  if (typeof meta.kind === "string") return meta.kind;
  return VIDEO_EXT.test(item?.filename ?? "") ? "video" : "image";
}

/** Reject anything that could climb out of the download root. */
function safeRelative(p) {
  const clean = String(p ?? "").replace(/\\/g, "/").replace(/^\/+/, "");
  if (clean === "") return "";
  const parts = clean.split("/").filter(Boolean);
  if (parts.some((part) => part === ".." || part === ".")) {
    throw new ComfyError("unsafe path in ComfyUI output", { path: p });
  }
  return parts.join(sep);
}

/** Local-side filename: ComfyUI never emits separators, so refuse them instead of guessing. */
function safeName(name) {
  const raw = String(name ?? "");
  if (raw === "" || raw === "." || raw === ".." || /[\\/]/.test(raw)) {
    throw new ComfyError("unsafe filename in ComfyUI output", { filename: name });
  }
  return raw;
}

export class ComfyClient {
  constructor({ url, clientId = "comfyui-mcp", timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    if (typeof url !== "string" || url.trim() === "") {
      throw new ComfyError("ComfyUI url is not configured; set it with comfy_metadata_set", {});
    }
    this.baseUrl = url.trim().replace(/\/+$/, "");
    this.clientId = clientId;
    this.timeoutMs = timeoutMs;
    this._modelCache = null;
  }

  url(pathname, query) {
    const u = new URL(this.baseUrl + pathname);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, String(v));
    }
    return u.toString();
  }

  async #json(pathname, { method = "GET", body, timeoutMs = this.timeoutMs, query } = {}) {
    const target = this.url(pathname, query);
    let res;
    try {
      res = await fetch(target, {
        method,
        headers: body === undefined ? undefined : { "content-type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (e) {
      const reason = e?.name === "TimeoutError" ? `timed out after ${timeoutMs}ms` : (e?.cause?.code ?? e?.message);
      throw new ComfyError(`cannot reach ComfyUI at ${target}: ${reason}`, { url: target });
    }

    const text = await res.text();
    let parsed = null;
    if (text !== "") {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }
    if (!res.ok) {
      throw new ComfyError(`ComfyUI returned ${res.status} for ${pathname}`, { status: res.status, body: parsed });
    }
    return parsed;
  }

  /** Reachable? version, device, free vram. */
  async systemStats() {
    const stats = await this.#json("/system_stats");
    return {
      comfyui_version: stats?.system?.comfyui_version ?? null,
      python_version: stats?.system?.python_version ?? null,
      os: stats?.system?.os ?? null,
      ram_free_bytes: stats?.system?.ram_free ?? null,
      devices: (stats?.devices ?? []).map((d) => ({
        name: d.name,
        vram_total_bytes: d.vram_total,
        vram_free_bytes: d.vram_free
      }))
    };
  }

  async queue() {
    const q = await this.#json("/queue");
    const map = (items) =>
      (items ?? []).map((entry) => ({
        number: entry[0] ?? null,
        prompt_id: entry[1] ?? null,
        node_count: entry[2] ? Object.keys(entry[2]).length : null
      }));
    return { running: map(q?.queue_running), pending: map(q?.queue_pending) };
  }

  /** Submit an API-format workflow; returns the prompt id. */
  async submit(workflow) {
    let res;
    try {
      res = await this.#json("/prompt", {
        method: "POST",
        body: { prompt: workflow, client_id: this.clientId },
        timeoutMs: Math.max(this.timeoutMs, 60_000)
      });
    } catch (e) {
      if (e instanceof ComfyError && e.details?.body?.node_errors) {
        const reason = e.details.body?.error?.message ?? "validation failed";
        throw new ComfyError(`ComfyUI rejected the workflow: ${reason}`, {
          ...e.details,
          node_errors: summarizeNodeErrors(e.details.body.node_errors)
        });
      }
      throw e;
    }
    const promptId = res?.prompt_id;
    if (!promptId) {
      throw new ComfyError("ComfyUI accepted the request but returned no prompt_id", { body: res });
    }
    return { prompt_id: promptId, number: res.number ?? null, node_errors: res.node_errors ?? {} };
  }

  /** One history entry, or null while the job is still running. */
  async history(promptId) {
    const h = await this.#json(`/history/${encodeURIComponent(promptId)}`);
    return h?.[promptId] ?? null;
  }

  /** Most recent finished prompt ids, newest first. */
  async historyIds(limit = 5) {
    const h = await this.#json("/history", { query: { max_items: limit } });
    return Object.keys(h ?? {}).sort((a, b) => {
      const at = h[a]?.status?.messages?.[0]?.[1]?.timestamp ?? 0;
      const bt = h[b]?.status?.messages?.[0]?.[1]?.timestamp ?? 0;
      return bt - at;
    });
  }

  /**
   * Block until the job leaves the queue. Returns the history entry, or throws on timeout.
   * A job that finished with an error also has a history entry — the caller inspects status.
   */
  async waitFor(promptId, { timeoutSec = 900, pollMs = 1000, onProgress } = {}) {
    const deadline = Date.now() + timeoutSec * 1000;
    let missing = 0;
    for (;;) {
      const entry = await this.history(promptId);
      if (entry) return entry;

      const q = await this.queue().catch(() => null);
      if (q) {
        const running = q.running.find((r) => r.prompt_id === promptId);
        const pending = q.pending.find((r) => r.prompt_id === promptId);
        if (running || pending) {
          missing = 0;
          onProgress?.({ state: running ? "running" : "queued", queue_position: running ? 0 : pending ? 1 : null });
        } else {
          // Not queued and no history: either it just finished, or it vanished.
          missing += 1;
          if (missing > 5) {
            throw new ComfyError("job disappeared from the queue without a history entry", { prompt_id: promptId });
          }
        }
      }

      if (Date.now() > deadline) {
        throw new ComfyError(`timed out after ${timeoutSec}s waiting for ${promptId}`, {
          prompt_id: promptId,
          hint: "the job may still finish; poll it with comfy_job"
        });
      }
      await sleep(pollMs);
    }
  }

  /** Download every file a history entry produced. Returns local paths (+ metadata). */
  async downloadOutputs(entry, { destRoot, types = ["output"] } = {}) {
    const files = [];
    for (const [nodeId, outputs] of Object.entries(entry?.outputs ?? {})) {
      for (const [slot, value] of Object.entries(outputs ?? {})) {
        if (!Array.isArray(value)) continue;
        for (const item of value) {
          if (!item || typeof item !== "object" || typeof item.filename !== "string") continue;
          const type = item.type ?? "output";
          if (!types.includes(type)) continue;

          const remote = {
            node: nodeId,
            slot,
            filename: item.filename,
            subfolder: item.subfolder ?? "",
            type
          };
          const target = resolve(destRoot, safeRelative(remote.subfolder), safeName(remote.filename));
          const bytes = await this.saveView(item, target);
          const meta = item.metadata ?? {};
          files.push({
            ...remote,
            kind: kindOf(item),
            path: target,
            bytes,
            ...(meta.width ? { width: meta.width } : {}),
            ...(meta.height ? { height: meta.height } : {}),
            ...(meta.fps ? { fps: meta.fps } : {}),
            ...(meta.duration ? { duration_sec: Number(meta.duration.toFixed(2)) } : {}),
            ...(meta.frame_count ? { frame_count: meta.frame_count } : {})
          });
        }
      }
    }
    return files;
  }

  async saveView(item, target) {
    const query = new URLSearchParams({
      filename: item.filename,
      subfolder: item.subfolder ?? "",
      type: item.type ?? "output"
    });
    const targetUrl = `${this.baseUrl}/view?${query}`;
    let res;
    try {
      res = await fetch(targetUrl, { signal: AbortSignal.timeout(Math.max(this.timeoutMs, 120_000)) });
    } catch (e) {
      throw new ComfyError(`download failed: ${e?.cause?.code ?? e?.message}`, { url: targetUrl });
    }
    if (!res.ok) {
      throw new ComfyError(`download failed with HTTP ${res.status}`, { url: targetUrl });
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
    return bytes.length;
  }

  /**
   * Copy one local file into ComfyUI's input folder and return the name LoadImage wants.
   * Already-remote names pass through untouched, so callers can mix both.
   */
  async uploadFile(localPath, { name } = {}) {
    const abs = resolve(localPath);
    let stat;
    try {
      stat = statSync(abs);
    } catch {
      throw new ComfyError(`input file not found: ${abs}`, { path: abs });
    }
    if (!stat.isFile()) throw new ComfyError(`input path is not a file: ${abs}`, { path: abs });

    const filename = name ?? `mcp_${Date.now()}_${basename(abs).replace(/[^\w.\-]+/g, "_")}`;
    const form = new FormData();
    form.append("image", new Blob([await readFile(abs)]), filename);
    form.append("type", "input");
    form.append("overwrite", "true");

    let res;
    try {
      res = await fetch(`${this.baseUrl}/upload/image`, {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(Math.max(this.timeoutMs, 120_000))
      });
    } catch (e) {
      throw new ComfyError(`upload failed: ${e?.cause?.code ?? e?.message}`, { path: abs });
    }
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    if (!res.ok || !json?.name) {
      throw new ComfyError(`upload rejected with HTTP ${res.status}`, { path: abs, body: json ?? text.slice(0, 400) });
    }
    const remote = json.subfolder ? `${json.subfolder}/${json.name}` : json.name;
    return { name: remote, bytes: stat.size, source: abs };
  }

  /** Text nodes (PreviewAny / ShowText) come back as arrays of strings. */
  static extractTexts(entry) {
    const texts = [];
    for (const [nodeId, outputs] of Object.entries(entry?.outputs ?? {})) {
      for (const [slot, value] of Object.entries(outputs ?? {})) {
        if (!Array.isArray(value)) continue;
        for (const item of value) {
          if (typeof item === "string") texts.push({ node: nodeId, slot, text: item });
        }
      }
    }
    return texts;
  }

  /** Checkpoints / unets / clips / vaes / loras / upscalers the box actually has. */
  async models() {
    const now = Date.now();
    if (this._modelCache && now - this._modelCache.at < 60_000) return this._modelCache.data;

    const combo = async (node, field) => {
      const info = await this.#json(`/object_info/${node}`);
      const def = info?.[node]?.input;
      const spec = def?.required?.[field] ?? def?.optional?.[field];
      if (!Array.isArray(spec)) return [];
      const [first, opts] = spec;
      // Legacy form: [["a.safetensors","b.safetensors"], {...}]
      if (Array.isArray(first)) return first;
      // COMBO form: ["COMBO", { options: [...] }]
      if (Array.isArray(opts?.options)) return opts.options;
      if (Array.isArray(first?.options)) return first.options;
      return [];
    };

    const [checkpoints, unets, clips, vaes, loras, upscalers] = await Promise.all([
      combo("CheckpointLoaderSimple", "ckpt_name").catch(() => []),
      combo("UNETLoader", "unet_name").catch(() => []),
      combo("CLIPLoader", "clip_name").catch(() => []),
      combo("VAELoader", "vae_name").catch(() => []),
      combo("LoraLoaderModelOnly", "lora_name").catch(() => []),
      combo("UpscaleModelLoader", "model_name").catch(() => [])
    ]);

    const data = { checkpoints, unets, clips, vaes, loras, upscalers };
    this._modelCache = { at: now, data };
    return data;
  }

  /** Drop a pending job or interrupt the running one. */
  async cancel(promptId) {
    const q = await this.queue();
    if (q.pending.some((p) => p.prompt_id === promptId)) {
      await this.#json("/queue", { method: "POST", body: { delete: [promptId] } });
      return { prompt_id: promptId, cancelled: "pending" };
    }
    if (q.running.some((p) => p.prompt_id === promptId)) {
      await this.#json("/interrupt", { method: "POST", body: { prompt_id: promptId } });
      return { prompt_id: promptId, cancelled: "running" };
    }
    return { prompt_id: promptId, cancelled: null, note: "not in the queue" };
  }
}

/** ComfyUI's node_errors -> a short readable list. */
export function summarizeNodeErrors(nodeErrors) {
  const out = [];
  for (const [nodeId, info] of Object.entries(nodeErrors ?? {})) {
    const errors = (info?.errors ?? []).map((e) => ({
      message: e.message ?? null,
      details: e.details ?? null,
      type: e.type ?? null
    }));
    out.push({ node: nodeId, class_type: info?.class_type ?? null, errors });
  }
  return out;
}

/** A finished job's status as something worth printing. */
export function jobOutcome(entry) {
  const status = entry?.status ?? {};
  const messages = status.messages ?? [];
  const errors = messages
    .filter((m) => m[0] === "execution_error")
    .map((m) => ({ node: m[1]?.node_id ?? null, type: m[1]?.node_type ?? null, message: m[1]?.exception_message ?? null }));
  return {
    status: status.status_str ?? "unknown",
    completed: Boolean(status.completed),
    errors
  };
}
