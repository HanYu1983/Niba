/**
 * comfyui MCP server — one tool per workflow template in ./workflow, plus job/metadata helpers.
 *
 * Everything talks to the ComfyUI box over HTTP; local outputs are mirrored into
 * metadata.comfyui.output_dir (remote subfolder preserved, e.g. `refs/char_x`).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { ComfyError } from "./comfy.mjs";
import { MetadataError, comfyuiSettings, readMetadata, updateMetadata } from "./metadata.mjs";
import { inspectJob, runTool, runtime } from "./runner.mjs";
import { TOOLS, WORKFLOW_DIR, coverage } from "./workflows.mjs";

export const VERSION = "0.1.0";

const ok = (obj) => ({ content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] });

function errorResult(e) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: e.message, ...(e.details ?? {}) }, null, 2)
      }
    ]
  };
}

async function guard(fn) {
  try {
    return ok(await fn());
  } catch (e) {
    if (e instanceof ComfyError || e instanceof MetadataError) return errorResult(e);
    throw e;
  }
}

/* ------------------------------------------------------------------ shared schema bits */

const RUN_OPTS = {
  wait: z
    .boolean()
    .optional()
    .describe("default true: block until finished and download; false returns prompt_id immediately (poll with comfy_job)"),
  timeout_sec: z.number().positive().optional().describe("blocking budget; default metadata.comfyui.timeout_sec (900)"),
  download: z.boolean().optional().describe("default true: pull the results into output_dir"),
  output_dir: z.string().optional().describe("override the local download root for this call")
};

const NEGATIVE = z.string().optional().describe("negative prompt; omit for the template's default");

/* ------------------------------------------------------------------ server */

