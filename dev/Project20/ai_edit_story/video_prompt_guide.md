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
- **性別翻轉也記黑名單**：旁白 seed `310000` 於 Ch12 連續三支輸出女聲（l1/l23/l26）後已失效（QA Q12）；**旁白 seed 一經實測翻轉聲線性別即不可再用**，換新 seed（沿用 `310100`、`310101`、`310102` 跳號）。
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
- [ ] （QA Q6）句間以語法銜接為本：從屬連詞開頭的句子已併入前句語流，而非兩段獨立句相貼；句長分布均勻且總字數符合每秒口播量；句內無逗號切點；`Action` 無「聲音會被回應」的線索？
- [ ] （QA Q7）說話鏡頭的人物：參考圖不是「閉唇＋緊繃表情」肖像？`Action` 未塞大幅身體動作（整裝／離場／回頭另有鏡頭）？已加「嘴部明顯張開、逐字咬字」的正向描述？鏡位非 wide（至少 medium close-up）？`Action`／`speaker_constraints` 無 `voice-over`／`off-screen` 暗示？
- [ ] （QA Q8）對白內出現另一角色的稱謂直呼（法官閣下／林委員／老師…）時：非說話者**不在**說話鏡頭前景（或遠景散焦且 `mouth has to stay closed, lips sealed`）？`Action` 以「名字＋張嘴者身分」明寫 `only <Subject N>'s mouth moves; the other character's lips stay closed`？`Action` 無指代含糊的代名詞（him/her）連到非說話者？
- [ ] （QA Q9）畫外音區塊：構圖保留了第二人（不移除）？`speaker_constraints` 含 `No on-screen mouth movement from any person`＋`If any second person is visible in frame, their mouth also stays sealed throughout`？`Action`/`Dialogue` 也同時聲明第二人嘴不動（如 `who also stays silent with lips sealed`）？
- [ ] （QA Q10）人物入鏡的長鏡頭（>10 秒）：已拆成多個 `[Shot N]`？`Action` 至少含一個持續可動的小節點（鐘擺／光影／螢幕閃爍）或鏡頭運動（slow push-in）？是否已加 `No duplicated figure. No split or mirrored composition` 負向條款？「人物自撐整段時間」的純靜止構圖已避免？
- [ ] （QA Q11）無對白／無旁白區塊（純場景、道具特寫）：`speaker_constraints` 已含「音訊空態」負向（`No whispering`／`No muttering`／`No off-screen speech`／`No device voice`）？畫面浮現文字已標 `visible on-screen text, never read aloud`？`Action` 無 `words`／`text`／`reads` 等 speech token？設備音效已定性「無語音」（`no voice`）？
- [ ] （QA Q12）旁白區塊：`overall_soundscape` 錨點句為**完整版**（含 `low calm middle-aged male voice`，不得精簡成只剩腔調）？`speaker_constraints` 含 `The narrator is a fixed calm male voice, never female`？旁白鏡頭無可被聲軌認領的人形，或有路人已明寫 `silent and never the source of the narration`？
- [ ] （QA Q13）旁白區塊：`<d>`／`Action` **未**寫成畫面中角色的內心獨白／視角句（「她發現／XX看著…突然意識到」）？`Subject 1` 非唯一可被聲軌認領的女性前景？錨點句已含 `not character dialogue, not on-screen voice`＋`never female`？
- [ ] （QA Q14）對白／旁白區塊：`Action` **未**用英文複述／翻譯 `<d>` 台詞語意？逗號斷行的半句已併成完整語意單元或以句號收尾？抽象詞（政治動員／認知反偵察等）附近無英文對譯？

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

### Q6：每句都已獨立換行，句與句之間仍被插入奇怪對白（破題短句＋無語法銜接下句）

