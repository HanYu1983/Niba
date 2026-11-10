# 視頻提示詞方法 1：純文字驅動 T2V（備圖，預設不綁定）

來源：`dev/Project20/ai_edit_story/mcp_server_guide.md` §4B、`dev/Project20/video_prompt_guide.md` §3.1–§3.4，
加上本專案 `test_story3`（79 格、9:17 成片）的實作結果，以及 `workspace/IDEA.md` 的三條現場觀察
（角色指稱、純色 plate 的背景注意力、plan 階段的發聲分類）。

---

## 0. 一句話

**參考圖先做好，但不掛進 prompt；一致性靠「風格鎖 + 角色特徵錨 + 場景錨」逐字重複。
背景要進畫面，靠前置與景別；誰在說話，plan 階段就要分清楚。**

t2v 是純文字路線：畫面細節、構圖、鏡頭運動由文字決定，模型不看圖，所以不會被某張肖像的
角度與表情「拉回」固定姿勢。代價是——**沒有任何共通錨時，它會自己漂**：同一角色每格換一張臉，
同一部片有的寫實有的動畫。方法 1 的全部紀律，就是在補這個洞。

本版新增三條（§2.2、§2.4、§5.5）：

1. 角色**不寫名字**，只寫「職能 (S1) + 從 plate 抽出的生理特徵」，特徵順序固定。
2. 純色背景的 plate 會讓模型把場景吃掉；背景必須**前置、給畫幅、與人物發生接觸**。
3. 對白／旁白／**內心獨白**要在 plan 就分開，內心的聲線跟著 POV 角色的性別與年齡。

| | 方法 1（t2v，本文件） | 方法 2（r2v） |
|---|---|---|
| 驅動方式 | 純文字 | 參考圖 `<Picture N>` |
| 參考圖 | 先備好，**預設不掛** | 必掛，進 `refs` |
| 一致性靠 | 每格重複的風格句 + 特徵句 | 參考圖 + `subject_definitions` |
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

## 2. 三個錨：缺一個就會漂（＋§2.4 背景補丁）

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

### 2.2 錨二：角色特徵錨（不寫名字，8–15 詞，與 plate 同源）

**名字不要進 prompt。** 模型不認識你的角色，名字只是佔位符；更糟的是名字有字面意義時，
模型會照字面畫。`桃` 會多一顆桃子，`白` 會多一片白。音譯名更危險——`泰洛伊` 這種拼法會把
東亞臉拉成西方臉，直接跟 plate 打架；`大姑娘` 這種別名則會被畫成一個大姑娘。
角色一律用「職能＋編號」指稱（`the woman (S1)`、`the contractor (S4)`），
辨識度全部放在後面的特徵句。

每個角色準備**一句**特徵句，全片重複使用。長度以「一句、約 8–15 個英文詞」為上限。

```text
The contractor (S4), 32, lean and wiry, pale cold face, sharp cheekbones, flat dead eyes,
short black hair tied back tight.
```

**特徵怎麼抽。** 從角色 plate 的 t2i 提示詞裡，只取「看得到的生理特徵」，排成固定順序：

| 抽這些 | 丟掉這些 |
|---|---|
| 性別、年齡感、族裔／膚色、臉型、髮長髮色髮型、體型、一個辨識點（疤、痣、眼型） | 鏡頭、景別、機位、光線、背景、姿勢、表情、解析度、`sharp focus` |

順序固定，跨格不換位（換位＝模型重新分配注意力）：

```text
the woman (S1), mid-20s, East Asian, sun-tanned, athletic and lean, strong jaw,
sharp dark eyes, high black ponytail.
```

以本專案 `char_taylor` 為例：plate 裡該留的是
`25-year-old East Asian woman, athletic and lean, high black ponytail, sharp dark eyes,
strong jaw, sun-tanned skin`；`head-and-shoulders framing, plain grey backdrop, soft key light,
sharp focus` 一個字都不要帶進場景。

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

### 2.4 純色 plate 的副作用：背景會被吃掉

角色 plate 是「半身、置中、純色背景、柔光」的攝影棚肖像。它不掛進 t2v，但它的**構圖慣性**
會留在你寫的特徵句裡；而純文字路線的注意力順序是「先寫的權重高」，所以主體句越長、越前面，
背景就越容易被壓成一片牆或整片散景。走 r2v 綁圖時更直接——那塊純色背景會真的被吸進畫面。

