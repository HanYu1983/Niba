# Ch3 區塊獨立提示詞 — D0–D25（實作範例 5：第三章「共識協議的初稿」）

> 本文件承接 `novel_to_video_guide_v2.md`（一支影片＝一個區塊）與 `example3.md`（Ch2）、`example4_ch1.md`（Ch1），
> 完整產出**第三章「共識協議的初稿」**的區塊分割、參考圖分配與全部 26 支 r2v 六欄位提示詞。
>
> **章節功能**：林墨在研究室連夜起草《民主 3.0 協議》，被網軍洗版、被審計部查封預算，最後在斷電與搜索廣播中
> 交出隨身碟備份。情緒走向：壓抑孤獨（研究室深夜）→ 憤怒決意（敲下條文）→ 緊繃對峙（蘇菲通報）→
> 冷峻燃燒（斷電＋廣播）→ 堅定出走（金句收尾）。
> 登場角色：林墨（沿用既有肖像）、蘇菲（Ch3 已建肖像）；擴音器人聲只當場景聲、不進 `<d>`。

---

## 一、參考圖管理表（Step 1：一次性建置）

> 依 v2「可跨章共用」原則，林墨沿用 Ch1/Ch2 同一張 `Ref-M`（不重出）；Ch3 研究室／洗版螢幕／蘇菲三張
> 已在先前測試建置完成。本章**不需新建任何參考圖**。

| 編號 | 檔名（實際既有） | 內容 | 尺寸 | 用於區塊 |
|------|------|------|------|---------|
| Ref-M | `output/ch1_beat13_ref_char/zimage_00008_.png`（**共用**，同 Ch1/Ch2） | 林墨肖像：瘦削中年、灰絲黑髮、淺鬍茬、深炭灰西裝、皺白襯衫無領帶 | 832×1248 (2:3) | 所有含林墨的區塊 |
| Ref-O | `output/ch3_office_ref/zimage_00019_.png`（既有） | 研究室：深夜暗房、螢幕+桌燈唯二光源、桌上有復古離線筆電、紙堆、後方夜窗下見黑車 | 832×1248 | D0、D2–D23 研究室諸鏡 |
| Ref-Sc | `output/ch3_screen_ref/zimage_00020_.png`（既有） | 網軍洗版螢幕特寫：滾動中文攻擊留言、紅警徽、合成他國國旗下西裝男照片 | 832×1248 | D1（洗版）、D4 可參考 |
| Ref-Sph | `output/ch3_sophie_ref/zimage_00021_.png`（既有） | 蘇菲肖像：二十多歲、黑長髮鬆紮、素色深針織外套+白襯衫、蒼白憂慮、胸前抱一疊報表 | 832×1248 | D10–D18 蘇菲諸鏡 |
| Ref-Bn | `output/ch1_beat12_ref_zit/zimage_00014_.png`（既有） | 邊境檢拾情境特寫：手遞彩鈔、火爐燃燒廢紙 | 832×1248 | D24（邊境廢幣記憶閃回） |

> **建置狀態**：四張皆為既有檔案，Ch3 正式投產不需新圖。

---

## 二、總表：區塊分割與計秒

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留緩神餘裕進位；場景按動作粗估、寧短勿長。
> 原文範圍：`story1.md` 第三章（lines 124–187）。全部合併規劃約 **174 秒**。

| # | 類型 | 內容 | 秒 |
|---|------|------|----|
| D0 | 場景 | 研究室定場：深夜、螢幕/桌燈唯二光源、樓下暗見黑車（lines 124–126） | 4 |
| D1 | 場景 | 網軍洗版螢幕特寫：滾動攻擊留言、合成照片閃爍（line 128） | 6 |
| D2 | 旁白 | 「這就是民主二點零的現狀：真相在抵達終點前，就已經被情緒和演算法殺死了。」（line 130） | 7 |
| D3 | 場景 | 林墨拉開抽屜、取出完全離線的復古筆電（line 132） | 4 |
| D4 | 場景 | 筆電螢幕浮現草案暫定標題《民主 3.0：國家公共資訊與共識演算協議》（line 134） | 4 |
| D5 | 對白 | 林墨：「第一章，總則。」手指在鍵盤上飛舞（line 136） | 3 |
| D6 | 場景 | 第一條去人格化義務條文於螢幕浮現（lines 138–139） | 4 |
| D7 | 旁白 | 「他腦中浮現出法庭上那名檢察官的嘴臉…於是，他敲下了第二條」（lines 141, 143） | 10 |
| D8 | 場景 | 第二條數據對等與溯源義務條文：偏差逾百分之五→二十四小時數據公聽會（lines 143–145） | 7 |
| D9 | 旁白 | 「這條規則將會徹底改變權力結構…政府必須『證明自己對』」（line 147） | 10 |
| D10 | 場景 | 門被推開：蘇菲蒼白、手持一疊報表走進（line 149） | 4 |
| D11 | 對白 | 蘇菲：「林老師，剛才審計部傳來消息…有『挪用公帑進行顛覆性研究』的嫌疑。」（line 151） | 13 |
| D12 | 對白 | 林墨：「這不意外…蘇菲，妳怕嗎？」（line 153） | 9 |
| D13 | 場景 | 蘇菲望向窗外：樓下黑色行政調查車待命（line 155） | 4 |
| D14 | 對白 | 蘇菲：「我怕的是…以後歐若拉聯邦就再也沒有『數字』，只有『口號』了。」（line 155） | 9 |
| D15 | 對白 | 林墨：「所以，我們要加入這部法案最致命的一條。」（line 157） | 5 |
| D16 | 場景 | 敲下第三章標題「行政行為之迴力鏢機制」與第十五條條文（lines 159–162） | 6 |
| D17 | 對白 | 蘇菲：「這會讓他們發瘋的…用國家的錢來洗國家腦的鏈條。」（line 164） | 8 |
| D18 | 對白 | 林墨：「這不只是切斷鏈條…叫作『個人風險』。」（line 166） | 14 |
| D19 | 場景 | 電力閃爍後徹底斷電；復古筆電螢幕因電池老化漸暗（lines 168–170） | 5 |
| D20 | 場景 | 黑暗中窗外擴音器廣播搜索（場景聲）：國家安全局審計小組停請止作業（line 172） | 7 |
| D21 | 場景 | 林墨黑暗闔上筆電、從內袋抽出隨身碟（line 174） | 4 |
| D22 | 對白 | 林墨：「蘇菲，從後門走。這份協議不需要存在電腦裡，它只需要出現在國會的發言台上。」（line 176） | 10 |
| D23 | 場景 | 林墨起身、整理領帶、紅光掠過剪影（line 178） | 4 |
| D24 | 場景 | 記憶閃回：邊境那張千萬面額的廢幣（line 180） | 5 |
| D25 | 旁白 | 「標籤是熱的，但真相是冷的。而冷的事實，才能讓一個發燒的國家清醒過來。」（line 182） | 8 |

