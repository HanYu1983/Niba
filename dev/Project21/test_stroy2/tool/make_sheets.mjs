import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const project = JSON.parse(
  fs.readFileSync(path.join(ROOT, "momotaro.json"), "utf8")
);
const refsRoot = path.join(ROOT, "..", "output", "refs");
const outRoot = path.join(ROOT, "build", "sheets");

const pick = (id) => {
  const dir = path.join(refsRoot, id);
  if (!fs.existsSync(dir)) return null;
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.png$/i.test(f))
    .map((f) => {
      const full = path.join(dir, f);
      return { full, mtime: fs.statSync(full).mtimeMs, name: f };
    })
    .sort((a, b) => b.mtime - a.mtime);
  return files[0]?.full ?? null;
};

const groups = { characters: [], props: [], locations: [] };
for (const group of Object.keys(groups)) {
  for (const entity of project.entities[group]) {
    const file = pick(entity.id);
    groups[group].push({
      label: `${entity.id}${file ? ` [${path.basename(file)}]` : " [no file]"}`,
      path: file ?? "",
    });
  }
}

fs.mkdirSync(outRoot, { recursive: true });
for (const [group, items] of Object.entries(groups)) {
  const file = path.join(outRoot, `${group}.json`);
  fs.writeFileSync(file, JSON.stringify(items, null, 2), "utf8");
  const missing = items.filter((i) => !i.path).length;
  console.log(`${group}: ${items.length} tiles, ${missing} missing -> ${file}`);
}
