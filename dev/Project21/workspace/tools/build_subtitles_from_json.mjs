/**
 * Build YouTube subtitles from a plain story.json `shots` list, scaled to the real film length.
 *
 *   node workspace/tools/build_subtitles_from_json.mjs .\test_story5\story.json --duration 144.95
 *   node workspace/tools/build_subtitles_from_json.mjs --json .\test_story5\story.json --film .\test_story5\output\video\merged.mp4
 *   node workspace/tools/build_subtitles_from_json.mjs --json ... --duration 144.95 --out .\final.zh-Hant.srt
 *
 * Timing: shot boundaries come from each shot.duration, then every timestamp is multiplied by
 * `actual / sum(shot.duration)`. Dialog is split into readable cues and paced by speaking rate.
 * Output: `<story base>.<lang>.srt` (and `.vtt` beside it) unless --out is given.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, resolve } from "node:path";

import { boolArg, listArg, numArg, parseArgs, usage } from "../lib/args.mjs";
import { probe } from "../lib/media.mjs";
import { stamp, tidyCues, toSrt, toVtt, wrapLine } from "../lib/subtitle.mjs";

const INTERNAL_RE = /internally|internal monologue|voiceover|voice-over|thinking|mind/i;
const MIN_DUR = 0.8;
const LEAD = 0.12;
const TAIL = 0.05;

const args = parseArgs();
const jsonArg = args.json ?? args._[0];
if (!jsonArg || jsonArg === true) {
  usage("missing --json <story.json>", [
    "usage: node workspace/tools/build_subtitles_from_json.mjs <story.json> --duration <actual_seconds>"
  ]);
}

const jsonFile = resolve(String(jsonArg));
let story;
try {
  story = JSON.parse(readFileSync(jsonFile, "utf8"));
} catch (e) {
  usage(`cannot read ${jsonFile}: ${e.message}`, ["--json must point to a readable JSON file"]);
}
if (!Array.isArray(story?.shots)) {
  usage(`${jsonFile} has no shots[] array`, ["expected a top-level \"shots\": [{ id, duration, dialog }]"]);
}

/* --------------------------------------------------------------- actual film length */

const filmArg = args.film && args.film !== true ? resolve(String(args.film)) : null;
let actual = null;
const durationArg = args.duration ?? args.actual ?? args._[1];
if (durationArg !== undefined && durationArg !== true) {
  actual = Number(durationArg);
  if (!Number.isFinite(actual) || actual <= 0) {
    usage(`--duration must be a positive number of seconds, got ${JSON.stringify(durationArg)}`, [
      "example: --duration 144.95"
    ]);
  }
} else if (filmArg) {
  const film = filmArg;
  const info = probe(film);
  actual = info.duration_sec;
  if (!(actual > 0)) usage(`cannot read duration from ${film}`, ["pass --duration <seconds> instead"]);
} else {
  usage("missing actual video length", [
    "pass --duration <seconds> (e.g. 144.95) or --film <merged.mp4>"
  ]);
}

const cfg = story.subtitles ?? {};
const lang = String(args.lang ?? cfg.lang ?? "zh-Hant");
const rate = numArg(args, "rate", Number(cfg.rate ?? 6.2));
const maxLine = numArg(args, "max-line", Number(cfg.maxLine ?? cfg.max_line ?? 20));
const protect = listArg(args, "protect");
if (!protect.length) protect.push(...(cfg.protect ?? []));
const writeVtt = boolArg(args, "vtt", true);
const dryRun = boolArg(args, "dry-run", false);

/* ------------------------------------------------------------------------ cues */

const chars = (s) => [...s].length;

/** Split on full stops / ! / ? / ; / single ellipsis, then on commas for very long runs. */
function splitDialog(text) {
  const clean = String(text).replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const sentences = clean.split(/(?<=[。！？!?；])|(?<=…)(?!…)/).map((s) => s.trim()).filter(Boolean);
  const lines = [];
  for (const s of sentences) {
    if (!/[，、,：:]/.test(s)) {
      lines.push(s);
      continue;
    }
    for (const part of s.split(/(?<=[，、,：:])/).map((p) => p.trim()).filter(Boolean)) {
      if (chars(part) < 8 && lines.length && chars(lines[lines.length - 1] + part) <= maxLine * 2) {
        lines[lines.length - 1] += part;
      } else {
        lines.push(part);
      }
    }
  }
  return lines;
}

