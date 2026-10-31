/**
 * Smoke test: builders, metadata, the HTTP client, the run pipeline, and the MCP surface.
 *
 * No GPU needed: a tiny fake ComfyUI server speaks /system_stats, /queue, /prompt, /history,
 * /view and /upload/image. Run: node test/smoke.mjs
 */

import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { ComfyClient, ComfyError, jobOutcome, summarizeNodeErrors } from "../comfy.mjs";
import { MetadataError, comfyuiSettings, readMetadata, updateMetadata } from "../metadata.mjs";
import { createMcpServer } from "../mcp_core.mjs";
import { inspectJob, runTool } from "../runner.mjs";
import {
  TOOLS,
  buildFirstFrame,
  buildLastFrame,
  buildMinimaxR2V,
  buildMinimaxT2V,
  buildSdxlT2I,
  buildTextGen,
  buildUpscaleVideo,
  buildZImageT2I,
  coverage,
  dropNodes,
  listWorkflowFiles,
  loadWorkflow,
  setPath
} from "../workflows.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
let pass = 0;
function check(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then(() => {
      pass += 1;
      console.log(`ok  ${name}`);
    })
    .catch((e) => {
      console.error(`not ok  ${name}\n${e.stack ?? e}`);
      process.exitCode = 1;
      throw e;
    });
}

/* ------------------------------------------------------------------ fake ComfyUI */

const FAKE_PNG = Buffer.from("89504e470d0a1a0a-fake-png", "utf8");

