# Ch5 區塊獨立提示詞 — F0–F40（實作範例 7：第五章「元首的晚宴」）

> 本文件承接 `novel_to_video_guide_v2.md` 與 `example6_ch4.md`（Ch4），
> 完整產出**第五章「元首的晚宴」**的區塊分割、參考圖分配與全部 41 支 r2v 六欄位提示詞，
> 並套用 `video_prompt_guide.md` QA Q1–Q5（排除外語混雜、特殊符號、長句插話、跳針重讀）。
>
> **章節功能**：林墨赴總統官邸「晨曦宮」晚宴，赫德總統以「標籤＝社會黏著劑」為帝制式資訊控管辯護，
> 先以高官厚祿收買（木盒任命書）、再以表決碾壓威脅；林墨起身拒絕，用「一次性嗎啡」拆穿黏著劑論，
> 記下晚宴預算之誹，雨夜離宮致電蘇菲啟動應變。情緒走向：壓抑沉穩的鴻門宴 → 針鋒相對 → 收買→反擊 →
> 冷峻的「民主本就不該存在」→ 雨夜堅定（全書最強「集權辯護 vs 數據民主」正反交鋒）。
> 登場角色：林墨（沿用 Ref-M）、赫德總統（**新肖像**）、蘇菲（沿用 Ref-Sph，電話段）。
> ⚠ **QA 應用**：對白一律移除「」《》引號與冒號；阿拉伯數字改中文數字；每句獨立換行；
> 借詞（伺服器、開源論壇等）保持原文並避免切點落在借詞前；錨點句一律含 `no English`。

---

## 一、參考圖管理表（Step 1：一次性建置）

> 沿用既有：`Ref-M`（林墨）、`Ref-Sph`（蘇菲）。Ch5 新增 **5 張 Z-Image**：赫德總統肖像、
> 晨曦宮晚宴廳、晨曦宮雨夜外觀、木盒特寫、蘇菲住處。

| 編號 | 檔名（實際既有） | 內容 | 尺寸 | 用於區塊 |
|------|------|------|------|---------|
| Ref-M | `output/ch1_beat13_ref_char/zimage_00008_.png`（**共用**，同 Ch1–Ch4） | 林墨肖像：瘦削中年、灰絲黑髮、淺鬍茬、深炭灰西裝、皺白襯衫無領帶 | 832×1248 (2:3) | 林墨諸鏡 |
| Ref-Sph | `output/ch3_sophie_ref/zimage_00021_.png`（既有） | 蘇菲肖像：二十多歲、黑長髮鬆紮、素色深針織外套+白襯衫、蒼白憂慮 | 832×1248 | F38 |
| Ref-PRES | `output/ch5_president_ref/zimage_*.png`（**新增**） | 赫德總統肖像：六十多歲東亞男性、白髮整齊後梳、慈祥微笑但眼神銳利、深色晚宴西裝+深色領結、端坐 | 832×1248 | F2、F3、F6–F8、F10–F11、F14、F16–F17、F19–F22、F30–F32 |
| Ref-PLR | `output/ch5_dininghall_ref/zimage_*.png`（**新增**） | 晨曦宮晚宴廳：長型餐桌、銀器餐具與燭光、法式燉羊膝銀盤、古董吊燈暖光、深橡木牆板、厚重長絨地毯 | 832×1248 | F0–F34 晚宴諸鏡 |
| Ref-PAL | `output/ch5_palace_ext_ref/zimage_*.png`（**新增**） | 晨曦宮雨夜外觀：宏偉白色古典官邸、正門門廊立柱、門廊暖燈、冷雨細線、濕石階反射夜燈、侍衛 | 832×1248 | F35–F37、F39–F40 |
| Ref-BOX | `output/ch5_box_ref/zimage_*.png`（**新增**） | 餐桌上的精緻雕花深木盒特寫：盒蓋微開露出任命書與一張金色帳號卡、燭光銀器旁 | 832×1248 | F13、F15、F23 |
| Ref-SPH-APT | `output/ch5_sophie_apt_ref/zimage_*.png`（**新增**） | 蘇菲住處深夜：簡樸小公寓、單人床、書桌+舊檯燈、散亂書本、窗簾縫透夜光 | 832×1248 | F38 |

> **建置狀態**：Ch5 需新建 5 張（Step 1 一次完成），其餘沿用。

---

## 二、總表：區塊分割與計秒

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留緩神餘裕進位；場景按動作粗估、寧短勿長。
> 原文範圍：`story1.md` 第五章（lines 258–317）。全部合併規劃約 **317 秒**。

