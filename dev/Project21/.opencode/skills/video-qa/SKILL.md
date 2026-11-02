---
name: Video QA
description: Inspect rendered video clips for defects before they are assembled — contact sheets, duration/audio probes, and a catalogue of the failure modes generated footage actually shows (burned-in subtitles, inserts that morph into wide shots, rooms that drift between clips, wrong wardrobe, silent-but-talking mouths). Use when reviewing generated video, checking a batch of renders, or deciding which takes to retake.
---

# Video QA

Generated footage fails in ways a single still frame cannot show and a text review cannot catch:
the clip starts as a document close-up and dissolves into a man's face; the narrator's voice changes
between clips; the empty office has a stranger in it. Review each clip as a **sequence of frames plus
its audio**, not as a filename.

## 0. Toolchain

| Need | Use | Why not the obvious thing |
|---|---|---|
| decode / probe / tile | `ffmpeg-static` (npm) | `ffmpeg` is usually not on PATH on Windows; the npm package ships a static binary |
| scripting | Node ESM | `python` on Windows often resolves to the Microsoft Store stub and does nothing |
| screenshots | **not** browser screenshots | a headless-ish browser fails with "needs a visible tab"; render frames with ffmpeg instead |

```powershell
npm install ffmpeg-static        # one dependency: node_modules/ffmpeg-static/ffmpeg.exe
```

| Package | Version used | Why |
|---|---|---|
| `ffmpeg-static` | 5.3.0 | ships a static `ffmpeg` binary per platform; no system install, no PATH setup |
| Node | 24, ESM | runs both scripts and `node:fs` glob expansion; no other runtime |

That is the whole dependency list. `ffprobe` is not required — duration, resolution and fps are
parsed from the header ffmpeg prints with `-i`, which avoids a second binary.

The scripts find that binary by themselves (`scripts/ffmpeg.mjs`), in this order:

1. `$FFMPEG` — an explicit path or a name on PATH;
2. `node_modules/ffmpeg-static/ffmpeg.exe`, walking **up** from the current directory;
3. the same, one level **down** from each ancestor — tools are usually installed in a
   sub-project (`gen_video/node_modules`), not at the workspace root;
4. the same search starting from this skill's own folder;
5. plain `ffmpeg` from PATH.

So the skill works from the project root, from its own folder, or on a machine with a system
install — no junction into the skill folder and no `NODE_PATH`. If nothing is found the scripts
print the install hint instead of guessing. Debug a setup with `node scripts/ffmpeg.mjs`: it prints
the binary it resolved.

In PowerShell, prepend this or CJK output turns into mojibake:

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

PowerShell reports a non-zero exit code as `NativeCommandError` even when the script's own
message is the useful part — read the message, not the red text.

## 1. The three probes

Run all three before judging. They are cheap; a re-render is not.

### a. Contact sheet — what the eye needs

Six frames, evenly spaced, tiled into one PNG per clip. One image per clip keeps 50 clips reviewable
in one sitting; a single still hides motion, and 6 separate images cost 6× the attention.

```powershell
node scripts/sheet.mjs render\*.mp4 --out qa            # one sheet per clip
node scripts/sheet.mjs clip.mp4 --frames 8 --tile 4x2   # denser sampling
node scripts/sheet.mjs "render/block_00[45]_*.mp4"      # wildcards work unexpanded, too
```

The scripts expand wildcards themselves, so a quoted pattern behaves the same in PowerShell, cmd
and bash. Output defaults to the current directory; `--out` is created if missing.

### b. Audio — what the ear would need

The model generates the voice together with the picture, so every clip is an independent synthesis.
Measure the envelope (is anyone speaking, and where) and the median F0 (is it the same person).

```powershell
node scripts/probe.mjs clip.mp4 --json    # duration, size, fps, rms envelope, median F0
node scripts/probe.mjs render\*.mp4       # one line per clip + pitch outliers
```

### c. Timing — what the cut needs

