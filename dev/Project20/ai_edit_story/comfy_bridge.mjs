/**
 * Bridge: story-editor → comfy-video-gen MCP (stdio child).
 * Keeps a long-lived child so background download jobs survive after each callTool.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_COMFY_STDIO = resolve(HERE, "../ai_gen_video/mcp_server_stdio.mjs");
const DEFAULT_COMFY_SERVER = process.env.COMFY_SERVER || "http://192.168.0.193:8000";

let clientPromise = null;
let transport = null;

function comfyStdioPath() {
  const p = process.env.COMFY_MCP_STDIO || DEFAULT_COMFY_STDIO;
  if (!existsSync(p)) {
    throw new Error(
      `comfy-video-gen stdio entry not found: ${p}\n` +
        `Set COMFY_MCP_STDIO to ai_gen_video/mcp_server_stdio.mjs`
    );
  }
  return p;
}

async function connectComfy() {
  const entry = comfyStdioPath();
  const env = { ...process.env };
  if (!env.COMFY_SERVER) env.COMFY_SERVER = DEFAULT_COMFY_SERVER;
  // Avoid stdio noise collisions with parent MCP (child logs go to its own stderr).
  transport = new StdioClientTransport({
    command: process.execPath,
    args: [entry],
    env,
    stderr: "inherit"
  });
  const client = new Client({ name: "story-editor-comfy-bridge", version: "1.0.0" });
  await client.connect(transport);
  process.stderr.write(
    `[mcp] story-editor bridged comfy-video-gen (${entry}) COMFY_SERVER=${env.COMFY_SERVER}\n`
  );
  return client;
}

export async function getComfyClient() {
  if (!clientPromise) {
    clientPromise = connectComfy().catch((e) => {
      clientPromise = null;
      transport = null;
      throw e;
    });
  }
  return clientPromise;
}

/** Parse MCP tool text/json content into an object when possible. */
export function parseToolResult(result) {
  if (result?.isError) {
    const msg = (result.content || [])
      .map((c) => (c.type === "text" ? c.text : JSON.stringify(c)))
      .join("\n");
    throw new Error(msg || "comfy tool error");
  }
  const texts = (result.content || [])
    .filter((c) => c.type === "text")
    .map((c) => c.text);
  const joined = texts.join("\n").trim();
  if (!joined) return { raw: result };
  try {
    return JSON.parse(joined);
  } catch {
    return { text: joined, raw: result };
  }
}

/**
 * Call a comfy-video-gen tool by name with arguments.
 * Retries once after reconnect if the child died.
 */
export async function callComfyTool(name, args = {}) {
  const tryOnce = async () => {
    const client = await getComfyClient();
    const result = await client.callTool({ name, arguments: args });
    return parseToolResult(result);
  };
  try {
    return await tryOnce();
  } catch (e) {
    const msg = String(e?.message || e);
    if (/closed|EPIPE|not connected|Connection closed|transport/i.test(msg)) {
      process.stderr.write(`[mcp] comfy bridge reconnect after: ${msg}\n`);
      try {
        await closeComfyBridge();
      } catch {
        /* ignore */
      }
      return await tryOnce();
    }
    throw e;
  }
}

export async function closeComfyBridge() {
  const p = clientPromise;
  clientPromise = null;
  const t = transport;
  transport = null;
  if (p) {
    try {
      const c = await p;
      await c.close();
    } catch {
      /* ignore */
    }
  }
  if (t) {
    try {
      await t.close();
    } catch {
      /* ignore */
    }
  }
}

// Best-effort cleanup when story-editor process exits.
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  try {
    process.on(sig, () => {
      closeComfyBridge().finally(() => process.exit(0));
    });
  } catch {
    /* windows may lack SIGHUP */
  }
}
