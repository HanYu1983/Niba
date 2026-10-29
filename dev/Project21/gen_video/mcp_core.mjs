/**
 * video-compiler MCP server — compiles Omni-Media project blocks into render payloads.
 *
 * Scope: section 6.2 only (locate block -> hydrate entities -> assemble prompt -> payload).
 * ComfyUI submission and referenced_blocks unpacking are intentionally not here yet.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { compileBlock, CompilerError, VERSION } from "./compiler.mjs";

const ok = (obj) => ({ content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] });

function positionToLineCol(text, position) {
  const upto = text.slice(0, position);
  const line = upto.split("\n").length;
  const col = position - upto.lastIndexOf("\n");
  return { line, column: col };
}

function readProjectFile(file) {
  const abs = resolve(file);
  let text;
  try {
    text = readFileSync(abs, "utf8");
  } catch (e) {
    throw new CompilerError(`cannot read project file: ${e.code ?? e.message}`, { file: abs });
  }
  try {
    return { project: JSON.parse(text), file: abs };
  } catch (e) {
    const m = /position (\d+)/.exec(e.message);
    const where = m ? positionToLineCol(text, Number(m[1])) : undefined;
    throw new CompilerError(`invalid JSON in project file: ${e.message}`, { file: abs, ...where });
  }
}

function resolveProject(p) {
  if (p.project !== undefined) return { project: p.project, file: null };
  if (typeof p.project_file === "string" && p.project_file.length > 0) return readProjectFile(p.project_file);
  throw new CompilerError("provide either project_file (path) or project (inline object)");
}

export function createMcpServer() {
  const server = new McpServer({ name: "video-compiler", version: VERSION });

  server.registerTool(
    "compile_block",
    {
      title: "compile_block",
      description:
        "Extract ONE block from an Omni-Media project as a self-contained project JSON (section 1.4 shape): " +
        "keeps version / project_title / global_settings, copies the block with its entity_ref and " +
        "referenced_blocks intact, and includes only the characters, props and location that block uses. " +
        "No flattening into a prompt string — that is section 6.2 and lives behind compilePayload().",
      inputSchema: {
        project_file: z.string().optional().describe("path to the project JSON (entities + blocks); use this or project"),
        project: z.any().optional().describe("inline project object; use this or project_file"),
        block_id: z.string().describe('id of the block to extract, e.g. "block_verdict_read"'),
        reset_timeframe: z
          .boolean()
          .optional()
          .describe("default true: the compiled block starts at 0..duration as section 6.1 requires; set false to keep the original seconds")
      }
    },
    async (p) => {
      const { project, file } = resolveProject(p);
      try {
        const slice = compileBlock(project, p.block_id, { reset_timeframe: p.reset_timeframe !== false });
        return ok(slice);
      } catch (e) {
        if (e instanceof CompilerError) {
          return {
            isError: true,
            content: [{ type: "text", text: JSON.stringify({ error: e.message, ...(e.details ?? {}) }, null, 2) }]
          };
        }
        throw e;
      }
    }
  );

  return server;
}
