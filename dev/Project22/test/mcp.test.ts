import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, readdir, rm, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createPixelStudioServer } from "../src/server.js";

function textMeta(result: any): any {
  const item = (result.content ?? []).find((entry: any) => entry.type === "text");
  assert.ok(item, "expected a text content block");
  return JSON.parse(item.text);
}

function hasImage(result: any): boolean {
  return (result.content ?? []).some((entry: any) => entry.type === "image" && entry.mimeType === "image/png");
}

test("pixel studio MCP server end-to-end", async (t) => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createPixelStudioServer();
  await server.connect(serverTransport);

  const client = new Client({ name: "pixel-studio-test", version: "1.0.0" });
  await client.connect(clientTransport);

  const exportedPath = join(tmpdir(), `pixel-studio-test-${process.pid}-${Date.now()}.png`);
  t.after(async () => {
    if (existsSync(exportedPath)) await unlink(exportedPath);
    await client.close().catch(() => {});
    await server.close().catch(() => {});
  });

  const toolList = await client.listTools();
  const names = toolList.tools.map((tool) => tool.name);
  for (const expected of [
    "create_canvas",
    "list_canvases",
    "get_info",
    "draw_pixels",
    "draw_shape",
    "transform_canvas",
    "get_pixels",
    "undo",
    "redo",
    "export_image",
    "view_image",
  ]) {
    assert.ok(names.includes(expected), `missing tool ${expected}`);
  }

  const created = await client.callTool({
    name: "create_canvas",
    arguments: {
      width: 16,
      height: 16,
      bg_color: "#ffffff",
      palette: { skin: "#ffcd75", ink: "#1a1c2c" },
      preview: true,
    },
  });
  assert.equal(created.isError, undefined);
  const createdMeta = textMeta(created);
  assert.equal(createdMeta.width, 16);
  assert.equal(createdMeta.version, 1);
  assert.deepEqual(createdMeta.palette.sort(), ["ink", "skin"]);
  assert.ok(hasImage(created), "create_canvas preview should return an image");
  assert.ok(existsSync(createdMeta.previewPath));
  const imageId = createdMeta.imageId as string;
  assert.match(imageId, /^img_[0-9a-f]{8}$/);

  const listing = await client.callTool({ name: "list_canvases", arguments: {} });
  assert.equal(textMeta(listing).count, 1);

  const drawn = await client.callTool({
    name: "draw_pixels",
    arguments: {
      image_id: imageId,
      ascii: {
        rows: ["XX.", "XXX"],
        legend: { X: "skin", ".": "transparent" },
        x: 2,
        y: 2,
      },
    },
  });
  const drawnMeta = textMeta(drawn);
  assert.equal(drawnMeta.drawn, 5);
  assert.equal(drawnMeta.version, 2);
  assert.equal(drawnMeta.skippedOutOfBounds, 0);

  const readBack = await client.callTool({
    name: "get_pixels",
    arguments: { image_id: imageId, x: 2, y: 2, width: 3, height: 2 },
  });
  const readMeta = textMeta(readBack);
  assert.deepEqual(readMeta.bbox, { x: 2, y: 2, width: 3, height: 2 });
  assert.equal(readMeta.transparentChar, ".");
  assert.deepEqual(readMeta.rows, ["001", "000"]);
  assert.equal(readMeta.legend["0"], "#FFCD75");
  assert.equal(readMeta.legend["1"], "#FFFFFF");
  assert.equal(readMeta.distinctColors, 2);

  const shaped = await client.callTool({
    name: "draw_shape",
    arguments: {
      image_id: imageId,
      shape: { kind: "line", x0: 0, y0: 15, x1: 15, y1: 0, color: "ink" },
    },
  });
  assert.equal(textMeta(shaped).version, 3);

  const transformed = await client.callTool({
    name: "transform_canvas",
    arguments: { image_id: imageId, ops: [{ op: "scale_nearest", factor: 2 }] },
  });
  const transformedMeta = textMeta(transformed);
  assert.equal(transformedMeta.width, 32);
  assert.equal(transformedMeta.height, 32);
  assert.equal(transformedMeta.version, 4);

  const undone = await client.callTool({ name: "undo", arguments: { image_id: imageId } });
  assert.equal(textMeta(undone).width, 16);
  assert.equal(textMeta(undone).version, 3);

  const redone = await client.callTool({ name: "redo", arguments: { image_id: imageId } });
  assert.equal(textMeta(redone).width, 32);
  assert.equal(textMeta(redone).version, 4);

  const viewed = await client.callTool({
    name: "view_image",
    arguments: { image_id: imageId, max_size: 64 },
  });
  assert.ok(hasImage(viewed));
  assert.ok(existsSync(textMeta(viewed).previewPath));

  const exported = await client.callTool({
    name: "export_image",
    arguments: { image_id: imageId, path: exportedPath },
  });
  const exportMeta = textMeta(exported);
  assert.equal(exportMeta.path, exportedPath);
  assert.equal(exportMeta.width, 32);
  assert.ok(exportMeta.bytes > 0);
  const png = await readFile(exportedPath);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);

  const badColor = await client.callTool({
    name: "draw_pixels",
    arguments: { image_id: imageId, pixels: [{ x: 0, y: 0, color: "not-a-color" }] },
  });
  assert.equal(badColor.isError, true);

  const badCanvas = await client.callTool({
    name: "get_info",
    arguments: { image_id: "img_deadbeef" },
  });
  assert.equal(badCanvas.isError, true);
});

