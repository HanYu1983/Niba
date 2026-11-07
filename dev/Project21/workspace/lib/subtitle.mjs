/**
 * Subtitle timing derived from the plan, not from transcription.
 *
 *   1. Segment start = running sum of the *actual* clip durations in render_manifest.json,
 *      which is exactly what concat_renders.mjs lays end to end.
 *   2. Inside a segment, each <d> block sits at that shot's "At MM:SS.mmm" cut time.
 *   3. Lines inside one block are spaced by speaking rate (default 6.2 chars/sec), with
 *      the slack distributed as gaps between them.
 *   4. Alignment pass: the rendered audio is scanned for speech regions (RMS above -38 dB
 *      with 0.18 s hangover). A cue that would land mostly in silence is moved onto the
 *      nearest speech onset within 3 s — the model often holds a beat before the first line.
 */
import { existsSync } from "node:fs";

import { loudRatio, rmsProfile, speechRegions } from "./media.mjs";
import { dBlocks, readPrompt, splitShots } from "./prompt.mjs";
import { keeperFile } from "./manifest.mjs";
import { promptFileFor } from "./story.mjs";

const MIN_DUR = 0.9;
const TAIL = 0.05;
const SILENT_DB = -45;
const SNAP_RANGE = 3.0;
export const ITALIC_VOICES = new Set(["narrator", "internal_monologue"]);

const BAD_END = new Set([..."的了是在有和與及或就都也還再又才只被把讓給對從為而但卻很不沒個這那你我他她它們上下中裡外並"]);
const BAD_START = new Set([..."的了嗎呢吧啊呀喔哦啦們個得著過"]);
const PUNCT = "、，。！？…—；：";

