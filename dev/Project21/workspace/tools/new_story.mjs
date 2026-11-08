/**
 * Scaffold a new story folder.
 *
 *   node workspace/tools/new_story.mjs --name my_story --title "第一章"
 *   node workspace/tools/new_story.mjs --dir stories/my_story --name my_story
 *
 * Creates the canonical layout the rest of workspace/ assumes:
 *
 *   <dir>/
 *     story.json
 *     plan.ch0.json
 *     prompts/
 *     output/{render,video}
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

import { boolArg, parseArgs, usage } from "../lib/args.mjs";

const args = parseArgs();
const name = args.name && args.name !== true ? String(args.name) : null;
if (!name) usage("missing --name", ["usage: node workspace/tools/new_story.mjs --name <story> [--dir <folder>] [--title <title>] [--force]"]);

const dir = resolve(String(args.dir ?? name));
const force = boolArg(args, "force", false);

if (existsSync(dir) && !force) {
  console.error(`${dir} already exists — pass --force to add the missing files only`);
  process.exit(1);
}

const files = {
  "story.json": JSON.stringify(
    {
      version: 1,
      name,
      title: args.title && args.title !== true ? String(args.title) : name,
      plan: "plan.ch0.json",
      prompts: "prompts",
      output: "output",
      render: { width: 352, height: 608, fps: 24, turbo: true },
      subtitles: { lang: "zh-Hant", rate: 6.2, maxLine: 15, protect: [] }
    },
    null,
    2
  ) + "\n",
  "plan.ch0.json": JSON.stringify(
    {
      version: "1.0",
      stage: "plan",
      project_title: name,
      source: { file: null, sha256: null, chars: 0 },
      entities: { characters: [], props: [], locations: [] },
      segments: []
    },
    null,
    2
  ) + "\n",
  "prompts/.gitkeep": ""
};

for (const d of ["", "prompts", "output/render", "output/video"]) {
  mkdirSync(resolve(dir, d), { recursive: true });
}

const written = [];
for (const [rel, content] of Object.entries(files)) {
  const file = resolve(dir, rel);
  if (existsSync(file) && !force) continue;
  writeFileSync(file, content, "utf8");
  written.push(file);
}

console.log(
  JSON.stringify(
    {
      story: dir,
      name,
      title: args.title ?? name,
      written,
      next: [
        `edit ${resolve(dir, "story.json")} (render size, subtitle protect words)`,
        `write ${resolve(dir, "plan.ch0.json")} or generate it with a story-specific builder`,
        `write ${resolve(dir, "prompts")}/seg_001.t2v.txt`,
        `node workspace/tools/verify_plan.mjs --story ${dir}`,
        `node workspace/tools/generate_refs.mjs --story ${dir}`,
        `node workspace/tools/render_all.mjs --story ${dir}`
      ]
    },
    null,
    2
  )
);
