# 第十四章渲染計畫（example14_ch12.md）— Ch12 無聲的未來（最終章）

> **進度**：Ch11（終極表決）已完成並合併（`ch11_full/merged_20260917061137.mp4`，228.83s，dub 18 列）。
> **本文件**：`story1.md` 第十二章「無聲的未來」（line 664–721）的完整區塊分割、參考圖分配、27 支六欄位 r2v 提示詞、字幕資料表與自檢清單。
> 沿用 v2 方法論（`novel_to_video_guide_v2.md`）與 Ch11 版型（`example13_ch11.md`）；解析度統一 352×608。
> 所有對話 QA 規則一律套用：去「」『』《》引號、去冒號／破折號／驚嘆號、阿拉伯數字轉中文（民主 3.0→民主三點零、45 勒克斯→四十五勒克斯）、每句獨立換行、被稱呼者不入前景、長人物鏡頭拆 Shot＋no-duplicate 負向條款。

---

## 一、章節功能與情緒走向

| 層次 | 內容 |
|------|------|
| 章節功能 | 最終章：收束「神話 vs 帳單」母題。林墨與赫德最後會面（輸給一套加減法）→ 林墨拒絕英雄位、選擇離場 → 夜晚的四十五勒克斯與家家餐桌（安靜、枯燥但誠實的未來）。 |
| 情緒走向 | 清晨灰白寂寥 →（宮內）乾枯疲憊的對決 →（噴泉）溫和釋然的道別 →（夜晚）冷靜、透明、微溫的收尾。 |
| 濃縮策略 | 只保留赫德話政的「形容詞刪除／氣象預報」兩核心句；「政治維穩溢價／親衛隊裁撤」以旁白帶過；去除純政策性細節。 |
| 旁白張力 | 開場（安靜流行病）、中場（安保開支公示）、收尾（夜晚 45 勒克斯／標籤的雨停了／民主三點零）四段固定旁白 voice 貫穿。 |

---

## 二、參考圖管理表

### 既有重用（全片共用）

| 代號 | 用途 | 檔案 | 使用區塊 |
|------|------|------|----------|
| Ref-M | 林墨肖像 | `output/ch1_beat13_ref_char/zimage_00008_.png` | l2 l4 l8 l10 l11 l12 l14 l16 l18 l19 l20 l22 |
| Ref-Sophie | 蘇菲肖像 | `output/ch3_sophie_ref/zimage_00021_.png` | l16 l17 l21 |
| Ref-PRESIDENT | 赫德肖像（桌邊） | `output/ch5_president_ref/zimage_00048_.png` | l5 l6 l7 l9 l15 |
| Ref-PALACE | 晨曦宮外觀（宮門） | `output/ch5_palace_ext_ref/zimage_00050_.png` | l4 |
| Ref-NIGHT | 夜晚街景 | `output/ch8_night_ref/zimage_00066_.png` | l23 l25 |

### 新建（Step 1，Z-Image Turbo）

| 代號 | 用途 | 目錄（out） | 使用區塊 |
|------|------|-------------|----------|
| Ref-COMM | 清晨首都中央商業區（灰底藍字巨幕） | `ch12_comm_ref` | l0 l1 l2 l3 |
| Ref-OFFICE | 晨曦宮總統辦公室（窗邊、桌面對坐） | `ch12_office_ref` | l5 l6 l7 l8 l9 l10 l11 l12 l13 l14 l15 |
| Ref-FOUNTAIN | 晨曦宮前噴泉廣場 | `ch12_fountain_ref` | l16 l17 l18 l19 l20 l21 l22 |
| Ref-DINER | 夜晚家庭餐桌（平板＋暖光） | `ch12_diner_ref` | l24 l26 |

---

## 三、Step 1：新建參考圖（4 張，Z-Image）

規格：832×1248（2:3 直式）、steps=8、cfg=1、`gen_zit_image`。命名為 `zimage_#####_.png`。

### R1 — Ref-COMM（商業區巨幕）

```
清晨的歐若拉聯邦首都中央商業區。高樓外牆掛著巨大的直立式顯示螢幕，螢幕是單純的灰底藍字，顯示電網負載數字、公車到站時間、以及進口原油的真實離岸價格清單。街道寬敞乾淨、清晨灰藍冷光、路面微微反光，少數行人低頭走路。沒有全息投影，沒有領袖揮手的畫面。縱深透視的城市構圖，寫實電影質感。2:3 直式。
```

### R2 — Ref-OFFICE（晨曦宮總統辦公室）

```
歐若拉聯邦晨曦宮總統辦公室清晨內景。一整面寬大的落地窗，窗外是空蕩蕩的辦公園區花園，晨光斜射進來，地板有長長的倒影。中央一座深色木質大辦公桌，桌面放著一台平板電腦與一張皺巴巴的紙幣。深色莊重的裝潢，冷靜肅穆。寫實電影質感。2:3 直式。
```

### R3 — Ref-FOUNTAIN（噴泉廣場）

```
晨曦宮前的噴泉廣場。中央一座白色石砌噴泉，水柱噴起，清晨的天光灑在溼潤的石面。遠景是宮殿典型的古典石柱立面。廣場寬敞空曠，幾乎沒有人。寫實電影質感。2:3 直式。
```

### R4 — Ref-DINER（家庭餐桌）

```
夜晚，居民公寓窗內的家庭餐桌近景。暖黃的燈光，餐桌上放著一台平板電腦，螢幕顯示著一整頁預算明細表格。一家人圍坐桌邊，低著頭安靜地看平板，神情平和。窗外是夜色的街道與暖色路燈。溫馨、安靜、誠實的氛圍。寫實電影質感。2:3 直式。
```