function createFakeComfy({ historyPolls = 1, failExecution = false } = {}) {
  const state = {
    submitted: [],
    uploads: [],
    downloads: [],
    cancelled: [],
    interrupted: [],
    seen: new Map(),
    queueRunning: []
  };

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://fake");
    const send = (code, body, type = "application/json") => {
      res.writeHead(code, { "content-type": type });
      res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
    };

    if (url.pathname === "/system_stats") {
      return send(200, {
        system: { comfyui_version: "0.41.3", python_version: "3.12", os: "win32", ram_free: 1 },
        devices: [{ name: "cuda:0 Fake", vram_total: 17e9, vram_free: 12e9 }]
      });
    }

    if (url.pathname === "/queue" && req.method === "GET") {
      return send(200, { queue_running: state.queueRunning, queue_pending: [] });
    }

    if (url.pathname === "/queue" && req.method === "POST") {
      const body = await readBody(req);
      const parsed = JSON.parse(body || "{}");
      state.cancelled.push(...(parsed.delete ?? []));
      return send(200, {});
    }

    if (url.pathname === "/interrupt") {
      state.interrupted.push(url.searchParams.get("prompt_id"));
      return send(200, {});
    }

    if (url.pathname === "/prompt" && req.method === "POST") {
      const body = JSON.parse(await readBody(req));
      if (Object.values(body.prompt ?? {}).some((n) => n?.inputs?.ckpt_name === "missing.safetensors")) {
        return send(400, {
          error: { type: "prompt_outputs_failed_validation", message: "Prompt outputs failed validation" },
          node_errors: {
            "9": { class_type: "CheckpointLoaderSimple", errors: [{ message: "Value not in list" }] }
          }
        });
      }
      const id = `fake-${state.submitted.length + 1}`;
      state.submitted.push({ id, body });
      return send(200, { prompt_id: id, number: 151 + state.submitted.length, node_errors: {} });
    }

    if (url.pathname.startsWith("/history/")) {
      const id = decodeURIComponent(url.pathname.slice("/history/".length));
      const polls = (state.seen.get(id) ?? 0) + 1;
      state.seen.set(id, polls);
      if (polls <= historyPolls) return send(200, {});
      const submitted = state.submitted.find((s) => s.id === id);
      if (!submitted) return send(200, {});
      const wantVideo = Object.values(submitted.body.prompt).some((n) => n.class_type === "SaveVideo");
      const outputs = wantVideo
        ? {
            92: {
              images: [
                {
                  filename: "MiniMax_H3_00001_.mp4",
                  subfolder: "video",
                  type: "output",
                  metadata: { kind: "video", width: 512, height: 512, fps: 24, duration: 5.2, frame_count: 125 }
                }
              ]
            }
          }
        : {
            7: {
              images: [
                { filename: "sdxl_00001_.png", subfolder: "", type: "output", metadata: { width: 832, height: 1216 } }
              ]
            },
            4: { text: ["a generated description"] }
          };
      return send(200, {
        [id]: {
          prompt: [151, id, submitted.body.prompt, {}, ["7"]],
          status: {
            status_str: failExecution ? "error" : "success",
            completed: !failExecution,
            messages: failExecution
              ? [["execution_error", { node_id: "5", node_type: "KSampler", exception_message: "CUDA OOM" }]]
              : [["execution_success", {}]]
          },
          outputs: failExecution ? {} : outputs
        }
      });
    }

    if (url.pathname === "/history") {
      return send(200, {});
    }

    if (url.pathname === "/view") {
      state.downloads.push({
        filename: url.searchParams.get("filename"),
        subfolder: url.searchParams.get("subfolder"),
        type: url.searchParams.get("type")
      });
      return send(200, FAKE_PNG, "image/png");
    }

    if (url.pathname === "/upload/image") {
      const body = await readBody(req);
      const contentType = req.headers["content-type"] ?? "";
      state.uploads.push({ contentType, bytes: body.length, body });
      return send(200, { name: "mcp_uploaded.png", subfolder: "", type: "input" });
    }

    if (url.pathname === "/object_info/CheckpointLoaderSimple") {
      return send(200, {
        CheckpointLoaderSimple: { input: { required: { ckpt_name: [["nostrarealisticmix_v20SDXLVAE.safetensors"]] } } }
      });
    }
    if (url.pathname.startsWith("/object_info/")) {
      const node = url.pathname.slice("/object_info/".length);
      const combos = {
        UNETLoader: { unet_name: ["zImageUltimateNSFW_v20.safetensors", "minimax_h3_ref2va_pruned_int8_convrot.safetensors"] },
        CLIPLoader: { clip_name: ["qwen_3_4b.safetensors", "qwen3.5_4b_bf16.safetensors"] },
        VAELoader: { vae_name: ["ae.safetensors"] },
        LoraLoaderModelOnly: { lora_name: ["minimax_h3_ref2v_turbo_4step_v0.1_comfyui_bf16.safetensors"] },
        UpscaleModelLoader: { model_name: [["RealESRGAN_x4plus.safetensors"]] }
      };
      const fields = combos[node] ?? {};
      return send(200, { [node]: { input: { required: fields } } });
    }

    return send(404, { error: "not found" });
  });

  return {
    state,
    listen: () =>
      new Promise((r) => {
        server.listen(0, "127.0.0.1", () => r(`http://127.0.0.1:${server.address().port}`));
      }),
    close: () => new Promise((r) => server.close(r))
  };
}

function readBody(req) {
  return new Promise((r) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => r(Buffer.concat(chunks).toString("utf8")));
  });
}

/** No GraphQL, no dangling [node, slot] links: every link must point at a node still present. */
function assertNoDanglingLinks(workflow) {
  for (const [id, node] of Object.entries(workflow)) {
    for (const [key, value] of Object.entries(node.inputs ?? {})) {
      if (Array.isArray(value) && value.length === 2 && typeof value[0] === "string" && Number.isInteger(value[1])) {
        assert.ok(workflow[value[0]], `node ${id}.${key} links to missing node ${value[0]}`);
      }
    }
  }
}

const testRoot = mkdtempSync(join(tmpdir(), "comfyui-mcp-"));
const metadataFile = join(testRoot, "metadata.json");
process.env.COMFYUI_MCP_METADATA = metadataFile;
const outRoot = join(testRoot, "downloads");

/* ------------------------------------------------------------------ templates */

await check("every workflow template has a tool, and every tool has a template", () => {
  const cov = coverage();
  assert.equal(cov.files.length, 8);
  assert.deepEqual(cov.unmapped_files, []);
  assert.deepEqual(cov.missing_files, []);
  assert.deepEqual(listWorkflowFiles().sort(), cov.files);
  assert.equal(new Set(TOOLS.map((t) => t.tool)).size, TOOLS.length, "tool names are unique");
  for (const file of cov.files) assert.ok(loadWorkflow(file), `${file} parses`);
});

