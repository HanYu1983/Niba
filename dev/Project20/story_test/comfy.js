import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, resolve } from "node:path";
import { Blob } from "node:buffer";
import WebSocket from "ws";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const env = loadDotEnv();
export const serverAddress = process.env.SERVER_ADDRESS || env.SERVER_ADDRESS || "http://114.34.238.93:8188";

// ---------------- ComfyUI API ----------------

export async function queuePrompt(prompt, clientId) {
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

export async function getHistory(promptId) {
  const res = await fetch(`${serverAddress}/history/${promptId}`);
  if (!res.ok) throw new Error(`/history failed (${res.status})`);
  return res.json();
}

export async function getImage(filename, subfolder, type) {
  const params = new URLSearchParams({ filename, subfolder, type });
  const res = await fetch(`${serverAddress}/view?${params}`);
  if (!res.ok) throw new Error(`/view failed (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

export async function uploadImage(filePath) {
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

export function openSocket(clientId) {
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

export function waitForCompletion(ws, promptId) {
  const timeoutMs = Number(env.TIMEOUT_MS || "180000");
  const startedAt = Date.now();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const progress = (msg) => process.stdout.write(`\r     ${msg}`);

  // WS 僅負責預覽圖 log；完成與否以輪詢 /history 為準
  ws.removeAllListeners("message");
  const onMessage = (data) => {
    if (typeof data !== "string") {
      const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
      progress(`[${elapsed}s] 收到預覽圖`);
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
      default:
        break;
    }
  };
  ws.on("message", onMessage);
  ws.on("error", (err) => {
    console.error("   WebSocket 錯誤:", err.message);
  });
  ws.on("close", (code, reason) => {
    process.stdout.write(`\n   WebSocket 關閉 (code=${code}, reason=${reason?.toString() || "正常"})\n`);
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

// workflow 常用節點查找
export function findNodes(workflow, classTypes) {
  const map = {};
  for (const [id, node] of Object.entries(workflow)) {
    for (const ct of classTypes) {
      if (node.class_type === ct) {
        (map[ct] ||= []).push({ id, node });
      }
    }
  }
  return map;
}

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

export { resolve, join, basename };