---

## 四、區塊總表（27 支，規劃 213 秒）

| ID | 型別 | 來源 | 秒 | 累積起點 | 參考圖（ref_0, ref_1, ref_2） | seed | out |
|----|------|------|----|----------|-------------------------------|------|-----|
| l0 | 場景 | line 668 | 7 | 0s | COMM | 493000 | ch12_l0_video |
| l1 | 旁白 | line 666 | 6 | 7s | COMM | 310000 | ch12_l1_video |
| l2 | 場景 | line 668 | 6 | 13s | M, COMM | 493001 | ch12_l2_video |
| l3 | 旁白 | line 670 | 6 | 19s | COMM | 310000 | ch12_l3_video |
| l4 | 旁白 | line 672 | 11 | 25s | M, PALACE | 310000 | ch12_l4_video |
| l5 | 場景 | line 674 | 6 | 36s | OFFICE, PRESIDENT | 493002 | ch12_l5_video |
| l6 | 對白 | line 676 上 | 10 | 42s | PRESIDENT, OFFICE | 493003 | ch12_l6_video |
| l7 | 對白 | line 676 下 | 9 | 52s | PRESIDENT, OFFICE | 493004 | ch12_l7_video |
| l8 | 對白 | line 678 | 9 | 61s | M, OFFICE | 493005 | ch12_l8_video |
| l9 | 對白 | line 680 | 12 | 70s | PRESIDENT, OFFICE | 493006 | ch12_l9_video |
| l10 | 對白 | line 682 | 5 | 82s | M, OFFICE | 493007 | ch12_l10_video |
| l11 | 對白 | line 684 上 | 10 | 87s | M, OFFICE | 493008 | ch12_l11_video |
| l12 | 對白 | line 684 下 | 9 | 97s | M, OFFICE | 493009 | ch12_l12_video |
| l13 | 場景 | line 686 | 5 | 106s | OFFICE | 493010 | ch12_l13_video |
| l14 | 對白 | line 688 | 14 | 111s | M, OFFICE | 493011 | ch12_l14_video |
| l15 | 場景 | line 690 | 6 | 125s | PRESIDENT, OFFICE | 493012 | ch12_l15_video |
| l16 | 場景 | line 694 | 6 | 131s | FOUNTAIN, M, SOPHIE | 493013 | ch12_l16_video |
| l17 | 對白 | line 696 | 9 | 137s | SOPHIE, FOUNTAIN | 493014 | ch12_l17_video |
| l18 | 對白 | line 698 上 | 12 | 146s | M, FOUNTAIN | 493015 | ch12_l18_video |
| l19 | 對白 | line 698 下 | 8 | 158s | M, FOUNTAIN | 493016 | ch12_l19_video |
| l20 | 場景 | line 700 | 5 | 166s | M, FOUNTAIN | 493017 | ch12_l20_video |
| l21 | 對白 | line 702 | 3 | 171s | SOPHIE, FOUNTAIN | 493018 | ch12_l21_video |
| l22 | 對白 | line 704 | 10 | 174s | M, FOUNTAIN | 493019 | ch12_l22_video |
| l23 | 旁白 | line 706-707 | 11 | 184s | NIGHT | 310000 | ch12_l23_video |
| l24 | 場景 | line 710 | 6 | 195s | DINER | 493020 | ch12_l24_video |
| l25 | 旁白 | line 712-713 | 8 | 201s | NIGHT | 310000 | ch12_l25_video |
| l26 | 旁白 | line 715 | 4 | 209s | DINER | 310000 | ch12_l26_video |

> 對白計秒 = 中文字數 ÷ 4；旁白計秒 = 中文字數 ÷ 5；場景按動作節拍估。旁白共用 seed 310000。

---

## 五、全部區塊六欄位提示詞

### l0 — 清晨商業區巨幕（場景，7 秒）

```
subject_definitions:
<Subject 1> is the dawn commercial district from <Picture 1>:
a wide morning business avenue in the capital, tall towers with giant wall screens showing grey-background blue numeric data, sparse pedestrians, cool grey-blue light.

summary:
Reference-based establishing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No voice-over. No on-screen mouth movement.

detailed_description:

Visual style:
Wide establishing shot of the avenue at dawn, the wall screens as calm grey panels of blue figures.

[Shot 1]

00:00-00:07

Action:
Slow pan across the nearly empty business avenue. Huge wall screens glow with plain blue text on grey fields: grid loads, bus arrival times, and imported crude oil prices (visible on-screen text, not spoken). Few pedestrians cross the wet, reflective street. No holograms, no slogans. The city is quiet and spacious.

overall_soundscape:
Soft early-morning wind between towers, distant muffled traffic, the low hum of screens. No speech.

non_diegetic_music:
A thin, clean ambient tone, grey and cool.
```

**參數**：`ref_image_0=output/ch12_comm_ref/zimage_00088_.png, duration=7, seed=493000, out=ch12_l0_video`

---

### l1 — 安靜流行病（旁白，6 秒）

```
subject_definitions:
<Subject 1> is the dawn commercial district from <Picture 1>:
a wide morning business avenue in the capital, tall towers with giant grey-blue data screens, sparse pedestrians, cool light.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement. The narrator is a fixed calm male voice, never female.

detailed_description:

Visual style:
Static wide shot of the avenue, empty and calm under the grey-blue screens.

[Shot 1]

00:00-00:06

Action:
The avenue holds still, only a handful of people walking in the distance. The wall screens quietly cycle their blue numbers. Nothing moves fast, nothing shouts. The narrator speaks over the silence. The distant passersby are silent and never the source of the narration.

Narration:
<Narrator> says:

<d>
[中文]
法案通過後的第一個月，歐若拉聯邦被一種名為安靜的流行病席捲了。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Early-morning breeze, faint screen hum, distant footsteps.

non_diegetic_music:
A sparse, reflective piano line, restrained.
```

