#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPixelStudioServer } from "./server.js";

const server = createPixelStudioServer();
const transport = new StdioServerTransport();

try {
  await server.connect(transport);
  console.error("mcp-pixel-studio: listening on stdio");
} catch (error) {
  console.error("mcp-pixel-studio: failed to start", error);
  process.exit(1);
}
