# story-editor MCP Server 使用指南

適用對象：使用 `story-editor` MCP server（`story2_phase1.json` 等 Story JSON）的人工智慧助理。
本文件講「怎麼用這套工具把一部故事有效率的做成影片」，融合
`novel_to_video_guide_v2.md`（小說→影片方法論）與本套 MCP 工具的實作細節，
核心是**兩階段工作流**：

- **Phase 1（規劃）**：讀完故事後，只專注設計故事需要的**場景／對白／旁白**分鏡，
  不管畫面細節，把分鏡與字幕內容確定下來。
- **Phase 2（畫面）**：進入 phase2 後，才專注畫面細節，參考 phase1 的分鏡設定、
  回想故事情節，一格一格寫出生動、符合故事情節的提示詞。

---

## 〇、核心概念：一支影片 = 一個區塊

> **一個區塊 = 一支獨立的 `gen_r2v_video`（可獨立生成、可獨立重跑、可獨立檢查）。**

不要用「章節」或「景」當單位，也不要一支影片塞多個節拍。理由是：

- 一支影片塞太長，某一鏡頭的失誤無法單獨修正，必須整支重跑。
- 每支固定 seed：出錯（如歪腔調、角色漂移）只重跑該支，不影響其他。
- 每一支都有界定的時間範圍與音訊內容，方便相加成完整成品。

在 MCP 檔案中：**plan 的每個 id = 一支影片 = 一個 story 元素**，一一對應。

---

## 一、工具總覽

### 通用屬性

- 所有工具透過 `input`（Story JSON 路徑）讀檔；`output` 可另存或省略（省略＝覆寫原檔）。
- **陣列順序＝合併／字幕順序**。plan 與 story 的順序都要能對上號。
- `id` 是唯一鍵：phase2 的 story 元素 `id` 必須對應 phase1 的 plan 分鏡 `id`
  （只有 t2i 參考圖素材例外，可以獨立存在）。

### 工具清單（依階段）

| 工具 | 階段 | 作用 |
|------|------|------|
| `story_init` | 前置 | 建立空 Story JSON（phase:1, plan:[], story:[]） |
| `story_edit_meta` | 任一 | 改頂層 description / width / height |
| `story_set_phase` | 任一 | 1→2（鎖 plan，開 story）／2→1（解鎖 plan） |
| `plan_add_element` | **phase1** | 加一塊分鏡 {id, voice, duration, lines, source}；可先只填 id+source 切段，後續用 plan_edit_element 補 voice/duration/lines |
| `plan_edit_element` | **phase1** | 改分鏡（partial patch；可用來「先切段填 source，再逐段補分類與秒數」的兩階段填法） |
| `plan_delete_element` | **phase1** | 刪分鏡 |
| `plan_get` | 任一 | 讀字幕表：累積起點、逐句 cue、斜體、原文、規劃總秒 |
| `story_add_element` | **phase2** | 加一格 {id, type, prompt, refs, seed, out, extra} |
| `story_edit_element` | **phase2** | 改一格（partial merge） |
| `story_delete_element` | **phase2** | 刪一格 |
| `story_get_element` | 任一 | 讀單格（含對應 plan） |
| `story_list_elements` | 任一 | 依陣列順序列出（摘要可截斷） |
| `story_get_chain` | 任一 | 讀依賴鏈（refs 遞迴，依賴先序） |
| `story_check_chain_outputs` | 任一 | 檢查依賴鏈的 output 是否已在磁碟上 |
| `story_submit_bundle` | 任一 | 組 ComfyUI 提交包（含 refs 解析成檔案） |
| `story_submit_comfy` | 任一 | 組包並轉呼叫 comfy-video-gen（自動代入參數，寫回 prompt_id） |
| `story_submit_comfy_all` | 任一 | 依 story 陣列順序列提交（預設全部 r2v；可篩 types／ids） |
| `story_comfy_tool` | 任一 | 透傳呼叫任意 comfy-video-gen 工具（queue／history／merge…） |
| `story_download_videos` | 任一 | 逐格把 comfy history 成品下載回元素資料夾（自動代入 prompt_id＋out） |
| `story_merge_videos` | 任一 | 依 story 陣列順序合併全部 ready 影片（自動代入 files＋resolution） |
| `story_get_all_video_paths` | 任一 | 依合併順序列出每格影片路徑＋就緒旗標 |
| `story_validate` | 任一 | 全 JSON 驗證（唯一 id、缺 ref、型別、phase2 覆蓋、`<d>` 鏡像） |
| `story_export_srt` | 任一 | 從 plan 匯出 YouTube SRT（scale 換算、旁白斜體） |

