# Ch9 區塊獨立提示詞 — I0–I20（實作範例 11：第九章「卡拉卡斯的啟示錄」）

> 本文件承接 `novel_to_video_guide_v2.md` 與 `example10_ch8.md`（Ch8），
> 完整產出**第九章「卡拉卡斯的啟示錄」**的區塊分割、參考圖分配與全部 21 支 r2v 六欄位提示詞，
> 並套用 `video_prompt_guide.md` QA Q1–Q8。
>
> **章節功能**：林墨於聖保羅大教堂塔頂廣播機房強制接管全城電子屏幕／雷射投影系統，向全國播放十年前的
> 卡拉卡斯紀錄片：年輕赫德在台上宣揚「數據是騙人的」、私下教導財政部長靠維持憤怒鞏固權力；特種部隊破門而入，
> 領隊軍官親眼目睹真相後拒絕關停訊號。情緒走向：機房佈線 → 雲幕亮起 → 紀錄片揭密 → 街頭仰望 → 破門對峙 → 軍官倒戈。
> 登場角色：林墨（沿用 Ref-M）、年輕赫德（**新肖像**，紀錄片畫面）、現任赫德總統（僅通訊器聲、不出鏡）、
> 領隊軍官（**新肖像**）、路邊老人（**新肖像**，一句對白）、擴音器／麥克風（畫外音、無張嘴者）。
>
> ⚠ **QA 應用**：對白一律移除 `「」『』`《》引號、冒號、刪節號、驚嘆號；阿拉伯數字改中文數字；**外源借詞中文化**
> （`AI`→人工智慧，Q1/Q5）；對白句間以語法銜接為本（Q6）；說話鏡頭一律帶正向嘴部 cue（Q7）；對白含稱謂直呼
> （總統閣下／長官）的區塊，被稱呼者不入前景、`Action` 明寫「only <Subject N>'s mouth moves」（Q8）；
> 畫外音（擴音器警告 I2、赫德通訊器 I15）明寫 `off-screen voice`、畫面上角色不張嘴。每句獨立換行；錨點句含 `no English`。
> **旁白區塊（I20）含 `Narration: <Narrator> says:`＋`<d>[中文]…</d>`**（G20 教訓），旁白 seed 沿用 `310000`。

---

## 一、參考圖分配表

| 編號 | 角色/場景 | 來源路徑（應寫入 `ref_image_N`） | 主要區塊 |
|------|-----------|----------------------------------|----------|
| Ref-M | 林墨 | `output/ch1_beat13_ref_char/zimage_00008_.png` | I1,I3,I4,I12,I16 |
| Ref-BROADCAST | 大教堂塔頂廣播機房 | `output/ch9_broadcast_ref/zimage_00078_.png` | I1,I2,I3,I4,I12,I13,I16 |
| Ref-OFFICER | 特勤領隊軍官 | `output/ch9_officer_ref/zimage_00081_.png` | I13,I14,I15,I16,I17,I18 |
| Ref-CATH | 聖保羅大教堂鐘塔夜 | `output/ch9_cath_ref/zimage_00077_.png` | I0 |
| Ref-CARACAS | 卡拉卡斯紀錄片街景（顆粒） | `output/ch9_caracas_ref/zimage_00084_.png` | I6,I7,I8,I9,I19 |
| Ref-HERDY | 年輕赫德（紀錄片） | `output/ch9_herdy_ref/zimage_00080_.png` | I7,I9 |
| Ref-OFFICER | 特勤領隊軍官 | `output/ch9_officer_ref/zimage_00081_.png` | I13,I14,I15,I16,I17,I18 |
| Ref-OLD | 路邊老人 | `output/ch9_old_ref/zimage_00082_.png` | I11 |
| Ref-SKY | 雲幕天空（雷射投影幕布） | `output/ch9_sky_ref/zimage_00083_.png` | I5,I10,I11,I14,I19,I20 |
| Ref-SCR | 電子屏幕（被接管） | `output/ch6_screen_ref/zimage_00056_.png` | I5,I8 |
| Ref-NIGHT | 首都夜街 | `output/ch8_night_ref/zimage_00066_.png` | I10,I17 |

## 二、區塊總表（對白／旁白／場景分割）

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留氣口進位；場景按動作節拍。長對白（I12/I16）依語法銜接分行。
> 規劃總長 ≈ **169s**；合併後 `scale = 實際總秒數 / 169` 換算字幕。

