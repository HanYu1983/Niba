import assert from "node:assert/strict";
import test from "node:test";
import { parseColor, rgbaToHex } from "../src/core/color.js";
import { PixelCanvas } from "../src/core/pixelCanvas.js";
import {
  applyPalette,
  copyPaste,
  crop,
  flipHorizontal,
  flipVertical,
  outline,
  replaceColor,
  resizeNearest,
  rotate,
} from "../src/core/transforms.js";
import { CanvasStore } from "../src/store/canvasStore.js";

const RED = [255, 0, 0, 255] as const;
const BLUE = [0, 0, 255, 255] as const;
const TRANSPARENT = [0, 0, 0, 0] as const;

test("color parsing supports hex, functional, arrays, objects and palettes", () => {
  assert.deepEqual(parseColor("#f00"), [255, 0, 0, 255]);
  assert.deepEqual(parseColor("#ff000080"), [255, 0, 0, 128]);
  assert.deepEqual(parseColor("rgba(0, 0, 255, 0.5)"), [0, 0, 255, 128]);
  assert.deepEqual(parseColor([1, 2, 3]), [1, 2, 3, 255]);
  assert.deepEqual(parseColor({ r: 1, g: 2, b: 3, a: 4 }), [1, 2, 3, 4]);
  assert.deepEqual(parseColor("skin", new Map([["skin", [255, 205, 117, 255] as [number, number, number, number]]])), [
    255,
    205,
    117,
    255,
  ]);
  assert.deepEqual(parseColor("transparent"), [0, 0, 0, 0]);
  assert.equal(rgbaToHex([255, 0, 0, 255]), "#FF0000");
  assert.equal(rgbaToHex([255, 0, 0, 128]), "#FF000080");
  assert.throws(() => parseColor("#12"), /Invalid hex/);
  assert.throws(() => parseColor("not-a-color"), /Unknown color/);
});

test("drawLine draws inclusive endpoints and skips out-of-bounds pixels", () => {
  const canvas = new PixelCanvas(8, 8);
  const result = canvas.drawLine(0, 0, 7, 7, [...RED]);
  assert.equal(result.drawn, 8);
  assert.equal(result.skipped, 0);
  assert.deepEqual(canvas.getPixel(7, 7), [...RED]);

  const clipped = canvas.drawLine(-2, 0, 2, 0, [...BLUE]);
  assert.equal(clipped.drawn, 3);
  assert.equal(clipped.skipped, 2);
});

test("drawRect outline leaves the interior untouched, fill covers it", () => {
  const canvas = new PixelCanvas(6, 6);
  canvas.drawRect(1, 1, 4, 4, [...RED], false, 1);
  assert.deepEqual(canvas.getPixel(1, 1), [...RED]);
  assert.deepEqual(canvas.getPixel(2, 2), [...TRANSPARENT]);

  canvas.drawRect(1, 1, 4, 4, [...BLUE], true);
  assert.deepEqual(canvas.getPixel(2, 2), [...BLUE]);
});

test("drawCircle fills the disc and clips to the canvas", () => {
  const canvas = new PixelCanvas(11, 11);
  canvas.drawCircle(5, 5, 4, [...RED], { fill: true });
  assert.deepEqual(canvas.getPixel(5, 5), [...RED]);
  assert.deepEqual(canvas.getPixel(5, 9), [...RED]);
  assert.deepEqual(canvas.getPixel(0, 0), [...TRANSPARENT]);

  const clipped = new PixelCanvas(5, 5);
  const result = clipped.drawCircle(0, 0, 10, [...BLUE], { fill: true });
  assert.ok(result.drawn > 0);
  assert.ok(result.skipped > 0);
});

test("floodFill respects borders and survives large canvases", () => {
  const canvas = new PixelCanvas(32, 32);
  canvas.drawRect(0, 0, 32, 32, [...BLUE], false, 1);
  const filled = canvas.floodFill(1, 1, [...RED]);
  assert.equal(filled, 30 * 30);
  assert.deepEqual(canvas.getPixel(15, 15), [...RED]);
  assert.deepEqual(canvas.getPixel(0, 0), [...BLUE]);
  assert.equal(canvas.floodFill(1, 1, [...RED]), 0);

  const big = new PixelCanvas(512, 512);
  assert.equal(big.floodFill(0, 0, [...BLUE]), 512 * 512);
});

test("drawAscii paints sprites and rejects unknown characters without mutating", () => {
  const canvas = new PixelCanvas(5, 5);
  const result = canvas.drawAscii(
    ["XX", "X."],
    new Map([
      ["X", [...RED] as [number, number, number, number]],
      [".", null],
    ]),
    1,
    1,
  );
  assert.equal(result.drawn, 3);
  assert.deepEqual(canvas.getPixel(1, 1), [...RED]);
  assert.deepEqual(canvas.getPixel(3, 2), [...TRANSPARENT]);

  const before = canvas.cloneData();
  assert.throws(
    () => canvas.drawAscii(["XO"], new Map([["X", [...RED] as [number, number, number, number]]])),
    /Unknown ASCII/,
  );
  assert.deepEqual(canvas.cloneData(), before);
});

