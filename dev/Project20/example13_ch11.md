# Ch11 區塊獨立提示詞 — K0–K28（實作範例 13：第十一章「終極表決」）

> 本文件承接 `video_prompt_guide.md` QA Q1–Q9，以及 `example12_ch10.md`（J 系列）「資訊斷食」之收束，
> 完整產出**第十一章「終極表決」**的區塊分割、參考圖分配與全部 29 支 r2v 六欄位提示詞（K0–K28）。
>
> **章節功能**：《共識協議》最終修正案送進國會終極表決。國會大廳一反叫囂常態，安靜得只剩電子時鐘聲；
> 立委席螢幕不再顯示黨團指令，而是法案全文與即時跳動的「民意邏輯負擔」。林墨不帶演講稿、只帶一台舊筆電
> 走上發言台，以「社會信任餘額」與一連串預算／民意數據，論證要剝奪政府「形容」事實的權力。
> 親政府資深立委起身大聲質疑這是把政治變成機器人的遊戲，林墨回應政治是資源的分配所、不是感情的宣洩場。
> 表決燈亮起，全聯邦國民透過數據介面審視每一張票——每個立委的投票紀錄下即時顯示政治獻金來源與
> 選區數據透明度評分，民主三點零把投票變成「長期誠信的加總」。晨曦宮內赫德總統眼見大勢已去；
> 電子看板跳出 215／42／13，法槌落下，沒有掌聲，只有一聲長舒氣。議長宣布《共識協議》即刻生效；
> 林墨走出國會，蘇菲道「老師，我們贏了」，林墨卻提醒只是換了一套規則，更難的一關還在前面。
> 他轉頭看著正在刪除手機煽動軟體的國民：「走吧，還有最後一件事要做。」
> 情緒走向：肅穆靜默 → 數字論證 → 機器人遊戲之譏 → 邏輯反駁 → 透明表決 → 大勢已去 → 法槌落定 → 如釋重負 → 未完之役。
> 登場角色：林墨（沿用 Ref-M）、蘇菲（沿用 Ref-Sophie）、赫德總統（沿用 Ref-PRESIDENT）、
> **新建 3 張參考圖**：Ref-CONG 國會大廳議場全景、Ref-VET 親政府資深立委、Ref-SPK 國會議長（見 Step 1）。
>
> ⚠ **QA 應用**：對白一律移除 `「」『』`《》引號、冒號、分號、刪節號、驚嘆號；阿拉伯數字改中文數字
>（12%→百分之十二，40%→百分之四十，30%→百分之三十，3.0→三點零；電子看板 215／42／13 為非語音畫面數字，保留）；
> 對白句間以語法銜接為本（Q6）；說話鏡頭一律帶正向嘴部 cue（Q7）；
> 對白含稱謂直呼（林墨／老師）的區塊（K14/K25），被稱呼者不入前景、`Action` 明寫 `only <Subject N>'s mouth moves`（Q8）；
> 場景塊群像不寫任何口型（No on-screen mouth movement）。每句獨立換行；錨點句含 `no English`。
> **旁白區塊（K17/K19/K22）含 `Narration: <Narrator> says:`＋`<d>[中文]…</d>`**，
> `speaker_constraints` 寫「畫面角色不開口、僅固定旁白聲線」；旁白共用 seed `310000`。
> 長人物鏡頭（K6/K10/K12/K26）拆 `[Shot 1]/[Shot 2]`＋注入可動節點＋no-duplicate 負向條款（Q10）。

---

## 一、參考圖分配表

| 編號 | 角色/場景 | 來源路徑（應寫入 `ref_image_N`） | 主要區塊 |
|------|-----------|----------------------------------|----------|
| Ref-M | 林墨 | `output/ch1_beat13_ref_char/zimage_00008_.png` | K2,K3,K5,K6,K7,K9,K10,K11,K12,K15,K24,K26,K27,K28 |
| Ref-Sophie | 蘇菲（臉＋聲） | `output/ch3_sophie_ref/zimage_00021_.png` | K24,K25 |
| Ref-PRESIDENT | 赫德總統 | `output/ch5_president_ref/zimage_00048_.png` | K18,K19 |
| Ref-SCR | 電子螢幕／議場投影 | `output/ch6_screen_ref/zimage_00056_.png` | K1,K4,K8,K16,K17,K20 |
| Ref-STR | 首都街頭 | `output/ch6_street_ref/zimage_00057_.png` | K27 |
| Ref-NIGHT | 首都夜景 | `output/ch8_night_ref/zimage_00066_.png` | K24,K25,K26,K27,K28 |
| **Ref-CONG**（新建） | 國會大廳議場全景 | `output/ch11_cong_ref/zimage_00085_.png` | K0,K1,K2,K3,K5,K6,K7,K9,K10,K11,K12,K13,K14,K15,K16,K21,K22,K23 |
| **Ref-VET**（新建） | 親政府資深立委 | `output/ch11_vet_ref/zimage_00086_.png` | K13,K14 |
| **Ref-SPK**（新建） | 國會議長 | `output/ch11_spk_ref/zimage_00087_.png` | K23 |

---

## Step 1 新建參考圖（Z-Image Turbo，832×1248）

> 三張新圖皆為 Ch11 首製，先以 Z-Image Turbo 出圖、檢視合格後再供 K 區塊 r2v 使用（續 ch8_night_ref 為 00066 之後的編號）。

### Ref-CONG — 國會大廳議場全景（`output/ch11_cong_ref/zimage_00085_.png`）