| 區塊 | 型別 | 秒 | 累積起點 | 內容 |
|------|------|----|---------|------|
| I0 | 場景 | 6s | 0s | 教堂鐘塔夜 |
| I1 | 場景 | 6s | 6s | 衝入機房、鎖門 |
| I2 | 對白 | 8s | 14s | 擴音器警告（畫外音） |
| I3 | 場景 | 6s | 22s | 接播放器、橋接投影 |
| I4 | 對白 | 6s | 28s | 林墨對麥克風低語蘇菲 |
| I5 | 場景 | 8s | 34s | 屏幕被接管、雷射射天 |
| I6 | 場景 | 5s | 42s | 畫面亮起：卡拉卡斯 |
| I7 | 對白 | 7s | 47s | 赫德台上咆哮 |
| I8 | 場景 | 7s | 54s | 快進：鈔票/報表 |
| I9 | 對白 | 12s | 61s | 赫德與財政部長私語 |
| I10 | 場景 | 6s | 73s | 街頭人民仰望 |
| I11 | 對白 | 5s | 79s | 老人：「那就是我們的總統」 |
| I12 | 對白 | 20s | 84s | 林墨廣播宣言 |
| I13 | 場景 | 5s | 104s | 鐵門炸開、特勤湧入 |
| I14 | 場景 | 5s | 109s | 軍官遲疑看天空 |
| I15 | 對白 | 9s | 114s | 赫德通訊器咆哮（畫外音） |
| I16 | 對白 | 20s | 123s | 林墨：總統閣下/長官 |
| I17 | 場景 | 6s | 143s | 軍官看窗外手機燈海 |
| I18 | 對白 | 8s | 149s | 軍官垂槍回應 |
| I19 | 場景 | 6s | 157s | 雲幕續播卡拉卡斯、廢紙成標題 |
| I20 | 旁白 | 8s | 163s | 資訊的啟示錄收束 |

全表 21 個區塊（場景 12、對白 8、旁白 1）；對白/場景 seed `490000–490019`，旁白 `310000`。

---

## 三、完整提示詞

## I0 — 教堂鐘塔夜（場景，6 秒）

**來源**：`story1.md` line 491。

```
subject_definitions:
<Subject 1> is the night bell tower of the cathedral from <Picture 1>:
a single tall stone spire rising like a lonely needle into storm-black clouds.

summary:
Reference-based establishing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Very low wide shot, the spire cutting upward into the black sky.

[Shot 1]

00:00-00:06

Action:
The cathedral clock tower rises against storm clouds. Wind tears the clouds; the spire stands alone pointing at the hidden sky. Slow push-in.

overall_soundscape:
Wind, distant thunder, city hum far below.
No speech.

non_diegetic_music:
A low ominous drone.
```

**參數**：`ref_image_0=output/ch9_cath_ref/zimage_00077_.png, duration=6, seed=490000, out=ch9_i0_video`

---

## I1 — 衝入機房、鎖門（場景，6 秒）

**來源**：`story1.md` line 493。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, breathing hard.

<Subject 2> is the cathedral radio broadcast room from <Picture 2>:
dusty analog tape player, an old diesel generator, control desks, cables, a heavy iron door.

summary:
Reference-based arrival.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Handheld bursts, dust shaken from the door frame.

[Shot 1]

00:00-00:06

Action:
Lin bursts in, slams the heavy iron door shut and shoves an old generator against it to brace it. Heavy boots pound on the stairway outside; dust shakes from the lintel.

overall_soundscape:
Panting, boots hammering the stairwell outside, dust falling, hiss of his own breathing.
No speech.

non_diegetic_music:
A low percussion pulse.
```

**參數**：`ref_image_0=output/ch9_broadcast_ref/zimage_00078_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=6, seed=490001, out=ch9_i1_video`

---

## I2 — 擴音器警告（對白，8 秒）

**來源**：`story1.md` line 495。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, holding his breath, listening at the door.

<Subject 2> is the cathedral radio broadcast room from <Picture 2>:
dusty analog tape player, an old diesel generator pressed against a heavy iron door.

summary:
Reference-based off-screen ultimatum.
Voice only, off-screen.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only a loudspeaker announcement from outside the door is heard, off-screen. No character speaks on camera. No narration. No voice-over. No on-screen mouth movement.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin listening at the door, the generator bracing it.

[Shot 1]

00:00-00:08

Action:
Lin stands braced against the door, jaw tight, as an amplified man's voice booms through the iron door from the stairwell outside. His lips stay shut; only the off-screen loudspeaker carries the words.

Dialogue:
The one speaking is an off-screen amplified voice; <Subject 1> only listens, lips sealed.
The off-screen voice says:

<d>
[中文]
林墨，你已經被包圍了。
立刻交出非法取得的國家機密，否則我們將採取強制武裝行動。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching, heard through loudspeaker distortion.
Metallic amplifier echo, boots shifting outside, his slow breath.
No other speech.

non_diegetic_music:
A low tense drone.
```