export function createMcpServer() {
  const server = new McpServer({ name: "comfyui", version: VERSION });

  /* ---------------------------------------------------------------- management */

  server.registerTool(
    "comfy_status",
    {
      title: "comfy_status",
      description:
        "Is the ComfyUI box up, and what can it render? Reports the configured URL, version, GPU / free VRAM, " +
        "the queue, every model family the box exposes, and whether each workflow template's weights are present.",
      inputSchema: {}
    },
    async () => {
      const { file, exists, data } = readMetadata();
      const settings = comfyuiSettings(data);
      if (!settings.url) {
        return ok({
          configured: false,
          metadata_file: file,
          metadata_exists: exists,
          hint: "call comfy_metadata_set with comfyui_url (e.g. http://100.106.154.88:8000)"
        });
      }

      try {
        const client = runtime().client;
        const [stats, queue, models] = await Promise.all([client.systemStats(), client.queue(), client.models()]);
        const preflight = TOOLS.map((t) => {
          const missing = [];
          for (const [family, names] of Object.entries(t.requires ?? {})) {
            for (const name of names) {
              if (!(models[family] ?? []).includes(name)) missing.push(`${family}:${name}`);
            }
          }
          return { tool: t.tool, workflow: t.workflow, ready: missing.length === 0, missing };
        });

        return ok({
          configured: true,
          url: settings.url,
          reachable: true,
          comfyui: stats,
          queue,
          output_dir: settings.outputDir ?? null,
          default_timeout_sec: settings.timeoutSec,
          client_id: settings.clientId,
          models,
          preflight,
          metadata_file: file
        });
      } catch (e) {
        if (e instanceof ComfyError) {
          return ok({
            configured: true,
            url: settings.url,
            reachable: false,
            error: e.message,
            ...(e.details ?? {}),
            metadata_file: file
          });
        }
        throw e;
      }
    }
  );

  server.registerTool(
    "comfy_workflows",
    {
      title: "comfy_workflows",
      description:
        "List the workflow templates in ./workflow and which MCP tool runs each one, including the weights " +
        "it needs. Use this when a tool name is unclear, or to spot template files nothing is wired to.",
      inputSchema: {}
    },
    async () =>
      ok({
        workflow_dir: WORKFLOW_DIR,
        coverage: coverage(),
        tools: TOOLS.map((t) => ({
          tool: t.tool,
          workflow: t.workflow,
          kind: t.kind,
          requires: t.requires ?? {}
        }))
      })
  );

  server.registerTool(
    "comfy_metadata_get",
    {
      title: "comfy_metadata_get",
      description:
        "Show the machine settings this server uses: ComfyUI url, local download root, default timeout, client id. " +
        "Machine paths live here, never inside story JSON.",
      inputSchema: {}
    },
    async () =>
      guard(async () => {
        const { file, exists, data } = readMetadata();
        const settings = comfyuiSettings(data);
        return { file, exists, metadata: data, ...settings };
      })
  );

  server.registerTool(
    "comfy_metadata_set",
    {
      title: "comfy_metadata_set",
      description:
        "Update the machine settings: comfyui_url (http/https), comfyui_output_dir (absolute local download root, " +
        "created if missing), comfyui_timeout_sec, comfyui_client_id. Any field set to null clears it.",
      inputSchema: {
        comfyui_url: z.string().nullable().optional().describe('e.g. "http://100.106.154.88:8000"'),
        comfyui_output_dir: z
          .string()
          .nullable()
          .optional()
          .describe('absolute local folder, e.g. "D:\\\\han\\\\Niba\\\\dev\\\\Project21\\\\output"; null clears it'),
        comfyui_timeout_sec: z.number().positive().nullable().optional().describe("default blocking budget for one job"),
        comfyui_client_id: z.string().nullable().optional().describe("how ComfyUI labels this client"),
        create_dir: z.boolean().optional().describe("default true: create comfyui_output_dir when missing")
      }
    },
    async (p) =>
      guard(async () => {
        const out = updateMetadata(
          {
            url: p.comfyui_url,
            output_dir: p.comfyui_output_dir,
            timeout_sec: p.comfyui_timeout_sec,
            client_id: p.comfyui_client_id
          },
          { createDir: p.create_dir !== false }
        );
        return {
          file: out.file,
          metadata: out.data,
          url: out.url,
          output_dir: out.outputDir,
          timeout_sec: out.timeoutSec,
          client_id: out.clientId,
          created: out.created
        };
      })
  );

  server.registerTool(
    "comfy_job",
    {
      title: "comfy_job",
      description:
        "Inspect a job submitted with wait:false, or collect its outputs later. With prompt_id and wait:true it " +
        "blocks until the job finishes and downloads the files; without prompt_id it shows the queue and recent ids.",
      inputSchema: {
        prompt_id: z.string().optional().describe("the prompt_id returned when the job was submitted"),
        wait: z.boolean().optional().describe("default false: only report status; true: block until finished and download"),
        timeout_sec: z.number().positive().optional(),
        download: z.boolean().optional(),
        output_dir: z.string().optional()
      }
    },
    async (p) =>
      guard(() =>
        inspectJob(p.prompt_id ?? null, {
          wait: p.wait === true,
          timeout_sec: p.timeout_sec,
          download: p.download,
          output_dir: p.output_dir
        })
      )
  );

  server.registerTool(
    "comfy_cancel",
    {
      title: "comfy_cancel",
      description: "Drop a pending job or interrupt the one currently running on the box.",
      inputSchema: { prompt_id: z.string().describe("prompt_id of the job to cancel") }
    },
    async (p) =>
      guard(async () => {
        const { client } = runtime();
        return client.cancel(p.prompt_id);
      })
  );

  /* ---------------------------------------------------------------- image */

  server.registerTool(
    "sdxl_t2i",
    {
      title: "sdxl_t2i",
      description:
        "Text to image on the SDXL checkpoint (workflow_sdxl_t2i.json). Generic stills; for character plates " +
        "ask for a neutral front-facing portrait and use filename_prefix like refs/<entity_id>/plate so the file " +
        "lands in that entity's folder.",
      inputSchema: {
        prompt: z.string().describe("positive prompt"),
        negative_prompt: NEGATIVE,
        width: z.number().int().positive().optional().describe("default 1024"),
        height: z.number().int().positive().optional().describe("default 1024"),
        batch_size: z.number().int().positive().optional().describe("default 1"),
        seed: z.number().int().nonnegative().optional().describe("omit for a random seed"),
        steps: z.number().int().positive().optional().describe("default 25"),
        cfg: z.number().positive().optional().describe("default 7"),
        sampler_name: z.string().optional().describe("default euler_ancestral"),
        scheduler: z.string().optional().describe("default normal"),
        ckpt_name: z.string().optional().describe("override the checkpoint"),
        filename_prefix: z.string().optional().describe('default "sdxl"; may contain a subfolder, e.g. refs/char_x/plate'),
        ...RUN_OPTS
      }
    },
    async (p) => guard(() => runTool("sdxl_t2i", p, p))
  );

  server.registerTool(
    "z_image_t2i",
    {
      title: "z_image_t2i",
      description:
        "Text to image on z-image turbo (workflow_z_image_turbo.json): 8 steps, cfg 1, no negative prompt. " +
        "Fastest option for draft plates.",
      inputSchema: {
        prompt: z.string().describe("positive prompt"),
        width: z.number().int().positive().optional().describe("default 1024"),
        height: z.number().int().positive().optional().describe("default 1024"),
        batch_size: z.number().int().positive().optional(),
        seed: z.number().int().nonnegative().optional(),
        steps: z.number().int().positive().optional().describe("default 8"),
        cfg: z.number().positive().optional().describe("default 1; the negative branch is zeroed out"),
        shift: z.number().optional().describe("ModelSamplingAuraFlow shift, default 3"),
        sampler_name: z.string().optional().describe("default res_multistep"),
        scheduler: z.string().optional().describe("default simple"),
        unet_name: z.string().optional(),
        clip_name: z.string().optional(),
        vae_name: z.string().optional(),
        filename_prefix: z.string().optional().describe('default "zimage"'),
        ...RUN_OPTS
      }
    },
    async (p) => guard(() => runTool("z_image_t2i", p, p))
  );

  server.registerTool(
    "first_frame",
    {
      title: "first_frame",
      description:
        "SDXL still used as a video's opening frame (workflow_first_frame.json). Same graph as sdxl_t2i, " +
        'default filename_prefix "frame_first". Pair with last_frame + minimax_t2v.',
      inputSchema: {
        prompt: z.string().describe("positive prompt describing the opening frame"),
        negative_prompt: NEGATIVE,
        width: z.number().int().positive().optional().describe("match the video size, e.g. 512"),
        height: z.number().int().positive().optional(),
        seed: z.number().int().nonnegative().optional(),
        steps: z.number().int().positive().optional().describe("default 20"),
        cfg: z.number().positive().optional().describe("default 7"),
        sampler_name: z.string().optional(),
        scheduler: z.string().optional(),
        ckpt_name: z.string().optional(),
        filename_prefix: z.string().optional().describe('default "frame_first"'),
        ...RUN_OPTS
      }
    },
    async (p) => guard(() => runTool("first_frame", p, p))
  );

  server.registerTool(
    "last_frame",
    {
      title: "last_frame",
      description:
        "SDXL still used as a video's closing frame (workflow_last_frame.json). Same graph as sdxl_t2i, " +
        'default filename_prefix "frame_last".',
      inputSchema: {
        prompt: z.string().describe("positive prompt describing the closing frame"),
        negative_prompt: NEGATIVE,
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
        seed: z.number().int().nonnegative().optional(),
        steps: z.number().int().positive().optional().describe("default 20"),
        cfg: z.number().positive().optional().describe("default 7"),
        sampler_name: z.string().optional(),
        scheduler: z.string().optional(),
        ckpt_name: z.string().optional(),
        filename_prefix: z.string().optional().describe('default "frame_last"'),
        ...RUN_OPTS
      }
    },
    async (p) => guard(() => runTool("last_frame", p, p))
  );

  /* ---------------------------------------------------------------- video */

  server.registerTool(
    "minimax_t2v",
    {
      title: "minimax_t2v",
      description:
        "MiniMax H3 text-to-video with audio (workflow_minimax_h3_t2v.json), optionally anchored by first/last " +
        "stills. Duration is quantised to 17-frame blocks at 24 fps. turbo:true swaps in the 8-step Lightning LoRA.",
      inputSchema: {
        prompt: z.string().describe("scene prompt (character / environment / camera / action / dialogue / style)"),
        first_frame: z.string().optional().describe("local image path to upload, or a name already in ComfyUI's input"),
        last_frame: z.string().optional(),
        width: z.number().int().positive().optional().describe("default 512; multiple of 32"),
        height: z.number().int().positive().optional().describe("default 512; multiple of 32"),
        duration_sec: z.number().positive().optional().describe("default 12; quantised to 17-frame blocks"),
        frames: z.number().int().positive().optional().describe("exact frame count, bypassing duration_sec"),
        fps: z.number().positive().optional().describe("default 24"),
        seed: z.number().int().nonnegative().optional(),
        turbo: z.boolean().optional().describe("default false: 20 steps; true: 8 steps + Lightning LoRA"),
        scale_method: z.string().optional().describe("how stills are fitted, default lanczos"),
        crop: z.string().optional().describe("default center"),
        filename_prefix: z.string().optional().describe('default "video/MiniMax_H3"'),
        ...RUN_OPTS
      }
    },
    async (p) => guard(() => runTool("minimax_t2v", p, p))
  );

  server.registerTool(
    "minimax_r2v",
    {
      title: "minimax_r2v",
      description:
        "MiniMax H3 reference-to-video with audio (workflow_minimax_h3_r2v.json): up to three reference images " +
        "keep identity across the shot. This is the r2v path used for storyboards. turbo:true swaps in the " +
        "4-step reference LoRA.",
      inputSchema: {
        prompt: z.string().describe("scene prompt; name which reference is which character"),
        reference_images: z
          .array(z.string())
          .min(1)
          .max(3)
          .describe("local paths to upload, or names already in ComfyUI's input folder; slot order = ref_image_0..2"),
        width: z.number().int().positive().optional().describe("default 352; multiple of 32"),
        height: z.number().int().positive().optional().describe("default 608; multiple of 32"),
        duration_sec: z.number().positive().optional().describe("default 5; quantised to 17-frame blocks"),
        frames: z.number().int().positive().optional(),
        fps: z.number().positive().optional().describe("default 24"),
        seed: z.number().int().nonnegative().optional(),
        turbo: z.boolean().optional().describe("default false: 20 steps; true: 4 steps + reference LoRA"),
        ref_image_size: z.enum(["match", "max"]).optional().describe("default match; max is slower but keeps identity"),
        filename_prefix: z.string().optional().describe('default "video/MiniMax_H3_r2v"'),
        ...RUN_OPTS
      }
    },
    async (p) => guard(() => runTool("minimax_r2v", p, p))
  );

  server.registerTool(
    "upscale_video",
    {
      title: "upscale_video",
      description:
        "4x a video with RealESRGAN, keeping its audio and frame rate (utility-gan_upscaler.json). " +
        "The output is 4x the input resolution, so a 5 s clip is still a long job.",
      inputSchema: {
        video: z.string().describe("local path to upload, or a name already in ComfyUI's input folder"),
        model_name: z.string().optional().describe("default RealESRGAN_x4plus.safetensors"),
        codec: z.string().optional().describe("default auto"),
        filename_prefix: z.string().optional().describe('default "video/upscaled"'),
        ...RUN_OPTS
      }
    },
    async (p) => guard(() => runTool("upscale_video", p, p))
  );

  /* ---------------------------------------------------------------- text */

  server.registerTool(
    "text_gen",
    {
      title: "text_gen",
      description:
        "Qwen3.5 4B VL on the box (llm_qwen3_5_text_gen.json): plain text generation, or describe an image when " +
        "one is passed. Useful for turning a generated plate into a reusable prompt.",
      inputSchema: {
        prompt: z.string().describe("instruction, e.g. \"describe this image as an image-generation prompt\""),
        image: z.string().optional().describe("local image path to upload, or a name already in ComfyUI's input"),
        max_length: z.number().int().positive().optional().describe("default 256"),
        thinking: z.boolean().optional().describe("default false"),
        system_prompt: z.string().optional().describe("replaces the built-in template when set"),
        sampling: z
          .object({
            mode: z.enum(["on", "off"]).optional(),
            temperature: z.number().optional(),
            top_k: z.number().int().optional(),
            top_p: z.number().optional(),
            min_p: z.number().optional(),
            repetition_penalty: z.number().optional(),
            presence_penalty: z.number().optional(),
            seed: z.number().int().nonnegative().optional()
          })
          .optional()
          .describe("advanced sampler overrides"),
        ...RUN_OPTS
      }
    },
    async (p) => guard(() => runTool("text_gen", p, p))
  );

  return server;
}
