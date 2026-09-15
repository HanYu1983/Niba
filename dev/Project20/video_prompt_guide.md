# MiniMax H3 生成視頻提示詞指導（T2V 三欄位 / r2v 六欄位）

本文件結合 **玩家自訂創意模板**（人物一致性、拍攝風格、分鏡拆解）與 **MiniMax H3 官方提示詞規範**（[video-prompting-skill](https://github.com/Square-Zero-Labs/video-prompting-skill)），用於生成可直接餵給 ComfyUI MiniMax H3 的影片提示詞。

---

## 一、兩階段工作流

| 階段 | 用途 | 語言 |
|------|------|------|
| **1. 創意規劃** | 用閱讀性模板整理人物、風格、分鏡、台詞、負面要求 | 中文 |
| **2a. H3 編譯（T2V/i2v）** | 轉換成 MiniMax H3 官方要求的 3 欄位 schema | 英文 + `<d>` 內保留原文台詞 |
| **2b. Ref2VA 編譯（r2v）** | 轉換成官方 6 欄位 schema，並以參考圖錨定角色/場景一致性（見 §3.4） | 英文 + `<d>` 內保留原文台詞 |

> 玩家只需提供規劃階段的內容；編譯階段由 AI 依照本章後半規範完成。
> r2v 模式需先備好參考圖（見 `novel_to_video_guide_v2.md`「參考圖建置」），以 `ref_image_0/1/2` 重複取用。

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

> **本章 §3.1–§3.3 適用於 T2V/i2v**（3 欄位 schema）。**r2v 使用不同的 6 欄位 schema，見 §3.4。**

H3 對 T2V/i2v 輸出 schema 有**嚴格要求**：必須是以下 3 個欄位、依序排列、欄位名不變。**此為單行還是多行依各欄位內容而定**（`integrated_multimodal_description` 依官方範例為單段文字）。

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
- **對白格式**：`<d>[中文] 台詞逐字。</d>`。只能放語言標籤 + 使用者提供的逐字內容，**禁止發明或改寫**。角色首次發聲時建立穩定聲音/視覺特徵，用 `(S1)`、`(S2)` 依出場順序編號，全片一致。> r2v 不使用 `(S1)`，改用 `<Subject N>` 標籤（見 §3.5）.
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

### 3.4 H3 三欄位完整範例（15 秒咖啡廳重逢，T2V）

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

### 3.5 r2v 六欄位格式（Ref2VA，2026-09 正式採用）

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
{環境音 + 腔調錨點句（見 4.1）}

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

### 3.6 四原則（對白與旁白區塊一律套用，源自實測 2026-09）

| # | 原則 | 為什麼 |
|---|------|--------|
| 1 | `summary` 只寫英文名詞片語，**不寫任何中文完整句** | 模型會把 `<d>` 外的中文完整句當成可朗讀內容，覆蓋掉 `<d>` 內對白 |
| 2 | `summary` 不出現台詞關鍵字 | 避免對白用詞（「背叛」「懷疑」等）被抓去唸 |
| 3 | 除 `<d>` 外，任何欄位**不出現中文完整句**；中文只在 `<d>` 內 | 欄位分工徹底隔離，`<d>` 是唯一被朗讀的來源 |
| 4 | 對白用 `<d>[中文] ...</d>` 逐字寫入，每句獨立換行 | TTS 逐句處理更穩，氣口自然 |

### 3.7 `<d>` 與聲音控制要點

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
- 外籍面孔角色也要排除英文混雜（見 §3.6、§4.1 與 QA Q1）；`<d>` 內特殊符號詳見 QA Q2。

---

## 五、實戰流程

1. 依階段一模板蒐集：人物、風格、分鏡（含逐字台詞）、負面要求。
2. 識別模式：T2VA（純文字）／ I2VA（第一幀）／ FL2VA（首尾幀）／ L2VA（結尾幀）／ r2v 參考圖（Ref2VA 六欄位）。
3. （T2V/i2v）依鏡號數決定 cut 時間戳（遞增、落在時長內）；r2v 用 `[Shot N]`＋區段時間（`00:00-00:0X`），無 `At` 時間戳寫法。
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
- [ ] （T2V/i2v）使用 `(S1)`/`(S2)` 標記說話者，順序一致、全片不換人？（r2v 改用 `<Subject N>`）
- [ ] r2v：`subject_definitions`/`retention_analysis` 用 `<Subject N>`/`<Picture N>` 標籤指名？
- [ ] r2v：`summary` 只含英文名詞片語，無中文完整句、無台詞關鍵字？
- [ ] r2v：除 `<d>` 外無中文完整句？無對白的區塊完全不寫 `<d>`？
- [ ] r2v：有對白的區塊帶腔調錨點句（台灣腔普通話）；seed 已查過黑名單？
- [ ] （QA Q1）角色為外籍/西方面孔時：族裔已寫死 East Asian、`speaker_constraints` 已排除 English／code-switching、`overall_soundscape` 錨點句含 `no English`，且換了新 seed？
- [ ] （QA Q2）`<d>` 內僅純中文台詞，無特殊符號、無英文、無阿拉伯數字？
- [ ] （QA Q3）長對白已依句拆行（每句獨立換行、句號收尾）、無冒號等會被唸的符號、`Action` 未複述台詞全文？
- [ ] （QA Q4）單行對白為單一語意單元（約 ≤20 字），句中無冒號／引號等中斷符號？
- [ ] （QA Q5）長對白已依句拆行且切點不落在借詞前；`Action` 未複述台詞語意；錨點句含 `no English`？

---

## 七、QA 紀錄（2026-09，來自 Ch4 實作回饋）

### Q1：角色外觀像西方人時，即使標了台灣腔中文，對白仍出現中英混雜，如何避免？

- **發生**：Ch4 E28（親政府立委，Ref-POL），參考圖角色偏西方面孔；`overall_soundscape` 已有台灣腔錨點句，仍出現中英混雜。
- **原因**：腔調錨點只排除方言（`no Cantonese`），**沒排除外語**；且角色視覺外觀（西方人）會強化模型「說外語」的傾向。
- **處置**：
  1. 人物定義先寫死族裔：`East Asian (Chinese) man`；參考圖製作時確保臉孔偏東亞人（若參考圖本身就是非亞裔面孔，先重新生成，不要指望文字能蓋過視覺）。
  2. `speaker_constraints` 加負向排除：`never English`／`no code-switching`／`no foreign language`。
  3. `overall_soundscape` 錨點句加長：`All spoken lines are delivered in Taiwan-accented Standard Mandarin Chinese only, no Cantonese, no English, no code-switching.`
  4. 修正後**換新 seed 重跑**（seed 與腔調耦合，固定 seed 只改文字不會生效）。

### Q2：`<d>` 裡的對話要避免特殊符號嗎？會讓對白多說出奇怪發音

- **發生**：Ch4 E26（B26）對白「如果拿不出來，那麼這場「標籤之雨」，就是這個國家最後的氣數。」含全形引號；對白含特殊符號時，視頻偶爾多唸出怪音（實測 `%` 被唸成「PiFen」、`「」`括引被唸出怪音）。
- **原因**：TTS 可能把部分符號當成「要唸的內容」而非純標點，產生工具化發音。
- **處置**：
  1. `<d>` 內只放純中文台詞，避免會被唸出的符號：`%`、`&`、`#`、`@`、emoji、英文／數字混寫。
  2. 阿拉伯數字一律改中文數字：`2%`→`百分之二`、`15%`→`百分之十五`、`45`→`四十五`。
  3. 非台詞一部分的符號（強調用 `*`、裝飾標誌）一律不寫進 `<d>`；**「」引號一律移除**（實測連專有名詞括引都會唸出怪音），直接以純文字寫出，如 「標籤之雨」→`標籤之雨`。
  4. 省略號「……」可用於氣口，保留；若被唸出怪音，改用句點分句。
  5. 畫面可見文字（圖表、電視牆標題）不被唸出，放鏡頭描述並標 `visible on-screen text`，與 `<d>` 隔離。

### Q3：長對白中途被插入奇怪的對白/語句（跨句切點插話）

- **發生**：Ch4 E24（B24）——「我不會要求你們支持我。」與「我只要求政府做一件事…」兩句之間被插入怪對白。
- **原因**（三因子疊加）：
  1. `<d>` 內 13 秒長對白**整段只寫一行**，句與句之間的語意切點沒有換行分句 → TTS 在該切點失去氣口，模型自行腦補插話。
  2. 對白含**全形冒號「：」**（屬 Q2 特殊符號）→ TTS 對符號處理異常，冒號把語句攔腰切斷並誘發怪音。
  3. `Action` 欄用英文把台詞語意複述（含 em-dash 斷句）→ 等於額外提供「可唸文本」給模型當插話素材。
- **處置**：
  1. **長對白依完整句拆行**，每句獨立換行、以句號收尾（§3.6 原則 4）；單句超過 7-10 秒或含多個語意單元，務必拆行。
  2. 移除 `：` 冒號等會被唸的符號——改寫成兩句（`我只要求政府做一件事。把你們剛才收到的那三條訊息的原始證據拿出來。`）或直接重新斷句。
  3. `Action` 只寫語氣＋動作＋語意方向，**不要重複台詞全文或其英文翻譯**。
  4. 修正後**換新 seed 重跑**。

### Q4：對白中詞語被重複唸出（跳針／重讀一段）

- **發生**：Ch4 E30 對白「現在，全歐若拉聯邦的年輕人都在玩一個遊戲：找出藏在政府宣傳裡的「代碼錯誤」。」——「玩一個」被重複唸了兩次。
- **原因**：
  1. **全形冒號「：」位於句子中段**（「…都在玩一個遊戲：找出藏在…」）→ TTS 在切點把冒號前的片段重讀一遍（跳針），與 Q3 同根：句子被符號攔腰切斷。
  2. `<d>` 整句**單行過長**（27 字、含多個語意單元），無分行氣口 → 模型在句中以「重讀」方式重新對軌（lip-sync reset）。
  3. 「」引號（Q2）疊加干擾詞語邊界。
- **處置**：
  1. 移除冒號，改以句號分句、**每句獨立換行**（E30 改法：`現在，全歐若拉聯邦的年輕人都在玩一個遊戲。`＋`找出藏在政府宣傳裡的代碼錯誤。`）。
  2. **單行控制在單一語意單元**（約 ≤20 字或 ≤7-10 秒），超長就拆兩句。
  3. 移除「」引號。
  4. 修正後**換新 seed 重跑**。

### Q5：對白句中插入英文／怪異語言（長句未分行＋外源借詞）

- **發生**：Ch4 E29b 對白「因為我剛才在廣場上，不只是在說話。我把剛才那個伺服器的發信邏輯，即時同步到了全聯邦所有的開源論壇上。」——第一句與第二句之間被插入英文與怪異語言。
- **原因**：
  1. **長單行未分行**（12 秒、30+ 字、兩個語意單元）：違反 Q3/Q4 規則，TTS 在句子切點失去氣口，自行插入內容填補。
  2. 對白含**外源借詞**：伺服器（server）、開源論壇（open-source forum）——句子中斷點恰落在借詞附近，模型以英文／混雜形式吐出該段（Q1 外語混雜的另一個觸發點：**詞彙**而非角色外觀）。
  3. `Action` 用 em-dash 照抄台詞語意（`…not only talking in the square — he has synced that server's…`），斷點正好對應句中切點＝標記「這裡可插話」（同 Q3 因子 3）。
  4. `overall_soundscape` 錨點句只擋 Cantonese，沒擋 English（同 Q1 因子）。
- **處置**：
  1. **依句拆行分句**（每句獨立換行、句號收尾）——第一優先；**切點避免剛好落在借詞前**。
  2. `Action` 移除複述台詞的斷句，只寫語氣方向。
  3. 錨點句加 `no English / no code-switching`（同 Q1 加強版）。
  4. 借詞仍觸發混雜時，確認 `story` 原文是否可用中文近義詞替換（逐字原則優先，需與文本端確認）。
  5. 修正後**換新 seed 重跑**。