**參數**：`ref_image_0=output/ch12_comm_ref/zimage_00088_.png, duration=6, seed=310100, out=ch12_l1_video_r2`

> **v1 失敗記錄（seed=310000）**：旁白錨點句缺 `low calm middle-aged male voice` 聲線釘定＋畫面有遠景路人被聲軌認領 → 翻轉成女聲（QA Q12）。**v2 已補回完整錨點句＋`speaker_constraints` 性別釘定＋路人沉默條款，並換新 seed（310100）重跑；若仍翻轉性別，記入黑名單。**（l3/l4/l23/l25/l26 錨點同步補正，未翻轉不重跑。）

---

### l2 — 林墨漫步商業區（場景，6 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, steady gaze.

<Subject 2> is the dawn commercial district from <Picture 2>:
a wide morning business avenue in the capital, giant grey-blue data screens on towers, sparse pedestrians, cool light.

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
Medium tracking shot of Lin walking through the quiet avenue, screens towering in the background.

[Shot 1]

00:00-00:06

Action:
Lin walks slowly, hands relaxed, looking up at the grey-blue screens and the pale sky. He breathes in the cold morning air. Around him the street is broad and nearly empty. He does not speak.

overall_soundscape:
His footsteps on the pavement, morning wind, the soft hum of the huge screens. No speech.

non_diegetic_music:
A low, unfussy ambient bed, almost silent.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_comm_ref/zimage_00088_.png, duration=6, seed=493001, out=ch12_l2_video`

---

### l3 — 街道冷清寬敞（旁白，6 秒）

```
subject_definitions:
<Subject 1> is the dawn commercial district from <Picture 1>:
a wide morning business avenue in the capital, giant grey-blue data screens on towers, few pedestrians, cool light.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement. The narrator is a fixed calm male voice, never female.

detailed_description:

Visual style:
Slow lateral dolly across the empty avenue, the street opening wide before the camera.

[Shot 1]

00:00-00:06

Action:
The camera drifts sideways past an empty bench, a lone crossing pedestrian, a screen cycling bus times. The street feels cold but generously wide. The narrator speaks as the city holds its breath. The lone crossing pedestrian is silent and never the source of the narration.

Narration:
<Narrator> says:

<d>
[中文]
沒有了那些激昂的配樂，街道顯得有些冷清，但也顯得前所未有的寬敞。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Morning wind, distant car hum, screen fans.

non_diegetic_music:
A quiet, open-air ambient line, high and clean.
```

**參數**：`ref_image_0=output/ch12_comm_ref/zimage_00088_.png, duration=6, seed=310000, out=ch12_l3_video`

---

### l4 — 進晨曦宮，親衛隊裁減（旁白，11 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, steady gaze.

<Subject 2> is the Dawn Palace gate from <Picture 2>:
the main gate of the neoclassical Dawn Palace, stone facade, guarded entrance courtyard.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement. The narrator is a fixed calm male voice, never female. Lin's lips stay sealed.

detailed_description:

Visual style:
Medium shot of Lin passing through the palace gate; the guard post half-empty, salutes relaxed.

[Shot 1]

00:00-00:11

Action:
Lin walks up to the Dawn Palace gate. The two guards at the post let him through without a word; the security check is routine and brief, the guard roster visibly thinned. His lips stay sealed as he steps under the stone arch. The narrator speaks over the quiet.

Narration:
<Narrator> says:

<d>
[中文]
因為根據新法，總統官邸的所有安保開支必須即時公示，赫德為了節省那昂貴的政治維穩溢價，主動裁撤了半數的親衛隊。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Footsteps on the palace gravel, a distant fountain, the morning wind.

non_diegetic_music:
A spare, ceremonial drone, low and gray.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_palace_ext_ref/zimage_00050_.png, duration=11, seed=310000, out=ch12_l4_video`

---

### l5 — 赫德窗邊發呆（場景，6 秒）

```
subject_definitions:
<Subject 1> is the presidential office from <Picture 1>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows over an empty garden compound, dark wooden desk with a tablet and a crumpled bill, long morning shadows.

<Subject 2> is President Herde from <Picture 2>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit.

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
Wide shot of the big sunlit office; the president sits by the window, staring out.

[Shot 1]

00:00-00:06

Action:
President Herde sits motionless on a chair by the tall window, facing the empty garden compound of the palace. Morning light falls across the desk. He does not turn, does not speak, does not move, his eyes fixed on the emptiness outside.

overall_soundscape:
The ringing quiet of a large room, faint wind against the glass, a distant clock. No speech.

non_diegetic_music:
A hollow, exhausted tone.
```

**參數**：`ref_image_0=output/ch12_office_ref/zimage_00089_.png, ref_image_1=output/ch5_president_ref/zimage_00048_.png, duration=6, seed=493002, out=ch12_l5_video`

---

### l6 — 赫德：你成功了（對白，10 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, seated by the window of a grand office, not turning around.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows over an empty garden compound, dark wooden desk.

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
Medium two-shot from behind Lin Mo's shoulder; the president stays with his back to the camera, addressing Lin who sits across the room, out of the foreground.

[Shot 1]

00:00-00:10

Action:
Herde keeps gazing out the window, not turning around, speaking in a dry, weary voice. Lin Mo sits off-foreground listening. Only Herde's mouth moves. His silhouette is gaunt against the bright glass.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
你成功了，林墨。
我昨天發布了一篇關於農業補貼的講話，系統自動把我的形容詞全部刪除了。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
The quiet of the office, a distant clock, wind against glass.

