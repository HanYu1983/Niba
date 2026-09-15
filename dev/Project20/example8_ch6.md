# Ch6 區塊獨立提示詞 — F0–F33（實作範例 8：第六章「數據的叛亂」）

> 本文件承接 `novel_to_video_guide_v2.md` 與 `example7_ch5.md`（Ch5），
> 完整產出**第六章「數據的叛亂」**的區塊分割、參考圖分配與全部 34 支 r2v 六欄位提示詞，
> 並套用 `video_prompt_guide.md` QA Q1–Q5（排除外語混雜、特殊符號、長句插話、跳針重讀）。
>
> **章節功能**：林墨（現為「黎明委員會」推動者）在國會第一聽證室，與前導師、聯邦最頂尖統計學家亞當斯博士
> 進行「數字真偽」的生死辯論。亞當斯以國安邏輯為數據遮蔽辯護，林墨揭穿民調「過濾條件」與國防預算黑洞，
> 並搶先發布「數據對等協議」Beta 測試版，激起民間逆向工程與「真實聯邦帳單」。情緒走向：硬資訊戰 →
> 冷峻微笑 → 「數據叛亂」全場震動 → 亞當斯筆落 → 金句收尾 → 國外街頭群眾查帳。
> 登場角色：林墨（沿用 Ref-M）、亞當斯博士（**新肖像**）、黑西裝精算師團隊（群像，無對白）、官員（背景）。
> ⚠ **QA 應用**：對白一律移除 `「」『』`《》引號、冒號與刪節號、驚嘆號；阿拉伯數字改中文數字（75%→百分之七十五、
> 3.0→三點零）；外語借詞「Beta」移除（改「測試版」）；原文對林墨誤用「妳」規範為「你」；
> 每句獨立換行；借詞（伺服器、開源論壇、逆向工程、程式設計師等中文慣用）保持原文並避免切點落在借詞前；
> 錨點句一律含 `no English`。

---

## 一、參考圖管理表（Step 1：一次性建置）

> 沿用既有：`Ref-M`（林墨）。Ch6 新增 **4 張 Z-Image**：亞當斯博士肖像、國會第一聽證室、
> 聽證室投影螢幕、國會外街頭。

| 編號 | 檔名（實際既有） | 內容 | 尺寸 | 用於區塊 |
|------|------|------|------|---------|
| Ref-M | `output/ch1_beat13_ref_char/zimage_00008_.png`（**共用**，同 Ch1–Ch5） | 林墨肖像：瘦削中年、灰絲黑髮、淺鬍茬、深炭灰西裝、皺白襯衫無領帶 | 832×1248 (2:3) | 林墨諸鏡 |
| Ref-ADAMS | `output/ch6_adams_ref/zimage_*.png`（**新增**） | 亞當斯博士肖像：五十多歲東亞男性、銀框眼鏡、灰白側分短髮頂達稀疏、深藍灰學術西裝＋淺藍襯衫、神情嚴厲帶遺憾、端坐證人席 | 832×1248 | F1、F3–F4、F6–F8、F16–F20、F22、F27–F28 |
| Ref-HR | `output/ch6_hearingroom_ref/zimage_*.png`（**新增**） | 國會第一聽證室：高挑莊嚴、深色木鑲板、中央長條作證席面對高起的議員排席、暖白吊燈、成排廣播攝影機、大型投影螢幕 | 832×1248 | F0–F7、F9–F11、F16–F20、F24、F28–F30 |
| Ref-SCR | `output/ch6_screen_ref/zimage_*.png`（**新增**） | 聽證室投影大螢幕特寫：統計曲線、密密麻麻程式碼、紅白數據圖表、深藍底 | 832×1248 | F10、F12–F13、F21–F26 |
| Ref-STR | `output/ch6_street_ref/zimage_*.png`（**新增**） | 國會外街道夜晚：高大的公共電子螢幕、聚集高舉手機的群眾、霓虹與靜電光、警方警戒線 | 832×1248 | F31–F33 |

> **建置狀態**：Ch6 需新建 4 張（Step 1 一次完成），其餘沿用。

---

## 二、總表：區塊分割與計秒

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留緩神餘裕進位；場景按動作粗估、寧短勿長。
> 原文範圍：`story1.md` 第六章（lines 322–376）。全部合併規劃約 **249 秒**。

