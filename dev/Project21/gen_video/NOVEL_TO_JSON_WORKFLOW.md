# 小說 → 分鏡 JSON：兩階段工作流

本文件說明如何把一篇小說（或其中一章）轉成可編譯的分鏡 JSON。流程刻意拆成兩個**互不回頭**的階段：

| 階段 | 輸入 | 產出 | 誰在做 |
|---|---|---|---|
| 一、規劃 | 小說原文 | `plan.<chapter>.json` | 讀完全文，做實體盤點與段落切分，並為每段指定場景參考 |
| 二、生成 | **只有** `plan.json` | `<chapter>.json`（entities + blocks） | 逐段寫巢狀 JSON，不再讀小說 |

第一階段只做「規劃」，**不寫任何提示詞**；第二階段只做「生成」，**不需要再讀原文**。兩階段之間唯一的契約就是 `plan.json`，所以它必須自足：任何第二階段需要的資訊，都必須在第一階段就寫進去。

> **生成端是 r2v（reference-to-video）**：每次生成至少要吃一張參考圖。所以 plan 階段除了文字，還要指定**每個段落至少一個場景參考**（見 1.4）。沒有參考的段落，模型只能自由發明空間，同一個場景在相鄰鏡頭之間就會漂移。

---

## 0. 為什麼要拆兩階段

* **可驗證**：`plan.json` 的 `source` 是原文的逐字切片，能併回完整小說，段落有沒有漏、有沒有重疊一眼可查。
* **可重跑**：段落切錯，只重跑第一階段；某段畫面不滿意，只重跑該段，不必重讀三萬字。
* **可分工**：規劃是「讀懂故事」，生成是「寫鏡頭」，兩件事的注意力完全不同，混在一起容易漏角色、漏道具、漏指涉。
* **可除錯**：時長不合理、指涉斷鏈、角色沒定義，都會在 `plan.json` 就暴露，而不是等到影片生成才發現。

---

# 第一階段：`plan.<chapter>.json`

## 1.1 檔案骨架

```json
{
  "version": "1.0",
  "stage": "plan",
  "project_title": "Chapter_04_The_Addiction_of_Guilt",
  "source": {
    "file": "ch1_microdust.md",
    "chapter": 4,
    "chars": 38210,
    "sha256": "…",
    "eol": "lf"
  },
  "entities": {
    "characters": [],
    "props": [],
    "locations": []
  },
  "segments": []
}
```

`source.chars` 與 `source.sha256` 是完整性憑證：第二階段或編譯器可以用它們確認 `segments` 沒有被改壞。

## 1.2 實體盤點（entities）

先把全章讀完，再列出**會反覆出現**的角色、關鍵物品、場景。原則是「單一真理來源」：

* **characters**：只寫**恆定生理特徵**（年齡、臉型、髮型、身形、氣質）。**不要寫服裝**——服裝屬於某個段落當下的狀態，第二階段才決定。
* **props**：貫穿劇情的物件（判決書、匯款明細、凶器）。寫外觀，不寫它在哪個鏡頭出現。
* **locations**：固定空間特徵（法庭、深夜辦公室、偏遠分院）。
* **每個實體附一張 `reference`**：r2v 的參考圖就是靠這張，所以圖要跟著實體走，不要每段各生一張。
* **`reference.image` 填資料夾，不是檔名**：ComfyUI 出圖時自己命名（`ComfyUI_00007_.png` 之類），你沒辦法指定，所以一個實體一個資料夾（`refs/<entity_id>`），只記「圖會落在哪」。

