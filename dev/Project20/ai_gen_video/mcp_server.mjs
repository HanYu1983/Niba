import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SERVER = process.env.COMFY_SERVER || "http://192.168.0.193:8000";

function runScript(script, args, { timeout = 20 * 60 * 1000 } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill(); reject(new Error(`${script} timed out`)); }, timeout);
    const child = spawn(process.execPath, [script, ...args], { cwd: HERE, env: { ...process.env, COMFY_SERVER: SERVER } });
    let stdout = "", stderr = "";
    child.stdout.on("data", (d) => { stdout += d; process.stderr.write(String(d)); });
    child.stderr.on("data", (d) => { stderr += d; });
    child.on("error", (e) => { clearTimeout(timer); reject(e); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(`${script} exited ${code}:\n${stderr}\n${stdout}`));
      const m = stdout.match(/\[result\] (.*)/);
      if (!m) return reject(new Error(`${script} produced no [result] line:\n${stdout}`));
      try { resolve(JSON.parse(m[1])); }
      catch (e) { reject(new Error(`bad [result] JSON: ${m[1]}`)); }
    });
  });
}

const server = new McpServer({ name: "comfy-video-gen", version: "1.0.0" });

function outArg(subdir) {
  return subdir ? resolve(HERE, "output", subdir) : resolve(HERE, "output");
}

function makeArgs(flags) {
  const a = [];
  for (const [k, v] of Object.entries(flags)) {
    if (v !== undefined && v !== null) a.push(`--${k}`, String(v));
  }
  return a;
}

server.tool(
  "gen_sdxl_image",
  "Generate an image using the SDXL model (nostrarealisticmix). Returns output file path.",
  {
    prompt: z.string().min(1),
    seed: z.number().int().nonnegative().optional(),
    width: z.number().int().min(64).max(4096).step(32).optional(),
    height: z.number().int().min(64).max(4096).step(32).optional(),
    out: z.string().optional().describe("subdirectory under output/, e.g. 'car'")
  },
  async (p) => {
    const flags = { prompt: p.prompt, workflow: "workflow_sdxl_t2i.json", out: outArg(p.out) };
    if (p.seed !== undefined) flags.seed = p.seed;
    if (p.width !== undefined) flags.width = p.width;
    if (p.height !== undefined) flags.height = p.height;
    const paths = await runScript("gen_image.js", makeArgs(flags));
    return { content: [{ type: "text", text: JSON.stringify({ paths }, null, 2) }] };
  }
);

server.tool(
  "gen_zit_image",
  "Generate an image using Z-Image Turbo (zImageUltimateNSFW). Returns output file path.",
  {
    prompt: z.string().min(1),
    seed: z.number().int().nonnegative().optional(),
    width: z.number().int().min(64).max(4096).step(32).optional(),
    height: z.number().int().min(64).max(4096).step(32).optional(),
    out: z.string().optional().describe("subdirectory under output/, e.g. 'car'")
  },
  async (p) => {
    const flags = { prompt: p.prompt, workflow: "workflow_z_image_turbo.json", out: outArg(p.out) };
    if (p.seed !== undefined) flags.seed = p.seed;
    if (p.width !== undefined) flags.width = p.width;
    if (p.height !== undefined) flags.height = p.height;
    const paths = await runScript("gen_image.js", makeArgs(flags));
    return { content: [{ type: "text", text: JSON.stringify({ paths }, null, 2) }] };
  }
);

server.tool(
  "gen_t2v_video",
  "Generate a text-to-video using MiniMax H3. Returns output file path.",
  {
    prompt: z.string().min(1),
    seed: z.number().int().nonnegative().optional(),
    duration: z.number().min(1).max(60).default(5).optional(),
    out: z.string().optional().describe("subdirectory under output/, e.g. 'fight'")
  },
  async (p) => {
    const flags = { prompt: p.prompt, out: outArg(p.out) };
    if (p.seed !== undefined) flags.seed = p.seed;
    if (p.duration !== undefined) flags.duration = p.duration;
    const paths = await runScript("index.js", makeArgs(flags));
    return { content: [{ type: "text", text: JSON.stringify({ paths }, null, 2) }] };
  }
);

server.tool(
  "gen_i2v_video",
  "Generate an image-to-video using MiniMax H3. first_frame and last_frame are local image file paths (will be uploaded automatically). Returns output file path.",
  {
    prompt: z.string().min(1),
    first_frame: z.string().describe("local path to first frame image"),
    last_frame: z.string().describe("local path to last frame image"),
    seed: z.number().int().nonnegative().optional(),
    duration: z.number().min(1).max(60).default(5).optional(),
    out: z.string().optional().describe("subdirectory under output/")
  },
  async (p) => {
    const flags = {
      prompt: p.prompt,
      first: resolve(p.first_frame),
      last: resolve(p.last_frame),
      out: outArg(p.out)
    };
    if (p.seed !== undefined) flags.seed = p.seed;
    if (p.duration !== undefined) flags.duration = p.duration;
    const paths = await runScript("index_i2v.js", makeArgs(flags));
    return { content: [{ type: "text", text: JSON.stringify({ paths }, null, 2) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("[mcp] comfy-video-gen server started\n");
