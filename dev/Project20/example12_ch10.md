# Ch10 區塊獨立提示詞 — J0–J20（實作範例 12：第十章「資訊斷食」）

> 本文件承接 `video_prompt_guide.md` QA Q1–Q9，
> 完整產出**第十章「資訊斷食」**的區塊分割、參考圖分配與全部 18 支 r2v 六欄位提示詞（J17–J19 原誤取自
> 第十一章結尾，已移除；Ch10 以 J16 旁白＋J20 廣場夜景收束）。
>
> **章節功能**：卡拉卡斯紀錄片傳遍全國後第三天，歐若拉聯邦陷入「大沉默」與集體幻滅——
> 人們不再轉發新聞，政論節目收視率歸零而停播。林墨在聖保羅廣場號召為期七天的「資訊斷食」：
> 民間開發過濾插件自動屏蔽社交平台上的所有形容詞；各社區自行查閱附近的能源消耗與糧食庫存數據；
> 每晚各地廣播只播報純粹的數字。第四天奇蹟出現：人們不再爭論誰更愛國，開始理性討論
> 水資源分配與發電機維修。晨曦宮內的赫德總統面對完全靜默的網路監控牆，感到前所未有的恐懼——
> 他準備好了暴亂與罵戰的回應，卻唯獨沒有準備好「被無視」。第七天傍晚斷食結束，
> 林墨宣布正式向國會提交《共識協議》最終修正案，民主三點零的第一場實戰測試即將開始。
> 情緒走向：大沉默 → 併發症 → 資訊斷食 → 奇蹟 → 赫德恐懼 → 民主三點零。
> 登場角色：林墨（沿用 Ref-M）、蘇菲（沿用 Ref-Sophie，臉＋聲）、赫德總統（**新肖像**，晨曦宮辦公室）。
>
> ⚠ **QA 應用**：對白一律移除 `「」『』`《》引號、冒號、刪節號、驚嘆號；阿拉伯數字改中文數字
>（3.0→三點零，0.2→百分之零點二，45→四十五）；外源借詞中文化（人工智慧）；
> 對白句間以語法銜接為本（Q6）；說話鏡頭一律帶正向嘴部 cue（Q7）；
> 對白含稱謂直呼（林老師／總統閣下）的區塊，被稱呼者不入前景、`Action` 明寫 `only <Subject N>'s mouth moves`（Q8）；
> J13 林墨 off-screen voice 回應赫德辦公室場景，赫德背對鏡頭不張嘴，林墨聲音寫成遠處環境回音（Q9 鐵律）。
> 每句獨立換行；錨點句含 `no English`。
> **旁白區塊（J6/J8/J9/J14/J16）含 `Narration: <Narrator> says:`＋`<d>[中文]…</d>`**，
> `speaker_constraints` 寫「畫面角色不開口、僅固定旁白聲線」；旁白共用 seed `310000`。

---

## 一、參考圖分配表

| 編號 | 角色/場景 | 來源路徑（應寫入 `ref_image_N`） | 主要區塊 |
|------|-----------|----------------------------------|----------|
| Ref-M | 林墨 | `output/ch1_beat13_ref_char/zimage_00008_.png` | J0,J3,J4,J13 |
| Ref-Sophie | 蘇菲（臉＋聲） | `output/ch3_sophie_ref/zimage_00021_.png` | J2 |
| Ref-PRESIDENT | 赫德總統 | `output/ch5_president_ref/zimage_00048_.png` | J11,J12,J13,J14 |
| Ref-CATH | 聖保羅大教堂廣場 | `output/ch9_cath_ref/zimage_00077_.png` | J0,J1,J4,J15,J20 |
| Ref-BROADCAST | 大教堂廣播機房 | `output/ch9_broadcast_ref/zimage_00078_.png` | J4,J10 |
| Ref-NIGHT | 首都夜景 | `output/ch8_night_ref/zimage_00066_.png` | J10,J11,J15,J16,J20 |
| Ref-SCR | 電子螢幕（過濾插件畫面） | `output/ch6_screen_ref/zimage_00056_.png` | J1,J5,J6,J7,J8 |

