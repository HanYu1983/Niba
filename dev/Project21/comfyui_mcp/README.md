# comfyui-mcp

MCP server that drives the ComfyUI box at `http://100.106.154.88:8000` through the workflow
templates in `./workflow`. One tool per template, plus job/metadata helpers.

Nothing here knows about stories or storyboards — it takes prompts and file paths, submits a graph,
waits (or doesn't), and mirrors the results into a local download folder.

```
D:\han\Niba\dev\Project21\
├─ comfyui_mcp\            ← this server
│  ├─ workflow\*.json      ← API-format templates (the source of truth)
│  ├─ metadata.json        ← url + local download root (gitignored)
│  └─ output\              ← default download mirror (metadata.comfyui.output_dir)
└─ gen_video\              ← video-compiler: story JSON -> prompts
```

## Why Node

Same reason as `gen_video`: `python` on this machine only resolves to the Store alias stub. The
ComfyUI side is HTTP, so nothing else is lost.

## Layout

| File | Role |
|---|---|
| `workflow/*.json` | the graphs, saved from ComfyUI in API format |
| `workflows.mjs` | template loading + one builder per template + `TOOLS` manifest |
| `comfy.mjs` | HTTP client: submit / queue / history / view / upload / cancel, path safety |
| `metadata.mjs` | `metadata.json` (url, download root, timeout, client id) |
| `runner.mjs` | tool call → build → submit → wait → download |
| `mcp_core.mjs` | MCP registration (14 tools) |
| `mcp_server_stdio.mjs` | stdio entry point |
| `cli.mjs` | run any tool without MCP |
| `test/smoke.mjs` | 40 checks against a fake ComfyUI (no GPU needed) |

## Setup

```powershell
cd comfyui_mcp
npm install
```

`metadata.json` (gitignored; copy `metadata.example.json`):

```json
{
  "version": "1.0",
  "comfyui": {
    "url": "http://100.106.154.88:8000",
    "output_dir": "D:\\han\\Niba\\dev\\Project21\\output",
    "timeout_sec": 900,
    "client_id": "comfyui-mcp"
  }
}
```

Register once in `../opencode.json`:

```json
{ "mcp": { "comfyui": { "type": "local", "command": ["node", "D:\\han\\Niba\\dev\\Project21\\comfyui_mcp\\mcp_server_stdio.mjs"], "enabled": true } } }
```

## Tools

| Tool | Template | Kind |
|---|---|---|
| `sdxl_t2i` | `workflow_sdxl_t2i.json` | image |
| `z_image_t2i` | `workflow_z_image_turbo.json` | image |
| `first_frame` | `workflow_first_frame.json` | image |
| `last_frame` | `workflow_last_frame.json` | image |
| `minimax_t2v` | `video_minimax_h3_t2v.json` | video + audio |
| `minimax_r2v` | `video_minimax_h3_r2v.json` | video + audio (up to 3 reference images) |
| `upscale_video` | `utility-gan_upscaler.json` | video (4x) |
| `text_gen` | `llm_qwen3_5_text_gen.json` | text (optionally about an image) |
| `comfy_status` | — | reachability, GPU, queue, models, per-tool preflight |
| `comfy_workflows` | — | templates ↔ tools, unmapped files |
| `comfy_job` | — | inspect / collect a `wait:false` job |
| `comfy_cancel` | — | drop a pending job or interrupt the running one |
| `comfy_metadata_get` / `comfy_metadata_set` | — | the machine settings above |

Every generator takes the same four run options:

```jsonc
{
  "wait": true,           // false -> return prompt_id immediately, poll with comfy_job
  "timeout_sec": 900,     // blocking budget; a timeout is NOT an error (see below)
  "download": true,       // false -> leave the files on the box
  "output_dir": "…"       // override the local download root for this call
}
```

### Typical call

```jsonc
// sdxl_t2i
{
  "prompt": "Neutral front-facing portrait of an East Asian man in his late fifties, … no text",
  "width": 832, "height": 1216, "seed": 42,
  "filename_prefix": "refs/char_judge_xu/plate"
}
```

→ ComfyUI writes `output/refs/char_judge_xu/plate_00042_.png`; the tool pulls it back to
`<output_dir>\refs\char_judge_xu\plate_00042_.png`, which is exactly the folder
`gen_video`'s `entity_prompt` reports as `image_dir`.

```json
{
  "tool": "sdxl_t2i",
  "status": "success",
  "prompt_id": "…",
  "elapsed_sec": 17.0,
  "summary": { "width": 832, "height": 1216, "seed": 42, "steps": 25, "cfg": 7 },
  "files": [
    {
      "node": "7", "kind": "image", "filename": "plate_00042_.png",
      "subfolder": "refs/char_judge_xu", "type": "output",
      "width": 832, "height": 1216,
      "path": "D:\\han\\Niba\\dev\\Project21\\output\\refs\\char_judge_xu\\plate_00042_.png",
      "bytes": 1430442
    }
  ]
}
```

## How paths work

**Outputs.** `filename_prefix` may contain a subfolder. ComfyUI stores the file under
`<comfyui output>/<subfolder>/`, and this server mirrors that under `metadata.comfyui.output_dir`,
keeping the subfolder. So `refs/<entity_id>/plate` is all a caller needs to put a character plate
where the video-compiler expects it.

**Inputs.** `image` / `video` / `first_frame` / `reference_images` accept either
- a local file → copied to ComfyUI's `input/` folder via `POST /upload/image` (named
  `mcp_<timestamp>_<file>`), then referenced by that name, or
