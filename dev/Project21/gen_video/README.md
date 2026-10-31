# video-compiler

MCP server that extracts render-ready slices from an Omni-Media project JSON.

**Current scope: sections 1.4 + 6.2, plus the `entity_prompt` / metadata helpers.** Nothing is sent to ComfyUI yet.

## Why Node instead of the guide's Python

`python` / `python3` on this machine only resolve to the Microsoft Store alias stub, so the
reference implementation was ported to ESM. Behaviour is the same; only error handling differs.

## Layout

| File | Role |
|---|---|
| `compiler.mjs` | `compileBlock()` (1.4 project slice) + `compilePayload()` (6.2 flat payload) + `entityPrompt()` (r2v plate prompt) |
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

Returns a **self-contained project JSON** in the section 1.4 shape:

```json
{
  "version": "1.12",
  "project_title": "Judge_Xu_Single_Block_Example",
  "global_settings": { "aspect_ratio": "16:9", "style": "...", "default_audio_design": "..." },
  "entities": {
    "characters": [{ "id": "char_judge_xu", "name": "許法官 (Judge Xu)", "identity_features": { "...": "..." } }],
    "props": [{ "id": "prop_verdict", "...": "..." }],
    "locations": [{ "id": "loc_courtroom", "...": "..." }]
  },
  "blocks": [
    {
      "id": "block_verdict_read",
      "location_ref": "loc_courtroom",
      "present_characters": [{ "entity_ref": "char_judge_xu", "outfit": "...", "facial_state": "..." }],
      "present_props": [{ "entity_ref": "prop_verdict" }],
      "action": { "subject_ref": "char_judge_xu", "target_ref": "prop_verdict", "description": "..." },
      "audio_control": { "audio_mode": "clean_dialogue_with_room_tone", "...": "..." }
    }
  ]
}
```

Key properties:

- **Exactly one block** in `blocks`, copied verbatim: `entity_ref` / `referenced_blocks` stay as pointers.
- **Only the entities that block uses** are included (unused characters/props/locations are dropped).
- **Deep copies** — mutating the result never touches the source project.
- **Timeframe recalculated**: every slice is emitted as `start_sec: 0` with `end_sec` = original
  duration (section 6.1). Pass `reset_timeframe: false` only when the original seconds are needed.
- **No prompt string** — flattening is `compilePayload()`, kept for the ComfyUI adapter.
- `referenced_blocks` ids are validated; the referenced blocks themselves are **not** embedded yet (section 6.1).

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

## Not implemented yet

- `referenced_blocks` unpacking into the visual description (6.1).
- ComfyUI submission, per-model prompt post-processing, batch compilation.

## Run

```powershell
npm install
npm test
node cli.mjs ../test_story1/block_01_verdict.json block_verdict_read
```
