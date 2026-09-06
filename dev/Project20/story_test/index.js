import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, basename } from "node:path";
import { randomUUID } from "node:crypto";
import { Blob } from "node:buffer";
import WebSocket from "ws";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envCache = loadDotEnv();

const serverAddress = process.env.SERVER_ADDRESS || envCache.SERVER_ADDRESS || "http://114.34.238.93:8188";

// ---------------- CLI 參數解析 ----------------
function parseArgs(argv) {
  const args = { prompt: null, negative: null, seed: null, out: null, workflowFile: null, image: null, steps: null, ckpt: null };
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    switch (key) {
      case "--prompt": case "-p": args.prompt = argv[++i]; break;
      case "--negative": case "-n": args.negative = argv[++i]; break;
      case "--seed": case "-s": args.seed = Number(argv[++i]); break;
      case "--out": case "-o": args.out = argv[++i]; break;
      case "--workflow": case "-w": args.workflowFile = argv[++i]; break;
      case "--image": case "-i": args.image = argv[++i]; break;
      case "--step": case "-t": args.steps = Number(argv[++i]); break;
      case "--ckpt": args.ckpt = argv[++i]; break;
      case "--help": case "-h": return "help";
    }
  }
  return args;
}

// ---------------- ComfyUI API 呼叫 ----------------