> 全表 **26 個區塊**（D0–D25），其中旁白 4 個：**D2 / D7 / D9 / D25**，皆純旁白、沿用 `seed=310000`（見第 6 節）。
> 與 Ch1/Ch2 相同：對白/旁白區塊的 `summary` 只寫英文名詞片語、非 `<d>` 欄位不出現中文完整句。

---

## 三、區塊 × 參考圖對照

| 區塊 | 類型 | ref_image_0 | ref_image_1 | ref_image_2 | duration |
|------|------|-------------|-------------|-------------|----------|
| D0 | 場景 | Ref-O 研究室 | — | — | 4 |
| D1 | 場景 | Ref-Sc 洗版螢幕 | — | — | 6 |
| D2 | 旁白 | Ref-M 林墨 | Ref-O 研究室 | — | 7 |
| D3 | 場景 | Ref-M 林墨 | Ref-O 研究室 | — | 4 |
| D4 | 場景 | Ref-O 研究室(筆電特寫) | Ref-M 林墨 | — | 4 |
| D5 | 對白 | Ref-M 林墨 | Ref-O 研究室 | — | 3 |
| D6 | 場景 | Ref-M 林墨 | Ref-O 研究室(螢幕條文) | — | 4 |
| D7 | 旁白 | Ref-M 林墨 | Ref-O 研究室 | — | 10 |
| D8 | 場景 | Ref-O 研究室(條文螢幕) | Ref-M 林墨 | — | 7 |
| D9 | 旁白 | Ref-M 林墨 | Ref-O 研究室 | — | 10 |
| D10 | 場景 | Ref-Sph 蘇菲 | Ref-O 研究室 | — | 4 |
| D11 | 對白 | Ref-Sph 蘇菲 | Ref-M 林墨 | Ref-O 研究室 | 13 |
| D12 | 對白 | Ref-M 林墨 | Ref-Sph 蘇菲 | Ref-O 研究室 | 9 |
| D13 | 場景 | Ref-Sph 蘇菲 | Ref-O 研究室(夜窗黑車) | — | 4 |
| D14 | 對白 | Ref-Sph 蘇菲 | Ref-M 林墨 | Ref-O 研究室 | 9 |
| D15 | 對白 | Ref-M 林墨 | Ref-O 研究室 | — | 5 |
| D16 | 場景 | Ref-O 研究室(筆電螢幕) | Ref-M 林墨 | — | 6 |
| D17 | 對白 | Ref-Sph 蘇菲 | Ref-M 林墨 | — | 8 |
| D18 | 對白 | Ref-M 林墨 | Ref-Sph 蘇菲 | — | 14 |
| D19 | 場景 | Ref-M 林墨 | Ref-O 研究室(暗) | — | 5 |
| D20 | 場景 | Ref-M 林墨 | Ref-O 研究室(暗+窗外紅光) | — | 7 |
| D21 | 場景 | Ref-M 林墨 | Ref-O 研究室(暗) | — | 4 |
| D22 | 對白 | Ref-M 林墨 | Ref-O 研究室(暗) | — | 10 |
| D23 | 場景 | Ref-M 林墨 | Ref-O 研究室(暗) | — | 4 |
| D24 | 場景 | Ref-Bn 邊境廢幣 | — | — | 5 |
| D25 | 旁白 | Ref-M 林墨 | Ref-O 研究室(暗) | — | 8 |

> 未餵 `ref_image_N` 一律省略（勿留空檔名殘留污染，見 v2 §3）。
> 擴音器廣播視為場景聲（`overall_soundscape` 內描述），不寫 `<d>`，畫面上無需對嘴角色。

---

## D0 — 研究室定場（場景，無對白，4 秒）

> **來源**：`story1.md` lines 124–126。

```
subject_definitions:
<Subject 1> is the research office from <Picture 1>:
a dim political research office at night, only light from a glowing desktop monitor and a small desk lamp, desk with an open vintage offline laptop with worn plastic keys, stacks of paper reports and folders, night window showing a dark city with distant lights and a few black administrative cars waiting along the street below.

summary:
Reference-based establishing shot.
Dim research office at night.
Wide static shot, computer hum only.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Wide static shot, single source of screen light, gritty film look.

[Shot 1]

00:00-00:04

Action:
Wide establishing shot of the dim research office: the desktop monitor glows alone on the desk, the open vintage laptop beside it, stacks of paper and folders in shadow, the night window behind showing a dark city with a few black cars waiting along the street below. No people.

overall_soundscape:
The low hum of the desktop computer and the faint whir of the vintage laptop fan, muffled night traffic far below, no human voice.

non_diegetic_music:
A cold minimal electronic tone bed, flat and patient, barely audible.
```

**參數**：`ref_image_0=output/ch3_office_ref/zimage_00019_.png（既有）, duration=4, seed=440001, out=ch3_d0_video`

---

## D1 — 網軍洗版（場景，無對白，6 秒）

> **來源**：`story1.md` line 128。社群帳號被機器人帳號洗版、合成照片。