test("outline adds a 1px border around opaque pixels only", () => {
  const canvas = new PixelCanvas(5, 5);
  canvas.setPixel(2, 2, [...RED]);
  const drawn = outline(canvas, [...BLUE], true);
  assert.equal(drawn, 8);
  assert.deepEqual(canvas.getPixel(1, 1), [...BLUE]);
  assert.deepEqual(canvas.getPixel(2, 2), [...RED]);
  assert.deepEqual(canvas.getPixel(0, 0), [...TRANSPARENT]);
});

test("replaceColor and applyPalette rewrite pixels", () => {
  const canvas = new PixelCanvas(2, 1);
  canvas.setPixel(0, 0, [255, 0, 0, 255]);
  canvas.setPixel(1, 0, [100, 0, 0, 255]);
  assert.equal(replaceColor(canvas, [255, 0, 0, 255], [...BLUE]), 1);
  assert.deepEqual(canvas.getPixel(0, 0), [...BLUE]);

  const changed = applyPalette(canvas, [
    [0, 0, 255, 255],
    [255, 0, 0, 255],
  ]);
  assert.equal(changed, 1);
  assert.deepEqual(canvas.getPixel(1, 0), [...RED]);
});

test("resizeNearest, flips and rotation keep pixels hard-edged", () => {
  const source = new PixelCanvas(2, 2);
  source.setPixel(0, 0, [...RED]);
  source.setPixel(1, 1, [...BLUE]);

  const scaled = resizeNearest(source, 4, 4);
  assert.deepEqual(scaled.getPixel(1, 1), [...RED]);
  assert.deepEqual(scaled.getPixel(2, 2), [...BLUE]);
  assert.deepEqual(scaled.getPixel(0, 0), [...RED]);

  const row = new PixelCanvas(2, 1);
  row.setPixel(0, 0, [...RED]);
  row.setPixel(1, 0, [...BLUE]);
  flipHorizontal(row);
  assert.deepEqual(row.getPixel(0, 0), [...BLUE]);
  flipVertical(row);
  assert.deepEqual(row.getPixel(0, 0), [...BLUE]);
  rotate(row, 90);
  assert.equal(row.width, 1);
  assert.equal(row.height, 2);
  assert.deepEqual(row.getPixel(0, 0), [...BLUE]);
  assert.deepEqual(row.getPixel(0, 1), [...RED]);
});

test("crop and copyPaste work with flips and overlap", () => {
  const canvas = new PixelCanvas(4, 4);
  canvas.setPixel(0, 0, [...RED]);
  canvas.setPixel(1, 0, [...BLUE]);

  const cropped = crop(canvas, { x: 1, y: 0, width: 2, height: 2 });
  assert.equal(cropped.canvas.width, 2);
  assert.deepEqual(cropped.canvas.getPixel(0, 0), [...BLUE]);

  const result = copyPaste(canvas, { x: 0, y: 0, width: 2, height: 1 }, 2, 3, true, false);
  assert.equal(result.copied, 2);
  assert.deepEqual(canvas.getPixel(2, 3), [...BLUE]);
  assert.deepEqual(canvas.getPixel(3, 3), [...RED]);
});

test("store tracks versions, undo/redo and rolls back failed mutations", () => {
  const store = new CanvasStore();
  const record = store.create(4, 4, [255, 0, 0, 255], new Map(), {});
  assert.equal(record.version, 1);

  const first = store.mutate(record.id, "dot", (rec) => rec.canvas.setPixel(0, 0, [...BLUE]));
  assert.equal(first.record.version, 2);
  assert.deepEqual(first.record.canvas.getPixel(0, 0), [...BLUE]);

  const undone = store.undo(record.id);
  assert.equal(undone.record.version, 1);
  assert.deepEqual(undone.record.canvas.getPixel(0, 0), [...RED]);

  const redone = store.redo(record.id);
  assert.equal(redone.record.version, 2);
  assert.deepEqual(redone.record.canvas.getPixel(0, 0), [...BLUE]);

  const resized = store.mutate(record.id, "resize", (rec) => {
    rec.canvas = resizeNearest(rec.canvas, 8, 8);
  });
  assert.equal(resized.record.canvas.width, 8);
  const afterUndo = store.undo(record.id);
  assert.equal(afterUndo.record.canvas.width, 4);

  const before = record.canvas.cloneData();
  assert.throws(
    () =>
      store.mutate(record.id, "boom", (rec) => {
        rec.canvas.setPixel(1, 1, [...BLUE]);
        throw new Error("boom");
      }),
    /boom/,
  );
  assert.deepEqual(record.canvas.cloneData(), before);
  assert.equal(record.version, 2);
});