| # | 類型 | 內容 | 秒 |
|---|------|------|----|
| F0 | 場景 | 晨曦宮晚宴廳定場：長絨地毯、古董燈光、長餐桌（line 260） | 5 |
| F1 | 場景 | 林墨坐餐桌一端、法式燉羊膝一口未動（line 262） | 4 |
| F2 | 場景 | 赫德坐主位、優雅切割肉塊、慈祥長輩形象（line 264） | 5 |
| F3 | 對白 | 赫德：「林委員，這道羊膝是從索利亞邊境附近的農場送來的…只剩沙子和標語。」（line 266） | 16 |
| F4 | 對白 | 林墨：「這就是為什麼我想推動共識協議…最後的奢侈品。」（line 268） | 10 |
| F5 | 場景 | 赫德笑了，笑聲在安靜廳堂裡空洞（line 270） | 4 |
| F6 | 對白 | 赫德：「你太理想主義了，林…毀於過度的真相。」（line 272 前半） | 9 |
| F7 | 對白 | 赫德：「當人民發現政府…恐慌就成了比毒藥更快的殺手。」（line 272 中段） | 10 |
| F8 | 對白 | 赫德：「所以我才需要標籤…標籤是社會的黏著劑。」（line 272 後半） | 10 |
| F9 | 場景 | 赫德放下刀叉、眼神銳利（line 274） | 4 |
| F10 | 對白 | 赫德：「你的法案，是在拆掉這座國家的地基。你想要數據透明？」（line 276 前半） | 6 |
| F11 | 對白 | 赫德：「那如果明年的養老金缺口是百分之三十呢…燒掉國會嗎？」（line 276 後半） | 11 |
| F12 | 對白 | 林墨：「我打算告訴他們真相…謊言來轉移注意力。」（line 278） | 13 |
| F13 | 場景 | 赫德沉默、嘆氣、從桌下拿出木盒推到林墨面前（line 280） | 6 |
| F14 | 對白 | 赫德：「林，我不打算跟你辯論哲學…帳號憑證。」（line 282） | 9 |
| F15 | 場景 | 林墨沒有打開盒子（line 284） | 4 |
| F16 | 對白 | 赫德：「資訊安全審計署的首任署長。這是我特別為你設立的。」（line 286 前半） | 6 |
| F17 | 對白 | 赫德：「你擁有全聯邦最高的數據調閱權…撤回那部共識協議。」（line 286 後半） | 14 |
| F18 | 對白 | 林墨：「這是一場收買。」（line 288） | 3 |
| F19 | 對白 | 赫德：「這是一場分權。你想要數據正義，我給你權力去執行。」（line 290 前半） | 6 |
| F20 | 對白 | 赫德：「但你不能把它寫成法律，因為法律會讓我也失去控制。」（line 290 中段） | 6 |
| F21 | 對白 | 赫德：「如果你一定要走法律程序…被修改到連你自己都不認得。」（line 290 後半前段） | 10 |
| F22 | 對白 | 赫德：「數據公開會變成…那個前提，是由我定義的。」（line 290 後半後段） | 10 |
| F23 | 旁白 | 「這是最誘人的陷阱…對內則是收編。」（line 292） | 11 |
| F24 | 對白 | 林墨起身：「總統閣下，您剛才提到，標籤是社會的黏著劑。」（line 294 前半） | 5 |
| F25 | 對白 | 林墨（推開木盒）：「但在我看來，標籤更像是一次性的嗎啡…讓人上癮。」（line 294 中段） | 10 |
| F26 | 對白 | 林墨：「當藥效過了…藥物過量而暴斃。」（line 294 後半） | 8 |
| F27 | 場景 | 林墨走向門口、停在厚橡木門前（line 296） | 6 |
| F28 | 對白 | 林墨放緩：「對了，這頓飯的預算，應該是掛在國際事務交流費名下吧？」（line 298 前半） | 7 |
| F29 | 對白 | 林墨：「根據我的測算…放在我明天的開場發言裡。」（line 298 後半） | 15 |
| F30 | 場景 | 赫德坐在黑暗中、慈祥徹底消失（line 300） | 5 |
| F31 | 對白 | 赫德：「林墨，你以為你是在拯救民主。」（line 302 前半） | 4 |
| F32 | 對白 | 赫德：「但當你把真相赤裸裸地攤在陽光下…親手毀掉歐若拉的人。」（line 302 後半） | 12 |
| F33 | 場景 | 林墨沒有回頭（line 304） | 4 |
| F34 | 對白 | 林墨：「如果民主脆弱到承受不起事實，那它本來就不該存在。」（line 306） | 6 |
| F35 | 場景 | 走出晨曦宮、外頭下起冷雨（line 308） | 6 |
| F36 | 對白 | 林墨（電話）：「蘇菲，總統拒絕了。開始準備第六章的應變計畫。」（line 310 前半） | 6 |
| F37 | 對白 | 林墨（電話）：「他們明天會在國會動用國安條款…投射到公眾視線裡。」（line 310 後半） | 13 |
| F38 | 對白 | 蘇菲（電話）：「老師，剛才有人闖進了我的住處，搶走了我的筆電。」（line 312） | 6 |
| F39 | 場景 | 林墨握緊拳頭、眼神堅毅（雨中）（line 314） | 4 |
| F40 | 對白 | 林墨（電話）：「別怕。他們搶走的只是載體…心底發芽了。」（line 316） | 8 |

> 全表 **41 個區塊**（F0–F40），對白 28、旁白 1、場景 12。旁白 `seed=310000`（見第 6 節）。
> 擴音器／笑聲／餐具聲一律只入 `overall_soundscape`，畫面無對嘴角色不進 `<d>`。

---

## 三、區塊 × 參考圖對照

| 區塊 | 類型 | ref_image_0 | ref_image_1 | ref_image_2 | duration |
|------|------|-------------|-------------|-------------|----------|
| F0 | 場景 | Ref-PLR 晚宴廳 | — | — | 5 |
| F1 | 場景 | Ref-M 林墨(餐桌端) | Ref-PLR 晚宴廳 | — | 4 |
| F2 | 場景 | Ref-PRES 赫德(主位) | Ref-PLR 晚宴廳 | — | 5 |
| F3 | 對白 | Ref-PRES 赫德 | Ref-PLR 晚宴廳 | — | 16 |
| F4 | 對白 | Ref-M 林墨 | Ref-PLR 晚宴廳 | — | 10 |
| F5 | 場景 | Ref-PRES 赫德(笑) | Ref-PLR 晚宴廳 | — | 4 |
| F6 | 對白 | Ref-PRES 赫德 | Ref-PLR 晚宴廳 | — | 9 |
| F7 | 對白 | Ref-PRES 赫德 | Ref-PLR 晚宴廳 | — | 10 |
| F8 | 對白 | Ref-PRES 赫德 | Ref-PLR 晚宴廳 | — | 10 |
| F9 | 場景 | Ref-PRES 赫德(放刀叉) | Ref-PLR 晚宴廳 | — | 4 |
| F10 | 對白 | Ref-PRES 赫德 | Ref-PLR 晚宴廳 | — | 6 |
| F11 | 對白 | Ref-PRES 赫德 | Ref-PLR 晚宴廳 | — | 11 |
| F12 | 對白 | Ref-M 林墨 | Ref-PLR 晚宴廳 | — | 13 |
| F13 | 場景 | Ref-BOX 木盒 | Ref-PLR 晚宴廳 | Ref-PRES 赫德(遞盒) | 6 |
| F14 | 對白 | Ref-PRES 赫德 | Ref-BOX 木盒 | — | 9 |
| F15 | 場景 | Ref-M 林墨(桌前) | Ref-BOX 木盒 | — | 4 |
| F16 | 對白 | Ref-PRES 赫德 | Ref-M 林墨(聆聽) | — | 6 |
| F17 | 對白 | Ref-PRES 赫德 | Ref-M 林墨(聆聽) | Ref-BOX 木盒 | 14 |
| F18 | 對白 | Ref-M 林墨 | Ref-PRES 赫德 | — | 3 |
| F19 | 對白 | Ref-PRES 赫德 | Ref-M 林墨 | — | 6 |
| F20 | 對白 | Ref-PRES 赫德 | Ref-M 林墨 | — | 6 |
| F21 | 對白 | Ref-PRES 赫德 | Ref-M 林墨 | — | 10 |
| F22 | 對白 | Ref-PRES 赫德(銳利) | Ref-PLR 晚宴廳 | — | 10 |
| F23 | 旁白 | Ref-M 林墨(盯盒) | Ref-BOX 木盒 | — | 11 |
| F24 | 對白 | Ref-M 林墨(起身) | Ref-BOX 木盒 | — | 5 |
| F25 | 對白 | Ref-M 林墨(推盒) | Ref-BOX 木盒 | Ref-PLR 晚宴廳 | 10 |
| F26 | 對白 | Ref-M 林墨 | Ref-PLR 晚宴廳 | — | 8 |
| F27 | 場景 | Ref-M 林墨(走向門) | Ref-PLR 晚宴廳 | — | 6 |
| F28 | 對白 | Ref-M 林墨(門前定住) | Ref-PLR 晚宴廳 | — | 7 |
| F29 | 對白 | Ref-M 林墨(側身) | Ref-PLR 晚宴廳 | — | 15 |
| F30 | 場景 | Ref-PRES 赫德(暗處) | Ref-PLR 晚宴廳 | — | 5 |
| F31 | 對白 | Ref-PRES 赫德(暗處) | Ref-PLR 晚宴廳 | — | 4 |
| F32 | 對白 | Ref-PRES 赫德 | Ref-PLR 晚宴廳 | — | 12 |
| F33 | 場景 | Ref-M 林墨(背對) | Ref-PLR 晚宴廳 | Ref-PRES 赫德(暗處) | 4 |
| F34 | 對白 | Ref-M 林墨(背對) | Ref-PLR 晚宴廳 | — | 6 |
| F35 | 場景 | Ref-PAL 官邸雨夜 | — | — | 6 |
| F36 | 對白 | Ref-M 林墨(雨中持電話) | Ref-PAL 官邸雨夜 | — | 6 |
| F37 | 對白 | Ref-M 林墨(雨中) | Ref-PAL 官邸雨夜 | — | 13 |
| F38 | 對白 | Ref-Sph 蘇菲(住處) | Ref-SPH-APT 住處 | — | 6 |
| F39 | 場景 | Ref-M 林墨(握拳) | Ref-PAL 官邸雨夜 | — | 4 |
| F40 | 對白 | Ref-M 林墨(雨中) | Ref-PAL 官邸雨夜 | — | 8 |

