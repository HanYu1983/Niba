import { extname, isAbsolute, join, resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ImageContent, TextContent } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { autoColumns, autoScale, buildSheet } from "./animation/sheet.js";
import { RGBA, isTransparentInput, parseColor, rgbaToHex } from "./core/color.js";
import { PixelCanvas } from "./core/pixelCanvas.js";
import {
  applyPalette,
  blendCanvas,
  copyPaste,
  crop,
  flipHorizontal,
  flipVertical,
  outline,
  replaceColor,
  resizeNearest,
  rotate,
  shiftRect,
} from "./core/transforms.js";
import { encodeAPNG } from "./io/apng.js";
import { encodePNG, writeFileBuffer, writePNGFile } from "./io/codec.js";
import { encodeGIF } from "./io/gif.js";
import {
  CanvasRecord,
  CanvasStore,
  MAX_DIMENSION,
  MAX_FRAME_MS,
  MAX_FRAMES,
  PREVIEW_DIR,
} from "./store/canvasStore.js";

const COORD_MIN = -4096;
const COORD_MAX = 4096;
const MAX_PIXEL_READ_AREA = 16384;
const MAX_EXPORT_SIDE = 4096;
const ASCII_LEGEND_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const coordSchema = z.number().int().min(COORD_MIN).max(COORD_MAX);
const positiveSizeSchema = z.number().int().min(1).max(MAX_DIMENSION * 4);

const colorSchema = z
  .union([
    z.string(),
    z.array(z.number().int().min(0).max(255)).min(3).max(4),
    z.object({
      r: z.number().int().min(0).max(255),
      g: z.number().int().min(0).max(255),
      b: z.number().int().min(0).max(255),
      a: z.number().int().min(0).max(255).optional(),
    }),
  ])
  .describe(
    'Color as "#RGB"/"#RRGGBB"/"#RRGGBBAA" (or without "#"), "rgb(255,0,0)"/"rgba(255,0,0,0.5)", ' +
      'a named color (e.g. "red", "transparent"), a canvas palette key, an [r,g,b] / [r,g,b,a] array, ' +
      'or an {"r":255,"g":0,"b":0,"a":255} object.',
  );

const paletteSchema = z
  .record(z.string(), colorSchema)
  .describe('Named palette, e.g. {"skin":"#ffcd75","outline":"#1a1c2c"}. Entries may reference earlier keys.');

const imageIdSchema = z.string().describe("Canvas id returned by create_canvas (e.g. img_1a2b3c4d).");
const previewSchema = z
  .boolean()
  .optional()
  .describe("When true, also return a scaled PNG thumbnail so you can visually check the result. Costs tokens; use sparingly.");

interface Metadata {
  imageId: string;
  width: number;
  height: number;
  version: number;
  undoDepth: number;
  redoDepth: number;
  palette: string[];
  frameCount: number;
  activeFrame: number;
  durationMs: number;
}

function canvasMeta(record: CanvasRecord): Metadata {
  return {
    imageId: record.id,
    width: record.canvas.width,
    height: record.canvas.height,
    version: record.version,
    undoDepth: record.history.length,
    redoDepth: record.redoStack.length,
    palette: Object.keys(record.paletteSource),
    frameCount: record.frameCount,
    activeFrame: record.activeFrame,
    durationMs: record.durationMs,
  };
}

function frameList(record: CanvasRecord): Record<string, unknown> {
  return {
    totalDurationMs: record.totalDurationMs,
    frames: record.frames.map((frame, index) => ({
      index,
      durationMs: frame.durationMs,
      active: index === record.activeFrame,
    })),
  };
}

function requireFrame(record: CanvasRecord, index: number): void {
  if (!Number.isInteger(index) || index < 0 || index >= record.frameCount) {
    throw new Error(`Frame index ${index} is out of range; this canvas has frames 0..${record.frameCount - 1}.`);
  }
}

function resolveFileOutput(
  input: string | undefined,
  fallbackName: string,
  defaultExt: string,
  allowedExts: string[] = [defaultExt],
): string {
  if (!input) return join(PREVIEW_DIR, fallbackName);
  let candidate = input;
  if (!extname(candidate)) candidate += defaultExt;
  if (!allowedExts.includes(extname(candidate).toLowerCase())) {
    throw new Error(`Output path must end with ${allowedExts.join(" or ")}.`);
  }
  return isAbsolute(candidate) ? candidate : resolve(process.cwd(), candidate);
}

function resolveDirOutput(input: string | undefined, fallbackName: string): string {
  if (!input) return join(PREVIEW_DIR, fallbackName);
  return isAbsolute(input) ? input : resolve(process.cwd(), input);
}

function scaledFrameCanvases(record: CanvasRecord, scale: number): PixelCanvas[] {
  const width = record.canvas.width * scale;
  const height = record.canvas.height * scale;
  if (width > MAX_EXPORT_SIDE || height > MAX_EXPORT_SIDE) {
    throw new Error(`Scale ${scale} would make each frame ${width}x${height}; maximum side is ${MAX_EXPORT_SIDE}px.`);
  }
  return record.frames.map((frame) =>
    scale === 1 ? frame.canvas : resizeNearest(frame.canvas, width, height),
  );
}

