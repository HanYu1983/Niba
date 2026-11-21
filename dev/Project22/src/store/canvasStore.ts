import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RGBA } from "../core/color.js";
import { PixelCanvas } from "../core/pixelCanvas.js";
import { makePreview, PreviewResult } from "../io/codec.js";

export const MAX_DIMENSION = 1024;
export const MAX_CANVASES = 16;
export const MAX_FRAMES = 64;
export const MAX_FRAME_BYTES = 64 * 1024 * 1024;
export const DEFAULT_FRAME_MS = 100;
export const MAX_FRAME_MS = 10000;
export const UNDO_DEPTH = 24;
export const HISTORY_BYTE_BUDGET = 48 * 1024 * 1024;
export const PREVIEW_DIR = join(tmpdir(), "mcp-pixel-studio");

export interface Frame {
  canvas: PixelCanvas;
  durationMs: number;
}

interface FrameState {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  durationMs: number;
}

interface Snapshot {
  version: number;
  frames: FrameState[];
  activeFrame: number;
  label: string;
}

function trimToBudget(history: Snapshot[]): void {
  const bytes = (snapshot: Snapshot) => {
    let total = 0;
    for (const frame of snapshot.frames) total += frame.data.byteLength;
    return total;
  };
  while (history.length > 1) {
    let total = 0;
    for (const snapshot of history) total += bytes(snapshot);
    if (total <= HISTORY_BYTE_BUDGET) return;
    history.shift();
  }
}

/**
 * One addressable image: a list of equally sized frames sharing a single named
 * palette. `canvas` always points at the active frame so existing drawing code
 * keeps working unchanged.
 */
export class CanvasRecord {
  readonly id: string;
  readonly createdAt: Date;
  version = 1;
  frames: Frame[];
  activeFrame = 0;
  palette: Map<string, RGBA>;
  paletteSource: Record<string, unknown>;
  background: RGBA;
  history: Snapshot[] = [];
  redoStack: Snapshot[] = [];

  constructor(
    id: string,
    width: number,
    height: number,
    background: RGBA,
    palette: Map<string, RGBA>,
    paletteSource: Record<string, unknown>,
  ) {
    this.id = id;
    this.createdAt = new Date();
    this.background = [...background] as RGBA;
    this.palette = palette;
    this.paletteSource = paletteSource;
    this.frames = [{ canvas: new PixelCanvas(width, height, background), durationMs: DEFAULT_FRAME_MS }];
  }

  get canvas(): PixelCanvas {
    return this.frames[this.activeFrame]!.canvas;
  }

  set canvas(value: PixelCanvas) {
    this.frames[this.activeFrame]!.canvas = value;
  }

  get durationMs(): number {
    return this.frames[this.activeFrame]!.durationMs;
  }

  set durationMs(ms: number) {
    this.frames[this.activeFrame]!.durationMs = ms;
  }

  get frameCount(): number {
    return this.frames.length;
  }

  get totalDurationMs(): number {
    return this.frames.reduce((sum, frame) => sum + frame.durationMs, 0);
  }
}

export interface PreviewFile extends PreviewResult {
  path: string;
}

export interface AddFrameOptions {
  at?: number;
  durationMs?: number;
  background?: RGBA;
  activate?: boolean;
}

export interface CloneFrameOptions {
  from?: number;
  at?: number;
  durationMs?: number;
  activate?: boolean;
}

function captureFrame(frame: Frame): FrameState {
  return {
    width: frame.canvas.width,
    height: frame.canvas.height,
    data: frame.canvas.cloneData(),
    durationMs: frame.durationMs,
  };
}

