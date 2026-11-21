import { RGBA, colorDistanceSq, colorsEqual } from "./color.js";
import { PixelCanvas } from "./pixelCanvas.js";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropResult {
  canvas: PixelCanvas;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Nearest-neighbour resize: no blending, no blur (pixel-art safe). */
export function resizeNearest(source: PixelCanvas, width: number, height: number): PixelCanvas {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    throw new Error(`Invalid target size ${width}x${height}.`);
  }
  const target = new PixelCanvas(width, height);
  const src = source.data;
  const dst = target.data;
  const sw = source.width;
  const sh = source.height;

  for (let y = 0; y < height; y++) {
    const sy = Math.min(sh - 1, Math.floor((y * sh) / height));
    const srcRow = sy * sw * 4;
    const dstRow = y * width * 4;
    for (let x = 0; x < width; x++) {
      const sx = Math.min(sw - 1, Math.floor((x * sw) / width));
      const si = srcRow + sx * 4;
      const di = dstRow + x * 4;
      dst[di] = src[si]!;
      dst[di + 1] = src[si + 1]!;
      dst[di + 2] = src[si + 2]!;
      dst[di + 3] = src[si + 3]!;
    }
  }
  return target;
}

export function flipHorizontal(canvas: PixelCanvas): void {
  const { width, height, data } = canvas;
  const tmp = new Uint8ClampedArray(4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < Math.floor(width / 2); x++) {
      const left = (y * width + x) * 4;
      const right = (y * width + (width - 1 - x)) * 4;
      for (let c = 0; c < 4; c++) {
        tmp[c] = data[left + c]!;
        data[left + c] = data[right + c]!;
        data[right + c] = tmp[c]!;
      }
    }
  }
}

export function flipVertical(canvas: PixelCanvas): void {
  const { width, height, data } = canvas;
  const rowBytes = width * 4;
  const tmp = new Uint8ClampedArray(rowBytes);
  for (let y = 0; y < Math.floor(height / 2); y++) {
    const top = y * rowBytes;
    const bottom = (height - 1 - y) * rowBytes;
    tmp.set(data.subarray(top, top + rowBytes));
    data.copyWithin(top, bottom, bottom + rowBytes);
    data.set(tmp, bottom);
  }
}

/** Rotate clockwise by 90, 180 or 270 degrees (mutates the canvas). */
export function rotate(canvas: PixelCanvas, degrees: 90 | 180 | 270): void {
  const turns = degrees / 90;
  for (let turn = 0; turn < turns; turn++) {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    const oldData = canvas.data;
    const newWidth = oldHeight;
    const newHeight = oldWidth;
    const newData = new Uint8ClampedArray(newWidth * newHeight * 4);

    for (let y = 0; y < oldHeight; y++) {
      for (let x = 0; x < oldWidth; x++) {
        const newX = oldHeight - 1 - y;
        const newY = x;
        const si = (y * oldWidth + x) * 4;
        const di = (newY * newWidth + newX) * 4;
        newData[di] = oldData[si]!;
        newData[di + 1] = oldData[si + 1]!;
        newData[di + 2] = oldData[si + 2]!;
        newData[di + 3] = oldData[si + 3]!;
      }
    }
    canvas.restoreState(newWidth, newHeight, newData);
  }
}

/**
 * Add a 1px outline around opaque pixels, writing only into fully transparent
 * pixels. Call repeatedly for thicker outlines. Returns the number of pixels drawn.
 */
export function outline(canvas: PixelCanvas, color: RGBA, diagonal = true): number {
  const { width, height, data } = canvas;
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3]!;

  const neighbours = diagonal
    ? [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
      ]
    : [
        [0, -1],
        [-1, 0],
        [1, 0],
        [0, 1],
      ];

  let drawn = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (alpha[index] !== 0) continue;
      let touchesOpaque = false;
      for (const [dx, dy] of neighbours) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        if (alpha[ny * width + nx]! > 0) {
          touchesOpaque = true;
          break;
        }
      }
      if (!touchesOpaque) continue;
      const byte = index * 4;
      data[byte] = color[0];
      data[byte + 1] = color[1];
      data[byte + 2] = color[2];
      data[byte + 3] = color[3];
      drawn++;
    }
  }
  return drawn;
}

