import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp_core.mjs";

const server = createMcpServer();

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("[mcp] comfy-video-gen v4.0.0 stdio server started\n");