```
subject_definitions:
<Subject 1> is the hostile comment storm on the monitor from <Picture 1>:
a social-media feed flooded with thousands of identical short Chinese attack comments scrolling downward, gray-blue interface crowded with red warning badges, unread-message counters climbing, one obviously fabricated photograph of a suited man standing under a foreign flag flickering among the posts.

summary:
Reference-based screen extreme close-up.
Hostile comment flood scrolling down.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey documentary footage.
Harsh blue monitor light, macro screen close-up.

[Shot 1]

00:00-00:06

Action:
Extreme close-up of the monitor: thousands of identical short Chinese attack comments scroll downward in a dense stream, red warning badges and unread counters climbing into the tens of thousands, one fabricated photo of a suited man standing under a foreign flag flickering among the bots in a cold loop.

overall_soundscape:
The rapid staccato of notification chimes firing in waves, the low whir of the desktop fan, no human voice.

non_diegetic_music:
Nervous flat electronic ticks aligned to the message chimes, cold and relentless.
```

**參數**：`ref_image_0=output/ch3_screen_ref/zimage_00020_.png（既有）, duration=6, seed=440002, out=ch3_d1_video`

---

## D2 — 民主二點零的現狀（旁白，7 秒）

> **旁白全文（約 31 字，5 字/秒 ≈ 7s）**：
> 「這就是民主二點零的現狀：真相在抵達終點前，就已經被情緒和演算法殺死了。」
>
> ⚠️ 「2.0」寫**中文數字**「二點零」（`<d>` 內禁阿拉伯數字）。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, sitting motionless by the glow of a monitor.

<Subject 2> is the research office from <Picture 2>:
dim night office, single screen light, dark stacks of paper, night window behind.

summary:
Reference-based narration montage.
Static medium shot, screen light.
No character speaks in frame.
The situation is narrated.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame.
Narration by the fixed narrator voice only.
No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Static medium shot, shallow depth of field.

[Shot 1]

00:00-00:07

Action:
Lin Mo sits alone before the glowing monitor in the dim office, the blue screen light mapping across his tired unmoving face, the comment storm reflecting on the glass beside him. He does not blink.

Narration:
<Narrator> says:

<d>
[中文]
這就是民主二點零的現狀：真相在抵達終點前，就已經被情緒和演算法殺死了。
</d>

overall_soundscape:
Narration delivered in a low, calm, middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
No character speaks in frame.
Low computer hum, faint message chimes dying down.

non_diegetic_music:
A sparse dissonant two-note pulse under the flat narration.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=7, seed=310000（旁白專用，見第 6 節）, out=ch3_d2_video`

---

## D3 — 取出離線筆電（場景，無對白，4 秒）

> **來源**：`story1.md` line 132。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt.

<Subject 2> is the research office from <Picture 2>:
dim night office, desk with a closed desktop monitor and a desk lamp, stacks of paper, a drawer half open.

summary:
Reference-based office action shot.
Lin Mo opens a drawer.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium shot, shallow depth of field.

[Shot 1]

00:00-00:04

Action:
Lin Mo leans down over the desk, pulls open the bottom drawer, and takes out a vintage offline laptop with worn plastic keys, its casing scuffed with years of use, holding it in both hands for a moment before setting it on the desk.

overall_soundscape:
The soft scrape of the drawer, paper shifting, a quiet precise clatter as the laptop is set down, low room hum, no human voice.

non_diegetic_music:
A quiet mechanical pulse, patient and cold.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=4, seed=440003, out=ch3_d3_video`

---

## D4 — 草案暫定標題（場景，無對白，4 秒）

> **來源**：`story1.md` line 134。螢幕畫面文字：《民主 3.0：國家公共資訊與共識演算協議》（畫面文字，不進 `<d>`）。

```
subject_definitions:
<Subject 1> is the research office desk from <Picture 1>:
dim office desk with an open vintage offline laptop, its screen glowing, stacks of paper in shadow.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit.

summary:
Reference-based drafting shot.
Vintage laptop screen shows draft title.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium-close on the laptop screen, pale glow, shallow depth of field.

[Shot 1]

00:00-00:04

Action:
Close-up of the open vintage laptop: its screen flickers and resolves into a draft title with a blinking cursor — a formal protocol title line about public information and a consensus algorithm, the words "DEMOCRACY 3.0" faintly visible at the top, cold pale light washing over the worn keys; Lin Mo's hands rest beside it.

overall_soundscape:
The soft whir of the aging laptop fan, a faint electrical hum, no human voice.

non_diegetic_music:
A single sustained low tone, expectant.
```

**參數**：`ref_image_0=output/ch3_office_ref/zimage_00019_.png（既有）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, duration=4, seed=440004, out=ch3_d4_video`

---

## D5 — 「第一章，總則。」（對白，3 秒）

> **來源**：`story1.md` line 136。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit and wrinkled white shirt, hands at the keyboard of a vintage laptop.

<Subject 2> is the research office from <Picture 2>:
dim night office, the open vintage laptop glowing on the desk, dark stacks of paper.

summary:
Reference-based office close-up.
Lin Mo types and speaks one line.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium-close shot, shallow depth of field.

[Shot 1]

00:00-00:03

Action:
Lin Mo's fingers fly across the worn keyboard, the first words of the draft landing on the screen, and he murmurs the line aloud without looking up.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
第一章，總則。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The rhythmic clatter of typing, low laptop whir.
No other speech.

non_diegetic_music:
A sparse two-note ambient pulse, patient.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=3, seed=440005, out=ch3_d5_video`

---

## D6 — 第一條 去人格化義務（場景，無對白，4 秒）

> **來源**：`story1.md` lines 138–139。條文為螢幕畫面文字，不進 `<d>`、不被唸出。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, dark charcoal suit, hands resting at the keyboard of a vintage laptop.

<Subject 2> is the research office from <Picture 2>:
dim night office, the open vintage laptop screen glowing with text, cold pale light.

summary:
Reference-based drafting shot.
Clause text scrolls on the laptop screen.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium-close on screen and hands, shallow depth of field.

[Shot 1]

00:00-00:04

Action:
Close-up of the laptop screen: the clauses of an article titled about de-personalization scroll and settle into lines — forbidding personal names, portraits and emotionally charged labels in official policy information — the cold cursor blinking under the last clause; Lin Mo's fingers poised above the keys in the foreground.

overall_soundscape:
Soft rhythmic keystrokes, the low whir of the aging laptop, no human voice.

non_diegetic_music:
A sparse steady two-note ambient pulse, mechanical.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=4, seed=440006, out=ch3_d6_video`