async function respond(
  store: CanvasStore,
  record: CanvasRecord,
  payload: Record<string, unknown>,
  preview: boolean,
  previewMaxSize = 384,
  previewCanvas?: PixelCanvas,
  previewTag?: string,
): Promise<CallToolResult> {
  const meta: Record<string, unknown> = { ...canvasMeta(record), ...payload };
  let image: ImageContent | undefined;

  if (preview) {
    const file = previewCanvas
      ? await store.saveCanvasPreview(previewCanvas, previewMaxSize, previewTag ?? `${record.id}-v${record.version}`)
      : await store.savePreview(record, previewMaxSize);
    meta.previewPath = file.path;
    meta.previewSize = `${file.width}x${file.height}`;
    image = { type: "image", data: file.png.toString("base64"), mimeType: "image/png" };
  }

  const content: Array<TextContent | ImageContent> = [{ type: "text", text: JSON.stringify(meta) }];
  if (image) content.push(image);
  return { content };
}

function mergePalette(record: CanvasRecord, extra?: Record<string, unknown>): Map<string, RGBA> {
  const palette = new Map(record.palette);
  if (!extra) return palette;
  for (const [key, value] of Object.entries(extra)) {
    const name = key.trim();
    if (!name) throw new Error("Palette keys must be non-empty strings.");
    palette.set(name, parseColor(value, palette));
  }
  return palette;
}

const shapeInputSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("line"),
    x0: coordSchema,
    y0: coordSchema,
    x1: coordSchema,
    y1: coordSchema,
    color: colorSchema,
  }),
  z.object({
    kind: z.literal("rect"),
    x: coordSchema,
    y: coordSchema,
    width: positiveSizeSchema,
    height: positiveSizeSchema,
    color: colorSchema,
    fill: z.boolean().optional(),
    stroke_width: z.number().int().min(1).max(64).optional(),
  }),
  z.object({
    kind: z.literal("circle"),
    cx: coordSchema,
    cy: coordSchema,
    radius: z.number().int().min(0).max(4096),
    color: colorSchema,
    fill: z.boolean().optional(),
  }),
  z.object({
    kind: z.literal("flood_fill"),
    x: coordSchema,
    y: coordSchema,
    color: colorSchema,
    tolerance: z.number().int().min(0).max(255).optional(),
  }),
]);

const transformOpSchema = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("scale_nearest"),
    width: z.number().int().min(1).max(MAX_DIMENSION).optional(),
    height: z.number().int().min(1).max(MAX_DIMENSION).optional(),
    factor: z.number().min(0.05).max(16).optional(),
  }),
  z.object({ op: z.literal("flip_h") }),
  z.object({ op: z.literal("flip_v") }),
  z.object({
    op: z.literal("rotate"),
    degrees: z.union([z.literal(90), z.literal(180), z.literal(270)]),
  }),
  z.object({
    op: z.literal("outline"),
    color: colorSchema,
    diagonal: z.boolean().optional(),
  }),
  z.object({
    op: z.literal("replace_color"),
    from: colorSchema,
    to: colorSchema,
    tolerance: z.number().int().min(0).max(255).optional(),
  }),
  z.object({
    op: z.literal("apply_palette"),
    colors: z.array(colorSchema).min(1).max(256),
  }),
  z.object({
    op: z.literal("crop"),
    x: coordSchema,
    y: coordSchema,
    width: positiveSizeSchema,
    height: positiveSizeSchema,
  }),
  z.object({
    op: z.literal("copy_paste"),
    x: coordSchema,
    y: coordSchema,
    width: positiveSizeSchema,
    height: positiveSizeSchema,
    dst_x: coordSchema,
    dst_y: coordSchema,
    flip_h: z.boolean().optional(),
    flip_v: z.boolean().optional(),
  }),
]);

const INSTRUCTIONS = `Server-side pixel-art studio. Canvases live in server memory and are addressed by image_id; pixel data never travels over the wire unless you ask for it.

Workflow: create_canvas -> draw_pixels / draw_shape / transform_canvas -> view_image (visual check, optional) -> export_image.
- Coordinates are 0-based; (0,0) is the TOP-LEFT corner. x grows right, y grows down.
- Colors: #RGB, #RRGGBB, #RRGGBBAA, rgb()/rgba(), named colors, palette keys, or [r,g,b,a].
- Prefer ASCII matrices (draw_pixels.ascii) or batch pixel lists over one call per pixel.
- Out-of-bounds pixels are skipped and reported, never fatal.
- Each mutating call creates one undo checkpoint (version + 1); use undo / redo.
- preview:true attaches a downscaled PNG thumbnail; view_image does the same without mutating.

Animation: a canvas holds 1..${MAX_FRAMES} equally sized frames sharing one palette. Drawing tools always edit the ACTIVE frame.
- Build a cycle by drawing frame 0, then clone_frame, then edit only the parts that move (shift_rect for limbs).
- select_frame switches the editing cursor (no undo checkpoint unless you pass duration_ms).
- view_image with onion_skin:true ghosts the previous frame so you can check alignment.
- render_contact_sheet returns every frame on one image for a continuity check.
- export_animation writes a sprite sheet, GIF, APNG or a PNG sequence.`;