**參數**：`ref_image_0=output/ch9_broadcast_ref/zimage_00078_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=8, seed=490002, out=ch9_i2_video`

---

## I3 — 接播放器、橋接投影（場景，6 秒）

**來源**：`story1.md` line 497。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, hands working fast.

<Subject 2> is the cathedral radio broadcast room from <Picture 2>:
dusty analog tape player, control desks, cables, a cassette in his hand.

summary:
Reference-based cable work.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Tight shots on trembling hands and the dusty tape player.

[Shot 1]

00:00-00:06

Action:
Lin's hands shake as he plugs the dusty analog player, slides the cassette in, then slams cables into the cathedral's high-power laser projector terminal. Lights on the desk surge.

overall_soundscape:
Click of connectors, faint tape hiss, his quick breaths.
No speech.

non_diegetic_music:
A rising sub-bass swell.
```

**參數**：`ref_image_0=output/ch9_broadcast_ref/zimage_00078_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=6, seed=490003, out=ch9_i3_video`

---

## I4 — 林墨低語麥克風（對白，6 秒）

**來源**：`story1.md` line 499。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, leaning close to a spare microphone.

<Subject 2> is the cathedral radio broadcast room from <Picture 2>:
control desk, microphone, dust, low blue-grey light.

summary:
Reference-based whispered request.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin's face near the microphone, lips clearly visible.

[Shot 1]

00:00-00:06

Action:
Lin holds the spare microphone close and speaks in a low whisper, his mouth opening and closing clearly with every syllable, lips visibly articulating the Chinese words, camera holds his face. No one replies.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
蘇菲。
如果妳能收到這段訊號，幫我把權限全開。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
A soft whisper over faint line static, his quiet breath.
No other speech.

non_diegetic_music:
None, room hum only.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch9_broadcast_ref/zimage_00078_.png, duration=6, seed=490004, out=ch9_i4_video`

---

## I5 — 屏幕被接管、雷射射天（場景，8 秒）

**來源**：`story1.md` lines 501–503。

```
subject_definitions:
<Subject 1> is an electronic street screen from <Picture 1>:
a dark screen flickering to life in the night.

<Subject 2> is the cloud-sheet sky over the capital from <Picture 2>:
an enormous sheet of storm cloud becoming a glowing projection screen, lit from below.

summary:
Reference-based signal takeover.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Fast cross-cut: screens igniting, then a rising beam into the cloud-sheet.

[Shot 1]

00:00-00:08

Action:
One by one the dark screens of the disconnected capital flare with a raw foreign signal no longer under government control (visible on-screen text). A vertical laser beam from the cathedral smashes into the cloud-sheet above, igniting it into a giant glowing curtain.

overall_soundscape:
Electrical hum rising, amplifiers feeding back, a deep laser bass, wind.
No speech.

non_diegetic_music:
A swelling ominous choir.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, ref_image_1=output/ch9_sky_ref/zimage_00083_.png, duration=8, seed=490005, out=ch9_i5_video`

---

## I6 — 畫面亮起：卡拉卡斯（場景，5 秒）

**來源**：`story1.md` lines 506–509。

```
subject_definitions:
<Subject 1> is grainy archival footage of a South American capital from <Picture 1>:
weathered concrete blocks, a huge crowd massed behind a distant stage, heavy film grain.

summary:
Reference-based reveal.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Shaky old footage ramping out of static, heavy grain.

[Shot 1]

00:00-00:05

Action:
The cloud-curtain above the city now plays a shaky, grainy documentary image: Caracas, ten years ago, a huge crowd surging behind a raised stage. Camera wobbles like a handheld film camera from a decade past.

overall_soundscape:
Old film hiss, crowd noise laid into the recording, wind over the city.
No speech.

non_diegetic_music:
A low analogue tape warble.
```

**參數**：`ref_image_0=output/ch9_caracas_ref/zimage_00084_.png, duration=5, seed=490006, out=ch9_i6_video`

---

## I7 — 赫德台上咆哮（對白，7 秒）

**來源**：`story1.md` line 509 後段。