non_diegetic_music:
A dry, threadbare string motif.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=10, seed=493003, out=ch12_l6_video`

---

### l7 — 赫德：氣象預報（對白，9 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, seated in a grand morning office, face half-turned from the window.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk.

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
Medium close-up on Herde's gaunt profile in the window light, mouth moving slightly.

[Shot 1]

00:00-00:09

Action:
Herde finally turns a fraction toward Lin, his voice dry and hollow. He speaks slowly, tasting the strangeness of his own emptied speech. Only his mouth moves; Lin stays off-foreground.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
最後播出來的版本，聽起來像是一份枯燥的氣象預報。
人民甚至懶得看完它。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Office silence, a faint hum from outside, the small sound of his breath.

non_diegetic_music:
A quiet, aging cello note.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=9, seed=493004, out=ch12_l7_video`

---

### l8 — 林墨：補貼入帳（對白，9 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated in an office, calm.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk.

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
Medium close-up on Lin across the desk, steady and unafraid; the president remains off-foreground.

[Shot 1]

00:00-00:09

Action:
Lin sits opposite the president, calm and composed, answering plainly. Only his mouth moves as he speaks; Herde stays off-foreground. His tone is flat, factual, exact.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
人民不需要看演戲來獲得安全感，總統閣下。
他們需要的是真實的補貼入帳。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
A quiet room, papers rustling somewhere, the morning clock.

non_diegetic_music:
A spare, patient piano note.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=9, seed=493005, out=ch12_l8_video`

---

### l9 — 赫德：神話與帳單（對白，12 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, seated in a grand morning office.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk.

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
Close-up of Herde turning his head toward Lin, a final glint of defiance in his eyes.

[Shot 1]

00:00-00:06

Action:
Herde turns his head fully, the last spark of challenge in his eyes. He leans forward slightly, mouth moving. Only his mouth moves; Lin stays off-foreground.

[Shot 2]

00:06-00:12

Action:
Herde holds Lin's gaze, face half in shadow, ending the thought with a tired smirk. No duplicate copies of the subject appear on screen.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
但我很懷疑，一個沒有英雄、沒有反派、沒有熱血口號的國家，真的能長久嗎。
人類是需要神話的，而你給了他們一份帳單。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Quiet office air, a distant clock tick, wind against the glass.

non_diegetic_music:
A low, resigned brass chord.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=12, seed=493006, out=ch12_l9_video`

---

### l10 — 林墨：帳單無趣＋放廢紙（對白，5 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated in an office.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk.

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
Medium shot over the desk as Lin takes out a crumpled bill and lays it down.

[Shot 1]

00:00-00:05

Action:
Lin reaches into his pocket, brings out a deeply creased, worthless high-denomination bill from Solyria, and sets it flat on the president's desk with a soft click against the wood. Only his mouth moves as he speaks. President stays off-foreground.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
帳單雖然無趣，但帳單不會讓人自相殘殺。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
The soft rustle of paper, the click of the bill on the desk, office silence.

non_diegetic_music:
A quiet, dry woodwind note.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=5, seed=493007, out=ch12_l10_video`

---

### l11 — 林墨：審計完成（對白，10 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated in an office.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk.

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
Medium close-up on Lin, calm and deliberate, delivering facts like a settlement.

[Shot 1]

00:00-00:10

Action:
Lin keeps both hands still on the desk, stating the audit plainly. Only his mouth moves. The crumpled bill lies between them. The president stays off-foreground, listening in silence.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
這份神話的代價太高了。
赫德，我來是想告訴你，資訊仲裁委員會已經完成了對你過去三年的審計。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Office quiet, a faint breeze at the window, the clock ticking.

non_diegetic_music:
A low, precise pulse.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=10, seed=493008, out=ch12_l11_video`

---

### l12 — 林墨：無法追溯刑責（對白，9 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated in an office.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk.

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
Slight push-in on Lin's face, the words careful and weightless at once.

[Shot 1]

00:00-00:09

Action:
Lin continues, unhurried, spelling out the limits of the law without triumph. Only his mouth moves. The president remains off-foreground, motionless.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
雖然你利用數據操縱了民意，但在現有法律框架下，我們無法追溯你的刑事責任。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Quiet office room tone, a distant clock, the crinkle of old paper.

non_diegetic_music:
A threadbare organ pad, almost inaudible.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=9, seed=493009, out=ch12_l12_video`

---

### l13 — 林墨點開平板（場景，5 秒）

```
subject_definitions:
<Subject 1> is the presidential office from <Picture 1>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk with a tablet and a crumpled bill.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.
No whispering. No muttering. No lip-flap. No off-screen speech. No device voice. Strict silence of any human voice.

detailed_description:

Visual style:
Insert/over-the-shoulder close-up of a hand tapping the dark tablet on the desk.

[Shot 1]

00:00-00:05

Action:
A hand reaches across the desk and taps the tablet screen; it lights up with a settlement summary (visible on-screen text, never read aloud, never spoken). Beside it lies the crumpled bill. A silent pause lingers before the next beat. No one speaks; silence fills the room.

overall_soundscape:
The soft tap of a finger on glass; the tablet wakes with a low electronic hum - no voice, no alert tones, no spoken sounds; office silence.