await check("loadWorkflow hands back a fresh copy each time", () => {
  const a = loadWorkflow("workflow_sdxl_t2i.json");
  a["2"].inputs.text = "mutated";
  assert.equal(loadWorkflow("workflow_sdxl_t2i.json")["2"].inputs.text, "");
});

await check("setPath / dropNodes patch by node id", () => {
  const wf = loadWorkflow("workflow_sdxl_t2i.json");
  setPath(wf, "5.inputs.seed", 7);
  assert.equal(wf["5"].inputs.seed, 7);
  setPath(wf, "5.inputs.missing.deep", 1);
  assert.deepEqual(wf["5"].inputs.missing, { deep: 1 });

  dropNodes(wf, ["7"]);
  assert.equal(wf["7"], undefined);
});

/* ------------------------------------------------------------------ image builders */

await check("sdxl_t2i fills every knob and keeps the graph coherent", () => {
  const { workflow, summary } = buildSdxlT2I({
    prompt: "a judge",
    negative_prompt: "text",
    width: 832,
    height: 1216,
    seed: 42,
    steps: 30,
    cfg: 6.5,
    filename_prefix: "refs/char_judge_xu/plate"
  });
  assert.equal(workflow["2"].inputs.text, "a judge");
  assert.equal(workflow["3"].inputs.text, "text");
  assert.equal(workflow["4"].inputs.width, 832);
  assert.equal(workflow["4"].inputs.height, 1216);
  assert.equal(workflow["4"].inputs.batch_size, 1);
  assert.equal(workflow["5"].inputs.seed, 42);
  assert.equal(workflow["5"].inputs.steps, 30);
  assert.equal(workflow["5"].inputs.cfg, 6.5);
  assert.equal(workflow["7"].inputs.filename_prefix, "refs/char_judge_xu/plate");
  assert.deepEqual(workflow["7"].inputs.images, ["6", 0]);
  assert.equal(summary.seed, 42);
  assertNoDanglingLinks(workflow);
});

await check("sdxl_t2i rejects an empty prompt and a bad size", () => {
  assert.throws(() => buildSdxlT2I({ prompt: "  " }), /prompt is required/);
  assert.throws(() => buildSdxlT2I({ prompt: "x", width: -3 }), /width must be a positive integer/);
});

await check("first_frame / last_frame differ only in defaults", () => {
  const first = buildFirstFrame({ prompt: "a" });
  const last = buildLastFrame({ prompt: "b" });
  assert.equal(first.workflow["7"].inputs.filename_prefix, "frame_first");
  assert.equal(last.workflow["7"].inputs.filename_prefix, "frame_last");
  assert.equal(first.workflow["1"].inputs.ckpt_name, last.workflow["1"].inputs.ckpt_name);
  assert.equal(first.workflow["5"].inputs.steps, 20);
});

await check("z_image_t2i keeps the zeroed negative and defaults to 8 steps / cfg 1", () => {
  const { workflow, summary } = buildZImageT2I({ prompt: "a street", seed: 5 });
  assert.equal(workflow["6"].inputs.text, "a street");
  assert.equal(workflow["7"].class_type, "ConditioningZeroOut");
  assert.deepEqual(workflow["7"].inputs.conditioning, ["6", 0]);
  assert.equal(workflow["8"].inputs.steps, 8);
  assert.equal(workflow["8"].inputs.cfg, 1);
  assert.equal(workflow["8"].inputs.seed, 5);
  assert.equal(summary.model, "zImageUltimateNSFW_v20.safetensors");
  assert.equal(workflow["5"].class_type, "EmptySD3LatentImage");
});

/* ------------------------------------------------------------------ video builders */

const noUpload = async (value) => `uploaded:${value}`;

