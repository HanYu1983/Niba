import { GIFEncoder, applyPalette, quantize } from "gifenc/dist/gifenc.esm.js";
import { PixelCanvas } from "../core/pixelCanvas.js";

export interface GifFrame {
  canvas: PixelCanvas;
  durationMs: number;
}

const ALPHA_THRESHOLD = 128;

interface ExactPalette {
  palette: number[][];
  indices: Uint8Array[];
}

/** Exact global palette when the sprite uses 255 colours or fewer (the normal case). */
function buildExactPalette(frames: GifFrame[]): ExactPalette | null {
  const lookup = new Map<number, number>();
  for (const frame of frames) {
    const data = frame.canvas.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3]! < ALPHA_THRESHOLD) continue;
      const key = (data[i]! << 16) | (data[i + 1]! << 8) | data[i + 2]!;
      if (lookup.has(key)) continue;
      if (lookup.size >= 255) return null;
      lookup.set(key, lookup.size + 1);
    }
  }

  const palette: number[][] = [[0, 0, 0, 0]];
  for (const key of lookup.keys()) palette.push([(key >> 16) & 0xff, (key >> 8) & 0xff, key & 0xff, 255]);
  if (palette.length < 2) palette.push([0, 0, 0, 255]);

  const indices = frames.map((frame) => {
    const source = frame.canvas.data;
    const out = new Uint8Array(frame.canvas.width * frame.canvas.height);
    const data = source;
    for (let p = 0, i = 0; i < data.length; i += 4, p++) {
      out[p] =
        data[i + 3]! < ALPHA_THRESHOLD ? 0 : lookup.get((data[i]! << 16) | (data[i + 1]! << 8) | data[i + 2]!)!;
    }
    return out;
  });

  return { palette, indices };
}

function buildQuantizedPalette(frames: GifFrame[], width: number, height: number): ExactPalette {
  const combined = new Uint8Array(frames.length * width * height * 4);
  frames.forEach((frame, i) => combined.set(new Uint8Array(frame.canvas.data), i * width * height * 4));

  const quantized = quantize(combined, 255, { format: "rgba4444" });
  const palette: number[][] = [[0, 0, 0, 0]];
  for (const color of quantized) {
    palette.push([color[0]!, color[1]!, color[2]!, color[3] ?? 255]);
    if (palette.length >= 256) break;
  }

  const indices = frames.map((frame) => applyPalette(new Uint8Array(frame.canvas.data), palette, "rgba4444"));
  return { palette, indices };
}

/** Encode frames as a looping GIF89a with a 1-bit transparent index. */
export function encodeGIF(frames: GifFrame[], loop = true): Buffer {
  if (frames.length === 0) throw new Error("GIF needs at least one frame.");
  const width = frames[0]!.canvas.width;
  const height = frames[0]!.canvas.height;
  for (let i = 1; i < frames.length; i++) {
    if (frames[i]!.canvas.width !== width || frames[i]!.canvas.height !== height) {
      throw new Error(`GIF frames must share one size; frame ${i} differs from frame 0.`);
    }
  }

  const built = buildExactPalette(frames) ?? buildQuantizedPalette(frames, width, height);

  const encoder = GIFEncoder();
  for (let i = 0; i < frames.length; i++) {
    encoder.writeFrame(built.indices[i]!, width, height, {
      palette: i === 0 ? built.palette : undefined,
      delay: Math.max(20, Math.round(frames[i]!.durationMs)),
      transparent: true,
      transparentIndex: 0,
      repeat: i === 0 ? (loop ? 0 : -1) : undefined,
      dispose: 2,
    });
  }
  encoder.finish();
  return Buffer.from(encoder.bytes());
}