| # | 類型 | 內容 | 秒 |
|---|------|------|----|
| F0 | 場景 | 國會第一聽證室定場：高挑莊嚴、攝影機與投影螢幕（line 324） | 5 |
| F1 | 場景 | 亞當斯端坐作證席、身後一整隊黑西裝精算師持平板（line 326） | 6 |
| F2 | 場景 | 林墨坐對面、卷宗闔在桌上、目光銳利（line 330 前段） | 4 |
| F3 | 對白 | 亞當斯：「林委員，數據是有層次的…只會引發無意義的噪音。」（line 328 前段） | 16 |
| F4 | 對白 | 亞當斯：「政府的職責，是將噪音過濾成可理解的訊號。」（line 328 後段） | 8 |
| F5 | 對白 | 林墨：「過濾？…定義為統計誤差嗎？」（line 330） | 10 |
| F6 | 場景 | 聽證室攝影機紛紛轉向亞當斯（line 332） | 4 |
| F7 | 對白 | 亞當斯：「那是國安機密下的資源動員…防禦缺口。」（line 334 前段） | 9 |
| F8 | 對白 | 亞當斯：「林，你是在用科學透明來武裝國家的敵人。」（line 334 後段） | 6 |
| F9 | 旁白 | 「這又是那套熟悉的國安邏輯…不可觸碰的神諭。」（line 336） | 7 |
| F10 | 對白 | 林墨：「好，我們不談國防…滿意度高達百分之七十五。」（line 338 前段） | 10 |
| F11 | 對白 | 林墨：「但我調閱了你們委託的民調機構…原始訪問紀錄。」（line 338 後段） | 9 |
| F12 | 場景 | 林墨按下播放鍵、投影幕出現密密麻麻程式碼（line 340） | 5 |
| F13 | 對白 | 林墨：「我發現了一個有趣的過濾條件…關鍵字的用戶。」（line 342 前段） | 11 |
| F14 | 對白 | 林墨：「也就是說…大家都很滿意。」（line 342 中段） | 10 |
| F15 | 對白 | 林墨：「這不是過濾噪音，這是製造幻覺。」（line 342 後段） | 4 |
| F16 | 場景 | 亞當斯臉色難看、精算師狂按平板（line 344） | 5 |
| F17 | 對白 | 亞當斯：「那是為了確保樣本的穩定性。」（line 346） | 4 |
| F18 | 對白 | 林墨拍桌：「那是為了確保結論符合總統的期望。」（line 348 前段） | 5 |
| F19 | 對白 | 林墨：「當政府控制了定義事實的公式…權力的計算結果。」（line 348 後段） | 9 |
| F20 | 場景 | 側門推開、官員慌張湊到亞當斯耳邊低語（line 350） | 5 |
| F21 | 場景 | 林墨看著螢幕、露出冷峻微笑（line 352） | 4 |
| F22 | 對白 | 林墨：「博士，您不用聽他解釋了…發布到了公眾網路。」（line 354 前段） | 13 |
| F23 | 對白 | 林墨：「現在，聯邦境內有超過十萬名程式設計師…逆向工程。」（line 354 後段） | 12 |
| F24 | 場景 | 聽證室螢幕切換成「真實聯邦帳單」（line 356） | 5 |
| F25 | 場景 | 螢幕對比行閃爍：官方宣傳 vs 民間逆向運算（line 358–361） | 6 |
| F26 | 對白 | 林墨：「這就是我說的數據叛亂…殘酷百倍。」（line 363） | 13 |
| F27 | 場景 | 亞當斯筆頹然滑落、意識到被解除壟斷（line 365） | 5 |
| F28 | 對白 | 亞當斯顫抖：「這會引發暴動的。」（line 367） | 4 |
| F29 | 對白 | 林墨：「會引發暴動的不是數據，而是被欺騙後的憤怒。」（line 369 前段） | 6 |
| F30 | 對白 | 林墨：「博士，您的公式算錯了…真相就是穩定本身。」（line 369 後段） | 10 |
| F31 | 場景 | 走出聽證室、國會外螢幕被佔領滾動真實數字（line 371） | 6 |
| F32 | 場景 | 街頭群眾聚集、舉手機核對帳單差異（line 373） | 8 |
| F33 | 旁白 | 「當人民學會查帳，政客的標籤就再也貼不上去。」（line 375） | 5 |

> 全表 **34 個區塊**（F0–F33），對白 19、旁白 2、場景 13。旁白 `seed=310000`（見第 6 節）。
> 廣播攝影機快門／平板聲一律只入 `overall_soundscape`，畫面無對嘴角色不進 `<d>`。

---

## 三、區塊 × 參考圖對照

| 區塊 | 類型 | ref_image_0 | ref_image_1 | ref_image_2 | duration |
|------|------|-------------|-------------|-------------|----------|
| F0 | 場景 | Ref-HR 聽證室 | — | — | 5 |
| F1 | 場景 | Ref-ADAMS 亞當斯(證人席) | Ref-HR 聽證室 | — | 6 |
| F2 | 場景 | Ref-M 林墨(對坐) | Ref-HR 聽證室 | — | 4 |
| F3 | 對白 | Ref-ADAMS 亞當斯 | Ref-HR 聽證室 | — | 16 |
| F4 | 對白 | Ref-ADAMS 亞當斯 | Ref-HR 聽證室 | — | 8 |
| F5 | 對白 | Ref-M 林墨(翻卷宗) | Ref-HR 聽證室 | — | 10 |
| F6 | 場景 | Ref-ADAMS 亞當斯 | Ref-HR 聽證室 | — | 4 |
| F7 | 對白 | Ref-ADAMS 亞當斯 | Ref-HR 聽證室 | — | 9 |
| F8 | 對白 | Ref-ADAMS 亞當斯 | Ref-M 林墨(聆聽) | — | 6 |
| F9 | 旁白 | Ref-M 林墨(凝重聆聽) | Ref-HR 聽證室 | — | 7 |
| F10 | 對白 | Ref-M 林墨(持遙控) | Ref-SCR 螢幕(曲線) | Ref-HR 聽證室 | 10 |
| F11 | 對白 | Ref-M 林墨(翻紀錄) | Ref-HR 聽證室 | — | 9 |
| F12 | 場景 | Ref-SCR 螢幕(程式碼) | Ref-M 林墨(按下播放) | — | 5 |
| F13 | 對白 | Ref-M 林墨(指螢幕) | Ref-SCR 螢幕 | — | 11 |
| F14 | 對白 | Ref-M 林墨(轉向亞當斯) | Ref-ADAMS 亞當斯 | — | 10 |
| F15 | 對白 | Ref-M 林墨 | Ref-ADAMS 亞當斯 | — | 4 |
| F16 | 場景 | Ref-ADAMS 亞當斯(色變) | Ref-HR 聽證室 | — | 5 |
| F17 | 對白 | Ref-ADAMS 亞當斯 | Ref-HR 聽證室 | — | 4 |
| F18 | 對白 | Ref-M 林墨(拍桌起身) | Ref-ADAMS 亞當斯 | — | 5 |
| F19 | 對白 | Ref-M 林墨(站立) | Ref-ADAMS 亞當斯 | — | 9 |
| F20 | 場景 | Ref-ADAMS 亞當斯(側耳) | Ref-HR 聽證室 | — | 5 |
| F21 | 場景 | Ref-M 林墨(冷峻微笑) | Ref-SCR 螢幕 | — | 4 |
| F22 | 對白 | Ref-M 林墨(侃侃而談) | Ref-SCR 螢幕 | Ref-ADAMS 亞當斯(色變) | 13 |
| F23 | 對白 | Ref-M 林墨 | Ref-SCR 螢幕 | — | 12 |
| F24 | 場景 | Ref-SCR 螢幕(真實帳單) | Ref-HR 聽證室 | — | 5 |
| F25 | 場景 | Ref-SCR 螢幕(對比行) | — | — | 6 |
| F26 | 對白 | Ref-M 林墨(指紅數據) | Ref-SCR 螢幕 | — | 13 |
| F27 | 場景 | Ref-ADAMS 亞當斯(筆落) | Ref-SCR 螢幕 | — | 5 |
| F28 | 對白 | Ref-ADAMS 亞當斯(顫抖) | Ref-HR 聽證室 | — | 4 |
| F29 | 對白 | Ref-M 林墨(整裝起身) | Ref-HR 聽證室 | — | 6 |
| F30 | 對白 | Ref-M 林墨(走向出口) | Ref-HR 聽證室 | — | 10 |
| F31 | 場景 | Ref-M 林墨(仰望螢幕) | Ref-STR 街頭 | — | 6 |
| F32 | 場景 | Ref-STR 街頭(群眾舉手機) | — | — | 8 |
| F33 | 旁白 | Ref-STR 街頭(查帳群眾) | — | — | 5 |