export function createPixelStudioServer(store: CanvasStore = new CanvasStore()): McpServer {
  const server = new McpServer(
    { name: "mcp-pixel-studio", version: "0.1.0" },
    { instructions: INSTRUCTIONS },
  );

  server.registerTool(
    "create_canvas",
    {
      title: "Create canvas",
      description:
        "Create a new blank RGBA canvas and return its image_id. Dimensions are capped at " +
        `${MAX_DIMENSION}x${MAX_DIMENSION}; up to 16 canvases may be open. ` +
        'bg_color defaults to transparent; pass e.g. "#1a1c2c" for a solid background. ' +
        "An optional named palette can be passed and referenced later by key.",
      inputSchema: {
        width: z.number().int().min(1).max(MAX_DIMENSION),
        height: z.number().int().min(1).max(MAX_DIMENSION),
        bg_color: colorSchema.optional(),
        palette: paletteSchema.optional(),
        preview: previewSchema,
      },
    },
    async (args) => {
      const palette = new Map<string, RGBA>();
      const paletteSource = args.palette ?? {};
      for (const [key, value] of Object.entries(paletteSource)) {
        const name = key.trim();
        if (!name) throw new Error("Palette keys must be non-empty strings.");
        palette.set(name, parseColor(value, palette));
      }
      const bg = args.bg_color === undefined ? ([0, 0, 0, 0] as RGBA) : parseColor(args.bg_color, palette);
      const record = store.create(args.width, args.height, bg, palette, paletteSource);

      const paletteHex = Object.fromEntries([...palette.entries()].map(([key, value]) => [key, rgbaToHex(value)]));
      return respond(store, record, { bgColor: rgbaToHex(bg), paletteHex }, args.preview ?? false);
    },
  );

  server.registerTool(
    "list_canvases",
    {
      title: "List canvases",
      description: "List all canvases currently held in server memory (image_id, size, version, undo depth).",
      inputSchema: {},
    },
    async () => {
      const canvases = store.list().map((record) => ({
        ...canvasMeta(record),
        createdAt: record.createdAt.toISOString(),
      }));
      const content: TextContent[] = [{ type: "text", text: JSON.stringify({ count: canvases.length, canvases }) }];
      return { content };
    },
  );

  server.registerTool(
    "get_info",
    {
      title: "Get canvas info",
      description:
        "Return metadata for one canvas: size, version, palette keys, undo/redo depth, frame count and per-frame durations. Does not modify it.",
      inputSchema: {
        image_id: imageIdSchema,
        preview: previewSchema,
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      return respond(
        store,
        record,
        { createdAt: record.createdAt.toISOString(), ...frameList(record) },
        args.preview ?? false,
      );
    },
  );

  server.registerTool(
    "draw_pixels",
    {
      title: "Draw pixels (batch or ASCII)",
      description:
        "Paint pixels in ONE undo checkpoint. Two input modes can be combined:\n" +
        '- pixels: [{x,y,color}] batch list; out-of-bounds points are skipped and counted.\n' +
        '- ascii: {rows:["..XX..",".X..X.","XXXXXX"], legend:{".":"transparent","X":"#ff5500"}, x?, y?}. ' +
        "Rows may use any single characters; every character must appear in legend. Without legend, only " +
        '"." and " " are accepted (transparent). Legend values may be palette keys or "transparent". ' +
        "ASCII matrices are the most token-efficient way to draw sprites.",
      inputSchema: {
        image_id: imageIdSchema,
        pixels: z
          .array(z.object({ x: coordSchema, y: coordSchema, color: colorSchema }))
          .max(20000)
          .optional()
          .describe("Batch pixel list. Prefer runs/ASCII for large areas."),
        ascii: z
          .object({
            rows: z
              .array(z.string().max(4096))
              .min(1)
              .max(1024)
              .describe("Character rows, top to bottom. May be ragged."),
            legend: z
              .record(z.string(), colorSchema)
              .optional()
              .describe('Single-character keys mapped to colors, e.g. {".":"transparent","X":"#ff5500"}.'),
            x: coordSchema.optional(),
            y: coordSchema.optional(),
          })
          .optional()
          .describe("Character-matrix drawing with optional top-left origin (default 0,0)."),
        palette: paletteSchema.optional().describe("Additional named colors for this call only (merged with the canvas palette)."),
        preview: previewSchema,
      },
    },
    async (args) => {
      if ((!args.pixels || args.pixels.length === 0) && !args.ascii) {
        throw new Error("Provide at least one of `pixels` or `ascii`.");
      }
      const record = store.get(args.image_id);
      const palette = mergePalette(record, args.palette);
      const pixels = (args.pixels ?? []).map((pixel) => ({
        x: pixel.x,
        y: pixel.y,
        color: parseColor(pixel.color, palette),
      }));

      let asciiPlan:
        | { rows: string[]; colors: Map<string, RGBA | null>; x: number; y: number }
        | undefined;
      if (args.ascii) {
        const colors = new Map<string, RGBA | null>();
        if (args.ascii.legend) {
          for (const [char, value] of Object.entries(args.ascii.legend)) {
            if (Array.from(char).length !== 1) {
              throw new Error(`Legend key ${JSON.stringify(char)} must be a single character.`);
            }
            colors.set(char, isTransparentInput(value) ? null : parseColor(value, palette));
          }
        } else {
          colors.set(".", null);
          colors.set(" ", null);
        }
        asciiPlan = { rows: args.ascii.rows, colors, x: args.ascii.x ?? 0, y: args.ascii.y ?? 0 };
      }

      const { result, record: updated } = store.mutate(record.id, "draw_pixels", (rec) => {
        let pixelsDrawn = 0;
        let skipped = 0;
        for (const pixel of pixels) {
          if (rec.canvas.setPixel(pixel.x, pixel.y, pixel.color)) pixelsDrawn++;
          else skipped++;
        }
        let asciiDrawn = 0;
        let asciiWidth = 0;
        let asciiHeight = 0;
        if (asciiPlan) {
          const asciiResult = rec.canvas.drawAscii(
            asciiPlan.rows,
            asciiPlan.colors,
            asciiPlan.x,
            asciiPlan.y,
          );
          asciiDrawn = asciiResult.drawn;
          skipped += asciiResult.skipped;
          asciiWidth = asciiResult.asciiWidth;
          asciiHeight = asciiResult.asciiHeight;
        }
        return { pixelsDrawn, asciiDrawn, skipped, asciiWidth, asciiHeight };
      });

      return respond(
        store,
        updated,
        {
          drawn: result.pixelsDrawn + result.asciiDrawn,
          pixelsDrawn: result.pixelsDrawn,
          asciiDrawn: result.asciiDrawn,
          skippedOutOfBounds: result.skipped,
          asciiSize: result.asciiWidth ? { width: result.asciiWidth, height: result.asciiHeight } : null,
        },
        args.preview ?? false,
      );
    },
  );

  server.registerTool(
    "draw_shape",
    {
      title: "Draw shape",
      description:
        "Draw one geometric shape in a single undo checkpoint. kind is one of:\n" +
        '- "line" {x0,y0,x1,y1,color}: Bresenham 1px line.\n' +
        '- "rect" {x,y,width,height,color,fill?,stroke_width?}: outline (stroke_width, default 1) or filled.\n' +
        '- "circle" {cx,cy,radius,color,fill?}: outline or filled circle.\n' +
        '- "flood_fill" {x,y,color,tolerance?}: iterative paint bucket (tolerance 0-255 per channel).\n' +
        "Parts outside the canvas are clipped/skipped and reported.",
      inputSchema: {
        image_id: imageIdSchema,
        shape: shapeInputSchema,
        preview: previewSchema,
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      const shape = args.shape;
      const color = parseColor(shape.color, record.palette);

      const { result, record: updated } = store.mutate(record.id, `draw_${shape.kind}`, (rec) => {
        switch (shape.kind) {
          case "line":
            return rec.canvas.drawLine(shape.x0, shape.y0, shape.x1, shape.y1, color);
          case "rect":
            return rec.canvas.drawRect(
              shape.x,
              shape.y,
              shape.width,
              shape.height,
              color,
              shape.fill ?? false,
              shape.stroke_width ?? 1,
            );
          case "circle":
            return rec.canvas.drawCircle(shape.cx, shape.cy, shape.radius, color, { fill: shape.fill ?? false });
          case "flood_fill":
            return { filled: rec.canvas.floodFill(shape.x, shape.y, color, shape.tolerance ?? 0) };
        }
      });

      return respond(store, updated, { kind: shape.kind, result }, args.preview ?? false);
    },
  );

  server.registerTool(
    "transform_canvas",
    {
      title: "Transform canvas",
      description:
        "Apply one or more whole-canvas operations in order, as a single undo checkpoint. Supported ops:\n" +
        '- {"op":"scale_nearest","width"|"height"|"factor"} nearest-neighbour resize (no blur).\n' +
        '- {"op":"flip_h"} / {"op":"flip_v"}\n' +
        '- {"op":"rotate","degrees":90|180|270} clockwise.\n' +
        '- {"op":"outline","color","diagonal"?} add a 1px outline around opaque pixels (repeat for thicker).\n' +
        '- {"op":"replace_color","from","to","tolerance"?}\n' +
        '- {"op":"apply_palette","colors":[...]} quantize RGB to the nearest palette color, keeping alpha.\n' +
        '- {"op":"crop","x","y","width","height"} replaces the canvas with the cropped region.\n' +
        '- {"op":"copy_paste","x","y","width","height","dst_x","dst_y","flip_h"?,"flip_v"?}.',
      inputSchema: {
        image_id: imageIdSchema,
        ops: z.array(transformOpSchema).min(1).max(32),
        preview: previewSchema,
      },
    },
    async (args) => {
      const record = store.get(args.image_id);

      const { result, record: updated } = store.mutate(record.id, "transform_canvas", (rec) => {
        const results: Array<Record<string, unknown>> = [];

        for (const op of args.ops) {
          switch (op.op) {
            case "scale_nearest": {
              let targetWidth: number;
              let targetHeight: number;
              if (op.factor !== undefined) {
                if (op.width !== undefined || op.height !== undefined) {
                  throw new Error("scale_nearest accepts either factor or width/height, not both.");
                }
                targetWidth = Math.round(rec.canvas.width * op.factor);
                targetHeight = Math.round(rec.canvas.height * op.factor);
              } else {
                if (op.width === undefined && op.height === undefined) {
                  throw new Error("scale_nearest needs factor or at least one of width/height.");
                }
                targetWidth = op.width ?? rec.canvas.width;
                targetHeight = op.height ?? rec.canvas.height;
              }
              if (
                targetWidth < 1 ||
                targetHeight < 1 ||
                targetWidth > MAX_DIMENSION ||
                targetHeight > MAX_DIMENSION
              ) {
                throw new Error(
                  `scale_nearest target ${targetWidth}x${targetHeight} is outside 1x1..${MAX_DIMENSION}x${MAX_DIMENSION}.`,
                );
              }
              rec.frames.forEach((frame) => {
                frame.canvas = resizeNearest(frame.canvas, targetWidth, targetHeight);
              });
              results.push({ op: op.op, width: targetWidth, height: targetHeight, frames: rec.frameCount });
              break;
            }
            case "flip_h":
              flipHorizontal(rec.canvas);
              results.push({ op: op.op });
              break;
            case "flip_v":
              flipVertical(rec.canvas);
              results.push({ op: op.op });
              break;
            case "rotate":
              rec.frames.forEach((frame) => rotate(frame.canvas, op.degrees));
              results.push({
                op: op.op,
                degrees: op.degrees,
                width: rec.canvas.width,
                height: rec.canvas.height,
                frames: rec.frameCount,
              });
              break;
            case "outline": {
              const drawn = outline(rec.canvas, parseColor(op.color, rec.palette), op.diagonal ?? true);
              results.push({ op: op.op, drawn });
              break;
            }
            case "replace_color": {
              const replaced = replaceColor(
                rec.canvas,
                parseColor(op.from, rec.palette),
                parseColor(op.to, rec.palette),
                op.tolerance ?? 0,
              );
              results.push({ op: op.op, replaced });
              break;
            }
            case "apply_palette": {
              const colors = op.colors.map((entry) => parseColor(entry, rec.palette));
              const changed = applyPalette(rec.canvas, colors);
              results.push({ op: op.op, changed, paletteSize: colors.length });
              break;
            }
            case "crop": {
              let croppedWidth = 0;
              let croppedHeight = 0;
              for (const frame of rec.frames) {
                const cropped = crop(frame.canvas, {
                  x: op.x,
                  y: op.y,
                  width: op.width,
                  height: op.height,
                });
                frame.canvas = cropped.canvas;
                croppedWidth = cropped.width;
                croppedHeight = cropped.height;
              }
              results.push({
                op: op.op,
                width: croppedWidth,
                height: croppedHeight,
                frames: rec.frameCount,
              });
              break;
            }
            case "copy_paste": {
              const copied = copyPaste(
                rec.canvas,
                { x: op.x, y: op.y, width: op.width, height: op.height },
                op.dst_x,
                op.dst_y,
                op.flip_h ?? false,
                op.flip_v ?? false,
              );
              results.push({ op: op.op, ...copied });
              break;
            }
          }
        }
        return results;
      });

      return respond(store, updated, { ops: result }, args.preview ?? false);
    },
  );

  server.registerTool(
    "get_pixels",
    {
      title: "Read pixels",
      description:
        "Read a rectangular region and return it as a compact character matrix (default) or run-length hex. " +
        `Regions are limited to ${MAX_PIXEL_READ_AREA} pixels (e.g. 128x128). ` +
        'ASCII mode returns {legend:{"0":"#FF0000"}, rows:["0000",".00."]}, where "." means fully transparent. ' +
        'Use format "hex_rle" for images with more than 61 distinct colors.',
      inputSchema: {
        image_id: imageIdSchema,
        x: z.number().int().min(0).max(MAX_DIMENSION - 1).optional(),
        y: z.number().int().min(0).max(MAX_DIMENSION - 1).optional(),
        width: z.number().int().min(1).max(MAX_DIMENSION).optional(),
        height: z.number().int().min(1).max(MAX_DIMENSION).optional(),
        format: z.enum(["ascii", "hex_rle"]).optional(),
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      const canvas = record.canvas;
      const x = args.x ?? 0;
      const y = args.y ?? 0;
      const width = args.width ?? canvas.width - x;
      const height = args.height ?? canvas.height - y;

      const x0 = Math.max(0, x);
      const y0 = Math.max(0, y);
      const x1 = Math.min(canvas.width, x + width);
      const y1 = Math.min(canvas.height, y + height);
      if (x1 <= x0 || y1 <= y0) {
        throw new Error(
          `Requested region (${x},${y} ${width}x${height}) is empty; the canvas is ${canvas.width}x${canvas.height}.`,
        );
      }

      const actualWidth = x1 - x0;
      const actualHeight = y1 - y0;
      const area = actualWidth * actualHeight;
      if (area > MAX_PIXEL_READ_AREA) {
        throw new Error(
          `Requested region is ${actualWidth}x${actualHeight} (${area} px); the maximum is ${MAX_PIXEL_READ_AREA} px. ` +
            "Read a smaller bbox.",
        );
      }

      const format = args.format ?? "ascii";
      const bbox = { x: x0, y: y0, width: actualWidth, height: actualHeight };

      if (format === "hex_rle") {
        const rows: Array<Array<{ color: string; count: number }>> = [];
        const seen = new Set<string>();
        for (let yy = y0; yy < y1; yy++) {
          const runs: Array<{ color: string; count: number }> = [];
          for (let xx = x0; xx < x1; xx++) {
            const pixel = canvas.getPixel(xx, yy)!;
            const key = pixel[3] === 0 ? "#00000000" : rgbaToHex(pixel);
            seen.add(key);
            const last = runs[runs.length - 1];
            if (last && last.color === key) last.count++;
            else runs.push({ color: key, count: 1 });
          }
          rows.push(runs);
        }
        return respond(store, record, { bbox, format, rows, distinctColors: seen.size }, false);
      }

      const legend: Record<string, string> = {};
      const charByColor = new Map<string, string>();
      let nextChar = 0;
      const rows: string[] = [];

      for (let yy = y0; yy < y1; yy++) {
        let row = "";
        for (let xx = x0; xx < x1; xx++) {
          const pixel = canvas.getPixel(xx, yy)!;
          if (pixel[3] === 0) {
            row += ".";
            continue;
          }
          const key = rgbaToHex(pixel);
          let char = charByColor.get(key);
          if (!char) {
            if (nextChar >= ASCII_LEGEND_CHARS.length) {
              throw new Error(
                `Region contains more than ${ASCII_LEGEND_CHARS.length} distinct colors; use format "hex_rle" or a smaller bbox.`,
              );
            }
            char = ASCII_LEGEND_CHARS[nextChar++]!;
            charByColor.set(key, char);
            legend[char] = key;
          }
          row += char;
        }
        rows.push(row);
      }

      return respond(
        store,
        record,
        { bbox, format, transparentChar: ".", legend, rows, distinctColors: charByColor.size },
        false,
      );
    },
  );

  server.registerTool(
    "undo",
    {
      title: "Undo",
      description:
        "Revert the last N mutations (default 1). History depth is 24 checkpoints (bounded by a 48 MB snapshot budget for large canvases). Returns restored version and the undone operation labels.",
      inputSchema: {
        image_id: imageIdSchema,
        steps: z.number().int().min(1).max(24).optional(),
        preview: previewSchema,
      },
    },
    async (args) => {
      const { record, labels } = store.undo(args.image_id, args.steps ?? 1);
      return respond(store, record, { undone: labels }, args.preview ?? false);
    },
  );

  server.registerTool(
    "redo",
    {
      title: "Redo",
      description: "Re-apply previously undone mutations (default 1).",
      inputSchema: {
        image_id: imageIdSchema,
        steps: z.number().int().min(1).max(24).optional(),
        preview: previewSchema,
      },
    },
    async (args) => {
      const { record, labels } = store.redo(args.image_id, args.steps ?? 1);
      return respond(store, record, { redone: labels }, args.preview ?? false);
    },
  );

  server.registerTool(
    "view_image",
    {
      title: "View image",
      description:
        "Return a PNG thumbnail (nearest-neighbour, default max 384px; small sprites are upscaled) plus its temp file path, " +
        "so you can visually inspect the canvas without mutating it. " +
        "Pass frame to inspect a specific frame. onion_skin:true ghosts the previous frame underneath at 35% so you can check limb alignment.",
      inputSchema: {
        image_id: imageIdSchema,
        frame: z.number().int().min(0).max(MAX_FRAMES - 1).optional().describe("Frame to render (default: the active frame)."),
        onion_skin: z
          .boolean()
          .optional()
          .describe("Composite the previous frame underneath at low opacity (ignored for frame 0)."),
        max_size: z.number().int().min(16).max(1024).optional().describe("Longest side in pixels (default 384)."),
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      const frameIndex = args.frame ?? record.activeFrame;
      requireFrame(record, frameIndex);
      const onion = args.onion_skin ?? false;

      let canvas = record.frames[frameIndex]!.canvas;
      if (onion && frameIndex > 0) {
        const composed = new PixelCanvas(canvas.width, canvas.height);
        blendCanvas(composed, record.frames[frameIndex - 1]!.canvas, 0, 0, 0.35);
        blendCanvas(composed, canvas, 0, 0, 1);
        canvas = composed;
      }

      const file = await store.saveCanvasPreview(
        canvas,
        args.max_size ?? 384,
        `${record.id}-v${record.version}-f${frameIndex}${onion ? "-onion" : ""}`,
      );
      const meta = {
        ...canvasMeta(record),
        viewedFrame: frameIndex,
        onionSkin: onion && frameIndex > 0,
        previewPath: file.path,
        previewSize: `${file.width}x${file.height}`,
      };
      const content: Array<TextContent | ImageContent> = [
        { type: "text", text: JSON.stringify(meta) },
        { type: "image", data: file.png.toString("base64"), mimeType: "image/png" },
      ];
      return { content };
    },
  );

  server.registerTool(
    "export_image",
    {
      title: "Export PNG",
      description:
        "Encode the canvas as a PNG file on disk. Returns the absolute path and byte size. " +
        "Relative paths resolve against the server process working directory; a missing .png extension is added. " +
        "Existing files at that path are overwritten. Without a path, the file is written to the OS temp directory.",
      inputSchema: {
        image_id: imageIdSchema,
        frame: z.number().int().min(0).max(MAX_FRAMES - 1).optional().describe("Frame to export (default: the active frame)."),
        path: z.string().min(1).optional().describe("Destination path (PNG). Defaults to a temp file."),
        scale: z
          .number()
          .int()
          .min(1)
          .max(16)
          .optional()
          .describe("Integer nearest-neighbour upscale applied before encoding (default 1)."),
        preview: previewSchema,
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      const frameIndex = args.frame ?? record.activeFrame;
      requireFrame(record, frameIndex);
      const source = record.frames[frameIndex]!.canvas;
      const scale = args.scale ?? 1;
      const targetWidth = source.width * scale;
      const targetHeight = source.height * scale;
      if (targetWidth > MAX_EXPORT_SIDE || targetHeight > MAX_EXPORT_SIDE) {
        throw new Error(
          `Export at scale ${scale} would be ${targetWidth}x${targetHeight}; maximum side is ${MAX_EXPORT_SIDE}px.`,
        );
      }
      const output = scale === 1 ? source : resizeNearest(source, targetWidth, targetHeight);
      const png = encodePNG(output);

      let filePath: string;
      if (args.path) {
        let candidate = args.path;
        if (!extname(candidate)) candidate += ".png";
        if (extname(candidate).toLowerCase() !== ".png") {
          throw new Error("Only PNG export is supported; the path must end with .png.");
        }
        filePath = isAbsolute(candidate) ? candidate : resolve(process.cwd(), candidate);
      } else {
        filePath = join(PREVIEW_DIR, `${record.id}-v${record.version}-f${frameIndex}.png`);
      }

      await writePNGFile(filePath, png);
      return respond(
        store,
        record,
        {
          path: filePath,
          frame: frameIndex,
          width: output.width,
          height: output.height,
          scale,
          bytes: png.byteLength,
        },
        args.preview ?? false,
        384,
        source,
        `${record.id}-v${record.version}-f${frameIndex}`,
      );
    },
  );

  server.registerTool(
    "add_frame",
    {
      title: "Add frame",
      description:
        "Append or insert a blank frame and make it active. All frames share the canvas palette and dimensions, " +
        `so a cycle stays consistent. Up to ${MAX_FRAMES} frames per canvas; duration_ms is 1..${MAX_FRAME_MS} (default 100). ` +
        "Use clone_frame instead when the new frame should start from an existing pose.",
      inputSchema: {
        image_id: imageIdSchema,
        at: z
          .number()
          .int()
          .min(0)
          .max(MAX_FRAMES)
          .optional()
          .describe("Insert position (default: append at the end). 0 inserts before the first frame."),
        duration_ms: z.number().int().min(1).max(MAX_FRAME_MS).optional(),
        bg_color: colorSchema.optional().describe("Fill for the new frame; defaults to the canvas background (usually transparent)."),
        activate: z.boolean().optional().describe("Make the new frame the active one (default true)."),
        preview: previewSchema,
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      const background = args.bg_color === undefined ? undefined : parseColor(args.bg_color, record.palette);
      const { record: updated, index } = store.addFrame(args.image_id, {
        at: args.at,
        durationMs: args.duration_ms,
        background,
        activate: args.activate ?? true,
      });
      return respond(store, updated, { addedFrame: index, ...frameList(updated) }, args.preview ?? false);
    },
  );

  server.registerTool(
    "clone_frame",
    {
      title: "Clone frame",
      description:
        "Duplicate an existing frame (default: the active one) and insert the copy right after it. " +
        "This is the core loop for animation: clone, then move only the limbs that change with shift_rect or draw_pixels, " +
        "so the character's body and colours cannot drift between frames.",
      inputSchema: {
        image_id: imageIdSchema,
        from: z.number().int().min(0).max(MAX_FRAMES - 1).optional().describe("Source frame (default: the active frame)."),
        at: z.number().int().min(0).max(MAX_FRAMES).optional().describe("Insert position (default: right after the source)."),
        duration_ms: z
          .number()
          .int()
          .min(1)
          .max(MAX_FRAME_MS)
          .optional()
          .describe("Duration of the copy (default: same as the source frame)."),
        activate: z.boolean().optional().describe("Make the copy the active frame (default true)."),
        preview: previewSchema,
      },
    },
    async (args) => {
      const { record: updated, index } = store.cloneFrame(args.image_id, {
        from: args.from,
        at: args.at,
        durationMs: args.duration_ms,
        activate: args.activate ?? true,
      });
      return respond(store, updated, { clonedFrame: index, ...frameList(updated) }, args.preview ?? false);
    },
  );

  server.registerTool(
    "select_frame",
    {
      title: "Select frame",
      description:
        "Move the editing cursor to another frame. Switching is not an undoable edit; " +
        "pass duration_ms to also set that frame's playback duration (which does create an undo checkpoint). " +
        "Every drawing tool operates on the active frame.",
      inputSchema: {
        image_id: imageIdSchema,
        index: z.number().int().min(0).max(MAX_FRAMES - 1),
        duration_ms: z.number().int().min(1).max(MAX_FRAME_MS).optional(),
        preview: previewSchema,
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      requireFrame(record, args.index);
      const updated = store.selectFrame(args.image_id, args.index, args.duration_ms);
      return respond(store, updated, frameList(updated), args.preview ?? false);
    },
  );

  server.registerTool(
    "shift_rect",
    {
      title: "Shift region",
      description:
        "Move the opaque pixels of a rectangle by (dx, dy) inside the active frame. " +
        'clear controls what stays behind: "transparent" (default) empties the selection, "keep" stamps a copy without ' +
        "clearing, or a colour fills the vacated area. Transparent pixels inside the selection are not copied, so moving " +
        "an arm over the torso does not punch holes in it. Ideal for one-pixel limb offsets in a walk cycle.",
      inputSchema: {
        image_id: imageIdSchema,
        x: coordSchema,
        y: coordSchema,
        width: positiveSizeSchema,
        height: positiveSizeSchema,
        dx: z.number().int().min(COORD_MIN).max(COORD_MAX).describe("Horizontal offset in pixels (may be negative)."),
        dy: z.number().int().min(COORD_MIN).max(COORD_MAX).describe("Vertical offset in pixels (may be negative)."),
        clear: z
          .union([z.literal("keep"), colorSchema])
          .optional()
          .describe('What to leave in the vacated area: "transparent" (default), "keep", or a colour.'),
        preview: previewSchema,
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      const clear: RGBA | null =
        args.clear === "keep" ? null : parseColor(args.clear ?? "transparent", record.palette);

      const { result, record: updated } = store.mutate(record.id, "shift_rect", (rec) =>
        shiftRect(
          rec.canvas,
          { x: args.x, y: args.y, width: args.width, height: args.height },
          args.dx,
          args.dy,
          clear,
        ),
      );

      return respond(
        store,
        updated,
        { dx: args.dx, dy: args.dy, clear: args.clear === "keep" ? "keep" : rgbaToHex(clear!), ...result },
        args.preview ?? false,
      );
    },
  );

  server.registerTool(
    "render_contact_sheet",
    {
      title: "Render contact sheet",
      description:
        "Layout every frame on one image so you can judge motion continuity at a glance. " +
        'Frames sit on a checkerboard by default. onion_skin:true ghosts each frame\'s predecessor under it, ' +
        "which makes position drift obvious. Returns the image plus the grid layout; nothing is written to the canvas store.",
      inputSchema: {
        image_id: imageIdSchema,
        columns: z.number().int().min(1).max(MAX_FRAMES).optional().describe("Frames per row (default: single row up to 6, otherwise a near-square grid)."),
        scale: z.number().int().min(1).max(16).optional().describe("Integer upscale (default: chosen to fit max_size)."),
        gap: z.number().int().min(0).max(64).optional().describe("Spacing between cells in output pixels (default 2)."),
        background: z
          .union([z.literal("checker"), colorSchema])
          .optional()
          .describe('Backdrop: "checker" (default) or a colour.'),
        onion_skin: z.boolean().optional(),
        onion_opacity: z.number().min(0.05).max(1).optional().describe("Ghost opacity for onion skin (default 0.35)."),
        max_size: z.number().int().min(64).max(1024).optional().describe("Longest side of the returned preview (default 640)."),
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      const columns = Math.min(record.frameCount, args.columns ?? autoColumns(record.frameCount));
      const gap = args.gap ?? 2;
      const rows = Math.ceil(record.frameCount / columns);
      const maxSize = args.max_size ?? 640;
      const scale =
        args.scale ?? autoScale(record.canvas.width, record.canvas.height, columns, rows, gap, maxSize);
      const background =
        args.background === undefined || args.background === "checker"
          ? ("checker" as const)
          : parseColor(args.background, record.palette);

      const sheet = buildSheet(record.frames, {
        columns,
        gap,
        scale,
        background,
        onionSkin: args.onion_skin ?? false,
        onionOpacity: args.onion_opacity,
      });
      const file = await store.saveCanvasPreview(
        sheet.canvas,
        maxSize,
        `${record.id}-sheet-v${record.version}`,
      );
      const meta = {
        ...canvasMeta(record),
        layout: sheet.layout,
        totalDurationMs: record.totalDurationMs,
        onionSkin: args.onion_skin ?? false,
        previewPath: file.path,
        previewSize: `${file.width}x${file.height}`,
      };
      const content: Array<TextContent | ImageContent> = [
        { type: "text", text: JSON.stringify(meta) },
        { type: "image", data: file.png.toString("base64"), mimeType: "image/png" },
      ];
      return { content };
    },
  );

  server.registerTool(
    "export_animation",
    {
      title: "Export animation",
      description:
        "Write the frame sequence to disk. format:\n" +
        '- "sprite_sheet": one PNG grid; columns defaults to a single row, gap spaces the cells.\n' +
        '- "gif": looping GIF89a, 1-bit transparency, exact palette while the art uses <=255 colours.\n' +
        '- "apng": animated PNG, keeps 8-bit alpha (use this for soft edges or semi-transparent ghosts).\n' +
        '- "frames": one PNG per frame in the given directory.\n' +
        "path defaults to the OS temp directory; relative paths resolve against the server working directory. " +
        "scale is an integer nearest-neighbour upscale applied to every frame before encoding.",
      inputSchema: {
        image_id: imageIdSchema,
        format: z.enum(["sprite_sheet", "gif", "apng", "frames"]),
        path: z
          .string()
          .min(1)
          .optional()
          .describe("Output file (sprite_sheet/gif/apng) or directory (frames). Defaults to the OS temp directory."),
        scale: z.number().int().min(1).max(16).optional().describe("Integer upscale per frame (default 1)."),
        columns: z.number().int().min(1).max(MAX_FRAMES).optional().describe("sprite_sheet only: frames per row (default: one row)."),
        gap: z.number().int().min(0).max(64).optional().describe("sprite_sheet only: spacing in output pixels (default 0)."),
        loop: z.boolean().optional().describe("gif/apng only: loop forever (default true)."),
        background: colorSchema.optional().describe('sprite_sheet only: gap fill, default "transparent".'),
      },
    },
    async (args) => {
      const record = store.get(args.image_id);
      const scale = args.scale ?? 1;
      const frameWidth = record.canvas.width * scale;
      const frameHeight = record.canvas.height * scale;
      if (frameWidth > MAX_EXPORT_SIDE || frameHeight > MAX_EXPORT_SIDE) {
        throw new Error(
          `Export at scale ${scale} would make each frame ${frameWidth}x${frameHeight}; maximum side is ${MAX_EXPORT_SIDE}px.`,
        );
      }
      const base = {
        format: args.format,
        scale,
        frameWidth,
        frameHeight,
        frameCount: record.frameCount,
        durationsMs: record.frames.map((frame) => frame.durationMs),
        totalDurationMs: record.totalDurationMs,
      };

      if (args.format === "sprite_sheet") {
        const columns = args.columns ?? record.frameCount;
        const gap = args.gap ?? 0;
        const background =
          args.background === undefined ? ([0, 0, 0, 0] as RGBA) : parseColor(args.background, record.palette);
        const sheet = buildSheet(record.frames, { columns, gap, scale, background });
        const filePath = resolveFileOutput(args.path, `${record.id}-sheet.png`, ".png");
        const png = encodePNG(sheet.canvas);
        await writePNGFile(filePath, png);
        return respond(
          store,
          record,
          {
            ...base,
            path: filePath,
            bytes: png.byteLength,
            sheetWidth: sheet.layout.width,
            sheetHeight: sheet.layout.height,
            columns: sheet.layout.columns,
            rows: sheet.layout.rows,
            spacing: sheet.layout.gap,
          },
          false,
        );
      }

      if (args.format === "frames") {
        const directory = resolveDirOutput(args.path, `${record.id}-frames`);
        const canvases = scaledFrameCanvases(record, scale);
        const files: string[] = [];
        for (let i = 0; i < canvases.length; i++) {
          const filePath = join(directory, `frame_${String(i).padStart(2, "0")}.png`);
          await writePNGFile(filePath, encodePNG(canvases[i]!));
          files.push(filePath);
        }
        return respond(store, record, { ...base, directory, files }, false);
      }

      const canvases = scaledFrameCanvases(record, scale);
      const durations = record.frames.map((frame) => frame.durationMs);
      const loop = args.loop ?? true;
      const buffer =
        args.format === "gif" ? encodeGIF(record.frames.map((frame, i) => ({ canvas: canvases[i]!, durationMs: frame.durationMs })), loop) : encodeAPNG(canvases, durations, loop);
      const filePath =
        args.format === "apng"
          ? resolveFileOutput(args.path, `${record.id}.png`, ".png", [".png", ".apng"])
          : resolveFileOutput(args.path, `${record.id}.${args.format}`, `.${args.format}`);
      await writeFileBuffer(filePath, buffer);
      return respond(store, record, { ...base, path: filePath, bytes: buffer.byteLength, loop }, false);
    },
  );

  return server;
}
