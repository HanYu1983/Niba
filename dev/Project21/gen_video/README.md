# video-compiler

MCP server that extracts render-ready slices from an Omni-Media project JSON.

**Current scope: sections 1.4 + 6.2, the `entity_prompt` / metadata helpers, and the block render pipeline that drives ComfyUI.**

## Why Node instead of the guide's Python

`python` / `python3` on this machine only resolve to the Microsoft Store alias stub, so the
reference implementation was ported to ESM. Behaviour is the same; only error handling differs.

## Layout

| File | Role |
|---|---|
| `compiler.mjs` | `compileBlock()` (1.4 slice → `{ prompt, metadata }`) + `compilePayload()` (6.2 flat payload) + `entityPrompt()` (r2v plate prompt) |
| `metadata.mjs` | server-side metadata: `comfyui.output_dir`, reference folder resolution, plate listing |
| `metadata.json` | machine paths (gitignored; start from `metadata.example.json`) |
| `mcp_core.mjs` | MCP registration (`compile_block`, `entity_prompt`, `metadata_get`, `metadata_set`) |
| `mcp_server_stdio.mjs` | stdio entry point (registered in `../opencode.json`) |
| `cli.mjs` | Compile one block without MCP |
| `test/smoke.mjs` | Unit + in-memory MCP + real stdio checks |
| `../test_story1/block_01_verdict.json` | Sample one-block project |

## Tool

### `compile_block`

```jsonc
{
  "project_file": "test_story1/block_01_verdict.json", // or "project": { ... }
  "block_id": "block_verdict_read",
  "reset_timeframe": true // default true -> block starts at 0..duration (section 6.1); false keeps original seconds
}
```

Returns `{ "prompt": { ... }, "metadata": { ... } }`:

- `prompt` is the payload handed to the render model — the trimmed project JSON it has to read.
- `metadata` is everything the renderer needs but the model should not parse (ids, timing, ref slots).

```json
{
  "prompt": {
    "global_settings": { "style": "...", "default_audio_design": "..." },
    "entities": {
      "characters": [{ "id": "char_judge_xu", "identity_features": { "...": "..." } }],
      "props": [{ "id": "prop_verdict", "appearance": "..." }],
      "locations": [{ "id": "loc_courtroom", "name": "肅穆法庭", "description": "..." }]
    },
    "blocks": [
      {
        "present_characters": [{ "entity_ref": "char_judge_xu", "outfit": "...", "facial_state": "..." }],
        "action": { "subject_ref": "char_judge_xu", "target_ref": "prop_verdict", "description": "..." },
        "audio_control": { "audio_mode": "clean_dialogue_with_room_tone", "...": "..." }
      }
    ]
  },
  "metadata": {
    "compiler_version": "0.5.1",
    "version": "1.12",
    "project_title": "Judge_Xu_Single_Block_Example",
    "block_id": "block_verdict_read",
    "block_index": 0,
    "duration_sec": 6,
    "source_timeframe": { "start_sec": 0, "end_sec": 6 },
    "timeframe": { "start_sec": 0, "end_sec": 6 },
    "location_ref": "loc_courtroom",
    "present_props": ["prop_verdict"],
    "referenced_blocks": [],
    "global_settings": { "aspect_ratio": "16:9" },
    "entities": {
      "characters": [{ "id": "char_judge_xu", "kind": "character", "name": "許法官 (Judge Xu)", "reference": { "image": "...", "status": "ready" } }],
      "props": [], "locations": []
    },
    "reference_images": [{ "slot": 0, "role": "scene", "entity_ref": "loc_courtroom", "image": null }]
  }
}
```

Key properties:

- **`prompt` is what the model reads.** Send the `prompt` field alone as the r2v prompt; `metadata`
  is bookkeeping for the renderer.
- **`prompt` carries no bookkeeping**: no `block.id`, `timeframe`, `location_ref`, `present_props`,
  `referenced_blocks`. Props reach the model through `action` / `description` text.
- **Entities keep only their look fields** — characters: `id` + `identity_features`, props:
  `id` + `appearance`, locations: `id` + `name` + `description`. Names and reference plates move to
  `metadata.entities`.
- **`global_settings` splits**: `style` + `default_audio_design` stay in `prompt`; the rest
  (`aspect_ratio`, …) goes to `metadata.global_settings`.
- **Only the entities that block uses** are included (unused characters/props/locations are dropped).
- **Deep copies** — mutating the result never touches the source project.
- **Timing**: `metadata.source_timeframe` is the original position in the story;
  `metadata.timeframe` is 0-based (section 6.1) unless `reset_timeframe: false`.
- **`reference_images`** is the r2v slot order: scene first, then the block's own `reference_images`
  if declared, otherwise `present_characters` order. The r2v node takes up to 9 plates, so a
  submission built from `metadata.entities` can carry every entity in the shot (see
  `test_stroy2/render_block.mjs`).
- `referenced_blocks` ids are validated and kept in `metadata`; the referenced blocks themselves are
  **not** merged into the prompt yet (section 6.1).

### `entity_prompt`

Returns the reference-image prompt for **one** character / prop / location, so an r2v plate can be
generated (or re-checked) without opening the whole file.

```jsonc
{
  "project_file": "test_story1/plan.ch04.json", // or "project": { ... }
  "entity_id": "char_judge_xu",
  "check_image": true // default true: also resolve reference.image on disk
}
```

