# test_story3 — 序章與第一話

Two chapters share one story folder. Each chapter has its own plan, prompts and manifest;
the entity registry is shared, and a chapter only ships the entities it actually uses.

| Chapter | Plan | Prompts | Manifest |
|---|---|---|---|
| 序章：驟變之前 | `plan.ch0.json` | `prompts/*.t2v.txt` | `render_manifest.json` |
| 第一話：好人的代價 | `plan.ch1.json` | `prompts/ch1/*.t2v.txt` | `render_manifest.ch1.json` |

Everything generic lives in `../workspace/` — see `../workspace/README.md` for the full tool list.

## Files

| File | Role |
|---|---|
| `story.json` | Story config: default plan, prompts/output paths, 352×608 @ 24 fps, subtitle protect list |
| `story_ch0.html` | Original Penana export (contains per-paragraph watermark spans) |
| `story_ch0.txt` | Clean ch0 text extracted from the HTML; the slice source |
| `story_ch1.html` / `story_ch1.txt` | Ch1 Penana export and clean text (4,498 chars) |
| `data_entities.mjs` | Shared character / prop / location registry + reference-image prompts |
| `data_entities_ch1.mjs` | Ch1 additions and state variants only (`base` / `state`) |
| `data_segments_a.mjs` | Ch0 segments 1–23: training ground → night calls |
| `data_segments_b.mjs` | Ch0 segments 24–49: penthouse → street → last ordinary morning |
| `data_segments_c.mjs` | Ch0 segments 50–79: bridge → collapse → riverbed |
| `build_plan.mjs` | Ch0 builder: slices by anchor, derives timing, validates, writes `plan.ch0.json` |
| `data_segments_ch1_a.mjs` | Ch1 segments 1–36: title card → river → rescue → the turn → the kill |
| `data_segments_ch1_b.mjs` | Ch1 segments 37–72: body search → hearing → hunger → infection → resolve |
| `data_segments_ch1_c.mjs` | Ch1 segments 73–81: boat → cabin → the girl → end card |
| `build_plan_ch1.mjs` | Ch1 builder: merges the registry, keeps used entities, recomputes `first_seen` |
| `data_prompts_ch1_{a,b,c}.mjs` | Ch1 prompt prose (the English picture description) |
| `build_prompts_ch1.mjs` | Assembles `prompts/ch1/seg_001…081.t2v.txt` (style lock + plan dialogue) |
| `refs_report.json` | Result of the last plate run (model, sizes, files, failures) |
| `render_manifest.json` | Ch0 manifest: mode, prompt_id, seed, plates, mp4 |
| `render_manifest.ch1.json` | Ch1 manifest (same shape, created by the first ch1 render) |
| `output/` | `refs/`, `render/<plan name>/` (clips) and `video/` (merged film + subtitles); gitignored |

Rebuild:

```powershell
# ch0
node ../workspace/tools/extract_penana.mjs --story .          # story_ch0.html -> story_ch0.txt
node build_plan.mjs                                           # data_*.mjs -> plan.ch0.json
node ../workspace/tools/verify_plan.mjs --story .
node ../workspace/tools/generate_refs.mjs --story .           # optional: needs ComfyUI

# ch1
node build_plan_ch1.mjs                                       # registry + ch1 data -> plan.ch1.json
node build_prompts_ch1.mjs                                    # -> prompts/ch1/*.t2v.txt
node ../workspace/tools/check_prompts.mjs --story . `
  --plan plan.ch1.json --prompts prompts/ch1
