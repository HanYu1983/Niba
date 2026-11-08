# 視頻提示詞方法 1：純文字驅動 T2V（備圖，預設不綁定）

來源：`dev/Project20/ai_edit_story/mcp_server_guide.md` §4B、`dev/Project20/video_prompt_guide.md` §3.1–§3.4，
加上本專案 `test_story3`（79 格、9:17 成片）的實作結果。

---

## 0. 一句話

**參考圖先做好，但不掛進 prompt；一致性靠「風格鎖 + 角色外觀錨」在每一格逐字重複。**

t2v 是純文字路線：畫面細節、構圖、鏡頭運動由文字決定，模型不看圖，所以不會被某張肖像的
角度與表情「拉回」固定姿勢。代價是——**沒有任何共通錨時，它會自己漂**：同一角色每格換一張臉，
同一部片有的寫實有的動畫。方法 1 的全部紀律，就是在補這個洞。

| | 方法 1（t2v，本文件） | 方法 2（r2v） |
|---|---|---|
| 驅動方式 | 純文字 | 參考圖 `<Picture N>` |
| 參考圖 | 先備好，**預設不掛** | 必掛，進 `refs` |
| 一致性靠 | 每格重複的風格句 + 外觀句 | 參考圖 + `subject_definitions` |
| 構圖自由 | 高 | 低（會被 plate 的取景牽引） |
| 欄位數 | 3 | 6 |

先讀完 §1–§3 再動筆；§4 之後是格式與檢查表。

---

## 1. 為什麼要備圖，卻不綁圖

### 1.1 圖的角色是「外觀基準」，不是「參考輸入」

每個角色／場景先產一張 t2i（一律 Z-Image / `zit`），存進素材庫資料夾，狀態標 `ready`。
它的用途有兩個：

1. **當文字錨點的來源**：那一份 t2i 提示詞就是這個角色的外觀定義。寫 t2v 時沿用同一組特徵詞
   （年齡感、體型、髮型髮色、臉部特徵、族裔），不要另寫一套形容。文字與圖不同源，角色就漂。
2. **當對照與重生的基準**：之後覺得某格「不像他」，可以回頭看基準圖，或重產一張對照，
   而不是憑記憶爭論。

所以素材庫是**全片共用的字典**。字典不必每一句都引用，但每一句的用詞都要跟字典一致。

### 1.2 實務注意：plate 比例 ≠ 成片比例

本專案的 t2i plate 是 16:9（1344×768），成片是 9:16 直式（352×608）。這種情況下
**plate 本來就不該直接綁進 t2v**——綁了只會被模型硬拉成橫式構圖再裁切。
若哪天要改成綁圖（走 r2v），通常得先重產一組符合成片比例的 plate，不能直接沿用。

備圖不綁圖，剛好讓「素材庫比例」與「成片比例」解耦。

### 1.3 什麼時候才把圖綁上去

只有「這一格非鎖死不可」時才綁，例如：

- 連戲硬接：前後兩格是同一個連續動作，臉一歪就露餡。
- 關鍵道具特寫：造型必須與前幾格完全一致（同一張通行證、同一個背包）。
- 已經重跑多次仍漂成別人。

綁圖＝**這一格改走 r2v**，必須同時補齊 `subject_definitions`（`from <Picture N>`）與
`retention_analysis`，否則參考圖與文字會各說各話。這是升級，不是加個欄位。

> 一句話記法：**不綁圖是預設，綁圖是例外，例外要付 r2v 的格式税。**

---

## 2. 三個錨：缺一個就會漂

### 2.1 錨一：風格鎖（必鎖，逐字相同）

t2v 每一格都是獨立抽樣。**沒有共用風格句，整片一定混風格。**
做法：選定一句媒介／質感句，寫在每一格 `integrated_multimodal_description` 的 `[Shot 1]` 最開頭，
**跨格逐字相同**，只在固定的「光線子句」位置換值。

本專案現行版本（可直接照抄，或整組換成你的風格）：

```text
Photorealistic live-action 35mm film, fine grain, natural skin texture, real-world photography,
muted olive and cold grey palette, <light clause>, shallow depth of field, grounded documentary
realism — not anime, not cartoon, not illustration, not cel shading, not an advertisement,
not slow motion, no on-screen text.
```

`<light clause>` 是全片共用的一組有限值，不要臨時發明：

