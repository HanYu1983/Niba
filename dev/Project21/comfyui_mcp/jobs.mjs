/**
 * Job ledger: one JSON file per submitted job, keyed by prompt_id.
 *
 *   comfyui_mcp/jobs/<prompt_id>.json
 *
 * Why a file per job instead of an array in one file:
 *   - a submission writes exactly one new file (atomic rename), so a crash mid-write cannot
 *     corrupt the rest of the ledger;
 *   - listing is a directory scan, and two jobs finishing at once never rewrite each other;
 *   - the ledger is the durable record: ComfyUI's /history only keeps recent entries and is
 *     wiped by a restart, but these files survive, so a job can be re-downloaded later.
 *
 * `output_dir` is recorded because it can be overridden per call — without it a re-download
 * would land in the wrong root.
 *
 * Override the location with COMFYUI_MCP_JOBS (the smoke test points it at a temp folder).
 */

import { mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_JOBS_DIR = resolve(HERE, "jobs");

const LEDGER_VERSION = "1.0";

export class JobLedgerError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "JobLedgerError";
    this.details = details;
  }
}

/** Where the ledger lives: env override, else ./jobs next to this file. */
export function jobsDir() {
  const override = process.env.COMFYUI_MCP_JOBS;
  return typeof override === "string" && override.trim() !== "" ? resolve(override) : DEFAULT_JOBS_DIR;
}

/** A prompt_id is a filename here, so refuse anything that could climb out of the folder. */
function jobFile(promptId) {
  const id = String(promptId ?? "").trim();
  if (id === "" || id === "." || id === ".." || /[\\/\u0000]/.test(id)) {
    throw new JobLedgerError("unsafe prompt_id for the job ledger", { prompt_id: promptId });
  }
  return join(jobsDir(), `${id}.json`);
}

function writeAtomic(file, data) {
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  renameSync(tmp, file);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Labels arrive as an object (MCP) or as a string (CLI, where PowerShell eats the quotes of an
 * inline JSON object). Both "{project=a,block_id=b}" and "project=a,block_id=b" are accepted, and
 * a bare ":" separator is tolerated because `{"project":"…"}` degrades to `{project:…}` in a shell.
 */
export function normalizeLabel(label) {
  if (label === null || label === undefined) return null;

  if (typeof label === "object" && !Array.isArray(label)) {
    const out = {};
    for (const [key, value] of Object.entries(label)) out[String(key)] = String(value);
    return Object.keys(out).length ? out : null;
  }

  if (typeof label !== "string") return null;

  const body = label.trim().replace(/^\{/, "").replace(/\}$/, "");
  if (body === "") return null;

  const out = {};
  for (const part of body.split(",")) {
    const eq = part.indexOf("=");
    const colon = part.indexOf(":");
    const at = eq === -1 ? colon : colon === -1 ? eq : Math.min(eq, colon);
    if (at <= 0) continue;
    const key = part.slice(0, at).trim();
    const value = part.slice(at + 1).trim().replace(/^["']|["']$/g, "");
    if (key !== "") out[key] = value;
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Written the moment /prompt accepts job, before any waiting: a timeout or a killed process
 * must not lose the only handle on a job that is already running on the GPU box.
 */
export function recordSubmission(record) {
  const promptId = record?.prompt_id;
  const now = new Date().toISOString();
  const entry = {
    version: LEDGER_VERSION,
    prompt_id: promptId,
    submitted_at: record.submitted_at ?? now,
    comfyui_url: record.comfyui_url ?? null,
    client_id: record.client_id ?? null,
    tool: record.tool ?? null,
    workflow: record.workflow ?? null,
    output_dir: record.output_dir ?? null,
    label: normalizeLabel(record.label),
    queue_number: record.queue_number ?? null,
    summary: record.summary ?? null,
    status: record.status ?? "submitted",
    files: [],
    last_checked_at: now
  };
  writeAtomic(jobFile(promptId), entry);
  return { file: jobFile(promptId), entry };
}

export function readJob(promptId) {
  return readJson(jobFile(promptId));
}

/** Shallow merge: undefined is ignored, so callers only send what changed. */
export function updateJob(promptId, patch = {}) {
  const entry = readJob(promptId);
  if (!entry) return null;
  const next = { ...entry, ...patch, prompt_id: entry.prompt_id, last_checked_at: new Date().toISOString() };
  writeAtomic(jobFile(promptId), next);
  return { file: jobFile(promptId), entry: next };
}

/** All label entries in `query` must match; extra keys in the record are fine. */
function labelMatches(record, query) {
  if (!query) return true;
  const label = record?.label;
  if (!label || typeof label !== "object") return false;
  return Object.entries(query).every(([key, value]) => String(label[key] ?? "") === String(value));
}

/** Newest submissions first. */
export function listJobs({ limit = 20, label, status, tool } = {}) {
  let names;
  try {
    names = readdirSync(jobsDir()).filter((n) => n.endsWith(".json"));
  } catch {
    return [];
  }

  const jobs = [];
  for (const name of names) {
    const entry = readJson(join(jobsDir(), name));
    if (!entry || typeof entry !== "object") continue;
    if (status !== undefined && entry.status !== status) continue;
    if (tool !== undefined && entry.tool !== tool) continue;
    if (!labelMatches(entry, label)) continue;
    jobs.push({
      prompt_id: entry.prompt_id,
      submitted_at: entry.submitted_at ?? null,
      tool: entry.tool ?? null,
      status: entry.status ?? null,
      label: entry.label ?? null,
      output_dir: entry.output_dir ?? null,
      file_count: Array.isArray(entry.files) ? entry.files.length : 0,
      last_checked_at: entry.last_checked_at ?? null
    });
  }

  jobs.sort((a, b) => String(b.submitted_at ?? "").localeCompare(String(a.submitted_at ?? "")));
  return jobs.slice(0, limit);
}

/** How many recorded jobs never reached a terminal state. */
export function unfinishedJobs(all = listJobs({ limit: 1000 })) {
  return all.filter((j) => !["success", "error", "cancelled"].includes(j.status ?? ""));
}
