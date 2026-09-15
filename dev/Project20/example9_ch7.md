# Ch7 區塊獨立提示詞 — G0–G29（實作範例 9：第七章「司法深淵」）

> 本文件承接 `novel_to_video_guide_v2.md` 與 `example8_ch6.md`（Ch6），
> 完整產出**第七章「司法深淵」**的區塊分割、參考圖分配與全部 30 支 r2v 六欄位提示詞，
> 並套用 `video_prompt_guide.md` QA Q1–Q7（外語混雜、特殊符號、長句插話、跳針重讀、句間填補、口型對嘴）。
>
> **章節功能**：數據火種點燃後，行政機關在灰色石棺般的「憲法仲裁院」發動程序謀殺——塔蘭大法官質問林墨
> 「新型態政變」，林墨以十年判決趨勢圖（百分之九十二傾向政府）與「數據＝國民財產」的會計師比喻反擊，
> 親政府法官拍桌斥責，仲裁院外群眾高舉手機倒數監督；蘇菲帶來法案被凍結的消息，林墨點破
> 「只追求程序合法的建築成了廢墟」，最終收到匿名座標訊息，指向索利亞末任大法官的遺物。情緒走向：
> 石棺壓迫 → 硬辯論 → 監督奇景 → 凍結懸念 → 深淵開門。
> 登場角色：林墨（沿用 Ref-M）、首席大法官塔蘭（**新肖像**）、親政府大法官（**新肖像**）、蘇菲（沿用 Ref-Sophie）、大法官群像（無對白）。
> ⚠ **QA 應用**：對白一律移除 `「」『』`《》引號、冒號、刪節號、驚嘆號；阿拉伯數字改中文數字
> （92%→百分之九十二、3.0→三點零）；借詞（逆向工程、演算法化、大數據等中文慣用）保持原文並避免切點落在借詞前；
> 對白句間以語法銜接為本（Q6）；說話鏡頭一律帶正向嘴部 cue（`mouth articulates clearly with each syllable`，Q7）；
> 每句獨立換行；錨點句一律含 `no English`；旁白 G20 用 seed 310000。

---

## 一、參考圖管理表（Step 1：一次性建置）

> 沿用既有：`Ref-M`（林墨）、`Ref-Sophie`（蘇菲）、`Ref-SCR`（聽證室統計螢幕，改作仲裁院大螢幕）、`Ref-STR`（國會外夜晚街頭人群）。Ch7 新增 **3 張 Z-Image**：塔蘭肖像、仲裁大廳法官席、親政府大法官肖像。

| 編號 | 檔名（實際既有） | 內容 | 尺寸 | 用於區塊 |
|------|------|------|------|---------|
| Ref-M | `output/ch1_beat13_ref_char/zimage_00008_.png`（**共用**，同 Ch1–Ch6） | 林墨肖像：瘦削中年、灰絲黑髮、淺鬍茬、深炭灰西裝、皺白襯衫無領帶 | 832×1248 (2:3) | 林墨諸鏡 |
| Ref-Sophie | `output/ch3_sophie_ref/zimage_00021_.png`（**共用**，同 Ch3–Ch6） | 蘇菲肖像：年輕東亞女性、中長黑髮、淺藍襯衫＋深色背心外搭、實驗室助理 | 832×1248 | G22–G26 |
| Ref-JUDGE | `output/ch7_judge_ref/zimage_00058_.png`（**新增**） | 首席大法官塔蘭肖像：七十多歲鷹眼老者、短白髮、窄框眼鏡、黑法袍白領、端坐法官席 | 832×1248 | G1、G3–G4、G6、G15–G16、G18、G21 |
| Ref-COURT | `output/ch7_court_ref/zimage_00059_.png`（**新增**） | 憲法仲裁院大廳：灰色石棺感、高拱頂、長排法官席五位黑袍大法官、石柱、冷藍灰 | 832×1248 | G0–G7、G9、G11–G15、G17–G18、G20–G22、G25–G26 |
| Ref-CL | `output/ch7_govjudge_ref/zimage_00060_.png`（**新增**） | 親政府大法官肖像：六十歲圓臉紅赤、黑框眼鏡、怒氣拍桌、黑法袍 | 832×1248 | G13 |
| Ref-SCR | `output/ch6_screen_ref/zimage_00056_.png`（**重用**） | 大螢幕統計圖：統計曲線、程式碼、紅白數據圖表、深藍底 | 832×1248 | G8–G10 |
| Ref-STR | `output/ch6_street_ref/zimage_00057_.png`（**重用**） | 夜晚街頭：高大的公共電子螢幕、聚集高舉手機的群眾、霓虹與靜電光、警方警戒線 | 832×1248 | G19、G26–G27 |

> **建置狀態**：Ch7 需新建 3 張（Step 1 一次完成），其餘沿用。

---

## 二、總表：區塊分割與計秒

> 對白 4 字/秒、旁白 5 字/秒（台灣腔普通話），留緩神餘裕進位；場景按動作粗估、寧短勿長。
> 原文範圍：`story1.md` 第七章（lines 379–425）。全部合併規劃約 **209 秒**。