| 情境 | 光線子句 |
|---|---|
| 清晨、陰天、室外 | `flat overcast dawn light` |
| 夜戲、室內實用光源 | `low-key practical night lighting` |
| 霓虹街景 | `muted cold grey palette with pink neon accents` |
| 雨天早晨 | `soft overcast rainy morning light` |
| 暴風雨、災難 | `flat storm-grey daylight` |
| 正午、曝曬 | `harsh flat noon light` |
| 車內（隔玻璃） | `harsh flat noon light through cracked glass` |

規則：

- **負面排除句不可省**。`not anime, not cartoon, not illustration, not cel shading` 是防止
  抽樣漂成動畫的唯一手段；少了它，寫實片裡遲早混進一格賽璐璐。
- **不要混用互相衝突的標籤**。`cinematic` / `stylized` / `anime` / `photorealistic` 同時出現，
  模型會挑一個，每格挑的還不一樣。
- **改稿前先對照上一格**。跨格改風格句是整片重做的等級，不是局部微調。

### 2.2 錨二：角色外觀錨（簡短、可重複、與 plate 同源）

每個角色準備**一句**外觀句，全片重複使用。長度以「一句、約 8–15 個英文詞」為上限。

```text
The contractor (S4), 32, lean and wiry, pale cold face, sharp cheekbones, flat dead eyes,
short black hair tied back tight.
```

三個常見錯誤：

1. **把整張 plate 提示詞貼進來**。`Head-and-shoulders reference photograph of…, plain grey studio
   backdrop, soft key light, sharp focus` 這類攝影棚語彙會把場景一起拖進棚拍。
   → 只取「看得到的生理特徵」，不要取拍攝設定。
2. **每格重新形容**。這格寫 `sharp cheekbones`，下格寫 `high cheekbones`，第三格寫
   `chiselled face`——模型就給你三個人。
3. **靠服裝認人**。服裝會隨劇情換；辨識度要放在臉與體型，服裝是變數不是錨。

服裝的規則：**同一連續段落內自洽；換裝要在描述裡明寫過渡**（`now in a clean field jacket`），
不要靜默換掉。

### 2.3 錨三：場景名詞（同一地點同一個說法）

每個常用場景固定一組名詞，全片沿用：

```text
the safehouse: a weapon crate, gear laid out on a table, a map pinned to the wall,
one bare bulb hanging above
```

不要這格寫 `safehouse`、下格寫 `hideout`、再下格寫 `underground room`；模型會給你三個房間。
**場景漂移比換臉更難察覺，也更難修**，因為觀眾只覺得「怪」但說不出哪裡怪。

---

## 3. 分鏡：一格一檔，一個主要事件

### 3.1 切割單位

**一格 = 一支影片 = 一個檔 = 一段提示詞。** 不要用「章」或「景」當單位，也不要把多個節拍塞進一支。

理由：一支塞太長，某一鏡失誤就得整支重跑；每支一個 seed，出錯只重跑那一支，其他不動；
每支有明確的時間範圍，字幕與合併才有可靠的加總基礎。

切割觸發（滿足其一就切）：

- 時間轉折（`片刻後`、`隔天`）
- 空間切換（走廊 → 辦公室）
- 視覺主體或焦點轉移（人臉 → 桌上的通行證）
- 發聲者改變（對白換人講，通常值得獨立一支）

### 3.2 鏡內 cut

`[Shot N]` 是「同一支影片內的剪接點」，不是「另一支影片」。

- `[Shot 1]` **不寫時間戳**。
- `[Shot 2]` 之後寫 `At MM:SS.mmm`（本專案實作為分:秒.毫秒，例如 `At 00:02.400`），
  **必須嚴格遞增，且落在本支時長內**。
- 只有「新主體／新空間／新狀態／新視角／新時間」才 cut。
  同一個空間裡換個角度、推近一點，用**鏡頭運動**（push / pull / pan / truck / tilt / arc /
  tracking / static），不要 cut。
- 一支 5 秒的片子切 6 刀沒有意義；一個 shot 至少留 1.5–2 秒讓動作發生。

### 3.3 時間＝動作的預算

`At` 的秒數是給剪接用的，也是寫作時的預算表：

- 一句台詞的長度 ≈ 字數 ÷ 6.2 秒（中文、本專案實測語速）。18 字 ≈ 2.9 秒。
- 動作要能在那個秒數內完成。`At 00:01.000` 才開始「走進門、掃視全場、坐下」，做不到。
- **不要在 prompt 裡寫總時長、解析度、寬高比、模型名、版本號**——這些是 API 參數，寫進 prompt
  只會被當成內容。時長只用於內部規劃與 `At` 時間戳。

