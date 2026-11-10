import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const refsRoot = path.join(ROOT, "..", "output", "refs");

const ids = process.argv.slice(2);
const out = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : path.join(HERE, "sheets", "subset.json");

const items = ids
  .filter((id) => id !== "--out" && !id.startsWith("--"))
  .map((id) => {
    const dir = path.join(refsRoot, id);
    const files = fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((f) => /\.png$/i.test(f))
          .map((f) => ({ f, m: fs.statSync(path.join(dir, f)).mtimeMs }))
          .sort((a, b) => b.m - a.m)
      : [];
    const file = files[0] ? path.join(dir, files[0].f) : "";
    return { label: `${id}${file ? ` [${path.basename(file)}]` : " [none]"}`, path: file };
  });

fs.writeFileSync(out, JSON.stringify(items, null, 2), "utf8");
console.log(`${items.length} tiles -> ${out}`);