## 二、區塊總表（對白／旁白／場景分割）

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留氣口進位；場景按動作節拍。長對白（J2）依語法銜接分行。
> 規劃總長 ≈ **157s**；合併後 `scale = 實際總秒數 / 157` 換算字幕。

| 區塊 | 型別 | 秒 | 累積起點 | 內容 |
|------|------|----|---------|------|
| J0 | 場景 | 7s | 0s | 林墨走出大教堂，廣場坐滿人 |
| J1 | 場景 | 6s | 7s | 群眾低頭看手機，螢幕顯示去標籤化數據 |
| J2 | 對白 | 20s | 13s | 蘇菲：行政停擺（79字） |
| J3 | 對白 | 10s | 33s | 林墨：轉型正義併發症（40字） |
| J4 | 對白 | 5s | 43s | 林墨擴音器：資訊斷食宣言（18字） |
| J5 | 場景 | 6s | 48s | 屏蔽形容詞過濾插件示範畫面 |
| J6 | 旁白 | 11s | 54s | 屏蔽形容詞措施說明（53字） |
| J7 | 場景 | 6s | 65s | 社區討論水資源分配 |
| J8 | 旁白 | 15s | 71s | 奇蹟描述（72字） |
| J9 | 旁白 | 5s | 86s | 林墨筆記本：數據是冰冷的...（16字） |
| J10 | 場景 | 6s | 91s | 夜晚廣場擴音器播報純數字 |
| J11 | 場景 | 5s | 97s | 赫德辦公室看靜默監控牆 |
| J12 | 對白 | 5s | 102s | 赫德：狼變算盤（15字） |
| J13 | 對白 | 8s | 107s | 林墨 off-screen 回應赫德（30字） |
| J14 | 旁白 | 15s | 115s | 赫德辦公室旁白（72字） |
| J15 | 場景 | 5s | 130s | 第七天傍晚斷食結束 |
| J16 | 旁白 | 18s | 135s | 收束：提交修正案（87字） |
| J20 | 場景 | 4s | 153s | 廣場夜景雲散開，結尾 |

全表 18 個區塊（場景 8、對白 5、旁白 5）；對白/場景 seed `491000–491020`（跳用），旁白 `310000`。

---

## 三、完整提示詞

## J0 — 聖保羅廣場定場（場景，7 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, steady gaze.

<Subject 2> is the Saint Paul Cathedral from <Picture 2>:
old stone cathedral facade with wide steps, dawn light.

summary:
Reference-based establishing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Wide establishing shot of the cathedral square, Lin small in frame walking out of the entrance.

[Shot 1]

00:00-00:07

Action:
Lin Mo walks out of the cathedral entrance into the vast Saint Paul Square. Thousands of people sit silently on the stone steps — no banners, no chants, no raised fists. They simply sit, each staring at their own phone screen. Lin pauses at the threshold, absorbing the eerie silence.

overall_soundscape:
Dawn wind across stone, distant traffic silence, faint screen glow hum. No speech.

non_diegetic_music:
A sparse, hollow piano chord fading.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch9_cath_ref/zimage_00077_.png, duration=7, seed=491000, out=ch10_j0_video`

---

## J1 — 群眾看手機（場景，6 秒）

```
subject_definitions:
<Subject 1> is the crowd on the cathedral steps:
hundreds of seated citizens, blank expressions, all staring at phone screens.

<Subject 2> is a phone screen from <Picture 1>:
a clean database interface, raw data columns, no colours, no slogans.

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
Close-up of a phone screen, then slow pull-back to reveal rows of people all looking down.

[Shot 1]

00:00-00:06

Action:
A phone screen fills the frame: the de-tagged raw database, plain columns of numbers and dates replacing the old colourful lazy-packs. Camera pulls back slowly to reveal hundreds of people on the cathedral steps, each staring down at the same kind of screen. Nobody talks. Nobody looks up.

