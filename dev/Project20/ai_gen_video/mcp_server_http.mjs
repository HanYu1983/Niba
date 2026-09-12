import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { randomUUID } from "node:crypto";
import { createMcpServer } from "./mcp_core.mjs";

const PORT = Number(process.env.MCP_HTTP_PORT || 8765);

const server = createMcpServer();

// ---- HTTP transport ----
const app = createMcpExpressApp({ host: "127.0.0.1" });

let transport;
app.post("/mcp", async (req, res) => {
  if (!transport) {
    transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => randomUUID() });
    await server.connect(transport);
  }
  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", async (req, res) => {
  if (!transport) { res.status(200).end(); return; }
  await transport.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  if (transport) { await transport.close(); transport = undefined; }
  res.status(204).end();
});

app.listen(PORT, "127.0.0.1", () => {
  process.stderr.write(`[mcp] comfy-video-gen v4.0.0 HTTP server listening on http://127.0.0.1:${PORT}/mcp\n`);
});