```json
{
  "characters": [
    {
      "id": "char_judge_xu",
      "name": "許法官 (Judge Xu)",
      "aliases": ["許法官", "他"],
      "traits": "Late 50s, sharp jawline, tired observant eyes, slicked-back black hair with silver temples, slender, stoic",
      "first_seen": "seg_001",
      "reference": {
        "image": "refs/char_judge_xu",
        "status": "ready",
        "prompt": "Neutral front-facing portrait, East Asian man in his late fifties, sharp jawline, tired observant eyes, slicked-back black hair with silver temples, plain grey backdrop, no text"
      }
    }
  ],
  "props": [
    {
      "id": "prop_bank_statement",
      "name": "海外帳戶匯款明細",
      "aliases": ["匯款單", "帳戶明細"],
      "traits": "Printed offshore transfer record, dense timestamp columns, one row circled in red ink",
      "first_seen": "seg_004",
      "reference": {
        "image": "refs/prop_bank_statement",
        "status": "to_generate",
        "prompt": "Top-down photo of a printed offshore bank transfer record, dense timestamp columns, one row circled in red ink, on a dark desk, no readable personal data"
      }
    }
  ],
  "locations": [
    {
      "id": "loc_courtroom",
      "name": "肅穆法庭",
      "aliases": ["法庭", "審判席"],
      "traits": "Tall dark wooden bench, empty gallery, cold overhead light",
      "first_seen": "seg_001",
      "reference": {
        "image": "refs/loc_courtroom",
        "status": "ready",
        "prompt": "Wide establishing plate of an empty Taiwanese courtroom, tall dark wooden bench, empty public gallery, cold overhead light, green-shaded clerk desks, 35mm film grain, 16:9, no people, no text"
      }
    }
  ]
}
```

`reference.image` 是**相對於 plan.json 的資料夾**（`refs/char_judge_xu`），整個 `refs/` 跟著 plan 一起搬就好。資料夾裡有什麼檔名不重要——ComfyUI 產完直接丟進去，下游取最新一張（或多張）當參考。

**絕對路徑不寫進 JSON**：ComfyUI 的輸出資料夾是機器設定，放在 MCP server 的 `metadata.json`（`comfyui.output_dir`，用 `metadata_set` 設定）。`entity_prompt` 會把它和 `reference.image` 接起來，回報 `image_dir`；JSON 保持可攜。

`reference.status` 只有兩種：`ready`（資料夾裡已經有圖）與 `to_generate`（第二階段前要先產）。`to_generate` 才需要 `prompt`；寫「空景、無人物、無文字」，避免參考圖自帶角色或字幕。

`aliases` 是給第二階段用的：段落裡只寫「他」或「匯款單」時，才對得回實體。`first_seen` 讓你知道這個實體最晚在哪一段之前必須定義完。

## 1.3 段落切分（segments）

### 切分依據：指南第一章 1.2

滿足任一條就切新段落：

1. **時間轉折**：宣判日 → 數年後。
2. **空間切換**：法庭 → 深夜辦公室 → 偏遠分院。
3. **視覺焦點／主體變換**：從「法官的臉」切到「桌上的匯款明細」。

### 再切一層：指南第二章 2.2

即使時空沒變，只要**發聲模式、說話者、心理意圖**改變，仍必須切開。例如同一間辦公室裡：

* 法官發現時間差（無聲、純視覺）→ 一段
* 法官在鏡子前自我厭惡（內心獨白）→ 另一段

**切點落在段落邊界。** 一個 segment 就是一個「敘事節拍」：小說的一個段落、或一個明顯換氣的地方。一章通常切成 10–20 段，長度不必剛好 5–7 秒——段落比 7 秒長時，用 `render_blocks`（見 1.7）告訴第二階段這一段要拆成幾個鏡頭。硬把長段落壓成一個 7 秒鏡頭，只會讓旁白唸不完。

### `split_reason` 只能是這幾種

| 值 | 意思 |
|---|---|
| `chapter_start` | 章節的第一段（開場定位） |
| `paragraph_break` | 同一時空下的一般換段（敘事節拍改變） |
| `time_shift` | 時間改變 |
| `location_change` | 地點改變 |
| `focus_change` | 視覺焦點或主體改變 |
| `voice_change` | 發聲模式／說話者／意圖改變 |
| `duration_split` | 同一段台詞太長，且中間有明顯停頓，值得切成兩個 segment |

## 1.4 參考圖：r2v 的硬需求

生成端是 **r2v（reference-to-video）**：每次生成至少吃一張參考圖，模型用它鎖定空間、光線與長相。文字提示只能描述「大概長怎樣」，參考圖才能固定「就是這一個空間、這一張臉」。

所以 plan 有兩條硬規則：

1. **每個 segment 至少要有一個 `role: "scene"` 的參考**，指向 `entities.locations` 的場景。
2. **畫面上出現的每個角色**都要有 `role: "character"` 的參考，且整章共用同一個資料夾（`reference.image` 同一個 `refs/<entity_id>`）。

