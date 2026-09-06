import { PNG } from "pngjs";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// 用法: node chromakey.js <input.png> [output.png] [--key RRGGBB] [--tol N] [--soft N] [--despill]
// 例:  node chromakey.js gen_assets/gen_gen_00003_.png potion_nobg.png --tol 80 --soft 40 --despill
const argv = process.argv.slice(2);
const input = argv[0];
if (!input) {
  console.error("用法: node chromakey.js <input.png> [output.png] [--key RRGGBB] [--tol N] [--soft N] [--despill]");
  process.exit(1);
}

const flags = {};
let output;
for (let i = 1; i < argv.length; i++) {
  if (argv[i].startsWith("--")) {
    const k = argv[i].slice(2);
    const v = argv[i + 1];
    flags[k] = v !== undefined && !v.startsWith("--") ? v : true;
    if (flags[k] !== true) i++;
  } else {
    output = argv[i];
  }
}

// 取參考背景色：預設=四角取平均
let kr, kg, kb;
if (flags.key) {
  const v = parseInt(String(flags.key).replace(/^#/, ""), 16);
  kr = (v >> 16) & 255; kg = (v >> 8) & 255; kb = v & 255;
} else {
  const png0 = PNG.sync.read(readFileSync(input));
  const { width: w, height: h, data: d } = png0;
  const avg = (x0, y0) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = y0; y < Math.min(h, y0 + 24); y++)
      for (let x = x0; x < Math.min(w, x0 + 24); x++) {
        const i = (y * w + x) * 4;
        r += d[i]; g += d[i + 1]; b += d[i + 2]; n++;
      }
    return [r / n, g / n, b / n];
  };
  const cs = [avg(0, 0), avg(w - 24, 0), avg(0, h - 24), avg(w - 24, h - 24)];
  kr = (cs[0][0] + cs[1][0] + cs[2][0] + cs[3][0]) / 4;
  kg = (cs[0][1] + cs[1][1] + cs[2][1] + cs[3][1]) / 4;
  kb = (cs[0][2] + cs[1][2] + cs[2][2] + cs[3][2]) / 4;
}

const tol = Number(flags.tol ?? 90);
const soft = Number(flags.soft ?? 40);
const despill = flags.despill !== undefined;

const png = PNG.sync.read(readFileSync(input));
const { width, height, data } = png;
let op = 0, clr = 0, part = 0;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const dr = r - kr, dg = g - kg, db = b - kb;
  const d = Math.max(Math.abs(dr), Math.abs(dg), Math.abs(db));
  let a = 255;
  if (d < tol) a = 0;
  else if (d < tol + soft) a = Math.round(((d - tol) / soft) * 255);
  if (a === 0) clr++;
  else if (a < 255) part++;
  else op++;
  data[i + 3] = a;
  if (despill && a > 0 && kg >= kr && kg >= kb) {
    const m = Math.max(dr, db, 0);
    data[i + 1] = Math.max(0, Math.round(g - m * 0.6));
  }
}

// 不透明區域的包圍盒
let minX = width, minY = height, maxX = -1, maxY = -1;
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] > 8) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

const outFile = resolve(output || input.replace(/\.png$/i, "_nobg.png"));
writeFileSync(outFile, PNG.sync.write(png));
const total = width * height;
const hex = (v) => Math.round(v).toString(16).padStart(2, "0");
console.log(`[chromakey] key=#${hex(kr)}${hex(kg)}${hex(kb)}` + ` tol=${tol} soft=${soft}`);
console.log(`[chromakey] 全透明=${(clr / total * 100).toFixed(1)}% 半透明=${(part / total * 100).toFixed(1)}% 不透明=${(op / total * 100).toFixed(1)}%`);
console.log(`[chromakey] 主體內容框: x=${minX} y=${minY} w=${maxX - minX + 1} h=${maxY - minY + 1}`);
console.log(`[chromakey] saved ${outFile}`);