| # | 類型 | 內容 | 秒 |
|---|------|------|----|
| G0 | 場景 | 仲裁大廳定場：灰色石棺感、長排法官席（line 383） | 5 |
| G1 | 場景 | 五位大法官就座、其中三位為總統新提名（line 391） | 6 |
| G2 | 場景 | 林墨步入大廳、仰視法官席、石棺壓迫（line 389） | 5 |
| G3 | 對白 | 塔蘭：「林委員，本庭收到的聲請書指出…裁量空間。」（line 393 前段） | 14 |
| G4 | 對白 | 塔蘭：「更嚴重的是…新型態的政變？」（line 393 後段） | 15 |
| G5 | 對白 | 林墨：「法官閣下，如果揭露事實就能癱瘓政府…事實本身。」（line 395） | 9 |
| G6 | 對白 | 塔蘭：「法律不討論詩意…國家將無法治理。」（line 397） | 12 |
| G7 | 對白 | 林墨：「那如果這個內部空間被用來製造假象呢？」（line 399 前段） | 5 |
| G8 | 場景 | 大螢幕點開：十年判決趨勢圖、九十二（line 399） | 5 |
| G9 | 對白 | 林墨：「根據大數據分析…傾向政府。」（line 401 前段） | 12 |
| G10 | 對白 | 林墨：「而在這百分之九十二的案例中…公帑貪腐有關。」（line 401 中段） | 8 |
| G11 | 對白 | 林墨：「司法權本應是民主的最後一道防線…遮羞布。」（line 401 後段） | 9 |
| G12 | 場景 | 大廳倒吸冷氣、法官面面相覷（line 403） | 5 |
| G13 | 對白 | 親政府大法官拍桌：「林墨，注意你的言詞…蔑視法庭。」（line 405） | 4 |
| G14 | 對白 | 林墨：「我蔑視的不是法庭，而是被標籤化後的法律。」（line 407 前段） | 5 |
| G15 | 對白 | 林墨：「政府提告我非法披露…國民的財產。」（line 407 中段） | 9 |
| G16 | 對白 | 林墨：「這就像是委託人查閱會計帳本…竊取機密。」（line 407 中後段） | 8 |
| G17 | 對白 | 林墨：「法官閣下，你們現在要判決的…出錢的國民？」（line 407 後段） | 9 |
| G18 | 場景 | 塔蘭沉默、望向窗外（line 409） | 4 |
| G19 | 場景 | 窗外：仲裁院外群眾舉平板／手機倒數計時（line 411） | 6 |
| G20 | 旁白 | 「這就是民主三點零的力量。全時監督。」（line 413） | 4 |
| G21 | 對白 | 塔蘭低頭：「我們需要評議。」（line 415） | 3 |
| G22 | 場景 | 林墨走出大廳、蘇菲在門口神色焦慮（line 417 前段） | 5 |
| G23 | 對白 | 蘇菲：「老師，最新消息…凍結了國會明天的表決程序。」（line 417 前中段） | 11 |
| G24 | 對白 | 蘇菲：「他們在用法律拖時間。」（line 417 後段） | 3 |
| G25 | 對白 | 林墨：「他們不是在拖時間，他們是在試探人民的底線。」（line 419 前段） | 5 |
| G26 | 對白 | 林墨：「當法律不再追求真相，而只追求程序的合法性時，這座建築就成了廢墟。」（line 419 後段） | 8 |
| G27 | 場景 | 林墨望向灰色建築、表情堅毅（line 419 後半） | 4 |
| G28 | 場景 | 手機震動、匿名座標訊息浮現（line 421） | 5 |
| G29 | 場景 | 手機螢幕特寫：匿名訊息全文（line 423） | 6 |

> 全表 **30 個區塊**（G0–G29），對白 18、旁白 1、場景 11。旁白 `seed=310000`（見第 6 節）。
> G29 的訊息文字為畫面可見文字（`visible on-screen text`），不進 `<d>`、不被唸出。

---

## 三、區塊 × 參考圖對照

| 區塊 | 類型 | ref_image_0 | ref_image_1 | ref_image_2 | duration |
|------|------|-------------|-------------|-------------|----------|
| G0 | 場景 | Ref-COURT 大廳 | — | — | 5 |
| G1 | 場景 | Ref-JUDGE 塔蘭(首席) | Ref-COURT 法官席 | — | 6 |
| G2 | 場景 | Ref-M 林墨(步入) | Ref-COURT 大廳 | — | 5 |
| G3 | 對白 | Ref-JUDGE 塔蘭 | Ref-COURT 大廳 | — | 14 |
| G4 | 對白 | Ref-JUDGE 塔蘭 | Ref-COURT 大廳 | — | 15 |
| G5 | 對白 | Ref-M 林墨(立於桌前) | Ref-COURT 大廳 | — | 9 |
| G6 | 對白 | Ref-JUDGE 塔蘭 | Ref-M 林墨(聆聽) | — | 12 |
| G7 | 對白 | Ref-M 林墨 | Ref-JUDGE 塔蘭 | — | 5 |
| G8 | 場景 | Ref-SCR 趨勢圖螢幕 | Ref-COURT 大廳 | — | 5 |
| G9 | 對白 | Ref-M 林墨(指趨勢圖) | Ref-SCR 螢幕 | — | 12 |
| G10 | 對白 | Ref-M 林墨(續) | Ref-SCR 螢幕 | — | 8 |
| G11 | 對白 | Ref-M 林墨(直視法官) | Ref-COURT 大廳 | — | 9 |
| G12 | 場景 | Ref-COURT 法官席(面面相覷) | — | — | 5 |
| G13 | 對白 | Ref-CL 親政府大法官(拍桌) | Ref-COURT 大廳 | — | 4 |
| G14 | 對白 | Ref-M 林墨 | Ref-COURT 大廳 | — | 5 |
| G15 | 對白 | Ref-M 林墨 | Ref-JUDGE 塔蘭(凝重) | — | 9 |
| G16 | 對白 | Ref-M 林墨 | Ref-JUDGE 塔蘭 | — | 8 |
| G17 | 對白 | Ref-M 林墨(直視法官席) | Ref-COURT 大廳 | — | 9 |
| G18 | 場景 | Ref-JUDGE 塔蘭(沉默望窗) | Ref-COURT 大廳 | — | 4 |
| G19 | 場景 | Ref-STR 街頭(群眾舉手機) | — | — | 6 |
| G20 | 旁白 | Ref-COURT 大廳(空鏡) | — | — | 4 |
| G21 | 對白 | Ref-JUDGE 塔蘭(低頭) | Ref-COURT 大廳 | — | 3 |
| G22 | 場景 | Ref-M 林墨(走出大廳) | Ref-COURT 大廳 | — | 5 |
| G23 | 對白 | Ref-Sophie 蘇菲(門口焦慮) | Ref-M 林墨 | — | 11 |
| G24 | 對白 | Ref-Sophie 蘇菲(續) | Ref-M 林墨 | — | 3 |
| G25 | 對白 | Ref-M 林墨(望向建築) | Ref-Sophie 蘇菲 | — | 5 |
| G26 | 對白 | Ref-M 林墨(望向遠方) | Ref-STR 街頭 | — | 8 |
| G27 | 場景 | Ref-M 林墨(凝望灰建築) | Ref-STR 街頭(遠景) | — | 4 |
| G28 | 場景 | Ref-M 林墨(掌中手機) | — | — | 5 |
| G29 | 場景 | Ref-M 林墨(手機螢幕舉向鏡頭) | — | — | 6 |