> duration／width／height 都不在元素內：duration 屬於 plan、width/height 屬於頂層。
> 把這三個欄位寫進 story 元素是錯誤寫法，工具會直接報錯導向正確位置。

---

## 二、標準工作流程（含區塊分割）

```
讀故事全文
   │
   ▼
①story_init → 建立 Story JSON（寫入 description 故事摘要、寬高）
   │
   ▼
②PHASE 1（規劃）  分層填入：先切段填 source，再逐段分類與計秒
   ├─ 第 1 步（必先）：腦中先有 場景 / 對白 / 旁白 的概念，但「先不管分類」，
   │    把 story_md 的故事適當截斷後，逐字填入每一格的 source（原文欄位）。
   │    理想的截法：所有 source 依 plan 順序串接，能大致拼回原故事。
   ├─ 第 2 步（逐段）：回到每一段 source，判斷它屬於 場景 / 對白 / 旁白（見 §三），
   │    設定該段的 voice、duration 與 lines：
   │    ├─ voice：scene / dialogue / narration 三選一
   │    ├─ 對白／旁白：lines 必須逐字寫好（這是未來的字幕文字）
   │    └─ duration（對白 4字/秒、旁白 5字/秒、場景依鏡頭節奏）
   └─ 亦即每格填寫順序：source → voice → duration → lines
   │
   ▼
  plan_get 檢查字幕表與總秒 → 確認無誤
   │
   ▼
③story_set_phase → 2（plan 被鎖定，不可再改，只能解鎖重開）
   │
   ▼
④PHASE 2（畫面）  For 每一格 plan 分鏡，依 order：
   ├─ 回想故事情節＋參考 phase1 該格設定（voice/duration/lines/source 原文）
   ├─ 參考上一格已寫好的 prompt（連貫性：角色、地點、光影、情緒）
   ├─ 寫出生動的六欄位 r2v 提示詞（見 §四）
   ├─ 若此分鏡會用到參考圖素材，把對應 t2i 元素 id 放進 refs
   └─ story_add_element（type=r2v 為主，id 等於 plan id）
   │      │
   │      └─ 內省功能：story_get_element / story_get_chain / story_list_elements
   │
   ▼
⑤story_validate 確認全綠（特別注意 dialogue/narration 的 <d> 是否與 plan lines 鏡像）
   │
   ▼
⑥story_submit_comfy／story_submit_comfy_all 提交生成
   │      （refs 自動解析並轉呼叫 comfy-video-gen；prompt_id 寫回 extra）
   │
   ▼
⑦合併：story_get_all_video_paths → 依序 merge_videos → story_export_srt
```

### 區塊分割的四層思考

```
第 1 層  全書 → 章節圖        （列出各章功能與情緒走向）
第 2 層  章節 → 原文切段      （把故事適當截斷、可拼回全書，逐字填進 source）＝ plan.source
第 3 層  段落 → 三型別區塊    （逐一標示 場景 / 對白 / 旁白 + 計秒 + lines）＝ plan 的 voice/duration/lines
第 3.5層 區塊 → 字幕資料表    （同步產出：順序、起始秒、逐字文字、斜體）＝ plan lines + plan_get
第 4 層  區塊 → 參考圖分配    （對照參考圖表填 refs）＝ story 元素的 refs
第 4.5層 區塊 → 六欄位提示詞  （見 §四）
```