段落只記「這一段用哪幾張、怎麼取景」，圖本身留在實體上：

```json
"reference_images": [
  { "role": "scene", "ref": "loc_judge_office_night", "note": "wide plate, the banker's lamp is the only light" },
  { "role": "character", "ref": "char_judge_xu", "note": "same identity plate as seg_001" }
]
```

規則：

* `reference_images[0]` **必須是 `scene`**。
* `ref` 必須存在於 `entities`，且型別對得上：`scene` → `locations`、`character` → `characters`、`prop` → `props`。
* 第二階段的 block 會把 `ref` 換成該實體的 `reference.image`，也就是那個**資料夾**——不要在段落裡另外寫檔名。
* 一個 block 建議 1–3 張：場景必備，主講者次之，其他角色最後。超過模型上限時，砍角色不砍場景。
* **沒有實體場景的段落**（新聞蒙太奇、純字卡、抽象閃回）一樣要有 scene 參考：在 `entities.locations` 建一個抽象場景（例如 `loc_news_montage`），參考圖可以是一張空的新聞畫面質感板。
* `note` 寫這一段的取景需求（低角度、只拍桌面、逆光），不要重複 `action.description`——那是第二階段的事。

**順位永遠是「場景 → 主講者 → 其他角色」**：場景錯，後面每個鏡頭都錯；人物錯，只錯一張臉。

要逐張產圖時，用 MCP 工具 `entity_prompt`（`{ project_file, entity_id }`）取該實體的提示詞：

* `prompt_source: "reference"` 表示用的是 `reference.prompt`，也就是當初產出這張圖的字串；其他值（`identity_features` / `traits` / `appearance` / `description`）表示是臨時推導的，記得回填成 `reference.prompt`。
* `image_dir` 是實際要產圖／放圖的**絕對資料夾**（`comfyui.output_dir` + `reference.image`，`image_dir_source` 會說是 `metadata`、`project` 還是 `absolute`），直接把這個路徑交給 ComfyUI。
* `reference.images` 是那個資料夾裡實際存在的圖檔（新到舊），`image_exists` 就是「有沒有至少一張」。`status: "to_generate"` 但 `images: []`，就是還沒產。檔名不用管，ComfyUI 自己取的。

## 1.5 `source` 完整性（必須能併回原文）

每一段都必須帶**逐字原文切片**與字元位移：

```json
{
  "id": "seg_004",
  "order": 4,
  "source_start": 2410,
  "source_end": 2864,
  "source": "然而，當他深夜反覆翻看那份海外帳戶的匯款單時……（逐字原文）"
}
```

規則：

* `source` 必須是原文的**完全一致**子字串，不改字、不加省略號、不翻譯。
* `segments` 依 `order` 串接後，`join("")` 必須**等於原文全章**（或你宣告的章節範圍）。
* 位移規則：`source_end - source_start === source.length`，且 `segments[i].source_end === segments[i+1].source_start`。
* 切點落在句子或段落邊界，不要切在半句話中間；若真的必須切（`duration_split`），寧可讓前後段共用一句的完整子句。

驗證（第二階段開跑前必做）：

```js
const joined = plan.segments.map((s) => s.source).join("");
if (joined !== originalChapter) throw new Error("segments do not reassemble the chapter");
if (sha256(joined) !== plan.source.sha256) throw new Error("hash mismatch");
```

## 1.6 段落類型（`kind`）

每段必須標記三種之一：

| `kind` | 定義 | 典型畫面 |
|---|---|---|
| `dialogue` | 角色在畫面上說話 | 宣判、咆哮、對話 |
| `narration` | 旁白敘事（非畫面角色發聲） | 背景交代、時序過場 |
| `action` | 無台詞的動作／純視覺 | 翻卷宗、發現時間差、鏡前崩潰 |

`dialogue`／`narration` 必須再記 `spoken_text`：**這一段會被唸出來的全部文字**（只記唸出來的部分，動作描述不算）。`action` 的 `spoken_text` 固定為 `null`。

> 內心獨白、回想中的台詞都歸在 `narration` 或 `dialogue`（依段落主體是「只有聲音」還是「畫面中有人說話」），再用 `voice_intent` 區分實際發聲方式；`kind` 只回答「這段有沒有台詞」。