await check("minimax_t2v quantises duration to 17-frame blocks", async () => {
  const { workflow, summary } = await buildMinimaxT2V({ prompt: "a room", duration_sec: 12, seed: 9 }, { upload: noUpload });
  assert.equal(workflow["140:133"].inputs.value, 12);
  assert.deepEqual(workflow["140:131"].inputs.length, ["140:132", 1]);
  assert.equal(summary.frames, 294);
  assert.equal(summary.duration_sec, 12.25);
  assert.equal(workflow["140:129"].inputs.noise_seed, 9);
  assertNoDanglingLinks(workflow);
});

await check("an explicit frame count is quantised the same way (48 -> 56)", async () => {
  const { workflow, summary } = await buildMinimaxT2V({ prompt: "a room", frames: 48 }, { upload: noUpload });
  assert.equal(workflow["140:131"].inputs.length, 56, "the length link is replaced by a literal");
  assert.equal(summary.frames, 56);
  assert.equal(summary.duration_sec, 2.33);
  assert.equal(workflow["140:133"].inputs.value, 12, "the duration primitive is left alone");
});

await check("minimax_t2v without stills drops the frame branches cleanly", async () => {
  const { workflow } = await buildMinimaxT2V({ prompt: "a room" }, { upload: noUpload });
  assert.equal("first_frame" in workflow["140:131"].inputs, false);
  assert.equal("last_frame" in workflow["140:131"].inputs, false);
  assert.equal(workflow.load_first, undefined);
  assert.equal(workflow.scale_last, undefined);
  assertNoDanglingLinks(workflow);

  // the rest of the graph must survive: sampler, decoders, save
  for (const id of ["92", "140:127", "140:128", "140:125", "140:122", "140:130"]) {
    assert.ok(workflow[id], `node ${id} is still there`);
  }
});

await check("minimax_t2v uploads stills and rescales them to the output size", async () => {
  const { workflow, summary } = await buildMinimaxT2V(
    { prompt: "a room", width: 576, height: 896, first_frame: "C:/a.png", last_frame: "C:/b.png", turbo: true },
    { upload: noUpload }
  );
  assert.equal(workflow.load_first.inputs.image, "uploaded:C:/a.png");
  assert.equal(workflow.load_last.inputs.image, "uploaded:C:/b.png");
  assert.equal(workflow["140:131"].inputs.width, 576);
  assert.equal(workflow.scale_first.inputs.height, 896);
  assert.equal(workflow.scale_last.inputs.width, 576);
  assert.equal(workflow["140:139"].inputs.value, true, "turbo flips the Lite LoRA switch");
  assert.deepEqual(summary, {
    model: "minimax_h3_fl2va_pruned_int8_convrot.safetensors",
    width: 576,
    height: 896,
    fps: 24,
    turbo: true,
    seed: summary.seed,
    frames: 294,
    duration_sec: 12.25,
    filename_prefix: "video/MiniMax_H3",
    first_frame: "uploaded:C:/a.png",
    last_frame: "uploaded:C:/b.png"
  });
  assertNoDanglingLinks(workflow);
});

await check("minimax_t2v rejects sizes that are not multiples of 32", async () => {
  await assert.rejects(() => buildMinimaxT2V({ prompt: "x", width: 500 }, { upload: noUpload }), /multiple of 32/);
});

await check("minimax_r2v fills the reference slots it was given and drops the rest", async () => {
  const { workflow, summary } = await buildMinimaxR2V(
    { prompt: "two people", reference_images: ["C:/a.png", "C:/b.png"], duration_sec: 5, ref_image_size: "max" },
    { upload: noUpload }
  );
  assert.equal(workflow["137"].inputs.image, "uploaded:C:/a.png");
  assert.equal(workflow["139"].inputs.image, "uploaded:C:/b.png");
  assert.equal(workflow["147"], undefined, "unused third slot removed");
  assert.equal("ref_images.ref_image_2" in workflow["136"].inputs, false);
  assert.equal(workflow["136"].inputs.ref_image_size, "max");
  assert.equal(workflow["136"].inputs.width, 352);
  assert.equal(workflow["136"].inputs.height, 608);
  assert.deepEqual(summary.reference_images, [
    { role: "ref_image_0", name: "uploaded:C:/a.png" },
    { role: "ref_image_1", name: "uploaded:C:/b.png" }
  ]);
  assertNoDanglingLinks(workflow);
});