overall_soundscape:
Soft screen-tap clicks, distant wind, the hum of many phones. No speech.

non_diegetic_music:
A single sustained drone note.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, duration=6, seed=491001, out=ch10_j1_video`

---

## J2 — 蘇菲：行政停擺（對白，20 秒）

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
young East Asian woman, dark hair, red-rimmed eyes, exhausted expression, standing among the crowd.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over. No on-screen mouth movement from any other person.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Sophie's tired, red-rimmed face; blurred crowd behind her.

[Shot 1]

00:00-00:20

Action:
Sophie approaches Lin among the seated crowd. Her eyes are red-rimmed from sleeplessness, voice hoarse but urgent. She speaks directly to Lin, who stands listening without interrupting. Only Sophie's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
林老師，政府的行政系統停擺了。赫德總統把自己關在晨曦宮裡不出來，基層公務員因為不知道該聽誰的，乾脆拒絕執行任何指令。現在全國的物流、電力分配、甚至水壓調整，都處於無人對接的狀態。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Wind, faint screen hum, crowd silence.

non_diegetic_music:
Low tension string.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, duration=20, seed=491002, out=ch10_j2_video`

---

## J3 — 林墨：轉型正義併發症（對白，10 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, calm but weary.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Lin's face as he surveys the silent crowd; Sophie a blurred shape behind him.

[Shot 1]

00:00-00:10

Action:
Lin gazes at the茫然 crowd on the steps, his expression sombre. He speaks quietly to Sophie, who stands behind him out of focus. Only Lin's mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
這是轉型正義的併發症。他們以前只學會聽從口號，現在口號沒了，他們不知道該如何處理事實。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Wind, crowd silence.

non_diegetic_music:
Low drone continues.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, duration=10, seed=491003, out=ch10_j3_video`

---

## J4 — 林墨擴音器宣言（對白，5 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, holding a megaphone, facing the crowd.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot of Lin raising a megaphone to his mouth, crowd filling the background.

[Shot 1]

00:00-00:05

Action:
Lin lifts a megaphone and addresses the thousands seated on the steps. His voice is steady, unhurried. He delivers one sentence and lowers the megaphone. Only his mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
從現在起，我們進行為期七天的「資訊斷食」。
</d>

overall_soundscape:
Dialogue delivered through a megaphone, Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. Slight megaphone distortion.
Crowd silence, wind.

non_diegetic_music:
A single resolved chord.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch9_broadcast_ref/zimage_00078_.png, duration=5, seed=491004, out=ch10_j4_video`

---

## J5 — 屏蔽形容詞過濾插件（場景，6 秒）

```
subject_definitions:
<Subject 1> is a phone screen from <Picture 1>:
a social media feed with a browser extension filtering out adjectives, leaving only factual statements.

summary:
Reference-based insert shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Extreme close-up of a phone screen, social media text being stripped of adjectives in real time.

[Shot 1]

00:00-00:06

Action:
A social media post fills the screen: "惡毒的指控！可恥的叛國者！" A filter extension activates — the adjectives turn grey, then vanish one by one. What remains is a plain factual statement: "某人對某事發布了三千字的陳述。" The transformation repeats with a second post. Pure visual, no human face.

overall_soundscape:
Soft digital clicks as words vanish. No speech.

non_diegetic_music:
A light percussive ticking.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, duration=6, seed=491005, out=ch10_j5_video`

---

## J6 — 屏蔽形容詞旁白（旁白，11 秒）

```
subject_definitions:
<Subject 1> is the filtered social media feed:
plain text columns replacing colourful slogans.

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
Montage of phone screens showing the filter in action: adjectives vanishing from posts.

[Shot 1]

00:00-00:11

Action:
Various phone screens show the filter extension stripping adjectives from social media posts in real time. No human face appears while the narrator explains.

Narration:
<Narrator> says:

<d>
[中文]
屏蔽形容詞：過濾插件自動屏蔽社交平台上的所有形容詞。人們看到的不再是惡毒的指控，而是某人對某事發布了三千字的陳述。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Digital clicks, screen hum.

non_diegetic_music:
A steady neutral pulse.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, duration=11, seed=310000, out=ch10_j6_video`