> 未餵 `ref_image_N` 一律省略（勿留空檔名殘餘污染，見 v2 §3）。

---

## G0 — 仲裁大廳定場（場景，5 秒）

**來源**：`story1.md` line 383。

```
subject_definitions:
<Subject 1> is the constitutional arbitration court hall from <Picture 1>:
a vast grey stone chamber like a tomb, high coffered ceiling, a long raised bench of five justices, tall stone
columns, cold blue-grey light.

summary:
Reference-based establishing shot.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

detailed_description:

Visual style:
Low-angle establishing wide shot, oppressive funeral atmosphere.

[Shot 1]

00:00-00:05

Action:
Slow tracking push through the empty marble hall toward the raised bench of five robed justices in shadow. The
cold light hangs still, dust drifting in the beam. Camera moves slowly, no one moves.

overall_soundscape:
Distant echoing silence, the soft rustle of robes, a faint low ventilation hum.
No speech.

non_diegetic_music:
A low, slow cello and pipe organ drone, rising solemn pressure.
```

**參數**：`ref_image_0=output/ch7_court_ref/zimage_00059_.png, duration=5, seed=470000, out=ch7_g0_video`

---

## G1 — 五位大法官就座（場景，6 秒）

**來源**：`story1.md` line 391。

```
subject_definitions:
<Subject 1> is the Chief Justice Taran from <Picture 1>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, short white hair, narrow rimless
glasses, black judicial robe with white collar, seated at the center of the bench.

<Subject 2> is the court bench from <Picture 2>:
five robed justices in a row on the raised bench, grey stone hall behind.

summary:
Reference-based bench tableau.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

detailed_description:

Visual style:
Symmetric wide shot of the full bench, oppressive hierarchy.

[Shot 1]

00:00-00:06

Action:
Slow push toward the five robed justices seated in a row under a cold beam of light. The chief justice sits rigid
at the center, hawk-like stare forward; the two justices on the far ends settle into their chairs. Camera holds
the full row, no one speaks.

overall_soundscape:
The rustle of robes settling, a cough swallowed, deep silence of the hall.
No speech.

non_diegetic_music:
A low cello line, heavy and still.
```

**參數**：`ref_image_0=output/ch7_judge_ref/zimage_00058_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=6, seed=470001, out=ch7_g1_video`

---

## G2 — 林墨步入石棺（場景，5 秒）

**來源**：`story1.md` line 389。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, walking into a
huge courtroom.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
a vast grey stone chamber like a tomb, high coffered ceiling, a long raised bench of five justices in shadow.

summary:
Reference-based lonely entrance.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

detailed_description:

Visual style:
High-angle wide shot, small man under towering stone.

[Shot 1]

00:00-00:05

Action:
Lin Mo walks slowly down the long marble aisle toward the raised bench of five silent robed justices, his
footsteps echoing alone in the vast hall. The camera stays high and steady, dwarfing him. He stops at the witness
table and looks up.

overall_soundscape:
Solemn footsteps echoing on marble, distant silence, faint rustle above.
No speech.

non_diegetic_music:
A low tolling organ note under the footsteps, funeral dirge feel.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=5, seed=470002, out=ch7_g2_video`

---

## G3 — 塔蘭開場第一擊（對白，14 秒）

**來源**：`story1.md` line 393 前段。

```
subject_definitions:
<Subject 1> is the Chief Justice Taran from <Picture 1>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, short white hair, narrow rimless
glasses, black judicial robe with white collar, seated rigidly at the center of the bench.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
a vast grey stone chamber, a long raised bench of five robed justices, cold blue-grey light.

summary:
Reference-based accusation speech.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Taran's face over the bench, cold flat authority.

[Shot 1]

00:00-00:14

Action:
Taran reads the petition without emotion, his hawk eyes fixed on Lin across the hall. He speaks in one
continuous statement; camera holds his face, no body movement away. His mouth articulates clearly with each
syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林委員，本庭收到的聲請書指出，你的共識協議試圖將政府的決策邏輯完全演算法化。
這是在侵蝕憲法賦予行政權的裁量空間。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Silent hall, faint rustle of papers.
No other speech.

non_diegetic_music:
A low cello line, weight behind the accusation.
```

**參數**：`ref_image_0=output/ch7_judge_ref/zimage_00058_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=14, seed=470003, out=ch7_g3_video`

---

## G4 — 塔蘭：新型態的政變（對白，15 秒）

**來源**：`story1.md` line 393 後段。

```
subject_definitions:
<Subject 1> is the Chief Justice Taran from <Picture 1>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, short white hair, narrow rimless
glasses, black judicial robe with white collar, seated rigidly, voice turning harder.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
a vast grey stone chamber, long raised bench of robed justices, cold blue-grey light.