---

## D7 — 檢察官的嘴臉（旁白，10 秒）

> **旁白全文（約 47 字，5 字/秒 ≈ 10s）**：
> 「他腦中浮現出法庭上那名檢察官的嘴臉。對方不斷強調『立場』，卻從不討論『統計模型』。於是，他敲下了第二條。」

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, cold hard look, dark charcoal suit.

<Subject 2> is the research office from <Picture 2>:
dim night office, the open vintage laptop glowing, shadows of the room around.

summary:
Reference-based narration montage.
Slow push-in on Lin Mo's face.
No character speaks in frame.
The memory is narrated.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame.
Narration by the fixed narrator voice only.
No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Slow push-in, shallow depth of field.

[Shot 1]

00:00-00:05

Action:
Lin Mo sits motionless, staring at the dark between keystrokes, a faint grimace crossing his face as the memory of the courtroom prosecutor surfaces in his still eyes — a man who kept repeating the word "position" and never once mentioned "statistical model".

Narration:
<Narrator> says:

<d>
[中文]
他腦中浮現出法庭上那名檢察官的嘴臉。對方不斷強調「立場」，卻從不討論「統計模型」。
</d>

[Shot 2]

00:05-00:10

Action:
His hands come down and strike the keys hard, decisive, the next article heading snapping onto the screen with a decisive motion.

Narration:
<Narrator> says:

<d>
[中文]
於是，他敲下了第二條。
</d>

overall_soundscape:
Narration delivered in a low, calm, middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
No character speaks in frame.
Sharp keystrokes, low laptop hum.

non_diegetic_music:
A low restrained cello line climbing slightly with the second strike.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=10, seed=310000（旁白專用，見第 6 節）, out=ch3_d7_video`

---

## D8 — 第二條 數據對等與溯源義務（場景，無對白，7 秒）

> **來源**：`story1.md` lines 143–145。條文為螢幕畫面文字；若畫面文字含「5%」以畫面呈現，不被唸出。

```
subject_definitions:
<Subject 1> is the research office desk from <Picture 1>:
dim office desk with an open vintage offline laptop, screen glowing with a dense clause text, cold pale light, paper stacks in shadow.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, dark charcoal suit, leaning forward.

summary:
Reference-based drafting shot.
Long clause text scrolls on the laptop screen.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium-close on screen, slow scroll, shallow depth of field.

[Shot 1]

00:00-00:07

Action:
Close-up of the laptop screen as a long second article scrolls into view — a rule obliging the government to disclose raw data and formulas behind any quantitative figure, with a hard threshold at a five percent deviation requiring a public data hearing within twenty-four hours — the text dense and precise, the cursor moving down clause by clause; Lin Mo's silhouette leans in to read.

overall_soundscape:
The soft tick of each keystroke, the whir of the aging laptop, dead-silent room, no human voice.

non_diegetic_music:
A steady two-note ambient pulse under near silence, patient and mechanical.
```

**參數**：`ref_image_0=output/ch3_office_ref/zimage_00019_.png（既有）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, duration=7, seed=440007, out=ch3_d8_video`

---

## D9 — 改變權力結構（旁白，10 秒）

> **旁白全文（約 48 字，5 字/秒 ≈ 10s）**：
> 「這條規則將會徹底改變權力結構。在過去，政府用『你怎麼證明我錯』來封殺異議；而在這套協議下，政府必須『證明自己對』。」

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, steady unblinking eyes, dark charcoal suit, hands on the keyboard.

<Subject 2> is the research office from <Picture 2>:
dim night office, the open vintage laptop glowing, cold shadows.

summary:
Reference-based narration montage.
Static medium shot on Lin Mo typing.
No character speaks in frame.
The rule change is narrated.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame.
Narration by the fixed narrator voice only.
No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Static medium shot, shallow depth of field.

[Shot 1]

00:00-00:05

Action:
Lin Mo pauses above the keys, considering the clause he has written, the cold light of the screen still on his face as the weight of what the rule reshapes settles behind his eyes.

Narration:
<Narrator> says:

<d>
[中文]
這條規則將會徹底改變權力結構。在過去，政府用「你怎麼證明我錯」來封殺異議；而在這套協議下，政府必須「證明自己對」。
</d>

[Shot 2]

00:05-00:10

Action:
A slow push toward his hands as they resume the keyboard, the clause text reflected faintly in his glasses, the room silent behind him.

overall_soundscape:
Narration delivered in a low, calm, middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
No character speaks in frame.
Soft keystrokes, low laptop hum.

non_diegetic_music:
A low cello line with sparse piano notes, swelling faintly and thinning to silence.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=10, seed=310000（旁白專用，見第 6 節）, out=ch3_d9_video`

---

## D10 — 門被推開（場景，無對白，4 秒）

> **來源**：`story1.md` lines 149–151。

```
subject_definitions:
<Subject 1> is the young research assistant Sophie from <Picture 1>:
mid-20s East Asian female, long straight black hair loosely tied back, pale worried face, plain dark cardigan over a white blouse, holding a stack of paper reports pressed against her chest.

<Subject 2> is the research office from <Picture 2>:
dim night office, desk with the glowing vintage laptop, cold lamplight, night window.

summary:
Reference-based entrance shot.
A door opens, Sophie steps in.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium shot from inside the office, shallow depth of field.

[Shot 1]

00:00-00:04

Action:
The office door is pushed quietly open; Sophie stands just inside the doorway in the cold light, pale, holding a stack of paper reports against her chest, glancing past the desk to Lin Mo in the lamplight without yet speaking.

overall_soundscape:
The quiet click and soft creak of the door, the rustle of paper reports, the low laptop hum, no human voice.

non_diegetic_music:
A low restrained tension tone, expectant.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png（既有）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=4, seed=440008, out=ch3_d10_video`