要讓模型把注意力分給背景，三件事一起做：

**1. 背景前置（front-loading）**
場景句放在風格鎖之後、主體之前，而且要用具體名詞，不要用形容詞堆氣氛：

```text
<風格鎖> The riverside embankment at harsh noon: gravel and dry grass, a dense green tree line
on one side, the wide canal on the other, hard short shadows and no shelter.
<主體錨> …
```

地名 ＋ 2–3 個固定物件 ＋ 一個深度線索（`the tree line recedes into haze`、`the canal widens
toward the bridge`）。模型處理文本前段的權重最高，這段要搶在人物之前。

**2. 給背景畫幅（camera framing）**
背景重要時，不要用 `tight close-up`、`holds tight on both faces`、`pushes in on her face`——
那等於直接叫模型刪背景。改成 `a wide-to-medium profile shot`、`a medium shot with the canal
filling the left third`；真的需要特寫，就把環境留在過肩或景深裡：
`past her shoulder, the grey canal water stays sharp`。

**3. 讓人與環境接觸，並共用同一道光**
人物要「碰到」場景，光要同時落在人與背景上：

```text
her boots sink into the wet gravel; under the open, shelterless sky, the same harsh noon light
falls across her shoulders and the cracked bank behind her
```

`under the open, shelterless sky` 這類句子是在強制模型把光源作用到整個空間，而不是只打在人臉上。

| 症狀 | 原因 | 修法 |
|---|---|---|
| 背景變成一堵灰牆、或整片糊掉 | 主體句在前，背景只有一個地名 | 背景前置，補 2–3 個物件與深度線索 |
| 背景整個不見，只剩臉 | `tight close-up`、`holds tight on both faces` | 改 wide-to-medium；特寫留過肩或景深 |
| 人像剪貼在背景上 | 人與環境沒有接觸，光只打在人身上 | 加接觸動作＋共用光源句 |
| 背景有東西，但每格都不一樣 | 場景名詞輪替 | 固定名詞組（§2.3） |

本專案已標記的案例（`test_story3` ch1 的 024、028、029、032、044、052、053、059）都是同一種病：
背景句其實寫了，但鏡頭是 `holds tight on both faces` 或 `pushes in`，背景沒有畫幅。
**背景句不是護身符，景別才是。**

> 一句話記法：**背景要進畫面，先進句子；要留在畫面，鏡頭得讓位。**

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
2. **場景**：這是哪裡、有什麼固定物件；背景前置（§2.4），一定排在主體前面
3. **主體**：誰／什麼，特徵錨（§2.2），用「職能 (S1)」不寫名字
4. **動作**：可觀察的動作、微表情、狀態轉變
5. **光**：具體的光源與方向（不是「氣氛很好」）
6. **鏡頭**：機位、景別、運動
7. **對白**：`<d>` 區塊（§5）

場景排在主體前面不是文筆問題，是注意力順序：寫在後面的背景，模型通常不會畫。

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
- 旁白：`A single narrator's voice, off-screen, low and even, the same voice throughout the film, speaks:`，畫面裡的人**不張嘴**。
- 內心獨白：`Taylor's inner voice, close and dry, a young woman's voice inside her own head, her lips do not move:`（§5.5）。
- 電話另一頭：`her voice through the phone, off-screen`，畫面裡的人閉唇聽。
- 場景格：**完全不寫 `<d>`**。寫了就會有人聲。

### 5.5 四種發聲：對白、旁白、內心、無聲

小說的「旁白」常常不是旁白。先把每一格的發聲類型釘死，再寫 prompt；寫完再回頭猜，
一定錯，因為聲音是 TTS 參數，不是文字修辭。

| 類型 | plan `kind` | 聲音屬於誰 | 畫面人物動嘴 | prompt 句式 |
|---|---|---|---|---|
| 對白 | `dialogue` | 畫面中的角色 | 是 | `Taylor (S1) says, …:` |
| 旁白 | `narration` | 全片同一個旁白 | 否 | `A single narrator's voice, off-screen, …, speaks:` |
| 內心 | `inner` | 該格 POV 角色的內心 | 否 | `Taylor's inner voice, …, her lips do not move:` |
| 無聲 | `scene` / `action` | 沒有人聲 | 否 | 不寫 `<d>` |

**plan 階段就要分。** 每格建議帶：

