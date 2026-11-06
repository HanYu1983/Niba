/**
 * story_ch0.html -> story_ch0.txt
 *
 * The Penana export interleaves the novel with per-paragraph copyright spans, so the
 * "source" the plan slices has to be the story text, not the raw HTML. Every <p> that
 * carries story text becomes one line; the watermark paragraphs are dropped.
 *
 * Run: node extract_story.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

const html = readFileSync(resolve(HERE, "story_ch0.html"), "utf8");

const paragraphs = [...html.matchAll(/<p\b([^>]*)>([\s\S]*?)<\/p>/g)]
  .filter(([, attrs]) => !/display\s*:\s*none/i.test(attrs))
  .map(([, , inner]) =>
    inner
      // the anti-copy span sits at the end of every paragraph; its attributes wrap
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
  // trailing "94Please respect copyright." filler
  .filter((text) => !/copyright|ＰＥＮＡＮＡ/i.test(text));

const story = paragraphs.join("\n");

// No trailing newline: the file bytes are exactly the string the plan hashes.
writeFileSync(resolve(HERE, "story_ch0.txt"), story, "utf8");

const sha256 = createHash("sha256").update(story).digest("hex");
console.log(
  JSON.stringify(
    {
      paragraphs: paragraphs.length,
      chars: [...story].length,
      utf16_length: story.length,
      sha256,
      first_paragraphs: paragraphs.slice(0, 4),
      last_paragraphs: paragraphs.slice(-4)
    },
    null,
    2
  )
);