node ../workspace/tools/verify_plan.mjs --story . --plan plan.ch1.json
```

## What the plans cover

### Ch0 — 序章

- 79 segments, 5,111 characters (sha256 `4326acca…a9783`), ~531 s → 97 render blocks.
- 14 characters, 14 props, 15 locations, one reference folder per entity (`refs/<id>`).
- Segment `source` slices concatenate back to `story_ch0.txt` exactly; offsets are contiguous.
- Every segment's first reference is its `scene` (location). Up to 5 plates per segment.

### Ch1 — 第一話

- 81 segments, 4,498 characters (sha256 `89dd1d3b…ebb3`), ~593 s → 107 render blocks.
- 17 entities in the compiled plan: 5 shared with ch0 and 12 new. The builder emits only the
  entities the chapter's segments reference; `first_seen` is recomputed per chapter.
- Three parts: A (1–36) title card into the rescue and the kill, B (37–72) the body search,
  the hearing, the hunger and the infection, C (73–81) the fishing boat, the cabin and the girl.
- Key `first_seen`: `char_taylor` seg_003, `char_injured_man` seg_013,
  `char_injured_man_turned` seg_024, `char_taylor_wounded` seg_034,
  `char_boat_girl` seg_079, `prop_dino_backpack` seg_079.

Ch1 reuses `char_taylor`, `prop_steel_rod`, `prop_tactical_backpack`, `loc_prologue_title`
and `loc_city_skyline_noon` from `data_entities.mjs`. State changes get their own id
(`char_taylor_wounded`, `char_injured_man_turned`) with a `base`, because one id maps to one
reference folder; the base id is never overwritten.

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
- **`first_seen`** is derived by each chapter builder from the first segment that uses the entity.
- **One manifest per chapter.** Segment ids restart at `seg_001`, so the manifests must not be
  shared. Pass `--manifest` explicitly for ch1; otherwise `render_all` will skip ids that ch0
  already rendered.

## Reference plates

Ch1 sets `refs.root` to `output`, so the asset root for this story is `test_story3/output`,
not the ComfyUI download root. Plates land in `test_story3/output/refs/<entity_id>/`; ComfyUI
names the files, so the plan records the folder only. `workspace/tools/generate_refs.mjs`
renders the missing ones with the story's configured Z-Image checkpoint, one plate per entity:

| kind | size | framing |
|---|---|---|
| character | 832×1024 | head-and-shoulders, plain grey backdrop |
| prop | 1024×1024 | product plate, no text |
| location | 1344×768 | wide establishing, no people, no text |

Character prompts name an explicit age and wrinkles rather than "late fifties": the model
under-ages when only a decade is given. Entity `status` flips to `ready` once a file exists.
`check_refs.mjs` verifies that every entity used by the plan has a plate.

## Prompt style lock (t2v)

Per `workspace/VIDEO_PROMPT_METHOD_1_T2V.md`, t2v cells do **not** bind reference plates:
identity and medium are locked by repeating text. Every `[Shot 1]` opens with the same sentence:

```text
Photorealistic live-action 35mm film, fine grain, natural skin texture, real-world photography,
muted olive and cold grey palette, <light clause>, shallow depth of field, grounded documentary
realism — not anime, not cartoon, not illustration, not cel shading, not an advertisement,
not slow motion, no on-screen text.
```

Ch1 light clauses: `harsh flat noon light` (riverbank, canal, skyline, boat exterior) and
`dim green-grey daylight through open hatches` (boat corridor, captain's cabin). Ch0 used the
dawn / night / rain / storm variants listed in the method doc.

Speaker numbers continue across the story, so a returning voice keeps its label:
`(S1)` Frost, `(S2)` engineer, `(S3)` Taylor, `(S4)` contractor, `(S5)` Zhuang, `(S6)` Yang,
`(S7)` Xiao Liu, `(S8)` father, `(S9)` taxi driver, `(S10)` the injured / turned man,
`(S11)` the girl.

Ch1 prompt generation:

```powershell
node build_prompts_ch1.mjs                  # writes prompts/ch1/, UTF-8 no BOM, LF only
```

`build_prompts_ch1.mjs` prepends the style lock and the scene anchor, mirrors
`plan.ch1.json → spoken_text` into `<d>` blocks (dialogue is never retyped), rejects symbols
the TTS would read aloud, and derives `At MM:SS.mmm` anchors from `estimated_sec` and the
number of shots. Ch0 prompts are hand-written and stay in `prompts/`.

Narration and internal monologue carry a `<d>` block too: the narrator voice reads the plan
line while the people on screen keep their lips closed. `seg_001` and `seg_081` are black
slate cards, so they carry the film-texture description and no figure.

## Rendering a segment

`workspace/tools/render_segment.mjs` takes the story folder and a segment id; it finds the
prompt (`<seg>.t2v.txt` or `.r2v.txt`), resolves every `reference_images` entry to the newest
plate in that entity's folder (scene slot first), and submits the job:

```powershell
node ../workspace/tools/render_segment.mjs --story . --seg seg_002
node ../workspace/tools/render_segment.mjs --story . --plan plan.ch1.json `
  --prompts prompts/ch1 --manifest render_manifest.ch1.json --seg seg_002
```

