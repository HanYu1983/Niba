/**
 * Stitch the rendered blocks back into one timeline.
 *
 *   node assemble_blocks.mjs --check                  # is every block present?
 *   node assemble_blocks.mjs                          # write output/render/ch04/ch04_episode.mp4
 *   node assemble_blocks.mjs --out D:/tmp/cut.mp4     # somewhere else
 *
 * Order comes from the plan, not from the manifest: the manifest is a lookup table of
 * "which take of block 12 is the keeper", and a block that was retaken three times still
 * belongs in slot 12. Clips are concatenated by stream copy when they share codec and size
 * (the normal case, since every block is rendered at 608x352 / 24fps by the same template),
 * and re-encoded only when the copy concat fails.
 */

import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

import ffmpegPath from "ffmpeg-static";

const run = promisify(execFile);

const HERE = "D:\\han\\Niba\\dev\\Project21";
const DEFAULTS = {
  project: resolve(HERE, "test_story1/ch04_from_plan.json"),
  manifest: resolve(HERE, "test_story1/ch04_render_manifest.json"),
  out: resolve(HERE, "output/render/ch04/ch04_episode.mp4")
};

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      out._.push(a);
      continue;
    }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

/** ffmpeg's concat demuxer wants POSIX-ish paths with single quotes escaped. */
function concatLine(file) {
  return `file '${file.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`;
}

async function probe(file) {
  try {
    const { stderr } = await run(ffmpegPath, ["-hide_banner", "-i", file], { maxBuffer: 1 << 24 });
    return parseDuration(stderr);
  } catch (e) {
    // ffmpeg exits non-zero for `-i` alone when no output is given, but still prints the header.
    return parseDuration(String(e.stderr ?? ""));
  }
}

function parseDuration(text) {
  const m = /Duration:\s*(\d+):(\d+):(\d+\.\d+)/.exec(text);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

const args = parseArgs(process.argv.slice(2));
const projectFile = resolve(args.project ?? DEFAULTS.project);
const manifestFile = resolve(args.manifest ?? DEFAULTS.manifest);
const outFile = resolve(args.out ?? DEFAULTS.out);

const project = JSON.parse(readFileSync(projectFile, "utf8"));
const manifest = existsSync(manifestFile)
  ? JSON.parse(readFileSync(manifestFile, "utf8"))
  : { blocks: {} };

const rows = [];
const missing = [];
for (const block of project.blocks ?? []) {
  const entry = manifest.blocks?.[block.id];
  if (!entry) {
    missing.push({ id: block.id, why: "not rendered yet" });
    continue;
  }
  if (!entry.file) {
    missing.push({ id: block.id, why: `status ${entry.status ?? "unknown"}`, take: entry.take });
    continue;
  }
  if (!existsSync(entry.file)) {
    missing.push({ id: block.id, why: "file gone", file: entry.file });
    continue;
  }
  const duration = await probe(entry.file);
  rows.push({ id: block.id, file: entry.file, take: entry.take, duration });
}

const totalSec = rows.reduce((a, r) => a + (r.duration ?? 0), 0);
console.log(`present ${rows.length}/${project.blocks?.length ?? 0}   ${totalSec.toFixed(2)}s of video`);
for (const m of missing) console.log(`  missing  ${m.id}  ${m.why}${m.take ? ` (take ${m.take})` : ""}`);

if (args.check || missing.length > 0) {
  process.exitCode = missing.length > 0 ? 1 : 0;
} else {
  const dir = mkdtempSync(join(tmpdir(), "ch04-cat-"));
  const listFile = join(dir, "list.txt");
  writeFileSync(listFile, rows.map((r) => concatLine(r.file)).join("\n") + "\n", "utf8");

  try {
    await run(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outFile], {
      maxBuffer: 1 << 26
    });
    console.log(`wrote ${outFile}  (stream copy)`);
  } catch (e) {
    console.log("stream copy failed, re-encoding");
    if (e.stderr) console.log(String(e.stderr).split("\n").slice(-4).join("\n"));
    await run(
      ffmpegPath,
      [
        "-hide_banner", "-loglevel", "error", "-y",
        "-f", "concat", "-safe", "0", "-i", listFile,
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        outFile
      ],
      { maxBuffer: 1 << 26 }
    );
    console.log(`wrote ${outFile}  (re-encoded)`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  const got = await probe(outFile);
  console.log(`duration ${got?.toFixed(2) ?? "?"}s  (expected ${totalSec.toFixed(2)}s)`);
}
