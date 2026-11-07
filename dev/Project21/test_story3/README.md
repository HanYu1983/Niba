# test_story3 — 序章 plan

`plan.ch0.json` is the stage-1 plan for the prologue in `story_ch0.html` (序章：驟變之前).

## Files

| File | Role |
|---|---|
| `story_ch0.html` | Original Penana export (contains per-paragraph watermark spans) |
| `story_ch0.txt` | Clean novel text extracted from the HTML; this is the slice source |
| `extract_story.mjs` | HTML → `story_ch0.txt` (drops watermark spans / `display:none`) |
| `data_entities.mjs` | Character / prop / location inventory + reference-image prompts |
| `data_segments_a.mjs` | Segments 1–23: training ground → night calls |
| `data_segments_b.mjs` | Segments 24–49: penthouse → street → last ordinary morning |
| `data_segments_c.mjs` | Segments 50–79: bridge → collapse → riverbed |
| `build_plan.mjs` | Slices by anchor, derives timing, validates, writes `plan.ch0.json` |
| `verify_plan.mjs` | Independent re-check of hash / contiguity / scene-first / first_seen |
| `generate_refs.mjs` | Generates every `to_generate` reference plate with `moodyRealMix_zitV7` |
| `refs_report.json` | Result of the last plate run (model, sizes, files, failures) |
| `prompts/seg_002.r2v.txt` | Six-field r2v prompt for `seg_002` |
| `prompts/seg_0NN.t2v.txt` | Three-field t2v prompts (001–079, full chapter) |
| `render_manifest.json` | One entry per rendered segment: prompt_id, seed, plates, mp4 |

Rebuild:

```powershell
node extract_story.mjs
node build_plan.mjs
node verify_plan.mjs
node generate_refs.mjs      # optional: reference plates (needs ComfyUI reachable)
```

## What the plan covers

- 79 segments, 5,111 characters (sha256 `4326acca…a9783`), ~531 s → 97 render blocks.
- 14 characters, 14 props, 15 locations, one reference folder per entity (`refs/<id>`).
- Segment `source` slices concatenate back to `story_ch0.txt` exactly; offsets are contiguous.
- Every segment's first reference is its `scene` (location). Up to 5 plates per segment.

## Conventions beyond the workflow doc

- **Anchor slicing.** Segments start at exact substrings instead of hand-typed offsets. The
  builder walks the anchors, so a missing/duplicated anchor fails the build instead of
  silently corrupting the text.
- **Anonymous voices.** Crowd/bystander lines have `speaker_ref: null` and a `voice_note`
  saying to keep faces out of focus and lip-sync off. Anonymous extras are scene content, not
  entities — the workflow's inventory rule targets recurring, identity-locked characters.
- **Live phone voices.** Frost's phone lines during the bridge call use
  `voice_intent: "remembered_voice"` (lip-sync off) plus `voice_note` clarifying it is a live
  phone speaker, not a flashback. This keeps the 5-value enum intact.
- **Title cards** use `loc_prologue_title` (clean black slate). The Chinese title text is
  post-production overlay, so the reference plate stays text-free.
- **`first_seen`** is derived by the builder from the first segment that uses the entity.

## Reference plates

Every entity owns `output/refs/<entity_id>/`; ComfyUI names the files, so the plan records
the folder only. `generate_refs.mjs` renders the missing ones with
`moodyRealMix_zitV7.safetensors` (Z-Image Turbo: 8 steps, cfg 1, shift 3, `res_multistep` /
`simple`), one plate per entity:

| kind | size | framing |
|---|---|---|
| character | 832×1024 | head-and-shoulders, plain grey backdrop |
| prop | 1024×1024 | product plate, no text |
| location | 1344×768 | wide establishing, no people, no text |

Character prompts name an explicit age and wrinkles rather than "late fifties": the model
under-ages when only a decade is given. Entity `status` flips to `ready` once a file exists.

## Prompt style lock (t2v)

Per `ai_edit_story/mcp_server_guide.md` §4B, t2v cells do **not** bind reference plates: identity
and medium are locked by repeating text. Every `[Shot 1]` opens with the same sentence:

```text
Photorealistic live-action 35mm film, fine grain, natural skin texture, real-world photography,
muted olive and cold grey palette, flat overcast dawn light, shallow depth of field, grounded
documentary realism — not anime, not cartoon, not illustration, not cel shading, not an
advertisement, not slow motion, no on-screen text.
```

Character anchors are copied from the entity's t2i plate prompt (`data_entities.mjs`), so the
text and the reference plate describe the same person. Speaker numbers are assigned by first
speech across the whole chapter: `(S1)` Frost, `(S2)` engineer, `(S3)` Taylor, `(S4)`
contractor, `(S5)` Zhuang, `(S6)` Yang, `(S7)` Xiao Liu, `(S8)` father, `(S9)` taxi driver.
Anonymous crowd lines, narration and internal monologue carry **no** number, and keep faces
out of focus with lip-sync off. `seg_001` and `seg_079` are the exceptions: they are black
slate cards, so they carry the film-texture description and no figure.

The light clause is the only part of the lock that changes with the scene, so a night interior
does not get described as dawn. Current variants: `flat overcast dawn light` (parade ground),
`low-key practical night lighting` (lounge, safehouse, street), `muted cold grey palette with
pink neon accents` (club), `soft overcast rainy morning light` (apartment, rain street),
`flat storm-grey daylight` (bridge collapse), `harsh flat noon light` (riverbed). The negative
guard list (`not anime … no on-screen text.`) stays identical in every file.

## Rendering a segment

`gen_video/render_segment.mjs` takes a plan, a segment id and a prompt file, resolves every
`reference_images` entry to the newest plate in that entity's folder (scene slot first), and
submits the r2v job:

```powershell
node gen_video/render_segment.mjs --plan test_story3/plan.ch0.json --seg seg_002 `
     --prompt test_story3/prompts/seg_002.r2v.txt
```

Add `--dry-run` to see the resolved slots/duration without touching the GPU, `--take N` to
record a retake, `--seed N` to pin the sampler. Duration comes from the segment's
`estimated_sec` and is quantised to H3's 17k+5 frame grid at 24 fps. Each submission appends
to `render_manifest.json`; clips land in `output/render/<plan name>/`.

`--async` (alias `--submit-only`, or `--wait false`) returns as soon as ComfyUI accepts the
job — it prints the `prompt_id`, the queue position and the exact poll command, then exits 0:

```powershell
node gen_video/render_segment.mjs --plan test_story3/plan.ch0.json --seg seg_002 `
     --prompt test_story3/prompts/seg_002.r2v.txt --async
# → poll: node comfyui_mcp/cli.mjs --job --prompt_id <id> --wait true
```

## Assembling the chapter

`test_story3/concat_renders.mjs` builds the concat list from `render_manifest.json` (segment
order, not directory sort), verifies every file exists, and merges in one pass:

```powershell
node test_story3/concat_renders.mjs              # stream copy, lossless and fast
node test_story3/concat_renders.mjs --reencode   # H.264 CRF 18 + AAC 192k, if joins drift
```

Output: `output/video/plan.ch0_full_<WxH>.mp4`, with the concat list kept beside it. All 79
clips share 352×608 / 24 fps / H.264 High / AAC 32 kHz, so copy mode joins cleanly — the
merged file decodes to exactly the sum of the segment frame counts (13,383).

## Still to do (stage 2)

1. Write `<chapter>.json` blocks from this plan only — do not re-read the novel.
2. Convert `spoken_text` to pronounceable lines (strip quotes, em dashes, digits) per
   `PROMPT_TECHNIQUES.md`; split per `render_blocks`.