另外建議記 `voice_intent`，讓第二階段知道聲音往哪裡放：

* `spoken_on_screen`：現場對白（對嘴），含獨自一人在房裡出聲說話
* `internal_monologue`：內心獨白（閉唇）
* `remembered_voice`：閃回／回想中的他人台詞（畫面可能是回憶，不對嘴）
* `narrator`：客觀旁白
* `none`：純動作

判斷內在還是出聲，看原文的書寫慣例。本專案的小說用：

* `*「…」*`（斜體＋引號）→ 內心獨白
* `「…」`（一般引號，常伴隨「輕聲說」「笑了」等動作）→ 出聲對白
* 敘述句轉述「他心想」「他覺得」→ 純視覺或旁白，由你決定要不要配音

## 1.7 用字數推估時長

只數**中文字與英數字**，標點與空白不計。

```
estimated_sec = max( 5 , ceil(char_count / rate) + 1 )
render_blocks = ceil(estimated_sec / 7)
```

| `voice_intent` | `rate`（字／秒） | 說明 |
|---|---|---|
| `spoken_on_screen` | 5.0 | 一般語速 |
| `spoken_on_screen`（咆哮／情緒） | 4.5 | 情緒拉長 |
| `remembered_voice` | 4.5 | 回想中的台詞，略慢 |
| `internal_monologue` | 4.0 | 獨白較慢、有停頓 |
| `narrator` | 5.0 | 旁白穩定 |
| `none`（action） | — | 以「動作節拍」估，1 拍 ≈ 5 秒，上限 6 |

`estimated_sec` 是**這一段實際需要幾秒**，不是鏡頭長度。單一鏡頭上限 7 秒，所以用 `render_blocks = ceil(estimated_sec / 7)` 表示第二階段要把這段話拆成幾個 block 才唸得完（`action` 段固定為 1）。

實例：第四章結尾那句「好險，好險我那天沒讓那種『想當英雄的癮頭』給毀了。好險我只是個冷酷的、看見事實的人。」共 36 字，36 / 5.0 = 7.2 → 8 + 1 = 9 秒 → `render_blocks: 2`。

只有在同一段台詞內部有**明顯停頓或語氣轉折**、值得讓它成為獨立敘事節拍時，才切成兩個 segment（`split_reason: "duration_split"`）；單純因為字數超長，用 `render_blocks` 就好，不要為了湊 7 秒把一句話切碎。

## 1.8 指涉關係（`references`）

若這一段需要回顧、呼應、引用前面的段落，**不要重寫舊情節**，只記指標：

```json
"references": [
  {
    "segment_ref": "seg_004",
    "why": "判決理由直接引用匯款明細上的銀行斷線時間",
    "manifestation": "判決書紙本上被紅筆圈起的那一行時間"
  }
]
```

* `segment_ref`：指向本段之前的 segment id。
* `why`：為什麼要指涉（劇情功能）。
* `manifestation`：編譯時要變成的**具體載體**——報紙頭條、案卷照片、腦中迴響、判決書上的紅圈。這欄是第二階段寫 `referenced_blocks` 的依據。

只允許指向**前面**的段落；指向後面的段落代表你切錯了順序。

## 1.9 單一段落長相

```json
{
  "id": "seg_004",
  "order": 4,
  "source_start": 2410,
  "source_end": 2864,
  "source": "然而，當他深夜反覆翻看那份海外帳戶的匯款單時……",
  "kind": "action",
  "split_reason": "location_change",
  "location_ref": "loc_judge_office_night",
  "character_refs": ["char_judge_xu"],
  "prop_refs": ["prop_bank_statement"],
  "reference_images": [
    { "role": "scene", "ref": "loc_judge_office_night", "note": "wide plate, the banker's lamp is the only light" },
    { "role": "character", "ref": "char_judge_xu", "note": "same identity plate as seg_001" }
  ],
  "context": "法官在深夜辦公室發現匯款時間落在銀行斷線的 24 小時內，證據可能是偽造的。",
  "visual_context": "檯燈下只有一份文件被照亮，手指沿著時間欄滑動後停住；全程無聲。",
  "continuity": "承接法庭上「準備判有罪」的心證，這裡第一次鬆動。",
  "voice_intent": "none",
  "spoken_text": null,
  "char_count": 0,
  "rate_chars_per_sec": null,
  "estimated_sec": 6,
  "render_blocks": 1,
  "references": []
}
```