summary:
Reference-based escalating accusation.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up on Taran's face, cold fury beneath the calm.

[Shot 1]

00:00-00:15

Action:
Taran leans forward a fraction, his gaze hard, naming the charge. Camera holds his face steady; his mouth
articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
更嚴重的是，你誘導民眾進行所謂的逆向工程，已經實質癱瘓了多個部會的正常運作。
你如何證明這不是新型態的政變。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Dead silence in the hall.
No other speech.

non_diegetic_music:
A low cello line building, oppressing.
```

**參數**：`ref_image_0=output/ch7_judge_ref/zimage_00058_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=15, seed=470004, out=ch7_g4_video`

---

## G5 — 林墨：事實本身（對白，9 秒）

**來源**：`story1.md` line 395。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, standing alone
at the witness table.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
a vast grey stone chamber, long raised bench of robed justices, cold blue-grey light.

summary:
Reference-based calm rebuttal.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot, Lin standing alone facing the bench, stillness.

[Shot 1]

00:00-00:09

Action:
Lin stands at the witness table without a lawyer, a single yellowed sheet on the desk, and answers calmly. Camera
holds a medium framing; his mouth articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
法官閣下，如果揭露事實就能癱瘓政府，那麼癱瘓政府的不是揭露者。
而是事實本身。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Faint echo of the lone voice in the stone hall.
No other speech.

non_diegetic_music:
A single low cello note, calm and clear.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=9, seed=470005, out=ch7_g5_video`

---

## G6 — 塔蘭：權力分立（對白，12 秒）

**來源**：`story1.md` line 397。

```
subject_definitions:
<Subject 1> is the Chief Justice Taran from <Picture 1>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, short white hair, narrow rimless
glasses, black judicial robe with white collar, cold as he rebukes.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, listening
quietly at the witness table.

summary:
Reference-based rebuke.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Reverse on Taran's face mid-bench, Lin in soft foreground, sharp dialogue rhythm.

[Shot 1]

00:00-00:12

Action:
Taran cuts Lin off with hard precision, eyes narrowing. Camera stays on him; his mouth articulates clearly with
each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
法律不討論詩意，林委員。
我們討論的是權力分立。
行政權有權保留其資訊處理的內部空間，否則國家將無法治理。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Silent stone hall, the rustle of Lin's sleeve.
No other speech.

non_diegetic_music:
A low cello line, formal and cold.
```

**參數**：`ref_image_0=output/ch7_judge_ref/zimage_00058_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=12, seed=470006, out=ch7_g6_video`

---

## G7 — 林墨：如果是假象呢（對白，5 秒）

**來源**：`story1.md` line 399 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, sharp eyes
fixed on the bench.

<Subject 2> is the Chief Justice Taran from <Picture 2>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, black judicial robe, cold stare.

summary:
Reference-based pointed question.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up of Lin's face, challenge rising.

[Shot 1]

00:00-00:05

Action:
Lin asks the question in a single measured sentence, watching the bench. Camera holds his face; his mouth
articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
那如果這個內部空間被用來製造假象呢。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Hollow silence in the hall.
No other speech.

non_diegetic_music:
A held low cello note, waiting.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_judge_ref/zimage_00058_.png, duration=5, seed=470007, out=ch7_g7_video`

---

## G8 — 十年判決趨勢圖（場景，5 秒）

**來源**：`story1.md` line 399。

```
subject_definitions:
<Subject 1> is a large courtroom screen from <Picture 1>:
a glowing statistical chart of a ten-year verdict trend on a dark blue background, red rising curve, white ticks.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
vast grey stone chamber, long raised bench of robed justices, the screen lighting the hall.

summary:
Reference-based screen reveal.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

detailed_description:

Visual style:
Wide shot, the big screen flaring into the dark stone hall.

[Shot 1]

00:00-00:05

Action:
Lin activates the large screen, and a decade-long verdict trend chart flares across the wall. The red line climbs,
the hall darkens around it. The justices turn their heads to the huge glowing chart.

overall_soundscape:
The soft electric hum of the screen waking up, faint murmurs of robes turning.
No speech.

non_diegetic_music:
A rising low string swell under the reveal.
```

**參數**：`ref_image_0=output/ch6_screen_ref/zimage_00056_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=5, seed=470008, out=ch7_g8_video`

---

## G9 — 林墨：九十二（對白，12 秒）

**來源**：`story1.md` line 401 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, pointing at a
glowing chart.

<Subject 2> is a large courtroom screen from <Picture 2>:
a statistical chart on a dark blue background, red rising curve, white data rows.

summary:
Reference-based evidence speech.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot, Lin half-lit by the red chart light.

[Shot 1]

00:00-00:12

Action:
Lin points at the rising red line as he reads the verdict rate. Camera holds a medium framing on him; his mouth
articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
根據大數據分析，這十年間，凡涉及行政機關資訊遮蔽的訴訟。
本庭的判決有百分之九十二傾向政府。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Screen hum under the voice.
No other speech.

non_diegetic_music:
A low tension cello line, pressing.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_00056_.png, duration=12, seed=470009, out=ch7_g9_video`

---

## G10 — 林墨：貪腐關聯（對白，8 秒）

**來源**：`story1.md` line 401 中段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, arm falling as
he presses the point.

<Subject 2> is a large courtroom screen from <Picture 2>:
a statistical chart on a dark blue background, red data rows.

summary:
Reference-based continuation speech.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, decisive and quiet.