**切割判斷**：

- **進區塊的**：氛圍鏡頭、象徵鏡頭、強動作、金句台詞、節拍三連（質問→數據登場→對方語塞）。
- **跳過/濃縮的**：純政策論述、運算細節、哲學長對話（只留 1–2 句金句）、純過場、冗長內心獨白。
- **先切段、後分類**：切段時只關心「把故事切成段落、每段放一格、串起來可以還原原文」；
  分完段才逐段決定 voice／duration／lines。**不要一面切段一面急著分類**。
- 對白每格最多承載 1–2 句（字數對應秒數），句子別太長。
- **切割時就同步把 `<d>` 的逐字文字定進 plan lines**（字幕源頭），
  也把該分鏡對應的**原文段落逐字截進 plan source**（phase2 寫 prompt 的參考依據），
  省得影片上線前再回來逐檔反查——`story_validate` 會檢查 `<d>` 與 plan lines 是否鏡像。
- 單支 ≥ 20s 的對白區塊風險高（語音易漂移），能拆就拆。

**關鍵紀律**：phase1 只談「要講什麼、幾秒、誰說」；phase2 才談「畫面長怎樣」。
不要在 phase1 花時間寫畫面細節，也不要在 phase2 才發現要改對白文字
（對白文字屬於 plan，改它要解鎖 phase，容易讓 story 與 plan 脫鉤）。

---

## 三、三種分鏡型別與使用場合（voice 欄）

每塊分鏡只能選一種 `voice`：`scene`（場景）／`dialogue`（對白）／`narration`（旁白）。
三種各有合適的使用場合，判斷基準是：**「這一段，觀看者需不需要文字才懂？」**
以及**「文字該由誰發出？」**。

> **plan 填寫順序提醒**：先有「場景／對白／旁白」的型別概念，把故事適當截段填進
> `source`（理想上可拼回原文），**再**依每個段落逐一決定它屬於哪一型別、配幾秒、
> 對白／旁白要唸哪些 lines。

| 型別 | 字幕 | 誰發聲 | 計秒 | 提示詞處理 | 什麼時候用 |
|------|------|--------|------|-----------|-----------|
| **scene** | 無字幕 | 無人發聲 | 看動作節拍，通常 1–8s，寧短勿長 | 不寫 `<d>`；`speaker_constraints` 寫 `No one speaks / No narration / No voice-over`；音訊負向；`overall_soundscape` 只寫環境音 | 氛圍、過場、純視覺 |
| **dialogue** | 有字幕 | 畫面內角色張嘴 | **4 字/秒**（台灣腔普通話慢讀），留緩神餘裕再進位 | `<d>` 逐字對白；`speaker_constraints` 指名 `Only <Subject N> speaks`；其他角色 `lips stay closed` | 角色在畫面裡對談、推進劇情 |
| **narration** | 有字幕（斜體） | 畫外固定旁白 | **5 字/秒**（更平更快） | `<d>` 承載旁白；`speaker_constraints` 排除角色發聲並錨定固定男聲 | 角色沒說出口，但觀看者必須知道的事 |

### scene（場景）—— 無字幕場景鏡

**使用場合**：

- **氛圍鏡**：建立一個地點／時代／情緒，讓觀看者「走進這個世界」的第一印象。
- **過場與轉場**：章節之間、情境切換，需要一小段呼吸的留白。
- **象徵／細節鏡**：道具有故事（桌上的橘子、手腕的感測環、牆上的小綠燈），
  但不需要唸出來。
- **純動作節拍**：畫面看得懂的動作（走路、開門、拔接頭），不需要文字也成立。
- **給對白／旁白換氣**：連續說話之間的沉默夾層。

**判斷**：把文字拿掉，觀看者依然完全懂這段在演什麼 → 用 scene。

