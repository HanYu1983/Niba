import { existsSync, readdirSync, statSync } from "node:fs";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { entities } from "./data_entities.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const outputDir = JSON.parse(readFileSync(resolve(HERE, "../comfyui_mcp/metadata.json"), "utf8")).comfyui.output_dir;

const all = [
  ...entities.characters.map((e) => ({ ...e, kind: "character" })),
  ...entities.props.map((e) => ({ ...e, kind: "prop" })),
  ...entities.locations.map((e) => ({ ...e, kind: "location" }))
];

const rows = all.map((e) => {
  const dir = resolve(outputDir, "refs", e.id);
  const files = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
        .map((f) => ({ f, t: statSync(resolve(dir, f)).mtimeMs }))
        .sort((a, b) => b.t - a.t)
    : [];
  return { id: e.id, kind: e.kind, status: e.reference.status, plates: files.map((x) => x.f) };
});

const missing = rows.filter((r) => r.plates.length === 0);
console.log(
  rows
    .map((r) => `${r.plates.length ? "OK " : "MISS"} ${r.kind.padEnd(9)} ${r.id.padEnd(24)} ${r.status.padEnd(11)} ${r.plates.join(",") || "-"}`)
    .join("\n")
);
console.log(JSON.stringify({ total: rows.length, with_plate: rows.length - missing.length, missing: missing.map((m) => m.id), extra_plates: rows.filter((r) => r.plates.length > 1).map((r) => `${r.id}:${r.plates.length}`) }, null, 2));