non_diegetic_music:
A single held note, expectant.
```

**參數**：`ref_image_0=output/ch12_office_ref/zimage_00089_.png, duration=5, seed=493100, out=ch12_l13_video_r2`

> **v1 失敗記錄（seed=493010）**：原版無「音訊空態」負向條款、`Action` 平板文字未標 `never read aloud`、含 `before the next words` speech token → 畫面浮現文字被 TTS 當可唸素材，輸出「似英文卻非英文」的含糊語音（QA Q11）。**v2 已套 Q11 全部處置並換新 seed（493100）重跑；若歪腔／壞 seed 再記黑名單。**

---

### l14 — 林墨：共識協議第十五條（對白，14 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated in an office.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk, tablet glowing blue.

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
Medium close-up on Lin reading from the tablet; then a slow push to the crumpled bill.

[Shot 1]

00:00-00:07

Action:
Lin reads the article calmly from the glowing tablet. Only his mouth moves. His tone stays flat, a clerk reading a bill.

[Shot 2]

00:07-00:14

Action:
Lin looks up from the tablet straight at the president, then nods toward the crumpled bill on the desk. No duplicate copies of the subject appear on screen.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
根據共識協議第十五條，因為你的操縱導致的社會成本，將由你的個人退休金與海外資產歸墊。
這張紙，是你現在唯一的財富水平證明。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Tablet hum, quiet office air, the rustle of paper, a distant clock.

non_diegetic_music:
A dry, arithmetic string line, exact and small.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=14, seed=493011, out=ch12_l14_video`

---

### l15 — 赫德自嘲慘笑（場景，6 秒）

```
subject_definitions:
<Subject 1> is President Herde from <Picture 1>:
late 50s Latin American male, receding grey hair, gaunt face, dark suit, seated in a grand office.

<Subject 2> is the presidential office from <Picture 2>:
a grand morning office in the Dawn Palace, floor-to-ceiling windows, dark wooden desk, a crumpled bill on top.

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
Close-up on Herde's face as he finally smiles a bitter, defeated smile.

[Shot 1]

00:00-00:06

Action:
Herde stares at the crumpled bill. The corner of his mouth twitches once, then he lets out a low, self-mocking laugh, dry as dust. He shakes his head slowly. He does not speak; the laugh is wordless.

overall_soundscape:
A single hollow laugh, the creak of the chair, office silence closing back in.

non_diegetic_music:
A fading, ironic waltz fragment.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_00048_.png, ref_image_1=output/ch12_office_ref/zimage_00089_.png, duration=6, seed=493012, out=ch12_l15_video`

---

### l16 — 噴泉旁蘇菲（場景，6 秒）

```
subject_definitions:
<Subject 1> is the fountain square from <Picture 1>:
the plaza before the Dawn Palace, a white stone fountain in the centre, morning light on wet stone, palace facade in the distance.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit.

<Subject 3> is Sophie from <Picture 3>:
young East Asian woman, dark hair, calm steady gaze, business attire.

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
Wide shot of the fountain square; Sophie waits by the water as Lin walks out of the palace gates.

[Shot 1]

00:00-00:06

Action:
Lin steps out onto the plaza. Sophie stands by the fountain, waiting. In the far background a political statue is being dismantled by a small crew. The two meet in the middle of the broad, quiet square. No one speaks.

overall_soundscape:
The steady hiss of the fountain, footsteps on stone, a distant crane and clank from the statue work. No speech.

non_diegetic_music:
An open, breezy motif, gently hopeful.
```

**參數**：`ref_image_0=output/ch12_fountain_ref/zimage_00090_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_2=output/ch3_sophie_ref/zimage_00021_.png, duration=6, seed=493013, out=ch12_l16_video`

---

### l17 — 蘇菲：辭呈（對白，9 秒）

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
young East Asian woman, dark hair, calm steady gaze, business attire, standing by a fountain in the morning.

<Subject 2> is the fountain square from <Picture 2>:
the plaza before the Dawn Palace, a white stone fountain in the centre, morning light.

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
Medium close-up on Sophie at the fountain, gentle but direct; Lin off-foreground listening.

[Shot 1]

00:00-00:09

Action:
Sophie stands facing Lin by the fountain, speaking with the quiet authority of the new institution she heads. Only her mouth moves. Lin stays off-foreground. The water keeps hissing behind her.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
老師，國會剛才通過了你的辭呈。
你真的不打算留下來主導民主三點零的運行嗎。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Fountain water, breeze, the soft echo of the empty square.

non_diegetic_music:
A light, questioning woodwind line.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, ref_image_1=output/ch12_fountain_ref/zimage_00090_.png, duration=9, seed=493014, out=ch12_l17_video`

---

### l18 — 林墨：它不需要聖人（對白，12 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing by a fountain.

<Subject 2> is the fountain square from <Picture 2>:
the plaza before the Dawn Palace, a white stone fountain in the centre, morning light.

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
Medium shot of Lin looking past Sophie toward the distant dismantled statue; then a close-up.

[Shot 1]

00:00-00:06

Action:
Lin shakes his head gently, looking off toward where the political statue is being pulled down. Only his mouth moves as he explains.

[Shot 2]

00:06-00:12

Action:
He turns back, calm, the fountain water between him and the camera's foreground. No duplicate copies of the subject appear on screen.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
不。
這套系統最美的地方在於，它不需要一個聖人來維持。
只要邏輯還在，只要數據的門是開著的，它就能自我運轉。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Fountain hiss, wind, a faint distant crane from the statue works.

non_diegetic_music:
A clean, open string line, warm and unhurried.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_fountain_ref/zimage_00090_.png, duration=12, seed=493015, out=ch12_l18_video`

---

### l19 — 林墨：英雄是不穩定變數（對白，8 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing by a fountain.

<Subject 2> is the fountain square from <Picture 2>:
the plaza before the Dawn Palace, a white stone fountain in the centre, morning light.

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
Medium close-up on Lin, finishing the thought quietly.