**寫法**：完全不寫 `<d>`；`speaker_constraints` 寫 `No one speaks / No narration / No voice-over`；
音訊負向（`No whispering / No muttering / No off-screen speech / No device voice`）；
`overall_soundscape` 只寫環境音。**若寫了 `<d>`，`story_validate` 會當成 issue。**

### dialogue（對白）—— 畫面內角色開口

**使用場合**：

- **角色在畫面中對話**：雙方面對面交談，字幕逐字標出誰說了什麼。
- **推進劇情的關鍵台詞**：一句話讓事件升級、揭露資訊、角色衝突爆發。
- **角色自白（嘴在畫面）**：角色真的張嘴講出來的心聲，不是畫外音。

**判斷**：這句話由**畫面裡的角色張嘴說出**，且觀看者需要知道他說了什麼 → 用 dialogue。

**寫法**：`<d>` 內逐字寫對白（每句獨立換行）；`speaker_constraints` 指名
`Only <Subject N> speaks`，其他畫面角色 `lips stay closed`。計秒：逐字數中文字數 ÷ 4，
留緩神餘裕再進位。對白每格最多承載 1–2 句，句子別太長；一格的對白不該是整段獨白。

### narration（旁白）—— 畫外固定旁白

**使用場合**：

- **畫面角色的腦內資訊**：角色在想、在壓抑、在掙扎——但沒有說出口。
  視覺看不出「他此刻在想評分系統、在愧疚、在盤算」，只有旁白能補。
- **世界觀／系統說明**：溫度設定、監視機制、遊戲規則、職位職責——角色不會對彼此唸這些，
  但觀看者要知道才會懂後續劇情（例如系統導航員的職責與悖論）。
- **角色背景補述**：一個角色的前史、地位、與他人的關係（林婉、小禾、老張的背景）。
- **書面／系統文字的轉述**：手冊條文、偽造數據的後果、法條——角色不會唸，但字幕要給。
- **看不到的後果／反派側資訊**：系統做了什麼、資料被改了、查覺到了——畫面常常「看不出變了」。

**判斷**：重要資訊**只能靠旁白傳達**，說出口會打破角色「不該知道／不會說」的合理性
（角色若張嘴講這些反而假），或純粹是敘事者該補充的 → 用 narration。

**寫法**：`<d>` 承載旁白逐字句（逐字數中文字數 ÷ 5，留緩神餘裕再進位）；
`speaker_constraints` 排除角色發聲（`No character speaks in frame`、角色 `lips sealed`），
並錨定 `The narrator is a fixed calm male voice, never female`。
**全片旁白共用同一支 seed**（實作採用 `311000`；沿用時注意黑名單，見 §六 seed 策略），
讓聲線跨支穩定。SRT 匯出時旁白自動包 `<i>` 斜體。

### 三型別快速決策

```
這段「觀看者需要看懂的東西」是什麼？
  ├─ 什麼都不用看文字就懂 ....................... scene（無人發聲）
  ├─ 角色在畫面前，張嘴講出的一句話 ............. dialogue（角色發聲）
  └─ 角色沒講出口，但觀看者「必須知道」的事 ..... narration（畫外旁白）
```

> **慣例提醒**：容易混淆的是「角色內心思緒」。只要角色**沒有真的張嘴**，就算畫面裡是他，
> 他要傳達的重點也該用 narration（畫外音），而不是 dialogue。

---

## 四、Phase 2：一格一格寫提示詞

進入 phase2 後，**不要一次把所有 prompt 寫完**。依 plan 順序一格一格來，
每一格都：

1. **回想故事情節**：這一段劇情在講什麼、前後發生什麼。
2. **參考 phase1 該格設定**：`voice`（決定音訊寫法）、`duration`（決定一個 Shot 的長度）、
   `lines`（決定 `<d>` 內逐字內容，不得發明或改寫）、`source`（該格對應的原文段落，
   畫面情緒與細節以此為準，不要偏離原意）。