```
subject_definitions:
<Subject 1> is young Hurd from <Picture 1>:
a gaunt ambitious East Asian technocrat in his mid-thirties, black hair slicked back, cold sharp eyes, thin resolved mouth, dark tunic of an authoritarian technical advisor, standing at a rally microphone.

<Subject 2> is grainy archival footage of the Caracas street from <Picture 2>:
a huge crowd behind him, weathered concrete blocks, heavy film grain.

summary:
Reference-based recorded rant.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks inside the old recording. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Granular archival close-up of Hurd at the microphone, the crowd behind.

[Shot 1]

00:00-00:07

Action:
Young Hurd bellows into the rally microphone inside the old footage, his mouth opening and closing clearly with every syllable, lips visibly articulating the Chinese words, camera holds his face. The crowd sways behind him.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains silent background.
<Subject 1> says:

<d>
[中文]
數據是騙人的，只有我們對主權的熱愛是真的。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching, slightly hollow like a vintage recording.
Old amplifier hiss, crowd roar swells then sits under the voice.
No other speech.

non_diegetic_music:
The low analogue warble of the projection.
```

**參數**：`ref_image_0=output/ch9_herdy_ref/zimage_00080_.png, ref_image_1=output/ch9_caracas_ref/zimage_00084_.png, duration=7, seed=490007, out=ch9_i7_video`

---

## I8 — 快進：鈔票／報表（場景，7 秒）

**來源**：`story1.md` lines 511–513。

```
subject_definitions:
<Subject 1> is grainy archival footage of the capital from <Picture 1>:
crowds cheering banners, a queue at a bank door.

<Subject 2> is an emergency screen from <Picture 2>:
a wall screen in the film with visible accounting rows and banknote images.

summary:
Reference-based montage.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Fast-cut archival montage, each shot ramping to the next with a jitter.

[Shot 1]

00:00-00:07

Action:
Old footage fast-forwards: people cheering under banners while a bank line grows ever longer; a stack of freshly printed banknotes that back no reserves; an office where crop reports are typed up out of thin air (visible on-screen text: printed numbers). Everything grain-heavy and grey.

overall_soundscape:
Tape fast-forward whirr, film hiss, a muffled crowd.
No speech.

non_diegetic_music:
A low ticking pulse like a counter.
```

**參數**：`ref_image_0=output/ch9_caracas_ref/zimage_00084_.png, ref_image_1=output/ch6_screen_ref/zimage_00056_.png, duration=7, seed=490008, out=ch9_i8_video`

---

## I9 — 赫德與財政部長私語（對白，12 秒）

**來源**：`story1.md` line 517。

```
subject_definitions:
<Subject 1> is young Hurd from <Picture 1>:
a gaunt ambitious East Asian technocrat in his mid-thirties, black hair slicked back, cold sharp eyes, lips cold, dark tunic, speaking calmly to a camera.

<Subject 2> is grainy archival footage of the capital from <Picture 2>:
a shuttered ministry room in dark colours, heavy film grain.

summary:
Reference-based recorded monologue to camera.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks inside the old recording. No other character speaks. No narration. No voice-over. The finance-minister listener has no lines and stays out of frame.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Granular archival medium close-up, Hurd speaking flatly to the lens.

[Shot 1]

00:00-00:12

Action:
In the old footage, young Hurd talks calmly and coldly straight into the camera, explaining how to keep power through rage, his mouth opening and closing clearly with every syllable, lips visibly articulating the Chinese words, camera holds his face.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
當人民發現麵包不夠時，就給他們更多的敵人。
當他們發現口袋裡的錢沒用時，就告訴他們，這是因為反對派在操縱匯率。
只要憤怒還在，我們的權力就還在。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching, slightly hollow like a vintage recording.
Old amplifier hum, film grain crackle.
No other speech.

non_diegetic_music:
A low cold piano line.
```

**參數**：`ref_image_0=output/ch9_herdy_ref/zimage_00080_.png, ref_image_1=output/ch9_caracas_ref/zimage_00084_.png, duration=12, seed=490009, out=ch9_i9_video`

---

## I10 — 街頭人民仰望（場景，6 秒）

**來源**：`story1.md` lines 519–521。

```
subject_definitions:
<Subject 1> is the capital night street from <Picture 1>:
dark windows and doorways, wet pavement.

<Subject 2> is the cloud-sheet sky from <Picture 2>:
an enormous glowing projection sheet above the city.

summary:
Reference-based awakening.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Wide shot up the street, windows opening one by one toward the sky.

[Shot 1]

00:00-00:06

Action:
Across the capital, shutters and windows push open; silhouettes step onto balconies and doorsteps and crane their necks upward at the cloud-sheet. The glowing recorded images play above their heads.

overall_soundscape:
City rustle, a hundred windows opening, wind, faint film audio leaking from the sky.
No speech.

non_diegetic_music:
A slow shifting ambient wash.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, ref_image_1=output/ch9_sky_ref/zimage_00083_.png, duration=6, seed=490010, out=ch9_i10_video`

