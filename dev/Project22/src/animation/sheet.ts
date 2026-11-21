import { RGBA } from "../core/color.js";
import { PixelCanvas } from "../core/pixelCanvas.js";
import { blendCanvas, checkerboard, resizeNearest } from "../core/transforms.js";

export interface SheetFrame {
  canvas: PixelCanvas;
  durationMs: number;
}

export interface SheetOptions {
  columns?: number;
  scale?: number;
  gap?: number;
  background?: RGBA | "checker";
  onionSkin?: boolean;
  onionOpacity?: number;
  checkerCell?: number;
}

export interface SheetCell {
  index: number;
  x: number;
  y: number;
}

export interface SheetLayout {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
  scale: number;
  width: number;
  height: number;
}

export interface SheetResult {
  canvas: PixelCanvas;
  layout: SheetLayout;
  cells: SheetCell[];
}

export const MAX_SHEET_SIDE = 4096;

/** Lay frames out on a grid, optionally ghosting the previous frame under each cell. */
export function buildSheet(frames: SheetFrame[], options: SheetOptions = {}): SheetResult {
  if (frames.length === 0) throw new Error("A sheet needs at least one frame.");

  const frameWidth = frames[0]!.canvas.width;
  const frameHeight = frames[0]!.canvas.height;
  for (let i = 1; i < frames.length; i++) {
    const canvas = frames[i]!.canvas;
    if (canvas.width !== frameWidth || canvas.height !== frameHeight) {
      throw new Error(
        `Frame ${i} is ${canvas.width}x${canvas.height} but frame 0 is ${frameWidth}x${frameHeight}; all frames must match.`,
      );
    }
  }

  const scale = Math.max(1, Math.min(16, Math.floor(options.scale ?? 1)));
  const gap = Math.max(0, Math.min(64, Math.floor(options.gap ?? 0)));
  const columns = Math.max(1, Math.min(frames.length, Math.floor(options.columns ?? frames.length)));
  const rows = Math.ceil(frames.length / columns);
  const cellWidth = frameWidth * scale;
  const cellHeight = frameHeight * scale;
  const width = columns * cellWidth + (columns - 1) * gap;
  const height = rows * cellHeight + (rows - 1) * gap;

  if (width > MAX_SHEET_SIDE || height > MAX_SHEET_SIDE) {
    throw new Error(
      `Sheet would be ${width}x${height}; the maximum side is ${MAX_SHEET_SIDE}px. Lower scale, gap or frame count.`,
    );
  }

  const sheet = new PixelCanvas(width, height);
  const background = options.background ?? "checker";
  if (background === "checker") {
    checkerboard(sheet, Math.max(2, Math.floor(options.checkerCell ?? Math.max(4, Math.round(cellWidth / 8)))), [255, 255, 255, 255], [216, 216, 224, 255]);
  } else {
    sheet.fill(background);
  }

  const scaled = frames.map((frame) => (scale === 1 ? frame.canvas : resizeNearest(frame.canvas, cellWidth, cellHeight)));
  const onion = options.onionSkin ?? false;
  const onionOpacity = Math.max(0.05, Math.min(1, options.onionOpacity ?? 0.35));

  const cells: SheetCell[] = [];
  for (let i = 0; i < frames.length; i++) {
    const column = i % columns;
    const row = Math.floor(i / columns);
    const x = column * (cellWidth + gap);
    const y = row * (cellHeight + gap);
    cells.push({ index: i, x, y });
    if (onion && i > 0) blendCanvas(sheet, scaled[i - 1]!, x, y, onionOpacity);
    blendCanvas(sheet, scaled[i]!, x, y, 1);
  }

  return {
    canvas: sheet,
    layout: { columns, rows, cellWidth, cellHeight, gap, scale, width, height },
    cells,
  };
}

/** Grid shape used for contact sheets: single row for short clips, near-square otherwise. */
export function autoColumns(frameCount: number): number {
  if (frameCount <= 6) return frameCount;
  return Math.ceil(Math.sqrt(frameCount));
}

/** Largest integer upscale that keeps both sheet sides within `maxSide`. */
export function autoScale(
  frameWidth: number,
  frameHeight: number,
  columns: number,
  rows: number,
  gap: number,
  maxSide: number,
): number {
  for (let scale = 16; scale > 1; scale--) {
    const width = columns * frameWidth * scale + (columns - 1) * gap;
    const height = rows * frameHeight * scale + (rows - 1) * gap;
    if (width <= maxSide && height <= maxSide) return scale;
  }
  return 1;
}
