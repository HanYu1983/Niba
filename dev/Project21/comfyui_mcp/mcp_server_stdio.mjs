import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createMcpServer, VERSION } from "./mcp_core.mjs";

const server = createMcpServer();
const transport = new StdioServerTransport();

await server.connect(transport);
process.stderr.write(`[mcp] comfyui v${VERSION} stdio server started\n`);