---

## I11 — 老人：「那就是我們的總統」（對白，5 秒）

**來源**：`story1.md` line 523。

```
subject_definitions:
<Subject 1> is an elderly East Asian man from <Picture 1>:
seventies, grey lined face, worn dark coat, holding a small transistor radio that slips from his hand.

<Subject 2> is the cloud-sheet sky from <Picture 2>:
the huge glowing sky-screen with a young cold face faintly visible.

summary:
Reference-based witness line.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. The face in the sky is a screen image, not a speaker.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on the old man's upturned face, the sky-screen behind him.

[Shot 1]

00:00-00:05

Action:
The old man stares up at the young cold face glowing in the cloud-sheet, and names its owner, his mouth opening and closing clearly with every syllable, lips visibly articulating the Chinese words, camera holds his face. The radio slides from his hand and clatters on the ground.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> remains a silent screen image.
<Subject 1> says:

<d>
[中文]
那就是我們的總統。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Night wind, the radio clattering on asphalt.
No other speech.

non_diegetic_music:
A soft distant sting.
```

**參數**：`ref_image_0=output/ch9_old_ref/zimage_00082_.png, ref_image_1=output/ch9_sky_ref/zimage_00083_.png, duration=5, seed=490011, out=ch9_i11_video`

---

## I12 — 林墨廣播宣言（對白，20 秒）

**來源**：`story1.md` line 525。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, holding the spare microphone, eyes burning.

<Subject 2> is the cathedral radio broadcast room from <Picture 2>:
control desk, microphone, dust, low blue-grey light.

summary:
Reference-based broadcast speech.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks into the microphone. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Slow push-in on Lin's face as he broadcasts; steady and still at the microphone.

[Shot 1]

00:00-00:20

Action:
Lin stands still at the desk, mouth at the microphone, delivering the announcement to the whole city, his mouth opening and closing clearly with every syllable, lips visibly articulating the Chinese words, camera slowly pushes in and holds his face. His free hand is steady on the desk.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
這不是刺殺，這是錄像。
各位國民，你們現在看到的，就是標籤政治的終點。
索利亞不是死於外敵，而是死於這一張張被掩蓋的數據報表。
赫德在索利亞實驗失敗了，所以他來到歐若拉，想要用更精密的斷網與標籤，再來一次。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
His voice carried wide through the broadcast, faint room hum underneath.
No other speech.

non_diegetic_music:
A low rising string swell under the voice.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch9_broadcast_ref/zimage_00078_.png, duration=20, seed=490012, out=ch9_i12_video`

---

## I13 — 鐵門炸開、特勤湧入（場景，5 秒）

**來源**：`story1.md` lines 527–529。

```
subject_definitions:
<Subject 1> is the cathedral radio broadcast room from <Picture 1>:
the heavy iron door and the control desk in dust.

<Subject 2> is a special-operations officer from <Picture 2>:
middle-aged East Asian male, stern face, tactical vest, suppressed rifle low.

summary:
Reference-based breach.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Impact cut: the door blowing inward, dust and strike team silhouette.

[Shot 1]

00:00-00:05

Action:
The iron door blows open with a flash, the generator skids aside. Special-forces troopers flood in as red laser dots swim across Lin's chest. Muzzle flash lit dust fills the room.

overall_soundscape:
Deafening bang, splintering metal, boots storming in, shouted non-speech comms chatter.
No intelligible speech.

non_diegetic_music:
A percussive hit, then tribal drum step.
```

**參數**：`ref_image_0=output/ch9_broadcast_ref/zimage_00078_.png, ref_image_1=output/ch9_officer_ref/zimage_00081_.png, duration=5, seed=490013, out=ch9_i13_video`

---

## I14 — 軍官遲疑看天空（場景，5 秒）

**來源**：`story1.md` lines 531。

```
subject_definitions:
<Subject 1> is a special-operations officer from <Picture 1>:
middle-aged East Asian male, stern narrow eyes, tactical vest, helmet, holding a suppressed rifle low.

<Subject 2> is the cloud-sheet sky from <Picture 2>:
the huge glowing sky-screen with the young recorded face teaching a crowd.

summary:
Reference-based hesitation.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Medium shot: the officer's gloved finger hovering on the trigger, eyes fixed on the window.