Add `--dry-run` to see the resolved slots/duration without touching the GPU, `--take N` to
record a retake, `--seed N` to pin the sampler. Duration comes from the segment's
`estimated_sec` and is quantised to H3's 17k+5 frame grid at 24 fps. Each submission appends
to the selected manifest; clips land in `output/render/<plan name>/`.

The whole chapter, in plan order, skipping segments already in the manifest:

```powershell
node ../workspace/tools/render_all.mjs --story . --plan plan.ch1.json `
  --prompts prompts/ch1 --manifest render_manifest.ch1.json --async --no-turbo --seed 100
```

`render_all.bat` / `render_one.bat` are thin wrappers around these two commands.

## Resolution

`story.json` renders at **352×608 / 24 fps**. Ch0's current `render_manifest.json` was
re-rendered externally at **544×960**, so its clips do not match this setting. Ch1 is rendered
at 352×608 by choice (2026-11-09). Before merging chapters, re-render ch0 at 352×608 or scale
its clips; `concat_renders.mjs` refuses to mix resolutions silently.

## Assembling the chapter

`workspace/tools/concat_renders.mjs` builds the concat list from the selected manifest
(segment order, not directory sort), verifies every file exists, and merges in one pass:

```powershell
node ../workspace/tools/concat_renders.mjs --story . `
  --plan plan.ch1.json --manifest render_manifest.ch1.json
node ../workspace/tools/concat_renders.mjs --story . `
  --plan plan.ch1.json --manifest render_manifest.ch1.json --reencode
```

Output: `output/video/plan.ch1_full_<WxH>.mp4`, with the concat list kept beside it. Copy mode
requires every clip to share resolution, fps and codec; use `--reencode` if joins drift.

## Subtitles

`workspace/tools/build_subtitles.mjs` writes a YouTube-ready Traditional Chinese track. Timing
is derived from the plan rather than from transcription:

- segment offsets use the same cumulative clip durations that `concat_renders.mjs` lays down,
  so a cue cannot drift against the merged film;
- each `<d>` block sits at its shot's `At MM:SS.mmm` cut time, and lines inside one block are
  spaced at 6.2 characters per second;
- an alignment pass then reads each clip's RMS envelope with ffmpeg and moves any cue that
  would land in silence onto the nearest speech onset within 3 s. This matters because the
  model often holds a beat of room tone before the first line.

```powershell
node ../workspace/tools/build_subtitles.mjs --story . --plan plan.ch1.json `
  --prompts prompts/ch1 --manifest render_manifest.ch1.json
node ../workspace/tools/build_subtitles.mjs --story . --plan plan.ch1.json `
  --prompts prompts/ch1 --manifest render_manifest.ch1.json --no-audio
```

Output: `output/video/plan.ch1_full_352x608.zh-Hant.srt` plus a `.vtt` with the same cues.
Rules: max 15 characters per line, max two lines, no speaker labels, narration and internal
monologue in `<i>`, and line breaks scored so they never split a name or a compound word.
The word list for line breaking lives in `story.json → subtitles.protect`, not in the tool.

## Still to do (stage 2)

1. Write `<chapter>.json` blocks from the plan only — do not re-read the novel.
2. Convert `spoken_text` to pronounceable lines (strip quotes, em dashes, digits) per
   `PROMPT_TECHNIQUES.md`; split per `render_blocks`.
