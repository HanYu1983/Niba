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

/**
 * Fit a canvas into `maxSize` with nearest-neighbour scaling in both directions.
 * Small sprites are upscaled (integer factor, capped at 16x) so they stay legible.
 */
export function makePreview(canvas: PixelCanvas, maxSize: number): PreviewResult {
  const limit = Math.max(1, maxSize);
  const longest = Math.max(canvas.width, canvas.height);
  let width: number;
  let height: number;
  let scaleFactor: number;
  let scaled: PixelCanvas;

  if (longest > limit) {
    const divisor = Math.ceil(longest / limit);
    width = Math.max(1, Math.round(canvas.width / divisor));
    height = Math.max(1, Math.round(canvas.height / divisor));
    scaleFactor = 1 / divisor;
    scaled = resizeNearest(canvas, width, height);
  } else {
    const up = Math.min(16, Math.max(1, Math.floor(limit / longest)));
    width = canvas.width * up;
    height = canvas.height * up;
    scaleFactor = up;
    scaled = up === 1 ? canvas : resizeNearest(canvas, width, height);
  }

  return { png: encodePNG(scaled), width, height, scaleFactor };
}

export async function writePNGFile(path: string, png: Buffer): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, png);
}

export async function writeFileBuffer(path: string, data: Buffer): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, data);
}