[Shot 1]

00:00-00:08

Action:
Lin presses on without pause, voice even. Camera holds his face; his mouth articulates clearly with each
syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
而在這百分之九十二的案例中，後來有超過一半被證明與公帑貪腐有關。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Low screen hum, breaths in the gallery.
No other speech.

non_diegetic_music:
A low cello line, darkening.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_screen_ref/zimage_00056_.png, duration=8, seed=470010, out=ch7_g10_video`

---

## G11 — 林墨：最後一道防線（對白，9 秒）

**來源**：`story1.md` line 401 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, facing the
justices directly.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
vast grey stone chamber, long raised bench of robed justices, screen glow behind.

summary:
Reference-based verdict on the court.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, eyes on the bench, weight on every word.

[Shot 1]

00:00-00:09

Action:
Lin looks straight at the five justices and delivers the line flat and sharp. Camera holds his face; his mouth
articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
司法權本應是民主的最後一道防線。
但現在，這道防線似乎成了行政權的遮羞布。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Hollow silence after the line.
No other speech.

non_diegetic_music:
A low cello hit, the accusation landing.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=9, seed=470011, out=ch7_g11_video`

---

## G12 — 倒吸冷氣（場景，5 秒）

**來源**：`story1.md` line 403。

```
subject_definitions:
<Subject 1> is the court bench from <Picture 1>:
five robed justices seated on a long raised bench, grey stone hall behind.

summary:
Reference-based startled reaction.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

detailed_description:

Visual style:
Wide shot of the bench, ripple of unease.

[Shot 1]

00:00-00:05

Action:
A ripple moves across the bench as the justices exchange sharp muted glances and inhale audibly. The chief
justice alone holds still. Camera pans slowly across the five faces.

overall_soundscape:
A collective sharp intake of breath, robes shifting, uneasy murmur cut off.
No speech.

non_diegetic_music:
A dark sustained chord, tension bristling.
```

**參數**：`ref_image_0=output/ch7_court_ref/zimage_00059_.png, duration=5, seed=470012, out=ch7_g12_video`

---

## G13 — 親政府大法官拍桌（對白，4 秒）

**來源**：`story1.md` line 405。

```
subject_definitions:
<Subject 1> is the pro-government justice from <Picture 1>:
middle-aged East Asian man in his early 60s, round flushed face, short salt-and-pepper hair, thin black rim
glasses, black judicial robe, leaning forward in outrage.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
vast grey stone chamber, raised bench row.

summary:
Reference-based angry outburst.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Tight medium shot of the furious justice rising in his seat.

[Shot 1]

00:00-00:04

Action:
The pro-government justice slams his palm on the desk and shouts the two charges. Camera holds him tight; his
mouth articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
林墨，注意你的言詞。
你這是在蔑視法庭。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
A hard slap of palm on wood, the hall recoils.
No other speech.

non_diegetic_music:
A single hard percussion hit, then silence.
```

**參數**：`ref_image_0=output/ch7_govjudge_ref/zimage_00060_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=4, seed=470013, out=ch7_g13_video`

---

## G14 — 林墨：被標籤化的法律（對白，5 秒）

**來源**：`story1.md` line 407 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, unflinching.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
vast grey stone chamber, long raised bench of robed justices.

summary:
Reference-based calm sharp reply.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, quiet steel in his voice.

[Shot 1]

00:00-00:05

Action:
Lin answers without flinching, eyes level with the bench. Camera holds his face; his mouth articulates clearly
with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
我蔑視的不是法庭，而是被標籤化後的法律。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Silence holding.
No other speech.

non_diegetic_music:
A low sustained string note.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=5, seed=470014, out=ch7_g14_video`

---

## G15 — 林墨：數據是國民財產（對白，9 秒）

**來源**：`story1.md` line 407 中段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, pressing the
principle.

<Subject 2> is the Chief Justice Taran from <Picture 2>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, black judicial robe, grave.

summary:
Reference-based principle speech.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot, Lin stating the principle like a theorem.

[Shot 1]

00:00-00:09

Action:
Lin states the charge and the principle without rising anger. Camera holds a medium framing; his mouth
articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
政府提告我非法披露。
但在民主三點零的邏輯下，政府的數據本質上是國民的財產。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Faint echo in the stone hall.
No other speech.

non_diegetic_music:
A low cello line, steady as a ruling.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_judge_ref/zimage_00058_.png, duration=9, seed=470015, out=ch7_g15_video`

---

## G16 — 林墨：會計師報警（對白，8 秒）

**來源**：`story1.md` line 407 中後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, dry irony.

<Subject 2> is the Chief Justice Taran from <Picture 2>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, black judicial robe, listening hard.

summary:
Reference-based analogy speech.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, the analogy landing with cool precision.

[Shot 1]

00:00-00:08

Action:
Lin lays out the accountant analogy flat and dry. Camera holds his face; his mouth articulates clearly with each
syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
這就像是委託人查閱會計帳本。
會計師卻報警說委託人竊取機密。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Silent attention of the bench.
No other speech.

non_diegetic_music:
A low pulse under the words, restrained.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_judge_ref/zimage_00058_.png, duration=8, seed=470016, out=ch7_g16_video`

---

## G17 — 林墨：帳本屬於誰（對白，9 秒）

**來源**：`story1.md` line 407 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, fixed eye on
the bench.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
vast grey stone chamber, long raised bench of robed justices, cold light.

summary:
Reference-based closing question.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, the question hung in the air.

[Shot 1]

00:00-00:09

Action:
Lin holds the bench's gaze and ends with the question, letting the hall go silent. Camera holds his face; his
mouth articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
法官閣下，你們現在要判決的。
是這本帳本到底屬於會計師，還是屬於出錢的國民。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
The hall holding its breath.
No other speech.

non_diegetic_music:
A held low note under the silence.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=9, seed=470017, out=ch7_g17_video`