function restoreFrame(state: FrameState): Frame {
  const canvas = new PixelCanvas(1, 1);
  canvas.restoreState(state.width, state.height, state.data);
  return { canvas, durationMs: state.durationMs };
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

    const record = new CanvasRecord(id, width, height, background, new Map(palette), { ...paletteSource });
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
   * Run a mutation with an undo checkpoint covering every frame. On error the
   * record is restored and no history entry or version bump is kept.
   */
  mutate<T>(id: string, label: string, fn: (record: CanvasRecord) => T): { result: T; record: CanvasRecord } {
    const record = this.get(id);
    const snapshot: Snapshot = {
      version: record.version,
      frames: record.frames.map(captureFrame),
      activeFrame: record.activeFrame,
      label,
    };

    let result: T;
    try {
      result = fn(record);
    } catch (error) {
      this.restoreFrom(record, snapshot);
      throw error;
    }

    record.history.push(snapshot);
    if (record.history.length > UNDO_DEPTH) record.history.shift();
    trimToBudget(record.history);
    record.redoStack.length = 0;
    record.version += 1;
    return { result, record };
  }

  private restoreFrom(record: CanvasRecord, snapshot: Snapshot): void {
    record.frames = snapshot.frames.map(restoreFrame);
    record.activeFrame = Math.min(snapshot.activeFrame, record.frames.length - 1);
    record.version = snapshot.version;
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
        frames: record.frames.map(captureFrame),
        activeFrame: record.activeFrame,
        label: snapshot.label,
      });
      this.restoreFrom(record, snapshot);
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
        frames: record.frames.map(captureFrame),
        activeFrame: record.activeFrame,
        label: snapshot.label,
      });
      this.restoreFrom(record, snapshot);
    }
    if (record.history.length > UNDO_DEPTH) {
      record.history.splice(0, record.history.length - UNDO_DEPTH);
    }
    trimToBudget(record.history);
    return { record, labels };
  }

  addFrame(id: string, options: AddFrameOptions = {}): { record: CanvasRecord; index: number } {
    const { result, record } = this.mutate(id, "add_frame", (rec) => {
      const index = this.resolveInsertIndex(rec, options.at);
      this.assertFrameBudget(rec, 1);
      rec.frames.splice(index, 0, {
        canvas: new PixelCanvas(rec.canvas.width, rec.canvas.height, options.background ?? rec.background),
        durationMs: options.durationMs ?? DEFAULT_FRAME_MS,
      });
      if (options.activate ?? true) rec.activeFrame = index;
      return index;
    });
    return { record, index: result };
  }

  cloneFrame(id: string, options: CloneFrameOptions = {}): { record: CanvasRecord; index: number } {
    const { result, record } = this.mutate(id, "clone_frame", (rec) => {
      const sourceIndex = options.from ?? rec.activeFrame;
      const source = rec.frames[sourceIndex];
      if (!source) {
        throw new Error(`Frame ${sourceIndex} does not exist; this canvas has frames 0..${rec.frameCount - 1}.`);
      }
      const index = this.resolveInsertIndex(rec, options.at ?? sourceIndex + 1);
      this.assertFrameBudget(rec, 1);
      const copy = new PixelCanvas(1, 1);
      copy.restoreState(source.canvas.width, source.canvas.height, source.canvas.cloneData());
      rec.frames.splice(index, 0, { canvas: copy, durationMs: options.durationMs ?? source.durationMs });
      if (options.activate ?? true) rec.activeFrame = index;
      return index;
    });
    return { record, index: result };
  }

  selectFrame(id: string, index: number, durationMs?: number): CanvasRecord {
    const record = this.get(id);
    this.assertFrameIndex(record, index);
    if (durationMs === undefined) {
      record.activeFrame = index;
      return record;
    }
    return this.mutate(id, "select_frame", (rec) => {
      rec.activeFrame = index;
      rec.frames[index]!.durationMs = durationMs;
    }).record;
  }

  setFrameDuration(id: string, index: number, durationMs: number): CanvasRecord {
    const record = this.get(id);
    this.assertFrameIndex(record, index);
    return this.mutate(id, "set_frame_duration", (rec) => {
      rec.frames[index]!.durationMs = durationMs;
    }).record;
  }

  private assertFrameIndex(record: CanvasRecord, index: number): void {
    if (!Number.isInteger(index) || index < 0 || index >= record.frameCount) {
      throw new Error(`Frame index ${index} is out of range; this canvas has frames 0..${record.frameCount - 1}.`);
    }
  }

  private resolveInsertIndex(record: CanvasRecord, at?: number): number {
    const index = at ?? record.frameCount;
    if (!Number.isInteger(index) || index < 0 || index > record.frameCount) {
      throw new Error(`Insert position ${index} is out of range; use 0..${record.frameCount} (${record.frameCount} = append).`);
    }
    return index;
  }

  private assertFrameBudget(record: CanvasRecord, adding: number): void {
    if (record.frameCount + adding > MAX_FRAMES) {
      throw new Error(`Frame limit reached (${MAX_FRAMES}). Remove frames or start a new canvas.`);
    }
    let bytes = 0;
    for (const frame of record.frames) bytes += frame.canvas.data.byteLength;
    const frameBytes = record.canvas.width * record.canvas.height * 4 * adding;
    if (bytes + frameBytes > MAX_FRAME_BYTES) {
      throw new Error(
        `Adding a frame would exceed the per-canvas frame budget (${Math.round(MAX_FRAME_BYTES / 1024 / 1024)} MB). ` +
          "Use a smaller canvas or fewer frames.",
      );
    }
  }

  async savePreview(record: CanvasRecord, maxSize: number): Promise<PreviewFile> {
    const preview = makePreview(record.canvas, maxSize);
    await mkdir(PREVIEW_DIR, { recursive: true });
    const path = join(PREVIEW_DIR, `${record.id}-v${record.version}.png`);
    await writeFile(path, preview.png);
    return { ...preview, path };
  }

  async saveCanvasPreview(canvas: PixelCanvas, maxSize: number, name: string): Promise<PreviewFile> {
    const preview = makePreview(canvas, maxSize);
    await mkdir(PREVIEW_DIR, { recursive: true });
    const path = join(PREVIEW_DIR, `${name}.png`);
    await writeFile(path, preview.png);
    return { ...preview, path };
  }
}
