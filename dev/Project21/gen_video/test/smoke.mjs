/**
 * Smoke test: section-1.4 project slice + section-6.2 payload, then end-to-end MCP calls.
 * Run: node test/smoke.mjs
 */

import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { createMcpServer } from "../mcp_core.mjs";
import { compileBlock, compilePayload, entityPrompt, CompilerError } from "../compiler.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT_FILE = resolve(HERE, "../../test_story1/block_01_verdict.json");
const REF_PROJECT_FILE = resolve(HERE, "../../test_story1/plan.ch04.json");
const project = JSON.parse(readFileSync(PROJECT_FILE, "utf8"));
const refProject = JSON.parse(readFileSync(REF_PROJECT_FILE, "utf8"));

// Fixture: reference.image is a FOLDER, because ComfyUI names its own output files, and the
// absolute base comes from metadata.json (machine path), not from the story JSON.
const PLATE_ROOT = mkdtempSync(join(tmpdir(), "video-compiler-plates-"));
const METADATA_FILE = join(PLATE_ROOT, "metadata.json");
process.env.VIDEO_COMPILER_METADATA = METADATA_FILE;

const OUTPUT_DIR = join(PLATE_ROOT, "comfyui-output");
const PLATE_PROJECT = join(PLATE_ROOT, "project.json");
const PLATE_DIR = join(OUTPUT_DIR, "refs", "char_one");
mkdirSync(PLATE_DIR, { recursive: true });
writeFileSync(join(PLATE_DIR, "ComfyUI_00007_.png"), "");
writeFileSync(
  PLATE_PROJECT,
  JSON.stringify({
    version: "1.12",
    project_title: "plate_fixture",
    entities: {
      characters: [{ id: "char_one", name: "One", reference: { image: "refs/char_one", status: "ready", prompt: "prompt one" } }],
      props: [],
      locations: []
    },
    blocks: []
  }),
  "utf8"
);

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

// ---------- unit: entityPrompt (r2v plate prompt) ----------

check("entityPrompt returns reference.prompt verbatim for a character", () => {
  const out = entityPrompt(refProject, "char_zhao_liting");
  const plan = refProject.entities.characters.find((c) => c.id === "char_zhao_liting");
  assert.equal(out.kind, "character");
  assert.equal(out.id, "char_zhao_liting");
  assert.equal(out.name, "趙立廷 (Zhao Liting)");
  assert.equal(out.prompt, plan.reference.prompt);
  assert.equal(out.prompt_source, "reference");
  assert.equal(out.reference.image, "refs/char_zhao_liting");
  assert.equal(out.reference.status, "to_generate");
  assert.equal("prompt_source" in out.reference, false, "prompt is not duplicated inside reference");
});

check("entityPrompt derives a portrait when the character has no reference", () => {
  const out = entityPrompt(project, "char_judge_xu");
  assert.equal(out.prompt_source, "identity_features");
  assert.equal("reference" in out, false);
  assert.match(out.prompt, /^Neutral front-facing portrait, East Asian \(Taiwanese\), Late 50s/);
  assert.match(out.prompt, /slicked-back black hair with silver streaks/);
  assert.match(out.prompt, /no text\.$/);
  assert.equal(out.attributes.age, "Late 50s");
});

check("entityPrompt derives prop and location plates from their own fields", () => {
  const prop = entityPrompt(project, "prop_verdict");
  assert.equal(prop.kind, "prop");
  assert.equal(prop.prompt_source, "appearance");
  assert.match(prop.prompt, /^Top-down plate of 判決書, Heavy official court document/);
  assert.match(prop.prompt, /no captions\.$/);
  assert.equal(prop.attributes.appearance.startsWith("Heavy official court document"), true);

  const loc = entityPrompt(project, "loc_courtroom");
  assert.equal(loc.kind, "location");
  assert.equal(loc.prompt_source, "description");
  assert.match(loc.prompt, /^Wide establishing plate of 肅穆法庭, Tall dark wooden judicial bench/);
  assert.match(loc.prompt, /16:9/);
});

check("entityPrompt keeps aliases and copies attributes", () => {
  const out = entityPrompt(refProject, "char_judge_xu");
  assert.deepEqual(out.aliases, ["許法官", "他"]);
  assert.match(out.attributes.traits, /^Late 50s/);
  out.attributes.traits = "changed";
  assert.match(refProject.entities.characters[0].traits, /^Late 50s/);
});

check("entityPrompt falls back to traits when a character has no identity_features", () => {
  const bare = structuredClone(refProject);
  delete bare.entities.characters[0].reference;
  delete bare.entities.characters[0].identity_features;
  const out = entityPrompt(bare, "char_judge_xu");
  assert.equal(out.prompt_source, "traits");
  assert.match(out.prompt, /^Neutral front-facing portrait, Late 50s, sharp jawline/);
});

check("entityPrompt rejects unknown or missing ids and lists what exists", () => {
  assert.throws(
    () => entityPrompt(project, "char_ghost"),
    (e) => e instanceof CompilerError && e.details.known_ids.includes("loc_courtroom") && e.details.known_ids.includes("prop_verdict")
  );
  assert.throws(() => entityPrompt(project, ""), /entity_id must be a non-empty string/);
});

// ---------- e2e: MCP over in-memory transport ----------

const server = createMcpServer();
const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
const client = new Client({ name: "smoke", version: "0.0.0" });
await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

const toolsList = await client.listTools();
const tools = toolsList.tools;
const toolsAll = tools.map((t) => t.name);
assert.deepEqual(toolsAll, ["compile_block", "entity_prompt", "metadata_get", "metadata_set"]);
assert.match(tools[0].description, /section 1\.4/);
assert.match(tools[1].description, /reference-image prompt/);
assert.match(tools[2].description, /comfyui\.output_dir/);
console.log("ok  MCP exposes compile_block, entity_prompt, metadata_get, metadata_set");

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