- **發生**：Ch6 F26——「這就是我說的數據叛亂。」與「當你們拒絕提供真相，人民會自己去挖掘。」兩句之間被插入奇怪對白。此案例 `<d>` 已依句換行、含 `speaker_constraints`（Only Subject 1 speaks / no narration）、錨點句含 `no English`，Q3–Q5 規則全數遵守仍中招。
- **原因**（模型把「句號切斷的兩段獨立句」視為跨段落，自行合成承接語填縫）：
  1. **句間無語法銜接**：句 1 是「破題式短句」（11 字），獨立結束於主題詞「數據叛亂」＝強宣告段落；句 2 以從屬連詞「當…」開頭、另起話題，和句 1 沒有任何指代／承接成分→LLM-TTS 在句號切點失去「連讀」依據，合成一句承接語填在兩句之間。
  2. **句長與時長失衡**：三句字數極不均（11 / 18 / 30），總字符 59 塞進 13 秒（≈4.5 字/秒，逼近口播上限）。模型為對齊預期時長，在過短的句 1 後保留多餘氣口，並於氣口填入自製語句。
  3. **句內逗號＝潛在切點**：句 2「當你們拒絕提供真相，人民會自己去挖掘。」含全形逗號切出子句（與 Q4 冒號同源：句內切點誘發 TTS 重新對軌）。
  4. **次要因子**：`Action` 寫 `the words ringing through the chamber`（「聲音會被回應」的聲效暗示）→ 模型把回響配音成插縫對白；句 2、句 3 皆含「真相」重複詞→重複詞作為重新對軌點，使補述落在重複詞首次出現之前（即句 1/句 2 邊界）。
- **處置**：
  1. **斷行以「語法銜接」為本，不只是「遇到句號就換行」**：下一句若以「當／如果／因為／假如」等從屬連詞另起話題，會與上一句失去膠著→併入同一語流（同一複句），或把從屬連詞改為接續語氣（「而／所以，當…」）提供連續性線索。
  2. **句長分布要均勻**，落差勿超過 2 倍；對照鏡頭秒數（中文口播約 3.5–4.5 字/秒）：太多會壓氣口或逼模型縮句，太少（10 字短句配長鏡頭）會留出被填補的氣口。
  3. **句中逗號也視為潛在切點**：能把子句拆成獨立句號句就拆；不能拆時確認該處非模型「重新對軌點」。
  4. `Action`／`overall_soundscape` 不要給「聲音會被回應」的線索（避免 `ringing`、`echo`、`murmur`、`crowd reaction` 等），只描述視覺與單人動作；也不要以英文複述台詞語意。
  5. 修正後**換新 seed 重跑**（固定 seed＝固定腦補習慣）。

### Q7：對白聽得到但人物沒張嘴（口型對不上／像旁白）

- **發生**：Ch6 F29——「會引發暴動的不是數據，而是被欺騙後的憤怒。」聲音正常、語句無誤，但林墨全程幾乎沒張嘴，口型完全沒對上。
- **原因**（多因子疊加，動畫模型把「邊做大動作邊說話」的鏡頭優先權給了肢體、把對白轉成旁白式聲軌）：
  1. **參考圖是「閉唇＋緊繃表情」的肖像**：Ref-M（`zimage_00008_.png`）依 portrait 提示詞生成——`serious face, wary tense expression, looking slightly off-camera`，通篇沒寫到「張嘴／口腔可見」。閉唇肖像幾乎不含「張嘴動作」的嘴部解剖學錨點，動畫模型缺少可驅動的口型，只好保住聲音、捨棄口型。**角色圖跨章複用時風險最大**（一張閉唇肖像用整季＝每個對白鏡頭都靠它）。此因子非必然（同圖在 F26 等對嘴正常），疊上下列因子才會引爆。
  2. **Action 主導「離場身體動作」**：`straightens his jacket and prepares to leave` 是大幅肢體節點——模型優先渲染離開／整裝／轉身的動作，說話被降級成動作之上的聲軌；角色一旦面向／轉離鏡頭、或身體在移動，嘴部就不在可對嘴的可視面上。
  3. **Action 暗含「表情封印」**：`answering without heat, level as an accountant closing a ledger` 容易把「情緒冷漠」操作化成「面部不動」——嘴角僵直＝口型歸零。
  4. **中景＋動態**：Medium shot 且主體在移動，嘴在畫面占比小、lip-sync 精度低；對嘴要在臉部畫面上才看得出。
  5. `Action` 只有一句被動式 `Lip sync must follow the line exactly`，沒有正向要求「嘴要明顯張開、逐字咬字」，等同可當 VO 播。
