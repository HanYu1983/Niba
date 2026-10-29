/**
 * Verifies the real stdio entry point (spawns `node mcp_server_stdio.mjs`).
 * Run: node test/stdio.mjs
 */

import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { resolve } from "node:path";

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [resolve("mcp_server_stdio.mjs")],
  stderr: "pipe"
});

const client = new Client({ name: "stdio-check", version: "0" }, { capabilities: {} });
await client.connect(transport);

const tools = (await client.listTools()).tools.map((t) => t.name);
assert.equal(tools.length, 12, tools.join(","));

const res = await client.callTool({
  name: "json_validate",
  arguments: { files: [resolve("package.json")] }
});
const data = JSON.parse(res.content[0].text);
assert.equal(data.all_ok, true);
assert.equal(data.results[0].root, "object");

await client.close();
console.log(`ok  stdio server responds (${tools.length} tools)`);