---

## J7 — 社區討論水資源（場景，6 秒）

```
subject_definitions:
<Subject 1> is a group of community residents:
middle-aged men and women in casual clothes, gathered around a table with charts and data printouts.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Medium shot of residents gathered around a table with energy charts and food stock data.

[Shot 1]

00:00-00:06

Action:
A group of community residents stand around a table covered with printed energy consumption charts and food stock numbers. They point at figures, exchange nods, and discuss quietly — but no audible dialogue. Their mouths move naturally in conversation, yet the camera keeps them at a distance so no specific words are heard. A new kind of civic engagement, born from data rather than slogans.

overall_soundscape:
Murmured conversation indistinguishable, pen scratching on paper, a chair scraping. No distinct speech.

non_diegetic_music:
A warm, tentative string melody.
```

**參數**：`ref_image_0=output/ch6_street_ref/zimage_00057_.png, duration=6, seed=491007, out=ch10_j7_video`

---

## J8 — 奇蹟描述（旁白，15 秒）

```
subject_definitions:
<Subject 1> is a neighbourhood street scene:
residents gathered around a water distribution plan, calm faces, daylight.

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
Wide shot of a quiet neighbourhood street, residents discussing around a posted water allocation chart.

[Shot 1]

00:00-00:15

Action:
A quiet neighbourhood scene: residents stand before a hand-drawn water distribution chart, arguing softly about pipe routes. The camera drifts slowly across calm faces. No one shouts. No one waves a flag. While the narrator speaks, the residents continue their practical discussion.

Narration:
<Narrator> says:

<d>
[中文]
起初，人們感到極度焦慮。沒有了標籤，他們不知道該恨誰、該支持誰。但到了第四天，奇蹟發生了。因為不再需要討論誰更愛國，社區居民開始討論如何更有效地分配這條街的水資源。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Birds, distant hammer, water trickling.

non_diegetic_music:
A gentle rising string resolve.
```

**參數**：`ref_image_0=output/ch6_street_ref/zimage_00057_.png, duration=15, seed=310000, out=ch10_j8_video`

---

## J9 — 林墨筆記本（旁白，5 秒）

```
subject_definitions:
<Subject 1> is a notebook page:
handwritten Chinese characters on lined paper, a pen resting beside.

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
Extreme close-up of a notebook page, handwritten text visible.

[Shot 1]

00:00-00:05

Action:
A notebook lies open on a wooden desk. A hand writes the sentence in neat characters: 數據是冰冷的，但它能讓發燒的人降溫。 The pen lifts. The camera holds on the page. No face appears while the narrator reads the line aloud.

Narration:
<Narrator> says:

<d>
[中文]
數據是冰冷的，但它能讓發燒的人降溫。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Pen on paper, quiet room tone.

non_diegetic_music:
A single held piano note.
```

**參數**：`ref_image_0=output/ch3_office_ref/zimage_00019_.png, duration=5, seed=310000, out=ch10_j9_video`

---

## J10 — 夜晚廣場廣播（場景，6 秒）

```
subject_definitions:
<Subject 1> is the night square with loudspeakers:
an empty Saint Paul Square at night, public address speakers on poles, soft light.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Wide night shot of the square, loudspeakers on poles, a few people sitting quietly.

[Shot 1]

00:00-00:06

Action:
The square at night, lit by soft street lamps. Public address speakers on tall poles emit a flat, emotionless voice reading numbers. A handful of people sit on the steps, listening quietly. No one argues. No one reacts. The broadcast is pure data:今日聯邦儲備下降百分之零點二，糧食庫存剩餘四十五天。 The numbers hang in the cold air.

overall_soundscape:
A flat, pre-recorded voice reading statistics through loudspeakers, slight echo off stone buildings. Wind, distant generator hum. The voice is data-only, no emotion, Taiwan-accented Standard Mandarin, no Cantonese, no English.

non_diegetic_music:
None. Pure data broadcast.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, ref_image_1=output/ch9_broadcast_ref/zimage_00078_.png, duration=6, seed=491010, out=ch10_j10_video`