> 未餵 `ref_image_N` 一律省略（勿留空檔名殘餘污染，見 v2 §3）。

---

## F0 — 晨曦宮晚宴廳定場（場景，5 秒）

**來源**：`story1.md` line 260。

```
subject_definitions:
<Subject 1> is the state dining hall from <Picture 1>:
an opulent mansion dining room, heavy long-pile carpet, antique warm lamp light, deep oak panelling, a long
banquet table set with silver and candles.

summary:
Reference-based establishing shot of the presidential dining hall.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Warm antique lamplight, slow establishing pan across the hall.

[Shot 1]

00:00-00:05

Action:
A slow establishing move over the opulent dining hall: the long velvet-covered banquet table laid with silver,
a plate of braised lamb shank, the antique chandeliers haloing the dark oak panelling, the heavy carpet
swallowing every sound.

overall_soundscape:
A settling warm room tone, the distant crackle of a fireplace, quiet clink of silver, no human voice.

non_diegetic_music:
A low cello line, formal and slightly ominous.
```

**參數**：`ref_image_0=output/ch5_dininghall_ref/zimage_*.png, duration=5, seed=450100, out=ch5_f0_video`

---

## F1 — 林墨坐餐桌一端（場景，4 秒）

**來源**：`story1.md` line 262。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated at
one end of a long banquet table.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room, long table, warm antique lamplight.

summary:
Reference-based long-table seating shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Warm lamplight, medium shot from across the table.

[Shot 1]

00:00-00:04

Action:
Lin Mo sits alone at the far end of the long table, the delicate plate of braised lamb shank untouched before
him; his face calm, unreadable, waiting.

overall_soundscape:
A quiet room, a faint wall-clock ticking, low clink of silver somewhere off-screen.

non_diegetic_music:
A low held string note under the silence.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=4, seed=450101, out=ch5_f1_video`

---

## F2 — 赫德切割肉塊（場景，5 秒）

**來源**：`story1.md` line 264。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man in his late 60s, neatly combed white hair, kindly smiling face with sharp eyes, dark
formal evening suit with a deep bow tie, seated at the head of a long table.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room, long table, warm antique lamplight.

summary:
Reference-based head-of-table close-up.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Warm lamplight, medium close-up of the head of the table.

[Shot 1]

00:00-00:05

Action:
At the head of the long table, President Herd cuts elegantly into his meat, unhurried and fatherly, knife and
fork moving with practiced ease, a mild benevolent smile on his face.

overall_soundscape:
Quiet knife and fork on porcelain, a faint swallow, the warm room tone.

non_diegetic_music:
A soft formal string quartet, low and polite.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=5, seed=450102, out=ch5_f2_video`

---

## F3 — 「羊膝來自索利亞」（對白，16 秒）

**來源**：`story1.md` line 266。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man in his late 60s, neatly combed white hair, kindly smiling face with sharp eyes, dark
formal evening suit with a deep bow tie, seated at the head of the table.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room, long table, a plate of braised lamb shank, warm candlelight.

summary:
Reference-based dinner conversation turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium close-up on the head of the table, face lit by candle glow.

[Shot 1]

00:00-00:16

Action:
President Herd sets down his napkin-edged knife, wipes the corner of his mouth with the napkin, and speaks
light and easy as if about the weather.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林委員，這道羊膝是從索利亞邊境附近的農場送來的。
在那場崩潰發生前，那裡的農產品是全大陸最好的。
可惜，現在那邊只剩下沙子和標語了。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Soft candlelit room tone, distant fire crackle, faint silver clink.
No other speech.

non_diegetic_music:
A low formal string line, polite and subtly cold.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=16, seed=450103, out=ch5_f3_video`

---

## F4 — 「共識協議與最後的奢侈品」（對白，10 秒）

**來源**：`story1.md` line 268。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated at
the far end of a long table.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room, long table, warm candlelight.

summary:
Reference-based dinner response shot.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium shot, calm composure.

[Shot 1]

00:00-00:10

Action:
Lin Mo answers evenly and quietly, meeting the president's eyes across the table, hands folded on the table,
unmoving.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這就是為什麼我想推動共識協議，總統閣下。
我不想看到這道菜成為歐若拉聯邦最後的奢侈品。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The quiet settling room tone, faint candle crackle.
No other speech.

non_diegetic_music:
A low somber cello line under the reply.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=10, seed=450104, out=ch5_f4_video`

---

## F5 — 赫德空洞的笑（場景，4 秒）

**來源**：`story1.md` line 270。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, kindly face, dark formal evening suit with a deep bow tie,
seated at the head of a long table.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight, empty of atmosphere.

summary:
Reference-based laughter close-up.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks lines. No narration. No voice-over.

detailed_description:

Visual style:
Warm lamplight, tight close-up on the president's face.

[Shot 1]

00:00-00:04

Action:
President Herd laughs, the laugh coming out hollow and empty in the silent hall, his smile polite but not
reaching his eyes.

overall_soundscape:
A hollow, echoing laugh that dies quickly, the profound silence of the hall closing back in.

non_diegetic_music:
A single low piano note, flat and unresolved.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=4, seed=450105, out=ch5_f5_video`

---

## F6 — 「毀於過度的真相」（對白，9 秒）

**來源**：`story1.md` line 272（前半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man in his late 60s, neatly combed white hair, kindly smiling face with sharp eyes, dark
formal evening suit with a deep bow tie, seated at the head of the table.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium close-up on the president.

[Shot 1]

00:00-00:09

Action:
Still seated, President Herd holds Lin Mo's gaze and speaks with an indulgent, lecturing tone, knife resting
on the plate edge.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
你太理想主義了，林。
你以為索利亞是毀於謊言嗎？
不，它是毀於過度的真相。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Quiet candlelit room tone, a faint chair creak.
No other speech.

non_diegetic_music:
A low subtle sting of strings, patient and cold.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=9, seed=450106, out=ch5_f6_video`