```json
"voice": {
  "kind": "inner",          // dialogue | narration | inner | scene
  "speaker": "char_taylor", // inner 時是 POV，不是發話者
  "pov": "char_taylor",
  "gender": "female",       // 聲線跟著角色，不跟旁白
  "age": "mid 20s",
  "timbre": "low, close, slightly hoarse"
}
```

`kind` 只准這四個值。`narration` 的 speaker 全片固定；`inner` 的 speaker 必須等於該格的主體
（或明確的 POV 角色），性別、年齡也必須跟角色一致。

**小說裡怎麼分。** 六個判準：

| 判準 | 對白 | 旁白 | 內心 |
|---|---|---|---|
| 引號／說話動詞 | 有 | 無 | 無 |
| 人稱 | 第一／第二 | 第三 | 第一，或貼近角色的第三 |
| 攝影機拍得到嗎 | 拍得到（嘴在動） | 拍得到的事實 | **拍不到** |
| 感知動詞（覺得、想、知道、發現、聽見） | 少 | 少 | 多 |
| 評價、猶豫、反問 | 有 | 無 | 有 |
| 跨角色通用嗎 | — | 是，全片一致 | 否，綁 POV |

最實用的一條是第三個判準：**「這句話攝影機拍得到嗎？」**
`她瞬間明白了一切` 拍不到 → 內心；`雨落在她肩上` 拍得到 → 旁白。
自由間接引語（第三人稱、卻是角色的主觀判斷）一律判給內心，POV 給那個角色。

**本專案的實例。** `test_story3` ch1 的 054、056、066 原文是第一人稱身體感受
（「震得她腦袋嗡嗡作響」「泰洛伊瞬間明白了一切」），plan 標成 `narration`，
prompt 寫 `A calm narrator's voice`，結果用一把中性旁白唸角色的痛覺——視角與性別都不對。
正確是 `inner`，POV 與聲線都綁 Taylor。

**三個禁令：**

1. **旁白句跨格逐字相同。** `calm` / `low` / `warm` 輪替＝換人唸；旁白只能有一把聲音。
2. **內心獨白不可用異性的聲音。** 聲線描述要跟 POV 角色的性別、年齡一致；`a young woman's
   voice inside her own head` 這種話要寫出來，不要只寫 `inner voice`。
3. **內心獨白不可讓畫面人物動嘴。** 動作句要明寫 `her lips do not move`／`her jaw stays still`。

**聽感也要分開：** 內心獨白乾、近、沒有空間殘響（`close and dry, no room reverb`）；
旁白可以帶一點空間感。文字像的時候，靠這句把兩者推開。

同一格不要混兩種發聲。真要在一格裡換，就拆 shot 或拆句，各自標清楚。

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
2. **讀 plan 該格**：`voice.kind`／`pov`（是對白、旁白、內心還是無聲；聲線跟著誰）、
   `duration`（決定 shot 預算）、`lines`（`<d>` 的唯一真相）、`source`（原文段落，情緒與細節以此為準）。
3. **定三個錨**：角色特徵句（職能＋生理特徵，不寫名字）、場景名詞＋背景句、光線子句。
   背景句要在主體句之前；背景重要的格子先決定景別。
4. **讀上一格已寫好的 prompt**：對照風格句、特徵句、場景名詞、光線子句、旁白句。
   **這是防止漂移最有效的一步**——不是重寫，是複製貼上再改。
5. **選路線**：預設 t2v。真的需要鎖死才升 r2v（§1.3）。
6. **寫三欄位**，然後跑 §8 檢查表。

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

- [ ] 全程沒有出現角色本名或別名；指稱是「職能 (S1)」
- [ ] 特徵句只含生理特徵，順序與上一格相同
- [ ] 特徵句與 t2i plate 提示詞同源，且與上一格相同
- [ ] 沒有把 plate 的攝影棚語彙（`studio backdrop`、`soft key light`）帶進場景
- [ ] 場景名詞與前幾格一致（`safehouse` 不會變 `hideout`）
- [ ] 背景句在主體之前，且有 2–3 個具體物件與一個深度線索
- [ ] 背景重要的格子不是 `tight close-up`；鏡頭有給背景畫幅
- [ ] 人物有與環境接觸的動作，光線同時落在人與背景
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
- [ ] plan 的 `voice.kind` 與 prompt 句式一致（dialogue / narration / inner / scene）
- [ ] 內心獨白綁對 POV，聲線性別、年齡與角色一致，畫面人物不張嘴
- [ ] 旁白句跨格逐字相同，沒有換形容詞
- [ ] 一格沒有混用兩種發聲
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
integrated_multimodal_description: [Shot 1] <風格鎖> <場景 + 固定物件>. <主體 (S1), 特徵錨> <動作、微表情>. <光源與方向>. The camera <機位/景別/運動>. <角色> says, <語氣>:
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
integrated_multimodal_description: [Shot 1] <風格鎖> <場景：地名、2–3 個固定物件、深度線索>. <主體/物件> <動作>. <同一道光落在什麼與什麼上>. The camera <wide-to-medium 或運動>, <收在什麼畫面>.

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