```json
{
  "kind": "character",
  "id": "char_judge_xu",
  "name": "許法官 (Judge Xu)",
  "prompt": "Neutral front-facing portrait of an East Asian man in his late fifties, … no text",
  "prompt_source": "reference",
  "attributes": { "traits": "Late 50s, sharp jawline, …" },
  "aliases": ["許法官", "他"],
  "reference": {
    "image": "refs/char_judge_xu",
    "status": "to_generate",
    "image_dir": "D:\\ComfyUI\\output\\refs\\char_judge_xu",
    "image_dir_source": "metadata",
    "images": [],
    "image_exists": false
  }
}
```

- **`reference.image` is a folder, not a file.** ComfyUI names its own outputs, so a project can
  only record where the plates land — one folder per entity (`refs/<entity_id>`), kept relative so
  the story JSON stays portable.
- **`image_dir`** is that folder made absolute, computed at call time:
  - `metadata` — `metadata.comfyui.output_dir` + `reference.image` (the normal case)
  - `absolute` — `reference.image` was already absolute
  - `project` — no metadata configured, so it falls back to the project file's own folder
- **`prompt_source`** says where the string came from:
  - `reference` — `entity.reference.prompt`, used verbatim (this is what actually makes the plate).
  - `identity_features` — derived from `ethnicity / age / face_and_hair / physique / vibe`.
  - `traits` — plan-style entities that carry one flat `traits` string instead of `identity_features`.
  - `appearance` / `description` — props get a top-down plate, locations a wide empty one.
- **`reference.images`** lists the image files actually sitting in that folder (newest first) and
  `image_exists` is just `images.length > 0`, so "generated but not on disk" is visible at a glance.
  A legacy `reference.image` that still points at one file falls back to its parent folder.
- **`reference.image_path`** / **`reference.image_file`** / **`reference.image_picked_by`** — when the
  folder is non-empty, `image_file` is the newest plate (`images[0]`) and `image_path` joins it back to
  its absolute folder. **This is the plate to hand to r2v**: ComfyUI appends a counter on every render,
  so "newest by creation time" is the current, best version; the older ones are stale attempts.
- Pass `check_image: false` to skip the folder lookup; an inline `project` with no metadata has no
  base to anchor to, so the folder fields are omitted.
- Unknown id → `isError` with `known_ids`.

### `metadata_get` / `metadata_set`

Machine paths live in `metadata.json` next to the server, never in the story JSON:

```json
{
  "version": "1.0",
  "comfyui": { "output_dir": "D:\\ComfyUI\\output" }
}
```

```jsonc
// metadata_set
{
  "comfyui_output_dir": "D:\\ComfyUI\\output", // absolute; null clears it
  "create_dir": true                            // default true: mkdir -p the folder
}
```

- `metadata_get` → `{ file, exists, metadata, comfyui_output_dir, output_dir_exists }`
- `metadata_set` → writes the file, creates the folder, returns the new metadata
- Relative paths are rejected; the file location can be overridden with
  `VIDEO_COMPILER_METADATA` (the smoke test does this, so it never touches the real one)
- Missing file = "nothing configured yet", not an error.

## Deliberate deviations from the guide's snippets

- **Missing refs throw** instead of silently producing `Character (None, None)`: unknown
  block / character / prop / location, non-positive timeframe, or a dangling `referenced_blocks` id.

## Rendering pipeline (ch04)

`compile_blocks.mjs` and `render_blocks.mjs` take a chapter from "49 blocks in a plan" to "49 mp4 files
plus one cut". They are not MCP tools: they are the loop that drives the `comfyui` MCP server's
`minimax_r2v`.

```powershell
node compile_blocks.mjs --check                       # validate all blocks, print issues
node compile_blocks.mjs --prompt block_016_frozen_eyes --take 2   # read one assembled prompt
node render_blocks.mjs --from block_004               # submit the rest, sequentially
node render_blocks.mjs --only block_016 --take 2      # a corrected retake
node sync_manifest.mjs --write                        # reconcile manifest with the job ledger
node assemble_blocks.mjs                              # stitch the keeper takes into one mp4
```

| File | Role |
|---|---|
| `render_plan.mjs` | block + Chinese notes -> `{ prompt, reference_images, seed, … }`, plus hard-rule issues |
| `compile_blocks.mjs` | CLI over `render_plan` (`--check`, `--prompt`, `--out`) |
| `render_blocks.mjs` | submits each job through `../comfyui_mcp/runner.mjs`, writes the manifest |
| `sync_manifest.mjs` | newest successful ledger entry per block wins; drops entries whose file vanished |
| `assemble_blocks.mjs` | ffmpeg concat in plan order (stream copy, re-encode as fallback) |

### Why a notes file instead of generating the Chinese

The plan JSON stays English and stays the creative source. `test_story1/ch04_shot_notes.json` holds the
Chinese that the model actually reads: one reviewable, diffable line per shot, plus dictionaries for
outfits, facial states, lighting and voice modes. A shot has exactly one correct Chinese sentence, and no
rule derives it from `action.description`, so the compiler stays deterministic: it resolves the newest
reference plate per entity, enforces scene-in-slot-1, quantises frames, splits narration, and refuses to
emit text that breaks the pronounceability rules (`PROMPT_TECHNIQUES.md`).

Per-block overrides live in the notes:

- `refs` — narrow the plan's reference list. Two similar faces in three slots merge into one face, so a
  block whose action only shows one person must not carry the other person's plate.
- `no_wardrobe: true` — insert shots (a hand, a page, a pen). Naming a robe and a jaw pulls a torso and a
  face into a frame that should only contain paper.

## Not implemented yet

- `referenced_blocks` unpacking into the visual description (6.1).

## Run

```powershell
npm install
npm test
node cli.mjs ../test_story1/block_01_verdict.json block_verdict_read
```
