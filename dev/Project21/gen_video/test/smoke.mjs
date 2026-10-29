/**
 * Smoke test: section-1.4 project slice + section-6.2 payload, then end-to-end MCP calls.
 * Run: node test/smoke.mjs
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createMcpServer } from "../mcp_core.mjs";
import { compileBlock, compilePayload, CompilerError } from "../compiler.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT_FILE = resolve(HERE, "../../test_story1/block_01_verdict.json");
const project = JSON.parse(readFileSync(PROJECT_FILE, "utf8"));

let pass = 0;
function check(name, fn) {
  fn();
  pass++;
  console.log(`ok  ${name}`);
}

// ---------- unit: compileBlock (1.4 shape) ----------

check("returns a project-shaped JSON holding exactly one block", () => {
  const out = compileBlock(project, "block_verdict_read");
  assert.deepEqual(Object.keys(out), ["version", "project_title", "global_settings", "entities", "blocks"]);
  assert.equal(out.version, "1.12");
  assert.equal(out.project_title, "Judge_Xu_Single_Block_Example");
  assert.equal(out.blocks.length, 1);
  assert.equal(out.blocks[0].id, "block_verdict_read");
});

check("keeps entity_ref / referenced_blocks instead of hydrating text", () => {
  const out = compileBlock(project, "block_verdict_read");
  const block = out.blocks[0];
  assert.equal(block.present_characters[0].entity_ref, "char_judge_xu");
  assert.equal(block.present_props[0].entity_ref, "prop_verdict");
  assert.equal(block.location_ref, "loc_courtroom");
  assert.equal(JSON.stringify(out).includes("Characters involved:"), false);
});

check("includes only the entities this block uses", () => {
  const wide = structuredClone(project);
  wide.entities.characters.push({ id: "char_extra", name: "路人", identity_features: {} });
  wide.entities.props.push({ id: "prop_extra", name: "雨傘", appearance: "black umbrella" });
  wide.entities.locations.push({ id: "loc_extra", name: "走廊", description: "empty hallway" });

  const out = compileBlock(wide, "block_verdict_read");
  assert.deepEqual(out.entities.characters.map((c) => c.id), ["char_judge_xu", "char_defendant_ajie"]);
  assert.deepEqual(out.entities.props.map((p) => p.id), ["prop_verdict"]);
  assert.deepEqual(out.entities.locations.map((l) => l.id), ["loc_courtroom"]);
  assert.equal(JSON.stringify(out).includes("char_extra"), false);
});

check("entities are deep copies (mutating output does not touch the project)", () => {
  const out = compileBlock(project, "block_verdict_read");
  out.entities.characters[0].name = "changed";
  out.blocks[0].action.description = "changed";
  assert.equal(project.entities.characters[0].name, "許法官 (Judge Xu)");
  assert.match(project.blocks[0].action.description, /^Judge Xu lifts/);
});

check("timeframe is recalculated to start at 0 by default", () => {
  const late = structuredClone(project);
  late.blocks[0].timeframe = { start_sec: 19, end_sec: 25 };
  assert.deepEqual(compileBlock(late, "block_verdict_read").blocks[0].timeframe, { start_sec: 0, end_sec: 6 });
  assert.deepEqual(
    compileBlock(late, "block_verdict_read", { reset_timeframe: false }).blocks[0].timeframe,
    { start_sec: 19, end_sec: 25 }
  );
});

check("referenced_blocks are preserved and validated", () => {
  const nested = structuredClone(project);
  nested.blocks.push({ ...structuredClone(nested.blocks[0]), id: "block_second" });
  nested.blocks[1].referenced_blocks = ["block_verdict_read"];

  const out = compileBlock(nested, "block_second");
  assert.deepEqual(out.blocks[0].referenced_blocks, ["block_verdict_read"]);
  assert.equal(out.blocks.length, 1, "only the requested block is embedded");

  nested.blocks[1].referenced_blocks = ["block_ghost"];
  assert.throws(() => compileBlock(nested, "block_second"), (e) => e.details.missing_refs[0] === "block_ghost");
});

check("unknown block / character / prop / location all throw", () => {
  assert.throws(() => compileBlock(project, "nope"), (e) => e instanceof CompilerError && e.details.known_ids.includes("block_verdict_read"));

  const ghostChar = structuredClone(project);
  ghostChar.blocks[0].present_characters[0].entity_ref = "char_ghost";
  assert.throws(() => compileBlock(ghostChar, "block_verdict_read"), /unknown character id "char_ghost"/);

  const ghostProp = structuredClone(project);
  ghostProp.blocks[0].present_props[0].entity_ref = "prop_ghost";
  assert.throws(() => compileBlock(ghostProp, "block_verdict_read"), /unknown prop id "prop_ghost"/);

  const ghostLoc = structuredClone(project);
  ghostLoc.blocks[0].location_ref = "loc_ghost";
  assert.throws(() => compileBlock(ghostLoc, "block_verdict_read"), /unknown location id "loc_ghost"/);
});

check("bad timeframe throws", () => {
  const broken = structuredClone(project);
  broken.blocks[0].timeframe = { start_sec: 6, end_sec: 6 };
  assert.throws(() => compileBlock(broken, "block_verdict_read"), /timeframe\.start_sec < end_sec/);
});

// ---------- unit: compilePayload (6.2 shape, kept for ComfyUI) ----------

check("compilePayload still flattens hydration + soundtrack into one prompt", () => {
  const p = compilePayload(project, "block_verdict_read");
  assert.equal(p.duration_sec, 6);
  assert.equal(p.lip_sync_enabled, true);
  assert.match(p.prompt, /^Judge Xu lifts the verdict document/);
  assert.match(p.prompt, /許法官 \(Judge Xu\) \(Late 50s, Sharp jawline/);
  assert.match(p.prompt, /Acoustic & Soundtrack Environment: Clean close-mic courtroom dialogue/);
  assert.equal(p.dialogue_script, "本庭判處被告有期徒刑十二年，褫奪公權五年。全案仍可上訴。");
});

check("compilePayload drops dialogue fields for a silent block", () => {
  const silent = structuredClone(project);
  silent.blocks[0].audio_control = {
    audio_mode: "vintage_film_room_tone",
    speech_present: false,
    lip_sync_enabled: false,
    soundtrack_specification: "Continuous 35mm film projector hiss."
  };
  const p = compilePayload(silent, "block_verdict_read");
  assert.equal("dialogue_script" in p, false);
  assert.equal("voice_prompt" in p, false);
});

// ---------- e2e: MCP over in-memory transport ----------

const server = createMcpServer();
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
const client = new Client({ name: "smoke", version: "0.0.0" });
await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

const { tools } = await client.listTools();
assert.deepEqual(tools.map((t) => t.name), ["compile_block"]);
assert.match(tools[0].description, /section 1\.4/);
console.log("ok  MCP exposes compile_block returning the 1.4 shape");

const res = await client.callTool({
  name: "compile_block",
  arguments: { project_file: PROJECT_FILE, block_id: "block_verdict_read" }
});
assert.equal(res.isError, undefined);
const viaMcp = JSON.parse(res.content[0].text);
assert.equal(viaMcp.blocks.length, 1);
assert.equal(viaMcp.entities.characters.length, 2);
assert.equal(viaMcp.project_file, undefined, "no extra top-level keys leak into the slice");
console.log("ok  compile_block over MCP with project_file");

const inline = await client.callTool({
  name: "compile_block",
  arguments: { project, block_id: "block_verdict_read" }
});
assert.deepEqual(JSON.parse(inline.content[0].text).blocks[0].timeframe, { start_sec: 0, end_sec: 6 });
console.log("ok  compile_block accepts an inline project object and resets the timeframe");

const bad = await client.callTool({ name: "compile_block", arguments: { project, block_id: "nope" } });
assert.equal(bad.isError, true);
assert.match(bad.content[0].text, /"error": "block id \\"nope\\" not found/);
console.log("ok  unknown block comes back as isError");

await client.close();
await server.close();

// ---------- e2e: real stdio entry point ----------

const { StdioClientTransport } = await import("@modelcontextprotocol/sdk/client/stdio.js");
const stdio = new Client({ name: "smoke-stdio", version: "0.0.0" });
await stdio.connect(new StdioClientTransport({ command: process.execPath, args: [resolve(HERE, "../mcp_server_stdio.mjs")] }));
const viaStdio = await stdio.callTool({
  name: "compile_block",
  arguments: { project_file: PROJECT_FILE, block_id: "block_verdict_read" }
});
assert.equal(JSON.parse(viaStdio.content[0].text).blocks[0].id, "block_verdict_read");
console.log("ok  stdio server answers compile_block");
await stdio.close();

console.log(`\n${pass + 5} checks passed`);
