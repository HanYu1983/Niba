import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVER = process.env.COMFY_SERVER || "http://192.168.0.193:8000";
const POLL_INTERVAL = 4000;
const POLL_TIMEOUT = 40 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TMP = resolve(process.env.TEMP || "./");

export async function comfyGet(path) {
  const res = await fetch(`${SERVER}${path}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

export async function comfyPost(path, body, raw = false) {
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

function buildUpscaleWorkflow(wfPath, { file, model }) {
  const wf = JSON.parse(readFileSync(wfPath, "utf-8"));
  wf["9"].inputs.file = file;
  if (model) wf["1"].inputs.model_name = model;
  return wf;
}

async function downloadAndSave(filename, subfolder, type, outDir) {
  const params = new URLSearchParams({ filename, subfolder: subfolder || "", type: type || "output" });
  const res = await fetch(`${SERVER}/view?${params.toString()}`);
  if (!res.ok) throw new Error(`download failed ${filename}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const destDir = join(outDir, subfolder || "");
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, basename(filename));
  writeFileSync(dest, buf);
  return dest;
}

export async function upscaleVideos({ files, out, model }) {
  const outDir = resolve(out);
  mkdirSync(outDir, { recursive: true });
  const wfPath = resolve(HERE, "utility-gan_upscaler.json");
  const results = [];
  for (const f of files) {
    const name = `mcp_${Date.now()}_${basename(f)}`;
    await uploadFile(name, readFileSync(f));
    const res = await comfyPost("/prompt", { prompt: buildUpscaleWorkflow(wfPath, { file: name, model }), client_id: `mcp-${Date.now()}` });
    const promptId = res.prompt_id;
    const started = Date.now();
    let saved = [];
    process.stdout.write(`[upscale] submitted ${basename(f)} -> ${promptId}\n`);
    while (Date.now() - started < POLL_TIMEOUT) {
      const history = await comfyGet(`/api/history/${promptId}`);
      if (!history[promptId]) { await sleep(POLL_INTERVAL); continue; }
      const entry = history[promptId];
      const s = entry.status || {};
      if (s.status_str === "error" || s.completed === false) {
        throw new Error(`job ${promptId} failed: ${JSON.stringify(s.messages)}`);
      }
      const outs = Object.values(entry.outputs || {});
      if (outs.length) {
        for (const nodeOutput of outs) {
          for (const value of Object.values(nodeOutput)) {
            if (!Array.isArray(value)) continue;
            for (const item of value) {
              if (item?.filename) {
                saved.push(await downloadAndSave(item.filename, item.subfolder, item.type, outDir));
              }
            }
          }
        }
        if (!saved.length) throw new Error(`job ${promptId} no output files`);
        break;
      }
      await sleep(POLL_INTERVAL);
    }
    if (!saved.length) throw new Error(`job ${promptId} timed out`);
    results.push({ file: f, prompt_id: promptId, saved });
    process.stdout.write(`[upscale] done ${basename(f)} -> ${saved.join(", ")}\n`);
  }
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flagValue = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
  const flagNames = ["--submit-only", "--download", "--out", "--model"];
  const isValue = (a) => ["--out", "--model"].includes(a);
  const isFlag = (a) => flagNames.includes(a);
  const skipNext = [];
  args.forEach((a, i) => { if (isValue(a) && i + 1 < args.length) skipNext.push(args[i + 1]); });
  const mode = args.includes("--submit-only") ? "submit" : args.includes("--download") ? "download" : "both";
  const files = args.filter((a) => !isFlag(a) && !skipNext.includes(a) && !/^[0-9a-f-]{36}$/.test(a));
  const ids = args.filter((a) => /^[0-9a-f-]{36}$/.test(a));
  const out = flagValue("--out") || join(TMP, "upscaled");
  const model = flagValue("--model");
  const wfPath = resolve(HERE, "utility-gan_upscaler.json");
  const mkOut = () => { mkdirSync(out, { recursive: true }); return out; };

  const submit = async () => {
    const submitted = [];
    for (const f of files) {
      const name = `mcp_${Date.now()}_${basename(f)}`;
      await uploadFile(name, readFileSync(f));
      const res = await comfyPost("/prompt", { prompt: buildUpscaleWorkflow(wfPath, { file: name, model }), client_id: `mcp-${Date.now()}` });
      submitted.push({ file: f, prompt_id: res.prompt_id });
      process.stdout.write(`[submit] ${basename(f)} -> ${res.prompt_id}\n`);
    }
    return submitted;
  };

  const download = async (id) => {
    const started = Date.now();
    while (Date.now() - started < POLL_TIMEOUT) {
      const history = await comfyGet(`/api/history/${id}`);
      if (!history[id]) { await sleep(POLL_INTERVAL); continue; }
      const entry = history[id];
      const s = entry.status || {};
      if (s.status_str === "error" || s.completed === false) {
        throw new Error(`job ${id} failed: ${JSON.stringify(s.messages)}`);
      }
      const outs = Object.values(entry.outputs || {});
      if (outs.length) {
        const saved = [];
        for (const nodeOutput of outs) {
          for (const value of Object.values(nodeOutput)) {
            if (!Array.isArray(value)) continue;
            for (const item of value) {
              if (item?.filename) saved.push(await downloadAndSave(item.filename, item.subfolder, item.type, mkOut()));
            }
          }
        }
        if (!saved.length) throw new Error(`job ${id} no output files`);
        return saved;
      }
      await sleep(POLL_INTERVAL);
    }
    throw new Error(`job ${id} timed out`);
  };

  if (mode === "submit") {
    console.log(JSON.stringify(await submit(), null, 2));
  } else if (mode === "download") {
    if (!ids.length) { process.stderr.write("usage: node upscale_batch.mjs --download <prompt_id...> [--out dir]\n"); process.exit(1); }
    const results = [];
    for (const id of ids) {
      try {
        results.push({ prompt_id: id, saved: await download(id) });
        process.stdout.write(`[download] ${id} -> ${results.at(-1).saved.join(", ")}\n`);
      } catch (e) {
        results.push({ prompt_id: id, error: e.message });
        process.stderr.write(`[download] ${id} error: ${e.message}\n`);
      }
    }
    console.log(JSON.stringify(results, null, 2));
  } else {
    const submitted = await submit();
    const results = [];
    for (const { file, prompt_id } of submitted) {
      const saved = await download(prompt_id);
      results.push({ file, prompt_id, saved });
      process.stdout.write(`[done] ${basename(file)} -> ${saved.join(", ")}\n`);
    }
    console.log(JSON.stringify(results, null, 2));
  }
}