- **處置**：
  1. **說話鏡頭與參考圖解耦**：若參考圖是閉唇緊張肖像，對白鏡頭在 `subject_definitions`／`Action` 加一段正向 mouth cue，例如 `his mouth opens and closes clearly with every syllable, lips visibly articulating the Chinese words, camera holds his face`；更穩的做法是**另產一張「微張嘴、正對鏡頭」的說話專用角色圖**，把角色圖分工成「說話版／默版」。
  2. **`Action` 讓角色「站定說話」**：說話同時不要塞大幅肢體動作（整裝、回頭、起身、離場）；身體節點拆到另一支場景鏡，說話鏡頭只留口語動作＋微表情，維持面向鏡頭／議場。
  3. **移除表情封印詞**：`without heat`／`level`／`flat`／`emotionless` 在說話鏡頭改寫成語氣（如 `calm but firm tone`），別寫成「面部不動」的暗示。
  4. **鏡位靠近臉**：說話鏡頭用 close-up／medium close-up，避免 wide 使口型不可辨。
  5. **雙向鉗制**：`speaker_constraints`／`Action` 明寫 `the mouth must move visibly while speaking`；同段落絕不放 `face away`、`turning`、`walking away`，也別出現 `voice-over`／`off-screen` 字眼。
  6. 修正後**換新 seed 重跑**（口型與 seed 亦有耦合）。

### Q8：對白文本與稱謂都正確，卻由畫面前景的另一角色圖像「張嘴對白」（前半錯、後半才對）

- **發生**：Ch7 G6——塔蘭的台詞「法律不討論詩意，林委員。／我們討論的是權力分立。」**文本與語音內容無誤**，但畫面上**張嘴對白的是前景的林墨圖像**（r2v 的口型動畫被套到林墨的參考圖），應該由塔蘭大法官張嘴；第三句「行政權有權保留其資訊處理的內部空間，否則國家將無法治理。」張嘴者才換成塔蘭。此案例 `speaker_constraints`（Only `<Subject 1>` speaks）、`Dialogue` 的 `<Subject 1> says:`、腔調錨點句全部在場，仍前半錯、後半對。
- **原因**（r2v 是圖像驅動：模型把「正在張嘴對白的臉」指派給鏡頭裡**最顯眼（最快／最完整）的角色圖像**，尤其 reverse 鏡頭，而非黏死 `<Subject N>` 標籤）：
  1. **對白前半段畫面上「被稱呼者在前景」**：G6 鏡位是中景塔蘭＋**林墨 soft foreground（前景、近端、臉部占畫面大片）**。模型把前段可見的口型動畫綁到前景那張臉——它嘴部資訊最多、最適合做 lip-sync，於是**林墨的參考圖替塔蘭張嘴**。
  2. **承接句連鎖**：句 2 承接句 1 話輪，張嘴者隨句 1 綁在林墨；句 3 進入「行政權」命題後構圖/鏡頭焦點轉向塔蘭中景主體，張嘴者才切回塔蘭 → 前半錯、後半對，是**鏡位焦點切換**決定的、不是語音指派問題。
  3. **（次要）`Action` 鏡頭主體指代含糊**：`Camera stays on him` 的 him 文法上最接近 Lin → 模型可依此把「鏡頭焦點＝張嘴者」綁到 Lin。