/** Replace every pixel matching `from` (per-channel tolerance) with `to`. */
export function replaceColor(canvas: PixelCanvas, from: RGBA, to: RGBA, tolerance = 0): number {
  const { data } = canvas;
  let replaced = 0;
  for (let i = 0; i < data.length; i += 4) {
    const pixel: RGBA = [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!];
    if (!colorsEqual(pixel, from, tolerance)) continue;
    data[i] = to[0];
    data[i + 1] = to[1];
    data[i + 2] = to[2];
    data[i + 3] = to[3];
    replaced++;
  }
  return replaced;
}

/**
 * Quantize opaque pixels to the nearest palette color (RGB distance).
 * Alpha is preserved so transparent backgrounds stay transparent.
 */
export function applyPalette(canvas: PixelCanvas, colors: RGBA[]): number {
  if (colors.length === 0) throw new Error("apply_palette needs at least one color.");
  const { data } = canvas;
  let changed = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = data[i]!;
    const g = data[i + 1]!;
    const b = data[i + 2]!;
    let best = 0;
    let bestDistance = Infinity;
    for (let p = 0; p < colors.length; p++) {
      const distance = colorDistanceSq(r, g, b, colors[p]!);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = p;
      }
    }
    const target = colors[best]!;
    if (data[i] === target[0] && data[i + 1] === target[1] && data[i + 2] === target[2]) continue;
    data[i] = target[0];
    data[i + 1] = target[1];
    data[i + 2] = target[2];
    changed++;
  }
  return changed;
}

/** Crop to the intersection of the requested rect and the canvas. */
export function crop(canvas: PixelCanvas, rect: Rect): CropResult {
  const x0 = Math.max(0, Math.floor(rect.x));
  const y0 = Math.max(0, Math.floor(rect.y));
  const x1 = Math.min(canvas.width, Math.ceil(rect.x + rect.width));
  const y1 = Math.min(canvas.height, Math.ceil(rect.y + rect.height));
  if (x1 <= x0 || y1 <= y0) {
    throw new Error(
      `Crop region (${rect.x},${rect.y} ${rect.width}x${rect.height}) does not overlap the ${canvas.width}x${canvas.height} canvas.`,
    );
  }
  const width = x1 - x0;
  const height = y1 - y0;
  const target = new PixelCanvas(width, height);
  const src = canvas.data;
  const dst = target.data;
  for (let y = 0; y < height; y++) {
    const srcStart = ((y0 + y) * canvas.width + x0) * 4;
    const dstStart = y * width * 4;
    dst.set(src.subarray(srcStart, srcStart + width * 4), dstStart);
  }
  return { canvas: target, x: x0, y: y0, width, height };
}

/**
 * Copy a region of the canvas onto another position, optionally flipping it.
 * The source is snapshotted first, so overlapping source/destination is safe.
 */
export function copyPaste(
  canvas: PixelCanvas,
  rect: Rect,
  dstX: number,
  dstY: number,
  flipH = false,
  flipV = false,
): { copied: number; skipped: number } {
  const snapshot = canvas.cloneData();
  const x0 = Math.max(0, Math.floor(rect.x));
  const y0 = Math.max(0, Math.floor(rect.y));
  const x1 = Math.min(canvas.width, Math.ceil(rect.x + rect.width));
  const y1 = Math.min(canvas.height, Math.ceil(rect.y + rect.height));
  let copied = 0;
  let skipped = 0;

  for (let sy = y0; sy < y1; sy++) {
    for (let sx = x0; sx < x1; sx++) {
      const localX = sx - Math.floor(rect.x);
      const localY = sy - Math.floor(rect.y);
      const finalX = flipH ? Math.floor(rect.width) - 1 - localX : localX;
      const finalY = flipV ? Math.floor(rect.height) - 1 - localY : localY;
      const dx = Math.floor(dstX) + finalX;
      const dy = Math.floor(dstY) + finalY;
      if (!canvas.inBounds(dx, dy)) {
        skipped++;
        continue;
      }
      const si = (sy * canvas.width + sx) * 4;
      const di = (dy * canvas.width + dx) * 4;
      canvas.data[di] = snapshot[si]!;
      canvas.data[di + 1] = snapshot[si + 1]!;
      canvas.data[di + 2] = snapshot[si + 2]!;
      canvas.data[di + 3] = snapshot[si + 3]!;
      copied++;
    }
  }
  return { copied, skipped };
}