---

## G18 — 塔蘭沉默望窗（場景，4 秒）

**來源**：`story1.md` line 409。

```
subject_definitions:
<Subject 1> is the Chief Justice Taran from <Picture 1>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, short white hair, narrow rimless
glasses, black judicial robe, silent and grave.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
vast grey stone chamber, cold blue-grey light.

summary:
Reference-based silent pause.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

detailed_description:

Visual style:
Close shot of Taran's face, ancient silence.

[Shot 1]

00:00-00:04

Action:
Taran goes silent, then slowly turns his gaze toward the tall windows of the hall. Camera pushes softly into his
face; he does not speak.

overall_soundscape:
Deep quiet, a faint breath, stone cold air.
No speech.

non_diegetic_music:
A single low cello waver, uncertain.
```

**參數**：`ref_image_0=output/ch7_judge_ref/zimage_00058_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=4, seed=470018, out=ch7_g18_video`

---

## G19 — 窗外倒數監督（場景，6 秒）

**來源**：`story1.md` line 411。

```
subject_definitions:
<Subject 1> is a night street crowd from <Picture 1>:
a dense silent crowd at night holding up phones and tablets, screens glowing in unison, police tape and a tall
public screen behind.

summary:
Reference-based mass vigil.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

detailed_description:

Visual style:
Wide night shot, hundreds of small lit screens like a constellation.

[Shot 1]

00:00-00:06

Action:
Outside the arbitration court at night, a huge silent crowd stands holding tablets and phones, every screen
glowing with the same countdown number ticking down. The police line holds behind them. Camera slowly trucks
through the glowing crowd.

overall_soundscape:
The hush of a hundred devices, muffled night wind, distant street hum.
No speech.

non_diegetic_music:
A low electronic pulse ticking like a timer, ceremonial dread.
```

**參數**：`ref_image_0=output/ch6_street_ref/zimage_00057_.png, duration=6, seed=470019, out=ch7_g19_video`

---

## G20 — 旁白：全時監督（旁白，4 秒）

**來源**：`story1.md` line 413。

```
subject_definitions:
<Subject 1> is the constitutional arbitration court hall from <Picture 1>:
vast grey stone chamber, the bench shadowed, cold blue-grey light.

summary:
Reference-based atmospheric narration.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

speaker_constraints:
No on-screen speech. Narration only.

detailed_description:

Visual style:
Slow tilt from the shadowed bench to the dark ceiling, alone and immense.

[Shot 1]

00:00-00:04

Action:
The camera slowly tilts up from the empty bench to the dark vaulted ceiling. No person speaks on screen.

overall_soundscape:
Narration delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.
Empty hall, soft wind of the vault.

non_diegetic_music:
A low organ chord, ceremonial and vast.
```

**參數**：`ref_image_0=output/ch7_court_ref/zimage_00059_.png, duration=4, seed=310000（旁白專用）, out=ch7_g20_video`

---

## G21 — 塔蘭：我們需要評議（對白，3 秒）

**來源**：`story1.md` line 415。

```
subject_definitions:
<Subject 1> is the Chief Justice Taran from <Picture 1>:
elderly East Asian man in his late 70s, gaunt stern face, hawk-like nose, short white hair, narrow rimless
glasses, black judicial robe, lowering his head.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
vast grey stone chamber, cold blue-grey light.

summary:
Reference-based short verdict.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Close shot of Taran, head lowering, broken authority.

[Shot 1]

00:00-00:03

Action:
Taran finally lowers his head and speaks the short line, avoiding Lin's gaze. Camera holds his face; his mouth
articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
我們需要評議。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Deep quiet after the words.
No other speech.

non_diegetic_music:
A low string fade, resignation.
```

**參數**：`ref_image_0=output/ch7_judge_ref/zimage_00058_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=3, seed=470021, out=ch7_g21_video`

---

## G22 — 走出大廳、蘇菲等待（場景，5 秒）

**來源**：`story1.md` line 417 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, walking out of
a vast hall.

<Subject 2> is the constitutional arbitration court hall from <Picture 2>:
grey stone chamber doorway, cold light spilling into a corridor.

summary:
Reference-based exit.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

detailed_description:

Visual style:
Tracking shot following Lin out of the hall.

[Shot 1]

00:00-00:05

Action:
Lin walks out of the arbitration hall through the tall doors, his steps echoing. Beyond the threshold a young
woman waits in the corridor, anxious. Camera trucks beside him as the heavy door closes.

overall_soundscape:
Footsteps on stone, the heavy doors closing, a corridor's faint hum.
No speech.

non_diegetic_music:
A low neutral drone, aftermath.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch7_court_ref/zimage_00059_.png, duration=5, seed=470022, out=ch7_g22_video`

---

## G23 — 蘇菲：法案被凍結（對白，11 秒）

**來源**：`story1.md` line 417 前中段。

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
young East Asian woman, long dark hair, light blue shirt under a dark gilet, anxious expression, reporting news
in a corridor.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, listening.

summary:
Reference-based urgent report.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Two-shot in the corridor, Sophie urgent, Lin still.

[Shot 1]

00:00-00:11

Action:
Sophie hurries up to Lin and delivers the news in a low urgent voice. Camera stays on her; her mouth articulates
clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
老師，最新消息。
憲法法庭雖然還沒裁決，但行政院已經以司法調查中為由，凍結了國會明天的表決程序。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Corridor hum, her quick breath.
No other speech.

non_diegetic_music:
A low pulse, urgency building.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=11, seed=470023, out=ch7_g23_video`