await check("minimax_r2v guards the slot count", async () => {
  await assert.rejects(() => buildMinimaxR2V({ prompt: "x", reference_images: [] }, { upload: noUpload }), /at least one/);
  await assert.rejects(
    () => buildMinimaxR2V({ prompt: "x", reference_images: ["a", "b", "c", "d"] }, { upload: noUpload }),
    /three reference slots/
  );
});

await check("minimax_r2v accepts a single string reference (CLI shape)", async () => {
  const { workflow, summary } = await buildMinimaxR2V({ prompt: "x", reference_images: "C:/only.png" }, { upload: noUpload });
  assert.equal(workflow["137"].inputs.image, "uploaded:C:/only.png");
  assert.equal(summary.reference_images.length, 1);
  assert.equal(workflow["139"], undefined);
  assert.equal(workflow["147"], undefined);
});

await check("upscale_video uploads the clip and keeps audio/fps wiring", async () => {
  const { workflow, summary } = await buildUpscaleVideo({ video: "C:/clip.mp4" }, { upload: noUpload });
  assert.equal(workflow["9"].inputs.file, "uploaded:C:/clip.mp4");
  assert.deepEqual(workflow["11"].inputs.audio, ["10", 1]);
  assert.deepEqual(workflow["11"].inputs.fps, ["10", 2]);
  assert.deepEqual(workflow["2"].inputs.image, ["10", 0]);
  assert.equal(summary.filename_prefix, "video/upscaled");
  assertNoDanglingLinks(workflow);
});

/* ------------------------------------------------------------------ text builder */

await check("text_gen without an image drops the LoadImage branch", async () => {
  const { workflow } = await buildTextGen({ prompt: "say hi" }, { upload: noUpload });
  assert.equal(workflow["3"].inputs.prompt, "say hi");
  assert.equal("image" in workflow["3"].inputs, false);
  assert.equal(workflow["2"], undefined);
  assertNoDanglingLinks(workflow);
});

await check("text_gen honours sampling overrides and system prompts", async () => {
  const { workflow } = await buildTextGen(
    {
      prompt: "describe",
      image: "C:/plate.png",
      max_length: 512,
      sampling: { temperature: 0.3, top_k: 20, seed: 11 },
      system_prompt: "you are terse"
    },
    { upload: noUpload }
  );
  assert.equal(workflow["2"].inputs.image, "uploaded:C:/plate.png");
  assert.deepEqual(workflow["3"].inputs.image, ["2", 0]);
  assert.equal(workflow["3"].inputs.max_length, 512);
  assert.equal(workflow["3"].inputs["sampling_mode.temperature"], 0.3);
  assert.equal(workflow["3"].inputs["sampling_mode.top_k"], 20);
  assert.equal(workflow["3"].inputs["sampling_mode.seed"], 11);
  assert.equal(workflow["3"].inputs.system_prompt, "you are terse");
  assert.equal(workflow["3"].inputs.use_default_template, false);
});

/* ------------------------------------------------------------------ metadata */

await check("metadata: missing file means unconfigured, not broken", () => {
  const { exists, data } = readMetadata();
  assert.equal(exists, false);
  assert.deepEqual(comfyuiSettings(data), { url: null, outputDir: null, timeoutSec: 900, clientId: "comfyui-mcp" });
});

await check("metadata_set writes url + absolute output dir and creates the folder", () => {
  const out = updateMetadata({ url: "http://127.0.0.1:1/", output_dir: outRoot, timeout_sec: 120 });
  assert.equal(out.url, "http://127.0.0.1:1", "trailing slash trimmed");
  assert.equal(out.outputDir, outRoot);
  assert.equal(out.created, true);
  assert.equal(existsSync(outRoot), true);
  assert.equal(readFileSync(metadataFile, "utf8").includes('"timeout_sec": 120'), true);
});

await check("metadata rejects relative folders and non-http urls", () => {
  assert.throws(() => updateMetadata({ output_dir: "refs/x" }), MetadataError);
  assert.throws(() => updateMetadata({ output_dir: "refs/x" }), /must be an absolute path/);
  assert.throws(() => updateMetadata({ url: "ftp://box:21" }), /must be http or https/);
  assert.throws(() => updateMetadata({}), /nothing to update/);
});

