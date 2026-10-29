import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp_core.mjs";
import { VERSION } from "./compiler.mjs";

const server = createMcpServer();
const transport = new StdioServerTransport();

await server.connect(transport);
process.stderr.write(`[mcp] video-compiler v${VERSION} stdio server started\n`);
