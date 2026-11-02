# Defect catalogue

Failure modes actually observed in a 49-block, 4:56 generated episode (r2v: one still scene plus
per-character stills → 4–8 s of video with synthesised voice). Each entry: what it looks like on a
contact sheet, why the prompt caused it, and the fix that worked.

Numbers in `block_012_silhouette` form refer to the episode where the case was first seen.

---

## A. Motion inside a block that must be one shot

### A1. Insert dissolves into a character shot

**Symptom.** Frame 1 is a document / hand / pen; frames 4–6 are a man's face and shoulders. The
transition is a soft dissolve, not a cut, so it reads as a mistake rather than an edit.

**Cause.** The prompt described the insert, but also carried the standing wardrobe and expression
paragraph. The model has stills of a face and a scene, and "robe", "jaw", "eyes" give it a reason to
use them. A 5-second block gets both shots, blended.

**Fix.** Suppress the character language for insert blocks (`no_wardrobe`): replace the wardrobe block
with `沒有人說話。` and describe only the object. Seen in `block_018_outage_window` (statement →
judge) and `block_016_frozen_eyes` (eyes → office medium).

### A2. Close-up pulls back into a wide

**Symptom.** Frames start tight on eyes or a mouth; by the last frame the whole room is visible and
the subject is small.

**Cause.** The **scene plate** is in slot 1. Giving the model a wide still of the room and a tight
instruction, it satisfies both by dollying out. Nothing in the prompt forbids it.

**Fix.** Drop the scene plate for pure face inserts (`no_scene`), supply the character plate only, and
name what is inside the frame and what is outside: `畫面只框住他的眉毛和兩隻眼睛，其他部位都在畫面之外。`
This also removed the ghost double face in `block_008_eyes`, where two overlapping faces were being
blended.

### A3. Silhouette resolves into a lit face

**Symptom.** A backlit shape in the first frames becomes a fully lit, recognisable close-up.

**Cause.** "Silhouette" was stated once, in the action line, while the wardrobe and lighting
paragraphs still described a lit face. Majority wins.

**Fix.** State the lighting as a constraint, not a mood, and keep the face out of it:
`逆光，只剩輪廓，看不見五官。` plus `no_wardrobe`. Case: `block_012_silhouette`.

### A4. Multi-shot phrasing creates a montage

**Symptom.** A block contains two or three distinct setups with hard cuts.

**Cause.** An ordinal in the prompt — `第一個鏡頭…`, `接著…` — is read as "make several shots".