---

## F7 — 「恐慌是比毒藥更快的殺手」（對白，10 秒）

**來源**：`story1.md` line 272（中段）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man in his late 60s, neatly combed white hair, kindly face with sharp eyes, dark formal
evening suit with a deep bow tie, seated.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium close-up, camera still.

[Shot 1]

00:00-00:10

Action:
President Herd speaks with a patient, explaining certainty, interweaving both hands as if laying out a
classroom argument.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
當人民發現政府其實無力解決乾旱，
當他們看到經濟數據徹底崩盤，
恐慌就成了比毒藥更快的殺手。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Quiet room tone, breathing, faint distant clock tick.
No other speech.

non_diegetic_music:
A low rumbling pulse building under the words.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=10, seed=450107, out=ch5_f7_video`

---

## F8 — 「標籤是社會的黏著劑」（對白，10 秒）

**來源**：`story1.md` line 272（後半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man in his late 60s, neatly combed white hair, kindly face with sharp eyes, dark formal
evening suit with a deep bow tie, seated.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium close-up, gentle push toward the face.

[Shot 1]

00:00-00:10

Action:
President Herd leans back slightly and states the conclusion with calm emphasis, as if stating an obvious
law of nature.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
所以我才需要標籤，
我需要給他們一個可以恨的對象，一個可以仰望的目標。
標籤是社會的黏著劑。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Quiet room tone, a soft exhale.
No other speech.

non_diegetic_music:
A low sustained cello line, firm and philosophical.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=10, seed=450108, out=ch5_f8_video`

---

## F9 — 放下刀叉（場景，4 秒）

**來源**：`story1.md` line 274。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, dark formal evening suit with a deep bow tie, seated at the
head of the table.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based knife-and-fork put-down shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Warm lamplight, close-up on hands then the face.

[Shot 1]

00:00-00:04

Action:
The president sets down his knife and fork with a deliberate click, then lifts his eyes, the gentleness
stripping away until his gaze is sharp and pointed.

overall_soundscape:
The precise click of silver on porcelain, then silence, a soft breath.

non_diegetic_music:
A single low piano note, tenser.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=4, seed=450109, out=ch5_f9_video`

---

## F10 — 「拆掉國家的地基」（對白，6 秒）

**來源**：`story1.md` line 276（前半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man in his late 60s, neatly combed white hair, sharp-eyed, dark formal evening suit with a
deep bow tie, seated.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based sharp speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, tight medium close-up, eyes hard.

[Shot 1]

00:00-00:06

Action:
President Herd speaks sharply, eyes locked on Lin Mo, voice low and pointed like an accusation.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
你的法案，是在拆掉這座國家的地基。
你想要數據透明？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The hushed room, a barely audible breath.
No other speech.

non_diegetic_music:
A low tense low-string, watchful.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=6, seed=450110, out=ch5_f10_video`

---

## F11 — 「養老金缺口百分之三十」（對白，11 秒）

**來源**：`story1.md` line 276（後半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man in his late 60s, neatly combed white hair, sharp-eyed, dark formal evening suit with a
deep bow tie, seated.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium close-up, slight camera push.

[Shot 1]

00:00-00:11

Action:
President Herd presses in with a rhetorical challenge, tone sharpening, hands flat on the table.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
那如果明年的養老金缺口是百分之三十呢？
你打算直接告訴那些領不到錢的老人，讓他們上街燒掉國會嗎？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The static quiet of the hall, a faint wooden clink.
No other speech.

non_diegetic_music:
A low disharmonic string under the challenge.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=11, seed=450111, out=ch5_f11_video`

---

## F12 — 「我打算告訴他們真相」（對白，13 秒）

**來源**：`story1.md` line 278。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated at
the far end of a long table.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based seated response turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium shot, calm and unmoved.

[Shot 1]

00:00-00:13

Action:
Lin Mo meets the president's eyes directly and answers with quiet, unshakeable steadiness, his body still.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
我打算告訴他們真相，
然後和他們一起討論如何止血，
而不是編造一個外敵偷走了金庫的謊言來轉移注意力。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The quiet hall, a long silence between lines.
No other speech.

non_diegetic_music:
A low warm cello line, steady and principled.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=13, seed=450112, out=ch5_f12_video`

---

## F13 — 木盒推上前（場景，6 秒）

**來源**：`story1.md` line 280。

```
subject_definitions:
<Subject 1> is the wooden box from <Picture 1>:
an ornate dark carved wooden box on the dining table, lid slightly open revealing an appointment document and
a gold bank card, candlelight and silver nearby.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm candlelight.

<Subject 3> is President Herd from <Picture 3>:
elderly East Asian man, neatly combed white hair, dark formal evening suit, pushing the box forward.

summary:
Reference-based box-presentation shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Warm lamplight, tilt down to the table then a slow push over the box.

[Shot 1]

00:00-00:06

Action:
A pause, then the president sighs, reaches under the table and produces an ornate wooden box, sliding it
across the dark tabletop toward Lin Mo until it rests in front of him.

overall_soundscape:
The heavy but smooth slide of the wooden box across polished wood, a long sigh, the settling silence.

non_diegetic_music:
A low dark string swell, transactional and cold.
```

**參數**：`ref_image_0=output/ch5_box_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, ref_image_2=output/ch5_president_ref/zimage_*.png, duration=6, seed=450113, out=ch5_f13_video`

---

## F14 — 「任命書與帳號憑證」（對白，9 秒）

**來源**：`story1.md` line 282。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, dark formal evening suit with a deep bow tie, seated at the
head of the table.

<Subject 2> is the wooden box from <Picture 2>:
an ornate dark carved wooden box on the table between the two.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium shot framed over the box to the president.

[Shot 1]

00:00-00:09

Action:
Without preamble, the president gestures at the box and states its contents plainly, tone turning pragmatic
and disarming.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林，我不打算跟你辯論哲學。
盒子裡是一份任命書，以及一個私人基金會的帳號憑證。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The quiet room, the candleflame steady.
No other speech.

non_diegetic_music:
A low flat piano line, matter-of-fact.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_box_ref/zimage_*.png, duration=9, seed=450114, out=ch5_f14_video`

---

## F15 — 林墨沒有打開盒子（場景，4 秒）

**來源**：`story1.md` line 284。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated,
looking down.

<Subject 2> is the wooden box from <Picture 2>:
an ornate dark carved wooden box sitting closed on the table before him.

summary:
Reference-based box-gaze shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Warm lamplight, medium shot, downbeat stillness.

[Shot 1]

00:00-00:04

Action:
Lin Mo looks at the wooden box in front of him but makes no move to open it, his hands staying folded, his
expression unreadable.

overall_soundscape:
Utter stillness, a faint muscle-line of breath, one soft distant clock tick.

non_diegetic_music:
A single held low note, cold and watchful.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_box_ref/zimage_*.png, duration=4, seed=450115, out=ch5_f15_video`

