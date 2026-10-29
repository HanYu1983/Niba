/**
 * CLI: compile one block without going through MCP.
 *   node cli.mjs <project.json> <block_id>
 */

import { readFileSync } from "node:fs";
import { compileBlock, CompilerError } from "./compiler.mjs";

const [file, blockId] = process.argv.slice(2);
if (!file || !blockId) {
  process.stderr.write("usage: node cli.mjs <project.json> <block_id>\n");
  process.exit(2);
}

try {
  const project = JSON.parse(readFileSync(file, "utf8"));
  process.stdout.write(JSON.stringify(compileBlock(project, blockId), null, 2) + "\n");
} catch (e) {
  if (e instanceof CompilerError) {
    process.stderr.write(`error: ${e.message}\n${e.details ? JSON.stringify(e.details, null, 2) + "\n" : ""}`);
    process.exit(1);
  }
  throw e;
}