---

## 4. 三欄位格式（硬性）

必須是這三個欄位、這個順序、這些欄位名。少一個或多一個都會出問題。

```text
integrated_multimodal_description: [Shot 1] … [Shot 2] At MM:SS.mmm, …
overall_soundscape: …
non_diegetic_music: …
```

### 4.1 `integrated_multimodal_description`

寫「畫面 + 對白時間軸」，一段連續英文文字（可以分行，但語意是連續的）。

寫作順序（照這個順序寫，讀起來自然、模型也好抓）：

1. **風格鎖**（§2.1，逐字）
2. **場景**：這是哪裡、有什麼固定物件
3. **主體**：誰／什麼，外觀錨（§2.2）
4. **動作**：可觀察的動作、微表情、狀態轉變
5. **光**：具體的光源與方向（不是「氣氛很好」）
6. **鏡頭**：機位、景別、運動
7. **對白**：`<d>` 區塊（§5）

要寫得**可觀察**：`her jaw stays still around the words` 可以拍，`she feels conflicted` 拍不出來。

### 4.2 `overall_soundscape`

1–4 句英文連續段落。涵蓋：

- 環境底噪（`a bare bulb humming`、`rain on umbrella fabric`）
- 動作聲（`the click of a holster strap`、`gear shifting on the table`）
- 非語言人聲（`a soft exhale`、`one short choked cry`）

**不要重複對白，不要寫配樂。** 配樂在第三欄。真的全靜音寫 `N/A`（罕見）。

### 4.3 `non_diegetic_music`

1–3 句：樂器、節奏、動態發展。無配樂寫 `N/A`。
角色自己聽得到的音樂（車上廣播、店裡放的歌）寫在時間軸內，不是這一欄。

### 4.4 兩個音訊欄位都不可省

**不寫 `overall_soundscape` / `non_diegetic_music`，模型會自己發明旁白或疊不相關的聲音。**
這是實測結論，不是格式潔癖。最省事的寫法是「這一段該有什麼聲音」照實列出來，不要留白。

---

## 5. 對白：`<d>[中文] …</d>`

### 5.1 格式

```text
The contractor (S4) says, flat and cold:
<d>
[中文]
上校，我等你的電話一整天了。
可以出發了嗎？
</d>
```

- 語言標籤固定 `[中文]`，後面逐字寫台詞。
- **一句一行**。每句獨立換行＝TTS 逐句處理，氣口自然。
- **禁止發明或改寫**。台詞的唯一真相來源是 plan 的 `spoken_text`／`lines`，逐字鏡像。
- 角色編號用 `(S1)`、`(S2)`，**依全片出場順序**，跨格一致。旁白、群眾、內心獨白不編號。
- 對白放在它所屬的 shot 內；若剪接橫越一句話，標 `<scenetrans>` 並註明音訊延續。

### 5.2 四原則（會直接改變輸出）

| # | 原則 | 為什麼 |
|---|---|---|
| 1 | `<d>` 外**不要出現任何中文完整句** | 模型會把 `<d>` 外的中文當成可朗讀內容，蓋掉真正的台詞 |
| 2 | 鏡頭描述**不要複述台詞語意**（台詞說「背叛」，描述就別寫 `betrayal`） | 會被抓去唸，或把語氣帶歪 |
| 3 | 中文只存在於 `<d>` 內 | 欄位分工徹底隔離，`<d>` 是唯一發聲來源 |
| 4 | 台詞逐字，每句換行 | TTS 穩定、斷句自然 |

### 5.3 唸得出來的才寫進去

`<d>` 內每個字都會被唸。會被唸錯的一律改寫：

| 寫法 | 實測症狀 | 改成 |
|---|---|---|
| `%` | 唸成「PiFen」 | `百分之二`（禁混寫 `百分之2`） |
| 阿拉伯數字 | 讀法不穩 | `四十五` |
| `「」`、`『』` | 括引本身被唸出怪音 | 直接寫文字，不加引號 |
| 全形冒號 `：` | 句子被攔腰切斷、前段重讀 | 改句號，拆兩句 |
| `——` | 被當成切點 | 改句號或逗號 |
| `&` `#` `@` `*` emoji | 被當成要唸的內容 | 移除 |
| 英文／中英混寫 | 直接唸英文或混雜語言 | 改純中文 |

保留：`……`（多數情況可當氣口，出怪音才改句點）、`，。！？`。