> 未餵 `ref_image_N` 一律省略（勿留空檔名殘餘污染，見 v2 §3）。

---

## F0 — 國會聽證室定場（場景，5 秒）

**來源**：`story1.md` line 324。

```
subject_definitions:
<Subject 1> is the first hearing room of the Congress from <Picture 1>:
a tall solemn hearing chamber, dark wood panelling, a long witness table at the centre facing a raised row of
member seats, warm white chandeliers, banks of broadcast cameras, a large dark projection screen.

summary:
Reference-based establishing shot of the hearing room.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Hard institutional light, slow tilt across the cold chamber.

[Shot 1]

00:00-00:05

Action:
A slow tilt over the tensely quiet hearing room: the long polished witness table, the raised member seats, the
row of broadcast cameras, the dark projection screen glowing blank under the chandeliers.

overall_soundscape:
A taut institutional room tone, faint shutter clicks, a distant camera zoom whir. No human voice.

non_diegetic_music:
A low held string note, formal and pressing.
```

**參數**：`ref_image_0=output/ch6_hearingroom_ref/zimage_*.png, duration=5, seed=460100, out=ch6_f0_video`

---

## F1 — 亞當斯與精算師陣容（場景，6 秒）

**來源**：`story1.md` line 326。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked short side-parted hair with a thinning
crown, dark blue-grey scholarly suit over a pale blue shirt, a stern regretful academic air, seated at the
witness table.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based opposition lineup shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Symmetrical opposing-frame composition, flat hearing-room light.

[Shot 1]

00:00-00:06

Action:
Dr. Adams sits at the centre of the witness table, a full row of black-suited, tie-wearing actuaries holding
tablets arrayed behind and beside him, the government's formation stretching across the frame.

overall_soundscape:
Papers settling, tablets clicking, the tight room tone. No human voice.

non_diegetic_music:
A low cello pulse, faintly adversarial.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=6, seed=460101, out=ch6_f1_video`

---

## F2 — 林墨對坐（場景，4 秒）

**來源**：`story1.md` line 326 末段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit over a
wrinkled white shirt with no tie, seated alone across the hearing room.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based cross-the-room seating shot.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Hard light, medium shot across the aisle.

[Shot 1]

00:00-00:04

Action:
Lin Mo sits alone across from the witness table, his dossier closed on the desk, hands folded, eyes sharp and
unreadable in the hard light.

overall_soundscape:
The tight room tone, a chair creak somewhere. No human voice.

non_diegetic_music:
A low held string drone.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=4, seed=460102, out=ch6_f2_video`

---

## F3 — 「數據是有層次的」（對白，16 秒）

**來源**：`story1.md` line 328 前段。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked short side-parted hair with a thinning
crown, dark blue-grey scholarly suit over a pale blue shirt, seated at the witness table.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based opening speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, flat academic light, a slight low angle on the witness table.

[Shot 1]

00:00-00:16

Action:
Adams adjusts his silver glasses, speaking in the regretful tone of a senior scholar, hands resting on an open
weather-beaten binder, unhurried and patronising.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林委員，數據是有層次的。
你在草案中要求完全透明，這在科學上是極其幼稚的行為。
很多原始數據在未經加工前，只會引發無意義的噪音。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Hearing-room hum, a distant camera whir, pages turning.
No other speech.

non_diegetic_music:
A low formal string line, polite and condescending.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=16, seed=460103, out=ch6_f3_video`

---

## F4 — 「過濾成可理解的訊號」（對白，8 秒）

**來源**：`story1.md` line 328 後段。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked short side-parted hair with a thinning
crown, dark blue-grey scholarly suit over a pale blue shirt, seated at the witness table.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, flat academic light.

[Shot 1]

00:00-00:08

Action:
Adams sets down his glasses-stem between two fingers, delivering the conclusion slightly slower, as if closing
a textbook.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
政府的職責，是將噪音過濾成可理解的訊號。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Hearing-room hum, a soft page turn.
No other speech.

non_diegetic_music:
A low formal string line, cold and conclusive.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=8, seed=460104, out=ch6_f4_video`

---

## F5 — 「定義為統計誤差嗎」（對白，10 秒）

**來源**：`story1.md` line 330。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit over a
wrinkled white shirt with no tie, seated across the hearing room.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based cross-examination turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, hard hearing-room light.

[Shot 1]

00:00-00:10

Action:
Lin flips open a printed dossier, an eyebrow raised, his voice dry and precise, darting eyes to the cameras
then back to Adams.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
過濾？
博士，您指的過濾，是將去年國防預算中消失的四十億歐若拉幣，定義為統計誤差嗎？
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Shutters clicking as cameras turn, the tight room tone.
No other speech.

