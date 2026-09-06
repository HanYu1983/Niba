import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { Blob } from "node:buffer";

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVER = process.env.SERVER_ADDRESS || "http://114.34.238.93:8188";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 用法: node index.js "提示詞" [--seed N] [--workflow wf.json] [--out dir] [--width W] [--height H] [--image 檔名] [--vars prompt.json]
function parseArgs(argv) {
  const a = { pos: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) a.flags[argv[i].slice(2)] = argv[++i];
    else a.pos.push(argv[i]);
  }
  return a;
}

// 讀入外部 JSON，替換提示詞中的 {{token}}
function loadVars(file) {
  if (!file) return {};
  const vars = JSON.parse(readFileSync(resolve(file), "utf-8"));
  console.log(`[gen] vars=${file} (${Object.keys(vars).filter((k) => k !== "prompt").join(", ")})`);
  return vars;
}

const args = parseArgs(process.argv.slice(2));
const vars = loadVars(args.flags.vars);
const prompt = (args.flags.prompt ?? args.pos[0] ?? vars.prompt ?? "").replace(
  /\{\{(\w+)\}\}/g,
  (m, k) => (k in vars ? String(vars[k]) : m)
);
const seed = Number(args.flags.seed ?? vars.seed ?? Math.floor(Math.random() * 2 ** 32));
const outDir = resolve(HERE, args.flags.out || "output");
const wfFile = args.flags.workflow || "z_t2i.json";
const imageArg = args.flags.image;

const wf = JSON.parse(readFileSync(join(HERE, wfFile), "utf-8"));
const nodes = Object.entries(wf);

const posNodes = nodes.filter(([, n]) => n.class_type === "CLIPTextEncode");
const posNode = posNodes[0];
const negNode = posNodes[1];
const sampler = nodes.find(([, n]) => n.class_type === "KSampler")?.[1];
const latent = nodes.find(([, n]) => ["EmptySD3LatentImage", "EmptyLatentImage"].includes(n.class_type))?.[1];
const loadImage = nodes.find(([, n]) => n.class_type === "LoadImage")?.[1];

// 若有輸入圖片，先上傳到伺服器並填進 LoadImage 節點
if (loadImage) {
  if (!imageArg) throw new Error("此 workflow 需要圖片，請加 --image <檔案>");
  const data = readFileSync(resolve(imageArg));
  const form = new FormData();
  form.append("image", new Blob([data]), basename(imageArg));
  form.append("overwrite", "true");
  const up = await (await fetch(`${SERVER}/upload/image`, { method: "POST", body: form })).json();
  loadImage.inputs.image = up.subfolder ? `${up.subfolder}/${up.name}` : up.name;
  console.log(`[gen] uploaded ${loadImage.inputs.image}`);
}

if (prompt) {
  if (posNode) posNode[1].inputs.text = prompt;
  if (negNode) negNode[1].inputs.text = "low quality, blurry, watermark, text, deformed hands";
}
if (sampler) sampler.inputs.seed = seed;
if (latent) {
  if (args.flags.width) latent.inputs.width = Number(args.flags.width);
  if (args.flags.height) latent.inputs.height = Number(args.flags.height);
}

if (prompt) console.log(`[gen] ${prompt.slice(0, 60)}${prompt.length > 60 ? "..." : ""} | workflow=${wfFile} | seed=${seed}`);

// 送佇列
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
console.log(`[gen] queued prompt_id=${queued.prompt_id}`);

// 輪詢完成
const deadline = Date.now() + 300000;
let rec;
while (Date.now() < deadline) {
  await sleep(1000);
  const h = await (await fetch(`${SERVER}/history/${queued.prompt_id}`)).json();
  const r = h[queued.prompt_id];
  if (r?.status) {
    if (r.status.status_str === "success") { rec = r; break; }
    if (r.status.status_str === "error") throw new Error(`執行失敗: ${JSON.stringify(r.status)}`);
  }
}
if (!rec) throw new Error("等待逾時");

// 下載圖片
mkdirSync(outDir, { recursive: true });
let n = 0;
for (const output of Object.values(rec.outputs || {})) {
  for (const img of output.images || []) {
    const params = new URLSearchParams({ filename: img.filename, subfolder: img.subfolder, type: img.type });
    const buf = await (await fetch(`${SERVER}/view?${params}`)).arrayBuffer();
    const prefix = basename(imageArg || "").replace(/\.[^.]+$/, "") || "gen";
    const file = join(outDir, `${prefix}_${img.filename}`);
    writeFileSync(file, Buffer.from(buf));
    console.log(`[gen] saved ${file} (${img.filename})`);
  }
}
console.log(`[gen] done, ${n} image(s)`);