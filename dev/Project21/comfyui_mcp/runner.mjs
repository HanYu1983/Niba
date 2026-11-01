/**
 * Glue between a tool call and the ComfyUI box: resolve settings, build the graph, submit it,
 * optionally block, then mirror the outputs into the local download root.
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { ComfyClient, ComfyError, jobOutcome } from "./comfy.mjs";
import { jobsDir, listJobs, readJob, recordSubmission, unfinishedJobs, updateJob } from "./jobs.mjs";
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
  const destRoot = options.output_dir ? resolve(options.output_dir) : outputDir;
  const { workflow, summary } = await entry.build(args, { upload: uploader(client) });

  const submitted = await client.submit(workflow);

  // Record before waiting: the job is already on the box, so the prompt_id must survive a
  // timeout, a crashed poll, or this process being killed.
  let ledger;
  try {
    ledger = recordSubmission({
      prompt_id: submitted.prompt_id,
      comfyui_url: settings.url,
      client_id: settings.clientId,
      tool: toolName,
      workflow: entry.workflow,
      output_dir: destRoot,
      label: options.label ?? null,
      queue_number: submitted.number,
      summary
    });
  } catch (e) {
    ledger = { error: e.message };
  }

  const base = {
    tool: toolName,
    workflow: entry.workflow,
    prompt_id: submitted.prompt_id,
    queue_number: submitted.number,
    summary,
    output_dir: destRoot,
    ...(ledger.file ? { job_file: ledger.file } : { job_ledger_error: ledger.error })
  };

  if (options.wait === false) {
    const q = await client.queue().catch(() => null);
    const pending = q?.pending.find((p) => p.prompt_id === submitted.prompt_id) ?? null;
    const running = q?.running.find((p) => p.prompt_id === submitted.prompt_id) ?? null;
    const status = running ? "running" : "queued";
    safeUpdate(submitted.prompt_id, { status });
    return {
      ...base,
      status,
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
      safeUpdate(submitted.prompt_id, { status: "timeout", timeout_sec: timeoutSec });
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
    safeUpdate(submitted.prompt_id, { status: outcome.status, errors: outcome.errors });
    throw new ComfyError(`ComfyUI job ${outcome.status}`, {
      prompt_id: submitted.prompt_id,
      node_errors: outcome.errors
    });
  }

  const files = options.download === false ? [] : await client.downloadOutputs(history, { destRoot });
  const texts = ComfyClient.extractTexts(history);
  safeUpdate(submitted.prompt_id, {
    status: "success",
    completed: outcome.completed,
    elapsed_sec: Number(((Date.now() - started) / 1000).toFixed(1)),
    files,
    ...(texts.length ? { texts } : {})
  });

  return {
    ...base,
    status: "success",
    elapsed_sec: Number(((Date.now() - started) / 1000).toFixed(1)),
    files,
    ...(texts.length ? { texts } : {})
  };
}

/** The ledger is a convenience: never let a disk problem break a job that already ran. */
function safeUpdate(promptId, patch) {
  try {
    updateJob(promptId, patch);
  } catch {
    // ignore
  }
}

/** Ledger lookup that tolerates an unusable prompt_id. */
function safeRead(promptId) {
  try {
    return readJob(promptId);
  } catch {
    return null;
  }
}

/**
 * Inspect (and optionally finish) a submitted job.
 *
 * No prompt_id -> queue + the ledger (what this server has submitted, newest first).
 * With prompt_id -> live state from ComfyUI, falling back to the ledger when /history no longer
 * has it (ComfyUI trims history and loses it on restart, but the prompt_id and its files are
 * still worth reporting).
 */
export async function inspectJob(promptId, options = {}) {
  const { client, settings, outputDir } = runtime();
  // A job remembers where its files were headed; reuse that unless the caller overrides it.
  const record = promptId ? safeRead(promptId) : null;
  const destRoot = options.output_dir
    ? resolve(options.output_dir)
    : record?.output_dir
      ? resolve(record.output_dir)
      : outputDir;

  if (!promptId) {
    const queue = await client.queue().catch((e) => ({ error: e.message }));
    const jobs = listJobs({
      limit: options.limit ?? 20,
      label: options.label,
      status: options.status,
      tool: options.tool
    });
    const open = unfinishedJobs().map((j) => ({ prompt_id: j.prompt_id, status: j.status, label: j.label }));
    return {
      queue,
      jobs,
      unfinished: open,
      jobs_dir: jobsDirOf(),
      hint: "pass prompt_id to inspect one job, or download=true to pull its files again"
    };
  }

  const queue = await client.queue();
  const history = await client.history(promptId);

  if (!history) {
    const running = queue.running.find((p) => p.prompt_id === promptId);
    const pending = queue.pending.find((p) => p.prompt_id === promptId);

    if (!running && !pending) {
      // Not queued and no history: either it just finished (ComfyUI writes history a beat later)
      // or the box has genuinely forgotten it. waitFor tolerates a few empty polls before giving up,
      // so only its "disappeared" verdict is a reason to fall back to the ledger.
      if (options.wait !== false) {
        const timeoutSec = options.timeout_sec ?? settings.timeoutSec;
        try {
          const entry = await client.waitFor(promptId, { timeoutSec });
          return finishJob(client, entry, { promptId, destRoot, options });
        } catch (e) {
          if (e instanceof ComfyError && /timed out/.test(e.message)) {
            safeUpdate(promptId, { status: "timeout", timeout_sec: timeoutSec });
            return { prompt_id: promptId, status: "timeout", timeout_sec: timeoutSec, hint: "still running; poll again" };
          }
          // "disappeared": fall through to the ledger
        }
      }

      if (record) {
        return {
          prompt_id: promptId,
          status: record.status ?? "unknown",
          source: "ledger",
          note: "ComfyUI no longer holds this job (history trimmed or the server restarted); this is the record kept locally",
          submitted_at: record.submitted_at ?? null,
          last_checked_at: record.last_checked_at ?? null,
          tool: record.tool ?? null,
          label: record.label ?? null,
          output_dir: record.output_dir ?? null,
          files: record.files ?? [],
          ...(record.texts?.length ? { texts: record.texts } : {}),
          summary: record.summary ?? null
        };
      }
      return { prompt_id: promptId, status: "unknown", queue, hint: "not queued, no history, and not in the job ledger" };
    }

    if (options.wait !== false) {
      const timeoutSec = options.timeout_sec ?? settings.timeoutSec;
      try {
        const entry = await client.waitFor(promptId, { timeoutSec });
        return finishJob(client, entry, { promptId, destRoot, options });
      } catch (e) {
        if (e instanceof ComfyError && /timed out/.test(e.message)) {
          safeUpdate(promptId, { status: "timeout", timeout_sec: timeoutSec });
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

function jobsDirOf() {
  try {
    return jobsDir();
  } catch {
    return null;
  }
}

async function finishJob(client, history, { promptId, destRoot, options }) {
  const outcome = jobOutcome(history);
  const files = options.download === false ? [] : await client.downloadOutputs(history, { destRoot });
  const texts = ComfyClient.extractTexts(history);
  safeUpdate(promptId, {
    status: outcome.status,
    completed: outcome.completed,
    output_dir: destRoot,
    files,
    ...(texts.length ? { texts } : {}),
    ...(outcome.errors.length ? { errors: outcome.errors } : {})
  });
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