對白段的差別：

```json
{
  "kind": "dialogue",
  "voice_intent": "spoken_on_screen",
  "speaker_ref": "char_judge_xu",
  "reference_images": [
    { "role": "scene", "ref": "loc_courtroom", "note": "bench side, judge in frame" },
    { "role": "character", "ref": "char_judge_xu" }
  ],
  "spoken_text": "趙立廷，無罪。本件關鍵匯款紀錄與銀行斷線時間不符，證據不足。",
  "char_count": 30,
  "rate_chars_per_sec": 5.0,
  "estimated_sec": 7,
  "render_blocks": 1
}
```

> `plan.json` 到這裡為止。**不要**寫 `prompt`、`action.description`、`soundtrack_specification`、`facial_state` 這些給模型的文字——那些是第二階段的事。

---

# 第二階段：逐段生成巢狀 JSON

## 2.1 輸入只有 `plan.json`

先把 `entities` 原封不動抄進新的專案 JSON（id 不改、特徵不改），再依 `segments` 的 `order` 一段一段生成 block。**不要回頭讀小說**；如果 `plan.json` 資訊不足，那是第一階段的缺陷，回去補 plan，而不是在第二階段臨時翻原文。

## 2.2 每段要做的事

1. 讀 `kind`、`voice_intent`、`context`、`visual_context`、`continuity`。
2. 用 `character_refs` / `prop_refs` / `location_ref` 組出 `present_characters`、`present_props`、`location_ref`。
3. 把 `reference_images` 原樣搬進 block：`ref` 改成 `entity_ref`，再從實體補上 `image`（r2v 要的是資料夾，不是 id）。第一張必須是場景圖；沒有角色的鏡頭就只有場景這一張。
4. 為每個角色補上**這一段專屬**的 `outfit` 與 `facial_state`（服裝永遠不進 `entities`）。
5. 寫 `action.description`：只描述這一段看得見的動作，不寫心理分析。
6. 依 `voice_intent` 選 `audio_control.audio_mode`。`spoken_text` 是逐字原文，寫進 `dialogue.original_text` 前要先轉成可唸版本（去引號、去冒號、數字改中文、一句一行），規則見 [`PROMPT_TECHNIQUES.md`](PROMPT_TECHNIQUES.md)。
7. 若 `references` 非空，把 `segment_ref` 換成對應的 `block_id` 寫進 `referenced_blocks`。
8. **若 `render_blocks > 1`**，把 `spoken_text` 依句意切成 `render_blocks` 段，每段各自生成一個 block（總長不超過 7 秒）。第一塊承接畫面與 `references`，之後每一塊用 `referenced_blocks` 指回同一段的前一塊，維持視覺連續；不要為了塞進 7 秒把詞切斷。句子本身比 7 秒長時（例如 4 字／秒的獨白超過 28 字），可以在逗號處再拆，block 數會多於 `render_blocks`，這是允許的。
9. `timeframe` 依生成順序累加；編譯時 `compile_block` 會自動重算成 `0..duration`。

## 2.3 欄位對照表

| `plan.json` | 生成的 block 欄位 |
|---|---|
| `id`（`seg_004`） | `id`（`block_04_<slug>`） |
| `location_ref` | `location_ref` |
| `character_refs[]` | `present_characters[].entity_ref` + 新增 `outfit` / `facial_state` |
| `prop_refs[]` | `present_props[].entity_ref` |
| `reference_images[]` | `reference_images[]`：`ref` → `entity_ref`，並補上 `image`（取自 `entities[].reference.image`，是資料夾）；第一張是 scene |
| `context` + `visual_context` | `action.description`（改寫成鏡頭語言） |
| `voice_intent: none` | `vintage_film_room_tone`、`speech_present: false` |
| `voice_intent: spoken_on_screen` | `clean_dialogue_with_room_tone`、`lip_sync_enabled: true` |
| `voice_intent: internal_monologue` | `internal_monologue_with_room_tone`、`lip_sync_enabled: false` |
| `voice_intent: remembered_voice` | `remembered_voiceover`、`lip_sync_enabled: false` |
| `voice_intent: narrator` | `narrator_voiceover`、`lip_sync_enabled: false` |
| `spoken_text` | `dialogue.original_text`（先轉可唸版本；`render_blocks > 1` 時切段） |
| `references[].segment_ref` | `referenced_blocks[]` |
| `estimated_sec` | `timeframe`（編譯時再重算） |
| `render_blocks` | 這一段要生成幾個 block |