await check("metadata merges instead of clobbering unrelated keys", () => {
  const before = JSON.parse(readFileSync(metadataFile, "utf8"));
  updateMetadata({ client_id: "smoke" });
  const after = JSON.parse(readFileSync(metadataFile, "utf8"));
  assert.equal(after.comfyui.url, before.comfyui.url);
  assert.equal(after.comfyui.output_dir, before.comfyui.output_dir);
  assert.equal(after.comfyui.client_id, "smoke");
});

/* ------------------------------------------------------------------ live-ish pipeline */

const fake = createFakeComfy();
const baseUrl = await fake.listen();
updateMetadata({ url: baseUrl, output_dir: outRoot, timeout_sec: 30, client_id: "smoke" });

await check("client submits, waits, and mirrors outputs into output_dir", async () => {
  const result = await runTool("sdxl_t2i", {
    prompt: "a judge",
    seed: 42,
    filename_prefix: "refs/char_judge_xu/plate"
  });

  assert.equal(result.status, "success");
  assert.equal(result.prompt_id, "fake-1");
  assert.equal(result.output_dir, outRoot);
  assert.equal(result.files.length, 1);

  const [file] = result.files;
  assert.equal(file.kind, "image");
  assert.equal(file.width, 832);
  assert.equal(file.path, join(outRoot, "sdxl_00001_.png"));
  assert.equal(existsSync(file.path), true);
  assert.equal(file.bytes, FAKE_PNG.length);
  assert.deepEqual(fake.state.downloads[0], { filename: "sdxl_00001_.png", subfolder: "", type: "output" });

  // the payload actually reached /prompt in API format
  const sent = fake.state.submitted[0].body;
  assert.equal(sent.client_id, "smoke");
  assert.equal(sent.prompt["2"].inputs.text, "a judge");
  assert.equal(sent.prompt["7"].inputs.filename_prefix, "refs/char_judge_xu/plate");
});

await check("subfolder in the remote path is mirrored locally", async () => {
  const result = await runTool("minimax_r2v", {
    prompt: "two people talking",
    reference_images: ["C:/a.png"],
    duration_sec: 5
  });
  assert.equal(result.status, "success");
  assert.equal(result.files[0].kind, "video");
  assert.equal(result.files[0].subfolder, "video");
  assert.equal(result.files[0].path, join(outRoot, "video", "MiniMax_H3_00001_.mp4"));
  assert.equal(result.files[0].duration_sec, 5.2);
  assert.equal(result.files[0].fps, 24);
  assert.equal(existsSync(result.files[0].path), true);
});

await check("local input files are uploaded as multipart/form-data", async () => {
  const asset = join(testRoot, "plate.png");
  writeFileSync(asset, "not-really-a-png");
  const before = fake.state.uploads.length;
  await runTool("sdxl_t2i", { prompt: "x", filename_prefix: "refs/test/plate" }, { download: false });

  await runTool(
    "minimax_r2v",
    { prompt: "x", reference_images: [asset] },
    { download: false }
  );
  const upload = fake.state.uploads[before];
  assert.match(upload.contentType, /^multipart\/form-data; boundary=/);
  assert.match(upload.body, /not-really-a-png/, "file bytes went over the wire");
  const sent = fake.state.submitted.at(-1).body;
  assert.equal(sent.prompt["137"].inputs.image, "mcp_uploaded.png");
});

await check("wait:false returns the prompt_id without downloading", async () => {
  const before = fake.state.downloads.length;
  const result = await runTool("sdxl_t2i", { prompt: "x" }, { wait: false });
  assert.equal(result.status, "queued");
  assert.equal(result.prompt_id, "fake-5");
  assert.equal(fake.state.downloads.length, before);
  assert.match(result.hint, /comfy_job/);
});

await check("comfy_job collects a job that was submitted with wait:false", async () => {
  const result = await inspectJob("fake-4", { wait: true });
  assert.equal(result.status, "success");
  assert.equal(result.files.length, 1);
  assert.equal(result.files[0].filename, "MiniMax_H3_00001_.mp4");
});