[Shot 1]

00:00-00:05

Action:
The leading officer stops. Through the wide window the glowing sky-screen shows the young recorded face teaching the crowd how to deceive. His finger stays on the trigger but does not squeeze.

overall_soundscape:
Soundproof room hush, the distant projector hum, his uneven breath.
No speech.

non_diegetic_music:
A held low note.
```

**參數**：`ref_image_0=output/ch9_officer_ref/zimage_00081_.png, ref_image_1=output/ch9_sky_ref/zimage_00083_.png, duration=5, seed=490014, out=ch9_i14_video`

---

## I15 — 赫德通訊器咆哮（對白，9 秒）

**來源**：`story1.md` line 533。

```
subject_definitions:
<Subject 1> is a special-operations officer from <Picture 1>:
middle-aged East Asian male, stern face, standing motionless, arms down, a desktop communicator lying on the desk at the edge of the frame.

summary:
Reference-based radio tirade.
Off-screen device audio.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Audio source: 100% off-screen communicator device audio.
<Subject 1>: silent listener, zero speech, mouth completely closed throughout the entire shot, jaw tight.
No other person appears in frame.
All audio is Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.

detailed_description:

Visual style:
Medium close-up on the officer standing still, communicator resting on the desk below the frame emphasis.

[Shot 1]

00:00-00:09

Action:
<Subject 1> stands completely motionless, eyes fixed forward, mouth shut with jaw tight. He stays completely silent while listening to the transmission from the desk communicator.

Off-screen Transmission:
Furious male voice emitted from the desk communicator: tinny, radio-filtered EQ, straining, insistent, Taiwan-accented Standard Mandarin. <Subject 1> does not speak; the voice belongs to the device.
The off-screen voice says:

<d>
[中文]
關掉它。
林墨，立刻關掉它。
那是偽造的。
那是人工智慧合成的。
</d>

overall_soundscape:
Radio static, compressed electronic speaker effect, silent room tone, the officer's heavy breath, communicator crackle. The spoken lines are device audio in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.

non_diegetic_music:
None, tension only.
```

**參數**：`ref_image_0=output/ch9_officer_ref/zimage_00081_.png, duration=9, seed=495015, out=ch9_i15_video`

---

## I16 — 林墨：總統閣下／長官（對白，20 秒）

**來源**：`story1.md` lines 535–537。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, hands raised, face calm with the beginning of a smile.

<Subject 2> is the cathedral radio broadcast room from <Picture 2>:
control desk, dust, laser dots faintly moving across the wall.

<Subject 3> is a special-operations officer from <Picture 3>:
middle-aged East Asian male, stern face, tactical vest, rifle low, standing motionless off-side, lips sealed.

summary:
Reference-based address.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. <Subject 3> stays out of the foreground with lips sealed.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Single-shot medium close-up on Lin, the room and the red dots behind him, <Subject 3> an out-of-focus shape off-side.

[Shot 1]

00:00-00:20

Action:
Lin raises both hands, calm and almost smiling, and speaks to the president through the scene and to the officer across the floor, his mouth opening and closing clearly with every syllable, lips visibly articulating the Chinese words, camera stays on Lin. Nobody else in frame speaks; <Subject 3>'s lips stay closed.

Dialogue:
The following lines belong to <Subject 1> alone. <Subject 2> and <Subject 3> remain silent.
<Subject 1> says:

<d>
[中文]
總統閣下，您忘了嗎。
那捲磁帶是類比訊號，那是十年前的技術，當時的人工智慧還沒辦法模擬那種磁帶特有的物理雜訊。
長官，你可以開槍。
但你沒辦法讓已經看過日出的人，假裝現在還是深夜。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Room dust settling, laser hum, his steady breath.
No other speech.

non_diegetic_music:
A slow quiet cello line.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch9_broadcast_ref/zimage_00078_.png, ref_image_2=output/ch9_officer_ref/zimage_00081_.png, duration=20, seed=490016, out=ch9_i16_video`

---

## I17 — 軍官看窗外手機燈海（場景，6 秒）

**來源**：`story1.md` lines 539。

```
subject_definitions:
<Subject 1> is a special-operations officer from <Picture 1>:
middle-aged East Asian male, stern face, helmet under his arm now, looking out the window.

<Subject 2> is the capital night street from <Picture 2>:
dark street below, thousands of tiny phone lights igniting.

summary:
Reference-based awakening of the city.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Shot-reverse: officer's face, then the city, then back.

[Shot 1]

00:00-00:06

Action:
The officer looks from Lin to the window. Below, the dark city answers the beacon: thousands of tiny phone lights flick on in windows and doorsteps, a constellation of quiet defiance. His finger finally eases off the trigger.

overall_soundscape:
City murmur rising, a soft sea of tiny sounds, projector hum.
No speech.

non_diegetic_music:
A faint rising major chord under the wind.
```