---

## D11 — 「有『挪用公帑進行顛覆性研究』的嫌疑。」（對白，13 秒）

> **來源**：`story1.md` line 151。

```
subject_definitions:
<Subject 1> is the young research assistant Sophie from <Picture 1>:
mid-20s East Asian female, long straight black hair loosely tied back, pale worried face, plain dark cardigan over a white blouse, holding a stack of paper reports against her chest.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit, seated at the glowing laptop.

<Subject 3> is the research office from <Picture 3>:
dim night office, desk with the open laptop, night window behind.

summary:
Reference-based office two-shot.
Sophie reports bad news by the doorway.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Two-shot, shallow depth of field.

[Shot 1]

00:00-00:13

Action:
Sophie steadies herself against the door frame, pale face in the cold overhead light, and delivers the report low and evenly while Lin Mo remains seated at the desk, his hands paused above the keys.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林老師，剛才審計部傳來消息，他們要查封我們研究室去年的預算。他們說……我們有「挪用公帑進行顛覆性研究」的嫌疑。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The rustle of the reports, the low laptop hum, dead-silent room.
No other speech.

non_diegetic_music:
A low restrained cello line with sparse piano, swelling faintly under the tension.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png（既有）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_2=output/ch3_office_ref/zimage_00019_.png（既有）, duration=13, seed=440009, out=ch3_d11_video`

---

## D12 — 「蘇菲，妳怕嗎？」（對白，9 秒）

> **來源**：`story1.md` line 153。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, composed weary expression, dark charcoal suit, seated at the glowing laptop, not stopping his work.

<Subject 2> is the young research assistant Sophie from <Picture 2>:
mid-20s East Asian female, long black hair loosely tied back, pale worried face, plain dark cardigan, holding a stack of reports.

<Subject 3> is the research office from <Picture 3>:
dim night office, the open laptop glowing, night window.

summary:
Reference-based office two-shot.
Lin Mo answers without stopping.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Two-shot, shallow depth of field.

[Shot 1]

00:00-00:09

Action:
Lin Mo keeps his hands moving on the keyboard as he answers, steady and dry, glancing up at Sophie once at the word "you"; she stands by the doorframe, listening.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這不意外。他們想在法案送入國會前，先從財政上閹割我。蘇菲，妳怕嗎？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Rhythmic typing continuing under the line, low laptop hum.
No other speech.

non_diegetic_music:
A low restrained cello line under the hushed room.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_sophie_ref/zimage_00021_.png（既有）, ref_image_2=output/ch3_office_ref/zimage_00019_.png（既有）, duration=9, seed=440010, out=ch3_d12_video`

---

## D13 — 樓下的黑車（場景，無對白，4 秒）

> **來源**：`story1.md` line 155。

```
subject_definitions:
<Subject 1> is the young research assistant Sophie from <Picture 1>:
mid-20s East Asian female, long black hair loosely tied back, pale worried face, plain dark cardigan, standing at a night window.

<Subject 2> is the research office from <Picture 2>:
dim night office, night window overlooking a dark city street below with a few black administrative cars waiting.

summary:
Reference-based view shot.
Sophie looks down at waiting black cars.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium close from behind, shallow depth of field.

[Shot 1]

00:00-00:04

Action:
Sophie stands at the night window seen from behind, looking down; below the building a few black administrative cars wait along the street, cold streetlight glinting off their roofs, their engines idling faintly.

overall_soundscape:
Muffled street sounds through the window, distant car idle, faint night siren far away, no human voice.

non_diegetic_music:
A low ominous drone creeping in steadily.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png（既有）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=4, seed=440011, out=ch3_d13_video`

---

## D14 — 「再也沒有『數字』，只有『口號』了。」（對白，9 秒）

> **來源**：`story1.md` line 155。

```
subject_definitions:
<Subject 1> is the young research assistant Sophie from <Picture 1>:
mid-20s East Asian female, long straight black hair loosely tied back, pale worried face, plain dark cardigan over a white blouse, holding a stack of reports.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit, seated at the glowing laptop.

<Subject 3> is the research office from <Picture 3>:
dim night office, the open laptop glowing, night window behind.

summary:
Reference-based office two-shot.
Sophie speaks her fear facing the window.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Two-shot, shallow depth of field.

[Shot 1]

00:00-00:09

Action:
Sophie turns from the window toward the desk, paler than before, and says the line low and even, her hands tightening around the reports; Lin Mo watches her from the keyboard without moving.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
我怕的是，如果我們這次輸了，以後歐若拉聯邦就再也沒有「數字」，只有「口號」了。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The rustle of the reports, low laptop hum, muffled street sound.
No other speech.

non_diegetic_music:
A low restrained cello line with a sparse piano note, heavy and quiet.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png（既有）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_2=output/ch3_office_ref/zimage_00019_.png（既有）, duration=9, seed=440012, out=ch3_d14_video`

---

## D15 — 「最致命的一條。」（對白，5 秒）

> **來源**：`story1.md` line 157。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, a hard decisive look, dark charcoal suit, hands at the keyboard.

<Subject 2> is the research office from <Picture 2>:
dim night office, the open vintage laptop glowing, cold lamplight.

summary:
Reference-based office two-shot.
Lin Mo announces the fatal clause.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium-close shot, shallow depth of field.

[Shot 1]

00:00-00:05

Action:
Lin Mo stops typing and turns to face the doorway, the screen light catching half his face; he speaks with flat certainty.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
所以，我們要加入這部法案最致命的一條。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The typing stops, the laptop hum settles, room silent.
No other speech.

non_diegetic_music:
A low restrained tension tone, tightening.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=5, seed=440013, out=ch3_d15_video`

---