---

## F16 — 「資訊安全審計署的首任署長」（對白，6 秒）

**來源**：`story1.md` line 286（前半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, dark formal evening suit with a deep bow tie, seated at the
head of the table.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, dark charcoal suit, listening across the
table.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium two-shot favoring the president.

[Shot 1]

00:00-00:06

Action:
The president states the title with a small, giving smile, palm toward the box as if recommending a gift.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
資訊安全審計署的首任署長。
這是我特別為你設立的。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The quiet hall, a soft candle breath.
No other speech.

non_diegetic_music:
A low velvet string line, seductive and official.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=6, seed=450116, out=ch5_f16_video`

---

## F17 — 「最高的數據調閱權」（對白，14 秒）

**來源**：`story1.md` line 286（後半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, smiling face with sharp eyes, dark formal evening suit with
a deep bow tie.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, dark charcoal suit, listening.

<Subject 3> is the wooden box from <Picture 3>:
an ornate dark carved wooden box on the table.

summary:
Reference-based seated persuasion turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, slow push toward the president as the offer grows.

[Shot 1]

00:00-00:14

Action:
The president lays out the privileges of the office with an unctuous pride, counting them off on his fingers,
then lets the price drop at the end like a punchline.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
你擁有全聯邦最高的數據調閱權，
你可以審查任何你看不順眼的文宣，
甚至可以撤換那些做事不精確的官員。
只要你，撤回那部共識協議。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The hushed room growing quieter as he speaks.
No other speech.

non_diegetic_music:
A low rising string line until the last sentence, where it stops abruptly.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_2=output/ch5_box_ref/zimage_*.png, duration=14, seed=450117, out=ch5_f17_video`

---

## F18 — 「這是一場收買」（對白，3 秒）

**來源**：`story1.md` line 288。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated.

<Subject 2> is President Herd from <Picture 2>:
elderly East Asian man, neatly combed white hair, dark formal evening suit, across the table.

summary:
Reference-based flat rebuttal shot.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, tight close-up on Lin Mo's face, flat and final.

[Shot 1]

00:00-00:03

Action:
Without looking at the box, Lin Mo states it flatly as a verdict, voice even and cold.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這是一場收買。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
A dead stillness after the words.
No other speech.

non_diegetic_music:
A single hard piano note, cut off.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_president_ref/zimage_*.png, duration=3, seed=450118, out=ch5_f18_video`

---

## F19 — 「這是一場分權」（對白，6 秒）

**來源**：`story1.md` line 290（前半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, dark formal evening suit with a deep bow tie, seated.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, dark charcoal suit, across the table.

summary:
Reference-based correction turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium two-shot, quick reframing rhythm.

[Shot 1]

00:00-00:06

Action:
The president corrects him at once, dismissing the word with a small wave of the hand, the tone of a senior
setting a young man straight.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這是一場分權。
你想要數據正義，我給你權力去執行。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The settled room, a soft wooden shift.
No other speech.

non_diegetic_music:
A low neutral string line, moderated.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=6, seed=450119, out=ch5_f19_video`

---

## F20 — 「不能寫成法律」（對白，6 秒）

**來源**：`story1.md` line 290（中段）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, sharp-eyed, dark formal evening suit, seated.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, dark charcoal suit, listening.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium close-up on the president.

[Shot 1]

00:00-00:06

Action:
The president leans in, voice dropping, explaining the one line he will not cross, each word weighted.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
但你不能把它寫成法律，
因為法律會讓我也失去控制。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
A taut quiet, the fire crackling once.
No other speech.

non_diegetic_music:
A low ominous drone, restrained.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=6, seed=450120, out=ch5_f20_video`

---

## F21 — 「法案會被修改到你不認得」（對白，10 秒）

**來源**：`story1.md` line 290（後半前段）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, sharp-eyed, dark formal evening suit, seated.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, dark charcoal suit, listening.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium close-up, steady.

[Shot 1]

00:00-00:10

Action:
The president states the legislative threat plainly, matter-of-fact, as if reporting weather that is simply
going to happen.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
如果你一定要走法律程序，
明天國會的表決，
你的法案會被修改到連你自己都不認得。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The room barely breathing, low chime of a distant clock.
No other speech.

non_diegetic_music:
A low flat string line, bureaucratic and cold.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=10, seed=450121, out=ch5_f21_video`

---

## F22 — 「那個前提由我定義」（對白，10 秒）

**來源**：`story1.md` line 290（後半後段）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, sharp eyes, dark formal evening suit with a deep bow tie,
seated.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based seated speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, tight close-up, the face going hard at the last phrase.

[Shot 1]

00:00-00:10

Action:
The president enunciates each clause slowly, and at the final claim his face is unmistakably cold and
self-owned.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
數據公開會變成在不損害國安前提下有條件公開，
而那個前提，是由我定義的。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Dead-quiet halls, one soft exhale.
No other speech.

non_diegetic_music:
A low menacing bass, settling like a door closing.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=10, seed=450122, out=ch5_f22_video`

---

## F23 — 「最誘人的陷阱」（旁白，11 秒）

**來源**：`story1.md` line 292。

> **旁白全文（約 51 字，5 字/秒 ≈ 11s）**：這是最誘人的陷阱。政府給你一個職位，讓你成為體制內的一顆齒輪，對外宣稱這是改革，對內則是收編。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, seated,
gaze lowered to the table.

<Subject 2> is the wooden box from <Picture 2>:
an ornate dark carved wooden box on the table before him.

summary:
Reference-based box-gaze shot with described narration.
The image is narrated from outside.
No character speaks in frame.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks in frame. Narration by the fixed narrator voice only. No on-screen mouth movement.

detailed_description:

Visual style:
Warm lamplight, medium shot, held stillness.

[Shot 1]

00:00-00:11

Action:
Lin Mo stays motionless looking down at the closed wooden box, the candlelight steady, his expression letting
the quiet speak for him.

Narration:
<Narrator> says:

<d>
[中文]
這是最誘人的陷阱。
政府給你一個職位，讓你成為體制內的一顆齒輪，
對外宣稱這是改革，對內則是收編。
</d>

overall_soundscape:
Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話),
read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.
The hushed hall, a faint clock tick.

non_diegetic_music:
A low sustained cello note, bittersweet and knowing.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_box_ref/zimage_*.png, duration=11, seed=310000（旁白專用）, out=ch5_f23_video`

---

## F24 — 「黏著劑」（對白，5 秒）

**來源**：`story1.md` line 294（前半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, rising from
his seat.