**參數**：`ref_image_0=output/ch9_officer_ref/zimage_00081_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=6, seed=490017, out=ch9_i17_video`

---

## I18 — 軍官垂槍回應（對白，8 秒）

**來源**：`story1.md` lines 541–543。

```
subject_definitions:
<Subject 1> is a special-operations officer from <Picture 1>:
middle-aged East Asian male, stern face gone quiet, rifle lowered, speaking into a communicator.

summary:
Reference-based stand-down.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on the officer as the rifle tip lowers.

[Shot 1]

00:00-00:08

Action:
The officer slowly lowers his rifle, presses the communicator to his mouth, and answers the order calmly, his mouth opening and closing clearly with every syllable, lips visibly articulating the Chinese words, camera holds his face.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
訊號不是我能關掉的。
長官，人民已經看到了。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Communicator hiss, his steady breath, room settling dust.
No other speech.

non_diegetic_music:
A low resolving tone.
```

**參數**：`ref_image_0=output/ch9_officer_ref/zimage_00081_.png, duration=8, seed=490018, out=ch9_i18_video`

---

## I19 — 雲幕續播卡拉卡斯（場景，6 秒）

**來源**：`story1.md` lines 545。

```
subject_definitions:
<Subject 1> is the cloud-sheet sky from <Picture 1>:
the glowing sky-screen now showing ruins.

<Subject 2> is grainy archival footage of the capital from <Picture 2>:
the last ruins of the fallen city, scraps of printed slogans blowing.

summary:
Reference-based closing image.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Wide shot of the sky-screen playing the ruins over the silent city.

[Shot 1]

00:00-00:06

Action:
The cloud-sheet runs on: the last ruins of Caracas, refugees clutching cash paper printed with slogans. In the projection the scraps tumble into the morning headline shape of the Aurora Federation (visible on-screen text).

overall_soundscape:
Projector hum, wind, film hiss under it.
No speech.

non_diegetic_music:
A slow elegiac string wash.
```

**參數**：`ref_image_0=output/ch9_sky_ref/zimage_00083_.png, ref_image_1=output/ch9_caracas_ref/zimage_00084_.png, duration=6, seed=490019, out=ch9_i19_video`

---

## I20 — 資訊的啟示錄（旁白，8 秒）

**來源**：`story1.md` lines 547–549。

```
subject_definitions:
<Subject 1> is the cloud-sheet sky over the capital from <Picture 1>:
a huge glowing sky-screen above a dark city, embers of projection light.

summary:
Reference-based closing narration.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.
No other speech.

detailed_description:

Visual style:
Very wide night vista of the city under the fading sky-screen.

[Shot 1]

00:00-00:08

Action:
The enormous cloud-curtain dims slowly over the awakening city; faint phone lights still glimmer below. Nothing else moves while the narrator delivers the closing judgment.

Narration:
<Narrator> says:

<d>
[中文]
這是一場資訊的啟示錄。
標籤的魔法在這一刻徹底失效。
當人們看到了深淵的底端，他們終於開始拒絕走向懸崖。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Wind, distant projector hum fading.

non_diegetic_music:
A slow rising string resolve.
```

**參數**：`ref_image_0=output/ch9_sky_ref/zimage_00083_.png, duration=8, seed=310000, out=ch9_i20_video`

---

## 四、字幕資料表（區塊順序、起始秒、逐字字幕）

> 時間為規劃秒（合併後以 scale=實際總長/169 換算，實際值於合併後回填）。旁白（I20）字幕包 `<i>…</i>`。
> 起始秒＝前序區塊累計時長：I0=0、I1=6、I2=14、I3=22、I4=28、I5=34、I6=42、I7=47、I8=54、I9=61、
> I10=73、I11=79、I12=84、I13=104、I14=109、I15=114、I16=123、I17=143、I18=149、I19=157、I20=163。

