/**
 * Build YouTube subtitles (zh-Hant) for the merged chapter film.
 *
 *   node test_story3/build_subtitles.mjs            # prompt timing + audio alignment
 *   node test_story3/build_subtitles.mjs --no-audio # prompt timing only
 *
 * Timing model, in order of evidence:
 *   1. Segment start = running sum of the *actual* clip durations in render_manifest.json,
 *      which is exactly what concat_renders.mjs lays end to end.
 *   2. Inside a segment, each <d> block sits at that shot's cut time, read from the shot's
 *      "At MM:SS.mmm" marker in the prompt file.
 *   3. Lines inside one block are spaced by speaking rate (6.2 chars/sec) inside the shot
 *      interval, with the slack distributed as gaps between them.
 *   4. Alignment pass: the rendered audio is scanned for speech regions (RMS above -38 dB
 *      with 0.18 s hangover). A cue that would land mostly in silence is moved to the
 *      nearest speech onset within 2.5 s. This fixes clips where the model put a beat of
 *      room tone before the first line.
 *
 * Checked against the rendered audio: the quiet gaps in seg_009 fall at 1.0 s / 3.0 s /
 * 4.75 s / 7.0 s, matching the planned line breaks at 0.65 / 3.0 / 4.94 / 7.2.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FFMPEG = resolve("gen_video/node_modules/ffmpeg-static/ffmpeg.exe");
const RATE = 6.2; // Chinese characters per second, measured against the rendered audio
const MIN_DUR = 0.9;
const TAIL = 0.05;
const MAX_LINE = 15; // characters per subtitle line: the film is 9:16, so keep lines short
const ITALIC = new Set(["narrator", "internal_monologue"]);

const SILENT_DB = -45; // below this a window counts as silence
const REGION_DB = -38; // above this a window counts as sound
const SNAP_RANGE = 3.0; // seconds a cue is allowed to move in the alignment pass
const USE_AUDIO = !process.argv.includes("--no-audio");

const plan = JSON.parse(readFileSync(resolve("test_story3/plan.ch0.json"), "utf8"));
const manifest = JSON.parse(readFileSync(resolve("test_story3/render_manifest.json"), "utf8"));

const chars = (s) => [...s].length;

function parseShots(promptPath) {
  if (!existsSync(promptPath)) return [];
  const text = readFileSync(promptPath, "utf8");
  const parts = text.split(/(?=\[Shot \d+\])/).slice(1);
  const shots = [];
  for (const part of parts) {
    const at = part.match(/At (\d\d):(\d\d)\.(\d\d\d)/);
    const anchor = at ? +at[1] * 60 + +at[2] + +at[3] / 1000 : 0;
    const blocks = [...part.matchAll(/<d>\s*\[中文\]\s*([\s\S]*?)<\/d>/g)].map((m) => m[1].trim());
    const lines = blocks.flatMap((b) => b.split(/\n/).map((x) => x.trim()).filter(Boolean));
    shots.push({ anchor, lines });
  }
  return shots;
}

const BAD_END = new Set([..."的了是在有和與及或就都也還再又才只被把讓給對從為而但卻很不沒個這那你我他她它們上下中裡外並"]);
const BAD_START = new Set([..."的了嗎呢吧啊呀喔哦啦們個得著過"]);
const PUNCT = "、，。！？…—；：";
// Words that must not be split across two lines. Not a dictionary: just the names and
// compounds that actually appear in this chapter, plus the usual function-word pairs.
const PROTECT = [
  "嘉年華", "避難所", "不鏽鋼", "恐龍包", "泰洛伊", "佛羅斯", "艾伯塔", "精英",
  "起來", "出來", "回來", "過來", "進來", "一個", "什麼", "這麼", "那麼", "怎麼",
  "已經", "還是", "因為", "所以", "但是", "可是", "現在", "時候", "地方", "東西",
  "知道", "覺得", "應該", "可以", "沒有", "不是", "就是", "我們", "你們", "他們",
  "自己", "大家", "一起", "開始", "結束", "發現", "如果", "只是", "這個", "那個",
  "一樣", "其實", "然後", "緊張", "老頭", "上校", "倒是", "還在", "先幫",
  "看不出", "城市", "慘叫聲", "交織", "喇叭", "背包", "嘉年"
];

/** Break a long cue into at most two balanced lines, preferring clean phrase boundaries. */
function wrap(line) {
  const cs = [...line];
  if (cs.length <= MAX_LINE) return line;
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
    for (const w of PROTECT) {
      let at = line.indexOf(w);
      while (at >= 0) {
        if (p === at || p === at + w.length) score += 3;
        if (p > at && p < at + w.length) { score -= 12; break; }
        at = line.indexOf(w, at + 1);
      }
    }
    if (score > bestScore) { bestScore = score; best = p; }
  }
  if (best === null) best = Math.round(mid);
  const a = cs.slice(0, best).join("").trim();
  const b = cs.slice(best).join("").trim();
  return a && b ? `${a}\n${b}` : line;
}