- **處置**：
  1. **不要讓「非說話者」占說話鏡頭前景**：最穩＝**single shot 只拍主講者**（G3 同以「林委員」開頭、塔蘭單人特寫，全段正確）；真要 reverse 構圖時，把非說話者放遠景散焦並明寫 `mouth has to stay closed, lips sealed`，且**主講者的臉占畫面主體**。
  2. **鎖死「誰張嘴」**：`Action` 明寫 `only <Subject 1>'s mouth moves; the other character's lips stay closed`，並以名字直指 `Taran's lips articulate the line`。
  3. **`Dialogue` 指派句加過濾**：`<Subject N> says:` 前加 `The following lines belong to <Subject 1> alone. <Subject 2> remains silent.`（壓住視覺張嘴者的指派）。
  4. **`Action` 用名字、不用代名詞**：`Camera stays on him`→`Camera stays on Taran`（鏡頭焦點與張嘴者一致，消除 him/her 指代分歧）。
  5. **R2 併原錯因**：換**新 seed** 重跑（視覺指派與 seed 耦合，固定 seed 只改文字未必生效）。

### Q9：畫外音區塊（off-screen voice）變成「畫面中角色在張嘴唸對白」

- **發生**：Ch9 I15——赫德總統通訊器咆哮（「關掉它。林墨，立刻關掉它。那是偽造的。那是人工智慧合成的。」）設定為 off-screen voice，原本由軍官聽通訊器、林墨在旁（`staring at Lin`）。修正嘗試了多個方向，最終找到正確解法。
- **嘗試過程與失敗原因**：
  1. **移除 Lin（單人構圖）**→ 軍官自己張嘴說出四句。原因是 r2v 的聲軌必須綁到畫面中某張可見的嘴；只有一張臉時，聲音就被該臉認領。
  2. **移動通訊器離臉（放桌面）＋嘴部鉗制指令**→ 仍然由軍官張嘴。聲源貼近畫面中唯一角色時，模型把設備音綁定到該角色。
  3. **改為正面定性音源、移除否定句**→ 結構改了仍不夠，聲軌指派問題未解。
- **成功解法**：保持原始結構不變（`staring at Lin`＋手持通訊器貼耳），只需在 **`speaker_constraints` 與 `Action`/`Dialogue`** 加入「**若畫面出現第二人，其嘴也全程不動**」即可。正確版本（seed=490015，Prompt 5 成功）：
  ```
  speaker_constraints:
  Only the voice of the president from the communicator is heard, off-screen.
  No character speaks on camera. No narration. No voice-over.
  No on-screen mouth movement from any person.
  If any second person is visible in frame, their mouth also stays sealed throughout.
  never English / no code-switching / no foreign language.

  Action:
  ...the officer listens with lips sealed, staring at Lin who also stays silent with lips sealed...

  Dialogue:
  The one speaking is an off-screen voice through the communicator;
  <Subject 1> only listens, lips sealed.
  If Lin is visible, his lips also stay sealed.
  ```
- **原理**：原始版（`staring at Lin`）成功引入第二人物，但模型把畫外聲軌綁到無嘴部指令的「額外人」上。只要補上「第二人嘴也不動」的指令，模型無處可綁聲軌，就被迫保留為「畫外設備音」。移除 Lin（單人構圖）反而消除這個緩衝，聲音只能綁到唯一可見的臉。
- **鐵律**：畫外音區塊**不要移除第二人**，保留構圖緩衝；強化所有可見人物的嘴部封印即可（`No on-screen mouth movement from any person`＋`If any second person is visible, their mouth also stays sealed throughout`）。

### Q10：長時間「無動作」的旁白區塊，畫面變成上下分割且內容相同（兩個總統複製填充）

- **發生**：Ch10 J14——赫德辦公室旁白（72 字、15 秒、seed=310000）。輸出不只一位赫德：畫面被上下分割成兩半，兩半內容完全一樣（同一位總統重複出現）。旁白聲音正確、台詞正確，純視覺層出事。
- **原因**（長時間靜止＋無語音視覺錨點＋單一人物肖像，三者疊加觸發「視覺複製填充」）：
  1. **15 秒單鏡頭 `[Shot 1]` 內 `Action` 全是靜態描述**：`sits motionless`、`stares into the void`、`does not speak`，且 `speaker_constraints` 同時關掉畫面內說話、關掉 mouth movement——整段畫面沒有任何「可驅動的動態節點」，模型必須在 15 秒內讓這個鏡頭「活著」，唯一能做的就是把同一內容複製排滿畫面。
  2. **單一人物肖像構圖＋畫面上沒有第二物體**：unit set 只有一位赫德，無景觀物件（監控牆是描述性背景、無獨立動作），無背景角色、無環境動態可分配給時間軸 → 複製的是「人」本身。
  3. **與 J9／J16 的對照**：J9（監控牆旁白）、J16（夜街空景旁白）同樣是長旁白，但主體是**場景**，畫面有多個可動的物件層次（牆面、光影、車流）分散模型注意力，不會把「人物」複製。J14 是唯一「單一靜止人物肖像＋長時長」的旁白區塊，正中觸發條件。