**Fix.** Use `畫面` / `鏡位` and keep one intent per block. If the plan truly needs three shots, split
it in the plan; `block_038_verdict_read` (read the verdict + seal it + Zhao's eyes) became one block of
reading and sealing, and the eyes became nothing.

---

## B. Content that should not be in frame

### B1. Burned-in subtitles

**Symptom.** Chinese text in the lower third, styled like a subtitle, present on every frame and
sometimes animated in. Also seen as a garbled text panel on a wall.

**Cause.** Nothing forbade it. A template that used to carry the instruction had it dropped, and the
model's training data is full of subtitled video. It is not a small artifact: the frame is unusable.

**Fix.** A single global guard appended to every prompt — not only the ones that looked at risk:

```
畫面裡沒有任何字幕，也沒有浮水印。
```

Because it is global, it is added by the compiler, not typed per block. Cases: `block_028_open_palm`,
`block_035_open_fist`. For on-screen text inside the world (a wall panel, a screen), also describe the
space instead: `身後的牆是空的，牆上沒有任何文字。` (`block_021_lamp_flicker`, where a blue garbled panel
appeared).

### B2. An extra person in an empty room

**Symptom.** A one-person scene has a second figure — a seated woman, a clerk, a passing silhouette.

**Cause.** The prompt said "he sits alone" but the scene plate contains people, and the prompt never
described the emptiness as visible content.

**Fix.** Name the absence and give the frame something else to look at:
`辦公室裡只有他一個人，沒有別人。` plus the window and the field. Cases: `block_046_half_laugh` (a strange
woman at the desk), `block_005_pulpit` (a gallery of clerks behind the judge).

### B3. Two similar faces merge into one

**Symptom.** Two characters in one shot produce a single face with features from both — a ghosted
double exposure, or one person wearing the other's clothes.

**Cause.** Both character plates are supplied for a shot where one of them is only present as a
presence (over the shoulder, in the background).

**Fix.** Supply a plate only for whoever is actually in frame; if a second body is needed, put it in
the scene plate instead. Where the merge was unavoidable, restage the block as a single:
`block_001_court_wide` originally had judge + defendant, rendered judge only.

---

## C. Continuity between neighbouring blocks

### C1. The room drifts

**Symptom.** Three consecutive blocks are the same office, but one has a white painted wall and an air
conditioner where the others have a window onto fields.

**Cause.** Only one of the blocks carried the location plate; the others were generated from the
character plate plus prose ("a small branch office").

**Fix.** Every block in a location gets that location's plate in slot 1, and each prompt repeats one
concrete anchor that is visible in the plate: `他身後的窗戶外是空曠的田。` Cases: `block_047_wet_eyes`,
`block_048_closes_ruling`.

### C2. Wardrobe drift

**Symptom.** A black robe gains a gold panel, then loses it; a tie changes colour between shots.

**Cause.** "Robe" is a category, not an attribute. Without a negation the model decorates it.

**Fix.** State the attribute and the negation together: `純黑色的長袍，沒有任何裝飾、沒有金色、沒有圖案。`
Case: `block_009_profile`.

### C3. Wrong character in the right costume

**Symptom.** The right costume (a judge's robe) appears on the wrong person, in the wrong room.

**Cause.** The reference list included the judge's plate for a block that was actually the other
character's memory; the model dressed the subject from the available plate.

**Fix.** Narrow the reference list to the room plus the person who is on screen (`refs` override).
Case: `block_030_remembered_line`, where Zhao appeared at the judge's bench in a robe.

### C4. Wrong pose

**Symptom.** A seated man with his head down comes back lying back, arms up, as if on a couch.

**Cause.** "Head down on the desk" is ambiguous about the body; with no desk contact stated, the model
chose the easiest body.

**Fix.** State the support and the angle: `雙手撐在桌面上，肩膀垮著。` and a camera position
`鏡位在他前方偏下，往上看他的臉。` Case: `block_033_tear_line`.

### C5. Camera move that contradicts the intent

**Symptom.** A wide shot of a lit window in dark fields becomes a slow push-in on the man inside.

**Cause.** The prompt described the man's position and expression, so the model composed on him; "wide
from outside" was one clause among many.

**Fix.** Put the subject of the shot in the first clause and delete the character detail that competes:
`從窗外看進去，小屋的窗戶在黑暗的田中央亮著。` Case: `block_049_lit_window`.

---

## D. Performance and audio

### D1. Mouth moves under voice-over

**Symptom.** The line is internal monologue, but the lips are visibly working.

**Cause.** The voice track exists in the same generation as the picture; the model syncs lips to
whatever it hears unless told the sound is not speech from this mouth.

**Fix.** `他的嘴唇閉著，沒有要說話。` for internal monologue, `沒有人說話。` for inserts and inserts of
objects. Check the sheet's last three frames — lips often start still and drift open.

### D2. The narrator changes between clips

**Symptom.** `probe.mjs` reports a median F0 far from the chapter median; listening confirms a
different voice, sometimes a different gender.

**Cause.** Each clip is an independent synthesis. A prompt that mentions another speaker ("the
defendant said…") or gives emotion directions can select a different narrator.

**Fix.** Keep voice direction in one place, identical wording every block; describe who is speaking
only in the dialogue line. `probe.mjs` flags clips at `max(18 Hz, 12 %)` from the chapter median — treat
a flag as "listen before shipping", not as proof, because the same narrator legitimately moves. Cases:
`block_004_site_plan` 127 Hz, `block_018_outage_window` 86 Hz, `block_023_fist` 131 Hz,
`block_038_verdict_read` 133 Hz, `block_042_arrest_footage` 127 Hz, `block_043_clipping` 123 Hz — against
a chapter median of 103.9 Hz.

### D3. A silent clip that should speak

**Symptom.** The sheet looks right, the clip is silent, and the cut has a hole.

**Cause.** The prompt's audio line was overwritten by a `no_wardrobe`-style override, or the "no one
speaks" instruction was copied into a block that has narration.

**Fix.** Make silence explicit per block (`音效，…，沒有音樂。`) and keep narration lines outside the
section that overrides suppress. `probe.mjs` lists silent clips at the end — scan that list before
assembling.

---

## E. Timing

### E1. Duration off the plan

**Symptom.** A 6-second beat renders at 4.5 s or 8.0 s, and the assembled episode drifts.

**Cause.** The model emits a fixed frame count at 24 fps; arbitrary seconds get quantised.

**Fix.** Quantise the requested duration to the frame grid in the compiler (`quantiseFrames`) and
verify with `probe.mjs`. A block outside 4–8 s is a compile error, not a judgement call.

---

## Case log

| # | Block | Symptom | Cause | Fix |
|---|---|---|---|---|
| 1 | 001_court_wide | two faces merged | judge + defendant plates | render judge only |
| 2 | 005_pulpit | crowded court | gallery in the plate; "pulpit" pulled wide | upper body only, `身後一個人也沒有` |
| 3 | 008_eyes | ghost double face | scene plate + wardrobe in an eye insert | `no_scene`, `no_wardrobe` |
| 4 | 009_profile | gold panel; moving mouth | "robe" without attributes | `純黑色…沒有金色`; lips closed |
| 5 | 012_silhouette | silhouette became a lit face | lighting as mood, not constraint | `逆光，只剩輪廓`, no wardrobe |
| 6 | 016_frozen_eyes | eyes → office medium | wardrobe lines + scene plate | `no_scene`, `no_wardrobe` |
| 7 | 018_outage_window | statement → judge | wardrobe lines in an insert | `no_wardrobe` |
| 8 | 021_lamp_flicker | blue garbled text panel | no statement that the wall is blank | `牆上沒有任何文字` |
| 9 | 028_open_palm | burned-in subtitles | no guard in the prompt | global subtitle guard |
| 10 | 030_remembered_line | Zhao in a judge's robe | judge plate in Zhao's memory shot | `refs` = room + Zhao |
| 11 | 033_tear_line | arms-up, lying back | no desk contact, no camera angle | `雙手撐在桌面`, low angle |
| 12 | 035_open_fist | burned-in subtitles | no guard in the prompt | global subtitle guard |
| 13 | 046_half_laugh | stranger in an empty office | emptiness never described | `辦公室裡只有他一個人` |
| 14 | 047_wet_eyes | different room; no tear | location plate missing | branch-office plate + window anchor |
| 15 | 048_closes_ruling | different room | same | same |
| 16 | 049_lit_window | pushed in on the man | character detail outranked "wide from outside" | subject in the first clause |

## Retake rules

- A retake is a new take with a **new seed**. The same seed reproduces the defect.
- Fix the note, then retake. Two retakes of an unchanged prompt is a coin flip, not a fix.
- A failed submission must never replace a keeper: reconcile from the job ledger before assembling.
- Keep the pre-fix take until the retake is reviewed; delete clips, not history.
