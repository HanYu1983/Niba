import { PixelCanvas } from "../core/pixelCanvas.js";
import { encodePNG } from "./codec.js";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

let crcTable: Uint32Array | undefined;

function crc32(buffer: Buffer): number {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = crcTable[(crc ^ buffer[i]!) & 0xff]! ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 4, "latin1");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function readChunks(png: Buffer): Array<{ type: string; data: Buffer }> {
  const chunks: Array<{ type: string; data: Buffer }> = [];
  let offset = 8;
  while (offset + 8 <= png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("latin1", offset + 4, offset + 8);
    chunks.push({ type, data: png.subarray(offset + 8, offset + 8 + length) });
    offset += 12 + length;
    if (type === "IEND") break;
  }
  return chunks;
}

/**
 * Build an animated PNG from full-canvas frames. Each frame is encoded by pngjs
 * and its IDAT stream is re-wrapped as fdAT, so the zlib data is reused as-is.
 */
export function encodeAPNG(frames: PixelCanvas[], durationsMs: number[], loop = true): Buffer {
  if (frames.length === 0) throw new Error("APNG needs at least one frame.");
  const width = frames[0]!.width;
  const height = frames[0]!.height;
  for (let i = 1; i < frames.length; i++) {
    if (frames[i]!.width !== width || frames[i]!.height !== height) {
      throw new Error(`APNG frames must share one size; frame ${i} differs from frame 0.`);
    }
  }
  if (durationsMs.length !== frames.length) {
    throw new Error("APNG needs one duration per frame.");
  }

  const encoded = frames.map((frame) => readChunks(encodePNG(frame)));
  const ihdr = encoded[0]!.find((entry) => entry.type === "IHDR");
  if (!ihdr) throw new Error("Encoded frame is missing its IHDR chunk.");

  const parts: Buffer[] = [PNG_SIGNATURE, chunk("IHDR", ihdr.data)];

  const actl = Buffer.alloc(8);
  actl.writeUInt32BE(frames.length, 0);
  actl.writeUInt32BE(loop ? 0 : 1, 4);
  parts.push(chunk("acTL", actl));

  let sequence = 0;
  for (let i = 0; i < frames.length; i++) {
    const fcTL = Buffer.alloc(26);
    fcTL.writeUInt32BE(sequence++, 0);
    fcTL.writeUInt32BE(width, 4);
    fcTL.writeUInt32BE(height, 8);
    fcTL.writeUInt32BE(0, 12);
    fcTL.writeUInt32BE(0, 16);
    fcTL.writeUInt16BE(Math.max(1, Math.min(0xffff, Math.round(durationsMs[i]!))), 20);
    fcTL.writeUInt16BE(1000, 22);
    fcTL.writeUInt8(0, 24);
    fcTL.writeUInt8(0, 25);
    parts.push(chunk("fcTL", fcTL));

    for (const entry of encoded[i]!) {
      if (entry.type !== "IDAT") continue;
      if (i === 0) {
        parts.push(chunk("IDAT", entry.data));
        continue;
      }
      const fdAT = Buffer.alloc(4 + entry.data.length);
      fdAT.writeUInt32BE(sequence++, 0);
      entry.data.copy(fdAT, 4);
      parts.push(chunk("fdAT", fdAT));
    }
  }

  parts.push(chunk("IEND", Buffer.alloc(0)));
  return Buffer.concat(parts);
}