non_diegetic_music:
A low cello line, probing and sharp.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=10, seed=460105, out=ch6_f5_video`

---

## F6 — 攝影機轉向亞當斯（場景，4 秒）

**來源**：`story1.md` line 332。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked short side-parted hair with a thinning
crown, dark blue-grey scholarly suit, seated at the witness table.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, banks of broadcast cameras, raised member seats.

summary:
Reference-based camera-pivot beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Wide shot, room light, camera movements within frame.

[Shot 1]

00:00-00:04

Action:
The row of broadcast cameras swings as one toward the witness table; red REC lights blink on, a low murmur
sweeps the gallery, Adams sitting still in their sights.

overall_soundscape:
Camera servo whirs, the murmur rising, shutter clicks. No distinct human voice.

non_diegetic_music:
A low tension pulse, thin.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=4, seed=460106, out=ch6_f6_video`

---

## F7 — 「國安機密下的資源動員」（對白，9 秒）

**來源**：`story1.md` line 334 前段。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked short side-parted hair with a thinning
crown, dark blue-grey scholarly suit, seated at the witness table.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, flat light, an immovable posture.

[Shot 1]

00:00-00:09

Action:
Adams folds his hands on the table, unruffled, lecturing calmly as if correcting a student, not lifting his
voice.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
那是國安機密下的資源動員。
如果我們公布每一分錢的流向，敵對國索利亞會立刻掌握我們的防禦缺口。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Hearing-room hum, a faint electron whine from the cameras.
No other speech.

non_diegetic_music:
A low string line, patient and evasive.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=9, seed=460107, out=ch6_f7_video`

---

## F8 — 「武裝國家的敵人」（對白，6 秒）

**來源**：`story1.md` line 334 後段。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked short side-parted hair with a thinning
crown, dark blue-grey scholarly suit, seated at the witness table.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, listening
across the room.

summary:
Reference-based speech turn aimed across the room.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Over-shoulder from behind Lin Mo, medium shot on Adams.

[Shot 1]

00:00-00:06

Action:
Adams turns his chin slightly and directs the sentence at Lin Mo across the table, his tone hardening for the
first time, glasses glinting.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林，你是在用科學透明來武裝國家的敵人。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The hearing-room hum, a held silence.
No other speech.

non_diegetic_music:
A low cello note, turning colder.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=6, seed=460108, out=ch6_f8_video`

---

## F9 — 旁白「國安邏輯」（旁白，7 秒）

**來源**：`story1.md` line 336。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, sitting very
still in the hearing room.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based inner-monologue narration beat.
No lip movement on screen.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No character speaks on screen. Narration is an inner monologue voice-over only.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on a still face, desaturated hearing-room light.

[Shot 1]

00:00-00:07

Action:
Lin Mo listens without expression as the narration plays over his face; only a slow blink breaks the stillness,
the room receding around him.

Narration (inner monologue):
<d>
[中文]
這又是那套熟悉的國安邏輯。
只要掛上這層殼，數據就成了不可觸碰的神諭。
</d>

overall_soundscape:
Narration in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
Hearing-room hum fading slightly under the voice, a camera whir.

non_diegetic_music:
A low ambiguous drone, contemplative.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=7, seed=310000, out=ch6_f9_video`

---

## F10 — 「民生信心指數」（對白，10 秒）

**來源**：`story1.md` line 338 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, holding a
presentation remote across the hearing room.

<Subject 2> is a large projection screen from <Picture 2>:
dense statistical curves and white data labels on a dark blue background.

<Subject 3> is the first hearing room of the Congress from <Picture 3>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based speech turn with a screen reveal.
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
Medium shot, hard light, the screen glow edging the frame.

[Shot 1]

00:00-00:10

Action:
Lin tosses aside the national-security debate and taps the remote; a curve lights up on the big screen as he
names it, voice steady and factual.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
好，我們不談國防。
那我們談談民生信心指數。
政府宣稱上個月國民對物價的滿意度高達百分之七十五。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Screen projector hum, camer a shutters, the room tone.
No other speech.

non_diegetic_music:
A low string line, gaining traction.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_*.png, ref_image_2=output/ch6_hearingroom_ref/zimage_*.png, duration=10, seed=460110, out=ch6_f10_video`

---

## F11 — 「民調機構原始紀錄」（對白，9 秒）

**來源**：`story1.md` line 338 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, turning a
printed record over the table.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, hard light.

[Shot 1]

00:00-00:09

Action:
Lin turns from the screen back to the room, holding up a thin printed record like a scalpel, the sentence
landing flat and damning.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
但我調閱了你們委託的民調機構，聯邦大數據研究所的原始訪問紀錄。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Papers rustling, the projector hum.
No other speech.

non_diegetic_music:
A low cello line, tightening.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=9, seed=460111, out=ch6_f11_video`

---

## F12 — 投影幕跳出程式碼（場景，5 秒）

**來源**：`story1.md` line 340。

```
subject_definitions:
<Subject 1> is a large projection screen from <Picture 1>:
dense scrolling lines of white code on a dark blue background.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, pressing a
play button on the remote.

summary:
Reference-based screen reveal beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Screen-filling code close-up cutting to a small silhouette below.

[Shot 1]

00:00-00:05

Action:
Lin presses play and the projection floods with dense white code scrolling slowly upward, a hushed wave moving
through the gallery, Lin a small dark figure beneath the wall of text.

overall_soundscape:
Projector hum climbing, a collective indrawn breath, shutters clicking.