## D16 — 第三章標題與第十五條（場景，無對白，6 秒）

> **來源**：`story1.md` lines 159–162。螢幕畫面文字：第三章標題「行政行為之迴力鏢機制」與第十五條條文，不進 `<d>`。

```
subject_definitions:
<Subject 1> is the research office desk from <Picture 1>:
dim office desk with an open vintage offline laptop, screen glowing with a new chapter heading and a long clause text, cold pale light.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, dark charcoal suit, leaning forward to type.

summary:
Reference-based drafting shot.
A chapter title and clause land on screen.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium-close on the laptop screen, slow push, shallow depth of field.

[Shot 1]

00:00-00:06

Action:
Close-up of the laptop screen as Lin Mo types a new chapter heading — a mechanism title about administrative action rebounding on its makers — followed by a long dense clause about personal liability for politically-motivated budgets, the words landing line by line under the blinking cursor; his fingers strike the keys in view at the bottom edge.

overall_soundscape:
Sharp decisive keystrokes, the low whir of the aging laptop, dead-silent room, no human voice.

non_diegetic_music:
A rising two-note ambient pulse, mechanical and patient.
```

**參數**：`ref_image_0=output/ch3_office_ref/zimage_00019_.png（既有）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, duration=6, seed=440014, out=ch3_d16_video`

---

## D17 — 「切斷了鏈條。」（對白，8 秒）

> **來源**：`story1.md` line 164。

```
subject_definitions:
<Subject 1> is the young research assistant Sophie from <Picture 1>:
mid-20s East Asian female, long straight black hair loosely tied back, pale face, plain dark cardigan over a white blouse, clutching a stack of reports.

<Subject 2> is the border economist Lin Mo from <Picture 2>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, tired eyes, dark charcoal suit, seated at the glowing laptop.

summary:
Reference-based office two-shot.
Sophie gasps a quiet reaction.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Two-shot, shallow depth of field.

[Shot 1]

00:00-00:08

Action:
Sophie takes a low sharp breath, her eyes widening as she reads the line that just landed on the laptop screen, and she whispers the reaction, half to herself, half to Lin Mo.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這會讓他們發瘋的。這等於是切斷了他們用國家的錢來洗國家腦的鏈條。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
A soft gasp, the rustle of paper, low laptop hum.
No other speech.

non_diegetic_music:
A low restrained cello line with a faint rising pulse.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png（既有）, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, duration=8, seed=440015, out=ch3_d17_video`

---

## D18 — 「叫作『個人風險』。」（對白，14 秒）

> **來源**：`story1.md` line 166。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, a cool sharp light in his eyes, dark charcoal suit, standing turn from the desk.

<Subject 2> is the young research assistant Sophie from <Picture 2>:
mid-20s East Asian female, long black hair tied back, pale face, plain dark cardigan, holding reports.

summary:
Reference-based office two-shot.
Lin Mo states his intent coldly.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Two-shot, shallow depth of field.

[Shot 1]

00:00-00:14

Action:
Lin Mo turns slowly from the keyboard toward Sophie, a cold light passing across his eyes, and speaks with quiet force, each phrase landing separately; Sophie holds still, listening.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這不只是切斷鏈條。這是要讓那些習慣躲在「國家利益」這塊盾牌後面的政客，第一次感覺到什麼叫作「個人風險」。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
The room dead silent under his words, low laptop hum only.
No other speech.

non_diegetic_music:
A low ominous drone climbing slowly under the line, holding to the last word.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_sophie_ref/zimage_00021_.png（既有）, duration=14, seed=440016, out=ch3_d18_video`

---

## D19 — 斷電（場景，無對白，5 秒）

> **來源**：`story1.md` lines 168–170。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, dark charcoal suit, seated before the laptop in the darkening room.

<Subject 2> is the research office from <Picture 2>:
dim night office, the open vintage laptop screen flickering, lights dying, cold night window glow.

summary:
Reference-based power-cut shot.
Lights flicker and die.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium shot, stark dark framing.

[Shot 1]

00:00-00:05

Action:
The office lights flicker once and die, plunging the room into darkness except for the pale glow of the vintage laptop screen, which begins to dim steadily as its aging battery drains; Lin Mo sits motionless in the dying light.

overall_soundscape:
The sharp pop of the power cut, the dying whine of the laptop fan dropping away, distant city hum cut off, ringing silence, no human voice.

non_diegetic_music:
A low ominous drone with a heartbeat-like pulse, tightening.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=5, seed=440017, out=ch3_d19_video`

---

## D20 — 黑暗與搜索廣播（場景，廣播為場景聲，7 秒）

> **來源**：`story1.md` line 172。擴音器廣播內容只入 `overall_soundscape`（背景聲），不寫 `<d>`。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, calm unreadable face, dark charcoal suit, seated in the dark office.

<Subject 2> is the research office from <Picture 2>:
near-dark night office, dying laptop glimmer, cold night window light and one red emergency glow sweeping outside.

summary:
Reference-based dark-room shot.
Amplified order from outside.
No on-screen character speaks.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame.
No narration.
No voice-over.
Off-screen amplifier order is environmental sound only.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Nearly black frame, one red glow, very still camera.

[Shot 1]

00:00-00:07

Action:
In the near-dark office, the pale laptop glow dies to a faint sliver; outside the window a red emergency light sweeps past. Lin Mo sits completely still, face half-lit by the cold window, listening.

overall_soundscape:
A distorted amplified loudspeaker order from outside — a security audit team ordering him to stop all electronic work and cooperate with a search (background, not a character line) — the click of silence inside, distant sirens in the night city.