- **處置**（前瞻修正，下一篇不要再犯）：
  1. **場景型旁白優先**：旁白區塊若無需人物入鏡，全部用場景畫面（J9/J16 模式），徹底避開「複製人」風險。
  2. **迫使人像旁白時，拆短鏡頭**：把 15 秒拆成兩個 `[Shot 1]/[Shot 2]`（如 8+7s），每次切鏡時間軸 = 模型新的取樣起點，切斷「一個鏡頭要撐 N 秒」的複製需求。
  3. **給靜止畫面注入「小型可動節點」**：即使是旁白，也在 `Action` 給畫面一個可驅動的動態（`the second hand of the clock on his desk keeps ticking`／`dust drifts through the light from the blank monitors`／`a single monitor in the wall flickers on, then dies`），讓時間由物件推進，而不是由「複製人物」推進。
  4. **明確禁止複製**：`speaker_constraints` 或 `Action` 加 `The president appears exactly once in frame. No duplicated figure. No split or mirrored composition.`（與嘴部封印同一性質：把常見失敗模式直接寫死成負向條款）。
- **原理**：這是 Q4（跳針重讀）在**視覺軸**的對應物。模型對「長時間、無語音錨點、無動作節點」的鏡頭，會用「重複內容填充時長」來自救；在聽覺軸表現為重讀（Q4），在視覺軸表現為複製／分割人物。解法不是把時長縮到零，而是**拆鏡＋供給可動節點**，讓每個時間片段都有該被渲染的內容。
- **鐵律**：人物入鏡的長鏡頭**必須給畫面持續的小動態**；純靜止不能再與「長於約 10 秒」並存。旁白想傳達「凝視／沉默」時，用場景或鏡頭運動（slow push-in）傳達，別讓「人物本身」獨自撐整段時間。

### Q11：無對白／無旁白的場景區塊，出現「似英文卻非英文」的含糊語音

- **發生**：Ch12 l13（林墨點開平板，純場景 5 秒，Ref-OFFICE 00089，seed=493010）。無對白、無旁白、`speaker_constraints` 已含 `No character speaks / No narration / No on-screen mouth movement`，影片卻冒出一段像英文又不像的含糊語音（聽起來像在喃喃唸一串拉丁文字）。
- **原因**（三因子疊加，聲軌把「畫面上的可讀素材」當成該唸的內容）：
  1. **畫面上浮現文字卻未定性「不唸」**：`Action` 寫 `…it lights up with a settlement summary…`——平板亮起結算摘要＝畫面浮現拉丁字形文字，但未依 Q2 規則 5 標 `visible on-screen text`，更未追加 `never read aloud`。TTS 對「它不認識的文字」會用近似外語音節硬唸（與 Q2 的 `%`→「PiFen」、引號怪音同源），唸出「像英文又不像」的音節雜訊。
  2. **場景區塊缺「音訊空態」負向條款**：`No character speaks` 只擋「人物張嘴唸」，沒擋**畫外低語／murmur／設備音被實作成語音**。純道具特寫（手＋平板）畫面沒有可見的嘴，聲軌無處綁定；模型若要「讓聲音存在」，只能自行在畫外喃喃——Q4（聽覺重讀）與 Q10（視覺複製）都是「無內容就自行填補」，本案例是第三條軸：**聲軌自救填補**。
  3. **`Action` 的 speech token 提供誘因**：`A small pause hangs in the air before the next words` 的 `words` 一詞暗示「文字／話語將要發聲」；`overall_soundscape` 的 `the waking tablet`（設備喚醒）也給「語音助理式發聲」留下實作空間。