```
832×1248 直立，Z-Image Turbo；單一難度中心＝空間縱深與對稱構圖；外觀錨點：冷調藍灰、大理石柱、電子時鐘。
「空曠肅穆的國會大廳全景，半圓形層疊議席一層層向主席高台收攏，高穹頂下大理石柱與冷調藍灰燈光，四周巨型電子螢幕與清晰的電子時鐘掛在牆上，空無一人，廣角對稱構圖，電影質感，無文字無標語」
```

### Ref-VET — 親政府資深立委（`output/ch11_vet_ref/zimage_00086_.png`）

```
832×1248 直立，Z-Image Turbo；單一難度中心＝人物半身肖像素描；外觀錨點：灰白梳理短髮、深色西裝、閉唇、雙手按桌。
「六十多歲東亞男性資深立委半身肖像，灰白梳理短髮，深色西裝，神情疲憊而不安，雙唇緊閉，雙手壓在議場桌面上，背後是模糊的藍灰色國會議席，冷調側光，電影質感」
```

### Ref-SPK — 國會議長（`output/ch11_spk_ref/zimage_00087_.png`）

```
832×1248 直立，Z-Image Turbo；單一難度中心＝人物半身肖像素描；外觀錨點：銀灰髮、深色禮服、木槌、主席高台。
「國會議長半身肖像，銀灰色梳理短髮，深色正裝禮服，面容蒼老而沉靜，端坐於主席高台，面前桌上放著一支深色木槌，背後是電子計票板的冷光，電影質感」
```

---

## 二、區塊總表（對白／旁白／場景分割）

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留氣口進位；場景按動作節拍。
> 規劃總長 ≈ **218s**；合併後 `scale = 實際總秒數 / 218` 換算字幕。

| 區塊 | 型別 | 秒 | 累積起點 | 內容 |
|------|------|----|---------|------|
| K0 | 場景 | 6s | 0s | 國會大廳定場 |
| K1 | 場景 | 6s | 6s | 立委席螢幕（共識協議＋民意邏輯負擔） |
| K2 | 場景 | 5s | 12s | 林墨走上發言台接舊筆電投影 |
| K3 | 對白 | 12s | 17s | 林墨：社會信任餘額（45字） |
| K4 | 場景 | 4s | 29s | 投影紅色警示條 |
| K5 | 對白 | 11s | 33s | 林墨：12% 預算（43字） |
| K6 | 對白 | 15s | 44s | 林墨：40%/30% 民意（57字，拆 Shot） |
| K7 | 對白 | 7s | 59s | 林墨：能源缺口（28字） |
| K8 | 場景 | 4s | 66s | 切換法案條文投影 |
| K9 | 對白 | 6s | 70s | 林墨：剝奪形容權（22字） |
| K10 | 對白 | 12s | 76s | 林墨：財政部/國防部規則（46字，拆 Shot） |
| K11 | 對白 | 11s | 88s | 林墨：贊成票的武器（44字） |
| K12 | 對白 | 12s | 99s | 林墨：賣國金流與行政點數（47字，拆 Shot） |
| K13 | 場景 | 6s | 111s | 資深立委站起 |
| K14 | 對白 | 8s | 117s | 資深立委：機器人的遊戲（31字） |
| K15 | 對白 | 11s | 125s | 林墨：政治是資源分配所（43字） |
| K16 | 場景 | 6s | 136s | 表決燈亮起 |
| K17 | 旁白 | 7s | 142s | 民主三點零透明性（31字） |
| K18 | 場景 | 6s | 149s | 赫德辦公室看螢幕 |
| K19 | 旁白 | 9s | 155s | 大勢已去，倒戈（45字） |
| K20 | 場景 | 5s | 164s | 電子看板 215/42/13 |
| K21 | 場景 | 6s | 169s | 法槌落下＋長舒氣 |
| K22 | 旁白 | 5s | 175s | 邏輯奪回失土（24字） |
| K23 | 對白 | 9s | 180s | 議長：表決通過（36字） |
| K24 | 場景 | 5s | 189s | 林墨走出國會，蘇菲等候 |
| K25 | 對白 | 2s | 194s | 蘇菲：老師，我們贏了（6字） |
| K26 | 對白 | 14s | 196s | 林墨：還沒（54字，拆 Shot） |
| K27 | 場景 | 5s | 210s | 林墨轉頭看刪煽動軟體的國民 |
| K28 | 對白 | 3s | 215s | 林墨：走吧（12字） |

全表 29 個區塊（場景 12、對白 14、旁白 3）；對白/場景 seed `492000–492028`（依序，旁白 K17/K19/K22 改 `310000`）。

---

## 三、完整提示詞

## K0 — 國會大廳定場（場景，6 秒）

```
subject_definitions:
<Subject 1> is the Congress Hall from <Picture 1>:
vast semicircular legislative chamber, tiered rows of benches, high vaulted ceiling, marble columns, cold blue-grey light, a giant electronic tally screen and an electronic clock above the dais.

summary:
Reference-based establishing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Very wide establishing shot of the congress hall, seats packed with silent legislators.

[Shot 1]

00:00-00:06

Action:
The congress hall is eerily quiet. Rows of legislators sit frozen, eyes fixed on the desk monitors showing the final version of the Consensus Agreement. The only motion is the electronic clock flipping its digits on the wall. The camera drifts slowly toward the speaker's podium. Nobody shouts, nobody pounds the desk.

overall_soundscape:
The faint click of an electronic clock, cold air circulation, strained silence. No speech.

non_diegetic_music:
A sparse, hollow low drone.
```