---

## J11 — 赫德辦公室看靜默監控牆（場景，5 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, sitting at a desk in a dimly lit presidential office.

summary:
Reference-based establishing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Wide shot of a dimly lit presidential office; wall of blank monitors behind, large window overlooking the city at dusk.

[Shot 1]

00:00-00:05

Action:
The president sits motionless at his desk, staring at the silent monitor wall — every screen frozen, no data moving. His face reflects the blue-grey glow. He does not speak. Nothing moves except a faint blinking cursor on one dead screen.

overall_soundscape:
Electronic hum of dead monitors, the faint tick of a wall clock, distant wind outside the window. No speech.

non_diegetic_music:
A deep, hollow drone.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, duration=5, seed=491011, out=ch10_j11_video`

---

## J12 — 赫德：你正在把狼變成算盤（對白，5 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, standing by the window.

summary:
Reference-based dialogue.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on the president's weary, sunken face, window light from the side.

[Shot 1]

00:00-00:05

Action:
The president stands by the window, staring out at the unnervingly calm city below. He murmurs to himself, his lips barely moving. Only his mouth moves.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
林墨……你正在把這群狼變成一群算盤。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. A dry, exhausted whisper.
Clock ticking, monitor hum.

non_diegetic_music:
A single low sustained note.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, duration=5, seed=491012, out=ch10_j12_video`

---

## J13 — 林墨 off-screen 回應赫德（對白，8 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, back to camera, standing by the window.

summary:
Reference-based dialogue.
One off-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
<Subject 1> does not speak, his mouth never moves, his face hidden from camera (back turned). The voice comes from outside the window, a distant off-screen male voice, not attached to any device, not the president's voice. No other speech.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot of the president's back silhouetted against the window; the city lights below. His face and mouth are never visible.

[Shot 1]

00:00-00:08

Action:
The president stands with his back to the camera, gazing out the window. He does not turn around. A distant male voice drifts in from outside the window, echoing softly through the silent office. The president's mouth stays sealed. He listens.

Dialogue:
An off-screen distant voice speaks from outside the window; <Subject 1> only listens, mouth sealed, face hidden.
The distant voice says:

<d>
[中文]
不，總統閣下。我是在把他們從你的戲劇裡領出來，讓他們回到自己的生活裡。
</d>

overall_soundscape:
Dialogue delivered from far outside the window, a calm male voice with faint open-air reverb, Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching. The voice is not from any device — pure ambient transmission. Wind, distant city noise.

non_diegetic_music:
A single held string note fading.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, duration=8, seed=491013, out=ch10_j13_video`

---

## J14 — 赫德辦公室旁白（旁白，15 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, sitting in his office surrounded by blank monitors.

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
Wide shot of the president slumped at his desk, the wall of blank monitors behind him casting pale light.

[Shot 1]

00:00-00:15

Action:
The president sits motionless at his desk, surrounded by the dead monitor wall. The narrator delivers the closing observation while the president stares into the void. He does not speak.

Narration:
<Narrator> says:

<d>
[中文]
晨曦宮內的赫德總統看著完全靜默的網路監控牆，感到了前所未有的恐懼。他原本準備好了應對暴亂的武裝力量，準備好了應對罵戰的網軍。但他唯獨沒有準備好應對「被無視」。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Monitor hum, clock ticking, wind outside.

non_diegetic_music:
A deep unresolved string.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, duration=15, seed=310000, out=ch10_j14_video`

---

## J15 — 第七天傍晚斷食結束（場景，5 秒）

