// 舊式動態網頁：純 Node http server + 伺服器渲染 + 表單 POST，不使用 AJAX。
// 呼叫 story.js 生圖，全部輸出到 <project>/output，並提供圖片瀏覽功能。
import http from "node:http";
import { spawn } from "node:child_process";
import { readdir, readFile, mkdir, stat } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const ROOT = process.cwd();
const OUTPUT_DIR = join(ROOT, "output");
const PORT = Number(process.env.PORT || "3000");

const H = {
  img: (name) => `<img src="/files/${encodeURIComponent(name)}" />`,
  url: (s) => encodeURIComponent(s),
  attr: (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  text: (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
};

const isConfigFile = (f) => /^story_config.*\.json$/i.test(f);
const isWorkflowFile = (f) => /\.json$/i.test(f) && /(^story_.*t2i|^image_z|workflow|,?turbo)/i.test(f);
const isStoryFile = (f) => /\.json$/i.test(f) && !isConfigFile(f) && !isWorkflowFile(f);

const jsonFiles = async () => (await readdir(ROOT)).filter((f) => f.endsWith(".json"));
const listStories = async () => (await jsonFiles()).filter(isStoryFile);
const listConfigs = async () => (await jsonFiles()).filter(isConfigFile);
const listWorkflows = async () => (await jsonFiles()).filter(isWorkflowFile);

const listImages = async () => {
  try {
    const names = (await readdir(OUTPUT_DIR)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
    const withMeta = await Promise.all(
      names.map(async (n) => {
        const st = await stat(join(OUTPUT_DIR, n));
        return { name: n, size: st.size, mtime: st.mtimeMs };
      })
    );
    return withMeta.sort((a, b) => b.mtime - a.mtime);
  } catch {
    return [];
  }
};

const page = (title, body, extraMeta = "") => `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${extraMeta}
<title>${H.text(title)}</title>
<style>
  body { font-family: "Microsoft JhengHei", sans-serif; margin: 0; background: #1e1e24; color: #eee; }
  .wrap { max-width: 1000px; margin: 0 auto; padding: 16px; }
  h1 { font-size: 22px; }
  a { color: #7ac8ff; }
  .panel { background: #2a2a33; border: 1px solid #3a3a44; border-radius: 8px; padding: 14px; margin: 12px 0; }
  table { border-collapse: collapse; }
  td, th { padding: 5px 9px; border: 1px solid #3a3a44; font-size: 14px; }
  input, select { background: #17171d; color: #eee; border: 1px solid #444; border-radius: 4px; padding: 5px 7px; font-size: 14px; }
  button { background: #3d8bff; color: #fff; border: 0; border-radius: 5px; padding: 8px 18px; font-size: 15px; cursor: pointer; }
  pre { background: #12121a; border: 1px solid #333; border-radius: 6px; padding: 10px; overflow: auto; max-height: 320px; font-size: 12px; white-space: pre-wrap; }
  .grid { display: flex; flex-wrap: wrap; gap: 12px; }
  .grid figure { margin: 0; width: 240px; }
  .grid img { width: 100%; border-radius: 6px; border: 1px solid #444; }
  .grid figcaption { font-size: 12px; color: #aaa; word-break: break-all; }
  .nav { margin: 10px 0; }
</style>
</head>
<body>
<div class="wrap">
<h1>${H.text(title)}</h1>
${body}
</div>
</body>
</html>`;

const nav = (active) => `<div class="nav">
  <a href="/">[生圖首頁]</a>
  <a href="/gallery">[圖片庫]</a>
  <a href="/jobs">[任務列表]</a>
  <span style="color:#666">| ${active}</span>
</div>`;

function decodeBody(raw) {
  const params = {};
  for (const part of raw.split("&")) {
    if (!part) continue;
    const [k, v] = part.split("=");
    params[decodeURIComponent(k)] = decodeURIComponent((v || "").replace(/\+/g, " "));
  }
  return params;
}

// ---------------- 前端選項／參數 ----------------

async function renderIndex(reqUrl) {
  const query = new URLSearchParams((reqUrl || "").split("?")[1] || "");
  const stories = await listStories();
  const configs = await listConfigs();
  const workflows = await listWorkflows();

  const qs = (key, def) => query.get(key) || def;
  const selStory = qs("story", stories[0] || "");
  const selConfig =
    qs("config", configs.includes(`story_config_${selStory.replace(/^story_/, "")}`) ? `story_config_${selStory.replace(/^story_/, "")}` : (configs[0] || ""));
  const selWorkflow = qs("workflow", workflows.includes("story_t2i_hd.json") ? "story_t2i_hd.json" : (workflows[0] || ""));
  const vStart = qs("start", "1");
  const vEnd = qs("end", "999");
  const vScenes = qs("scenes", "");
  const vSizes = qs("sizes", "");
  const vSeed = qs("seed", "");
  const vOut = qs("out", "output");

  const opt = (list, selected, label) =>
    list
      .map((f, i) => `<option value="${H.attr(f)}" ${f === selected ? "selected" : ""}>${f}</option>`)
      .join("");

  const body = `
${nav("生圖首頁")}
<div class="panel">
<form method="post" action="/generate">
  <table>
    <tr><th>故事檔 (story)</th>
        <td><select name="story" size="8" style="width:320px">${opt(stories, selStory)}</select></td>
        <td style="color:#999;font-size:12px">故事 JSON：含各幕提示詞與風格</td></tr>
    <tr><th>人物檔 (config)</th>
        <td><select name="config" size="5" style="width:320px">${opt(configs, selConfig)}</select></td>
        <td style="color:#999;font-size:12px">person1/2 描述、服裝、名字</td></tr>
    <tr><th>工作流 (workflow)</th>
        <td><select name="workflow">${opt(workflows, selWorkflow)}</select></td>
        <td style="color:#999;font-size:12px">story_t2i_hd.json 推薦</td></tr>
    <tr><th>起點幕次</th><td><input name="start" value="${H.attr(vStart)}" size="6" /></td><td></td></tr>
    <tr><th>終點幕次</th><td><input name="end" value="${H.attr(vEnd)}" size="6" /></td><td></td></tr>
    <tr><th>指定幕次</th><td><input name="scenes" value="${H.attr(vScenes)}" placeholder="1,3,5 或 1-5" size="20" /></td>
        <td style="color:#999;font-size:12px">留空 = 依起點/終點</td></tr>
    <tr><th>尺寸 JSON</th><td><input name="sizes" value="${H.attr(vSizes)}" placeholder="[[832, 1216]]" size="24" /></td>
        <td style="color:#999;font-size:12px">留空 = 用 story 預設</td></tr>
    <tr><th>基礎 Seed</th><td><input name="seed" value="${H.attr(vSeed)}" placeholder="例如 1234" size="12" /></td>
        <td style="color:#999;font-size:12px">留空 = 隨機</td></tr>
    <tr><th>輸出目錄</th><td><input name="out" value="${H.attr(vOut)}" size="12" /></td>
        <td style="color:#999;font-size:12px">預設 output（掛載到 story_test/output）</td></tr>
  </table>
  <p><button type="submit">開始生圖</button></p>
</form>
</div>
<div class="panel">
<p style="font-size:13px;color:#bbb">提示：沒有 AJAX。送出表單後會建立任務，狀態頁用 meta refresh 每秒自動重新整理，完成後顯示成品圖。</p>
</div>`;
  return page("story 生圖 Web", body);
}

// ---------------- 任務管理 ----------------

const jobs = new Map();
let nextJobId = 1;

function startJob(params) {
  const id = `${Date.now().toString(36)}-${nextJobId++}`;
  const job = {
    id,
    created: Date.now(),
    status: "running",
    command: "",
    log: [],
    images: [],
    args: params,
  };
  jobs.set(id, job);

  const safe = (list, f) => (list.includes(f) ? f : "");
  const story = safe(storiesCache, params.story);
  const config = safe(configsCache, params.config);
  const workflow = safe(workflowsCache, params.workflow);
  const outDir = basename(params.out || "output");

  if (!story || (params.config && !config) || (params.workflow && !workflow)) {
    job.status = "error";
    job.log = ["參數錯誤：story/config/workflow 不在允許清單內。"];
    return job;
  }

  const args = [resolve(ROOT, "story.js"), story, workflow, outDir, params.start, params.end, config];
  if (params.scenes) args.push(params.scenes);
  if (params.sizes) args.push(params.sizes);
  if (params.seed) args.push(params.seed);
  job.command = `node ${args.map((a) => `"${a}"`).join(" ")}`;

  const child = spawn(process.execPath, args, { cwd: ROOT });
  job.child = child;

  const push = (chunk, stream) => {
    for (const line of String(chunk).split(/\r?\n/)) {
      if (line) job.log.push(`[${stream}] ${line}`);
    }
  };
  child.stdout.on("data", (d) => push(d, "out"));
  child.stderr.on("data", (d) => push(d, "err"));
  child.on("error", (e) => {
    job.status = "error";
    job.log.push(`[err] ${e.message}`);
  });
  child.on("close", async (code) => {
    job.log.push(`[out] 程序結束，exit code = ${code}`);
    job.status = code === 0 ? "done" : "error";
    job.images = (await listImages()).filter((im) => im.mtime >= job.created);
  });
  return job;
}

// 檔案清單快取（startJob 驗證用）
let storiesCache = [];
let configsCache = [];
let workflowsCache = [];
(async () => {
  storiesCache = await listStories();
  configsCache = await listConfigs();
  workflowsCache = await listWorkflows();
})();

async function renderJobPage(job) {
  const lines = job.log.slice(-200).join("\n");
  const statusText =
    job.status === "running" ? "生成中…（每 2 秒自動重新整理）" : job.status === "done" ? "完成" : "出錯";
  const meta = job.status === "running" ? '<meta http-equiv="refresh" content="2;url=/job?id=' + job.id + '" />' : "";

  let imagesHtml = "";
  if (job.status === "done" || job.images.length > 0) {
    imagesHtml = `<h2>成品圖（${job.images.length}）</h2>
      <div class="grid">${job.images
        .map((im) => `<figure><a href="/files/${H.url(im.name)}" target="_blank">${H.img(im.name)}</a><figcaption>${H.text(im.name)}</figcaption></figure>`)
        .join("")}</div>
      <p><a href="/gallery">開啟完整圖片庫 →</a></p>`;
  }

  const body = `
${nav("任務結果")}
<p>任務 ID：<b>${H.text(job.id)}</b> ｜ 狀態：<b>${statusText}</b>（下次自動重新整理後更新）</p>
<div class="panel">
<h2>執行指令</h2>
<pre>${H.text(job.command || "(尚未開始)")}</pre>
</div>
<div class="panel">
<h2>執行日誌</h2>
<pre>${H.text(lines)}</pre>
</div>
${imagesHtml}
<div class="nav"><a href="/gallery">回到圖片庫</a></div>`;
  return page(`任務 ${job.id}`, body, meta);
}

// ---------------- 頁面 ----------------

async function renderGallery() {
  const images = await listImages();
  const cards = images
    .map(
      (im) =>
        `<figure><a href="/files/${H.url(im.name)}" target="_blank">${H.img(im.name)}</a>
         <figcaption>${H.text(im.name)} ｜ ${(im.size / 1024 / 1024).toFixed(2)} MB</figcaption></figure>`
    )
    .join("");
  const body = `
${nav("圖片庫")}
<p>共 ${images.length} 張圖片（output/）。點圖看大圖。</p>
<div class="grid">${cards}</div>`;
  return page("圖片庫", body);
}

async function renderJobs() {
  const rows = [...jobs.values()]
    .sort((a, b) => b.created - a.created)
    .map(
      (j) =>
        `<tr><td><a href="/job?id=${H.url(j.id)}">${H.text(j.id)}</a></td>
        <td>${j.status === "running" ? "執行中" : j.status === "done" ? "完成" : "出錯"}</td>
        <td>${H.text(j.args.story || "")}</td>
        <td>${H.text(j.args.start || "?")}-${H.text(j.args.end || "?")}</td>
        <td>${j.images.length}</td>
        <td style="font-size:12px;color:#aaa">${new Date(j.created).toLocaleString("zh-TW")}</td></tr>`
    )
    .join("");
  const body = `${nav("任務列表")}<div class="panel"><table><tr><th>ID</th><th>狀態</th><th>故事</th><th>幕次</th><th>成品數</th><th>建立時間</th></tr>${rows}</table></div>`;
  return page("任務列表", body);
}

async function serveFile(fileName, res) {
  const name = basename(String(fileName));
  if (!/\.(png|jpe?g|webp)$/i.test(name)) return send(res, 400, "text/plain; charset=utf-8", "僅允許輸出圖片");
  const abs = resolve(OUTPUT_DIR, name);
  if (!abs.startsWith(resolve(OUTPUT_DIR))) return send(res, 400, "text/plain; charset=utf-8", "非法路徑");
  try {
    const buf = await readFile(abs);
    const ct = /\.png$/i.test(name) ? "image/png" : /\.jpe?g$/i.test(name) ? "image/jpeg" : "image/webp";
    res.writeHead(200, { "Content-Type": ct, "Content-Length": buf.length, "Cache-Control": "max-age=60" });
    res.end(buf);
  } catch {
    send(res, 404, "text/plain; charset=utf-8", "找不到檔案");
  }
}

function send(res, code, ct, body) {
  res.writeHead(code, { "Content-Type": ct, "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

// ---------------- 路由 ----------------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    if (req.method === "GET" && url.pathname === "/") {
      return send(res, 200, "text/html; charset=utf-8", await renderIndex(req.url));
    }
    if (req.method === "GET" && url.pathname === "/gallery") {
      return send(res, 200, "text/html; charset=utf-8", await renderGallery());
    }
    if (req.method === "GET" && url.pathname === "/jobs") {
      return send(res, 200, "text/html; charset=utf-8", await renderJobs());
    }
    if (req.method === "GET" && url.pathname === "/job") {
      const job = jobs.get(url.searchParams.get("id") || "");
      if (!job) return send(res, 404, "text/html; charset=utf-8", page("找不到任務", "<p>任務不存在或伺服器已重啟。</p>"));
      return send(res, 200, "text/html; charset=utf-8", await renderJobPage(job));
    }
    if (req.method === "GET" && url.pathname.startsWith("/files/")) {
      return await serveFile(url.pathname.slice("/files/".length), res);
    }
    if (req.method === "POST" && url.pathname === "/generate") {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const body = decodeBody(Buffer.concat(chunks).toString("utf8"));
      const job = startJob({
        story: body.story,
        config: body.config,
        workflow: body.workflow,
        start: String(body.start || "1").replace(/[^0-9]/g, "") || "1",
        end: String(body.end || "999").replace(/[^0-9]/g, "") || "999",
        scenes: body.scenes || "",
        sizes: body.sizes || "",
        seed: (body.seed || "").replace(/[^0-9]/g, ""),
        out: body.out || "output",
      });
      res.writeHead(302, { Location: `/job?id=${job.id}` });
      return res.end();
    }
    send(res, 404, "text/html; charset=utf-8", page("404", "<p>找不到頁面。</p>"));
  } catch (err) {
    console.error(err);
    send(res, 500, "text/html; charset=utf-8", page("錯誤", `<pre>${H.text(err.stack || err.message)}</pre>`));
  }
});

await mkdir(OUTPUT_DIR, { recursive: true });
server.listen(PORT, () => console.log(`story 生圖 Web 啟動於 http://localhost:${PORT} (outDir=${OUTPUT_DIR})`));