test("animation tools: frames, shift_rect, contact sheet and exports", async (t) => {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createPixelStudioServer();
  await server.connect(serverTransport);

  const client = new Client({ name: "pixel-studio-animation-test", version: "1.0.0" });
  await client.connect(clientTransport);

  const stamp = `${process.pid}-${Date.now()}`;
  const sheetPath = join(tmpdir(), `pixel-anim-sheet-${stamp}.png`);
  const gifPath = join(tmpdir(), `pixel-anim-${stamp}.gif`);
  const apngPath = join(tmpdir(), `pixel-anim-${stamp}.apng`);
  const framesDir = join(tmpdir(), `pixel-anim-frames-${stamp}`);
  t.after(async () => {
    for (const path of [sheetPath, gifPath, apngPath]) {
      if (existsSync(path)) await unlink(path);
    }
    await rm(framesDir, { recursive: true, force: true });
    await client.close().catch(() => {});
    await server.close().catch(() => {});
  });

  const names = (await client.listTools()).tools.map((tool) => tool.name);
  for (const expected of [
    "add_frame",
    "clone_frame",
    "select_frame",
    "shift_rect",
    "render_contact_sheet",
    "export_animation",
  ]) {
    assert.ok(names.includes(expected), `missing tool ${expected}`);
  }

  const created = await client.callTool({
    name: "create_canvas",
    arguments: { width: 8, height: 8, palette: { skin: "#ffcd75", ink: "#1a1c2c" } },
  });
  const imageId = textMeta(created).imageId as string;
  assert.equal(textMeta(created).frameCount, 1);

  const leg = await client.callTool({
    name: "draw_shape",
    arguments: {
      image_id: imageId,
      shape: { kind: "rect", x: 3, y: 5, width: 2, height: 2, color: "skin", fill: true },
    },
  });
  assert.equal(textMeta(leg).result.drawn, 4);

  const cloned = await client.callTool({
    name: "clone_frame",
    arguments: { image_id: imageId },
  });
  const clonedMeta = textMeta(cloned);
  assert.equal(clonedMeta.frameCount, 2);
  assert.equal(clonedMeta.activeFrame, 1);
  assert.equal(clonedMeta.frames[1].active, true);

  const shifted = await client.callTool({
    name: "shift_rect",
    arguments: { image_id: imageId, x: 3, y: 5, width: 2, height: 2, dx: 1, dy: 0 },
  });
  const shiftMeta = textMeta(shifted);
  assert.equal(shiftMeta.moved, 4);
  assert.equal(shiftMeta.cleared, 4);

  const added = await client.callTool({
    name: "add_frame",
    arguments: { image_id: imageId, duration_ms: 80 },
  });
  assert.equal(textMeta(added).frameCount, 3);
  assert.equal(textMeta(added).durationMs, 80);

  const beforeSelect = textMeta(added).version as number;
  const selected = await client.callTool({
    name: "select_frame",
    arguments: { image_id: imageId, index: 0 },
  });
  const selectMeta = textMeta(selected);
  assert.equal(selectMeta.activeFrame, 0);
  assert.equal(selectMeta.version, beforeSelect, "frame switching should not create an undo step");

  const info = await client.callTool({ name: "get_info", arguments: { image_id: imageId } });
  const infoMeta = textMeta(info);
  assert.equal(infoMeta.frames.length, 3);
  assert.equal(infoMeta.totalDurationMs, 100 + 100 + 80);

  const sheet = await client.callTool({
    name: "render_contact_sheet",
    arguments: { image_id: imageId, onion_skin: true },
  });
  const sheetMeta = textMeta(sheet);
  assert.ok(hasImage(sheet), "contact sheet should return an image");
  assert.equal(sheetMeta.layout.columns, 3);
  assert.ok(existsSync(sheetMeta.previewPath));

  const asciiSheet = await client.callTool({
    name: "get_pixels",
    arguments: { image_id: imageId, x: 3, y: 5, width: 4, height: 2 },
  });
  assert.equal(textMeta(asciiSheet).distinctColors, 1);

  const spriteSheet = await client.callTool({
    name: "export_animation",
    arguments: { image_id: imageId, format: "sprite_sheet", path: sheetPath, columns: 3, gap: 1, scale: 2 },
  });
  const spriteMeta = textMeta(spriteSheet);
  assert.equal(spriteMeta.sheetWidth, 3 * 16 + 2);
  assert.equal(spriteMeta.sheetHeight, 16);
  assert.deepEqual([...(await readFile(sheetPath)).subarray(0, 4)], [137, 80, 78, 71]);

  const gif = await client.callTool({
    name: "export_animation",
    arguments: { image_id: imageId, format: "gif", path: gifPath, scale: 4 },
  });
  assert.equal(textMeta(gif).bytes > 0, true);
  const gifBytes = await readFile(gifPath);
  assert.equal(gifBytes.toString("latin1", 0, 6), "GIF89a");

  const apng = await client.callTool({
    name: "export_animation",
    arguments: { image_id: imageId, format: "apng", path: apngPath },
  });
  assert.ok(textMeta(apng).bytes > 0);
  assert.ok((await readFile(apngPath)).toString("latin1").includes("acTL"));

  const sequence = await client.callTool({
    name: "export_animation",
    arguments: { image_id: imageId, format: "frames", path: framesDir },
  });
  const sequenceMeta = textMeta(sequence);
  assert.equal(sequenceMeta.files.length, 3);
  assert.deepEqual((await readdir(framesDir)).sort(), ["frame_00.png", "frame_01.png", "frame_02.png"]);

  const singleFrame = await client.callTool({
    name: "export_image",
    arguments: { image_id: imageId, frame: 1, path: `${sheetPath}.frame1.png` },
  });
  assert.equal(textMeta(singleFrame).frame, 1);
  await unlink(`${sheetPath}.frame1.png`);

  const badFrame = await client.callTool({
    name: "select_frame",
    arguments: { image_id: imageId, index: 9 },
  });
  assert.equal(badFrame.isError, true);
});