---

## G24 — 蘇菲：用法律拖時間（對白，3 秒）

**來源**：`story1.md` line 417 後段。

```
subject_definitions:
<Subject 1> is Sophie from <Picture 1>:
young East Asian woman, long dark hair, light blue shirt under a dark gilet, grim conclusion.

<Subject 2> is Lin Mo from <Picture 2>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, listening.

summary:
Reference-based grim summary.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Close-up of Sophie's face, low and bitter.

[Shot 1]

00:00-00:03

Action:
Sophie concludes in a flat, bitter tone. Camera holds her face; her mouth articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
他們在用法律拖時間。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Corridor silence.
No other speech.

non_diegetic_music:
A low muted hit under the line.
```

**參數**：`ref_image_0=output/ch3_sophie_ref/zimage_00021_.png, ref_image_1=output/ch1_beat13_ref_char/zimage_00008_.png, duration=3, seed=470024, out=ch7_g24_video`

---

## G25 — 林墨：試探人民的底線（對白，5 秒）

**來源**：`story1.md` line 419 前段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, quiet
resolution.

<Subject 2> is Sophie from <Picture 2>:
young East Asian woman, long dark hair, listening to him.

summary:
Reference-based measured reply.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium close-up, Lin's quiet steel.

[Shot 1]

00:00-00:05

Action:
Lin answers quietly, eyes on the grey building beside them. Camera holds his face; his mouth articulates clearly
with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
他們不是在拖時間，他們是在試探人民的底線。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Night breeze, distant crowd murmur.
No other speech.

non_diegetic_music:
A low cello line, resolved.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch3_sophie_ref/zimage_00021_.png, duration=5, seed=470025, out=ch7_g25_video`

---

## G26 — 林墨：成了廢墟（對白，8 秒）

**來源**：`story1.md` line 419 後段。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, staring at the
grey courthouse.

<Subject 2> is a night street crowd from <Picture 2>:
night crowd with glowing phones, a tall public screen, beyond the courthouse walls.

summary:
Reference-based closing judgment.
One speaker only.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

speaker_constraints:
Only <Subject 1> speaks. No other character speaks. No narration. No voice-over.
never English / no code-switching / no foreign language.

detailed_description:

Visual style:
Medium shot, Lin facing the massive grey building, final words.

[Shot 1]

00:00-00:08

Action:
Lin turns to face the grey fortress of the arbitration court and speaks the final line. Camera holds him from
behind three-quarter; his mouth articulates clearly with each syllable.
Lip sync must follow the line exactly.

Dialogue:
<Subject 1> says:

<d>
[中文]
當法律不再追求真相，而只追求程序的合法性時，這座建築就成了廢墟。
</d>

overall_soundscape:
Dialogue delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English, no
code-switching.
Low night wind over the crowds.
No other speech.

non_diegetic_music:
A low cello and string swell, closing.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_street_ref/zimage_00057_.png, duration=8, seed=470026, out=ch7_g26_video`

---

## G27 — 凝望廢墟（場景，4 秒）

**來源**：`story1.md` line 419 後半。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, gazing up at a
towering grey building.

<Subject 2> is a night street from <Picture 2>:
night street with crowd silhouettes and a tall public screen glowing far away.

summary:
Reference-based silent resolve.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.
<Subject 2>: fully_preserved.

detailed_description:

Visual style:
Extreme widen, tiny Lin before the giant grey mass.

[Shot 1]

00:00-00:04

Action:
Lin stands still and looks up at the vast grey courthouse as the night crowd glows behind him. The camera slowly
pulls back, shrinking him against the stone mass. He does not speak.

overall_soundscape:
Deep night air, faint police radio in the distance, soft crowd shuffling.
No speech.

non_diegetic_music:
A low sustained string drone, resolve.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, ref_image_1=output/ch6_street_ref/zimage_00057_.png, duration=4, seed=470027, out=ch7_g27_video`

---

## G28 — 手機震動（場景，5 秒）

**來源**：`story1.md` line 421。

```
subject_definitions:
<Subject 1> is Lin Mo from <Picture 1>:
thin lean middle-aged East Asian man, grey-flecked black hair, light stubble, dark charcoal suit, phone vibrating
in his palm.

summary:
Reference-based phone alert.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

detailed_description:

Visual style:
Medium close-up on his hand, phone buzzing.

[Shot 1]

00:00-00:05

Action:
Lin's phone vibrates hard in his palm. He flips it over mid-shot; the screen flashes with only a map coordinate
and a single blinking marker. He frowns slightly at the screen.

overall_soundscape:
Hard phone vibration buzz, night wind, a single distant siren.
No speech.

non_diegetic_music:
A low sub throb, a mystery cue.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, duration=5, seed=470028, out=ch7_g28_video`

---

## G29 — 匿名訊息全文（場景，6 秒）

**來源**：`story1.md` line 423。

```
subject_definitions:
<Subject 1> is the phone screen held up from <Picture 1>:
a bright smartphone screen filling the frame, a map coordinate at top and glowing white Chinese text below.

summary:
Reference-based message reveal.
No speaker.

retention_analysis:
<Subject 1>: fully_preserved.

detailed_description:

Visual style:
Extreme close-up of the screen, the text burning the darkness.

[Shot 1]

00:00-00:06

Action:
Extreme close-up of the phone screen held toward the camera. On the screen, visible on-screen text reads, in
Chinese: "如果你想看真正的深淵，來這個地方。那是索利亞崩潰前，最後一任大法官留下的東西。" The coordinate
marker blinks slowly. Everything else falls into darkness.

overall_soundscape:
Soft electronic hum of the screen, night wind, unsettling near-silence.
No speech.

