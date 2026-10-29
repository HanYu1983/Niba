# video-compiler

MCP server that extracts render-ready slices from an Omni-Media project JSON.

**Current scope: sections 1.4 + 6.2.** Nothing is sent to ComfyUI yet.

## Why Node instead of the guide's Python

`python` / `python3` on this machine only resolve to the Microsoft Store alias stub, so the
reference implementation was ported to ESM. Behaviour is the same; only error handling differs.

## Layout

| File | Role |
|---|---|
| `compiler.mjs` | `compileBlock()` (1.4 project slice) + `compilePayload()` (6.2 flat payload) |
| `mcp_core.mjs` | MCP registration (`compile_block`) |
| `mcp_server_stdio.mjs` | stdio entry point (registered in `../opencode.json`) |
| `cli.mjs` | Compile one block without MCP |
| `test/smoke.mjs` | Unit + in-memory MCP + real stdio checks |
| `../test_story1/block_01_verdict.json` | Sample one-block project |

## Tool

`compile_block`

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
