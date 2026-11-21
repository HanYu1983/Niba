import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { PNG } from "pngjs";
import { PixelCanvas } from "../core/pixelCanvas.js";
import { resizeNearest } from "../core/transforms.js";

export function encodePNG(canvas: PixelCanvas): Buffer {
  const png = new PNG({ width: canvas.width, height: canvas.height });
  png.data = Buffer.from(canvas.data.buffer, canvas.data.byteOffset, canvas.data.byteLength);
  return PNG.sync.write(png, { colorType: 6, inputColorType: 6 });
}

export interface PreviewResult {
  png: Buffer;
  width: number;
  height: number;
  scaleFactor: number;
}

/** Downscale (nearest neighbour) so the longest side fits within maxSize. */
export function makePreview(canvas: PixelCanvas, maxSize: number): PreviewResult {
  const longest = Math.max(canvas.width, canvas.height);
  const factor = Math.max(1, Math.ceil(longest / Math.max(1, maxSize)));
  const width = Math.max(1, Math.round(canvas.width / factor));
  const height = Math.max(1, Math.round(canvas.height / factor));
  const scaled = factor === 1 ? canvas : resizeNearest(canvas, width, height);
  return { png: encodePNG(scaled), width, height, scaleFactor: factor };
}

export async function writePNGFile(path: string, png: Buffer): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, png);
}
