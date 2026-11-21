import { RGBA, colorsEqual } from "./color.js";

export interface RasterResult {
  drawn: number;
  skipped: number;
}

export interface CircleOptions {
  fill?: boolean;
}

/**
 * Mutable RGBA raster. Pixel (x, y) lives at byte offset (y * width + x) * 4.
 * Coordinates are 0-based with (0, 0) at the top-left corner.
 */
export class PixelCanvas {
  width: number;
  height: number;
  data: Uint8ClampedArray;

  constructor(width: number, height: number, background: RGBA = [0, 0, 0, 0]) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
      throw new Error(`Invalid canvas size ${width}x${height}.`);
    }
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
    this.fill(background);
  }

  cloneData(): Uint8ClampedArray {
    return this.data.slice();
  }

  restoreState(width: number, height: number, data: Uint8ClampedArray): void {
    if (data.length !== width * height * 4) {
      throw new Error(`Snapshot size mismatch: ${data.length} bytes for ${width}x${height}.`);
    }
    this.width = width;
    this.height = height;
    this.data = data;
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  getPixel(x: number, y: number): RGBA | null {
    if (!this.inBounds(x, y)) return null;
    const i = (y * this.width + x) * 4;
    return [this.data[i]!, this.data[i + 1]!, this.data[i + 2]!, this.data[i + 3]!];
  }

  /** Replaces the pixel (no alpha blending). Returns false when out of bounds. */
  setPixel(x: number, y: number, color: RGBA): boolean {
    if (!this.inBounds(x, y)) return false;
    const i = (y * this.width + x) * 4;
    this.data[i] = color[0];
    this.data[i + 1] = color[1];
    this.data[i + 2] = color[2];
    this.data[i + 3] = color[3];
    return true;
  }

  fill(color: RGBA): void {
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = color[0];
      this.data[i + 1] = color[1];
      this.data[i + 2] = color[2];
      this.data[i + 3] = color[3];
    }
  }

  fillRect(x: number, y: number, width: number, height: number, color: RGBA): RasterResult {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.width, Math.ceil(x + width));
    const y1 = Math.min(this.height, Math.ceil(y + height));
    let drawn = 0;
    for (let yy = y0; yy < y1; yy++) {
      for (let xx = x0; xx < x1; xx++) {
        this.setPixel(xx, yy, color);
        drawn++;
      }
    }
    const requested = Math.max(0, Math.floor(width)) * Math.max(0, Math.floor(height));
    return { drawn, skipped: Math.max(0, requested - drawn) };
  }

  /** Bresenham line. Pixels outside the canvas are counted as skipped. */
  drawLine(x0: number, y0: number, x1: number, y1: number, color: RGBA): RasterResult {
    let x = Math.round(x0);
    let y = Math.round(y0);
    const endX = Math.round(x1);
    const endY = Math.round(y1);
    const dx = Math.abs(endX - x);
    const dy = -Math.abs(endY - y);
    const sx = x < endX ? 1 : -1;
    const sy = y < endY ? 1 : -1;
    let err = dx + dy;
    let drawn = 0;
    let skipped = 0;
    for (;;) {
      if (this.setPixel(x, y, color)) drawn++;
      else skipped++;
      if (x === endX && y === endY) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y += sy;
      }
    }
    return { drawn, skipped };
  }

  /**
   * Rectangle outline or fill. `strokeWidth` is drawn inward from the edges.
   */
  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: RGBA,
    fill = false,
    strokeWidth = 1,
  ): RasterResult {
    if (width < 1 || height < 1) throw new Error("Rectangle width and height must be at least 1.");
    if (fill) return this.fillRect(x, y, width, height, color);

    const t = Math.max(1, Math.min(Math.floor(strokeWidth), Math.ceil(Math.min(width, height) / 2)));
    let drawn = 0;
    let skipped = 0;
    const bands: Array<[number, number, number, number]> = [
      [x, y, width, t],
      [x, y + height - t, width, t],
      [x, y, t, height],
      [x + width - t, y, t, height],
    ];
    for (const [bx, by, bw, bh] of bands) {
      const result = this.fillRect(bx, by, bw, bh, color);
      drawn += result.drawn;
      skipped += result.skipped;
    }
    return { drawn, skipped };
  }

  drawCircle(cx: number, cy: number, radius: number, color: RGBA, options: CircleOptions = {}): RasterResult {
    const r = Math.round(radius);
    if (r < 0) throw new Error("Circle radius must be >= 0.");
    if (r === 0) {
      return this.setPixel(cx, cy, color) ? { drawn: 1, skipped: 0 } : { drawn: 0, skipped: 1 };
    }

    if (options.fill) {
      let drawn = 0;
      let skipped = 0;
      const yStart = Math.max(0, cy - r);
      const yEnd = Math.min(this.height - 1, cy + r);
      const rr = (r + 0.5) * (r + 0.5);
      for (let yy = yStart; yy <= yEnd; yy++) {
        const dy = yy - cy;
        if (dy * dy > rr) continue;
        const span = Math.floor(Math.sqrt(rr - dy * dy));
        const spanStart = Math.max(0, cx - span);
        const spanEnd = Math.min(this.width - 1, cx + span);
        for (let xx = spanStart; xx <= spanEnd; xx++) {
          this.setPixel(xx, yy, color);
          drawn++;
        }
        skipped += Math.max(0, span * 2 + 1 - (spanEnd - spanStart + 1));
      }
      return { drawn, skipped };
    }

    let drawn = 0;
    let skipped = 0;
    const plot = (px: number, py: number) => {
      if (this.setPixel(px, py, color)) drawn++;
      else skipped++;
    };
    let x = r;
    let y = 0;
    let err = 1 - r;
    while (x >= y) {
      plot(cx + x, cy + y);
      plot(cx + y, cy + x);
      plot(cx - y, cy + x);
      plot(cx - x, cy + y);
      plot(cx - x, cy - y);
      plot(cx - y, cy - x);
      plot(cx + y, cy - x);
      plot(cx + x, cy - y);
      y++;
      if (err < 0) {
        err += 2 * y + 1;
      } else {
        x--;
        err += 2 * (y - x) + 1;
      }
    }
    return { drawn, skipped };
  }

  /**
   * Iterative 4-neighbour flood fill (uses an explicit stack, safe for large canvases).
   * Tolerance is the maximum per-channel difference (0-255) against the seed color.
   */
  floodFill(startX: number, startY: number, color: RGBA, tolerance = 0): number {
    const seed = this.getPixel(startX, startY);
    if (!seed) return 0;
    if (colorsEqual(seed, color, 0)) return 0;

    const { width, height, data } = this;
    const visited = new Uint8Array(width * height);
    const stack: number[] = [startY * width + startX];
    let filled = 0;

    while (stack.length > 0) {
      const index = stack.pop()!;
      if (visited[index]) continue;
      visited[index] = 1;

      const byte = index * 4;
      if (
        Math.abs(data[byte]! - seed[0]) > tolerance ||
        Math.abs(data[byte + 1]! - seed[1]) > tolerance ||
        Math.abs(data[byte + 2]! - seed[2]) > tolerance ||
        Math.abs(data[byte + 3]! - seed[3]) > tolerance
      ) {
        continue;
      }

      data[byte] = color[0];
      data[byte + 1] = color[1];
      data[byte + 2] = color[2];
      data[byte + 3] = color[3];
      filled++;

      const x = index % width;
      if (x > 0) stack.push(index - 1);
      if (x < width - 1) stack.push(index + 1);
      if (index >= width) stack.push(index - width);
      if (index < width * (height - 1)) stack.push(index + width);
    }
    return filled;
  }

  /**
   * Draw a character matrix. `colors` maps each character to an RGBA color;
   * a null mapping leaves the destination pixel unchanged. Unknown characters
   * abort before anything is drawn.
   */
  drawAscii(
    rows: string[],
    colors: ReadonlyMap<string, RGBA | null>,
    originX = 0,
    originY = 0,
  ): RasterResult & { asciiWidth: number; asciiHeight: number } {
    const matrix = rows.map((row) => Array.from(row));
    const asciiWidth = Math.max(0, ...matrix.map((row) => row.length));
    const asciiHeight = matrix.length;

    const unknown = new Set<string>();
    for (const row of matrix) {
      for (const ch of row) {
        if (!colors.has(ch)) unknown.add(ch);
      }
    }
    if (unknown.size > 0) {
      const list = [...unknown].map((ch) => JSON.stringify(ch)).join(", ");
      throw new Error(
        `Unknown ASCII character(s) ${list}. Every character in rows must be defined in legend (use "." for transparent when no legend is given).`,
      );
    }

    let drawn = 0;
    let skipped = 0;
    for (let row = 0; row < matrix.length; row++) {
      const line = matrix[row]!;
      for (let col = 0; col < line.length; col++) {
        const color = colors.get(line[col]!);
        if (!color) continue;
        if (this.setPixel(originX + col, originY + row, color)) drawn++;
        else skipped++;
      }
    }
    return { drawn, skipped, asciiWidth, asciiHeight };
  }
}
