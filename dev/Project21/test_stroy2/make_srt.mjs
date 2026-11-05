#!/usr/bin/env node
/**
 * Build a YouTube-ready .srt from the shot plan + the real length of the merged video.
 *
 *   node make_srt.mjs plan.momotaro.json 439.05
 *   node make_srt.mjs plan.momotaro.json 439.05 --out momotaro_ja.srt
 *   node make_srt.mjs plan.momotaro.json 439.05 --no-split --fps 24
 *
 * Where the text comes from: every block's `audio_control.dialogue.original_text` — the exact
 * Japanese line the r2v job was told to speak. The plan's `spoken_text` is a script (it carries
 * Chinese glosses), so it is only used as a fallback when a block has no dialogue field.
 *
 * Where the timing comes from: block offsets are cumulative real clip lengths (from
 * render_manifest.json `frames / fps`), so the cues sit where the shots actually are in the
 * merged file. `total` is the length of the merged video; it is applied as a final residual
 * scale (≈1.0), which also makes the file correct when a clip was trimmed or the manifest is
 * missing and the plan's own timeframes are all we have.
 *
 * Options:
 *   --project <f>    block source, default = the plan path with "plan." stripped
 *   --manifest <f>   default render_manifest.json next to the project; --no-manifest to ignore
 *   --fps 24         used to turn manifest frame counts into seconds
 *   --out <f>        default <project basename>.srt next to the project
 *   --lead 0.15      silence before a line inside its block (seconds)
 *   --tail 0.10      silence after a line inside its block (seconds)
 *   --min 1.0        shortest cue; --no-split puts the whole block in one cue
 *   --max-chars 20   wrap a cue into at most two lines around this width
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const USAGE = `usage: node make_srt.mjs <plan.json> <total_seconds> [options]
  --project <f> --manifest <f> --no-manifest --fps 24 --out <f>
  --lead 0.15 --tail 0.10 --min 1.0 --no-split --max-chars 20`;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      out._.push(token);
      continue;
    }
    const eq = token.indexOf("=");
    let key;
    let value;
    if (eq !== -1) {
      key = token.slice(2, eq);
      value = token.slice(eq + 1);
    } else {
      key = token.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        value = next;
        i++;
      } else {
        value = "true";
      }
    }
    out[key] = value;
  }
  return out;
}

function resolveFile(file) {
  for (const candidate of [path.resolve(file), path.resolve(HERE, file)]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));

/** HH:MM:SS,mmm — the only format YouTube and players agree on. */
function stamp(seconds) {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milli = ms % 1000;
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(milli, 3)}`;
}

/** Japanese has no spaces, so split on sentence enders and keep the punctuation. */
function splitSentences(text) {
  return text
    .split(/(?<=[。．！？!?」])/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Two lines at most, broken near the middle on a natural pause. */
function wrap(text, width) {
  if (width <= 0 || text.length <= width) return text;
  const pauses = ["、", "，", " ", "」", "。"];
  let best = -1;
  for (const p of pauses) {
    const at = text.lastIndexOf(p, Math.ceil(text.length / 2) + Math.floor(width / 2));
    if (at > 0 && at < text.length - 1 && (best === -1 || Math.abs(at - text.length / 2) < Math.abs(best - text.length / 2))) {
      best = at + 1;
    }
  }
  const cut = best > 0 ? best : Math.floor(text.length / 2);
  return `${text.slice(0, cut).trim()}\n${text.slice(cut).trim()}`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const [planArg, totalArg] = args._;
  const total = Number(args.total ?? totalArg);
  if (!planArg || !Number.isFinite(total) || total <= 0) {
    console.error(USAGE);
    return 1;
  }

  const planFile = resolveFile(planArg);
  if (!planFile) throw new Error(`plan not found: ${planArg}`);
  const plan = readJson(planFile);

  // plan.momotaro.json -> momotaro.json
  const stem = path.basename(planFile, ".json");
  const projectGuess = stem.startsWith("plan.") ? stem.slice(5) : stem;
  const projectFile = args.project
    ? resolveFile(args.project)
    : [path.join(path.dirname(planFile), `${projectGuess}.json`), path.join(HERE, `${projectGuess}.json`)].find(existsSync) ?? null;
  const project = projectFile ? readJson(projectFile) : null;
  if (!project) {
    console.error(`no block source found for ${path.basename(planFile)}; pass --project <momotaro.json>`);
    return 1;
  }

  const manifestFile =
    args["no-manifest"] === "true"
      ? null
      : args.manifest
        ? resolveFile(args.manifest)
        : [path.join(path.dirname(projectFile), "render_manifest.json"), path.join(HERE, "render_manifest.json")].find(existsSync) ?? null;
  const manifest = manifestFile ? readJson(manifestFile) : null;
  const framesById = new Map();
  if (manifest?.blocks) {
    for (const row of manifest.blocks) {
      if (Number.isFinite(row.frames) && row.frames > 0) framesById.set(row.block_id, row.frames);
    }
  }

  const fps = Number(args.fps ?? 24);
  const lead = Number(args.lead ?? 0.15);
  const tail = Number(args.tail ?? 0.1);
  const minCue = Number(args.min ?? 1.0);
  const maxChars = Number(args["max-chars"] ?? 20);
  const noSplit = args["no-split"] === "true";

  // --- reality check: do we know every clip's length? ---------------------------
  const exact = project.blocks.every((b) => framesById.has(b.id));
  const durations = project.blocks.map((b) =>
    exact ? framesById.get(b.id) / fps : b.timeframe.end_sec - b.timeframe.start_sec
  );
  const plannedTotal = project.blocks.at(-1).timeframe.end_sec - project.blocks[0].timeframe.start_sec;
  const summed = durations.reduce((a, d) => a + d, 0);

  // Cumulative offsets in the merged file, then one residual scale onto the length the user
  // measured (≈1.0 with exact clips; it absorbs trims or a project without a manifest).
  const scale = total / summed;
  let cursor = 0;
  const windows = project.blocks.map((block, i) => {
    const start = cursor;
    cursor += durations[i];
    return { block, start: start * scale, end: cursor * scale };
  });

  // --- cues ---------------------------------------------------------------------
  const cues = [];
  for (const { block, start, end } of windows) {
    const dialogue = block.audio_control?.dialogue;
    const text = (Array.isArray(dialogue) ? dialogue[0]?.original_text : dialogue?.original_text)?.trim();
    if (!text) continue;

    const from = start + lead;
    const to = end - tail;
    const windowSec = to - from;
    if (windowSec <= 0.2) continue;

    const sentences = noSplit ? [text] : splitSentences(text);
    const weights = sentences.map((s) => s.length);
    const weightSum = weights.reduce((a, w) => a + w, 0);
    let spans = weights.map((w) => (windowSec * w) / weightSum);

    if (spans.length > 1 && minCue > 0) {
      const floorTotal = minCue * spans.length;
      if (floorTotal <= windowSec) {
        spans = spans.map((d) => Math.max(d, minCue));
      }
    }
    const spanSum = spans.reduce((a, d) => a + d, 0);
    spans = spans.map((d) => (d * windowSec) / spanSum);

    let t = from;
    sentences.forEach((sentence, i) => {
      const dur = spans[i];
      const cueStart = t;
      const cueEnd = i === sentences.length - 1 ? to : t + dur;
      t = cueEnd;
      if (cueEnd - cueStart < 0.4) return;
      cues.push({ start: cueStart, end: cueEnd, text: sentence });
    });
  }

  // Keep the file monotonic even if rounding pushed a cue over the next one.
  for (let i = 0; i < cues.length; i++) {
    if (i > 0 && cues[i].start < cues[i - 1].end) cues[i].start = cues[i - 1].end;
    if (cues[i].end <= cues[i].start) cues[i].end = cues[i].start + 0.4;
  }

  const outFile = args.out
    ? path.resolve(args.out)
    : path.join(path.dirname(projectFile), `${projectGuess}.srt`);

  const srt = cues
    .map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${wrap(c.text, maxChars)}\n`)
    .join("\n");
  writeFileSync(outFile, srt, "utf8");

  console.log(
    JSON.stringify(
      {
        srt: outFile,
        cues: cues.length,
        blocks: project.blocks.length,
        blocks_with_dialogue: project.blocks.filter((b) => b.audio_control?.dialogue?.original_text).length,
        blocks_without_cue: project.blocks.length - project.blocks.filter((b) => b.audio_control?.dialogue?.original_text).length,
        timing: exact ? "exact (manifest frames/fps)" : "plan timeframes",
        scale: Number(scale.toFixed(4)),
        first_cue: cues[0] ? `${stamp(cues[0].start)} -> ${stamp(cues[0].end)}  ${cues[0].text}` : null,
        last_cue: cues.at(-1) ? `${stamp(cues.at(-1).start)} -> ${stamp(cues.at(-1).end)}  ${cues.at(-1).text}` : null,
        duration_sec: Number(total.toFixed(2))
      },
      null,
      2
    )
  );
  return 0;
}

try {
  process.exitCode = main();
} catch (e) {
  console.error(e.message);
  process.exitCode = 2;
}