non_diegetic_music:
A low electronic pulse, watchful.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_*.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=5, seed=460112, out=ch6_f12_video`

---

## F13 — 「有趣的過濾條件」（對白，11 秒）

**來源**：`story1.md` line 342 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, pointing at
the projection screen.

<Subject 2> is a large projection screen from <Picture 2>:
dense scrolling lines of white code, a highlighted filter condition, red underlines.

summary:
Reference-based speech turn at the screen.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot, code-light washing the face.

[Shot 1]

00:00-00:11

Action:
Lin points at a highlighted line on the screen, eyes like blades, pacing his words so each lands.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
我發現了一個有趣的過濾條件，篩選掉所有在過去三個月內曾搜尋過失業、補助或貸款關鍵字的用戶。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Projector hum, the deepening quiet of the gallery.
No other speech.

non_diegetic_music:
A low pulse, accelerating slightly.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_*.png, duration=11, seed=460113, out=ch6_f13_video`

---

## F14 — 「只詢問生活無憂的人」（對白，10 秒）

**來源**：`story1.md` line 342 中段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, turning to
face the witness table.

<Subject 2> is Dr. Adams from <Picture 2>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
seated, watching.

summary:
Reference-based speech turn aimed at the witness.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot, hard light, face steeling.

[Shot 1]

00:00-00:10

Action:
Lin turns from the screen toward Adams, voice hardening into quiet accusation as he lays out what the filter
did.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
也就是說，你們只詢問那些生活無憂的人是否滿意物價，然後告訴全國人民，大家都很滿意。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Projector hum, a held silence around the room.
No other speech.

non_diegetic_music:
A low cello line, stern.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_adams_ref/zimage_*.png, duration=10, seed=460114, out=ch6_f14_video`

---

## F15 — 「不是過濾噪音，是製造幻覺」（對白，4 秒）

**來源**：`story1.md` line 342 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, still and
centred across the room.

<Subject 2> is Dr. Adams from <Picture 2>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
seated, watching.

summary:
Reference-based speech turn, a landed point.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, brief freeze in movement, code light across the face.

[Shot 1]

00:00-00:04

Action:
Lin lets the closing point land in the silence, barely moving, letting the room hear every word.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這不是過濾噪音，這是製造幻覺。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
A dead-still room tone, projector hum.
No other speech.

non_diegetic_music:
A single low string hit, final.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_adams_ref/zimage_*.png, duration=4, seed=460115, out=ch6_f15_video`

---

## F16 — 亞當斯色變、精算師猛按平板（場景，5 秒）

**來源**：`story1.md` line 344。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
his colour turning for the first time.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, black-suited actuaries with tablets.

summary:
Reference-based reaction beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Medium shot, hard light, restless hands in frame.

[Shot 1]

00:00-00:05

Action:
Adams' face sours for the first time; behind him the black-suited actuaries hammer on their tablets in a
frenzy, thumbs flying, searching for a rebuttal.

overall_soundscape:
Rapid tablet taps, papers sliding, the murmur of aides. No distinct human speech.

non_diegetic_music:
A low tense rattle, quickening.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=5, seed=460116, out=ch6_f16_video`

---

## F17 — 「樣本的穩定性」（對白，4 秒）

**來源**：`story1.md` line 346。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
seated at the witness table.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based weak rebuttal turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, voice wavering under camera glare.

[Shot 1]

00:00-00:04

Action:
Adams starts an unconvincing reply, fingers touching his glasses, trailing off under the cameras' glare.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
那是為了確保樣本的穩定性。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Camera shutters, the tense room tone.
No other speech.

non_diegetic_music:
A low string, thin and defensive.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=4, seed=460117, out=ch6_f17_video`

---

## F18 — 「符合總統的期望」（對白，5 秒）

**來源**：`story1.md` line 348 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, rising to
his feet, hand flat on the table.

<Subject 2> is Dr. Adams from <Picture 2>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
seated, caught off guard.

summary:
Reference-based slamming-table speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Low angle on the rising figure, hard light.

[Shot 1]

00:00-00:05

Action:
Lin slams the table and rises to his feet, his voice ringing across the chamber, cutting Adams off.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
那是為了確保結論符合總統的期望。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The slam echoing, scattered gasps, shutters.
No other speech.

non_diegetic_music:
A sharp low cello strike.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_adams_ref/zimage_*.png, duration=5, seed=460118, out=ch6_f18_video`

---

## F19 — 「權力的計算結果」（對白，9 秒）

**來源**：`story1.md` line 348 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing at
his place, voice carrying.

<Subject 2> is Dr. Adams from <Picture 2>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
seated, listening.

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
Standing medium shot, echo of the high chamber.

[Shot 1]

00:00-00:09

Action:
Lin stays on his feet, pressing the point into the chamber, the cameras locked on him.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
當政府控制了定義事實的公式，民主就不再是人民的選擇，而是權力的計算結果。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Chamber echo under the voice, shutter clicks.
No other speech.

non_diegetic_music:
A low cello line, rising.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_adams_ref/zimage_*.png, duration=9, seed=460119, out=ch6_f19_video`

---

## F20 — 官員慌張耳語（場景，5 秒）

**來源**：`story1.md` line 350。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
leaning to receive a whisper.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, a side door, black-suited aides, long witness table.

summary:
Reference-based interruption beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Medium shot, doorway light spilling in.

[Shot 1]

00:00-00:05

Action:
A side door opens and a flushed official hurries to Adams' ear, whispering urgently; Adams' expression stills
mid-sentence, motion arrested.

overall_soundscape:
The door hissing, muffled whispers, the room's attention shifting.

non_diegetic_music:
A low alarm pulse, restrained.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=5, seed=460120, out=ch6_f20_video`

---

## F21 — 冷峻微笑（場景，4 秒）

**來源**：`story1.md` line 352。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, watching
from his seat.

<Subject 2> is a large projection screen from <Picture 2>:
dense data curves and code on a dark blue background, alight.

summary:
Reference-based knowing-smile beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Medium close-up, cold knowing smile, screen glow shifting on the face.

[Shot 1]

00:00-00:04

Action:
Lin watches the hushed exchange at the witness table, then flicks his eyes to the screen; a cold, knowing
smile crosses his face.

overall_soundscape:
A held room tone, the projector hum, muffled whispers.

non_diegetic_music:
A single low string note, sardonic.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_*.png, duration=4, seed=460121, out=ch6_f21_video`