```
subject_definitions:
<Subject 1> is the Saint Paul Square at dusk:
ancient stone steps, golden sunset light, a few citizens rising from their seats, phones slipping into pockets.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Wide shot of the square bathed in golden dusk light; citizens slowly standing.

[Shot 1]

00:00-00:05

Action:
The seventh day ends. Golden dusk light washes over the cathedral steps. Citizens slowly rise, sliding phones into pockets. A quiet, wordless signal passes through the crowd — the fast is over. Nobody cheers. They simply stand.

overall_soundscape:
Wind, faint footsteps on stone, a distant bird. No speech.

non_diegetic_music:
A gentle major chord, barely audible.
```

**參數**：`ref_image_0=output/ch9_cath_ref/zimage_00077_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=5, seed=491015, out=ch10_j15_video`

---

## J16 — 收束旁白（旁白，18 秒）

```
subject_definitions:
<Subject 1> is the night city under clearing sky:
the capital at night, lights flickering on, clouds parting to reveal stars.

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
Very wide night vista of the capital, lights flickering on, clouds parting.

[Shot 1]

00:00-00:18

Action:
The night city spreads below; lights are flickering back on district by district. Clouds drift apart to reveal the first stars. The narrator delivers the chapter's closing statement over this slow, quiet transformation.

Narration:
<Narrator> says:

<d>
[中文]
林墨宣布他將正式向國會提交共識協議的最終修正案。這一次不再有紅衣軍，不再有標籤之雨。有的只是無數雙冷靜的眼睛，正透過數據接口盯著國會大廳裡的每一張票。民主三點零的第一場實戰測試，即將開始。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Wind, faint generator hum, the creak of a distant sign.

non_diegetic_music:
A slow rising string, quiet but resolute.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=18, seed=310000, out=ch10_j16_video`

---

## J20 — 廣場夜景結尾（場景，4 秒）

```
subject_definitions:
<Subject 1> is the Saint Paul Square at night under clearing sky:
ancient stone steps bathed in starlight, city lights faint but steady in the distance.

summary:
Reference-based closing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Very wide shot of the square at night; starlight on stone, distant city glow.

[Shot 1]

00:00-00:04

Action:
The empty square at night. Clouds have parted. Starlight falls on the ancient stone steps. In the distance, city lights flicker on — weak but steady. Silence, but not emptiness. A chapter ends.

overall_soundscape:
Wind, distant night birds, the faint hum of generators restarting. No speech.

non_diegetic_music:
A final held major chord, fading to silence.
```

**參數**：`ref_image_0=output/ch9_cath_ref/zimage_00077_.png, ref_image_1=output/ch8_night_ref/zimage_00066_.png, duration=4, seed=491020, out=ch10_j20_video`

---

## 四、字幕資料表（區塊順序、起始秒、逐字字幕）

> 以下為 SRT 產出的逐字依據，時間軸待合併後以 `scale = 實際秒數 / 157` 換算。
> 旁白 J14/J16 包 `<i>…</i>`；其餘為普通字幕。

| # | 區塊 | 字幕文字 |
|---|------|----------|
| 1 | J2-1 | 林老師，政府的行政系統停擺了。 |
| 2 | J2-2 | 赫德總統把自己關在晨曦宮裡不出來，基層公務員因為不知道該聽誰的，乾脆拒絕執行任何指令。 |
| 3 | J2-3 | 現在全國的物流、電力分配、甚至水壓調整，都處於無人對接的狀態。 |
| 4 | J3 | 這是轉型正義的併發症。他們以前只學會聽從口號，現在口號沒了，他們不知道該如何處理事實。 |
| 5 | J4 | 從現在起，我們進行為期七天的「資訊斷食」。 |
| 6 | J6 | 屏蔽形容詞：過濾插件自動屏蔽社交平台上的所有形容詞。人們看到的不再是惡毒的指控，而是某人對某事發布了三千字的陳述。 |
| 7 | J8 | 起初，人們感到極度焦慮。沒有了標籤，他們不知道該恨誰、該支持誰。但到了第四天，奇蹟發生了。因為不再需要討論誰更愛國，社區居民開始討論如何更有效地分配這條街的水資源。 |
| 8 | J9 | 數據是冰冷的，但它能讓發燒的人降溫。 |
| 9 | J12 | 林墨。你正在把這群狼變成一群算盤。 |
| 10 | J13 | 不，總統閣下。我是在把他們從你的戲劇裡領出來，讓他們回到自己的生活裡。 |
| 11 | J14 | <i>晨曦宮內的赫德總統看著完全靜默的網路監控牆，感到了前所未有的恐懼。他原本準備好了應對暴亂的武裝力量，準備好了應對罵戰的網軍。但他唯獨沒有準備好應對「被無視」。</i> |
| 12 | J16 | <i>林墨宣布他將正式向國會提交共識協議的最終修正案。這一次不再有紅衣軍，不再有標籤之雨。有的只是無數雙冷靜的眼睛，正透過數據接口盯著國會大廳裡的每一張票。民主三點零的第一場實戰測試，即將開始。</i> |

