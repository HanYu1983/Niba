import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, unlink } from "node:fs/promises";
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