3. **參考上一格已寫好的 prompt**：角色外觀錨點、地點、光線、情緒色調要連貫
   （用 `story_get_element` 抓前一格，或 `story_get_chain` / `story_list_elements` 看脈絡）。
4. **用好參考圖**：這格分鏡中出現的每一個角色／場景，若已有對應 t2i 素材元素，
   一律加進 `refs`（放該 t2i 元素 id，提交時自動解析成圖片路徑）。
   r2v 最多 9 張、i2v 最多 2 張；一張主角肖像優先放 `ref_image_0`。
   未提供的 `ref_image_N` 不要帶入——MCP 層會刪除該節點，避免殘留污染。
5. **寫六欄位 r2v 提示詞**（詳見 `video_prompt_guide.md` §3.5）：

```
subject_definitions:     角色/場景 from <Picture N>，全英文關鍵特徵
summary:                 僅英文名詞片語，不寫中文完整句、不出現台詞關鍵字
retention_analysis:      <Subject N>: fully_preserved. 逐格標保留度
speaker_constraints:     誰發聲 / 誰閉嘴 / 排除旁白（依 voice 決定）
detailed_description:    風格一句 + [Shot N] + 秒段 + Action（生動、可觀察）
                         + Dialogue:（dialogue/narration 才有）+ <d>[中文]逐字</d>
overall_soundscape:      環境音 + 腔調錨點句
non_diegetic_music:      配樂（有對白/旁白可寫 "A clean, open string line, warm and unhurried." 等）
```

### 四原則（對白/旁白區塊一律套用，實測 2026-09）

| # | 原則 | 為什麼 |
|---|------|--------|
| 1 | `summary` 只寫英文名詞片語，**不寫任何中文完整句** | 模型會把 `<d>` 外的中文完整句當成可朗讀內容，覆蓋掉 `<d>` 內內容 |
| 2 | `summary` 不出現台詞關鍵字 | 避免對白用詞（「背叛」「懷疑」等）被抓去唸 |
| 3 | 除 `<d>` 外，任何欄位**不出現中文完整句**；中文只在 `<d>` 內 | 欄位分工徹底隔離，`<d>` 是唯一被朗讀的來源 |
| 4 | 對白/旁白用 `<d>[中文] ...</d>` 逐字寫入，**每句獨立換行** | TTS 逐句處理更穩，氣口自然 |

### 特殊符號唸法陷阱

- `<d>` 內凡會被唸出的文字，一律避免符號與阿拉伯數字：`2%`→`百分之二`、`15%`→`百分之十五`。
- 禁止混寫（`百分之2`）；實測 `%` 會被唸成「PiFen」怪音；「」引號、全形冒號也可能被唸出怪音。
- 畫面可見文字（圖表數字、電視牆標題）不被唸出，可保留原始符號；鏡頭描述中標明 `visible on-screen text`，與 `<d>` 分開。

### 音訊欄位不可省略

`overall_soundscape` / `non_diegetic_music` 必須明寫。不改動它們，模型會自己發明旁白或疊加無關聲音。

### 六、腔調錨點與 Seed 策略

- **腔調錨點**：MiniMax H3 的中文聲線**常與 seed 耦合出方言腔**（實測 310000 早期曾導出粵語腔、又曾性別翻轉）。
  處理：不要只改 `<d>` 語言標籤（`[中文]`→`[普通話]` 實測無效）；
  在 `overall_soundscape` **逐字寫念腔**當錨點：
  `All spoken lines are delivered in Taiwan-accented Standard Mandarin (台灣腔普通話), no Cantonese.`
  加強版：`speaker_constraints` 加 `never Cantonese / never English / no code-switching`、
  `Action` 段補正向念腔描述、`<d>` 前一行聲明腔調。
  外籍/西方面孔角色：先寫死族裔 `East Asian (Chinese)`，參考圖確保東亞面孔，再換新 seed。