### 10.4 內心獨白格

```text
integrated_multimodal_description: [Shot 1] <風格鎖> <場景：地名、固定物件、深度線索>. <主體 (S1) 特徵錨> <動作，嘴唇閉著、下顎不動>. <同一道光落在人與背景>. The camera <景別/運動>. <角色> 的內心獨白，聲線綁 POV：
<d>
[中文]
第一句。
第二句。
</d>

overall_soundscape: <環境音>, <呼吸/心跳>. No narrator. All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music: <配樂> 或 N/A
```

實例（改寫自本專案 `seg_054`：原文是 Taylor 的第一人稱感受，不是旁白）：

```text
integrated_multimodal_description: [Shot 1] Photorealistic live-action 35mm film, fine grain, natural skin texture, real-world photography, muted olive and cold grey palette, harsh flat noon light, shallow depth of field, grounded documentary realism — not anime, not cartoon, not illustration, not cel shading, not an advertisement, not slow motion, no on-screen text. The riverside embankment at harsh noon: gravel and dry grass, a dense green tree line on one side, the wide canal on the other, hard short shadows and no shelter. The woman (S1), mid-20s, East Asian, sun-tanned, athletic and lean, strong jaw, sharp dark eyes, high black ponytail, stands still with blood drying at her temple, her lips closed and her jaw tight. The same harsh noon light falls across her shoulders and the cracked bank behind her. The camera holds a medium shot from the side, the canal filling the left third. Taylor's inner voice, close and dry, a young woman's voice inside her own head, her lips do not move:
<d>
[中文]
雙耳在瞬間接收了爆炸般的訊息量。
震得她腦袋嗡嗡作響。
</d>

overall_soundscape: Her slow breath, water lapping at the bank, wind through dry grass, a high ringing tone just under everything. No narrator. All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.

non_diegetic_music: A single low held note, no rhythm.
```

### 10.5 背景優先格（背景是敘事主體時）

```text
integrated_multimodal_description: [Shot 1] <風格鎖> <地點：地名、2–3 個固定物件、一個深度線索>. <主體 (S1) 特徵錨> <與環境接觸的動作：踩進、扶著、穿過、被風吹動>. <同一道光同時落在人與背景>. The camera holds a wide-to-medium shot, <背景佔哪一側>, <運動>.
```

規則：背景句只留名詞，刪掉形容詞；一個句子塞超過三個物件，模型會只畫第一個。

---

## 11. 一頁摘要

1. t2i 先做好，**預設不掛**；素材庫是外觀字典，不是輸入。
2. **風格鎖**逐字寫在每個 `[Shot 1]` 開頭，負面排除句不可省。
3. **角色特徵句**簡短、與 plate 同源、跨格相同；**不寫名字**，用「職能 (S1) + 生理特徵」。
4. **場景名詞**固定，不要同義詞輪替。
5. 三欄位：畫面時間軸 / 環境音 + 腔調句 / 配樂，**兩個音訊欄位都不可省**。
6. 台詞逐字進 `<d>[中文]`，一句一行，`<d>` 外不寫中文完整句。
7. `[Shot 1]` 無時間戳，後續 `At MM:SS.mmm` 遞增；小幅變化用鏡頭運動不用 cut。
8. 一格一支、一個主要事件；**不要一次寫完所有格**，每格對照上一格。
9. 要綁圖就整格升級成 r2v（六欄位），不要半套。
10. **背景要進畫面**：背景句前置、景別給畫幅、人物與環境接觸並共用一道光。`holds tight on both faces` 就是叫模型刪背景。
11. **發聲在 plan 就分四類**：dialogue / narration / inner / scene。旁白全片同一把聲音；內心綁 POV 的性別與年齡，而且畫面人物不張嘴。
12. 小說判 inner 與 narration 只用一句話：**「這句話攝影機拍得到嗎？」** 拍不到的就是內心。
