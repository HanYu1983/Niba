/**
 * Submit MiniMax H3 clips from a plain story.json `shots` list, asynchronously.
 *
 *   node workspace/tools/generate_videos_from_json.mjs --json .\test_story5\story.json --output .\test_story5\output\video --mode r2v
 *   node workspace/tools/generate_videos_from_json.mjs --json .\test_story5\story.json --output .\test_story5\output\video --id shot_1_1,shot_2_1 --mode t2v
 *
 * * `--id` / `--shot` may be repeated or comma separated; without them every shot is submitted.
 * * `--mode t2v|r2v` (default r2v). r2v resolves each `shot.ref_ids` to the reference folder with
 *   the newest creation time under `--refs`, then the newest image inside that folder.
 * * Downloads are meant to land in `<output>/<shot.id>/` (e.g. video/shot_1_1/shot_00001.mp4).
 * * Submission is async (`wait:false`). `<output>/render_jobs.json` holds prompt_ids + ComfyUI
 *   connection info so the clips can be downloaded later, e.g.:
 *     node comfyui_mcp/cli.mjs --job <prompt_id> --wait true --download true --output_dir <dir>
 *
 * Options: --json, --output, --refs / --ref-root, --id / --shot, --mode, --width, --height,
 *          --fps, --duration, --turbo / --no-turbo, --seed, --prefix, --ref-size, --force,
 *          --dry-run, --jobs <file>.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { jobsDir } from "../../comfyui_mcp/jobs.mjs";
import { runTool, runtime } from "../../comfyui_mcp/runner.mjs";
import { boolArg, listArg, numArg, parseArgs, usage } from "../lib/args.mjs";

const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const args = parseArgs();

const jsonArg = args.json ?? args._[0];
const outputArg = args.output ?? args.out;
if (!jsonArg || jsonArg === true) {
  usage("missing --json <story.json>", [
    "usage: node workspace/tools/generate_videos_from_json.mjs --json <story.json> --output <dir> [--mode t2v|r2v] [--id <shot_id>]"
  ]);
}
if (!outputArg || outputArg === true) {
  usage("missing --output <dir>", ["results are downloaded to <output>/<shot.id>/"]);
}

const mode = args.mode === undefined ? "r2v" : String(args.mode).toLowerCase();
if (mode !== "t2v" && mode !== "r2v") {
  usage(`--mode must be t2v or r2v, got ${JSON.stringify(args.mode)}`, ["example: --mode r2v"]);
}

const jsonFile = resolve(String(jsonArg));
const outputRoot = resolve(String(outputArg));
// Default assumes the reference generator wrote to <story>/output/refs and clips go to
// <story>/output/video — both share the same parent.
const refsArg = args.refs ?? args["ref-root"];
const refsRoot = refsArg && refsArg !== true ? resolve(String(refsArg)) : resolve(dirname(outputRoot), "refs");
const jobsFile = args.jobs && args.jobs !== true ? resolve(String(args.jobs)) : resolve(outputRoot, "render_jobs.json");

let story;
try {
  story = JSON.parse(readFileSync(jsonFile, "utf8"));
} catch (e) {
  usage(`cannot read ${jsonFile}: ${e.message}`, ["--json must point to a readable JSON file"]);
}
if (!Array.isArray(story?.shots)) {
  usage(`${jsonFile} has no shots[] array`, ["expected a top-level \"shots\": [{ id, prompt, duration, ref_ids }]"]);
}

const requestedIds = [...new Set([...listArg(args, "id"), ...listArg(args, "shot"), ...listArg(args, "shots")])];
const availableIds = story.shots.map((s) => s?.id).filter(Boolean);
const unknown = requestedIds.filter((id) => !availableIds.includes(id));
if (unknown.length) {
  usage(`unknown shot id(s): ${unknown.join(", ")}`, [`available: ${availableIds.join(", ") || "(none)"}`]);
}
const targets = requestedIds.length ? story.shots.filter((s) => requestedIds.includes(s.id)) : story.shots;

const renderCfg = story.render ?? {};
const width = numArg(args, "width", Number(renderCfg.width ?? 352));
const height = numArg(args, "height", Number(renderCfg.height ?? 608));
const fps = numArg(args, "fps", Number(renderCfg.fps ?? 24));
const turbo = boolArg(args, "turbo", renderCfg.turbo ?? true);
const seed = args.seed === undefined ? undefined : numArg(args, "seed", null);
const prefix = String(args.prefix ?? "shot");
const refSize = String(args["ref-size"] ?? "match");
const force = boolArg(args, "force", false);
const dryRun = boolArg(args, "dry-run", false);

/** Reuse the same folder-name rule as generate_refs_from_json.mjs. */
function folderName(id) {
  const safe = String(id).replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "");
  if (!safe || safe === "." || safe === "..") throw new Error(`unsafe id: ${JSON.stringify(id)}`);
  return safe;
}
const dirFor = (id) => resolve(outputRoot, folderName(id));