- **處置**：
  1. **畫面任何浮現文字一律標 `visible on-screen text; it is never read aloud, never spoken`**（Q2 規則 5 的強化版：不只與 `<d>` 隔離，還要正向宣示「不唸」）。
  2. **所有無對白／無旁白區塊（純場景、道具特寫）一律加上「音訊空態」**：`speaker_constraints` 追加 `No whispering. No muttering. No lip-flap. No off-screen speech. No device voice. Strict silence of any human voice.`
  3. **`Action` 移除 speech token**：`before the next words`→`a silent pause before the next beat`；`No one speaks` 可保留，或改 `silence fills the room`（視覺＋聽覺同時表態）。
  4. **設備音效明確「無語音」**：`the waking tablet`→`the tablet wakes with a low electronic hum - no voice, no alert tones, no spoken sounds`。
  5. **修正後換新 seed 重跑**。
- **原理**：模型對「沒有對白、沒有旁白、畫面上卻有看起來『該被唸』的文字」的鏡頭，會把視覺文字當成 TTS 素材、以不存在的語音字典硬唸（外語近似音）。解法不是塞對白，而是**幫它定性「沒什麼要唸」**：可見文字標 `never read aloud`＋音訊區塊宣示為嚴格無語音。
- **鐵律**：純場景／道具特寫的區塊（尤其畫面有螢幕、平板、標語、圖表時）**必加音訊空態負向條款**；畫面上任何可被唸出的文字，一律 `visible on-screen text, never read aloud`。

### Q12：旁白聲線應為固定男聲，某支旁白卻輸出女聲（性別翻轉）

- **發生**：Ch12 l1（安靜流行病，旁白 6 秒，Ref-COMM 00088，seed=310000）。全片其餘旁白（l3/l4/l23/l25/l26）維持男聲，唯獨開場這支翻轉成女聲。
- **原因**（聲線從「顯式約束」退化成「seed 隱式慣例」＋畫面出現可被聲軌認領的人形）：
  1. **主因：旁白錨點句漏掉「聲線釘定」**。Ch1–Ch11 的旁白 soundscape 一律是完整版 `Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.`；ch12 六支旁白卻全部精簡成 `Narration delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese, no English.`——把 `low calm middle-aged male voice` 整段拿掉了。「性別／音質」不再是 prompt 的顯式約束，男聲只剩 seed 310000 的歷史關聯可依賴；該 seed 在（參考圖＋文字＋時長＋畫面人形）這個條件組合下讓隱式慣例失靈時，模型就自由選聲線→偏女性。
  2. **次要：畫面有「可被聲軌認領的路人」**。l1 是街道空景旁白，`Action` 寫 `only a handful of people walking in the distance`，參考圖 COMM（稀疏行人街景）可能含女性行人。r2v 對畫面中可見人形有「聲軌認領」傾向（與 Q9 畫外音綁到畫面中唯一角色同一原理）；旁白缺「男聲」強錨點時，聲軌就指派給畫面中偏女性的路人。對照：l23/l25（NIGHT 空街、無路人）、l4（含林墨男性角色圖）未翻轉。
  3. 次要：**黑名單只監控「歪腔」**——310000 不在黑名單，無機制攔截「性別翻轉」。
- **處置**：
  1. **旁白錨點句一律用完整版（含聲線釘定）**：`Narration delivered in a low calm middle-aged male voice, Taiwan-accented Standard Mandarin (台灣腔普通話), read flat at a steady pace, not character dialogue, not on-screen voice, no Cantonese, no English.`（Ch11 及以前的標準版；禁止再精簡成只剩腔調的殘缺版）。
  2. **`speaker_constraints` 加正向性別釘定**：`The narrator is a fixed calm male voice, never female.`（與錨點句雙保險，Q7 雙向鉗制同思維）。
  3. **旁白鏡頭用空景，或明寫路人沉默**：`Action` 若有遠景路人，加 `the distant passersby are silent and never the source of the narration`；最穩＝旁白鏡頭不放可被聲軌認領的人形（Q9 鐵律同源）。
  4. **修正後換新 seed 重跑**；若新 seed 仍翻轉性別，記入黑名單（擴充黑名單語義：不只歪腔，也記「性別翻轉」seed）。