[Shot 1]

00:00-00:08

Action:
Lin speaks gently, self-aware, no regret in his eyes. Only his mouth moves. Sophie stays off-foreground. The fountain continues behind him.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
如果我留下來，我會變成另一個英雄，而英雄本身就是一種不穩定的變數。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Fountain water, light wind, the hush of the open square.

non_diegetic_music:
A soft, resolute piano chord.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_fountain_ref/zimage_00090_.png, duration=8, seed=493016, out=ch12_l19_video`

---

### l20 — 背起行囊（場景，5 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing by a fountain.

<Subject 2> is the fountain square from <Picture 2>:
the plaza before the Dawn Palace, a white stone fountain in the centre, morning light.

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
Medium shot as Lin slings a travel pack onto his shoulder and turns south.

[Shot 1]

00:00-00:05

Action:
Lin shoulders a modest travel pack, adjusts the strap, and turns to face the road heading south. The fountain sprays behind him. He does not speak. Sophie stays off-foreground.

overall_soundscape:
The swish of the pack strap, a footstep on stone, water in the fountain. No speech.

non_diegetic_music:
A quiet, stepping acoustic line, forward-moving.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_fountain_ref/zimage_00090_.png, duration=5, seed=493017, out=ch12_l20_video`

---

### l21 — 蘇菲：您要去哪（對白，3 秒）

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
young East Asian woman, dark hair, calm steady gaze, business attire, standing by a fountain.

<Subject 2> is the fountain square from <Picture 2>:
the plaza before the Dawn Palace, a white stone fountain in the centre, morning light.

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
Close two-shot from behind Lin; Sophie calls out, raising her voice over the water.

[Shot 1]

00:00-00:03

Action:
Sophie calls out loudly toward Lin's back as he turns to leave. Only her mouth moves. Lin stays off-foreground.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
老師，您要去哪。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Fountain water, wind, the echo of the square.

non_diegetic_music:
A single suspended note.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, ref_image_1=output/ch12_fountain_ref/zimage_00090_.png, duration=3, seed=493018, out=ch12_l21_video`

---

### l22 — 林墨：去學對話（對白，10 秒）

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, a travel pack, standing by a fountain.

<Subject 2> is the fountain square from <Picture 2>:
the plaza before the Dawn Palace, a white stone fountain in the centre, morning light.

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
Medium shot of Lin half-turning, raising a hand in a small farewell wave.

[Shot 1]

00:00-00:10

Action:
Lin turns back once, lifts a hand in a light wave, and answers. Only his mouth moves. His eyes are easy, unworried. Sophie stays off-foreground.

Dialogue:
The following lines belong to <Subject 1> alone.
<Subject 1> says:

<d>
[中文]
去一個不需要我說話的地方。
去看看那些不再被標籤定義的人們，是怎麼重新學習對話的。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Fountain water, wind, a distant latch of a gate.

non_diegetic_music:
A warm, quiet resolve, guitar and low strings.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch12_fountain_ref/zimage_00090_.png, duration=10, seed=493019, out=ch12_l22_video`

---

### l23 — 夜晚降臨，45 勒克斯（旁白，11 秒）

```
subject_definitions:
<Subject 1> is the night street from <Picture 1>:
an empty city street at night, sensor streetlamps at comfortable spacing, cool blue darkness, no crowds.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement. The narrator is a fixed calm male voice, never female.

detailed_description:

Visual style:
Slow wide shot of the night street as the lamps switch on one after another.

[Shot 1]

00:00-00:11

Action:
The streetlamp sensors catch the dusk and the lamps flicker on one by one, neat intervals of exact, efficient light. The street is empty; no banners, no crowds, no slogans. The narrator speaks over the calm rows of lamps.

Narration:
<Narrator> says:

<d>
[中文]
歐若拉聯邦的夜晚降臨了。
路燈自動感應亮起，亮度是精準的四十五勒克斯，那是經過數據計算後，最節能且最能保障治安的數值。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
The soft buzz of lamps firing, night breeze, distant crickets.

non_diegetic_music:
A spare, cool ambient bed, city-as-machine hum.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=11, seed=310101, out=ch12_l23_video_r2`

> **v1 失敗記錄（seed=310000）**：旁白錨點句已修正（完整版＋性別釘定），但 seed=310000 已連續三次翻轉女聲（l1/l23/l26），正式進性別翻轉黑名單。v2 換新 seed（310101）重跑；若仍翻轉再記黑名單。

---

### l24 — 家庭餐桌（場景，6 秒）

```
subject_definitions:
<Subject 1> is the family dinner table from <Picture 1>:
an apartment dinner table at night, warm lamplight, a tablet showing a budget spreadsheet, a family sitting close.

summary:
Reference-based scene.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks. No narration. No on-screen mouth movement.

detailed_description:

Visual style:
Warm medium shot across the table; the family leans over the glowing tablet.

[Shot 1]

00:00-00:06

Action:
Around the warm table, a family studies the tablet together, fingers tracing the real numbers of the household budget, someone writing notes. They trade small looks and quiet comments. No one shouts slogans; the light is warm and ordinary.

overall_soundscape:
Soft speech in low murmurs, the click of chopsticks, warm room tone, the street outside muffled.

non_diegetic_music:
A gentle domestic hum, low strings and a warm room tone.
```

**參數**：`ref_image_0=output/ch12_diner_ref/zimage_00091_.png, duration=6, seed=493020, out=ch12_l24_video`

---

### l25 — 標籤的雨停了（旁白，8 秒）

