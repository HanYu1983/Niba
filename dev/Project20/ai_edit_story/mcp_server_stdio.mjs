import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp_core.mjs";

const server = createMcpServer();

const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("[mcp] story-editor v1.1.0 stdio server started\n");