<Subject 2> is the wooden box from <Picture 2>:
a closed dark carved wooden box on the table.

summary:
Reference-based rising speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium shot as Lin Mo stands.

[Shot 1]

00:00-00:05

Action:
Lin Mo slowly rises to his feet, addressing the president formally, calmly, and deliberately sets the box
aside with his palm.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
總統閣下，您剛才提到，標籤是社會的黏著劑。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The rustle of his suit as he stands, the room still.
No other speech.

non_diegetic_music:
A low rising line as he stands.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_box_ref/zimage_*.png, duration=5, seed=450124, out=ch5_f24_video`

---

## F25 — 「標籤是一次性的嗎啡」（對白，10 秒）

**來源**：`story1.md` line 294（中段）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing,
hand resting where the box was.

<Subject 2> is the wooden box from <Picture 2>:
the pushed-aside dark carved wooden box on the table.

<Subject 3> is the state dining hall from <Picture 3>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based standing speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium shot of the standing figure.

[Shot 1]

00:00-00:10

Action:
Standing, Lin Mo delivers the analogy with quiet force after pushing the box aside, voice steady and cold.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
但在我看來，標籤更像是一次性的嗎啡。
它能止痛，但不能治病，而且會讓人上癮。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The standing silence of the hall.
No other speech.

non_diegetic_music:
A low cold cello line, decisive.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_box_ref/zimage_*.png, ref_image_2=output/ch5_dininghall_ref/zimage_*.png, duration=10, seed=450125, out=ch5_f25_video`

---

## F26 — 「藥物過量而暴斃」（對白，8 秒）

**來源**：`story1.md` line 294（後半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at
the table.

<Subject 2> is the state dining hall from <Picture 2>:
a quiet opulent dining room, long table, warm lamplight.

summary:
Reference-based standing speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium shot, building severity.

[Shot 1]

00:00-00:08

Action:
Still standing, Lin Mo finishes the metaphor, each phrase harder and more final.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
當藥效過了，劑量就得加大，
直到最後，整個國家都會因為藥物過量而暴斃。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The heavy quiet after the last word.
No other speech.

non_diegetic_music:
A low dark chord landing on the final line.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=8, seed=450126, out=ch5_f26_video`

---

## F27 — 走向門口（場景，6 秒）

**來源**：`story1.md` line 296。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, walking
through the dining hall.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room with a heavy oak double door, warm lamplight.

summary:
Reference-based walking-to-door shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Warm lamplight, tracking behind Lin Mo as he walks.

[Shot 1]

00:00-00:06

Action:
Lin Mo walks the length of the dining hall toward the heavy oak door, footsteps muffled by the carpet; he
stops just before the door.

overall_soundscape:
Muffled footsteps on the heavy carpet, the soft creak of an antique floorboard, a deepening silence.

non_diegetic_music:
A low tense cello line, anticipation.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=6, seed=450127, out=ch5_f27_video`

---

## F28 — 「這頓飯的預算」（對白，7 秒）

**來源**：`story1.md` line 298（前半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at
the door.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room with a heavy oak door, warm lamplight.

summary:
Reference-based at-the-door speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium shot from slightly behind, he turns his head slightly.

[Shot 1]

00:00-00:07

Action:
With his hand on the door, Lin Mo half-turns and adds the remark in the same even voice, as if a final
afterthought.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
對了，這頓飯的預算，應該是掛在國際事務交流費名下吧？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The quiet hall right behind him.
No other speech.

non_diegetic_music:
A low neutral string, offhand and cutting.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=7, seed=450128, out=ch5_f28_video`

---

## F29 — 「實驗室經費與開場發言」（對白，15 秒）

**來源**：`story1.md` line 298（後半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing
sideways at the door.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room with a heavy oak door, warm lamplight.

summary:
Reference-based at-the-door speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm lamplight, medium shot, face half-lit.

[Shot 1]

00:00-00:15

Action:
Half-turned at the door, Lin Mo delivers the reckoning quietly but precisely, eyes fixed ahead, tone flat and
final.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
根據我的測算，這一桌菜的成本足以支付艾倫那所學校一整個學期的實驗室經費。
我會把這個數據放在我明天的開場發言裡。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The hollow quiet of the hall behind him.
No other speech.

non_diegetic_music:
A low steady cello pulse, quietly triumphant.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=15, seed=450129, out=ch5_f29_video`

---

## F30 — 赫德坐在黑暗中（場景，5 秒）

**來源**：`story1.md` line 300。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, dark formal evening suit with a deep bow tie, seated in
dimming light.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room dimming toward darkness, warm lamps guttering low.

summary:
Reference-based darkness-settling shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Cooling light, shadows climbing the walls, medium shot from across the table.

[Shot 1]

00:00-00:05

Action:
Across the abandoned table, the president sits unmoving in the failing light, the fatherly warmth entirely
gone from his face, replaced by a stiff, cold stare toward the door.

overall_soundscape:
A long oppressive silence, one lamp hissing faintly, the far creak of door leather.

non_diegetic_music:
A low dark drone, no melody.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=5, seed=450130, out=ch5_f30_video`

---

## F31 — 「你以為你是在拯救民主」（對白，4 秒）

**來源**：`story1.md` line 302（前半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, cold sharp eyes, dark formal evening suit with a deep bow
tie, seated in dimming light.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room dimming toward darkness.

summary:
Reference-based speech from the dark.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Dim lamplight, medium shot, half the face falling to shadow.

[Shot 1]

00:00-00:04

Action:
From the dark behind the table, the president speaks low and icy, not moving.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林墨，你以為你是在拯救民主。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Cold darkness, a faint hiss of the dying lamp.
No other speech.

non_diegetic_music:
A low dark drone, colder.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=4, seed=450131, out=ch5_f31_video`

---

## F32 — 「親手毀掉歐若拉的人」（對白，12 秒）

**來源**：`story1.md` line 302（後半）。

```
subject_definitions:
<Subject 1> is President Herd from <Picture 1>:
elderly East Asian man, neatly combed white hair, cold eyes, dark formal evening suit, seated in dimming
light.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dining room dimming toward darkness.

summary:
Reference-based speech from the dark.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Dim lamplight, medium close-up, cold and unmoving.

[Shot 1]

00:00-00:12

Action:
The president finishes the warning from the dark, voice dropping into open contempt at the last clause.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
但當你把真相赤裸裸地攤在陽光下，
卻發現這群人民根本承受不起時，
你才是那個親手毀掉歐若拉的人。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The cold dark before the hall, a long silence after.
No other speech.

non_diegetic_music:
A low dissonant string, cutting.
```

**參數**：`ref_image_0=output/ch5_president_ref/zimage_*.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=12, seed=450132, out=ch5_f32_video`

---

## F33 — 林墨沒有回頭（場景，4 秒）

**來源**：`story1.md` line 304。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, at the door,
back to the room.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dim dining room behind him.

