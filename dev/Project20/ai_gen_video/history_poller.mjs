import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVER = process.env.COMFY_SERVER || "http://192.168.0.193:8000";
const POLL_MS = 30000;
const STATE = resolve(HERE, "output", "history_poller_state.json");

const JOBS = [
  { id: "6284d276-64e6-4e9e-9d4e-dc564516fad4", label: "B2", out: "ch2_b2_video" },
  { id: "20c047f9-2075-44ee-9bf9-cce5fe0d65b7", label: "B20", out: "ch2_b20_video" },
  { id: "24c9302d-bc6f-4c73-9f66-5d046e59c5e4", label: "B12", out: "ch2_b12_video" },
  { id: "9057f53d-c86e-4f11-a6e0-332800a43267", label: "B21", out: "ch2_b21_video" },
  { id: "309b9bed-7b87-4567-90ec-4c1d6bd0cb13", label: "B22", out: "ch2_b22_video" },
  { id: "49917efa-504d-4513-8391-28d8c9212b44", label: "B23", out: "ch2_b23_video" },
  { id: "b52ab093-ede8-4578-8bf4-88819fdd12f8", label: "B24", out: "ch2_b24_video" },
  { id: "9f42f6b1-e013-4260-911a-3f93596d7456", label: "B25", out: "ch2_b25_video" },
  { id: "c6ce4db6-1541-49a3-9946-6ae98217f372", label: "B26", out: "ch2_b26_video" },
  { id: "b06d1660-4957-4148-b707-a600bd51659c", label: "B27", out: "ch2_b27_video" },
  { id: "071b6d4c-1d8c-4f72-99f6-e3bdc87b6711", label: "B28", out: "ch2_b28_video" },
  { id: "1677c973-36e6-4d66-9a92-05005839827b", label: "B29", out: "ch2_b29_video" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadState() {
  try { return JSON.parse(readFileSync(STATE, "utf-8")); } catch { return {}; }
}

function saveState(s) {
  mkdirSync(dirname(STATE), { recursive: true });
  writeFileSync(STATE, JSON.stringify(s, null, 2));
}

async function getHistory(id) {
  const r = await fetch(`${SERVER}/api/history/${id}`);
  if (!r.ok) throw new Error(`history ${id} -> ${r.status}`);
  return r.json();
}

async function download(file, subfolder, outDir, label) {
  const params = new URLSearchParams({ filename: file, subfolder: subfolder || "", type: "output" });
  const r = await fetch(`${SERVER}/view?${params.toString()}`);
  if (!r.ok) throw new Error(`view ${file} -> ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const destDir = join(outDir, subfolder || "");
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, basename(file));
  if (existsSync(dest) && readFileSync(dest).length === buf.length) return { dest, skipped: true };
  writeFileSync(dest, buf);
  writeFileSync(dest + ".txt", `prompt: ${label}\nmodel: minimax-h3-r2v\ndate: ${new Date().toISOString()}\n`);
  return { dest, skipped: false };
}

async function pollOnce(state) {
  const done = [];
  const pending = [];
  for (const job of JOBS) {
    const rec = state[job.id];
    if (rec?.done) { done.push(job.label); continue; }
    try {
      const h = await getHistory(job.id);
      const entry = h[job.id];
      if (!entry) { pending.push(job.label); continue; }
      const s = entry.status || {};
      if (s.status_str === "error") {
        state[job.id] = { done: true, error: true, message: (s.messages || []).map((m) => JSON.stringify(m)).join(" ") };
        console.log(`[poller] ${job.label} ${job.id} ERROR`);
        continue;
      }
      const items = Object.values(entry.outputs || {})
        .flatMap((no) => Object.values(no))
        .flatMap((v) => (Array.isArray(v) ? v : []))
        .filter((i) => i && i.filename);
      if (!items.length) { pending.push(job.label); continue; }
      await Promise.all(items.map((it) => downAndRecord(state, job, it)));
      state[job.id].done = true;
      done.push(job.label);
    } catch (e) {
      console.log(`[poller] ${job.label} poll error: ${e.message}`);
      pending.push(job.label);
    }
  }
  return { done, pending };
}

async function downAndRecord(state, job, it) {
  const rec = state[job.id] || {};
  const base = join(resolve(HERE, "output"), job.out);
  const prev = rec.files || [];
  const items = [it];
  for (const item of items) {
    const { dest, skipped } = await download(item.filename, item.subfolder || "", base, job.label);
    if (!prev.includes(dest)) prev.push(dest);
    console.log(`[poller] +${job.label} ${skipped ? "(skip dup) " : ""}${dest.split("Project20")[1] || dest} (${item.filename})`);
  }
  rec.files = prev;
  state[job.id] = rec;
}

async function main() {
  const state = loadState();
  console.log(`[poller] watching ${JOBS.length} jobs, poll every ${POLL_MS / 1000}s (state=${STATE.split("Project20")[1]})`);
  while (true) {
    const started = Date.now();
    try {
      const { done, pending } = await pollOnce(state);
      saveState(state);
      console.log(`[poller] ${new Date().toLocaleTimeString()} done=[${done.join(",")}] waiting=[${pending.join(",")}]`);
      if (pending.length === 0) { console.log("[poller] ALL DONE"); break; }
    } catch (e) {
      console.log(`[poller] loop error: ${e.message}`);
    }
    const elapsed = Date.now() - started;
    await sleep(Math.max(1000, POLL_MS - elapsed));
  }
}

main();