const ep = await client.callTool({
  name: "entity_prompt",
  arguments: { project_file: REF_PROJECT_FILE, entity_id: "char_judge_xu" }
});
assert.equal(ep.isError, undefined);
const entity = JSON.parse(ep.content[0].text);
assert.equal(entity.prompt_source, "reference");
assert.equal(entity.reference.image, "refs/char_judge_xu", "image is a folder, never a filename");
assert.deepEqual(entity.reference.images, [], "no plate generated yet");
assert.equal(entity.reference.image_exists, false);
assert.equal(entity.reference.image_dir_source, "project", "no metadata yet: relative to the project file");
assert.equal(entity.reference.image_dir, join(dirname(REF_PROJECT_FILE), "refs", "char_judge_xu"));
console.log("ok  without metadata the plate folder falls back to the project directory");

const metaBefore = JSON.parse((await client.callTool({ name: "metadata_get", arguments: {} })).content[0].text);
assert.equal(metaBefore.file, METADATA_FILE);
assert.equal(metaBefore.exists, false, "nothing configured yet");
assert.equal(metaBefore.comfyui_output_dir, null);
console.log("ok  metadata_get reports an unconfigured machine");

const setMeta = JSON.parse(
  (await client.callTool({ name: "metadata_set", arguments: { comfyui_output_dir: OUTPUT_DIR } })).content[0].text
);
assert.equal(setMeta.comfyui_output_dir, OUTPUT_DIR);
assert.equal(existsSync(OUTPUT_DIR), true, "the output folder is created");
console.log("ok  metadata_set stores comfyui.output_dir as an absolute path");

const withMeta = JSON.parse(
  (await client.callTool({ name: "entity_prompt", arguments: { project_file: REF_PROJECT_FILE, entity_id: "char_judge_xu" } })).content[0].text
);
assert.equal(withMeta.reference.image_dir_source, "metadata");
assert.equal(withMeta.reference.image_dir, join(OUTPUT_DIR, "refs", "char_judge_xu"));
assert.deepEqual(withMeta.reference.images, []);
console.log("ok  entity_prompt computes image_dir as output_dir + reference.image");

const plate = JSON.parse(
  (await client.callTool({ name: "entity_prompt", arguments: { project_file: PLATE_PROJECT, entity_id: "char_one" } })).content[0].text
);
assert.deepEqual(plate.reference.images, ["ComfyUI_00007_.png"], "picks up whatever ComfyUI named the file");
assert.equal(plate.reference.image_exists, true);
assert.equal(plate.reference.image_dir, PLATE_DIR);
console.log("ok  entity_prompt lists the plates ComfyUI left in the folder");

const relativeMeta = await client.callTool({ name: "metadata_set", arguments: { comfyui_output_dir: "refs/relative" } });
assert.equal(relativeMeta.isError, true);
assert.match(relativeMeta.content[0].text, /must be an absolute path/);
console.log("ok  metadata_set rejects a relative output folder");

const inlineRef = structuredClone(refProject);
inlineRef.entities.characters[0].reference.image = "refs/char_judge_xu/ComfyUI_1_.png";
const metadataDir = join(OUTPUT_DIR, "refs", "char_judge_xu");
mkdirSync(metadataDir, { recursive: true });
writeFileSync(join(metadataDir, "ComfyUI_1_.png"), "");
const legacyOut = JSON.parse(
  (await client.callTool({ name: "entity_prompt", arguments: { project: inlineRef, entity_id: "char_judge_xu" } })).content[0].text
);
assert.equal(legacyOut.reference.image_dir_source, "metadata", "metadata anchors even an inline project");
assert.equal(legacyOut.reference.image_dir, metadataDir, "a file-valued legacy reference falls back to its folder");
assert.deepEqual(legacyOut.reference.images, ["ComfyUI_1_.png"]);
console.log("ok  metadata anchors inline projects and legacy file paths resolve to their folder");

const cleared = JSON.parse(
  (await client.callTool({ name: "metadata_set", arguments: { comfyui_output_dir: null } })).content[0].text
);
assert.equal(cleared.comfyui_output_dir, null);

const noBase = JSON.parse(
  (await client.callTool({ name: "entity_prompt", arguments: { project: inlineRef, entity_id: "char_judge_xu" } })).content[0].text
);
assert.equal("image_dir" in noBase.reference, false, "inline project + no metadata: nothing to anchor to");
console.log("ok  metadata_set null clears the output folder");

const noCheck = await client.callTool({
  name: "entity_prompt",
  arguments: { project_file: REF_PROJECT_FILE, entity_id: "char_judge_xu", check_image: false }
});
assert.equal("image_exists" in JSON.parse(noCheck.content[0].text).reference, false);
console.log("ok  entity_prompt check_image=false skips the disk lookup");

const epBad = await client.callTool({ name: "entity_prompt", arguments: { project, entity_id: "char_ghost" } });
assert.equal(epBad.isError, true);
assert.match(epBad.content[0].text, /unknown entity id/);
assert.match(epBad.content[0].text, /known_ids/);
console.log("ok  unknown entity comes back as isError with known_ids");

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

const stdioEntity = await stdio.callTool({
  name: "entity_prompt",
  arguments: { project_file: REF_PROJECT_FILE, entity_id: "loc_courtroom" }
});
assert.equal(JSON.parse(stdioEntity.content[0].text).reference.image_dir.endsWith(join("refs", "loc_courtroom")), true);
console.log("ok  stdio server answers entity_prompt");
await stdio.close();

rmSync(PLATE_ROOT, { recursive: true, force: true });

console.log(`\n${pass + 16} checks passed`);