<Subject 3> is President Herd from <Picture 3>:
elderly East Asian man, dark formal evening suit, seated far in the dark.

summary:
Reference-based no-turn shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.
<Subject 3>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Warm door light against cool hall, medium shot from behind.

[Shot 1]

00:00-00:04

Action:
At the threshold, Lin Mo stands with his back to the hall, not turning, as the words hang in the darkness
behind him.

overall_soundscape:
Stillness, a faint wind through the old building, the hinged breath of the door.

non_diegetic_music:
A lone low note, suspended.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, ref_image_2=output/ch5_president_ref/zimage_*.png, duration=4, seed=450133, out=ch5_f33_video`

---

## F34 — 「民主本就不該存在」（對白，6 秒）

**來源**：`story1.md` line 306。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, at the
door, back to the room.

<Subject 2> is the state dining hall from <Picture 2>:
an opulent dim dining room behind him.

summary:
Reference-based at-the-door speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Warm door light, medium shot from behind, voice carries back into the dark.

[Shot 1]

00:00-00:06

Action:
Without turning around, Lin Mo answers into the room, quiet and final.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
如果民主脆弱到承受不起事實，
那它本來就不該存在。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
His calm voice absorbed by the shadows behind him.
No other speech.

non_diegetic_music:
A low warm cello note, settling and final.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_dininghall_ref/zimage_*.png, duration=6, seed=450134, out=ch5_f34_video`

---

## F35 — 走出晨曦宮、冷雨（場景，6 秒）

**來源**：`story1.md` line 308。

```
subject_definitions:
<Subject 1> is Palace Dawn from <Picture 1>:
a grand classical white presidential mansion at night, entrance portico with columns and warm lamps, cold rain
streaking, wet stone steps reflecting lamplight, a few guards.

summary:
Reference-based exterior departure shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Night rain, cold blue-grey against the warm portico lamps, wide shot.

[Shot 1]

00:00-00:06

Action:
The heavy doors open behind a lone figure; Lin Mo steps out into the cold night rain, the warm light spilling
briefly onto the wet steps before the doors close behind him.

overall_soundscape:
Cold rain, distant pattering on stone, the low boom of the closing door, footsteps in the wet.

non_diegetic_music:
A low cold piano under the rain, desolate.
```

**參數**：`ref_image_0=output/ch5_palace_ext_ref/zimage_*.png, duration=6, seed=450135, out=ch5_f35_video`

---

## F36 — 「總統拒絕了」（對白，6 秒）

**來源**：`story1.md` line 310（前半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing in
the night rain holding a phone to his ear.

<Subject 2> is the palace exterior from <Picture 2>:
a grand white mansion entrance at night, rain, wet steps, lamps.

summary:
Reference-based phone-call speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Night rain, medium shot, cold lamplight on wet shoulders.

[Shot 1]

00:00-00:06

Action:
Standing in the cold rain under the portico light, phone to his ear, Lin Mo speaks low and fast into the
phone, expression grim.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
蘇菲，總統拒絕了。
開始準備第六章的應變計畫。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Rain hissing on the steps, a low distant city hum.
No other speech.

non_diegetic_music:
A low tense pulse under the rain.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_palace_ext_ref/zimage_*.png, duration=6, seed=450136, out=ch5_f36_video`

---

## F37 — 「國安條款與公眾視線」（對白，13 秒）

**來源**：`story1.md` line 310（後半）。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing in
the night rain, phone to his ear.

<Subject 2> is the palace exterior from <Picture 2>:
a grand white mansion entrance at night, rain, wet steps.

summary:
Reference-based phone-call speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Night rain, medium shot, edge lit by the portico lamps.

[Shot 1]

00:00-00:13

Action:
Still on the phone in the rain, Lin Mo lays out the contingency plan in clipped, urgent sentences, eyes
tracking the wet ground.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
他們明天會在國會動用國安條款強制閹割法案內容，
我們要搶在他們動作前，
把原始數據直接投射到公眾視線裡。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Rain thickening, footsteps on wet stone, one distant roll of thunder.
No other speech.

non_diegetic_music:
A low rising electronic pulse, urgent.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_palace_ext_ref/zimage_*.png, duration=13, seed=450137, out=ch5_f37_video`

---

## F38 — 「有人搶走了我的筆電」（對白，6 秒）

**來源**：`story1.md` line 312。

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
mid-20s East Asian woman, long straight black hair loosely tied back, pale nervous face, plain dark cardigan
over a white blouse, holding a phone, in a dim room.

<Subject 2> is her apartment from <Picture 2>:
a small dark apartment at night, bed and a desk with an old lamp, books scattered, cold light from a
curtained window.

summary:
Reference-based phone-call speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Cold dim bedside light, medium close-up, shaking tension.

[Shot 1]

00:00-00:06

Action:
In the dim apartment, Sophie holds the phone with a trembling hand, her voice faltering, glancing nervously
toward the disturbed door.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
老師，剛才有人闖進了我的住處，搶走了我的筆電。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Rain outside the window, the nervous hum of an old lamp.
No other speech.

non_diegetic_music:
A low tense string, thin and frightened.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, ref_image_1=output/ch5_sophie_apt_ref/zimage_*.png, duration=6, seed=450138, out=ch5_f38_video`

---

## F39 — 雨中握拳（場景，4 秒）

**來源**：`story1.md` line 314。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing in
the night rain, phone held down.

<Subject 2> is the palace exterior from <Picture 2>:
a grand white mansion entrance at night, rain, wet steps, lamps.

summary:
Reference-based resolve shot in rain.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Night rain, close-up on the hand then the jaw, cold blue light.

[Shot 1]

00:00-00:04

Action:
Lin Mo's free hand clenches into a fist, the mask of cold lifted off his face to a bare, iron resolve, rain
running down his jaw.

overall_soundscape:
Rain hard on his shoulders, a short sharp breath, the hiss of wet stone.

non_diegetic_music:
A low swelling cello, determined.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_palace_ext_ref/zimage_*.png, duration=4, seed=450139, out=ch5_f39_video`

---

## F40 — 「真正的數據已經發芽」（對白，8 秒）

**來源**：`story1.md` line 316。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing in
the night rain, phone to his ear, jaw set.

<Subject 2> is the palace exterior from <Picture 2>:
a grand white mansion entrance at night, rain, wet steps.

summary:
Reference-based phone-call closing speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Night rain, medium close-up, wet face lit by lamp glow.

[Shot 1]

00:00-00:08

Action:
Phone to his ear in the rain, Lin Mo delivers the reassurance in a low, steady voice, eyes fixed ahead into
the dark city.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
別怕。
他們搶走的只是載體。
真正的數據，已經在每個國民的心底發芽了。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The rain easing, a low city drone, a single drop ticking off his sleeve.
No other speech.

