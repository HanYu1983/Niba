# T2V 生成視頻提示詞指導

本文件結合 **玩家自訂創意模板**（人物一致性、拍攝風格、分鏡拆解）與 **MiniMax H3 官方提示詞規範**（[video-prompting-skill](https://github.com/Square-Zero-Labs/video-prompting-skill)），用於生成可直接餵給 ComfyUI MiniMax H3 的影片提示詞。

---

## 一、兩階段工作流

| 階段 | 用途 | 語言 |
|------|------|------|
| **1. 創意規劃** | 用閱讀性模板整理人物、風格、分鏡、台詞、負面要求 | 中文 |
| **2. H3 編譯** | 轉換成 MiniMax H3 官方要求的 3 欄位 schema | 英文 + `<d>` 內保留原文台詞 |

> 玩家只需提供規劃階段的內容；編譯階段由 AI 依照本章後半規範完成。

---

## 二、階段一：創意規劃模板

用途：確認故事、人物、節奏。以下 7 段依序產生：

| 順序 | 段落 | 作用 |
|------|------|------|
| 1 | 標題 | 一句話描述影片內容 |
| 2 | 人物定義 | 鎖定角色的外觀、服裝、稱呼 |
| 3 | 拍攝風格 | 定義質感標籤、環境元素、光線 |
| 4 | 劇情設定 | 概括開始→結束的狀態 |
| 5 | 分鏡時間軸 | 按秒段拆解動作、鏡位、**台詞** |
| 6 | 動作/鏡頭/自然感要求 | 統一的行為約束 |
| 7 | 負面要求 | 明確禁止事項 |

### 2.1 人物定義（一致性優先）

- **固定稱呼**：先定義角色的穩定名稱（例：Yuki / Tony、女主角 / 先生），全片統一。
- **外觀錨點**：髮型、髮色、服裝配色、款式一次寫死，強調「不要換人、不要換臉」。
- **獨特特徵**：特殊標誌（金色長髮、高馬尾、服裝配色）在負面要求中再次禁止被移除。

### 2.2 拍攝風格（質感錨定）

用「設備 / 年代 / 媒介」當質感標籤，再補環境元素與光影：

- 具體設備或年代（例：2006 Sony Ericsson 手機、VHS、膠片、GoPro 胸掛）
- 環境元素（日光燈、玻璃反光、冷藏櫃、貨架）
- 拍攝瑕疵意向（手震、數位噪點、輕微模糊）
- 最後用「不是…」排除錯誤方向

### 2.3 分鏡時間軸（節奏錨定）

- 每段固定格式：**時間範圍 + 人物動作 + 鏡頭描述**。
- 一段建議 2-3 秒；總秒數=畫面總長（30 秒→約 10-12 段）。
- 每段只寫「一個主要動作 + 一個鏡頭特徵」。
- **台詞必須逐字列出**（含省略號），供 H3 編譯階段轉入 `<d>` 標籤。

**範例：**
```
4-6秒：
Yuki 聽到腳步聲抬頭，露出燦爛又帶點害羞的笑容，起身打招呼。
鏡頭推進至 Yuki 臉部近景。
台詞：「好巧！你怎麼會在這裡？」
```

### 2.4 負面要求（最後防線）

| 類別 | 範例詞 |
|------|--------|
| 人物 | 換臉、變髮型、變陌生人、多餘肢體、畸形手指 |
| 質感 | 電影感、廣告感、MV感、棚拍、舞台燈光、慢動作 |
| 構圖 | 性感特寫、局部特寫、模特走秀 |
| 後製 | 字幕、數字編號、浮水印、logo |

---

## 三、階段二：MiniMax H3 最終輸出格式（重要）

H3 對輸出 schema 有**嚴格要求**：必須是以下 3 個欄位、依序排列、欄位名不變。**此為單行還是多行依各欄位內容而定**（`integrated_multimodal_description` 依官方範例為單段文字）。

```text
integrated_multimodal_description: [Shot 1] ...
overall_soundscape: ...
non_diegetic_music: ...
```

### 3.1 硬性規則（不可違反）

- 6 不寫入 prompt：**model 名稱、版本、時長(除鏡頭時間戳外)、解析度、寬高比、API 參數名**。時長只做內部規劃參考與鏡頭時間戳。
- `integrated_multimodal_description` 內：`[Shot 1]` 不用時間戳；後續鏡頭為 `[Shot 2] At 00:03.500, ...`（時間必須嚴格遞增且在時長內）。
- 鏡頭內自然描述鏡頭運動：push/pull、zoom、pan、truck、tilt、pedestal、arc、tracking、static、shake、POV、roll，可加 `with small/large amplitude`、`at slow/fast speed`。
- 只有當新主體/空間/狀態/視角/時間資訊出現時才使用 cut；小距離或角度變化用鏡頭運動而非 cut。
- **對白格式**：`<d>[中文] 台詞逐字。</d>`。只能放語言標籤 + 使用者提供的逐字內容，**禁止發明或改寫**。角色首次發聲時建立穩定聲音/視覺特徵，用 `(S1)`、`(S2)` 依出場順序編號，全片一致。
- 畫面可見文字（小卡、招牌）用英文雙引號 `"..."` 逐字保留。

### 3.2 三個欄位寫法

**`integrated_multimodal_description`**（視覺 + 對話時間軸）
- 以視覺風格與初始構圖開場（`[Shot 1]`，不要時間戳）。
- 依序描述鏡頭：`[Shot N] At HH:MM:SS, ...`。
- 每個視覺與聽覺事件都要可觀察、按時間順序：身份、位置、環境、光線、動作、反應、狀態轉變、同步的現場音。
- 對白用 `<d>[中文] ...</d>` 嵌在該鏡頭內；若鏡頭剪切橫越對白，用 `<scenetrans>` 標記並註明音訊跨鏡延續。

**`overall_soundscape`**（環境音 + 物理動作聲 + 非語言人聲）
- 1-4 句英文連續段落。
- 涵蓋：環境底噪、動作聲（腳步、紙袋、咖啡杯）、非語言人聲（輕嘆、笑聲）。
- **不要重複對白或配樂**。若要求完全靜音寫 `N/A`。

**`non_diegetic_music`**（觀眾才能聽到的配樂）
- 1-3 句英文：樂器、節奏、動態發展。
- 無配樂寫 `N/A`；角色能聽到的音樂寫在時間軸內而非此欄。

### 3.3 場景音效對照（咖啡廳範例）

| 時間軸事件 | overall_soundscape 建議詞 |
|-----------|--------------------------|
| 咖啡廳環境 | soft cafe ambience, distant chatter, espresso machine hum, cup clinks |
| 腳步聲 | approaching footsteps on wooden floor |
| 坐下 / 放筆電 | laptop thump on table, chair scuff |
| 拿餅乾 / 小卡 | crinkle of cookie package, paper card rustle |
| 摸頭 | none (gesture), soft breathing |
| 漸隱 | gentle fade of ambience |

### 3.4 H3 格式完整範例（15 秒咖啡廳重逢）

```text
integrated_multimodal_description: [Shot 1] A warm, wood-toned Taiwanese coffee shop, soft natural sunlight streaming through large windows, a young Taiwanese woman named Yuki, 27, with chin-length black hair, sits alone at a window table in a medium shot. She is casually dressed in a cream sweater, resting her chin on her hand and gazing out the window, two cups of black coffee and a half-finished business plan on the wooden table. The camera stays static with no movement.

[Shot 2] At 00:02.000, the camera cuts to a medium-wide shot tracking a young Taiwanese man named Tony, 28, with short black hair, dressed in a casual blazer, carrying a laptop, as he walks into the cafe and scans the room for a seat. His eyes land on Yuki, and his expression turns bright with surprise as he quickens his pace toward her table. The camera pans with Tony as he moves.

[Shot 3] At 00:04.000, the camera cuts to a close-up of Yuki's face as she looks up at the approaching footsteps, widening her eyes slightly, then breaking into a bright, shy smile. She quickly sets aside her pen and stands to greet him. The camera pushes in slightly. Yuki says, "好巧！你怎麼會在這裡？"

[Shot 4] At 00:06.000, the camera cuts to a medium close-up of the two seated across from each other. Tony shifts a little uncomfortably, tugging at his collar, then sets down his laptop and pulls out two bags of handmade cookies, placing them on the table with a hopeful look at Yuki. The camera rocks gently with a slight handheld sway. Tony says, "我剛好在附近開會……這是順路買給你的。"

[Shot 5] At 00:09.000, the camera cuts to an overhead close-up of the cookie packaging on the table, a handwritten card attached reading "今天辛苦了！". Yuki's hand enters frame to pick up the cookies, her fingertips trembling slightly. The camera stays static.

[Shot 6] At 00:11.000, the camera cuts to a fixed close-up of Yuki's face as she holds the cookies and card, gazing at Tony with deep, focused affection, corners of her mouth lifting uncontrollably. She nods softly, her eyes shimmering with emotion. Yuki says, "謝謝你……其實我今天真的很累。"

[Shot 7] At 00:13.000, the camera cuts to a medium shot of both from a slightly wider view, as they smile at each other under golden sunlight that traces warm halos around their silhouettes. Tony reaches out and gently pats Yuki's head, the scene slowly fading out. The camera pulls back slowly. Tony says, "有我在，沒事的。"

overall_soundscape: Soft cafe ambience with distant chatter and the low hum of an espresso machine, spoon clinks on ceramic cups, approaching footsteps on the wooden floor, a laptop thumping gently onto the table, the crinkle of cookie packaging and rustle of a paper card, a soft exhale from Yuki, and gentle breathing from both.

non_diegetic_music: A warm, tender acoustic score with a soft piano melody and gentle strings, slow and understated, swelling softly as the two characters smile at each other, then fading out quietly with the final scene.
```

### 3.4 r2v 六欄位格式（Ref2VA，2026-09 正式採用）

> r2v 的 `MiniMaxH3ReferenceToVideo` 使用與 T2V 不同的 **六欄位 schema**。
> 早期自創的 A/B/C/D 結構沒有音訊欄位，會讓模型自動腦補旁白——**已全面棄用**。

```text
subject_definitions:
<Subject 1> is {角色/場景} from <Picture 1>: {外觀關鍵特徵（全英文）}

summary:
{僅英文名詞片語/關鍵字，單句描述影片與參考關係}

retention_analysis:
<Subject 1>: fully_preserved.     <Subject 2>: fully_preserved.

detailed_description:
{風格 1-2 句}
[Shot 1]
00:00-00:0X
Action: {逐鏡：構圖/主體/動作/鏡頭運動/表情}
Dialogue:
<Subject 1> says:
<d>
[中文]
{逐字對白，每句獨立換行}
</d>

overall_soundscape:
{環境音 + 腔調錨點句（見第 5 節）}

non_diegetic_music:
{配樂 1-3 句}
```

**可選但建議加入**的 `speaker_constraints` 欄位（放於 `retention_analysis` 與 `detailed_description` 之間）：

```text
speaker_constraints:
Only <Subject 1> speaks.
No narration. No voice-over.
No off-screen voice.
```

### 3.5 四原則（對白與旁白區塊一律套用，源自實測 2026-09）

| # | 原則 | 為什麼 |
|---|------|--------|
| 1 | `summary` 只寫英文名詞片語，**不寫任何中文完整句** | 模型會把 `<d>` 外的中文完整句當成可朗讀內容，覆蓋掉 `<d>` 內對白 |
| 2 | `summary` 不出現台詞關鍵字 | 避免對白用詞（「背叛」「懷疑」等）被抓去唸 |
| 3 | 除 `<d>` 外，任何欄位**不出現中文完整句**；中文只在 `<d>` 內 | 欄位分工徹底隔離，`<d>` 是唯一被朗讀的來源 |
| 4 | 對白用 `<d>[中文] ...</d>` 逐字寫入，每句獨立換行 | TTS 逐句處理更穩，氣口自然 |

### 3.6 `<d>` 與聲音控制要點

- **無對白的區塊**（場景鏡）：`detailed_description` 內**完全不寫 `<d>`**；`overall_soundscape` 只寫環境音。
- **`<d>` 內每句獨立換行**：製造氣口，TTS 逐句處理更穩定。
- **`overall_soundscape` / `non_diegetic_music` 必須明寫**：不寫，模型會自行發明旁白或疊加無關聲音。

---

## 四、腔調錨點與 Seed 策略

### 4.1 腔調錨點（2026-09 實測有效）

MiniMax H3 的中文聲線**常與 seed 耦合出方言腔**（實測 100303→粵語腔）。處理：

- 不要只靠改 `<d>` 語言標籤（`[中文]`→`[普通話]` 實測無效）。
- 在 `overall_soundscape` **逐字寫念腔**當錨點，標準錨點句：
  `All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.`
- 加強版（歪腔發生時）：`speaker_constraints` 加負向排除（`never Cantonese / never Hong Kong accent / never any regional dialect`）、
  `Action` 段補正向念腔描述、`<d>` 前一行聲明腔調——三點同時錨定。

### 4.2 Seed 策略與黑名單

- 每支區塊獨立 seed；**旁白區塊共用同一支旁白 seed**（實作採用 `310000`）。
- **歪腔 seed 記入黑名單**：實測某 seed 固定輸出粵腔時，記入黑名單並換新 seed 重跑。
- 修正腔調提示詞時**必須同時換 seed**——固定 seed = 固定腔調，只改文字不改 seed 不會生效。

### 4.3 特殊符號唸法陷阱

- `<d>` 內凡會被唸出的文字，一律避免符號與阿拉伯數字：`2%`→`百分之二`、`15%`→`百分之十五`。
- 禁止混寫（`百分之2`）；實測 `%` 會被唸成「PiFen」怪音。
- 畫面可見文字（圖表數字、電視牆標題）不被唸出，可保留原始符號；鏡頭描述中標明 `visible on-screen text`，與 `<d>` 分開。

---

## 五、實戰流程

1. 依階段一模板蒐集：人物、風格、分鏡（含逐字台詞）、負面要求。
2. 識別模式：T2VA（純文字）／ I2VA（第一幀）／ FL2VA（首尾幀）／ L2VA（結尾幀）／ r2v 參考圖（Ref2VA 六欄位）。
3. 依鏡號數決定 cut 時間戳（遞增、落在時長內）。
4. 對白逐一轉成 `<d>[中文] ...。</d>`；可見文字用 `"..."`。
5. 編寫 `overall_soundscape`（環境+動作聲 + 腔調錨點）與 `non_diegetic_music`（配樂）。
6. 送進 `gen_t2v_video` / `gen_i2v_video` / `gen_r2v_video`（duration 參數設在工具參數，不寫進 prompt）。

## 六、產出前自檢

- [ ] 是否為「創意規劃（中文）」→「H3 三欄位」的兩階段落？
- [ ] 3 欄位名稱與順序是否正確？
- [ ] prompt 內是否有 model 名、解析度、寬高比 = 若有則違規？
- [ ] 鏡頭時間戳是否嚴格遞增且 ≤ 時長？
- [ ] 每句台詞都逐字包在 `<d>[中文] ...。</d>`？沒有發明或改寫？
- [ ] `overall_soundscape` 是環境/動作聲，未重複對白或配樂？
- [ ] `non_diegetic_music` 只描述配樂，角色可聽音樂在時間軸內？
- [ ] 使用 `(S1)`/`(S2)` 標記說話者，順序一致、全片不換人？
- [ ] r2v：`subject_definitions`/`retention_analysis` 用 `<Subject N>`/`<Picture N>` 標籤指名？
- [ ] r2v：`summary` 只含英文名詞片語，無中文完整句、無台詞關鍵字？
- [ ] r2v：除 `<d>` 外無中文完整句？無對白的區塊完全不寫 `<d>`？
- [ ] r2v：有對白的區塊帶腔調錨點句（台灣腔普通話）；seed 已查過黑名單？