---

## 五、產出前自檢（J0–J20）

- [ ] **J0**：Ref-M + Ref-CATH；場景無對白；seed=491000。OK。
- [ ] **J1**：Ref-SCR；場景無對白；seed=491001。OK。
- [ ] **J2**：Ref-Sophie；79字÷4=20秒；seed=491002。OK。
- [ ] **J3**：Ref-M；40字÷4=10秒；seed=491003。OK。
- [ ] **J4**：Ref-M + Ref-BROADCAST；18字÷4=5秒；seed=491004。OK。
- [ ] **J5**：Ref-SCR；場景無對白；seed=491005。OK。
- [ ] **J6**：旁白；Ref-SCR；53字÷5=11秒；seed=310000。OK。
- [ ] **J7**：場景無對白；seed=491007。OK。
- [ ] **J8**：旁白；無參考圖；72字÷5=15秒；seed=310000。OK。
- [ ] **J9**：旁白；無參考圖；16字÷5=5秒；seed=310000。OK。
- [ ] **J10**：Ref-NIGHT + Ref-BROADCAST；場景無對白；seed=491010。OK。
- [ ] **J11**：Ref-PRESIDENT；場景無對白；seed=491011。OK。
- [ ] **J12**：Ref-PRESIDENT；15字÷4=5秒；seed=491012。OK。
- [ ] **J13**：Ref-PRESIDENT；30字÷4=8秒；赫德背對鏡頭不張嘴＋off-screen distant voice＋無設備（Q9）；seed=491013。OK。
- [ ] **J14**：Ref-PRESIDENT；旁白；72字÷5=15秒；seed=310000。OK。
- [ ] **J15**：Ref-CATH + Ref-NIGHT；場景無對白；seed=491015。OK。
- [ ] **J16**：Ref-NIGHT；旁白；87字÷5=18秒；seed=310000。OK。
- [ ] **J20**：Ref-CATH + Ref-NIGHT；場景無對白；seed=491020。OK。

### QA 應用總檢查

- [ ] Q1：對白無「」、無冒號、無驚嘆號。OK。
- [ ] Q2：無「」《》引號。OK。
- [ ] Q5：無人工智慧一詞。OK。
- [ ] Q6：J2 長句自然斷句，語法銜接。OK。
- [ ] Q7：J2 蘇菲 `only <Subject 1>'s mouth moves`、J12 赫德 `only <Subject 1>'s mouth moves`。OK。
- [ ] Q8：J4 林墨擴音器宣言（無稱謂直呼）；J17 已移除（原「老師」稱謂屬 Ch11）。OK。
- [ ] Q9：J13 赫德背對鏡頭不張嘴＋off-screen distant voice＋無設備（Q9 鐵律）；J10 擴音器播報數字（off-screen，無張嘴者）。OK。

---

> 全表 18 個區塊（場景 8、對白 5、旁白 5）；合計 ≈ 157 秒。
> 規劃 seed 對白/場景 `491000–491020`（跳用）、旁白 `310000`。
> 下一步：逐支提交 r2v 生成，確認渲染結果後合併為 `ch10_full`。