---

## F22 — 「蘇菲發布測試版」（對白，13 秒）

**來源**：`story1.md` line 354 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing
and speaking with calm authority.

<Subject 2> is a large projection screen from <Picture 2>:
dense code and data panels on a dark blue background.

<Subject 3> is Dr. Adams from <Picture 3>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
colour draining.

summary:
Reference-based reveal speech turn.
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
Standing medium shot, the room at his back, voice calm.

[Shot 1]

00:00-00:13

Action:
Lin raises a hand, unhurried, delivering the reveal in a low even voice while the chamber turns to him and
Adams' colour drains.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
博士，您不用聽他解釋了。
就在三分鐘前，我的助理蘇菲雖然丟了筆電，但她已經將數據對等協議的測試版發布到了公眾網路。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Projector hum, the gallery's held breath.
No other speech.

non_diegetic_music:
A low cello line, patient and inevitable.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_*.png, ref_image_2=output/ch6_adams_ref/zimage_*.png, duration=13, seed=460122, out=ch6_f22_video`

---

## F23 — 「十萬名程式設計師逆向工程」（對白，12 秒）

**來源**：`story1.md` line 354 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, gesturing
toward the screen.

<Subject 2> is a large projection screen from <Picture 2>:
dense code and red-white data panels on a dark blue background.

summary:
Reference-based speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot, cool factual tone, screen glow.

[Shot 1]

00:00-00:12

Action:
Lin gestures toward the flickering wall of code, his delivery calm and factual, as if reading a weather
report.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
現在，聯邦境內有超過十萬名程式設計師，正利用你們政府公開過的歷年預算書進行逆向工程。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Projector hum, murmurs rising behind the voice.
No other speech.

non_diegetic_music:
A low rising pulse.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_*.png, duration=12, seed=460123, out=ch6_f23_video`

---

## F24 — 螢幕切換「真實聯邦帳單」（場景，5 秒）

**來源**：`story1.md` line 356。

```
subject_definitions:
<Subject 1> is a large projection screen from <Picture 1>:
a live data panel titled with a real national ledger, red and white rows, ticking numbers.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, raised member seats, long witness table.

summary:
Reference-based screen-switch beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Screen-wide reveal, then the room shrinking beneath it.

[Shot 1]

00:00-00:05

Action:
The hearing-room screen abruptly switches from government slides to the raw, crowd-curated "Real Federal
Ledger", rows of numbers already ticking, a collective stir in the gallery.

overall_soundscape:
A data-update chime, the projector hum climbing, scattered exclamations.

non_diegetic_music:
A low electronic underdrone, gathering.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=5, seed=460124, out=ch6_f24_video`

---

## F25 — 帳單對比數據閃爍（場景，6 秒）

**來源**：`story1.md` lines 358–361。

```
subject_definitions:
<Subject 1> is a large projection screen from <Picture 1>:
a live data panel with rows of figures, official claims on one side and red crowdsourced counter-numbers on
the other.

summary:
Reference-based data-blowup beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Full-frame data visual, red numbers dominating.

[Shot 1]

00:00-00:06

Action:
The panel cycles comparison rows: official percentages on the left holding steady, the crowdsourced
counter-figures on the right slamming upward in red, the ledger rewriting itself live.

overall_soundscape:
Rapid data-update ticks, an ascending alarm hum, no human voice.

non_diegetic_music:
A hard electronic pulse, rising.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_*.png, duration=6, seed=460125, out=ch6_f25_video`

---

## F26 — 「數據叛亂」（對白，13 秒）

> **r2（修正）**：seed 460126 在「這就是我說的數據叛亂。」與「當你們拒絕提供真相…」之間被插入奇怪對白（QA Q6）。
> 改用 seed 461126＋Q6 處置重跑——句 2 原以「當…」從屬連詞另起話題，併入句 1 語流成為同一複句、
> 三句字數平均化（28/29）消除氣口失衡、`Action` 移除 `ringing through the chamber` 聲效回應暗示。
> 修正版落盤：`output/ch6_f26_video/video/MiniMax_H3_00478_.mp4`（取代舊檔 00469）。

**來源**：`story1.md` line 363。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, pointing at
the flickering red numbers.

<Subject 2> is a large projection screen from <Picture 2>:
flashing red data rows and ticking numbers on a dark blue background.

summary:
Reference-based speech turn at the screen.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot, red screen-light across his face, voice building.

[Shot 1]

00:00-00:13

Action:
Lin points at the flashing red numbers as he names the rebellion, voice building in one continuous statement.
Camera stays on him; no cut, no off-screen sound.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這就是我說的數據叛亂，當你們拒絕提供真相，人民會自己去挖掘。
而這種挖掘出來的真相，往往會比你們誠實公開的還要殘酷百倍。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Data ticks under the voice, the gallery's stillness.
No other speech.

non_diegetic_music:
A low cello line, weight behind it.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_00056_.png, duration=13, seed=461126, out=ch6_f26_video`

---

## F27 — 亞當斯筆落（場景，5 秒）

**來源**：`story1.md` line 365。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
hands loosening at the witness table.

<Subject 2> is a large projection screen from <Picture 2>:
flashing red data rows ticking upward.

summary:
Reference-based collapse-of-certainty beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Medium close-up on the hand, red light bleeding in.

[Shot 1]

00:00-00:05

Action:
Adams stares at the jumping numbers, his pen slipping from his fingers and rolling across the polished table,
the sound of his certainty breaking.

overall_soundscape:
The pen clattering, a long room silence, data ticks.

non_diegetic_music:
A low descending cello note.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_screen_ref/zimage_*.png, duration=5, seed=460127, out=ch6_f27_video`

---