non_diegetic_music:
A deep single bass note plus faint high wind, dread opening.
```

**參數**：`ref_image_0=output/ch1_beat13_ref_char/zimage_00008_.png, duration=6, seed=470029, out=ch7_g29_video`

---

## 六、Seed 策略

| 類型 | seed | 註記 |
|------|------|------|
| 對白 G3–G18、G21、G23–G26 | `470003–470018`、`470021`、`470023–470026` | 每支獨立 |
| 場景 G0–G2、G8、G12、G19、G22、G27–G29 | `470000–470002`、`470008`、`470012`、`470019`、`470022`、`470027–470029` | 每支獨立 |
| 旁白 G20 | `310000` | 共用旁白 seed |

> 歪腔 seed 記入黑名單重整（見 `video_prompt_guide.md` §4.2）。

---

## 七、字幕資料表（區塊順序、起始秒、逐字字幕）

> 時間為規劃秒（合併後以實際總長 scale 換算）。旁白（G20）字幕包 `<i>…</i>`。

| # | 區塊 | 類型 | 秒 | 起始秒 | 字幕（逐字） |
|---|------|------|----|--------|--------------|
| 1 | G3 | 對白 | 14 | 16s | 林委員，本庭收到的聲請書指出，你的共識協議試圖將政府的決策邏輯完全演算法化。這是在侵蝕憲法賦予行政權的裁量空間。 |
| 2 | G4 | 對白 | 15 | 30s | 更嚴重的是，你誘導民眾進行所謂的逆向工程，已經實質癱瘓了多個部會的正常運作。你如何證明這不是新型態的政變。 |
| 3 | G5 | 對白 | 9 | 45s | 法官閣下，如果揭露事實就能癱瘓政府，那麼癱瘓政府的不是揭露者。而是事實本身。 |
| 4 | G6 | 對白 | 12 | 54s | 法律不討論詩意，林委員。我們討論的是權力分立。行政權有權保留其資訊處理的內部空間，否則國家將無法治理。 |
| 5 | G7 | 對白 | 5 | 66s | 那如果這個內部空間被用來製造假象呢。 |
| 6 | G9 | 對白 | 12 | 71s | 根據大數據分析，這十年間，凡涉及行政機關資訊遮蔽的訴訟。本庭的判決有百分之九十二傾向政府。 |
| 7 | G10 | 對白 | 8 | 83s | 而在這百分之九十二的案例中，後來有超過一半被證明與公帑貪腐有關。 |
| 8 | G11 | 對白 | 9 | 91s | 司法權本應是民主的最後一道防線。但現在，這道防線似乎成了行政權的遮羞布。 |
| 9 | G13 | 對白 | 4 | 100s | 林墨，注意你的言詞。你這是在蔑視法庭。 |
| 10 | G14 | 對白 | 5 | 104s | 我蔑視的不是法庭，而是被標籤化後的法律。 |
| 11 | G15 | 對白 | 9 | 109s | 政府提告我非法披露。但在民主三點零的邏輯下，政府的數據本質上是國民的財產。 |
| 12 | G16 | 對白 | 8 | 118s | 這就像是委託人查閱會計帳本。會計師卻報警說委託人竊取機密。 |
| 13 | G17 | 對白 | 9 | 126s | 法官閣下，你們現在要判決的。是這本帳本到底屬於會計師，還是屬於出錢的國民。 |
| 14 | G20 | 旁白 | 4 | 135s | `<i>`這就是民主三點零的力量。全時監督。`</i>` |
| 15 | G21 | 對白 | 3 | 139s | 我們需要評議。 |
| 16 | G23 | 對白 | 11 | 142s | 老師，最新消息。憲法法庭雖然還沒裁決，但行政院已經以司法調查中為由，凍結了國會明天的表決程序。 |
| 17 | G24 | 對白 | 3 | 153s | 他們在用法律拖時間。 |
| 18 | G25 | 對白 | 5 | 156s | 他們不是在拖時間，他們是在試探人民的底線。 |
| 19 | G26 | 對白 | 8 | 161s | 當法律不再追求真相，而只追求程序的合法性時，這座建築就成了廢墟。 |
| 20 | G21b | 對白 | — | — | — |

> 註：字幕序依「起始秒」排序。核對規劃連續弧線：G3 16s→G4 30s→G5 45s→G6 54s→G7 66s→G9 71s→G10 83s→G11 91s→G13 100s→G14 104s→G15 109s→G16 118s→G17 126s→G20 135s→G21 139s→G23 142s→G24 153s→G25 156s→G26 161s。

---

## 八、產出前自檢（G0–G29）

- [ ] 對白/旁白逐字對照 `story1.md` 第七章（lines 379–425），僅移除標點符號引號，無省略、無自創。
- [ ] `<d>` 內被唸文字皆中文，無 `%`／阿拉伯數字／`「」『』《》`／冒號／刪節號／驚嘆號；每句獨立換行（QA Q2/Q3/Q4）。
- [ ] 對白區塊指名 `Only <Subject N> speaks`、排除旁白；旁白區塊（G20）畫面角色不開口。
- [ ] `speaker_constraints` 皆排除 English / code-switching；外語借詞已中文化（92%→百分之九十二、3.0→三點零）（QA Q1/Q5）；`Action` 未複述台詞全文（QA Q3）。
- [ ] 說話鏡頭一律帶正向嘴部 cue（`mouth articulates clearly`）（QA Q7）；對白句間以語法銜接為本（QA Q6）。
- [ ] 每支對白/旁白 `overall_soundscape` 帶台灣腔錨點句（含 `no English`）；seed 已對照黑名單，旁白用 310000。
- [ ] 合併後以實際總長 scale 換算 SRT；旁白字幕包 `<i>...</i>`。