**參數**：`ref_image_0=output/ch11_cong_ref/zimage_00085_.png, duration=6, seed=492000, out=ch11_k0_video`

---

## K1 — 立委席螢幕（場景，6 秒）

```
subject_definitions:
<Subject 1> is the congress hall from <Picture 1>:
tiered rows of benches packed with silent legislators.

<Subject 2> is a desk monitor from <Picture 2>:
a compact screen showing a treaty passage and a live data readout labelled 民意邏輯負擔.

summary:
Reference-based insert shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Close-up of a desk monitor, then a slow pull-back to reveal rows of silent legislators.

[Shot 1]

00:00-00:06

Action:
A desk monitor fills the frame: the final passage of the Consensus Agreement, and beside it a live "civic logic burden" data readout ticking downward second by second. The camera pulls back slowly to reveal rows of silent legislators seated before identical screens. No party instructions, no banners. The room holds its breath.

overall_soundscape:
Soft monitor hum, the click of the electronic clock, rustle of fabric. No speech.

non_diegetic_music:
A single sustained drone note.
```

**參數**：`ref_image_0=output/ch11_cong_ref/zimage_00085_.png, ref_image_1=output/ch6_screen_ref/zimage_00056_.png, duration=6, seed=492001, out=ch11_k1_video`

---

## K2 — 林墨走上發言台（場景，5 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, steady gaze.

<Subject 2> is the speaker's podium from <Picture 2>:
a narrow podium at the centre of the semicircular chamber, facing the tiered benches and a large projector screen.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Medium shot tracking Lin as he walks to the podium and connects an old laptop to the projection system.

[Shot 1]

00:00-00:05

Action:
Lin steps up to the podium carrying no speech notes, only an old laptop. He sets the laptop down and plugs it into the hall's projector. The image blinks onto the giant screen behind him. He straightens, looks out across the silent chamber. He does not speak.

overall_soundscape:
Soft footsteps on the dais, the click of a cable connector, projector fan hum. No speech.

non_diegetic_music:
A dry, expectant string tremolo.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=5, seed=492002, out=ch11_k2_video`

---

## K3 — 林墨：社會信任餘額（對白，12 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium, calm.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, tiered benches full of silent legislators.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin at the podium, quiet authority in his face, the chamber a blurred mass behind him.

[Shot 1]

00:00-00:12

Action:
Lin speaks softly into the podium microphone; his quiet voice carries to every corner of the hall. He lifts his eyes, scanning the motionless rows. The legislators listen without a word. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
各位同事。今天我們不談論理想，不談論顏色，也不談論誰更愛歐若拉聯邦。我們只談論一組數字，社會信任餘額。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. Quiet but clear, a slight hollow reverb of the empty chamber.
Electronic clock, breath-held silence.

non_diegetic_music:
Low drone continues, thinning.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=12, seed=492003, out=ch11_k3_video`

---

## K4 — 投影紅色警示條（場景，4 秒）

```
subject_definitions:
<Subject 1> is a projector screen from <Picture 1>:
a huge screen showing a giant red warning bar labelled 社會信任餘額, its remaining level alarmingly low.

summary:
Reference-based insert shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Full-frame shot of the giant projection, the red warning bar dominating the picture.

[Shot 1]

00:00-00:04

Action:
On the giant projection, a huge red warning bar appears, its label reading 社會信任餘額, the remaining filled level far below the danger line. The bar trembles slightly as the numbers beneath it tick downward. No human face appears.

overall_soundscape:
A soft warning tone, projector hum, faint digital ticking. No speech.

non_diegetic_music:
A low alarm pulse, restrained.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, duration=4, seed=492004, out=ch11_k4_video`

---

## K5 — 林墨：12% 預算（對白，11 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, the giant projection glowing red behind the podium.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot of Lin from the chest up, the red projection faintly colouring the background.

[Shot 1]

00:00-00:11

Action:
Lin continues, his tone even, unhurried. He makes a small gesture toward the projection behind him, then returns both hands to the podium's edge. The chamber stays silent. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
在過去十年中，為了維持意識形態的熱度，政府平均每年耗費百分之十二的總預算在宣傳與資訊屏蔽上。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Projector hum, breath-held silence.

non_diegetic_music:
A measured, neutral string line.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=11, seed=492005, out=ch11_k5_video`

---

## K6 — 林墨：40%/30% 民意（對白，15 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium, voice growing firmer.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, the giant projection behind the podium showing rising poll fractions.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
Lin appears exactly once in frame. No duplicated figure. No split or mirrored composition.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin, then a slow lateral drift as he delivers the compound sentence.

[Shot 1]

00:00-00:07

Action:
Lin states the first clause, turning his head slightly toward the projection where the false-message fractions are rising. His hands rest still on the podium. Only Lin's mouth moves.

[Shot 2]

00:07-00:15

Action:
A slow push-in as Lin delivers the second clause, his brows drawing together over the final assertion. He holds the chamber's silence for a beat after the last word. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
這筆錢產生的結果是，當我們面臨真實的能源危機時，有百分之四十的國民認為那是政敵的謠言，有百分之三十的國民認為那是外敵的破壞。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Projector hum, faint clock click, dense silence.

non_diegetic_music:
A rhythmic low pulse building steady.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=15, seed=492006, out=ch11_k6_video`

---