## F28 — 「會引發暴動的」（對白，4 秒）

**來源**：`story1.md` line 367。

```
subject_definitions:
<Subject 1> is Dr. Adams from <Picture 1>:
East Asian man in his mid-50s, silver wire-rimmed glasses, grey-flecked hair, dark blue-grey scholarly suit,
trembling slightly at the witness table.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, cameras.

summary:
Reference-based faltering speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, trembling breath, low sound.

[Shot 1]

00:00-00:04

Action:
Adams speaks in a small, trembling voice, reduced, as if seeing the floor give way beneath him.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這會引發暴動的。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The empty room tone swallowing the words.
No other speech.

non_diegetic_music:
A thin held string, shaken.
```

**參數**：`ref_image_0=output/ch6_adams_ref/zimage_*.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=4, seed=460128, out=ch6_f28_video`

---

## F29 — 「不是數據，是被欺騙後的憤怒」（對白，6 秒）

> **r2（修正）**：seed 460129 輸出口型沒對上（對白可聽、人物沒張嘴，QA Q7）。
> 改用 seed 461129＋Q7 處置重跑——站定說話、加正向嘴部 cue、去離場動作與表情封印詞、medium close-up。
> 修正版落盤：`output/ch6_f29_video/video/MiniMax_H3_00477_.mp4`（取代舊檔 00472）。

**來源**：`story1.md` line 369 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, calm but firm,
facing the chamber while he speaks.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats.

summary:
Reference-based speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks.
No other character speaks.
No narration. No voice-over.
never English / no code-switching / no foreign language.
The mouth must move visibly while speaking.

detailed_description:

Visual style:
Medium close-up on Lin's face, calm but firm delivery, camera holds him facing the chamber.

[Shot 1]

00:00-00:06

Action:
Lin faces the chamber squarely and speaks in a calm but firm tone. His mouth opens and closes clearly with every
syllable, lips visibly articulating each Chinese word. Camera holds his face steady; only slight gestures, no body
movement away from the camera.

Dialogue:
<Subject 1> says:

<d>
[中文]
會引發暴動的不是數據，而是被欺騙後的憤怒。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The chamber in silence, soft breath.
No other speech.

non_diegetic_music:
A low cello line, calm and closing.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_hearingroom_ref/zimage_00055_.png, duration=6, seed=461129, out=ch6_f29_video`

---

## F30 — 「真相就是穩定本身」（對白，10 秒）

**來源**：`story1.md` line 369 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, at the exit
of the hearing room.

<Subject 2> is the first hearing room of the Congress from <Picture 2>:
a tall solemn hearing chamber, long witness table, raised member seats, the doors ahead.

summary:
Reference-based closing speech turn.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Trailing medium shot, his back to the chamber.

[Shot 1]

00:00-00:10

Action:
Lin delivers the closing line on his way to the door, half turning, final and unarguable, the chamber behind
him in silence.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
博士，您的公式算錯了。
在民主三點零的時代，真相不是維護穩定的代價，真相就是穩定本身。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
His footsteps, the vast room's quiet.
No other speech.

non_diegetic_music:
A low warm cello line, definitive.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_hearingroom_ref/zimage_*.png, duration=10, seed=460130, out=ch6_f30_video`

---

## F31 — 國會外螢幕被佔領（場景，6 秒）

**來源**：`story1.md` line 371。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, stepping out
of a grand building, looking up.

<Subject 2> is the street outside the Congress from <Picture 2>:
huge public electronic screens, main-stream screens hijacked to scrolling genuine financial figures, neon and
static light, police barriers.

summary:
Reference-based exterior reveal beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Low angle from street level up at the screens, night light.

[Shot 1]

00:00-00:06

Action:
Stepping out of the building at night, Lin looks up at the Congress billboards, no longer propaganda: the big
screens scroll genuine, crowdsourced financial figures under police floodlights.

overall_soundscape:
Street crowd murmur, screen static, distant sirens.

non_diegetic_music:
A low pulse, opening up.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_street_ref/zimage_*.png, duration=6, seed=460131, out=ch6_f31_video`

---

## F32 — 街頭群眾舉手機查帳（場景，8 秒）

**來源**：`story1.md` line 373。

```
subject_definitions:
<Subject 1> is the street outside the Congress from <Picture 1>:
a gathered crowd at night, people holding up phones, screens glowing, neon and static light, police barriers
at the edge.

summary:
Reference-based crowd-accounting beat.
No dialogue.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No one speaks. No narration. No voice-over.

detailed_description:

Visual style:
Wide street shot, thousands of small lit screens.

[Shot 1]

00:00-00:08

Action:
In the street people gather, no flyers this time, each holding a phone up, brow furrowed as they cross-check
household bills against the "real ledger" glowing on the screens above them.

overall_soundscape:
The crowd's low murmur of counting, phone chimes, screen static, night wind.

non_diegetic_music:
A low swelling string, hopeful and uneasy.
```

**參數**：`ref_image_0=output/ch6_street_ref/zimage_*.png, duration=8, seed=460132, out=ch6_f32_video`

---

## F33 — 旁白「政客的標籤貼不上去」（旁白，5 秒）

**來源**：`story1.md` line 375。

```
subject_definitions:
<Subject 1> is the street outside the Congress from <Picture 1>:
a gathered crowd at night, people comparing phones with the glowing screens, a steady quiet resolve.

summary:
Reference-based closing narration beat.
No lip movement on screen.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No character speaks on screen. Narration is an inner monologue voice-over only.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Slow push-in across the crowd of lit faces.

[Shot 1]

00:00-00:05

Action:
The narration lands over a slow push across the crowd as they check their own numbers against the real ledger,
each small screen a vote.

Narration (inner monologue):
<d>
[中文]
當人民學會查帳，政客的標籤就再也貼不上去。
</d>

overall_soundscape:
Narration in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no code-switching.
The street murmur fading under the voice, phone chimes, night wind.

