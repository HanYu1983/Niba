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

// ---------------- 主流程 ----------------

async function main() {
  const storyFile = resolve(__dirname, "story.json");
  const workflowFile = resolve(__dirname, process.argv[2] || "story_t2i.json");
  const outDir = resolve(__dirname, process.argv[3] || "story_output");
  const start = Number(process.argv[4] || "1");
  const end = Number(process.argv[5] || "999");
  const configFile = resolve(__dirname, process.argv[6] || "story_config.json");

  const story = JSON.parse(readFileSync(storyFile, "utf-8"));
  const config = JSON.parse(readFileSync(configFile, "utf-8"));
  const workflow = JSON.parse(readFileSync(workflowFile, "utf-8"));
  const { CLIPTextEncode, KSampler } = findNodes(workflow, ["CLIPTextEncode", "KSampler"]);
  const posNode = (CLIPTextEncode || []).find((n) => !isNegativeNode(workflow, n.id));
  const negNode = (CLIPTextEncode || []).find((n) => isNegativeNode(workflow, n.id));
  const sampler = (KSampler || [])[0];

  if (!posNode || !sampler) {
    console.error("workflow 缺少 CLIPTextEncode 或 KSampler 節點");
    process.exit(1);
  }

  const tokens = flatten(config);
  const scenes = story.scenes.filter((s) => s.n >= start && s.n <= end);
  const total = scenes.length;

  const clientId = randomUUID();
  mkdirSync(outDir, { recursive: true });
  console.log(`故事: ${substitute(story.title, tokens)} (${total} 幕) -> ${serverAddress}`);

  for (const scene of scenes) {
    const { title, prompt, negative, seed } = composePrompt(story, tokens, scene);

    posNode.node.inputs.text = prompt;
    if (negNode) negNode.node.inputs.text = negative;
    sampler.node.inputs.seed = seed;

    console.log(`\n[第 ${scene.n} 幕] ${title}`);
    console.log(`  seed=${seed}`);
    console.log(`  prompt: ${prompt.slice(0, 120)}...`);

    const ws = await openSocket(clientId);
    const queued = await queuePrompt(workflow, clientId);
    const record = await waitForCompletion(ws, queued.prompt_id);

    let saved = 0;
    for (const [nodeId, output] of Object.entries(record.outputs || {})) {
      for (const img of output.images || []) {
        const data = await getImage(img.filename, img.subfolder, img.type);
        const file = join(outDir, `story_${String(scene.n).padStart(2, "0")}.png`);
        writeFileSync(file, data);
        console.log(`=> 已儲存: ${file}`);
        saved++;
      }
    }
    if (saved === 0) console.warn(`! 第 ${scene.n} 幕沒有輸出圖片`);
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