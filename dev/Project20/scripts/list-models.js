import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverAddress = loadEnv("SERVER_ADDRESS", "http://114.34.238.93:8188");
const nodeType = process.argv[2] || "CheckpointLoaderSimple";

const res = await fetch(`${serverAddress}/object_info/${nodeType}`);
if (!res.ok) {
  console.error(`查詢失敗 (${res.status})`);
  process.exit(1);
}
const info = await res.json();

if (!info[nodeType]) {
  console.error(`伺服器沒有 ${nodeType} 節點`);
  process.exit(1);
}

console.log(`可用 ${nodeType} 清單:`);
const items = info[nodeType].input.required;
for (const [name, def] of Object.entries(items)) {
  const list = def[0];
  if (Array.isArray(list)) {
    console.log(`- ${name}`);
    for (const item of list) console.log(`    * ${item}`);
  } else {
    console.log(`- ${name}`);
  }
}

function loadEnv(key, fallback) {
  try {
    for (const line of readFileSync(join(__dirname, "..", ".env"), "utf-8").split("\n")) {
      const match = line.match(/^\s*([^#][^=]*?)\s*=\s*(.*)\s*$/);
      if (match && match[1].trim() === key) return match[2].trim().replace(/^["']|["']$/g, "");
    }
  } catch {}
  return fallback;
}