await check("text outputs come back as texts, not files", async () => {
  const result = await runTool("text_gen", { prompt: "describe this" });
  assert.equal(result.status, "success");
  assert.deepEqual(result.texts, [{ node: "4", slot: "text", text: "a generated description" }]);
});

await check("a rejected workflow surfaces the node errors", async () => {
  await assert.rejects(
    () => runTool("sdxl_t2i", { prompt: "x", ckpt_name: "missing.safetensors" }),
    (e) => {
      assert.ok(e instanceof ComfyError);
      assert.match(e.message, /ComfyUI rejected the workflow: Prompt outputs failed validation/);
      assert.equal(e.details.status, 400);
      assert.deepEqual(summarizeNodeErrors(e.details.body.node_errors), [
        { node: "9", class_type: "CheckpointLoaderSimple", errors: [{ message: "Value not in list", details: null, type: null }] }
      ]);
      return true;
    }
  );
});

await check("a failed execution is an error, with the node that died", async () => {
  const failing = createFakeComfy({ failExecution: true });
  const url = await failing.listen();
  updateMetadata({ url });
  await assert.rejects(() => runTool("sdxl_t2i", { prompt: "x" }), (e) => {
    assert.match(e.message, /job error/);
    assert.deepEqual(e.details.node_errors, [{ node: "5", type: "KSampler", message: "CUDA OOM" }]);
    return true;
  });
  await failing.close();
  updateMetadata({ url: baseUrl });
});

await check("cancel splits pending and running", async () => {
  const client = new ComfyClient({ url: baseUrl });
  fake.state.queueRunning = [[1, "fake-running", {}, {}, []]];
  const running = await client.cancel("fake-running");
  assert.equal(running.cancelled, "running");
  assert.deepEqual(fake.state.interrupted, [null], "interrupt posts without a prompt id");

  const pending = await client.cancel("fake-pending");
  assert.equal(pending.cancelled, null, "unknown ids are reported, not guessed");

  const nothing = await client.cancel("nope");
  assert.equal(nothing.cancelled, null);
  fake.state.queueRunning = [];
});

await check("models() reports what the box actually has", async () => {
  const client = new ComfyClient({ url: baseUrl });
  const models = await client.models();
  assert.deepEqual(models.checkpoints, ["nostrarealisticmix_v20SDXLVAE.safetensors"]);
  assert.deepEqual(models.upscalers, ["RealESRGAN_x4plus.safetensors"]);
});

await check("jobOutcome normalises success and error entries", () => {
  assert.deepEqual(jobOutcome({ status: { status_str: "success", completed: true, messages: [] } }), {
    status: "success",
    completed: true,
    errors: []
  });
  const err = jobOutcome({
    status: { status_str: "error", completed: false, messages: [["execution_error", { node_id: "5", exception_message: "boom" }]] }
  });
  assert.deepEqual(err.errors, [{ node: "5", type: null, message: "boom" }]);
});

await check("unsafe output paths are refused", async () => {
  const client = new ComfyClient({ url: baseUrl });
  await assert.rejects(
    () =>
      client.downloadOutputs(
        { outputs: { 1: { images: [{ filename: "../../evil.png", subfolder: "", type: "output" }] } } },
        { destRoot: outRoot }
      ),
    /unsafe filename/
  );
  await assert.rejects(
    () =>
      client.downloadOutputs(
        { outputs: { 1: { images: [{ filename: "ok.png", subfolder: "../../etc", type: "output" }] } } },
        { destRoot: outRoot }
      ),
    /unsafe path/
  );
});

/* ------------------------------------------------------------------ MCP surface */

const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
const mcp = createMcpServer();
await mcp.connect(serverSide);
const client = new Client({ name: "smoke", version: "0.0.0" });
await client.connect(clientSide);

await check("MCP exposes one tool per workflow plus management tools", async () => {
  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name);
  for (const t of TOOLS) assert.ok(names.includes(t.tool), `missing ${t.tool}`);
  for (const name of ["comfy_status", "comfy_workflows", "comfy_metadata_get", "comfy_metadata_set", "comfy_job", "comfy_cancel"]) {
    assert.ok(names.includes(name), `missing ${name}`);
  }
  assert.equal(names.length, TOOLS.length + 6);
});