- **原理**：旁白男聲在以往章節是**顯式文字約束**（錨點句內含 `middle-aged male voice`），不是 seed 的隱式保證。移除文字約束後，聲線決定權交還給模型當下的條件組合（參考圖內容、畫面人形、文字、時長、seed），隨時可能翻轉。要長期掛住同一旁白聲線，必須讓「男聲」成為文字層的常數。
- **鐵律**：旁白錨點句**必須含 `low calm middle-aged male voice` 的完整版**，禁止精簡成只剩腔調；旁白鏡頭優先空景（無人形），有人形就要明寫沉默。

### Q13：旁白應為畫外男聲，卻變成「畫面中女性角色在講對白」（旁白→女對白）

- **發生**：story3 `c3_l22`（旁白 10 秒，走廊雙人鏡，Ref-ALICE→Ref-LEO→Ref-CORRIDOR，seed=`311001`）。phase1 `voice=narration`，提示詞標了 `Narration`／`lips sealed`／`Off-screen narration only`，成品卻是**女性對白**（聲線＋口型歸因落到艾莉絲），而非固定旁白男聲。同段 `c3_l19` 亦為「她發現…」視角旁白，同構風險。
- **原因**（Q12 性別翻轉的升級版：不只換女聲，還把旁白**重新分類成角色對白**）：
  1. **主因：旁白文本寫成「畫面女主的認知行為」**。`<d>` 以「艾莉絲看著里歐，突然意識到…」起句；`Action` 同步寫 `Alice studies Leo and the truth lands:…`。模型把「意識到／truth lands」當成**說話行為**，再把聲軌認領給正在「意識到」的那個人→艾莉絲對白。這比 Q12 的「路人認領旁白」更糟：內容本身就在邀請角色發聲。
  2. **`Subject 1`＝唯一前景女性**。refs 順序 Alice 第一；`subject_definitions`／構圖都以她為觀看主體。r2v 聲軌認領偏好 `Subject 1`／畫面主體（Q8／Q9／Q12 同源）；旁白缺強男聲釘定時，認領落到 Alice。
  3. **錨點句違反 Q12 且缺「非對白」釘**：`overall_soundscape` 寫 `calm mature off-screen voice`——有 mature、無 **male**，也無 `not character dialogue, not on-screen voice`。`speaker_constraints` 有 `Off-screen narration only`，但**沒有** `fixed calm male voice, never female`。性別與「非角色對白」兩道鎖都鬆掉。
  4. **次要：`Action` 英文複述與旁白同義**（見 Q14）→ 模型在「旁白／對白」邊界更混亂，易把英文敘事腔實作成角色口播。
- **處置**：
  1. **旁白 `<d>` 改第三人稱事件句，禁止角色視角動詞**：避免「XX看著／她發現／突然意識到／心中明白」。改寫成敘事者口吻，例如「里歐並未陷入感性誘惑；他完成了一次認知反偵察。」／「理性人並非沒有感情；那是對真實的絕對忠誠。」——**不要**以女主名字當主詞帶領整段。
  2. **`Action` 只寫可見動作與表情，不寫內心獨白、不翻譯旁白**：`Alice and Leo stand still in the corridor; neither mouth moves.` 即可；刪除 `the truth lands`／`realizes`／英文寓意句。
  3. **強制 Q12 完整錨點**：`Narration delivered in a low calm middle-aged male voice, …, not character dialogue, not on-screen voice, no Cantonese, no English.`＋`speaker_constraints`：`The narrator is a fixed calm male voice, never female. No on-screen mouth movement from any person.`
  4. **降低女主被認領機率**：旁白鏡可改 Leo 為 `Subject 1`、Alice 遠景／側臉散焦並明寫 `lips sealed, never the source of the narration`；或空景＋物件。
  5. **修正後換新旁白 seed 重跑**（性別／類型翻轉過的 seed 視同黑名單，見 §4.2）。