- **seed 黑名單**：歪腔或性別翻轉的 seed 記入黑名單並換新 seed 重跑
  （旁白 seed `310000` 因性別翻轉失效，現用 `311000`）。
  修正腔調提示詞**必須同時換 seed**——固定 seed = 固定腔調，只改文字不改 seed 不會生效。
- **解析度統一**：全片必須單一解析度（本專案 `512 × 288`，16:9，top-level width/height）。
  不要為個別區塊切 16:9 / 2:3 / 1:1。

---

## 五、驗證、提交、合併

1. **`story_validate`**：全綠才算完成 phase2。
   特別檢查 warnings：`<d>` 與 plan lines 是否鏡像（plan 是字幕的唯一真相來源）、
   `<d>` 內是否混入數字/英文字母。
2. **`story_submit_bundle`**：取一格提交包，確認 `refs` 的 `via` 都解析成實際檔案
   （`output:dir-pick` = 取資料夾內建立時間最晚者）。缺 ref 會報錯並標明缺誰。
   生成順序：先讓 refs（t2i 素材）有輸出，再提交依賴它們的 r2v。
3. **`story_submit_comfy`**（單格）／**`story_submit_comfy_all`**（多格／全部）：
   組包後**直接轉呼叫** `comfy-video-gen` MCP，依元素 type 自動對應並代入參數：
   - `r2v` → `gen_r2v_video`（prompt／seed／duration／width／height／out／`ref_image_0..N`）
   - `i2v` → `gen_i2v_video`（refs[0]=first_frame，refs[1]=last_frame）
   - `t2v` → `gen_t2v_video`
   - `t2i` → `gen_sdxl_image` 或 `gen_zit_image`（看 `extra.engine`，prompt 優先用 `extra.sdxl_prompt`）
   預設把回傳的 `prompt_id`（與實際 seed）寫回元素 `extra`／`seed`。
   `story_submit_comfy_all`：**依 story 陣列順序循序提交**（避免 JSON 競態）；預設 `types:["r2v"]`；
   可用 `types:["t2i","r2v"]`、`ids`／`skip_ids`、`limit`／`offset`、`continue_on_error`、`dry_run`、`bump_seed`。
   通用透傳：`story_comfy_tool`（如 `query_comfy_queue`／`download_from_history`／`merge_videos`）。
4. 送 ComfyUI 後回傳 prompt_id 可追蹤；背景下載在 **comfy-video-gen 子行程**內執行
   （story-editor 會長駐該 MCP 子行程，勿手動殺）。
   若背景自動下載遺失（逾時／重啟／取消佇列）：
   `story_download_videos` 依 story 陣列順序逐格轉呼叫 `download_from_history`
   （自動代入元素 `extra.prompt_id`＋解析後的 out 資料夾；可 filter `ids`／`skip_ids`／`types`；
   用 `dry_run` 先看解析結果，缺 prompt_id 或不在 history 會逐格回報不 abort）。
5. **合併**：`story_merge_videos`（依 story 陣列順序＝合併順序，自動代入全部 ready 影片的
   最新媒體檔＋專案 `width:height` resolution，輸出到 `base_dir/final`；有缺檔會先報錯不 merge；
   可覆寫 `out`／`resolution`）。也可用 `story_comfy_tool` 手動 `merge_videos`，全片固定同一 resolution。
   合併前確認每支影片解析度/幀率一致。
6. **`story_export_srt`**：用 merge 回傳的 `total_seconds` 匯出。
   `scale = 實際總秒數 / 規劃總秒數` 自動換算、旁白自動 `<i>` 斜體、scene 自動跳過。

### 下載與追蹤

- 提交後回傳 `prompt_id`，背景自動下載至 `output/<out>/`。
- 背景下載若因 server 重啟/佇列取消而失效（本地無檔、回報 timeout）：
  1. `query_history` 查該 `prompt_id` 是否存在於 ComfyUI 歷史、輸出檔名為何。
  2. `download_from_history` 直接以 `prompt_id` 從歷史重新下載。