## K7 — 林墨：能源缺口（對白，7 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, motionless rows of legislators.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Tight medium shot on Lin, his voice soft and tired for a moment.

[Shot 1]

00:00-00:07

Action:
Lin lets the previous numbers hang in the air, then delivers this sentence more softly. He lowers his gaze for an instant, then raises it again. The hall does not move. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
事實上，能源缺口是真實的，但我們已經失去了共同處理事實的能力。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Projector hum, cold air, silence.

non_diegetic_music:
A single falling piano note.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=7, seed=492007, out=ch11_k7_video`

---

## K8 — 切換法案條文（場景，4 秒）

```
subject_definitions:
<Subject 1> is a projector screen from <Picture 1>:
a huge screen switching from the red warning bar to plain legal clauses, scrolling text in neat rows.

summary:
Reference-based insert shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Full-frame shot of the projection as it switches display modes.

[Shot 1]

00:00-00:04

Action:
Lin's hand presses a key just out of frame. The projection switches from the red warning bar to the bill's actual clauses — plain legal text scrolling in neat rows, no slogans. The camera holds on the screen alone.

overall_soundscape:
A soft key click, projector hum, the rustle of a single page. No speech.

non_diegetic_music:
A clean, short digital chime.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, duration=4, seed=492008, out=ch11_k8_video`

---

## K9 — 林墨：剝奪形容權（對白，6 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, the projection now showing the bill's clauses.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin as he delivers the core clause, the projection behind him holding the bill's title.

[Shot 1]

00:00-00:06

Action:
Lin delivers this line with deliberate slowness, letting each phrase land. He gestures once at the projection, palm open. The chamber remains frozen. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
這部法案的核心只有一點，剝奪政府形容事實的權力。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Projector hum, held silence.

non_diegetic_music:
A resolved low chord.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=6, seed=492009, out=ch11_k9_video`

---

## K10 — 林墨：財政部/國防部規則（對白，12 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, the projection cycling through data-comparison charts.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
Lin appears exactly once in frame. No duplicated figure. No split or mirrored composition.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot on Lin; the first clause in close-up, the second clause with a slight rack of focus onto him from a wider angle.

[Shot 1]

00:00-00:06

Action:
Lin lays out the first rule, one hand raised as if reading from an invisible clause. The projection behind him switches to a purchasing-power curve. Only Lin's mouth moves.

[Shot 2]

00:06-00:12

Action:
A wider angle, Lin now with both hands resting on the podium. He finishes the second rule, chin lifting once at the final word. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
以後，當財政部說經濟增長時，必須同時顯示購買力折算曲線。而當國防部說受威脅時，必須顯示威脅來源的具體數據點。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Projector hum, faint data-chart beeps.

non_diegetic_music:
A thin, ticking rhythm.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=12, seed=492010, out=ch11_k10_video`

---

## K11 — 林墨：贊成票的武器（對白，11 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, rows of legislators listening in the dim blue light.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin, leaning slightly forward toward the rows of legislators.

[Shot 1]

00:00-00:11

Action:
Lin leans slightly forward, scanning the silent benches as he explains the consequence of a yes-vote. His delivery is flat, technical, almost clinical. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
如果你們投下贊成票，你們將失去用標籤攻擊對手的武器，因為你們的攻擊內容，會被系統自動進行事實檢索。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Projector hum, stillness.

non_diegetic_music:
A steady neutral pulse.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=11, seed=492011, out=ch11_k11_video`

---

## K12 — 林墨：賣國金流與行政點數（對白，12 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium, voice hardening.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, cool blue-grey air.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
Lin appears exactly once in frame. No duplicated figure. No split or mirrored composition.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Close-up building tension; a short medium push between the two clauses.

[Shot 1]

00:00-00:06

Action:
Lin states the first clause, voice hardening on the demand for a concrete money trail. He raises one finger for emphasis. Only Lin's mouth moves.

[Shot 2]

00:06-00:12

Action:
A slow push-in as Lin delivers the second clause about invalid data and administrative points. He lowers his hand and closes the line firmly. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
如果你們說對方賣國，系統會立刻要求你列出具體的金流路徑。否則該發言將被標註為無效數據，並扣除你的行政點數。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Projector hum, a held breath from the chamber.

non_diegetic_music:
A low sustained minor chord.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=12, seed=492012, out=ch11_k12_video`

---

## K13 — 資深立委站起（場景，6 秒）

```
subject_definitions:
<Subject 1> is the Senior Legislator from <Picture 1>:
East Asian man in his 60s, grey hair combed back, dark suit, hands pressed flat on the desk in front of him, mouth closed.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, cold blue-grey light, several benches rising in silhouette behind him.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Medium shot on the senior legislator rising from his seat; the chamber behind him, attention converging.

[Shot 1]

00:00-00:06

Action:
A pro-government senior legislator rises slowly from his seat. He steadies himself with both hands pressed on the desk, shoulders trembling once. Across the hall, heads turn toward him. He has not spoken yet — his mouth stays closed.

overall_soundscape:
The scrape of a chair, fabric shifting, several gasps swallowed. No speech.

non_diegetic_music:
A creaking, uneasy string.
```

**參數**：`ref_image_0=output/ch11_vet_ref/zimage_00086_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=6, seed=492013, out=ch11_k13_video`

---

## K14 — 資深立委：機器人的遊戲（對白，8 秒）

```
subject_definitions:
<Subject 1> is the Senior Legislator from <Picture 1>:
East Asian man in his 60s, grey hair combed back, dark suit, standing, voice trembling, hands gripping the desk edge.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, blurred benches behind him. The addressed Lin Mo stands across the hall, outside the foreground.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. The addressed 林墨 does not appear in the foreground and his mouth is not visible. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on the senior legislator's agitated face, grey hair catching the cold light.

