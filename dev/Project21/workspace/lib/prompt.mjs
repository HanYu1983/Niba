/**
 * Read what is inside a prompt file: the three-field / six-field sections, the `[Shot N]`
 * cut points, and the `<d>` dialogue blocks.
 *
 * The render pipeline only passes the file through unchanged; this module exists so the
 * checks and the subtitle builder can read the same timing the model was given.
 */
import { existsSync, readFileSync } from "node:fs";

export function readPrompt(file) {
  if (!existsSync(file)) return null;
  return readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

/** "r2v" | "t2v" | "unknown" from the field names the prompt uses. */
export function formatOf(text) {
  if (/^\s*subject_definitions\s*:/im.test(text)) return "r2v";
  if (/^\s*integrated_multimodal_description\s*:/im.test(text)) return "t2v";
  if (/^\s*detailed_description\s*:/im.test(text)) return "r2v";
  return "unknown";
}

/** Top-level `field: value` blocks, in file order. */
export function fieldsOf(text) {
  const fields = {};
  const matches = [...text.matchAll(/^([a-z_]+):[ \t]*(.*)$/gim)];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    fields[matches[i][1].toLowerCase()] = text.slice(start, end).trim();
  }
  return fields;
}

/**
 * Split on `[Shot N]`. The first shot has no timestamp by design, so its anchor is 0.
 * r2v prompts use a `00:00-00:05` range instead of `At`; that form is read too.
 */
export function splitShots(text) {
  const parts = text.split(/(?=\[Shot \d+\])/).slice(1);
  const shots = [];
  for (const part of parts) {
    const index = Number((part.match(/^\[Shot (\d+)\]/) ?? [])[1] ?? 0);
    const at = part.match(/\bAt\s+(?:(\d{2}):)?(\d{2}):(\d{2})\.(\d{3})/);
    const shortAt = at ? null : part.match(/\bAt\s+(\d{2}):(\d{2})\.(\d{3})/);
    const range = at || shortAt ? null : part.match(/^\s*(\d{2}):(\d{2})\s*[-–]/);

    let anchor = 0;
    if (at) anchor = (Number(at[1] ?? 0) * 3600) + Number(at[2]) * 60 + Number(at[3]) + Number(at[4]) / 1000;
    else if (shortAt) anchor = Number(shortAt[1]) * 60 + Number(shortAt[2]) + Number(shortAt[3]) / 1000;
    else if (range) anchor = Number(range[1]) * 60 + Number(range[2]);

    const lines = dLines(part);
    shots.push({ index, anchor, lines, text: part });
  }
  return shots;
}

/** Every dialogue line in the text, flattened in order. */
export function dLines(text) {
  return [...text.matchAll(/<d>\s*(?:\[[^\]]*\]\s*)?([\s\S]*?)<\/d>/g)]
    .flatMap((m) => m[1].split("\n"))
    .map((line) => line.trim())
    .filter(Boolean);
}

export function dBlocks(text) {
  return [...text.matchAll(/<d>\s*(?:\[[^\]]*\]\s*)?([\s\S]*?)<\/d>/g)].map((m) =>
    m[1]
      .split("\n")
      .map((line) => line.replace(/<[^>]+>/g, "").trim())
      .filter(Boolean)
  );
}

/** Characters that will be spoken, with whitespace removed. */
export function spokenChars(text) {
  return [...text.replace(/\s+/g, "")].join("");
}

/** The opening of [Shot 1], used to compare the style lock across a whole story. */
export function shotOneOpening(text, chars = 120) {
  const i = text.indexOf("[Shot 1]");
  if (i === -1) return "";
  const body = text.slice(i + "[Shot 1]".length).trimStart();
  return [...body].slice(0, chars).join("");
}

/**
 * Symbols the TTS will read aloud or choke on. Returns the offending matches with context.
 * Exempts `[中文]`-style language tags and anything outside `<d>` blocks.
 */
export function spokenSymbolIssues(text) {
  const issues = [];
  for (const block of dBlocks(text)) {
    for (const line of block) {
      const bad = [];
      if (/%/.test(line)) bad.push("%");
      if (/[0-9]/.test(line)) bad.push("digit");
      if (/[A-Za-z]/.test(line)) bad.push("latin");
      if (/[「」『』]/.test(line)) bad.push("quote");
      if (/：/.test(line)) bad.push("colon");
      if (/——/.test(line)) bad.push("em-dash");
      if (/[&#@*]/.test(line)) bad.push("symbol");
      if (bad.length) issues.push({ line, symbols: [...new Set(bad)] });
    }
  }
  return issues;
}