non_diegetic_music:
A low ominous drone with a heartbeat pulse, holding a cold held tone.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=7, seed=440018, out=ch3_d20_video`

---

## D21 — 闔蓋、抽隨身碟（場景，無對白，4 秒）

> **來源**：`story1.md` line 174。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, calm face, dark charcoal suit.

<Subject 2> is the research office from <Picture 2>:
near-dark night office, the dead open vintage laptop on the desk, faint red glow from outside.

summary:
Reference-based dark action shot.
Lin Mo closes the laptop, draws a USB.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Close-up, very shallow depth of field, red glow.

[Shot 1]

00:00-00:04

Action:
Close-up as Lin Mo's hand presses the laptop lid shut with a soft click in the dark, then slips inside his suit jacket and draws out a slim USB stick, holding it in the dim red-swept light for a moment before tucking it into his palm.

overall_soundscape:
The soft click of the lid closing, fabric rustling, the dying whine already gone, distant sirens, no human voice.

non_diegetic_music:
A low held dark tone, dead-softening.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=4, seed=440019, out=ch3_d21_video`

---

## D22 — 「蘇菲，從後門走。」（對白，10 秒）

> **來源**：`story1.md` line 176。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, calm unshaken face in the dark, dark charcoal suit, a USB in his hand.

<Subject 2> is the research office from <Picture 2>:
near-dark night office, closed laptop on the desk, faint red glow from outside.

summary:
Reference-based dark-room close-up.
Lin Mo speaks calmly to Sophie off-frame.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Close-up on hand and USB, half-dark, subtle red glow.

[Shot 1]

00:00-00:10

Action:
Close-up of Lin Mo's hand holding the slim USB in the dim red-swept light; he speaks low and evenly without looking up, the words steady as a sealed order.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
蘇菲，從後門走。這份協議不需要存在電腦裡，它只需要出現在國會的發言台上。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
Dead silence of the dark room, faint sirens far outside.
No other speech.

non_diegetic_music:
A low, ominous drone holding cold under the line, then thinning.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=10, seed=440020, out=ch3_d22_video`

---

## D23 — 起身、整領帶（場景，無對白，4 秒）

> **來源**：`story1.md` line 178。

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, hard resolute face, dark charcoal suit, rising from the desk.

<Subject 2> is the research office from <Picture 2>:
near-dark night office, closed laptop, one red emergency glow sweeping across the walls.

summary:
Reference-based dark-room shot.
Lin Mo rises and straightens his tie.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Medium shot, red strobe on silhouette.

[Shot 1]

00:00-00:04

Action:
Lin Mo rises from the desk in the half-dark, straightens his tie with both hands, the red emergency light stroking across his silhouette as he stands still for a moment before moving toward the door.

overall_soundscape:
The scrape of the chair, fabric rustling as he settles his tie, a faint distant siren, no human voice.

non_diegetic_music:
A low held dark tone with a quiet forward pulse.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=4, seed=440021, out=ch3_d23_video`

---

## D24 — 邊境廢幣記憶（場景，無對白，5 秒）

> **來源**：`story1.md` line 180。記憶閃回，借用 Ch1 邊境檢拾情境參考圖。

```
subject_definitions:
<Subject 1> is the border trade close-up from <Picture 1>:
a dusty hand passing a brightly colored oversized banknote across a crude counter, a small stove burning waste banknotes in the background, harsh border sunlight.

summary:
Reference-based memory flashback.
Macro of a huge banknote by a stove.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks.
No narration.
No voice-over.

detailed_description:

Visual style:
Overexposed hot border midday, harsh sunlight, documentary macro, brief flashback texture with a slow fade at the end.

[Shot 1]

00:00-00:05

Action:
Macro of the dusty hand holding up a vividly colored oversized banknote against the harsh border sun, a stove behind burning whole stacks of the same notes; the image holds a second, then begins to fade into darkness.

overall_soundscape:
Border desert wind, the crackle of the burning stove fire, fading into the dark room's silence, no human voice.

non_diegetic_music:
A single low piano note ringing, cut off by the fade.
```

**參數**：`ref_image_0=output/ch1_beat12_ref_zit/zimage_00014_.png（既有）, duration=5, seed=440022, out=ch3_d24_video`

---

## D25 — 標籤是熱的，真相是冷的（旁白，8 秒）

> **旁白全文（約 37 字，5 字/秒 ≈ 8s）**：
> 「標籤是熱的，但真相是冷的。而冷的事實，才能讓一個發燒的國家清醒過來。」

```
subject_definitions:
<Subject 1> is the border economist Lin Mo from <Picture 1>:
thin, middle-aged East Asian male, gray-flecked black hair, short stubble, steady resolute eyes in the half-dark, dark charcoal suit.

<Subject 2> is the research office from <Picture 2>:
near-dark night office, closed laptop, cold window glow, one last red sweep fading.

summary:
Reference-based closing narration shot.
Static medium shot in the dark.
No character speaks in frame.
The closing line is narrated.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame.
Narration by the fixed narrator voice only.
No on-screen mouth movement.

detailed_description:

Visual style:
Cold blue-grey night documentary footage.
Static medium shot, the red glow dying to near-black.

[Shot 1]

00:00-00:08

Action:
Lin Mo stands in the half-dark of the office, the last red emergency glow sweeping across and dying, his resolute profile held still against the cold window; the image slowly dims to darkness.

Narration:
<Narrator> says:

<d>
[中文]
標籤是熱的，但真相是冷的。而冷的事實，才能讓一個發燒的國家清醒過來。
</d>

overall_soundscape:
Narration delivered in a low, calm, middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese.
No character speaks in frame.
The dark room settling to absolute silence.

non_diegetic_music:
A low cello line with a single final piano note, sinking into near-silence.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png（重用）, ref_image_1=output/ch3_office_ref/zimage_00019_.png（既有）, duration=8, seed=310000（旁白專用，見第 6 節）, out=ch3_d25_video`

---

## 六、旁白 seed 鎖定與腔調錨點（D0–D25 全部以此為準）

- **旁白專用 seed = `310000`**（與 Ch1/Ch2 同一顆）：D2、D7、D9、D25 沿用。先出一支純旁白測試格確認
  聲線（低沉、冷靜、中年男聲、台灣腔），歪粵腔即記入黑名單換候選，標定成功才鎖定。
