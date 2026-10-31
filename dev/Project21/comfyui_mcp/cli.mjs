#!/usr/bin/env node
/**
 * Run any manifest tool without MCP:
 *
 *   node cli.mjs sdxl_t2i --prompt "neutral portrait of ..." --width 832 --height 1216 \
 *                         --filename_prefix refs/char_judge_xu/plate
 *
 *   node cli.mjs minimax_r2v --prompt "..." --reference_images out/refs/char_a/plate_1.png \
 *                           --reference_images out/refs/char_b/plate_2.png --duration_sec 5 --turbo
 *
 * Values: --flag=value or --flag value; numbers/booleans/JSON are parsed when possible;
 * repeating a flag collects an array (reference_images). `--status` / `--workflows` are shortcuts.
 *
 * Exit code: 0 success, 2 timeout (job still running), 1 error.
 */

import { inspectJob, runTool } from "./runner.mjs";
import { ComfyError } from "./comfy.mjs";
import { MetadataError, comfyuiSettings, readMetadata } from "./metadata.mjs";
import { TOOLS, coverage } from "./workflows.mjs";

const BOOL_TRUE = new Set(["true", "1", "yes", "on"]);
const BOOL_FALSE = new Set(["false", "0", "no", "off"]);

function parseValue(raw) {
  const v = raw.trim();
  if (BOOL_TRUE.has(v)) return true;
  if (BOOL_FALSE.has(v)) return false;
  if (v !== "" && !Number.isNaN(Number(v))) return Number(v);
  if ((v.startsWith("{") && v.endsWith("}")) || (v.startsWith("[") && v.endsWith("]"))) {
    try {
      return JSON.parse(v);
    } catch {
      return raw;
    }
  }
  return raw;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const eq = token.indexOf("=");
    let key;
    let value;
    if (eq !== -1) {
      key = token.slice(2, eq);
      value = token.slice(eq + 1);
    } else {
      key = token.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        value = next;
        i++;
      } else {
        value = "true";
      }
    }
    const parsed = parseValue(value);
    if (key in args) {
      args[key] = Array.isArray(args[key]) ? [...args[key], parsed] : [args[key], parsed];
    } else {
      args[key] = parsed;
    }
  }
  return args;
}

function usage() {
  const lines = ["usage: node cli.mjs <tool|--status|--workflows|--job> [--arg value ...]", "", "tools:"];
  for (const t of TOOLS) lines.push(`  ${t.tool.padEnd(14)} ${t.workflow}  (${t.kind})`);
  lines.push("", "run options: --wait false --timeout_sec 900 --download false --output_dir <dir>");
  return lines.join("\n");
}

async function main(argv) {
  const [head, ...rest] = argv;

  if (!head || head === "--help" || head === "-h") {
    console.log(usage());
    return 0;
  }

  try {
    if (head === "--status") {
      const { file, exists, data } = readMetadata();
      console.log(JSON.stringify({ file, exists, settings: comfyuiSettings(data) }, null, 2));
      return 0;
    }

    if (head === "--workflows") {
      console.log(JSON.stringify({ coverage: coverage(), tools: TOOLS.map((t) => t.tool) }, null, 2));
      return 0;
    }

    if (head === "--job") {
      const args = parseArgs(rest);
      const result = await inspectJob(args.prompt_id ?? null, { ...args, wait: args.wait === true });
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    if (!TOOLS.some((t) => t.tool === head)) {
      console.error(`unknown tool: ${head}\n\n${usage()}`);
      return 1;
    }

    const args = parseArgs(rest);
    const result = await runTool(head, args, args);
    console.log(JSON.stringify(result, null, 2));
    return result.status === "success" ? 0 : result.status === "timeout" ? 2 : 0;
  } catch (e) {
    if (e instanceof ComfyError || e instanceof MetadataError) {
      console.error(JSON.stringify({ error: e.message, ...(e.details ?? {}) }, null, 2));
      return 1;
    }
    throw e;
  }
}

// Set exitCode instead of process.exit(): exiting while fetch sockets are still closing trips
// a libuv assertion on Windows (node 24), and the job is already submitted by then.
process.exitCode = await main(process.argv.slice(2));