const created = (stat) => stat.birthtimeMs || stat.ctimeMs || stat.mtimeMs;

/** Newest reference folder for an id: exact match or `<id>_...` / `<id>-...` variants. */
function newestRefFolder(id) {
  if (!existsSync(refsRoot)) return null;
  const safe = folderName(id);
  return readdirSync(refsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const dir = resolve(refsRoot, e.name);
      try {
        return { dir, stat: statSync(dir) };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter(({ dir }) => {
      const name = dir.slice(refsRoot.length + 1);
      return name === safe || name.startsWith(`${safe}_`) || name.startsWith(`${safe}-`);
    })
    .sort((a, b) => created(b.stat) - created(a.stat) || b.stat.mtimeMs - a.stat.mtimeMs)[0]?.dir ?? null;
}

function newestImage(dir) {
  if (!dir || !existsSync(dir)) return null;
  return readdirSync(dir)
    .filter((f) => IMAGE_RE.test(f))
    .map((f) => {
      const path = resolve(dir, f);
      try {
        return { path, stat: statSync(path) };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => created(b.stat) - created(a.stat) || b.stat.mtimeMs - a.stat.mtimeMs)[0]?.path ?? null;
}

function refsFor(shot) {
  const refs = [];
  const missing = [];
  for (const id of shot.ref_ids ?? []) {
    const image = newestImage(newestRefFolder(id));
    if (image) refs.push(image);
    else missing.push(id);
  }
  return { refs, missing };
}

function durationFor(shot) {
  const raw = shot.duration ?? args.duration ?? 5;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${shot.id}: invalid duration ${JSON.stringify(raw)}`);
  return n;
}

/* --------------------------------------------------------------- previous jobs info */

let prior = null;
if (existsSync(jobsFile)) {
  try {
    prior = JSON.parse(readFileSync(jobsFile, "utf8"));
  } catch {
    prior = null;
  }
}
const reusable =
  prior && prior.json === jsonFile && prior.output === outputRoot && prior.mode === mode && Array.isArray(prior.shots);
const byId = new Map((reusable ? prior.shots : []).map((s) => [s.id, s]));

const prepared = [];
const skippedExisting = [];
const missingRefs = [];
const invalid = [];
for (const shot of targets) {
  const id = shot.id;
  if (!id || typeof shot.prompt !== "string" || !shot.prompt.trim()) {
    invalid.push({ id: id ?? null, reason: "missing id or prompt" });
    continue;
  }
  if (!force && byId.get(id)?.prompt_id) {
    skippedExisting.push({ id, prompt_id: byId.get(id).prompt_id });
    continue;
  }
  let refs = [];
  let missing = [];
  if (mode === "r2v") {
    ({ refs, missing } = refsFor(shot));
    if (missing.length) {
      missingRefs.push({ id, ref_ids: missing, refs_root: refsRoot });
      continue;
    }
  }
  let durationSec;
  try {
    durationSec = durationFor(shot);
  } catch (e) {
    invalid.push({ id, reason: e.message });
    continue;
  }
  prepared.push({ shot, destDir: dirFor(id), refs, durationSec });
}

console.log(
  JSON.stringify(
    {
      json: jsonFile,
      output: outputRoot,
      refs_root: mode === "r2v" ? refsRoot : null,
      jobs_file: jobsFile,
      mode,
      shots: targets.length,
      submitting: prepared.length,
      skipped_existing: skippedExisting.length,
      missing_refs: missingRefs.length,
      invalid: invalid.length,
      size: `${width}x${height}`,
      turbo,
      ...(dryRun ? { dry_run: true } : {})
    },
    null,
    2
  )
);

if (dryRun) {
  for (const { shot, destDir, refs, durationSec } of prepared) {
    console.log(
      `${shot.id} ${durationSec}s ${refs.length ? `refs=${refs.join(", ")}` : "no refs"} -> ${destDir}/${prefix}`
    );
  }
  process.exitCode = missingRefs.length || invalid.length ? 1 : 0;
} else {
  let rt;
  try {
    rt = runtime();
  } catch (e) {
    console.error(`ComfyUI 設定不可用：${e.message}`);
    console.error("請先設定 comfyui_mcp/metadata.json 的 comfyui.url（也可用 COMFYUI_MCP_METADATA 指向其它檔）。");
    process.exitCode = 1;
  }

  if (rt) {
    mkdirSync(outputRoot, { recursive: true });

    let jobsDirPath = null;
    try {
      jobsDirPath = jobsDir();
    } catch {
      jobsDirPath = null;
    }

    const info = reusable
      ? structuredClone(prior)
      : {
          version: 1,
          json: jsonFile,
          output: outputRoot,
          mode,
          refs_root: mode === "r2v" ? refsRoot : null,
          submitted_at: null,
          shots: []
        };
    info.submitted_at = new Date().toISOString();
    info.comfyui = {
      url: rt.settings.url,
      client_id: rt.settings.clientId,
      default_output_dir: rt.outputDir ?? null,
      timeout_sec: rt.settings.timeoutSec,
      jobs_dir: jobsDirPath
    };

    const saveInfo = () => writeFileSync(jobsFile, JSON.stringify(info, null, 2) + "\n", "utf8");
    saveInfo();

    const failures = [];
    for (const [i, { shot, destDir, refs, durationSec }] of prepared.entries()) {
      const tag = `[${i + 1}/${prepared.length}] ${shot.id}`;
      mkdirSync(destDir, { recursive: true });

      const payload = {
        prompt: shot.prompt.trim(),
        width,
        height,
        duration_sec: durationSec,
        fps,
        turbo,
        ...(seed === undefined ? {} : { seed }),
        filename_prefix: prefix,
        ...(mode === "r2v" ? { reference_images: refs, ref_image_size: refSize } : {})
      };
      const label = { project: "story_videos", json: jsonFile, shot_id: shot.id, mode, model: "minimax_h3" };

      try {
        const result = await runTool(mode === "r2v" ? "minimax_r2v" : "minimax_t2v", payload, {
          label,
          output_dir: destDir,
          wait: false
        });

        const entry = {
          id: shot.id,
          status: result.status,
          prompt_id: result.prompt_id,
          queue_number: result.queue_number ?? null,
          queue_position: result.queue_position ?? null,
          tool: result.tool,
          workflow: result.workflow,
          prompt: shot.prompt.trim(),
          duration_sec: durationSec,
          ref_ids: shot.ref_ids ?? [],
          reference_images: refs,
          width,
          height,
          fps,
          turbo,
          filename_prefix: prefix,
          output_dir: destDir,
          label,
          job_file: result.job_file ?? null,
          summary: result.summary ?? null,
          history_url: result.prompt_id ? `${rt.settings.url}/history/${result.prompt_id}` : null,
          // Pass this object to comfy_job / inspectJob to pull the finished clip.
          download: { prompt_id: result.prompt_id, wait: true, download: true, output_dir: destDir },
          download_command: result.prompt_id
            ? `node comfyui_mcp/cli.mjs --job ${result.prompt_id} --wait true --download true --output_dir ${JSON.stringify(destDir)}`
            : null
        };

        const at = info.shots.findIndex((s) => s.id === shot.id);
        if (at >= 0) info.shots[at] = entry;
        else info.shots.push(entry);
        saveInfo(); // persist each prompt_id as soon as ComfyUI accepts it
        console.log(`${tag} ${result.status} prompt_id=${result.prompt_id} queue=${result.queue_number ?? "-"}`);
      } catch (e) {
        failures.push({ id: shot.id, error: e.message });
        const at = info.shots.findIndex((s) => s.id === shot.id);
        const entry = { id: shot.id, status: "failed", error: e.message, output_dir: destDir };
        if (at >= 0) info.shots[at] = entry;
        else info.shots.push(entry);
        saveInfo();
        console.error(`${tag} FAILED ${e.message}`);
      }
    }

    console.log(
      JSON.stringify(
        {
          submitted: prepared.length - failures.length,
          failed: failures,
          skipped_existing: skippedExisting,
          missing_refs: missingRefs,
          invalid,
          jobs_file: jobsFile,
          shots: info.shots.map((s) => ({ id: s.id, status: s.status, prompt_id: s.prompt_id ?? null }))
        },
        null,
        2
      )
    );
    // process.exitCode, not process.exit(): pending fetch sockets can abort stdout on Windows.
    process.exitCode = failures.length || missingRefs.length || invalid.length ? 1 : 0;
  }
}
