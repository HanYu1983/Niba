import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVER = process.env.COMFY_SERVER || "http://192.168.0.193:8000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs(argv) {
  const a = { pos: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const eq = argv[i].indexOf("=");
      if (eq !== -1) a.flags[argv[i].slice(2, eq)] = argv[i].slice(eq + 1);
      else a.flags[argv[i].slice(2)] = argv[++i];
    } else {
      a.pos.push(argv[i]);
    }
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));
const prompt = args.flags.prompt ?? args.pos[0] ?? "";
const seed = Number(args.flags.seed ?? Math.floor(Math.random() * 2 ** 32));
const outDir = resolve(HERE, args.flags.out || "output");
const wfFile = args.flags.workflow || "workflow_z_image_turbo.json";

const wf = JSON.parse(readFileSync(join(HERE, wfFile), "utf-8"));

const nodes = Object.entries(wf);
const posNode = nodes.find(([, n]) => n.class_type === "CLIPTextEncode");
const sampler = nodes.find(([, n]) => n.class_type === "KSampler")?.[1];
const latent = nodes.find(([, n]) => n.class_type === "EmptySD3LatentImage")?.[1];
const saveNode = nodes.find(([, n]) => n.class_type === "SaveImage")?.[1];

if (prompt && posNode) posNode[1].inputs.text = prompt;
if (sampler) sampler.inputs.seed = seed;
if (latent) {
  if (args.flags.width) latent.inputs.width = Number(args.flags.width);
  if (args.flags.height) latent.inputs.height = Number(args.flags.height);
}

console.log(`[gen] prompt : ${(prompt || "(empty)").slice(0, 80)}${prompt.length > 80 ? "..." : ""}`);
console.log(`[gen] seed   : ${seed}`);
console.log(`[gen] size   : ${latent?.inputs.width}x${latent?.inputs.height}`);
console.log(`[gen] server : ${SERVER}`);

const queued = await (async () => {
  const res = await fetch(`${SERVER}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: wf, client_id: randomUUID() }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`/prompt ${res.status}: ${text}`);
  return JSON.parse(text);
})();
console.log(`[gen] queued : ${queued.prompt_id}`);

const deadline = Date.now() + 120000;
let rec;
while (Date.now() < deadline) {
  await sleep(1500);
  const h = await (await fetch(`${SERVER}/api/history/${queued.prompt_id}`)).json();
  const r = h[queued.prompt_id];
  if (r?.status) {
    if (r.status.status_str === "success") { rec = r; break; }
    if (r.status.status_str === "error") throw new Error(`failed: ${JSON.stringify(r.status)}`);
  }
}
if (!rec) throw new Error("timeout");

mkdirSync(outDir, { recursive: true });
let count = 0;
for (const output of Object.values(rec.outputs || {})) {
  for (const img of output.images || []) {
    const params = new URLSearchParams({ filename: img.filename, subfolder: img.subfolder || "", type: img.type });
    const buf = await (await fetch(`${SERVER}/view?${params}`)).arrayBuffer();
    const file = join(outDir, img.filename);
    writeFileSync(file, Buffer.from(buf));
    count++;
    console.log(`[gen] saved : ${file} (${(buf.byteLength / 1024).toFixed(1)} KB)`);
  }
}
console.log(`[gen] done. ${count} image(s)`);