[Shot 1]

00:00-00:08

Action:
The senior legislator's voice shakes as he throws the accusation toward the distant podium. His hands grip the desk edge, knuckles whitening. Lin, far across the hall, stands outside the foreground and never appears in close-up. Only the Senior Legislator's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
林墨，你這是要把政治變成機器人的遊戲。人類的社會是有感情的，是有立場的。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. A trembling, half-shouting voice with chamber echo.
Chair scrape, murmurs rising then falling.

non_diegetic_music:
A dissonant rising chord.
```

**參數**：`ref_image_0=output/ch11_vet_ref/zimage_00086_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=8, seed=492014, out=ch11_k14_video`

---

## K15 — 林墨：政治是資源分配所（對白，11 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at the podium, unperturbed.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, the standing senior legislator a small figure in the mid-ground.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin answering calmly, hands folded on the podium.

[Shot 1]

00:00-00:11

Action:
Lin answers without raising his voice, calm and flat, in direct reply to the accusation that has just been thrown at him. He keeps his hands folded on the podium and meets the hall without blinking. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
政治不應該是感情的宣洩場，而是資源的分配所。感情留給藝術和家庭，但公帑的使用，必須接受邏輯的審判。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. Steady, unhurried.
Projector hum, dense silence.

non_diegetic_music:
A resolved, quiet string line.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=11, seed=492015, out=ch11_k15_video`

---

## K16 — 表決燈亮起（場景，6 秒）

```
subject_definitions:
<Subject 1> is the Congress Hall from <Picture 1>:
vast semicircular chamber, rows of vote lamps along each bench of desks.

<Subject 2> is a live tally screen from <Picture 2>:
a national vote grid filling with electrons of light.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Wide shot as the chamber lights ignite, followed by a cut to the national vote grid.

[Shot 1]

00:00-00:06

Action:
The vote lamps ignite row by row along the desks, a ripple of light sweeping the semicircular chamber. Cut to the giant national screen showing a live vote grid filling with light — every legislator's row streaming their funding source and district transparency score beneath. No one speaks.

overall_soundscape:
A rising electrical hum as the lamps ignite, a faint resonance of screens waking. No speech.

non_diegetic_music:
A growing swell, held back from climax.
```

**參數**：`ref_image_0=output/ch11_cong_ref/zimage_00085_.png, ref_image_1=output/ch6_screen_ref/zimage_00056_.png, duration=6, seed=492016, out=ch11_k16_video`

---

## K17 — 民主三點零透明性（旁白，7 秒）

```
subject_definitions:
<Subject 1> is a national vote interface from <Picture 1>:
each legislator's vote row with a live transparency column beneath — past donation sources and a district data score.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.
No other speech.

detailed_description:

Visual style:
Full-frame close-up of the national vote interface, columns streaming in real time.

[Shot 1]

00:00-00:07

Action:
On the national vote interface, every legislator's row automatically reveals their past political donation sources and their district's data transparency score. Columns re-sort and stream as votes arrive, while the narrator explains. No human face appears.

Narration:
<Narrator> says:

<d>
[中文]
這就是民主三點零的透明性。投票不再是孤立的選擇，而是長期誠信的加總。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Efficient data-stream ticks.

non_diegetic_music:
A precise, quiet electronic pulse.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, duration=7, seed=310000, out=ch11_k17_video`

---

## K18 — 赫德辦公室看螢幕（場景，6 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, sitting at a desk in a dimly lit office before a screen.

summary:
Reference-based establishing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Wide shot of the dim office, the president fixed on the glowing screen, dead monitors around him dark.

[Shot 1]

00:00-00:06

Action:
The president sits motionless before a single screen showing the live vote, the flicker of the tally numbers reflected in his unblinking eyes. Around him the monitor wall stays dark. He does not speak. He does not move.

overall_soundscape:
The hum of one active monitor, the far-off click of the electronic clock, wind against glass. No speech.

non_diegetic_music:
A deep, hollow drone.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, duration=6, seed=492018, out=ch11_k18_video`

---

## K19 — 大勢已去，倒戈（旁白，9 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, slumped at his desk before the live tally screen.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement. The president remains silent.
No other speech.

detailed_description:

Visual style:
Slow push-in on the president's gaunt face, the tally numbers clicking higher in the reflected glow.

[Shot 1]

00:00-00:09

Action:
The president watches the numbers climb against him, his jaw tight. Dust drifts through the pale screen light. He accepts what is happening without moving, lips sealed. The narrator delivers the lines while his reflection lies still.

Narration:
<Narrator> says:

<d>
[中文]
他知道，大勢已去，因為當人民不再被他的形容詞所煽動，當立委們發現標籤不再能換取選票時，他們就會倒戈。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Monitor hum, wind outside, the clock's tick.

non_diegetic_music:
A slow descending string.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, duration=9, seed=310000, out=ch11_k19_video`

---

## K20 — 電子看板 215/42/13（場景，5 秒）

