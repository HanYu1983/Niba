import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RGBA } from "../core/color.js";
import { PixelCanvas } from "../core/pixelCanvas.js";
import { makePreview, PreviewResult } from "../io/codec.js";

export const MAX_DIMENSION = 1024;
export const MAX_CANVASES = 16;
export const UNDO_DEPTH = 24;
export const HISTORY_BYTE_BUDGET = 48 * 1024 * 1024;
export const PREVIEW_DIR = join(tmpdir(), "mcp-pixel-studio");

/** Drop oldest snapshots until the per-canvas byte budget is met (keeps at least one). */
function trimToBudget(history: Snapshot[]): void {
  while (history.length > 1) {
    let bytes = 0;
    for (const snapshot of history) bytes += snapshot.data.byteLength;
    if (bytes <= HISTORY_BYTE_BUDGET) return;
    history.shift();
  }
}

interface Snapshot {
  version: number;
  width: number;
  height: number;
  data: Uint8ClampedArray;
  label: string;
}

export interface CanvasRecord {
  id: string;
  canvas: PixelCanvas;
  version: number;
  createdAt: Date;
  palette: Map<string, RGBA>;
  paletteSource: Record<string, unknown>;
  history: Snapshot[];
  redoStack: Snapshot[];
}

export interface PreviewFile extends PreviewResult {
  path: string;
}

export class CanvasStore {
  private records = new Map<string, CanvasRecord>();

  create(
    width: number,
    height: number,
    background: RGBA,
    palette: Map<string, RGBA>,
    paletteSource: Record<string, unknown>,
  ): CanvasRecord {
    if (width < 1 || height < 1 || width > MAX_DIMENSION || height > MAX_DIMENSION) {
      throw new Error(`Canvas size must be between 1x1 and ${MAX_DIMENSION}x${MAX_DIMENSION}, got ${width}x${height}.`);
    }
    if (this.records.size >= MAX_CANVASES) {
      throw new Error(
        `Canvas limit reached (${MAX_CANVASES}). Reuse an existing image_id or restart the MCP server to clear the store.`,
      );
    }

    let id = `img_${randomBytes(4).toString("hex")}`;
    while (this.records.has(id)) id = `img_${randomBytes(4).toString("hex")}`;

    const record: CanvasRecord = {
      id,
      canvas: new PixelCanvas(width, height, background),
      version: 1,
      createdAt: new Date(),
      palette: new Map(palette),
      paletteSource: { ...paletteSource },
      history: [],
      redoStack: [],
    };
    this.records.set(id, record);
    return record;
  }

  get(id: string): CanvasRecord {
    const record = this.records.get(id);
    if (record) return record;
    const active = [...this.records.keys()];
    throw new Error(
      `Unknown image_id "${id}". Active canvases: ${active.length ? active.join(", ") : "none - call create_canvas first"}.`,
    );
  }

  list(): CanvasRecord[] {
    return [...this.records.values()];
  }

  /**
   * Run a mutation with an undo checkpoint. On error the canvas is restored and
   * no history entry or version bump is kept.
   */
  mutate<T>(id: string, label: string, fn: (record: CanvasRecord) => T): { result: T; record: CanvasRecord } {
    const record = this.get(id);
    const snapshot: Snapshot = {
      version: record.version,
      width: record.canvas.width,
      height: record.canvas.height,
      data: record.canvas.cloneData(),
      label,
    };

    let result: T;
    try {
      result = fn(record);
    } catch (error) {
      record.canvas.restoreState(snapshot.width, snapshot.height, snapshot.data);
      throw error;
    }

    record.history.push(snapshot);
    if (record.history.length > UNDO_DEPTH) record.history.shift();
    trimToBudget(record.history);
    record.redoStack.length = 0;
    record.version += 1;
    return { result, record };
  }

  undo(id: string, steps = 1): { record: CanvasRecord; labels: string[] } {
    const record = this.get(id);
    if (record.history.length === 0) {
      throw new Error(`Canvas ${id} has no undo history (version ${record.version}).`);
    }

    const labels: string[] = [];
    const count = Math.min(Math.max(1, Math.floor(steps)), record.history.length);
    for (let i = 0; i < count; i++) {
      const snapshot = record.history.pop()!;
      labels.push(snapshot.label);
      record.redoStack.push({
        version: record.version,
        width: record.canvas.width,
        height: record.canvas.height,
        data: record.canvas.cloneData(),
        label: snapshot.label,
      });
      record.canvas.restoreState(snapshot.width, snapshot.height, snapshot.data);
      record.version = snapshot.version;
    }
    if (record.redoStack.length > UNDO_DEPTH) {
      record.redoStack.splice(0, record.redoStack.length - UNDO_DEPTH);
    }
    trimToBudget(record.redoStack);
    return { record, labels };
  }

  redo(id: string, steps = 1): { record: CanvasRecord; labels: string[] } {
    const record = this.get(id);
    if (record.redoStack.length === 0) {
      throw new Error(`Canvas ${id} has no redo history.`);
    }

    const labels: string[] = [];
    const count = Math.min(Math.max(1, Math.floor(steps)), record.redoStack.length);
    for (let i = 0; i < count; i++) {
      const snapshot = record.redoStack.pop()!;
      labels.push(snapshot.label);
      record.history.push({
        version: record.version,
        width: record.canvas.width,
        height: record.canvas.height,
        data: record.canvas.cloneData(),
        label: snapshot.label,
      });
      record.canvas.restoreState(snapshot.width, snapshot.height, snapshot.data);
      record.version = snapshot.version;
    }
    if (record.history.length > UNDO_DEPTH) {
      record.history.splice(0, record.history.length - UNDO_DEPTH);
    }
    trimToBudget(record.history);
    return { record, labels };
  }

  async savePreview(record: CanvasRecord, maxSize: number): Promise<PreviewFile> {
    const preview = makePreview(record.canvas, maxSize);
    await mkdir(PREVIEW_DIR, { recursive: true });
    const path = join(PREVIEW_DIR, `${record.id}-v${record.version}.png`);
    await writeFile(path, preview.png);
    return { ...preview, path };
  }
}