| # | 區塊 | 類型 | 秒 | 起始秒 | 字幕（逐字） |
|---|------|------|----|--------|--------------|
| 1 | I2 | 對白 | 8 | 14s | 林墨，你已經被包圍了。立刻交出非法取得的國家機密，否則我們將採取強制武裝行動。 |
| 2 | I4 | 對白 | 6 | 28s | 蘇菲。如果妳能收到這段訊號，幫我把權限全開。 |
| 3 | I7 | 對白 | 7 | 47s | 數據是騙人的，只有我們對主權的熱愛是真的。 |
| 4 | I9 | 對白 | 12 | 61s | 當人民發現麵包不夠時，就給他們更多的敵人。當他們發現口袋裡的錢沒用時，就告訴他們，這是因為反對派在操縱匯率。只要憤怒還在，我們的權力就還在。 |
| 5 | I11 | 對白 | 5 | 79s | 那就是我們的總統。 |
| 6 | I12 | 對白 | 20 | 84s | 這不是刺殺，這是錄像。各位國民，你們現在看到的，就是標籤政治的終點。索利亞不是死於外敵，而是死於這一張張被掩蓋的數據報表。赫德在索利亞實驗失敗了，所以他來到歐若拉，想要用更精密的斷網與標籤，再來一次。 |
| 7 | I15 | 對白 | 9 | 114s | 關掉它。林墨，立刻關掉它。那是偽造的。那是人工智慧合成的。 |
| 8 | I16 | 對白 | 20 | 123s | 總統閣下，您忘了嗎。那捲磁帶是類比訊號，那是十年前的技術，當時的人工智慧還沒辦法模擬那種磁帶特有的物理雜訊。長官，你可以開槍。但你沒辦法讓已經看過日出的人，假裝現在還是深夜。 |
| 9 | I18 | 對白 | 8 | 149s | 訊號不是我能關掉的。長官，人民已經看到了。 |
| 10 | I20 | 旁白 | 8 | 163s | `<i>`這是一場資訊的啟示錄。標籤的魔法在這一刻徹底失效。當人們看到了深淵的底端，他們終於開始拒絕走向懸崖。`</i>` |

> 字幕序即起始秒排序（10 條全部對白/旁白；擴音器 495、林墨 499/525/537、赫德年輕 509/517、老人 523、
> 赫德現任 533、軍官 543、旁白 547–549 全部入列，無遺漏）。

---

## 五、產出前自檢（I0–I20）

- [ ] 對白/旁白逐字對照 `story1.md` 第九章（lines 489–551），僅移除標點符號引號（`「」`、驚嘆號）、數字中文化、外源借詞中文化（AI→人工智慧），無省略、無自創。
- [ ] `<d>` 內被唸文字皆中文，無 `%`／阿拉伯數字／`「」『』`《》／冒號／刪節號／驚嘆號；每句獨立換行（QA Q2/Q3/Q4）。
- [ ] 對白區塊指名 `Only <Subject N> speaks`、排除旁白；旁白區塊（I20）畫面角色不開口，且**必須含 `Narration: <Narrator> says:`＋`<d>[中文]…</d>` 內容欄位**（G20 教訓）。
- [ ] `speaker_constraints` 皆排除 English / code-switching；錨點句含 `no English`（QA Q1/Q5）；`Action` 未複述台詞全文（QA Q3）。
- [ ] 說話鏡頭一律帶正向嘴部 cue（`mouth opening and closing clearly with every syllable`）（QA Q7）。
- [ ] 對白含稱謂直呼（總統閣下／長官）時，非說話者不入前景或嘴唇緊閉；`Action` 以名字鎖死張嘴者；畫外音區塊（I2 擴音器／I15 通訊器）明寫 `off-screen voice`、畫面角色不張嘴（QA Q8）。
- [ ] 畫面出現的角色一律配參考圖：I16 含軍官（對話稱謂＋背景身影），故修訂為 3 參考圖 `Ref-M+Ref-BROADCAST+Ref-OFFICER`（QA 畫面一致性）。
- [ ] 畫外音區塊的 `Action` 不得以命名身分指向畫面外角色（如 `staring at Lin`），否則模型會虛構該人物並把畫外對白套到他身上：I15 移除 `staring at Lin`、改為「軍官單人構圖＋視線出畫外」並明寫 `No other person appears in frame`（I15 教訓，對照 I2 結構）。
- [ ] 每支對白/旁白 `overall_soundscape` 帶台灣腔錨點句（含 `no English`）；seed 已對照黑名單，旁白用 310000；場景區塊無 `<d>`、無旁白暗示。
- [ ] 合併後以實際總長 scale=`實際總秒/169` 換算 SRT；旁白字幕包 `<i>...</i>`。

---

**參數速查**：共 21 支 r2v。對白/場景 seed `490000–490019`；旁白 I20 用 `310000`。輸出子目錄 `ch9_i*_video`。