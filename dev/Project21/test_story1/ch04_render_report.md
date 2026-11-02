# ch04 render report

Rough cut: `output/render/ch04/ch04_episode.mp4` — 4:56, 608×352, 24fps, stereo audio.
Built from `ch04_render_manifest.json` (one keeper take per block) by `gen_video/assemble_blocks.mjs`.

## How a block becomes a take

| Step | Command | What it decides |
|---|---|---|
| compile | `node compile_blocks.mjs --check` | prompt text, references, seed, frames |
| render | `node render_blocks.mjs --only <ids> --take N` | submits, records `prompt_id` in the ledger + manifest |
| reconcile | `node sync_manifest.mjs --write` | newest **successful** ledger entry wins; failed submissions never overwrite a keeper |
| review | `node qa_sheet.mjs` | one six-frame contact sheet per block |
| assemble | `node assemble_blocks.mjs` | concat in plan order |

A failed take leaves the previous keeper in place — that is why the aborted retake round (ComfyUI
went offline mid-run) left the rough cut intact.

## 15 blocks still on take 1

These rendered, but with a defect worth a retake once the GPU box is reachable. The shot notes are
already fixed, so the retake is one command:

```powershell
node render_blocks.mjs --take 2 --only block_005_pulpit,block_008_eyes,block_009_profile,block_012_silhouette,block_016_frozen_eyes,block_018_outage_window,block_021_lamp_flicker,block_028_open_palm,block_030_remembered_line,block_033_tear_line,block_035_open_fist,block_046_half_laugh,block_047_wet_eyes,block_048_closes_ruling,block_049_lit_window
```

| Block | What is wrong in take 1 | Fix already in the notes |
|---|---|---|
| 005_pulpit | wide court, filled with clerks and gallery — breaks the empty-court staging | tight on the judge's upper body, "身後一個人也沒有" |
| 008_eyes | dissolves from an eye into a ghosted double face | face-only reference, no scene plate |
| 009_profile | gold panel on the robe; mouth moving | "純黑色長袍，沒有金色、沒有圖案" |
| 012_silhouette | silhouette resolves into a lit close-up | explicit backlight, no wardrobe |
| 016_frozen_eyes | morphs from eyes into an office medium | face-only reference, no wardrobe |
| 018_outage_window | morphs from the statement into the judge | insert shot, no wardrobe |
| 021_lamp_flicker | blue garbled text panel on the wall | "牆上沒有任何文字" |
| 028_open_palm | subtitles burned into the lower third | global subtitle guard |
| 030_remembered_line | Zhao in a black robe at the judge's bench | narrowed to courtroom + Zhao |
| 033_tear_line | arms-up, lying-back pose | hands braced on the desk, low angle |
| 035_open_fist | subtitles burned into the lower third | global subtitle guard |
| 046_half_laugh | a strange woman seated in the empty branch office | "辦公室裡只有他一個人" |
| 047_wet_eyes | different room (white wall, AC unit); no tear | branch-office reference, wet lash line |
| 048_closes_ruling | different room again | window/field anchor |
| 049_lit_window | pushes in on the man instead of the lit box in the dark | silhouette through the glass, dark fields |

## Voice check

`node qa_voice.mjs` measures median F0 per clip. Chapter median 103.9 Hz over 49 blocks. Six blocks sit
30 % away from it and are worth listening to before the final cut:

`block_004_site_plan` (127 Hz), `block_018_outage_window` (86 Hz), `block_023_fist` (131 Hz),
`block_038_verdict_read` (133 Hz), `block_042_arrest_footage` (127 Hz), `block_043_clipping` (123 Hz).

A pitch difference alone does not prove a different speaker — the same narrator shifts with
intonation — but if any of them sounds like another person, that block is a retake too.

## Deliberate deviations from the plan

| Block | Plan says | Rendered | Why |
|---|---|---|---|
| 001 | judge + Zhao in frame | judge only | two similar faces in one frame merge into one |
| 030 | judge's pen in the foreground | Zhao alone in flashback | the pen pulled a torso into a memory shot |
| 038 | judge + Zhao's closed eyes + gavel | judge reading, then sealing | one block is one intent; three shots in six seconds produced a morph |