## 2.4 聲學規則（指南第四、五章）

* 無台詞段落一定要寫 `soundtrack_specification`，用 35mm film hiss + room tone 把頻段填滿；不要用 `no speech` 這類負向詞。
* 內心獨白：`lip_sync_enabled: false`，`facial_state` 明確鎖唇（`Lips sealed tight, motionless jaw`）。
* 現場對白：`lip_sync_enabled: true`，`facial_state` 描述嘴部動態。
* 每個 block 只能有一種發聲模式；`plan.json` 若把兩種聲音放進同一段，代表切分錯了。

## 2.5 產出格式

一章一個檔案，維持指南 1.4 的形狀：

```json
{
  "version": "1.12",
  "project_title": "Chapter_04_The_Addiction_of_Guilt",
  "global_settings": {
    "aspect_ratio": "16:9",
    "style": "…",
    "default_audio_design": "…"
  },
  "entities": {},
  "blocks": []
}
```

* `entities` 是整章的單一真理來源，**每段都從這裡取**，不要複製貼上改寫。
* `blocks` 依 `order` 排列。
* 每個 block 帶 `reference_images`：`[{ role, entity_ref, image, note? }]`，第一個元素是場景圖，之後是角色圖；r2v 每次至少吃第一張。
* 不寫 `subtitles`（若要寫，只能單一語言）；不寫註解；不寫 `source` 原文（原文留在 plan）。

## 2.6 交付前檢查

- [ ] `plan.segments` 串接後等於原章，sha256 相符
- [ ] 每段都有 `kind`，對白／旁白都有 `spoken_text` 與 `estimated_sec`
- [ ] 每個 segment 至少生成 `render_blocks` 個 block，且每個 block 落在 4–8 秒（句界需要時可多於 `render_blocks`）
- [ ] 每段只有一種 `voice_intent`
- [ ] 所有 `character_refs` / `prop_refs` / `location_ref` 都在 `entities` 裡，且沒有「只被提到、不會入鏡」的人
- [ ] 每個 segment 都有 `reference_images`，且第一張是 `role: "scene"`
- [ ] 每個入鏡角色都有 `role: "character"` 的參考，且整章共用同一個 `reference.image`
- [ ] 所有 `reference_images[].ref` 都存在於 `entities`，`status: "to_generate"` 的圖已在生成前補齊
- [ ] `references` 只指向前面的段落
- [ ] 生成的每個 block 都能通過 `video-compiler` 的 `compile_block`
- [ ] JSON 無註解、無重複語言 subtitles

---

# 附：兩階段的分工邊界

| 問題 | 第一階段（plan） | 第二階段（生成） |
|---|---|---|
| 這段屬於哪個場景？ | ✅ | 只引用 |
| 這段的場景參考圖？ | ✅ 指定（至少一張） | 解析成檔案 |
| 角色長什麼樣？ | ✅ 恆定特徵＋參考圖 | ❌ 不改寫 |
| 角色這鏡頭穿什麼？ | ❌ | ✅ |
| 這段是對白／旁白／動作？ | ✅ | 依此選音軌 |
| 台詞全文？ | ✅ | 原樣搬進 `original_text` |
| 這段幾秒？ | ✅ 估算 | 沿用，編譯時重算 |
| 指涉哪一段？ | ✅ 記 `segment_ref` | ✅ 轉成 `referenced_blocks` |
| 鏡頭怎麼拍、怎麼運鏡？ | ❌ | ✅ `action.description` |
| 底噪、對嘴開關？ | ❌ | ✅ `audio_control` |

一句話總結：**plan 決定「講什麼、切成幾段、每段多久、用哪幾張參考圖、跟誰有關」；生成決定「怎麼拍、怎麼聽」。**