`probe.mjs` reports duration and resolution. A clip whose duration is not what the plan asked for
(quantised to the model's frame grid) will drift the whole timeline; catch it here, not in the assembly.

## 2. How to read a sheet

Frames are in time order, left→right, top→bottom. Ask, in this order:

1. **Is it one shot?** Compare frame 1 with frame 6. If the subject, distance or lighting changes
   wholesale, the model inserted a cut or a dissolve into a block that was supposed to be static.
   This is the most common failure and the most damaging, because it breaks a 5-second beat.
2. **Is it the right shot?** Check size (insert vs. medium vs. wide) against the note. A document
   insert that shows a torso is wrong even if it is beautiful.
3. **Continuity with the neighbours.** The same room must be the same room: wall colour, window,
   furniture, time of day. Compare with the sheet of the clip before and after.
4. **Who is in frame?** Any person not called for is a defect (a stranger in an empty office).
   Two similar faces close together is the known merge case: they collapse into one face.
5. **Wardrobe and props.** Robe vs. suit, tie vs. no tie, tie colour, a gold panel that should not
   exist, a doubled pen.
6. **Bad pixels.** Burned-in subtitles in the lower third, watermarks, garbled on-screen text panels,
   ghosted double exposures, extra fingers.
7. **Mouth.** If the block is voice-over or internal monologue, a moving mouth reads as the wrong
   speaker. Room-tone blocks must have sealed lips.

## 3. Triage

| Verdict | Criteria | Action |
|---|---|---|
| keep | one shot, right size, plausible staging, no artifacts | record the take |
| warn | small wardrobe drift, soft focus, mild lighting shift, mouth moving under voice-over | keep, note it; retake only if the neighbours are clean |
| retake | dissolve/morph inside the clip, burned-in subtitles, extra person, wrong room, wrong pose, ghost face | change the prompt or the seed, re-render |

Always retake with a **new seed**. Re-running with the same seed reproduces the same defect.

## 4. The loop

```powershell
# 1. render (a batch or one block)
node render_blocks.mjs --only <ids> --take 2
# 2. review
node scripts/sheet.mjs ... ; node scripts/probe.mjs ...
# 3. fix the note that caused the defect, not the render
# 4. retake with the next take number (new seed), re-review
# 5. reconcile before assembling — failed submissions must not erase a keeper take
node sync_manifest.mjs --write
# 6. assemble only when every block has a keeper
node assemble_blocks.mjs --check
```

Step 5 matters: a renderer that writes "error" over a block on a failed submission will silently
drop a good clip out of the cut. The job ledger is the source of truth; the manifest is a cache.

## 5. Fix patterns (not just "retake")

Most defects trace to one of five prompt mistakes. Fix the prompt, then retake:

| Defect | Prompt cause | Fix |
|---|---|---|
| insert morphs into a character shot | the prompt also names a robe, a jaw, a face | drop wardrobe/face lines for insert shots (`no_wardrobe`) |
| eye/face insert becomes a wide | the scene plate gives permission to pull back | give the character plate only, no scene (`no_scene`) |
| two faces merge into one | both characters' plates are supplied | supply a plate only for whoever is actually in frame |
| burned-in subtitles | nothing forbids them, and the template's own instruction was dropped | add "畫面裡沒有任何字幕，也沒有浮水印" to every prompt |
| empty room gains people | the scene is described but not its emptiness | state "一個人也沒有" and what is visible instead |

Full catalogue with symptoms seen in practice: `references/defect-catalogue.md`.

## 6. Turn a review into a file, not a chat log

Write per block: verdict, what is wrong, the fix that was applied, the take that was kept. A report
next to the story (`ch04_render_report.md`) is what makes the second pass cheap — and it is the only
record that survives the session.

A useful report has four parts: how a block becomes a take (the commands, in order), the list of
blocks still on a defective take with the fix already applied, the voice check, and the deliberate
deviations from the plan. Keep the retake command copy-pasteable — the second pass should be one
command, not a reconstruction.

## Files

| Path | What it is |
|---|---|
| `scripts/sheet.mjs` | contact sheet; also exports `probeDuration` |
| `scripts/probe.mjs` | duration, size, fps, RMS envelope, median F0, pitch outliers, silent clips |
| `scripts/ffmpeg.mjs` | binary resolution (`node scripts/ffmpeg.mjs` prints the path) |
| `scripts/cli.mjs` | argument parsing and wildcard expansion |
| `references/defect-catalogue.md` | 16 observed cases: symptom → cause → fix, plus retake rules |

Both scripts are standalone: `node <path>/scripts/sheet.mjs clip.mp4` from any working directory.
