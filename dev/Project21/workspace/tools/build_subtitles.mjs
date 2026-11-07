/**
 * Build YouTube subtitles (default zh-Hant) for the story's merged film.
 *
 *   node workspace/tools/build_subtitles.mjs --story test_story3
 *   node workspace/tools/build_subtitles.mjs --story test_story3 --no-audio
 *   node workspace/tools/build_subtitles.mjs --story test_story3 --film path/to/cut.mp4 --lang zh-Hant
 *
 * Timing comes from the plan (shot anchors) and the manifest (real clip durations), then an
 * audio pass moves cues that would land in silence onto the nearest speech onset.
 * Output: `<film base>.<lang>.srt` and `.vtt` beside the film.
 */
import { writeFileSync } from "node:fs";
import { basename, extname } from "node:path";

import { boolArg, listArg, numArg, parseArgs } from "../lib/args.mjs";
import { readManifest } from "../lib/manifest.mjs";
import { loadPlan } from "../lib/plan.mjs";
import { alignToAudio, buildCues, stamp, tidyCues, toSrt, toVtt } from "../lib/subtitle.mjs";
import { describeStory, loadStory, newestFilm } from "../lib/story.mjs";

const args = parseArgs();
const story = loadStory({ story: args.story ?? args._[0], plan: args.plan });
const plan = loadPlan(story.planFile);
const manifest = readManifest(story.manifestFile, story.planFile);

const film = args.film && args.film !== true ? String(args.film) : newestFilm(story);
if (!film) throw new Error(`no film in ${story.videoDir} — run concat_renders.mjs first`);

const lang = String(args.lang ?? story.subtitles.lang ?? "zh-Hant");
const rate = numArg(args, "rate", story.subtitles.rate ?? 6.2);
const maxLine = numArg(args, "max-line", story.subtitles.maxLine ?? 15);
const protect = listArg(args, "protect");
if (!protect.length) protect.push(...(story.subtitles.protect ?? []));

const { cues, segStart, segDur, filmDuration } = buildCues({ story, plan, manifest, rate });
const moved = boolArg(args, "audio", true) ? alignToAudio({ cues, segStart, segDur, manifest, rate }) : 0;
const out = tidyCues(cues, segStart, segDur);

const srt = toSrt(out, { maxLine, protect });
const vtt = toVtt(out, { maxLine, protect });

const base = film.slice(0, film.length - extname(film).length);
const srtFile = `${base}.${lang}.srt`;
const vttFile = `${base}.${lang}.vtt`;
writeFileSync(srtFile, srt, "utf8");
writeFileSync(vttFile, vtt, "utf8");

// Cheap self-check: the rules that make a cue unreadable on a phone screen.
const blocks = srt.trim().split(/\r?\n\r?\n/);
const sec = (s) => {
  const m = s.match(/(\d\d):(\d\d):(\d\d),(\d\d\d)/);
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};
let twoLine = 0;
let maxChars = 0;
let overlaps = 0;
let badBreak = 0;
let prevEnd = 0;
for (const b of blocks) {
  const L = b.split(/\r?\n/);
  const m = L[1].match(/(\S+) --> (\S+)/);
  const start = sec(m[1]);
  const end = sec(m[2]);
  if (start < prevEnd - 0.001) overlaps++;
  prevEnd = end;
  const body = L.slice(2);
  if (body.length === 2) {
    twoLine++;
    if ("…—".includes(body[0].slice(-1)) || "…—".includes(body[1].slice(0, 1))) badBreak++;
  }
  for (const line of body) maxChars = Math.max(maxChars, [...line.replace(/<\/?i>/g, "")].length);
}

console.log(
  JSON.stringify(
    {
      ...describeStory(story),
      film: basename(film),
      cues: out.length,
      segments_with_speech: new Set(out.map((c) => c.seg)).size,
      audio_alignment: boolArg(args, "audio", true) ? `${moved} cues snapped` : "off",
      first_cue_sec: Number(out[0].start.toFixed(2)),
      last_cue_end_sec: Number(out.at(-1).end.toFixed(2)),
      film_duration_sec: Number(filmDuration.toFixed(2)),
      longest_cue_sec: Number(out.reduce((m, c) => Math.max(m, c.end - c.start), 0).toFixed(2)),
      two_line_cues: twoLine,
      max_chars_per_line: maxChars,
      overlaps,
      bad_breaks: badBreak,
      srt: srtFile,
      vtt: vttFile
    },
    null,
    2
  )
);

console.log("\n--- first 10 cues ---");
for (const c of out.slice(0, 10)) {
  console.log(`${stamp(c.start).slice(3)} --> ${stamp(c.end).slice(3)}  [${c.seg}] ${c.text}`);
}

process.exit(overlaps || badBreak || maxChars > maxLine ? 1 : 0);