```
subject_definitions:
<Subject 1> is an electronic tally board from <Picture 1>:
a large scoreboard showing live vote totals in large numerals.

summary:
Reference-based insert shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Full-frame close-up of the electronic tally board, numerals jumping.

[Shot 1]

00:00-00:05

Action:
On the electronic tally board the numbers settle one by one: 贊成 215, 反對 42, 棄權 13. The digits hold still for a long beat. The camera holds on the frozen tally as the chamber's breath catches. No human face appears.

overall_soundscape:
The final clicks of the tally digits, a rising collective silence. No speech.

non_diegetic_music:
A long held chord, waiting.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, duration=5, seed=492020, out=ch11_k20_video`

---

## K21 — 法槌落下＋長舒氣（場景，6 秒）

```
subject_definitions:
<Subject 1> is the Congress Hall from <Picture 1>:
vast semicircular chamber after the tally, a presiding dais bearing a wooden gavel in the mid-ground.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Close on the gavel, then a slow wide pan across the silent chamber.

[Shot 1]

00:00-00:06

Action:
The gavel falls once with a dry knock. No applause follows — instead a long, collective exhale rolls through the chamber, shoulders dropping row by row, the tension breaking in silence. The camera pans slowly across the seated legislators as the breath passes over them.

overall_soundscape:
One sharp knock of the gavel, then the long sound of many people exhaling at once, a few quiet sobs swallowed. No distinct speech.

non_diegetic_music:
None. The exhale itself carries the beat.
```

**參數**：`ref_image_0=output/ch11_cong_ref/zimage_00085_.png, duration=6, seed=492021, out=ch11_k21_video`

---

## K22 — 邏輯奪回失土（旁白，5 秒）

```
subject_definitions:
<Subject 1> is the Congress Hall from <Picture 1>:
vast semicircular chamber settling into silence after the tally, rows of legislators still seated.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.
No other speech.

detailed_description:

Visual style:
A slow pan across the hall's quiet rows, the weight of the moment.

[Shot 1]

00:00-00:05

Action:
The chamber lies in a dense silence after the exhale. The camera drifts across the seated rows, past still faces and folded hands. The narrator closes the chapter motif over this stillness. No one speaks, no one moves.

Narration:
<Narrator> says:

<d>
[中文]
這不是某個政黨的勝利，而是邏輯在這座島嶼上奪回了失土。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Cold air, the click of the electronic clock, distant ventilation.

non_diegetic_music:
A spare major chord, quietly resolved.
```

**參數**：`ref_image_0=output/ch11_cong_ref/zimage_00085_.png, duration=5, seed=310000, out=ch11_k22_video`

---

## K23 — 議長：表決通過（對白，9 秒）

```
subject_definitions:
<Subject 1> is the Speaker from <Picture 1>:
silver-haired chairperson in formal dress, seated at the presiding dais, a wooden gavel resting before him, weariness in his face.

<Subject 2> is the Congress Hall from <Picture 2>:
vast semicircular chamber, silent rows before the dais.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot of the speaker at the dais, the hall a quiet depth behind him.

[Shot 1]

00:00-00:09

Action:
The speaker reads the announcement in a tone of exhausted relief, eyes closing briefly between phrases, then resting on the distant rows. He does not raise his voice. Only the Speaker's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
表決通過。共識協議即刻生效。行政院所有宣傳預算凍結，並移交資訊仲裁委員會重新分配。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. Old, tired, relieved.
Chamber echo, held silence.

non_diegetic_music:
A low, warm resolve in the strings.
```

**參數**：`ref_image_0=output/ch11_spk_ref/zimage_00087_.png, ref_image_1=output/ch11_cong_ref/zimage_00085_.png, duration=9, seed=492023, out=ch11_k23_video`

---

## K24 — 林墨走出國會，蘇菲等候（場景，5 秒）

```
subject_definitions:
<Subject 1> is the night outside the congress from <Picture 1>:
a night street, clouds parting overhead to reveal starlight, city glow in the distance.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, walking out of a doorway.

<Subject 3> is Sophie from <Picture 3>:
young East Asian woman, dark hair, hopeful expression, standing by the entrance.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Wide shot of the congress entrance at night, Lin emerging as Sophie waits, clouds parting overhead.

[Shot 1]

00:00-00:05

Action:
Lin walks out of the congress entrance into the night air. Sophie stands waiting by the door, looking up at the sky where the clouds are parting to reveal long-hidden starlight. They meet each other's gaze in silence. Neither speaks.

overall_soundscape:
Night wind, distant traffic, the sigh of the door closing. No speech.

non_diegetic_music:
A gentle string resolve, opening out.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_2=output/ch3_sophie_ref/zimage_00021_.png, duration=5, seed=492024, out=ch11_k24_video`

---

## K25 — 蘇菲：老師，我們贏了（對白，2 秒）

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
young East Asian woman, dark hair, a small warm smile, standing under the starlit night sky.

<Subject 2> is the night sky from <Picture 2>:
parting clouds revealing scattered starlight above the city.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. The addressed 林墨 stands outside the foreground, his mouth not visible. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Sophie's face lifted toward the stars, then dropping to Lin off-frame.

[Shot 1]

00:00-00:02

Action:
Sophie looks up at the sky where the clouds have parted, then turns to the Lin beside her — outside the foreground — and says the two words with a small exhausted smile of relief. Only Sophie's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
老師，我們贏了。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. Soft, almost a whisper.
Night wind, a distant car.