non_diegetic_music:
A low warm cello line, opening and hopeful under the rain.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch5_palace_ext_ref/zimage_*.png, duration=8, seed=450140, out=ch5_f40_video`

---

## 六、旁白 seed 鎖定與腔調錨點（F0–F40 全部以此為準）

- 旁白 `seed=310000`（F23），與全書旁白共用。
- 每支對白/旁白的 `overall_soundscape` 已寫台灣腔錨點句，並一律帶 `no English / no code-switching`
（QA Q1/Q5）；`speaker_constraints` 已排除英語混雜。
- `<d>` 內無 `「」《》`、無冒號、無阿拉伯數字（養老金缺口已寫中文數字「百分之三十」），
  每句獨立換行（QA Q2/Q3/Q4）。
- 借詞（國安條款、國會、保險金、帳號憑證等均屬中文慣用）不換；`Action` 不複述台詞全文（QA Q3）。

---

## 七、字幕資料表（區塊順序、起始秒、逐字字幕）

> 時間為規劃秒（合併後以實際總長 scale 換算）。旁白（F23）字幕包 `<i>…</i>`。

| # | 區塊 | 類型 | 秒 | 起始秒 | 字幕（逐字） |
|---|------|------|----|--------|--------------|
| 1 | F23 | 旁白 | 11 | 181s | `<i>`這是最誘人的陷阱。政府給你一個職位，讓你成為體制內的一顆齒輪，對外宣稱這是改革，對內則是收編。`</i>` |
| 2 | F3 | 對白 | 16 | 14s | 林委員，這道羊膝是從索利亞邊境附近的農場送來的。在那場崩潰發生前，那裡的農產品是全大陸最好的。可惜，現在那邊只剩下沙子和標語了。 |
| 3 | F4 | 對白 | 10 | 30s | 這就是為什麼我想推動共識協議，總統閣下。我不想看到這道菜成為歐若拉聯邦最後的奢侈品。 |
| 4 | F6 | 對白 | 9 | 44s | 你太理想主義了，林。你以為索利亞是毀於謊言嗎？不，它是毀於過度的真相。 |
| 5 | F7 | 對白 | 10 | 53s | 當人民發現政府其實無力解決乾旱，當他們看到經濟數據徹底崩盤，恐慌就成了比毒藥更快的殺手。 |
| 6 | F8 | 對白 | 10 | 63s | 所以我才需要標籤，我需要給他們一個可以恨的對象，一個可以仰望的目標。標籤是社會的黏著劑。 |
| 7 | F10 | 對白 | 6 | 77s | 你的法案，是在拆掉這座國家的地基。你想要數據透明？ |
| 8 | F11 | 對白 | 11 | 83s | 那如果明年的養老金缺口是百分之三十呢？你打算直接告訴那些領不到錢的老人，讓他們上街燒掉國會嗎？ |
| 9 | F12 | 對白 | 13 | 94s | 我打算告訴他們真相，然後和他們一起討論如何止血，而不是編造一個外敵偷走了金庫的謊言來轉移注意力。 |
| 10 | F14 | 對白 | 9 | 113s | 林，我不打算跟你辯論哲學。盒子裡是一份任命書，以及一個私人基金會的帳號憑證。 |
| 11 | F16 | 對白 | 6 | 126s | 資訊安全審計署的首任署長。這是我特別為你設立的。 |
| 12 | F17 | 對白 | 14 | 132s | 你擁有全聯邦最高的數據調閱權，你可以審查任何你看不順眼的文宣，甚至可以撤換那些做事不精確的官員。只要你，撤回那部共識協議。 |
| 13 | F18 | 對白 | 3 | 146s | 這是一場收買。 |
| 14 | F19 | 對白 | 6 | 149s | 這是一場分權。你想要數據正義，我給你權力去執行。 |
| 15 | F20 | 對白 | 6 | 155s | 但你不能把它寫成法律，因為法律會讓我也失去控制。 |
| 16 | F21 | 對白 | 10 | 161s | 如果你一定要走法律程序，明天國會的表決，你的法案會被修改到連你自己都不認得。 |
| 17 | F22 | 對白 | 10 | 171s | 數據公開會變成在不損害國安前提下有條件公開，而那個前提，是由我定義的。 |
| 18 | F24 | 對白 | 5 | 192s | 總統閣下，您剛才提到，標籤是社會的黏著劑。 |
| 19 | F25 | 對白 | 10 | 197s | 但在我看來，標籤更像是一次性的嗎啡。它能止痛，但不能治病，而且會讓人上癮。 |
| 20 | F26 | 對白 | 8 | 207s | 當藥效過了，劑量就得加大，直到最後，整個國家都會因為藥物過量而暴斃。 |
| 21 | F28 | 對白 | 7 | 221s | 對了，這頓飯的預算，應該是掛在國際事務交流費名下吧？ |
| 22 | F29 | 對白 | 15 | 228s | 根據我的測算，這一桌菜的成本足以支付艾倫那所學校一整個學期的實驗室經費。我會把這個數據放在我明天的開場發言裡。 |
| 23 | F31 | 對白 | 4 | 248s | 林墨，你以為你是在拯救民主。 |
| 24 | F32 | 對白 | 12 | 252s | 但當你把真相赤裸裸地攤在陽光下，卻發現這群人民根本承受不起時，你才是那個親手毀掉歐若拉的人。 |
| 25 | F34 | 對白 | 6 | 268s | 如果民主脆弱到承受不起事實，那它本來就不該存在。 |
| 26 | F36 | 對白 | 6 | 280s | 蘇菲，總統拒絕了。開始準備第六章的應變計畫。 |
| 27 | F37 | 對白 | 13 | 286s | 他們明天會在國會動用國安條款強制閹割法案內容，我們要搶在他們動作前，把原始數據直接投射到公眾視線裡。 |
| 28 | F38 | 對白 | 6 | 299s | 老師，剛才有人闖進了我的住處，搶走了我的筆電。 |
| 29 | F40 | 對白 | 8 | 309s | 別怕。他們搶走的只是載體。真正的數據，已經在每個國民的心底發芽了。 |

---

## 八、產出前自檢（F0–F40）

- [ ] 對白/旁白逐字對照 `story1.md` 第五章（lines 258–317），僅移除標點符號引號，無省略、無自創。
- [ ] `<d>` 內被唸文字皆中文，無 `%`／阿拉伯數字／`「」《》`／冒號；每句獨立換行（QA Q2/Q3/Q4）。
- [ ] 對白區塊指名 `Only <Subject N> speaks`、排除旁白；旁白區塊（F23）畫面角色不開口。
- [ ] `speaker_constraints` 皆排除 English / code-switching（QA Q1/Q5）；`Action` 未複述台詞全文（QA Q3）。
- [ ] 每支對白/旁白 `overall_soundscape` 帶台灣腔錨點句（含 `no English`）；seed 已對照黑名單。
- [ ] 合併後以實際總長 scale 換算 SRT；旁白字幕包 `<i>...</i>`。