- **原理**：旁白的「畫外」屬性要同時靠（a）聲線釘定男聲、（b）文本不召喚畫面角色的言語行為、（c）畫面主體不可被聲軌合理認領。三者缺一，模型會把旁白**降級成對白**並綁到最像說話者的人形——通常是 `Subject 1` 的女性。
- **鐵律**：旁白 `<d>`／`Action` **禁止**「角色名＋認知／觀看動詞」開場；旁白錨點必須含 `male`＋`not character dialogue`；女主在旁白鏡不可當唯一可認領聲源。

### Q14：對白中途突然插入英文（Action 英文複述台詞＋逗號半句斷行）

- **發生**：story3 走廊對決段 `c3_l14`／`c3_l15`／`c3_l20`（里歐長對白；`c3_l19` 旁白亦見同類英文滲入）。`<d>` 已標 `[中文]`、`speaker_constraints`／soundscape 含 `never English`／`no English`，成品仍在**中文句中段**竄出英文詞或整段英文。
- **原因**（Q3／Q5 的強化形態：不是借詞本身，而是**平行英文譯稿**＋**半句氣口**）：
  1. **主因：`Action` 用英文近乎全文翻譯 `<d>`**。例：`c3_l14` Action 寫 `Leo answers: beauty needs no pricing, but political mobilization in beauty's name does; he names her regime…`——與中文「美不需要被掛載代價…政治動員…推銷…政體」一一對譯；`c3_l15` 的 `dossier on dissidents`、`c3_l20` 的 `absolute pursuit of complete truth` 同理。TTS 在句內切點對軌失敗時，會從**同義的英文 Action** 抽詞填洞→聽感即「對白講到一半變英文」。
  2. **`<d>` 以逗號收尾行＝語意未完結的氣口**（Q4／Q6 句內切點）。如「但以此為名的政治動員，必須。」／「隱瞞了最重要的一份文件，」——逗號切開後，後半抽象詞（政治動員、異議者、完整真相）附近最容易被 Action 裡的英文對譯接走。
  3. **抽象／政論詞彙放大切點風險**（Q5 借詞的兄弟）：中文詞本身不是英文，但 Action 提供了現成英譯（`political mobilization`／`reverse cognitive reconnaissance`／`complete truth`），模型不必「發明」外文，只需**切換語碼讀旁邊那份譯稿**。
  4. **次要：時長偏長（14–16 秒）＋多行短逗號句**→ 切點數量↑，每次切點都是一次英文化的機會；`never English` 擋的是「意圖說英文」，擋不住「從 Action 抄英文來填氣口」。
- **處置**：
  1. **`Action` 只寫誰在說話、嘴／身體可見動作，禁止複述或翻譯台詞語意**（坐實 Q3／Q5）：`Leo steps closer; only his mouth moves; Alice's lips stay sealed. No split composition.`——刪除一切 `answers:`／`names:`／`closes the exchange:` 後的英文寓意句。
  2. **`<d>` 每行必須是完整語意單元，優先句號收尾**；若必須逗號，同一語意片段不要拆成兩行氣口。抽象詞與後續結論盡量同句，避免「文件，」這種半句懸空。
  3. **英文欄位禁用台詞關鍵英譯**：`summary` 維持名詞片語（已有 §3.6）；`Action`／`Visual style` 不出現與 `<d>` 對得上的英文術語對譯。
  4. **保留** `no English / no code-switching`，但視為必要而非充分；真正斷根是拿掉平行譯稿。
  5. **修正後換新 seed 重跑**。
- **原理**：模型同時看到「中文 `<d>`」與「英文 Action 譯文」時，會把兩者當成同一句的雙語軌道；逗號半句提供切換點，政論抽象詞提供「用英文更省事」的誘因。禁英文的負向句無法刪除正向供給的英文譯稿。
- **鐵律**：`<d>` 是唯一台詞來源；`Action` **零翻譯、零複述**；逗號斷行視為高風險切點，抽象詞附近尤其禁止英文對譯。

---