non_diegetic_music:
A single bright piano note.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=2, seed=492025, out=ch11_k25_video`

---

## K26 — 林墨：還沒（對白，14 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing on the night street, calm but serious.

<Subject 2> is the night street from <Picture 2>:
a quiet street under parting clouds, city lights steady in the distance.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. The addressed 蘇菲 stands outside the foreground, her mouth not visible. No on-screen mouth movement from any other person.
Lin appears exactly once in frame. No duplicated figure. No split or mirrored composition.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close on Lin shaking his head, then a slow drift to a slightly wider two-beat of the quiet street behind him.

[Shot 1]

00:00-00:07

Action:
Lin shakes his head once, gently, correcting the victory with a tired small smile. He speaks to Sophie, who stands outside the foreground. His voice is low. Only Lin's mouth moves.

[Shot 2]

00:07-00:14

Action:
Lin looks past the street as he finishes the sentence, the night and starlight behind him. He speaks the closing lines without breaking his stride of calm. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
還沒。我們只是換了一套規則。接下來，我們要面對的是更難的一關，學會在這個安靜、枯燥且講求證據的世界裡，重新找回生活的意義。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. Quiet, deliberate.
Night wind, faint city hum.

non_diegetic_music:
A slow, thoughtful piano line.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=14, seed=492026, out=ch11_k26_video`

---

## K27 — 林墨轉頭看刪煽動軟體的國民（場景，5 秒）

```
subject_definitions:
<Subject 1> is a night street from <Picture 1>:
citizens standing under streetlights, deleting apps from their phones.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, turning to look off-frame.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Medium shot of Lin turning; a cut to citizens on the street deleting apps, lit softly by phone glow.

[Shot 1]

00:00-00:05

Action:
Lin turns to watch the citizens on the night street. Around them, phones glow as people quietly remove the incitement apps one by one, screens going dark. No one cheers. No one speaks. A wordless moment of private reckoning.

overall_soundscape:
The soft taps of fingers deleting apps, night wind, a distant generator. No speech.

non_diegetic_music:
A spare, warm acoustic note.
```

**參數**：`ref_image_0=output/ch6_street_ref/zimage_00057_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=5, seed=492027, out=ch11_k27_video`

---

## K28 — 林墨：走吧（對白，3 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, taking a step forward.

<Subject 2> is the night street from <Picture 2>:
a quiet street under clearing sky, starlight and distant city lights.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. The addressed 蘇菲 stands outside the foreground, her mouth not visible. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot of Lin beginning to walk, the night street before him.

[Shot 1]

00:00-00:03

Action:
Lin takes a first step forward into the night, then half-turns to call the final line back to Sophie, who stands outside the foreground. His voice is quiet and resolved. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
走吧，還有最後一件事要做。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. Quiet, forward-moving.
Night wind, footsteps on pavement.