**例外：畫面可見文字**（招牌、電視牆標題、報紙頭條）不會被唸，可以保留原始符號，
但要寫在鏡頭描述裡並標 `visible on-screen text`，且與 `<d>` 分開。
若不想處理，就寫「螢幕上沒有可辨識文字」（`The screen shows no legible text, only shapes and colour.`）
——本專案多數螢幕、招牌都採這個寫法，避免模型自己生出一堆亂碼字。

### 5.4 誰在說話

每個有對白的格子都要交代**誰發聲、誰閉嘴**：

- 對白：`The contractor (S4) says:` + 其他人「嘴唇不動」的狀態寫在動作裡。
- 旁白：`A calm narrator's voice, off-screen, speaks:`，畫面裡的人**不張嘴**。
- 電話另一頭：`her voice through the phone, off-screen`，畫面裡的人閉唇聽。
- 場景格：**完全不寫 `<d>`**。寫了就會有人聲。

---

## 6. 聲音的第二個錨：腔調句

中文聲線會與 seed 耦合出方言腔（實測粵語腔、性別翻轉都發生過）。`[中文]` 改 `[普通話]` 無效。
有效做法是在 `overall_soundscape` **逐字寫一段念腔錨點**，每格都放：

```text
All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.
```

歪腔已經發生時，三點同時下：錨點句 + 負向排除（`never Cantonese / never English / no code-switching`）
+ 換新 seed。

**seed 是聲音的一部分**：固定 seed ＝ 固定腔調。只改文字不改 seed，修正不會生效。
歪腔或性別翻轉的 seed 記進黑名單，別再回頭用。

---

## 7. 寫作順序（不要一次寫完）

依 plan 順序，一格一格來：

1. **回想劇情**：這一段在講什麼、前後發生什麼。
2. **讀 plan 該格**：`voice`（決定音訊寫法）、`duration`（決定 shot 預算）、
   `lines`（`<d>` 的唯一真相）、`source`（原文段落，情緒與細節以此為準）。
3. **讀上一格已寫好的 prompt**：對照風格句、角色外觀句、場景名詞、光線子句。
   **這是防止漂移最有效的一步**——不是重寫，是複製貼上再改。
4. **選路線**：預設 t2v。真的需要鎖死才升 r2v（§1.3）。
5. **寫三欄位**，然後跑 §8 檢查表。

「一次寫完 79 格」幾乎一定斷裂：第 20 格開始角色形容就走鐘，第 50 格風格句就少了一半。
寧可慢，一格對一格。

---

## 8. 產出前自檢清單

**風格**

- [ ] `[Shot 1]` 開頭是完整風格鎖，與上一格**逐字相同**
- [ ] 光線子句取自固定的那組值，沒有臨時發明
- [ ] 負面排除句還在（`not anime, not cartoon, …`）
- [ ] 沒有混入衝突標籤（`anime` / `stylized` / `cinematic` 亂用）

**角色與場景**

- [ ] 角色外觀句與 t2i plate 提示詞同源，且與上一格相同
- [ ] 沒有把 plate 的攝影棚語彙（`studio backdrop`、`soft key light`）帶進場景
- [ ] 場景名詞與前幾格一致（`safehouse` 不會變 `hideout`）
- [ ] 換裝有明寫過渡，不是靜默替換
- [ ] 角色編號 `(S1)(S2)…` 與全片一致

**結構**

- [ ] 一支只有一個主要事件；太長就再拆
- [ ] `[Shot 1]` 無時間戳；後續 `At MM:SS.mmm` 嚴格遞增且在時長內
- [ ] 小角度變化用鏡頭運動，不是 cut
- [ ] 沒有寫模型名、版本、總時長、解析度、寬高比

**對白與聲音**

- [ ] `<d>` 與 plan 台詞逐字一致，未發明、未省略
- [ ] `<d>` 外沒有任何中文完整句
- [ ] 台詞一句一行
- [ ] `%`、數字、引號、全形冒號、`——`、英文都已改寫
- [ ] 有交代誰發聲、誰閉嘴；旁白格畫面裡的人不張嘴
- [ ] 場景格完全沒有 `<d>`
- [ ] `overall_soundscape` 有環境音 + 腔調錨點句，且沒有複述對白
- [ ] `non_diegetic_music` 有寫（或明確 `N/A`）

---

## 9. 與 r2v 的差異（改路線時必看）