- a name that already lives in ComfyUI's `input/` folder (e.g. `sdxl_00002_.png`) → used as-is.

Uploads are how reference images get from this machine to the GPU box; nothing is shared over the
filesystem.

**Safety.** Download paths reject separators in filenames and `..` in subfolders, so a hostile or
buggy output name cannot escape the download root.

## Job model

`wait: true` (default) polls `/history/<id>` every second and returns the moment the job lands.
Long jobs can exceed the budget:

```json
{ "status": "timeout", "timed_out": true, "prompt_id": "…", "hint": "the job is still on the box; poll it with comfy_job" }
```

That is deliberately **not** an error — resubmitting would duplicate the render. Call
`comfy_job { prompt_id, wait: true }` to keep waiting and download then.

A workflow ComfyUI rejects comes back as `isError` with `node_errors` (node id, class, message);
an execution failure comes back with the node that died and its exception message.

## Per-template notes

- **`minimax_t2v` / `minimax_r2v`** — length is quantised by the template's own math node to
  17-frame blocks at 24 fps, so `duration_sec: 12` becomes 294 frames / 12.25 s. Pass `frames` to
  bypass it. Sizes must be multiples of 32. `turbo: true` swaps in the Lightning LoRA
  (8 steps for t2v, 4 steps for r2v) — much faster, slightly softer.
- **`minimax_t2v` without stills** — the `first_frame` / `last_frame` branches are removed from the
  graph (nodes dropped, links deleted) instead of pointing at empty images, so ComfyUI keeps
  validating cleanly. When stills are given they are rescaled to the generation size.
- **`minimax_r2v`** — `reference_images` is ordered: slot 0/1/2 become `ref_image_0..2`. Unused slots
  are dropped from the graph. `ref_image_size: "max"` keeps more identity detail but is several
  times slower.
- **`z_image_t2i`** — distilled: 8 steps, cfg 1, and the negative branch is `ConditioningZeroOut`,
  so there is no negative prompt to set. Fastest drafts, and the only tool here whose prompt
  handling is a single string.
- **`first_frame` / `last_frame`** — the same SDXL graph as `sdxl_t2i`, with their own seed/
  filename defaults. Generate a pair, then feed both to `minimax_t2v`.
- **`upscale_video`** — RealESRGAN 4x per frame, audio and fps carried through. A 5 s clip becomes a
  long job and 4x the resolution.
- **`text_gen`** — Qwen3.5 4B VL. Without `image` the LoadImage branch is dropped; with one, the
  model describes it. `system_prompt` replaces the built-in template. The answer comes back as
  `texts: [{ node, slot, text }]`.

## Preflight

`comfy_status` reports the box *and* whether each template's weights exist:

```json
{
  "configured": true, "reachable": true, "url": "http://…",
  "comfyui": { "comfyui_version": "0.41.3", "devices": [{ "vram_free_bytes": 13660000000 }] },
  "queue": { "running": [], "pending": [] },
  "preflight": [{ "tool": "sdxl_t2i", "workflow": "…", "ready": true, "missing": [] }],
  "models": { "checkpoints": [...], "unets": [...], "clips": [...], "vaes": [...], "loras": [...], "upscalers": [...] }
}
```

## CLI

```powershell
node cli.mjs --status
node cli.mjs --workflows
node cli.mjs sdxl_t2i --prompt "…" --width 832 --height 1216 --filename_prefix refs/char_x/plate
node cli.mjs minimax_r2v --prompt "…" --reference_images out/a.png --reference_images out/b.png --turbo
node cli.mjs --job --prompt_id <id>            # status only
node cli.mjs --job --prompt_id <id> --wait     # block + download
```

Flags parse numbers/booleans/JSON; repeating a flag builds an array (handy for
`--reference_images`). Exit code is `0` on success, `2` on timeout, `1` on error.

## Tests

```powershell
node test/smoke.mjs
```

40 checks: template coverage, every builder (including dropped branches and dangling links),
duration quantisation, metadata rules, upload/download round-trips against a fake ComfyUI, error
surfacing, path safety, the whole MCP surface over an in-memory transport, and the real stdio
server. `COMFYUI_MCP_METADATA` points the test at a temp file, so the real `metadata.json` is
never touched.