```
subject_definitions:
<Subject 1> is the night street from <Picture 1>:
an empty city street at night, sensor streetlamps, cool darkness, clear air, trees lining the road.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement. The narrator is a fixed calm male voice, never female.

detailed_description:

Visual style:
Steady shot down the night street, trees and lamps in focus, the road visible far ahead.

[Shot 1]

00:00-00:08

Action:
In the streetlight, every road and every roadside tree shows its true colour in the clear air. Nothing falls from the sky but the cool light. The narrator speaks slowly, quietly, as the frame holds the wide open street.

Narration:
<Narrator> says:

<d>
[中文]
標籤的雨停了。
雖然空氣冷了一點，但每個人都能看清前方的路，以及路邊每一棵樹真實的顏色。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Night breeze through the trees, far-off lamp hum, stillness.

non_diegetic_music:
A quiet, honest piano line, the theme resolving.
```

**參數**：`ref_image_0=output/ch8_night_ref/zimage_00066_.png, duration=8, seed=310000, out=ch12_l25_video`

---

### l26 — 這就是民主三點零（旁白，4 秒）

```
subject_definitions:
<Subject 1> is the family dinner table from <Picture 1>:
an apartment dinner table at night, warm lamplight, a tablet glowing with real numbers, a calm family.

summary:
Reference-based narration.
No on-screen speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement. The narrator is a fixed calm male voice, never female.

detailed_description:

Visual style:
Close on the warm table light, the tablet screen soft in the centre of frame.

[Shot 1]

00:00-00:04

Action:
The warm lamplight holds the tablet's honest spreadsheet at the centre of the frame, the family's shadows steady around it. The narrator delivers the closing line over the quiet, ordinary warmth.

Narration:
<Narrator> says:

<d>
[中文]
這就是民主三點零。
它不美，但它很誠實。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
Warm room tone, a distant night street, soft breathing.

non_diegetic_music:
The theme resolves on one clean, final chord.
```

**參數**：`ref_image_0=output/ch12_diner_ref/zimage_00091_.png, duration=4, seed=310102, out=ch12_l26_video_r2`

> **v1 失敗記錄（seed=310000）**：同 l23——seed=310000 已進入性別翻轉黑名單。v2 換新 seed（310102）重跑。

---

## 六、字幕資料表（19 列；規劃 → 合併後以 scale 換算）

| 區塊 | 型別 | 規劃秒 | 累積起點 | 字幕文字（逐字） | 斜體 |
|------|------|--------|----------|------------------|------|
| l1 | 旁白 | 6 | 7s | 法案通過後的第一個月，歐若拉聯邦被一種名為安靜的流行病席捲了。 | ✅ |
| l3 | 旁白 | 6 | 19s | 沒有了那些激昂的配樂，街道顯得有些冷清，但也顯得前所未有的寬敞。 | ✅ |
| l4 | 旁白 | 11 | 25s | 因為根據新法，總統官邸的所有安保開支必須即時公示，赫德為了節省那昂貴的政治維穩溢價，主動裁撤了半數的親衛隊。 | ✅ |
| l6 | 對白 | 10 | 42s | 你成功了，林墨。我昨天發布了一篇關於農業補貼的講話，系統自動把我的形容詞全部刪除了。 | — |
| l7 | 對白 | 9 | 52s | 最後播出來的版本，聽起來像是一份枯燥的氣象預報。人民甚至懶得看完它。 | — |
| l8 | 對白 | 9 | 61s | 人民不需要看演戲來獲得安全感，總統閣下。他們需要的是真實的補貼入帳。 | — |
| l9 | 對白 | 12 | 70s | 但我很懷疑，一個沒有英雄、沒有反派、沒有熱血口號的國家，真的能長久嗎。人類是需要神話的，而你給了他們一份帳單。 | — |
| l10 | 對白 | 5 | 82s | 帳單雖然無趣，但帳單不會讓人自相殘殺。 | — |
| l11 | 對白 | 10 | 87s | 這份神話的代價太高了。赫德，我來是想告訴你，資訊仲裁委員會已經完成了對你過去三年的審計。 | — |
| l12 | 對白 | 9 | 97s | 雖然你利用數據操縱了民意，但在現有法律框架下，我們無法追溯你的刑事責任。 | — |
| l14 | 對白 | 14 | 111s | 根據共識協議第十五條，因為你的操縱導致的社會成本，將由你的個人退休金與海外資產歸墊。這張紙，是你現在唯一的財富水平證明。 | — |
| l17 | 對白 | 9 | 137s | 老師，國會剛才通過了你的辭呈。你真的不打算留下來主導民主三點零的運行嗎。 | — |
| l18 | 對白 | 12 | 146s | 不。這套系統最美的地方在於，它不需要一個聖人來維持。只要邏輯還在，只要數據的門是開著的，它就能自我運轉。 | — |
| l19 | 對白 | 8 | 158s | 如果我留下來，我會變成另一個英雄，而英雄本身就是一種不穩定的變數。 | — |
| l21 | 對白 | 3 | 171s | 老師，您要去哪。 | — |
| l22 | 對白 | 10 | 174s | 去一個不需要我說話的地方。去看看那些不再被標籤定義的人們，是怎麼重新學習對話的。 | — |
| l23 | 旁白 | 11 | 184s | 歐若拉聯邦的夜晚降臨了。路燈自動感應亮起，亮度是精準的四十五勒克斯，那是經過數據計算後，最節能且最能保障治安的數值。 | ✅ |
| l25 | 旁白 | 8 | 201s | 標籤的雨停了。雖然空氣冷了一點，但每個人都能看清前方的路，以及路邊每一棵樹真實的顏色。 | ✅ |
| l26 | 旁白 | 4 | 209s | 這就是民主三點零。它不美，但它很誠實。 | ✅ |

