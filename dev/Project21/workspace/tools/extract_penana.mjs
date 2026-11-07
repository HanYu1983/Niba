/**
 * Penana chapter export -> clean novel text.
 *
 *   node workspace/tools/extract_penana.mjs --story test_story3
 *   node workspace/tools/extract_penana.mjs --story test_story3 --html story_ch0.html --out story_ch0.txt
 *
 * The export interleaves the novel with per-paragraph copyright spans, so the file the
 * plan slices has to be the story text, not the raw HTML. Every <p> that carries story
 * text becomes one line; watermark paragraphs and `display:none` blocks are dropped.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

import { parseArgs } from "../lib/args.mjs";
import { loadStory } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0] });

const htmlFile = args.html && args.html !== true
  ? resolve(String(args.html))
  : resolve(story.dir, readdirSync(story.dir).filter((f) => /^story.*\.html$/i.test(f)).sort()[0] ?? "");

if (!htmlFile || !existsSync(htmlFile)) {
  console.error(`no story html in ${story.dir} — pass --html`);
  process.exit(2);
}

const outFile = args.out && args.out !== true
  ? resolve(String(args.out))
  : resolve(story.dir, `${basename(htmlFile, extname(htmlFile))}.txt`);

const html = readFileSync(htmlFile, "utf8");
const paragraphs = [...html.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)]
  .filter(([, attrs]) => !/display\s*:\s*none/i.test(attrs))
  .map(([, , inner]) =>
    inner
      .replace(/<span\b[^>]*\bclass="w-s-[^"]*"[^>]*>[\s\S]*?<\/span>/g, "")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim()
  )
  .filter((text) => text !== "")
  .filter((text) => !/copyright|ＰＥＮＡＮＡ/i.test(text));

const text = paragraphs.join("\n");
// No trailing newline: the file bytes are exactly the string the plan hashes.
writeFileSync(outFile, text, "utf8");

console.log(
  JSON.stringify(
    {
      html: htmlFile,
      out: outFile,
      paragraphs: paragraphs.length,
      chars: [...text].length,
      utf16_length: text.length,
      sha256: createHash("sha256").update(text).digest("hex")
    },
    null,
    2
  )
);
