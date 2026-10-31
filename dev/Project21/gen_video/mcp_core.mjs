/**
 * video-compiler MCP server — compiles Omni-Media project blocks into render payloads.
 *
 * Scope: section 6.2 only (locate block -> hydrate entities -> assemble prompt -> payload).
 * ComfyUI submission and referenced_blocks unpacking are intentionally not here yet.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { compileBlock, entityPrompt, CompilerError, VERSION } from "./compiler.mjs";
import {
  comfyuiOutputDir,
  listPlates,
  locateReference,
  readMetadata,
  updateMetadata
} from "./metadata.mjs";

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

/**
 * `reference.image` is a DIRECTORY, not a file: ComfyUI names its own outputs, so a project
 * can only record where the plates land. Relative paths resolve against the absolute
 * `comfyui.output_dir` in metadata.json (keeping the project JSON portable); without that
 * metadata they fall back to the project file's own folder. A legacy value that still
 * points at one file is tolerated by using its parent folder.
 */
function resolveReferenceDir(located) {
  if (!located) return null;
  try {
    if (statSync(located.dir).isFile()) return { ...located, dir: dirname(located.dir) };
  } catch {
    // not on disk yet: treat the path as the folder it is meant to be
  }
  return located;
}

function errorResult(e) {
  return {
    isError: true,
    content: [{ type: "text", text: JSON.stringify({ error: e.message, ...(e.details ?? {}) }, null, 2) }]
  };
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
        if (e instanceof CompilerError) return errorResult(e);
        throw e;
      }
    }
  );

  server.registerTool(
    "entity_prompt",
    {
      title: "entity_prompt",
      description:
        "Return the reference-image prompt of ONE entity (character / prop / location) from an " +
        "Omni-Media project, so the r2v plate can be generated or re-checked without reading the " +
        "whole file. Uses the entity's reference.prompt verbatim when present; otherwise derives a " +
        "prompt from identity_features / appearance / description and says so in prompt_source. " +
        "reference.image is a FOLDER (ComfyUI names its own output files); the absolute folder is " +
        "computed as metadata.comfyui.output_dir + reference.image, and the plates already sitting " +
        "there are listed.",
      inputSchema: {
        project_file: z.string().optional().describe("path to the project JSON (entities + blocks); use this or project"),
        project: z.any().optional().describe("inline project object; use this or project_file"),
        entity_id: z.string().describe('entity id, e.g. "char_judge_xu", "prop_verdict", "loc_courtroom"'),
        check_image: z
          .boolean()
          .optional()
          .describe("default true: also compute image_dir from metadata and list images / image_exists")
      }
    },
    async (p) => {
      const { project, file } = resolveProject(p);
      try {
        const out = entityPrompt(project, p.entity_id);

        if (p.check_image !== false && out.reference?.image) {
          const located = resolveReferenceDir(locateReference(file, out.reference.image));
          if (located) {
            const images = listPlates(located.dir);
            out.reference.image_dir = located.dir;
            out.reference.image_dir_source = located.source;
            out.reference.images = images;
            out.reference.image_exists = images.length > 0;
          }
        }

        return ok(out);
      } catch (e) {
        if (e instanceof CompilerError) return errorResult(e);
        throw e;
      }
    }
  );

  server.registerTool(
    "metadata_get",
    {
      title: "metadata_get",
      description:
        "Show the server-side metadata (machine paths, not story data). `comfyui.output_dir` is the " +
        "absolute folder where ComfyUI drops its output; entity_prompt joins it with an entity's " +
        "relative reference.image to get that entity's absolute plate folder. Set it with metadata_set.",
      inputSchema: {}
    },
    async () => {
      try {
        const { file, exists, data } = readMetadata();
        const dir = comfyuiOutputDir(data);
        return ok({
          file,
          exists,
          metadata: data,
          comfyui_output_dir: dir,
          output_dir_exists: dir ? existsSync(dir) : false
        });
      } catch (e) {
        if (e instanceof CompilerError) return errorResult(e);
        throw e;
      }
    }
  );

  server.registerTool(
    "metadata_set",
    {
      title: "metadata_set",
      description:
        "Set metadata.comfyui.output_dir — the absolute folder ComfyUI writes generated images into. " +
        "Pass null to clear it (entity_prompt then falls back to the project file's folder). Writes " +
        "the metadata file; the project JSONs stay relative and portable.",
      inputSchema: {
        comfyui_output_dir: z
          .string()
          .nullable()
          .describe('absolute folder, e.g. "D:\\\\ComfyUI\\\\output", or null to clear'),
        create_dir: z.boolean().optional().describe("default true: create the folder if it does not exist")
      }
    },
    async (p) => {
      try {
        const out = updateMetadata(
          { comfyui_output_dir: p.comfyui_output_dir === null ? null : p.comfyui_output_dir },
          { createDir: p.create_dir !== false }
        );
        return ok({
          file: out.file,
          metadata: out.data,
          comfyui_output_dir: out.comfyui_output_dir,
          created: out.created
        });
      } catch (e) {
        if (e instanceof CompilerError) return errorResult(e);
        throw e;
      }
    }
  );

  return server;
}
