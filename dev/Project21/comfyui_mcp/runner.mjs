/**
 * Glue between a tool call and the ComfyUI box: resolve settings, build the graph, submit it,
 * optionally block, then mirror the outputs into the local download root.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { ComfyClient, ComfyError, jobOutcome } from "./comfy.mjs";
import { comfyuiSettings, readMetadata } from "./metadata.mjs";
import { TOOL_MAP } from "./workflows.mjs";

/** Metadata -> client + where downloads land. */
export function runtime() {
  const { file, exists, data } = readMetadata();
  const settings = comfyuiSettings(data);
  if (!settings.url) {
    throw new ComfyError("ComfyUI url is not configured; call comfy_metadata_set with comfyui_url first", {
      metadata_file: file,
      metadata_exists: exists
    });
  }
  const client = new ComfyClient({ url: settings.url, clientId: settings.clientId });
  const outputDir = settings.outputDir ?? resolve(process.cwd(), "output");
  return { client, settings, outputDir, metadataFile: file, metadata: data };
}

/**
 * Tool argument -> LoadImage/LoadVideo value.
 *
 * A local file is copied to ComfyUI's input folder (namespaced `mcp_<ts>_`), anything else is
 * assumed to already live there — that covers both `/path/on/this/machine.png` and
 * `refs/char_judge_xu/plate_00001_.png` on the ComfyUI box.
 */
export function uploader(client) {
  return async (value) => {
    if (typeof value !== "string" || value.trim() === "") {
      throw new ComfyError("image/video input must be a non-empty path or ComfyUI input name", { got: value });
    }
    const candidate = value.trim();
    if (!existsSync(candidate)) return candidate;
    const { name } = await client.uploadFile(candidate);
    return name;
  };
}

/**
 * Run one manifest tool.
 *
 * `wait: false` returns right after /prompt accepted the job; `comfy_job` polls it later.
 * A timeout is NOT an error — the job keeps running on the box, so the prompt_id is returned.
 */
export async function runTool(toolName, args = {}, options = {}) {
  const entry = TOOL_MAP[toolName];
  if (!entry) throw new ComfyError(`unknown tool: ${toolName}`);

  const { client, settings, outputDir } = runtime();
  const started = Date.now();
  const { workflow, summary } = await entry.build(args, { upload: uploader(client) });

  const submitted = await client.submit(workflow);
  const destRoot = options.output_dir ? resolve(options.output_dir) : outputDir;

  const base = {
    tool: toolName,
    workflow: entry.workflow,
    prompt_id: submitted.prompt_id,
    queue_number: submitted.number,
    summary,
    output_dir: destRoot
  };

  if (options.wait === false) {
    const q = await client.queue().catch(() => null);
    const pending = q?.pending.find((p) => p.prompt_id === submitted.prompt_id) ?? null;
    const running = q?.running.find((p) => p.prompt_id === submitted.prompt_id) ?? null;
    return {
      ...base,
      status: running ? "running" : "queued",
      queue_position: pending ? q.pending.indexOf(pending) + 1 : null,
      hint: "poll with comfy_job"
    };
  }

  const timeoutSec = options.timeout_sec ?? settings.timeoutSec;
  let history;
  try {
    history = await client.waitFor(submitted.prompt_id, { timeoutSec });
  } catch (e) {
    if (e instanceof ComfyError && /timed out/.test(e.message)) {
      return {
        ...base,
        status: "timeout",
        timed_out: true,
        timeout_sec: timeoutSec,
        elapsed_sec: Number(((Date.now() - started) / 1000).toFixed(1)),
        hint: "the job is still on the box; poll it with comfy_job (no need to resubmit)"
      };
    }
    throw e;
  }

  const outcome = jobOutcome(history);
  if (outcome.status !== "success") {
    throw new ComfyError(`ComfyUI job ${outcome.status}`, {
      prompt_id: submitted.prompt_id,
      node_errors: outcome.errors
    });
  }

  const files = options.download === false ? [] : await client.downloadOutputs(history, { destRoot });
  const texts = ComfyClient.extractTexts(history);

  return {
    ...base,
    status: "success",
    elapsed_sec: Number(((Date.now() - started) / 1000).toFixed(1)),
    files,
    ...(texts.length ? { texts } : {})
  };
}

/** Inspect (and optionally finish) a job that was submitted with `wait: false`. */
export async function inspectJob(promptId, options = {}) {
  const { client, settings, outputDir } = runtime();
  const queue = await client.queue();
  const history = promptId ? await client.history(promptId) : null;
  const destRoot = options.output_dir ? resolve(options.output_dir) : outputDir;

  if (!promptId) {
    const recent = (await client.historyIds(5)) ?? [];
    return {
      queue,
      recent_prompt_ids: recent,
      hint: "pass prompt_id to inspect one job"
    };
  }

  if (!history) {
    const running = queue.running.find((p) => p.prompt_id === promptId);
    const pending = queue.pending.find((p) => p.prompt_id === promptId);
    if (!running && !pending) {
      return { prompt_id: promptId, status: "unknown", queue, hint: "not queued and no history yet" };
    }

    if (options.wait !== false) {
      const timeoutSec = options.timeout_sec ?? settings.timeoutSec;
      try {
        const entry = await client.waitFor(promptId, { timeoutSec });
        return finishJob(client, entry, { promptId, destRoot, options });
      } catch (e) {
        if (e instanceof ComfyError && /timed out/.test(e.message)) {
          return { prompt_id: promptId, status: "timeout", timeout_sec: timeoutSec, hint: "still running; poll again" };
        }
        throw e;
      }
    }
    return {
      prompt_id: promptId,
      status: running ? "running" : "queued",
      queue_position: pending ? queue.pending.indexOf(pending) + 1 : null
    };
  }

  return finishJob(client, history, { promptId, destRoot, options });
}

async function finishJob(client, history, { promptId, destRoot, options }) {
  const outcome = jobOutcome(history);
  const files = options.download === false ? [] : await client.downloadOutputs(history, { destRoot });
  const texts = ComfyClient.extractTexts(history);
  return {
    prompt_id: promptId,
    status: outcome.status,
    completed: outcome.completed,
    ...(outcome.errors.length ? { errors: outcome.errors } : {}),
    output_dir: destRoot,
    files,
    ...(texts.length ? { texts } : {})
  };
}