---

## 六、產出前自檢清單

- [ ] 每個區塊是否只含「一個主要事件」？塞太多就再拆。
- [ ] 每支是否有獨立觀看價值（不是前後支拼接才懂）？
- [ ] 對白/旁白是否逐字對照原文、未發明、未省略？`<d>` 與 plan lines 是否一致？
- [ ] `<d>` 內會被唸的文字是否已將 `%`、`「」`、`&`、冒號、阿拉伯數字改為中文寫法？
- [ ] 型別與提示詞對應：場景 → 完全不寫 `<d>`；對白 → 指名 `Only <Subject N> speaks`＋其他角色閉唇；旁白 → 角色不發聲且共用旁白 seed。
- [ ] `speaker_constraints` 是否排除了旁白/第三人聲（避免腦補旁白）？
- [ ] `overall_soundscape` / `non_diegetic_music` 是否明寫？
- [ ] 腔調錨點句 / 負向排除是否在每支對白與旁白區塊中？
- [ ] seed 是否查過黑名單？旁白是否用旁白 seed（311000）？
- [ ] 參考圖：用到的 `refs` 是否確實存在？未用的是否沒帶入（避免殘留污染）？
- [ ] 解析度是否全片統一（512×288）、合併順序是否正確？
- [ ] 字幕資料表是否與區塊分割同步建立？合併後是否已產出 `.srt`？旁白是否加 `<i>` 斜體？
- [ ] 有沒有長辯論/長獨白硬塞進一支？應拆分。

### 實作教訓（2026-09，來自 story1/story2 實作）

- **參考圖殘留污染**：workflow 未用到的 LoadImage 節點殘留舊檔名 → 被當參考圖餵入。
  已由 MCP 層在 `buildR2vWorkflow` 以「未提供即刪除節點+連線」根治。
- **歪腔與 seed 耦合**：修正腔調不能只改 `<d>` 標籤；要 soundscape 錨點 + 黑名單換 seed。
- **背景下載脆弱**：server 重啟/佇列取消會讓自動下載失效，需 `query_history` + `download_from_history` 復原。
- **MCP 背景任務錯誤隔離**：非同步下載區段每檔案 try/catch，單一檔案失敗只印 log 不中斷整支 job。
- **字幕時間是猜的，不是算的**：各支影片實際秒數與規劃秒數有偏差，只能以比例縮放
  （scale = 實際總長 / 規劃總長）。切割時就同步記錄字幕文字，避免合併後再回來逐檔反查。

---

## 七、常見錯誤與提醒

- **寫完才想到要改對白**：對白文字在 phase1 就該定案。phase2 改文字＝解鎖 plan 重開
  → story 可能與 plan 脫鉤，`story_validate` 會出 warnings。最好在 phase1 多花時間想清楚。
- **把角色心聲寫成 dialogue**：角色沒張嘴就不是 dialogue；張嘴講叫作對白，沒張嘴叫旁白。
- **scene 誤帶 `<d>`**：scene 完全不寫 `<d>`，validate 會當成 issue。
- **畫面細節塞進 phase1**：phase1 的 description 可寫給自己看的提示，但分鏡責任只有
  voice/duration/lines。過早寫畫面細節只是浪費且後續難對齊。
- **refs 漏加**：分鏡有出現角色/場景就要（若有素材）加進 refs；漏了角色會漂移、
  場景會對不上。先建 t2i 素材並生成輸出，再讓分鏡元素 ref 它。
- **一次寫完所有 prompt**：容易斷裂。一格一格寫、每格對前一格，連貫性才好。
- **旁白 seed 失效未察覺**：固定 seed = 固定聲線，一旦某支實測性別翻轉/歪腔，
  整支旁白 seed 失效，要換新 seed 並統一更新所有旁白元素。