non_diegetic_music:
A rising resolve, cut off before the answer comes.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=3, seed=492028, out=ch11_k28_video`

---

## 四、字幕資料表（區塊順序、起始秒、逐字字幕）

> 以下為 SRT 產出的逐字依據，時間軸待合併後以 `scale = 實際秒數 / 218` 換算。
> 旁白 K17/K19/K22 包 `<i>…</i>`；其餘為普通字幕。

| # | 區塊 | 字幕文字 |
|---|------|----------|
| 1 | K3 | 各位同事。今天我們不談論理想，不談論顏色，也不談論誰更愛歐若拉聯邦。我們只談論一組數字，社會信任餘額。 |
| 2 | K5 | 在過去十年中，為了維持意識形態的熱度，政府平均每年耗費百分之十二的總預算在宣傳與資訊屏蔽上。 |
| 3 | K6 | 這筆錢產生的結果是，當我們面臨真實的能源危機時，有百分之四十的國民認為那是政敵的謠言，有百分之三十的國民認為那是外敵的破壞。 |
| 4 | K7 | 事實上，能源缺口是真實的，但我們已經失去了共同處理事實的能力。 |
| 5 | K9 | 這部法案的核心只有一點，剝奪政府形容事實的權力。 |
| 6 | K10-1 | 以後，當財政部說經濟增長時，必須同時顯示購買力折算曲線。 |
| 7 | K10-2 | 而當國防部說受威脅時，必須顯示威脅來源的具體數據點。 |
| 8 | K11 | 如果你們投下贊成票，你們將失去用標籤攻擊對手的武器，因為你們的攻擊內容，會被系統自動進行事實檢索。 |
| 9 | K12 | 如果你們說對方賣國，系統會立刻要求你列出具體的金流路徑。否則該發言將被標註為無效數據，並扣除你的行政點數。 |
| 10 | K14 | 林墨，你這是要把政治變成機器人的遊戲。人類的社會是有感情的，是有立場的。 |
| 11 | K15 | 政治不應該是感情的宣洩場，而是資源的分配所。感情留給藝術和家庭，但公帑的使用，必須接受邏輯的審判。 |
| 12 | K17 | <i>這就是民主三點零的透明性。投票不再是孤立的選擇，而是長期誠信的加總。</i> |
| 13 | K19 | <i>他知道，大勢已去，因為當人民不再被他的形容詞所煽動，當立委們發現標籤不再能換取選票時，他們就會倒戈。</i> |
| 14 | K22 | <i>這不是某個政黨的勝利，而是邏輯在這座島嶼上奪回了失土。</i> |
| 15 | K23 | 表決通過。共識協議即刻生效。行政院所有宣傳預算凍結，並移交資訊仲裁委員會重新分配。 |
| 16 | K25 | 老師，我們贏了。 |
| 17 | K26 | 還沒。我們只是換了一套規則。接下來，我們要面對的是更難的一關，學會在這個安靜、枯燥且講求證據的世界裡，重新找回生活的意義。 |
| 18 | K28 | 走吧，還有最後一件事要做。 |

---

## 五、產出前自檢（K0–K28）

- [ ] **K0**：Ref-CONG；場景無對白；seed=492000。OK。
- [ ] **K1**：Ref-CONG + Ref-SCR；場景無對白；seed=492001。OK。
- [ ] **K2**：Ref-M + Ref-CONG；場景無對白；seed=492002。OK。
- [ ] **K3**：Ref-M + Ref-CONG；45字÷4=12秒；`only <Subject 1>'s mouth moves`；seed=492003。OK。
- [ ] **K4**：Ref-SCR；場景無對白；seed=492004。OK。
- [ ] **K5**：Ref-M + Ref-CONG；43字÷4=11秒；seed=492005。OK。
- [ ] **K6**：Ref-M + Ref-CONG；57字÷4=15秒；拆 [Shot 1]/[Shot 2]＋可動節點＋no-duplicate（Q10）；seed=492006。OK。
- [ ] **K7**：Ref-M + Ref-CONG；28字÷4=7秒；seed=492007。OK。
- [ ] **K8**：Ref-SCR；場景無對白；seed=492008。OK。
- [ ] **K9**：Ref-M + Ref-CONG；22字÷4=6秒；seed=492009。OK。
- [ ] **K10**：Ref-M + Ref-CONG；46字÷4=12秒；拆 [Shot 1]/[Shot 2]（Q10）；字幕拆 K10-1/K10-2；seed=492010。OK。
- [ ] **K11**：Ref-M + Ref-CONG；44字÷4=11秒；seed=492011。OK。
- [ ] **K12**：Ref-M + Ref-CONG；47字÷4=12秒；拆 [Shot 1]/[Shot 2]（Q10）；seed=492012。OK。
- [ ] **K13**：Ref-VET + Ref-CONG；場景無對白；seed=492013。OK。
- [ ] **K14**：Ref-VET + Ref-CONG；31字÷4=8秒；直呼「林墨」（Q8）：林墨不入前景、Action 明寫 only 資深立委張嘴；seed=492014。OK。
- [ ] **K15**：Ref-M + Ref-CONG；43字÷4=11秒；seed=492015。OK。
- [ ] **K16**：Ref-CONG + Ref-SCR；場景無對白；seed=492016。OK。
- [ ] **K17**：旁白；Ref-SCR；31字÷5=7秒；seed=310000。OK。
- [ ] **K18**：Ref-PRESIDENT；場景無對白；seed=492018。OK。
- [ ] **K19**：旁白；Ref-PRESIDENT；45字÷5=9秒；seed=310000。OK。
- [ ] **K20**：Ref-SCR；場景無對白；畫面數字 215/42/13 屬非語音，保留；seed=492020。OK。
- [ ] **K21**：Ref-CONG；場景無對白；seed=492021。OK。
- [ ] **K22**：旁白；Ref-CONG；24字÷5=5秒；seed=310000。OK。
- [ ] **K23**：Ref-SPK + Ref-CONG；36字÷4=9秒；`only <Subject 1>'s mouth moves`；seed=492023。OK。
- [ ] **K24**：Ref-NIGHT + Ref-M + Ref-Sophie；場景無對白；seed=492024。OK。
- [ ] **K25**：Ref-Sophie + Ref-NIGHT；6字÷4=2秒；直呼「老師」（Q8）：林墨不入前景、only 蘇菲張嘴；seed=492025。OK。
- [ ] **K26**：Ref-M + Ref-NIGHT；54字÷4=14秒；拆 [Shot 1]/[Shot 2]（Q10）；「我們」無稱謂直呼；seed=492026。OK。
- [ ] **K27**：Ref-STR + Ref-M；場景無對白；seed=492027。OK。
- [ ] **K28**：Ref-M + Ref-NIGHT；12字÷4=3秒；seed=492028。OK。

### QA 應用總檢查

- [ ] Q1：對白無「」、無冒號、無分號、無刪節號、無驚嘆號。OK。
- [ ] Q2：無引號括引（法案條文皆以普通陳述）。OK。
- [ ] Q5：對白阿拉伯數字中文化（百分之十二/百分之四十/百分之三十/民主三點零）；215/42/13 為畫面數字非語音，保留。OK。
- [ ] Q6：K3/K6/K10/K12 長句以語法銜接（、而／因為／否則）。OK。
- [ ] Q7：所有對白區塊 `only <Subject N>'s mouth moves`。OK。
- [ ] Q8：K14 資深立委直呼「林墨」、K25 蘇菲直呼「老師」；被稱呼者不入前景、Action 明寫僅說話者張嘴。OK。
- [ ] Q9：無 off-screen 語音需求；議場群像不寫口型。OK。
- [ ] Q10：K6/K10/K12/K26 長人物鏡頭拆 [Shot 1]/[Shot 2]＋可動節點＋no-duplicate 負向條款。OK。

---

> 全表 29 個區塊（場景 12、對白 14、旁白 3）；合計 ≈ 218 秒。
> 規劃 seed 對白/場景 `492000–492028`（依序，旁白 K17/K19/K22 跳用）、旁白 `310000`。
> 下一步：先依 Step 1 產出 Ref-CONG／Ref-VET／Ref-SPK 三張參考圖，再逐支提交 r2v 生成，確認渲染結果後合併為 `ch11_full`。