> 場景區塊 l0 l2 l5 l13 l15 l16 l20 l24：無字幕（跳過）。
> 換算：`scale = 實際總秒數 / 213`。旁白以 `<i>...</i>` 包覆。

---

## 七、產出前自檢清單

- [x] 每支區塊只含一個主要事件；對話超長（≥20s）已拆（l6/l7、l11/l12、l18/l19）。
- [x] 對白／旁白逐字對照原文（line 666–715），僅做去引號、去標點、阿拉伯數字轉中文（民主 3.0→民主三點零、45 勒克斯→四十五勒克斯）。
- [x] `<d>` 內無 `%`、`&`、阿拉伯數字；畫面可見數字（電網負載、45 勒克斯）標註 `visible on-screen text / not spoken` 或轉中文。
- [x] 型別對應：場景無 `<d>`；對白 `Only <Subject N> speaks`；旁白固定 narrator voice 且共用 seed 310000。
- [x] `speaker_constraints` 全數排除旁白／第三人聲；對白加 `never English / no code-switching`。
- [x] `overall_soundscape` / `non_diegetic_music` 全數明寫；對白／旁白含台灣腔錨點句。
- [x] 稱謂直呼（林墨／總統閣下／老師／赫德）之被稱呼者不入前景，寫 `only <Subject N>'s mouth moves`。
- [x] ≥10s 人物鏡頭（l9 l14 l18）拆 `[Shot 1]/[Shot 2]`＋移動節點＋`no duplicate copies`。
- [x] seed 已避黑名單區段；旁白用 310000。

> **seed 黑名單**：`310000`（性別翻轉——Ch12 l1/l23/l26 連續三次輸出女聲，已不再安全；旁白 seed 一律避開）。
- [x] 參考圖全部存在（既有 5 張 + 新建 4 張，見 §2）；未用圖不入參數。
- [x] 解析度統一 352×608，合併順序 l0→l26。
- [x] 字幕資料表與區塊分割同步建立；合併後以 scale 換算產 `.srt`。

---

## 八、提交紀錄（2026-09-17，27 支）

| ID | duration | seed | prompt_id |
|----|----------|------|-----------|
| l0 | 7 | 493000 | 2fc2f03d-b251-405b-a879-0807522f6b93 |
| l1 | 6 | 310000 | ae554520-81d2-4a0f-97f7-4f69722531aa |
| l1 v2 | 6 | 310100 | a12a6965-253a-4b4a-9f77-817e8d125dfa |
| l2 | 6 | 493001 | 35faec6c-8fce-4035-b285-a80dea228112 |
| l3 | 6 | 310000 | 12745d09-03e8-4913-91ec-6834297fb0e6 |
| l4 | 11 | 310000 | 7a51b478-70bc-4a6b-b177-3796d593df3a |
| l5 | 6 | 493002 | 3bc67022-65ee-4dab-839a-f7126ed4a4e3 |
| l6 | 10 | 493003 | e9b939e7-a919-48df-a3c1-816154c39148 |
| l7 | 9 | 493004 | 0bf2a959-7f1c-412d-b349-5dc9b59d421b |
| l8 | 9 | 493005 | 2d651002-0fbd-488d-b107-7078959f68d4 |
| l9 | 12 | 493006 | b5430f0a-bd45-47a0-9c97-1f76e308afa4 |
| l10 | 5 | 493007 | e0afc9df-ed7f-4b09-b588-222d4c2dd542 |
| l11 | 10 | 493008 | 717f7935-f730-47ab-9d89-8545c293a2d0 |
| l12 | 9 | 493009 | 808b41be-03c7-48d8-806f-98eaf0e39d86 |
| l13 | 5 | 493010 | ea689983-1235-4976-83d6-9fffae68faba |
| l13 v2 | 5 | 493100 | b996d479-31fd-4c5b-8f0d-2dcc57c1e0f6 |
| l14 | 14 | 493011 | 7023603f-ccda-4b6b-a607-edc3e5e1ed69 |
| l15 | 6 | 493012 | 66c08822-4345-4a78-9e7a-69e54a657bbb |
| l16 | 6 | 493013 | d304ebb0-529f-4680-9ae6-21e1263ec5b8 |
| l17 | 9 | 493014 | 4f6f71dd-e213-4d07-b22f-f04a3924847c |
| l18 | 12 | 493015 | 1c368218-5c17-47ce-86b0-2ab1b566aee5 |
| l19 | 8 | 493016 | 1e9c9338-1a1e-40fe-a65d-8f91d414b87b |
| l20 | 5 | 493017 | 20eab4b7-65e5-4967-8ae5-f41fc5a41312 |
| l21 | 3 | 493018 | 11e5bc46-fc44-48c5-8f4b-7469a89091d9 |
| l22 | 10 | 493019 | 4238ee85-4e10-4be2-8f5e-65b7215bed07 |
| l23 | 11 | 310000 | 627f0704-2314-4e61-bc13-b0157bc38a47 |
| l23 v2 | 11 | 310101 | 53c617f6-25dc-44f9-aaa3-79db848d9241 |
| l24 | 6 | 493020 | 49995699-bbdc-4eb0-91d6-14ecf1b43e32 |
| l25 | 8 | 310000 | 616aadf5-9b81-4fd1-a5c4-7dda621cb8ab |
| l26 | 4 | 310000 | 6dd9185f-78ac-4aca-b7a9-795175012193 |
| l26 v2 | 4 | 310102 | 15fc9fdb-9144-4329-9af7-565dd8e842ca |

---