- **對白控制點**：`overall_soundscape` 首句寫 `Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.`
- **旁白控制點**：`overall_soundscape` 逐字重複同一組聲線描述（見 D2/D7/D9/D25），seed＋文字雙鎖定。
- **黑名單（實測歪粵腔 seed）**：沿用 `310009`（Ch2 記入）；Ch3 新 seed（4400xx）若實測歪腔，
  立即記入本節並換 seed 重跑。
- D0/D1/D3/D4/D6/D8/D10/D13/D16/D19/D20/D21/D23/D24 為純場景區塊，無音訊需錨定，`soundscape` 不帶腔調錨點。
- 擴音器廣播（D20）視為場景聲、不寫 `<d>`；畫面中無對嘴角色。
- `<d>` 語言標籤維持 `[中文]` 不改；`<d>` 內凡被唸出的文字禁用 `%`／阿拉伯數字（已全改中文數字）。

---

## 七、字幕資料表（區塊順序、起始秒、逐字字幕）

> 規劃累積起點；合併後以 `scale = 實際總秒數 / 174` 換算實際起點（見 v2 §6.5）。場景區塊無字幕。

| 區塊 | 類型 | 規劃秒 | 累積起點 | 字幕文字 | 斜體 |
|------|------|--------|----------|---------|------|
| D0 | 場景 | 4 | 0s | （無字幕） | — |
| D1 | 場景 | 6 | 4s | （無字幕） | — |
| D2 | 旁白 | 7 | 10s | 這就是民主二點零的現狀：真相在抵達終點前，就已經被情緒和演算法殺死了。 | ✅ |
| D3 | 場景 | 4 | 17s | （無字幕） | — |
| D4 | 場景 | 4 | 21s | （無字幕） | — |
| D5 | 對白 | 3 | 25s | 第一章，總則。 | — |
| D6 | 場景 | 4 | 28s | （無字幕） | — |
| D7 | 旁白 | 10 | 32s | 他腦中浮現出法庭上那名檢察官的嘴臉。／對方不斷強調「立場」，卻從不討論「統計模型」。／於是，他敲下了第二條。 | ✅ |
| D8 | 場景 | 7 | 42s | （無字幕） | — |
| D9 | 旁白 | 10 | 49s | 這條規則將會徹底改變權力結構。／在過去，政府用「你怎麼證明我錯」來封殺異議；而在這套協議下，政府必須「證明自己對」。 | ✅ |
| D10 | 場景 | 4 | 59s | （無字幕） | — |
| D11 | 對白 | 13 | 63s | 林老師，剛才審計部傳來消息，他們要查封我們研究室去年的預算。／他們說……我們有「挪用公帑進行顛覆性研究」的嫌疑。 | — |
| D12 | 對白 | 9 | 76s | 這不意外。他們想在法案送入國會前，先從財政上閹割我。蘇菲，妳怕嗎？ | — |
| D13 | 場景 | 4 | 85s | （無字幕） | — |
| D14 | 對白 | 9 | 89s | 我怕的是，如果我們這次輸了，以後歐若拉聯邦就再也沒有「數字」，只有「口號」了。 | — |
| D15 | 對白 | 5 | 98s | 所以，我們要加入這部法案最致命的一條。 | — |
| D16 | 場景 | 6 | 103s | （無字幕） | — |
| D17 | 對白 | 8 | 109s | 這會讓他們發瘋的。這等於是切斷了他們用國家的錢來洗國家腦的鏈條。 | — |
| D18 | 對白 | 14 | 117s | 這不只是切斷鏈條。這是要讓那些習慣躲在「國家利益」這塊盾牌後面的政客，第一次感覺到什麼叫作「個人風險」。 | — |
| D19 | 場景 | 5 | 131s | （無字幕） | — |
| D20 | 場景 | 7 | 136s | （無字幕） | — |
| D21 | 場景 | 4 | 143s | （無字幕） | — |
| D22 | 對白 | 10 | 147s | 蘇菲，從後門走。這份協議不需要存在電腦裡，它只需要出現在國會的發言台上。 | — |
| D23 | 場景 | 4 | 157s | （無字幕） | — |
| D24 | 場景 | 5 | 161s | （無字幕） | — |
| D25 | 旁白 | 8 | 166s | 標籤是熱的，但真相是冷的。而冷的事實，才能讓一個發燒的國家清醒過來。 | ✅ |

---

## 八、產出前自檢（D0–D25）

- [ ] 每個區塊只含一個主要事件；對白每支 ≤ 2 句承載。
- [ ] 對白/旁白逐字對照 `story1.md` 第三章（lines 124–187），無省略、無自創。
- [ ] `<d>` 內被唸文字皆中文數字（「二點零」），無 `%`／阿拉伯數字。
- [ ] 場景區塊（D0/D1/D3/D4/D6/D8/D10/D13/D16/D19/D20/D21/D23/D24）完全不寫 `<d>`、僅環境音；
      D20 擴音器廣播只入 `overall_soundscape`。
- [ ] 對白區塊指名 `Only <Subject N> speaks`、排除旁白；旁白區塊（D2/D7/D9/D25）畫面角色不開口、
      用 `<Narrator>` 標記、共用 seed 310000。
- [ ] 每支對白/旁白區塊的 `overall_soundscape` 帶台灣腔錨點句；seed 已查黑名單。
- [ ] 參考圖：Ref-O `/ch3_office_ref/zimage_00019_`、Ref-Sc `/ch3_screen_ref/zimage_00020_`、Ref-Sph `/ch3_sophie_ref/zimage_00021_`
      皆為既有；未餵 `ref_image_N` 一律省略（無殘留污染，v2 §三）。
- [ ] 解析度全片統一 352×608（r2v workflow 預設）；合併順序 D0→D25。
- [ ] 合併後以實際總長 scale 換算 SRT；旁白字幕包 `<i>...</i>`。

> **下一步**：依「區塊 × 參考圖對照」逐支 `gen_r2v_video` 提交（D0→D25），全部完成後依序
> `merge_videos(files=[D0…D25], resolution="352:608", out="ch3_full")`，並以總表資料產出 Ch3 SRT。