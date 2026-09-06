import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import {
  serverAddress,
  queuePrompt,
  openSocket,
  waitForCompletion,
  getImage,
  findNodes,
} from "./comfy.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------- 模板引擎 ----------------

// 把 config 攤平成一層 token 對照表 ({a:{b:"x"}} -> {"a.b": "x"})
function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

// 用 token 對照表把 {{key}} 全部替換掉；找不到的保留原樣
function substitute(template, tokens) {
  return String(template).replace(/\{\{([^}]+)\}\}/g, (match, key) =>
    tokens[key.trim()] !== undefined ? tokens[key.trim()] : match
  );
}

// 組出單一幕的完整提示詞
function composePrompt(story, tokens, scene) {
  const local = { ...tokens, ...flatten(scene) };
  const title = substitute(scene.title, local);
  const scenePart = substitute(scene.scene_part, local);
  const prompt = substitute(story.prompt_template, { ...local, scene_part: scenePart });
  const negative = substitute(story.negative, local);
  return { title, prompt, negative, seed: scene.seed };
}

// ---------------- 參數解析 ----------------

// 指定場景: "1,3,5" 或 "2-4" 或 "7"
function parseScenes(spec) {
  const nums = new Set();
  for (const part of spec.split(",")) {
    const t = part.trim();
    if (!t) continue;
    const m = t.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      for (let i = Number(m[1]); i <= Number(m[2]); i++) nums.add(i);
    } else if (/^\d+$/.test(t)) {
      nums.add(Number(t));
    }
  }
  return nums;
}

// 尺寸: "[[1024,1024],[832,1216]]" -> [[1024,1024],[832,1216]]
function parseSizes(spec, fallback) {
  if (spec) {
    try {
      const arr = JSON.parse(spec);
      if (Array.isArray(arr) && arr.length && arr.every((s) => Array.isArray(s) && s.length === 2)) {
        return arr;
      }
      console.error(`尺寸格式錯誤: ${spec}`);
    } catch {
      console.error(`尺寸 JSON 解析失敗: ${spec}`);
    }
  }
  return fallback;
}

// ---------------- 主流程 ----------------

async function main() {
  const storyFile = resolve(__dirname, "story.json");
  const workflowFile = resolve(__dirname, process.argv[2] || "story_t2i.json");
  const outDir = resolve(__dirname, process.argv[3] || "story_output");
  const start = Number(process.argv[4] || "1");
  const end = Number(process.argv[5] || "999");
  const configFile = resolve(__dirname, process.argv[6] || "story_config.json");
  const scenesParam = process.argv[7]; // 指定場景，例如 "1,3,5"
  const sizesParam = process.argv[8]; // 尺寸 JSON，例如 "[[832,1216],[1216,832]]"

  const story = JSON.parse(readFileSync(storyFile, "utf-8"));
  const config = JSON.parse(readFileSync(configFile, "utf-8"));
  const workflow = JSON.parse(readFileSync(workflowFile, "utf-8"));

  const sizes = parseSizes(sizesParam, story.sizes || [[1024, 1024]]);
  const scenes = scenesParam
    ? story.scenes.filter((s) => parseScenes(scenesParam).has(s.n))
    : story.scenes.filter((s) => s.n >= start && s.n <= end);
  const total = scenes.length * sizes.length;

  const { CLIPTextEncode, KSampler, EmptySD3LatentImage } = findNodes(workflow, [
    "CLIPTextEncode",
    "KSampler",
    "EmptySD3LatentImage",
  ]);
  const posNode = (CLIPTextEncode || []).find((n) => !isNegativeNode(workflow, n.id));
  const negNode = (CLIPTextEncode || []).find((n) => isNegativeNode(workflow, n.id));
  const sampler = (KSampler || [])[0];
  const latentNode = (EmptySD3LatentImage || [])[0];

  if (!posNode || !sampler) {
    console.error("workflow 缺少 CLIPTextEncode 或 KSampler 節點");
    process.exit(1);
  }
  if (!latentNode) {
    console.error("workflow 缺少 EmptySD3LatentImage 節點，無法設定尺寸");
    process.exit(1);
  }

  const tokens = flatten(config);
  const clientId = randomUUID();
  mkdirSync(outDir, { recursive: true });
  console.log(`故事: ${substitute(story.title, tokens)}`);
  console.log(`幕數: ${scenes.map((s) => s.n).join(",")} | 尺寸: ${sizes.map((s) => `${s[0]}x${s[1]}`).join(", ")}`);
  console.log(`伺服器: ${serverAddress}`);

  for (const scene of scenes) {
    const { title, prompt, negative, seed } = composePrompt(story, tokens, scene);

    posNode.node.inputs.text = prompt;
    if (negNode) negNode.node.inputs.text = negative;

    const sizesStrings = sizes.map((s) => `${s[0]}x${s[1]}`);
    console.log(`\n[第 ${scene.n} 幕] ${title} | ${sizesStrings.join(" ")}`);

    for (let si = 0; si < sizes.length; si++) {
      const [w, h] = sizes[si];
      const sceneSeed = seed + si;
      sampler.node.inputs.seed = sceneSeed;
      latentNode.node.inputs.width = w;
      latentNode.node.inputs.height = h;

      console.log(`  => ${w}x${h} seed=${sceneSeed}`);
      console.log(`  prompt: ${prompt}`);

      const ws = await openSocket(clientId);
      const queued = await queuePrompt(workflow, clientId);
      const record = await waitForCompletion(ws, queued.prompt_id);

      let saved = 0;
      for (const [nodeId, output] of Object.entries(record.outputs || {})) {
        for (const img of output.images || []) {
          const data = await getImage(img.filename, img.subfolder, img.type);
          const file = join(outDir, `story_${String(scene.n).padStart(2, "0")}_${w}x${h}.png`);
          writeFileSync(file, data);
          console.log(`=> 已儲存: ${file}`);
          saved++;
        }
      }
      if (saved === 0) console.warn(`! ${w}x${h} 沒有輸出圖片`);
    }
  }

  console.log(`\n全部完成，共 ${total} 張圖片 -> ${outDir}`);
}

function isNegativeNode(workflow, id) {
  const node = workflow[id];
  if (!node || !node.inputs) return false;
  return /bad|low quality|negative|低品質|模糊|水印/i.test(String(node.inputs.text || ""));
}

main().catch((err) => {
  console.error("錯誤:", err.message);
  process.exit(1);
});