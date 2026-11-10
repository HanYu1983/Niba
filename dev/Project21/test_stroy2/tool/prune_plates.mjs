import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const project = JSON.parse(
  fs.readFileSync(path.join(ROOT, "momotaro.json"), "utf8")
);
const refsRoot = path.join(ROOT, "..", "output", "refs");
const dryRun = !process.argv.includes("--apply");

const keep = {
  char_momo: "plate_00004_.png",
  prop_travel_orb: "plate_00002_.png",
  loc_dock: "plate_00001_.png",
};

const ids = [
  ...project.entities.characters,
  ...project.entities.props,
  ...project.entities.locations,
].map((e) => e.id);

let removed = 0;
let kept = 0;
const problems = [];

for (const id of ids) {
  const dir = path.join(refsRoot, id);
  if (!fs.existsSync(dir)) {
    problems.push(`${id}: folder missing`);
    continue;
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.png$/i.test(f))
    .map((f) => ({ f, m: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m);
  if (!files.length) {
    problems.push(`${id}: no png`);
    continue;
  }
  const chosen = keep[id] ?? files[0].f;
  if (!files.some((x) => x.f === chosen)) {
    problems.push(`${id}: keep target ${chosen} not found`);
    continue;
  }
  kept += 1;
  for (const file of files) {
    if (file.f === chosen) continue;
    removed += 1;
    if (!dryRun) fs.unlinkSync(path.join(dir, file.f));
  }
  if (files.length > 1) {
    console.log(`${id}: keep ${chosen}, drop ${files.filter((x) => x.f !== chosen).map((x) => x.f).join(", ")}`);
  }
}

console.log(
  `${dryRun ? "DRY RUN" : "APPLIED"}: ${kept} entities kept, ${removed} files ${dryRun ? "would be removed" : "removed"}`
);
if (problems.length) {
  console.log("problems:");
  for (const p of problems) console.log(" -", p);
  process.exitCode = 1;
}