| | t2v（方法 1） | r2v（方法 2） |
|---|---|---|
| 欄位 | 3 欄 | 6 欄 |
| 角色指稱 | `(S1)`、`(S2)` | `<Subject 1>` |
| 參考圖 | 不掛 | `refs`，`<Picture N>` |
| 必備欄位 | — | `subject_definitions`、`summary`、`retention_analysis` |
| `summary` | 無此欄 | 只寫英文名詞片語，不寫中文完整句、不含台詞關鍵字 |
| 一致性來源 | 文字重複錨點 | 參考圖 + `retention_analysis` |
| 構圖自由 | 高 | 低 |

**t2v 沒有** `subject_definitions`、`<Picture N>`、`retention_analysis`、`summary`。
把 r2v 的欄位習慣抄進 t2v，模型會試著解讀不存在的指涉。

**反向也一樣**：某格補上 `refs` 之後，它就不再是 t2v 了，必須同時補齊 r2v 的六欄位，
否則參考圖與文字會脫節，漂得更明顯。

---

## 10. 可複製模板

### 10.1 對白格

```text
integrated_multimodal_description: [Shot 1] <風格鎖> <場景 + 固定物件>. <主體 (S1), 外觀錨> <動作、微表情>. <光源與方向>. The camera <機位/景別/運動>. <角色> says, <語氣>:
<d>
[中文]
第一句台詞。
第二句台詞。
</d>

[Shot 2] At MM:SS.mmm, the camera cuts to <景別> of <主體>. <動作/反應>. The camera <運動>. <角色> says:
<d>
[中文]
台詞。
</d>

overall_soundscape: <環境底噪>, <動作聲>, <非語言人聲>. All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music: <樂器、節奏、動態>.
```

### 10.2 場景格（無對白）

```text
integrated_multimodal_description: [Shot 1] <風格鎖> <場景>. <主體/物件> <動作>. <光>. The camera <運動>, <收在什麼畫面>.

overall_soundscape: <環境音>、<動作聲>。No dialogue.

non_diegetic_music: <配樂> 或 N/A
```

### 10.3 縮短實例（改編自本專案 `seg_017`）

```text
integrated_multimodal_description: [Shot 1] Photorealistic live-action 35mm film, fine grain, natural skin texture, real-world photography, muted olive and cold grey palette, low-key practical night lighting, shallow depth of field, grounded documentary realism — not anime, not cartoon, not illustration, not cel shading, not an advertisement, not slow motion, no on-screen text. A dim safehouse: a weapon crate, gear laid out on a table, a map pinned to the wall, one bare bulb above. The contractor (S4), 32, lean and wiry, pale cold face, sharp cheekbones, flat dead eyes, short black hair tied back tight, black tactical top, stands at the table with a phone at her ear, her free hand checking a holster strap. Her head is tilted slightly, listening. The bulb throws hard shadows down her cheekbones. The camera holds static in a medium shot. The contractor (S4) says, flat and cold:
<d>
[中文]
上校，我等你的電話一整天了。
</d>

[Shot 2] At 00:02.400, the camera cuts to a close-up of her face in three-quarter profile, one eye lit by the bulb and the other lost in shadow. She does not blink, and her jaw stays still around the words. The camera holds static. The contractor (S4) says:
<d>
[中文]
可以出發了嗎？
</d>

overall_soundscape: A bare bulb humming, the click of a holster strap, gear shifting on the table, the distant murmur of a night street through thin walls, and her low, level voice close to the phone. All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music: A sparse metallic pulse, like a struck rod, marking time under her voice and stopping on the question.
```

---

## 11. 一頁摘要

1. t2i 先做好，**預設不掛**；素材庫是外觀字典，不是輸入。
2. **風格鎖**逐字寫在每個 `[Shot 1]` 開頭，負面排除句不可省。
3. **角色外觀句**簡短、與 plate 同源、跨格相同；服裝可換但要寫過渡。
4. **場景名詞**固定，不要同義詞輪替。
5. 三欄位：畫面時間軸 / 環境音 + 腔調句 / 配樂，**兩個音訊欄位都不可省**。
6. 台詞逐字進 `<d>[中文]`，一句一行，`<d>` 外不寫中文完整句。
7. `[Shot 1]` 無時間戳，後續 `At MM:SS.mmm` 遞增；小幅變化用鏡頭運動不用 cut。
8. 一格一支、一個主要事件；**不要一次寫完所有格**，每格對照上一格。
9. 要綁圖就整格升級成 r2v（六欄位），不要半套。