await check("comfy_status reports url, queue, models and preflight", async () => {
  const res = await client.callTool({ name: "comfy_status", arguments: {} });
  const status = JSON.parse(res.content[0].text);
  assert.equal(status.configured, true);
  assert.equal(status.reachable, true);
  assert.equal(status.comfyui.comfyui_version, "0.41.3");
  assert.equal(status.queue.running.length, 0);
  const sdxl = status.preflight.find((p) => p.tool === "sdxl_t2i");
  assert.equal(sdxl.ready, true);
  const t2v = status.preflight.find((p) => p.tool === "minimax_t2v");
  assert.equal(t2v.ready, false);
  assert.ok(t2v.missing.includes("unets:minimax_h3_fl2va_pruned_int8_convrot.safetensors"));
});

await check("comfy_workflows lists templates and their tools", async () => {
  const res = await client.callTool({ name: "comfy_workflows", arguments: {} });
  const body = JSON.parse(res.content[0].text);
  assert.equal(body.tools.length, 8);
  assert.deepEqual(body.coverage.unmapped_files, []);
  assert.match(body.workflow_dir, /workflow$/);
});

await check("a generator runs end to end over MCP", async () => {
  const res = await client.callTool({
    name: "z_image_t2i",
    arguments: { prompt: "a rainy street", seed: 3, filename_prefix: "refs/loc_street/plate" }
  });
  assert.equal(res.isError, undefined);
  const body = JSON.parse(res.content[0].text);
  assert.equal(body.status, "success");
  assert.equal(body.tool, "z_image_t2i");
  assert.equal(body.files[0].path, join(outRoot, "sdxl_00001_.png"));
  const sent = fake.state.submitted.at(-1).body.prompt;
  assert.equal(sent["6"].inputs.text, "a rainy street");
  assert.equal(sent["8"].inputs.seed, 3);
});

await check("validation errors come back as isError, not a crash", async () => {
  const res = await client.callTool({ name: "minimax_r2v", arguments: { prompt: "x", reference_images: [] } });
  assert.equal(res.isError, true);
  assert.match(res.content[0].text, /at least 1 element/);

  const badSize = await client.callTool({ name: "minimax_t2v", arguments: { prompt: "x", width: 500 } });
  assert.equal(badSize.isError, true);
  assert.match(badSize.content[0].text, /multiple of 32/);
});

await check("comfy_metadata_set rejects a relative download root", async () => {
  const res = await client.callTool({ name: "comfy_metadata_set", arguments: { comfyui_output_dir: "out" } });
  assert.equal(res.isError, true);
  assert.match(res.content[0].text, /absolute path/);
});

await mcp.close();
await client.close();

/* ------------------------------------------------------------------ stdio */

await check("the stdio server starts and answers comfy_metadata_get", async () => {
  const stdio = new Client({ name: "smoke-stdio", version: "0.0.0" });
  await stdio.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [resolve(HERE, "../mcp_server_stdio.mjs")],
      env: { ...process.env, COMFYUI_MCP_METADATA: metadataFile }
    })
  );
  const res = await stdio.callTool({ name: "comfy_metadata_get", arguments: {} });
  const body = JSON.parse(res.content[0].text);
  assert.equal(body.url, baseUrl);
  assert.equal(body.outputDir, outRoot);
  await stdio.close();
});

await check("unconfigured metadata gives a teaching error, not a stack trace", async () => {
  const emptyRoot = mkdtempSync(join(tmpdir(), "comfyui-mcp-empty-"));
  const emptyMeta = join(emptyRoot, "metadata.json");
  const prev = process.env.COMFYUI_MCP_METADATA;
  process.env.COMFYUI_MCP_METADATA = emptyMeta;
  await assert.rejects(() => runTool("sdxl_t2i", { prompt: "x" }), /url is not configured/);
  process.env.COMFYUI_MCP_METADATA = prev;
  rmSync(emptyRoot, { recursive: true, force: true });
});

await fake.close();
rmSync(testRoot, { recursive: true, force: true });

console.log(`\n${pass} checks passed`);