async function queuePrompt(prompt, clientId) {
  const res = await fetch(`${serverAddress}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, client_id: clientId }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`/prompt failed (${res.status}): ${text}`);
  const json = JSON.parse(text);
  console.log(`   伺服器 prompt_id: ${json.prompt_id} (number ${json.number})`);
  return json;
}

async function getHistory(promptId) {
  const res = await fetch(`${serverAddress}/history/${promptId}`);
  if (!res.ok) throw new Error(`/history failed (${res.status})`);
  return res.json();
}

async function getImage(filename, subfolder, type) {
  const params = new URLSearchParams({ filename, subfolder, type });
  const res = await fetch(`${serverAddress}/view?${params}`);
  if (!res.ok) throw new Error(`/view failed (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadImage(filePath) {
  const data = readFileSync(filePath);
  const form = new FormData();
  form.append("image", new Blob([data]), basename(filePath));
  form.append("overwrite", "true");
  const res = await fetch(`${serverAddress}/upload/image`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`/upload/image failed (${res.status}): ${JSON.stringify(json)}`);
  return json;
}

function openSocket(clientId) {
  return new Promise((resolve, reject) => {
    const wsUrl = `ws://${serverAddress.replace(/^https?:\/\//, "")}/ws?clientId=${clientId}`;
    console.log(`=> 連線 WebSocket: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    ws.on("open", () => {
      console.log("   WebSocket 已連線");
      resolve(ws);
    });
    ws.on("error", (err) => {
      console.error("   WebSocket 連線錯誤:", err.message);
      reject(err);
    });
  });
}

function waitForCompletion(ws, promptId) {
  const timeoutMs = Number(env("TIMEOUT_MS", "120000"));
  const startedAt = Date.now();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // WS 僅負責預覽圖 log；完成與否以輪詢 /history 為準
  ws.on("message", (data) => {
    if (typeof data !== "string") {
      const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
      process.stdout.write(`\r   [${elapsed}s] 收到預覽圖 (binary)`);
      return;
    }
    const msg = JSON.parse(data);
    switch (msg.type) {
      case "execution_start":
        console.log(`   [${((Date.now() - startedAt) / 1000).toFixed(1)}s] 開始執行`);
        break;
      case "execution_cached":
        console.log(`   [${((Date.now() - startedAt) / 1000).toFixed(1)}s] 命中快取節點: ${Object.keys(msg.data.nodes || {}).length} 個`);
        break;
      case "executing": {
        const payload = msg.data;
        if (payload.node === null) {
          console.log(`   [${((Date.now() - startedAt) / 1000).toFixed(1)}s] WS 指標: 執行完成`);
        } else {
          console.log(`   [${((Date.now() - startedAt) / 1000).toFixed(1)}s] 執行節點: ${payload.node}`);
        }
        break;
      }
      case "execution_error":
        console.log("   執行出錯:", JSON.stringify(msg.data).slice(0, 500));
        break;
      case "status":
        break; // 心跳訊息，忽略
      default:
        console.log(`   收到訊息類型: ${msg.type}`);
    }
  });
  ws.on("error", (err) => {
    console.error("   WebSocket 錯誤:", err.message);
  });
  ws.on("close", (code, reason) => {
    console.log(`\n   WebSocket 關閉 (code=${code}, reason=${reason?.toString() || "正常"})`);
  });

  return (async () => {
    while (Date.now() - startedAt < timeoutMs) {
      const history = await getHistory(promptId);
      const rec = history[promptId];
      if (rec && rec.status) {
        const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
        if (rec.status.status_str === "success") {
          console.log(`   [${elapsed}s] 執行完成 (status=success)`);
          ws.close();
          return rec;
        }
        if (rec.status.status_str === "error") {
          console.log(`   [${elapsed}s] 執行失敗: ${JSON.stringify(rec.status).slice(0, 500)}`);
          ws.close();
          throw new Error("workflow 執行失敗");
        }
      }
      await sleep(1000);
    }
    ws.close();
    throw new Error(`等待執行逾時 (${timeoutMs / 1000}s 未完成)，請確認伺服器忙碌狀態`);
  })();
}

// ---------------- 主流程 ----------------

function usage() {
  console.log(`
ComfyUI 生圖 API 客戶端

用法:
  node index.js [options]

選項:
  -p, --prompt <text>      正向提示詞 (預設取 .env DEFAULT_PROMPT)
  -n, --negative <text>    負向提示詞
  -s, --seed <number>      隨機種子 (預設取 .env DEFAULT_SEED)
  -i, --image <file>       輸入圖片 (img2img / 有 LoadImage 節點時)
  -w, --workflow <file>    API 格式 workflow JSON (預設 .env WORKFLOW_FILE)
  -o, --out <dir>          輸出目錄 (預設 .env OUTPUT_DIR)
      --step <number>      覆寫 KSampler steps
      --ckpt <name>        覆寫 checkpoint 名稱

範例:
  node index.js -p "a red car" -s 123 -o output
  node index.js -i input/photo.png -p "convert to anime style" -w image_z_image_turbo.json
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args === "help") return usage();

  const workflowFile = resolve(__dirname, args.workflowFile || env("WORKFLOW_FILE", "workflow.json"));
  const outDir = resolve(__dirname, args.out || env("OUTPUT_DIR", "output"));
  const prompt = args.prompt ?? env("DEFAULT_PROMPT", "");
  const seed = args.seed ?? Number(env("DEFAULT_SEED", "42"));

  const workflow = JSON.parse(readFileSync(workflowFile, "utf-8"));

  // --- 依節點類型找到要修改的節點 ---
  let posNode = null, negNode = null, samplerNode = null, ckptNode = null, loadImageNode = null, saveNode = null;
  for (const [id, node] of Object.entries(workflow)) {
    switch (node.class_type) {
      case "CheckpointLoaderSimple": ckptNode = { id, node }; break;
      case "KSampler":
        if (!samplerNode) samplerNode = { id, node };
        break;
      case "CLIPTextEncode":
        if (!posNode) posNode = { id, node };
        else if (!negNode) negNode = { id, node };
        break;
      case "LoadImage":
        if (!loadImageNode) loadImageNode = { id, node };
        break;
      case "SaveImage": saveNode = { id, node }; break;
    }
  }

  // --- img2img: 上傳輸入圖片 ---
  if (loadImageNode) {
    if (args.image) {
      const up = await uploadImage(resolve(args.image));
      const filePath = up.subfolder ? `${up.subfolder}/${up.name}` : up.name;
      loadImageNode.node.inputs.image = filePath;
      console.log(`=> 已上傳圖片: ${filePath}`);
    } else {
      const current = loadImageNode.node.inputs.image;
      if (current) {
        console.log(`=> LoadImage 使用伺服器既有圖片: ${current}`);
      } else {
        console.warn("! 注意: LoadImage 節點沒有指定圖片，請用 -i 上傳");
      }
    }
  }

  if (posNode) posNode.node.inputs.text = prompt;
  if (negNode && args.negative !== null) negNode.node.inputs.text = args.negative;
  if (samplerNode) {
    samplerNode.node.inputs.seed = seed;
    if (args.steps !== null) samplerNode.node.inputs.steps = args.steps;
  }
  if (ckptNode && args.ckpt) ckptNode.node.inputs.ckpt_name = args.ckpt;

  if (!posNode) {
    console.error("找不到 CLIPTextEncode 節點，請確認 workflow 格式");
    process.exit(1);
  }

  const clientId = randomUUID();

  console.log(`=> 送出到 ${serverAddress}`);
  console.log(`   workflow : ${workflowFile}`);
  console.log(`   prompt   : ${prompt.length > 80 ? prompt.slice(0, 80) + "..." : prompt}`);
  console.log(`   seed     : ${seed}`);
  if (samplerNode) console.log(`   steps    : ${samplerNode.node.inputs.steps}`);

  const ws = await openSocket(clientId);
  const queued = await queuePrompt(workflow, clientId);
  const promptId = queued.prompt_id;
  console.log("=> 已送出 prompt 到佇列");
  console.log("=> 等待執行完成...");
  const record = await waitForCompletion(ws, promptId);

  console.log(`=> 執行狀態: ${record.status ? record.status.status_str : "unknown"}`);

  mkdirSync(outDir, { recursive: true });
  let count = 0;
  for (const [nodeId, output] of Object.entries(record.outputs || {})) {
    for (const img of output.images || []) {
      console.log(`=> 下載圖片: ${img.filename} (type=${img.type})`);
      const data = await getImage(img.filename, img.subfolder, img.type);
      const file = join(outDir, img.filename);
      writeFileSync(file, data);
      console.log(`=> 已儲存: ${file}`);
      count++;
    }
  }
  console.log(`完成，共 ${count} 張圖片`);
}

// ---------------- .env 載入 ----------------
function loadDotEnv() {
  const map = {};
  try {
    for (const line of readFileSync(join(__dirname, ".env"), "utf-8").split("\n")) {
      const match = line.match(/^\s*([^#][^=]*?)\s*=\s*(.*)\s*$/);
      if (match) map[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}
  return map;
}

function env(key, fallback) {
  if (envCache[key] !== undefined) return envCache[key];
  return fallback;
}

main().catch((err) => {
  console.error("錯誤:", err.message);
  process.exit(1);
});