const shots = story.shots.map((s) => {
  const duration = Number(s.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`${s.id}: invalid duration ${JSON.stringify(s.duration)}`);
  return { id: String(s.id), duration, dialog: String(s.dialog ?? ""), prompt: String(s.prompt ?? "") };
});
const plannedTotal = shots.reduce((n, s) => n + s.duration, 0);
const scale = actual / plannedTotal;

const cues = [];
const segStart = new Map();
const segDur = new Map();
let cursor = 0;

for (const shot of shots) {
  const start = cursor;
  segStart.set(shot.id, start);
  segDur.set(shot.id, shot.duration);
  cursor += shot.duration;

  const lines = splitDialog(shot.dialog);
  if (!lines.length) continue;

  const span = Math.max(shot.duration - LEAD - TAIL, 0.5);
  const est = lines.map((l) => Math.max(chars(l) / rate + 0.15, MIN_DUR));
  const total = est.reduce((a, b) => a + b, 0);
  const packed = total > span;
  const durs = packed ? est.map((e) => (e / total) * span) : est;
  const gap = packed ? 0 : (span - total) / lines.length;
  const voice = INTERNAL_RE.test(shot.prompt) ? "internal_monologue" : "";

  let t = LEAD;
  for (let i = 0; i < lines.length; i++) {
    const d = Math.min(durs[i], Math.max(span - (t - LEAD), 0.4));
    cues.push({
      seg: shot.id,
      voice,
      start: start + t,
      end: start + t + Math.max(d, 0.4),
      text: lines[i]
    });
    t += d + gap;
    if (t >= span) break;
  }
}

const timed = tidyCues(cues, segStart, segDur).map((c) => ({
  ...c,
  start: c.start * scale,
  end: c.end * scale
}));

/* ------------------------------------------------------------------------ output */

const defaultBase = filmArg
  ? `${filmArg.slice(0, filmArg.length - extname(filmArg).length)}.${lang}.srt`
  : resolve(dirname(jsonFile), `${basename(jsonFile, ".json")}.${lang}.srt`);
const base = args.out && args.out !== true ? resolve(String(args.out)) : defaultBase;
const srtFile = /\.srt$/i.test(base) ? base : `${base}.srt`;
const vttFile = srtFile.replace(/\.srt$/i, ".vtt");

const srt = toSrt(timed, { maxLine, protect });
const vtt = toVtt(timed, { maxLine, protect });

let twoLine = 0;
let maxChars = 0;
let overlaps = 0;
let badBreak = 0;
let prevEnd = 0;
for (const c of timed) {
  if (c.start < prevEnd - 0.001) overlaps++;
  prevEnd = c.end;
  const body = wrapLine(c.text, { maxLine, protect }).split("\n");
  if (body.length === 2) {
    twoLine++;
    if ("…—".includes(body[0].slice(-1)) || "…—".includes(body[1].slice(0, 1))) badBreak++;
  }
  for (const line of body) maxChars = Math.max(maxChars, chars(line.replace(/<\/?i>/g, "")));
}

console.log(
  JSON.stringify(
    {
      json: jsonFile,
      shots: shots.length,
      planned_duration_sec: Number(plannedTotal.toFixed(3)),
      actual_duration_sec: Number(actual.toFixed(3)),
      scale: Number(scale.toFixed(6)),
      cues: timed.length,
      lang,
      rate,
      max_line: maxLine,
      first_cue: timed[0] ? `${stamp(timed[0].start)} --> ${stamp(timed[0].end)}` : null,
      last_cue: timed.at(-1) ? `${stamp(timed.at(-1).start)} --> ${stamp(timed.at(-1).end)}` : null,
      two_line_cues: twoLine,
      max_chars_per_line: maxChars,
      overlaps,
      bad_breaks: badBreak,
      ...(dryRun ? { dry_run: true, srt: null, vtt: null } : { srt: srtFile, vtt: writeVtt ? vttFile : null })
    },
    null,
    2
  )
);

if (dryRun) {
  for (const c of timed.slice(0, 10)) console.log(`${stamp(c.start).slice(3)} --> ${stamp(c.end).slice(3)} [${c.seg}] ${c.text}`);
  process.exitCode = overlaps || badBreak || maxChars > maxLine ? 1 : 0;
} else {
  writeFileSync(srtFile, srt, "utf8");
  if (writeVtt) writeFileSync(vttFile, vtt, "utf8");
  console.log("\n--- first 10 cues ---");
  for (const c of timed.slice(0, 10)) {
    console.log(`${stamp(c.start).slice(3)} --> ${stamp(c.end).slice(3)} [${c.seg}] ${c.text}`);
  }
  process.exitCode = overlaps || badBreak || maxChars > maxLine ? 1 : 0;
}