export function stamp(seconds, sep = ",") {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}${sep}${String(r).padStart(3, "0")}`;
}

/**
 * Break a long cue into at most two balanced lines, preferring clean phrase boundaries
 * and never splitting a word from the story's protect list.
 */
export function wrapLine(line, { maxLine = 15, protect = [] } = {}) {
  const cs = [...line];
  if (cs.length <= maxLine) return line;
  const mid = cs.length / 2;
  let best = null;
  let bestScore = -Infinity;

  for (let p = Math.max(4, Math.floor(cs.length * 0.3)); p <= Math.min(cs.length - 4, Math.ceil(cs.length * 0.7)); p++) {
    let score = -Math.abs(p - mid) * 0.6;
    if (PUNCT.includes(cs[p - 1])) score += 6;
    if (PUNCT.includes(cs[p])) score += 3;
    if (BAD_END.has(cs[p - 1])) score -= 6;
    if (BAD_START.has(cs[p])) score -= 6;
    if ("…—".includes(cs[p - 1]) || "…—".includes(cs[p])) score -= 8;
    for (const w of protect) {
      let at = line.indexOf(w);
      while (at >= 0) {
        if (p === at || p === at + w.length) score += 3;
        if (p > at && p < at + w.length) {
          score -= 12;
          break;
        }
        at = line.indexOf(w, at + 1);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }

  if (best === null) best = Math.round(mid);
  const a = cs.slice(0, best).join("").trim();
  const b = cs.slice(best).join("").trim();
  return a && b ? `${a}\n${b}` : line;
}

function promptPathFor(story, manifest, segment) {
  const recorded = manifest.segments[segment.id]?.prompt_file;
  if (recorded && existsSync(recorded)) return recorded;
  const pick = promptFileFor(story, segment.id);
  return pick.exists ? pick.file : null;
}

/** Turn the plan + prompts + real clip durations into timed cues. */
export function buildCues({ story, plan, manifest, rate = 6.2 }) {
  const chars = (s) => [...s].length;
  const cues = [];
  const segStart = new Map();
  const segDur = new Map();
  let cursor = 0;

  for (const seg of plan.segments) {
    const rec = manifest.segments[seg.id];
    if (!rec) throw new Error(`${seg.id}: missing from ${story.manifestFile}`);
    const duration = rec.duration_sec ?? seg.estimated_sec;
    const start = cursor;
    segStart.set(seg.id, start);
    segDur.set(seg.id, duration);
    cursor += duration;

    const promptFile = promptPathFor(story, manifest, seg);
    const text = promptFile ? readPrompt(promptFile) : null;
    const shots = text ? splitShots(text) : [];
    const withLines = shots.filter((s) => s.lines.length);

    // A segment can speak without a <d> block (an improvised scream). Place it just inside.
    if (!withLines.length) {
      if (!seg.spoken_text) continue;
      const spoken = seg.spoken_text.replace(/\s+/g, "");
      const dur = Math.min(Math.max(chars(spoken) / rate, MIN_DUR), duration - 0.4);
      cues.push({ seg: seg.id, voice: seg.voice_intent, start: start + 0.4, end: start + 0.4 + dur, text: spoken, moved: 0 });
      continue;
    }

    for (const shot of withLines) {
      const nextAnchor = shots
        .map((s) => s.anchor)
        .filter((a) => a > shot.anchor + 0.01)
        .sort((a, b) => a - b)[0];
      const from = Math.max(shot.anchor, 0);
      const to = Math.min(nextAnchor ?? duration, duration) - TAIL;
      const span = Math.max(to - from, MIN_DUR);

      const totalChars = shot.lines.reduce((n, l) => n + chars(l), 0);
      const est = shot.lines.map((l) => Math.max(chars(l) / rate + 0.15, MIN_DUR));
      const packed = est.reduce((a, b) => a + b, 0) > span;

      const durs = packed
        ? shot.lines.map((l) => Math.max((chars(l) / totalChars) * span, 0.6))
        : est;
      const gap = packed ? 0 : (span - durs.reduce((a, b) => a + b, 0)) / shot.lines.length;

      let t = from;
      for (let k = 0; k < shot.lines.length; k++) {
        const d = Math.min(durs[k], Math.max(to - t, 0.4));
        cues.push({
          seg: seg.id,
          voice: seg.voice_intent,
          start: start + t,
          end: start + t + Math.max(d, 0.4),
          text: shot.lines[k],
          moved: 0
        });
        t += d + gap;
        if (t >= to) break;
      }
    }
  }

  return { cues, segStart, segDur, filmDuration: cursor };
}

/**
 * Nudge cues that sit mostly in silence onto the nearest speech onset. Also bridges a
 * short intra-line pause ("這裡，那間舊書攤。" is spoken in two bursts).
 */
export function alignToAudio({ cues, segStart, segDur, manifest, rate = 6.2 }) {
  const chars = (s) => [...s].length;
  const cache = new Map();
  const profile = (file) => {
    if (!cache.has(file)) cache.set(file, rmsProfile(file));
    return cache.get(file);
  };

  const bySeg = new Map();
  for (const c of cues) {
    if (!bySeg.has(c.seg)) bySeg.set(c.seg, []);
    bySeg.get(c.seg).push(c);
  }

  let moved = 0;
  for (const [segId, list] of bySeg) {
    const file = keeperFile(manifest.segments[segId]);
    if (!file || !existsSync(file)) continue;
    const frames = profile(file);
    if (!frames.length) continue;
    const regions = speechRegions(frames);
    if (!regions.length) continue;

    const base = segStart.get(segId);
    const dur = segDur.get(segId);

    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      const local = c.start - base;
      if (loudRatio(frames, local, c.end - base) >= 0.55) continue;

      const floor = i > 0 ? list[i - 1].end - base + 0.02 : 0;
      const near = regions
        .filter((r) => Math.abs(r.start - local) <= SNAP_RANGE && r.start >= floor && r.end <= dur + 0.01)
        .sort((a, b) => Math.abs(a.start - local) - Math.abs(b.start - local))[0];
      if (!near) continue;

      const estDur = Math.max(chars(c.text) / rate, MIN_DUR);
      const newStart = near.start;
      const nextStart = i + 1 < list.length ? list[i + 1].start - base : dur;
      let newEnd = Math.min(
        Math.max(near.end + 0.15, newStart + 0.75),
        newStart + estDur * 1.8,
        nextStart - 0.03,
        dur - 0.03
      );

      const next = regions
        .filter((r) => r.start > near.end && r.start - newEnd <= 0.8)
        .sort((a, b) => a.start - b.start)[0];
      if (next && next.end - newStart <= estDur * 1.6 && next.end <= nextStart - 0.05) {
        newEnd = next.end + 0.1;
      }
      if (newEnd - newStart < 0.55) continue;

      c.moved = Math.abs(newStart - local);
      c.start = base + newStart;
      c.end = base + newEnd;
      moved++;
    }
  }
  return moved;
}

/** Enforce monotonic, non-overlapping cues and clamp them inside their segment. */
export function tidyCues(cues, segStart, segDur) {
  cues.sort((a, b) => a.start - b.start);
  const out = [];
  for (const c of cues) {
    const prev = out[out.length - 1];
    if (prev && c.start < prev.end) {
      // Shrink the cue that ran long instead of crushing the later line to nothing.
      if (c.start - 0.01 - prev.start >= 0.5) prev.end = c.start - 0.01;
      else c.start = prev.end + 0.01;
    }
    if (c.end <= c.start) c.end = c.start + 0.5;
    if (c.start >= segStart.get(c.seg) + segDur.get(c.seg)) continue;
    c.end = Math.min(c.end, segStart.get(c.seg) + segDur.get(c.seg) - 0.02);
    out.push(c);
  }
  return out;
}

export function toSrt(cues, { maxLine = 15, protect = [] } = {}) {
  return cues
    .map((c, i) => {
      const body = wrapLine(c.text, { maxLine, protect });
      const shown = ITALIC_VOICES.has(c.voice) ? `<i>${body}</i>` : body;
      return `${i + 1}\n${stamp(c.start, ",")} --> ${stamp(c.end, ",")}\n${shown}\n`;
    })
    .join("\n");
}

export function toVtt(cues, { maxLine = 15, protect = [] } = {}) {
  return (
    "WEBVTT\n\n" +
    cues
      .map((c) => {
        const body = wrapLine(c.text, { maxLine, protect });
        const shown = ITALIC_VOICES.has(c.voice) ? `<i>${body}</i>` : body;
        return `${stamp(c.start, ".")} --> ${stamp(c.end, ".")}\n${shown}\n`;
      })
      .join("\n")
  );
}

export { dBlocks };