non_diegetic_music:
A low warm string line, settling into resolution.
```

**參數**：`ref_image_0=output/ch6_street_ref/zimage_*.png, duration=5, seed=310000, out=ch6_f33_video`

---

## 六、旁白 seed 鎖定與腔調錨點（F0–F33 全部以此為準）

- 旁白 `seed=310000`（F9、F33），與全書旁白共用。
- 每支對白/旁白的 `overall_soundscape` 已寫台灣腔錨點句，並一律帶 `no English / no code-switching`
  （QA Q1/Q5）；`speaker_constraints` 已排除英語混雜。
- `<d>` 內無 `「」『』`《》引號、無冒號、無刪節號、無驚嘆號、無阿拉伯數字
  （75%→百分之七十五、三點零、四十億），每句獨立換行（QA Q2/Q3/Q4）。
- 外語借詞「Beta」已移除（改「測試版」）；原文誤用「妳」已規範為「你」。
- 借詞（國防預算、民調機構、程式設計師、逆向工程、統計誤差等均屬中文慣用）不換；
  `Action` 不複述台詞全文（QA Q3）。

---

## 七、字幕資料表（區塊順序、起始秒、逐字字幕）

> 時間為規劃秒（合併後以實際總長 scale 換算）。旁白（F9、F33）字幕包 `<i>…</i>`。

| # | 區塊 | 類型 | 秒 | 起始秒 | 字幕（逐字） |
|---|------|------|----|--------|--------------|
| 1 | F3 | 對白 | 16 | 15s | 林委員，數據是有層次的。你在草案中要求完全透明，這在科學上是極其幼稚的行為。很多原始數據在未經加工前，只會引發無意義的噪音。 |
| 2 | F4 | 對白 | 8 | 31s | 政府的職責，是將噪音過濾成可理解的訊號。 |
| 3 | F5 | 對白 | 10 | 39s | 過濾？博士，您指的過濾，是將去年國防預算中消失的四十億歐若拉幣，定義為統計誤差嗎？ |
| 4 | F7 | 對白 | 9 | 53s | 那是國安機密下的資源動員。如果我們公布每一分錢的流向，敵對國索利亞會立刻掌握我們的防禦缺口。 |
| 5 | F8 | 對白 | 6 | 62s | 林，你是在用科學透明來武裝國家的敵人。 |
| 6 | F9 | 旁白 | 7 | 68s | `<i>`這又是那套熟悉的國安邏輯。只要掛上這層殼，數據就成了不可觸碰的神諭。`</i>` |
| 7 | F10 | 對白 | 10 | 75s | 好，我們不談國防。那我們談談民生信心指數。政府宣稱上個月國民對物價的滿意度高達百分之七十五。 |
| 8 | F11 | 對白 | 9 | 85s | 但我調閱了你們委託的民調機構，聯邦大數據研究所的原始訪問紀錄。 |
| 9 | F13 | 對白 | 11 | 99s | 我發現了一個有趣的過濾條件，篩選掉所有在過去三個月內曾搜尋過失業、補助或貸款關鍵字的用戶。 |
| 10 | F14 | 對白 | 10 | 110s | 也就是說，你們只詢問那些生活無憂的人是否滿意物價，然後告訴全國人民，大家都很滿意。 |
| 11 | F15 | 對白 | 4 | 120s | 這不是過濾噪音，這是製造幻覺。 |
| 12 | F17 | 對白 | 4 | 129s | 那是為了確保樣本的穩定性。 |
| 13 | F18 | 對白 | 5 | 133s | 那是為了確保結論符合總統的期望。 |
| 14 | F19 | 對白 | 9 | 138s | 當政府控制了定義事實的公式，民主就不再是人民的選擇，而是權力的計算結果。 |
| 15 | F22 | 對白 | 13 | 156s | 博士，您不用聽他解釋了。就在三分鐘前，我的助理蘇菲雖然丟了筆電，但她已經將數據對等協議的測試版發布到了公眾網路。 |
| 16 | F23 | 對白 | 12 | 169s | 現在，聯邦境內有超過十萬名程式設計師，正利用你們政府公開過的歷年預算書進行逆向工程。 |
| 17 | F26 | 對白 | 13 | 192s | 這就是我說的數據叛亂。當你們拒絕提供真相，人民會自己去挖掘。而這種挖掘出來的真相，往往會比你們誠實公開的還要殘酷百倍。 |
| 18 | F28 | 對白 | 4 | 210s | 這會引發暴動的。 |
| 19 | F29 | 對白 | 6 | 214s | 會引發暴動的不是數據，而是被欺騙後的憤怒。 |
| 20 | F30 | 對白 | 10 | 220s | 博士，您的公式算錯了。在民主三點零的時代，真相不是維護穩定的代價，真相就是穩定本身。 |
| 21 | F33 | 旁白 | 5 | 244s | `<i>`當人民學會查帳，政客的標籤就再也貼不上去。`</i>` |

---

## 八、產出前自檢（F0–F33）

- [ ] 對白/旁白逐字對照 `story1.md` 第六章（lines 322–376），僅移除標點符號引號，無省略、無自創。
- [ ] `<d>` 內被唸文字皆中文，無 `%`／阿拉伯數字／`「」『』《》`／冒號／刪節號／驚嘆號；每句獨立換行（QA Q2/Q3/Q4）。
- [ ] 對白區塊指名 `Only <Subject N> speaks`、排除旁白；旁白區塊（F9、F33）畫面角色不開口。
- [ ] `speaker_constraints` 皆排除 English / code-switching；外語借詞已中文化（Beta→測試版）（QA Q1/Q5）；`Action` 未複述台詞全文（QA Q3）。
- [ ] 每支對白/旁白 `overall_soundscape` 帶台灣腔錨點句（含 `no English`）；seed 已對照黑名單，旁白用 310000。
- [ ] 合併後以實際總長 scale 換算 SRT；旁白字幕包 `<i>...</i>`。