// ---------------------------------------------------------------- audio analysis

const profileCache = new Map();

function profile(file) {
  if (profileCache.has(file)) return profileCache.get(file);
  const r = spawnSync(FFMPEG, [
    "-hide_banner", "-nostats", "-i", file,
    "-af", "astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-",
    "-f", "null", "-"
  ], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const frames = [];
  let t = null;
  for (const line of (r.stdout || "").split(/\r?\n/)) {
    const m = line.match(/pts_time:([0-9.]+)/);
    if (m) { t = +m[1]; continue; }
    const v = line.match(/RMS_level=(-?[0-9.]+(?:e-?[0-9]+)?)/);
    if (v && t !== null) { frames.push({ t, db: +v[1] }); t = null; }
  }
  profileCache.set(file, frames);
  return frames;
}

function speechRegions(frames) {
  if (!frames.length) return [];
  const step = 0.05;
  const end = frames[frames.length - 1].t + step;
  const buckets = [];
  for (let t = 0; t < end; t += step) {
    let peak = -99;
    for (const f of frames) if (f.t >= t && f.t < t + step && f.db > peak) peak = f.db;
    buckets.push(peak);
  }
  const regions = [];
  let cur = null;
  for (let i = 0; i < buckets.length; i++) {
    const t = i * step;
    if (buckets[i] > REGION_DB) {
      if (!cur) cur = { start: t, end: t + step };
      else cur.end = t + step;
    } else if (cur && t - cur.end > 0.18) {
      if (cur.end - cur.start >= 0.35) regions.push(cur);
      cur = null;
    }
  }
  if (cur && cur.end - cur.start >= 0.35) regions.push(cur);
  return regions;
}

function loudRatio(frames, from, to) {
  const win = frames.filter((f) => f.t >= from && f.t < to);
  if (!win.length) return 0;
  return win.filter((f) => f.db > SILENT_DB).length / win.length;
}

// ---------------------------------------------------------------- planned cues

const cues = [];
const segStart = new Map();
const segDur = new Map();
let cursor = 0;

for (const seg of plan.segments) {
  const rec = manifest.segments[seg.id];
  if (!rec) throw new Error(`${seg.id}: missing from render_manifest.json`);
  const duration = rec.duration_sec ?? seg.estimated_sec;
  const start = cursor;
  segStart.set(seg.id, start);
  segDur.set(seg.id, duration);
  cursor += duration;

  const shots = parseShots(resolve("test_story3/prompts", `${seg.id}.t2v.txt`));
  const withLines = shots.filter((s) => s.lines.length);

  if (!withLines.length) {
    // A segment can have spoken text without a <d> block (improvised scream, seg_035).
    if (!seg.spoken_text) continue;
    const text = seg.spoken_text.replace(/\s+/g, "");
    const dur = Math.min(Math.max(chars(text) / RATE, MIN_DUR), duration - 0.4);
    cues.push({ seg: seg.id, voice: seg.voice_intent, start: start + 0.4, end: start + 0.4 + dur, text });
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
    const est = shot.lines.map((l) => Math.max(chars(l) / RATE + 0.15, MIN_DUR));
    const estSum = est.reduce((a, b) => a + b, 0);
    const packed = estSum > span;

    const durs = packed ? shot.lines.map((l) => Math.max((chars(l) / totalChars) * span, 0.6)) : est;
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

// ---------------------------------------------------------------- alignment pass

let moved = 0;
if (USE_AUDIO) {
  const bySeg = new Map();
  for (const c of cues) {
    if (!bySeg.has(c.seg)) bySeg.set(c.seg, []);
    bySeg.get(c.seg).push(c);
  }

  for (const [segId, list] of bySeg) {
    const file = (manifest.segments[segId].files ?? [])[0];
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

      const estDur = Math.max(chars(c.text) / RATE, MIN_DUR);
      const newStart = near.start;
      const nextStart = i + 1 < list.length ? list[i + 1].start - base : dur;
      let newEnd = Math.min(
        Math.max(near.end + 0.15, newStart + 0.75),
        newStart + estDur * 1.8,
        nextStart - 0.03,
        dur - 0.03
      );
      // Bridge a short pause inside one line: "這裡，那間舊書攤。" is spoken in two bursts.
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
}

// ---------------------------------------------------------------- monotonic cleanup

if (process.env.DEBUG_SEG) {
  for (const c of cues) {
    if (c.seg !== process.env.DEBUG_SEG) continue;
    console.error(
      "PRE",
      (c.start - segStart.get(c.seg)).toFixed(2),
      "->",
      (c.end - segStart.get(c.seg)).toFixed(2),
      "moved",
      c.moved.toFixed(2),
      c.text
    );
  }
}

cues.sort((a, b) => a.start - b.start);
const out = [];
for (const c of cues) {
  const prev = out[out.length - 1];
  if (prev && c.start < prev.end) {
    // Prefer shrinking the cue that ran long, so a later line is never crushed to nothing.
    if (c.start - 0.01 - prev.start >= 0.5) prev.end = c.start - 0.01;
    else c.start = prev.end + 0.01;
  }
  if (c.end <= c.start) c.end = c.start + 0.5;
  if (c.start >= segStart.get(c.seg) + segDur.get(c.seg)) continue;
  c.end = Math.min(c.end, segStart.get(c.seg) + segDur.get(c.seg) - 0.02);
  out.push(c);
}

// ---------------------------------------------------------------- write

const stamp = (t, sep) => {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}${sep}${String(r).padStart(3, "0")}`;
};

const body = (c) => {
  const w = wrap(c.text);
  return ITALIC.has(c.voice) ? `<i>${w}</i>` : w;
};

const srt = out.map((c, i) => `${i + 1}\n${stamp(c.start, ",")} --> ${stamp(c.end, ",")}\n${body(c)}\n`).join("\n");
const vtt = "WEBVTT\n\n" + out.map((c) => `${stamp(c.start, ".")} --> ${stamp(c.end, ".")}\n${body(c)}\n`).join("\n");

const base = resolve("output/video/plan.ch0_full_352x608");
writeFileSync(`${base}.zh-Hant.srt`, srt, "utf8");
writeFileSync(`${base}.zh-Hant.vtt`, vtt, "utf8");

console.log(JSON.stringify({
  cues: out.length,
  segments_with_speech: new Set(out.map((c) => c.seg)).size,
  audio_alignment: USE_AUDIO ? `${moved} cues snapped` : "off",
  first_cue_sec: +out[0].start.toFixed(2),
  last_cue_end_sec: +out[out.length - 1].end.toFixed(2),
  film_duration_sec: +cursor.toFixed(2),
  longest_cue_sec: +out.reduce((m, c) => Math.max(m, c.end - c.start), 0).toFixed(2),
  srt: `${base}.zh-Hant.srt`,
  vtt: `${base}.zh-Hant.vtt`
}, null, 2));

console.log("\n--- first 10 cues ---");
for (const c of out.slice(0, 10)) {
  console.log(`${stamp(c.start, ",").slice(3)} --> ${stamp(c.end, ",").slice(3)}  [${c.seg}] ${c.text}`);
}
