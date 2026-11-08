# workspace — 故事通用的影片生成工具鏈

`workspace/` 只放「與故事無關」的程式碼。每個故事自己的資料（plan、prompts、渲染結果）
留在自己的資料夾，兩邊靠 `story.json` + `--story <資料夾>` 連接。

```
Project21/
├─ workspace/
│  ├─ README.md                ← 本文件
│  ├─ lib/                     共用邏輯（不直接執行）
│  │  ├─ args.mjs              命令列解析
│  │  ├─ comfy.mjs             ComfyUI 連線設定、ffmpeg 路徑
│  │  ├─ story.mjs             故事資料夾解析、參考圖資料夾
│  │  ├─ plan.mjs              plan 讀取 / 實體查詢 / 通用驗證
│  │  ├─ prompt.mjs            prompt 欄位、[Shot N]、<d> 解析
│  │  ├─ media.mjs             ffmpeg probe / 音訊包絡 / concat
│  │  ├─ manifest.mjs          render_manifest.json 讀寫
│  │  ├─ render.mjs            t2v / r2v / i2v 派送
│  │  └─ subtitle.mjs          字幕時間軸、換行、對齊、SRT/VTT
│  └─ tools/                   可執行工具（每個都有 --help 風格用法）
│     ├─ new_story.mjs
│     ├─ extract_penana.mjs
│     ├─ verify_plan.mjs
│     ├─ check_prompts.mjs
│     ├─ generate_refs.mjs
│     ├─ check_refs.mjs
│     ├─ render_segment.mjs
│     ├─ render_all.mjs
│     ├─ audit_renders.mjs
│     ├─ download_renders.mjs
│     ├─ concat_renders.mjs
│     └─ build_subtitles.mjs
│
├─ comfyui_mcp/                機器層設定（url / 下載根目錄）
├─ gen_video/                  prompt 方法論文件、ffmpeg-static
└─ test_story3/                一個故事的完整資料
   ├─ story.json
   ├─ plan.ch0.json
   ├─ prompts/
   ├─ output/{render,video}/
   ├─ render_manifest.json
   ├─ build_plan.mjs           ← 故事專屬：切片、驗證、產生 plan
   └─ data_entities.mjs / data_segments_*.mjs
```

## 一個故事需要什麼

| 檔案 / 資料夾 | 必要 | 說明 |
|---|---|---|
| `story.json` | 否 | 沒有也能跑，全部欄位都有預設值 |
| `plan*.json` | 是 | `story.json` 指定的，或目錄裡唯一的 `plan.*.json` |
| `prompts/` | 是 | `<seg_id>.t2v.txt` / `.r2v.txt` / `.i2v.txt` |
| `output/` | 自動建立 | `render/<planBase>/`（素材）、`video/`（成片、字幕） |
| `render_manifest.json` | 自動建立 | 由渲染工具寫入，是「哪個 take 是正式版」的唯一來源 |

`output/` 已在 `.gitignore` 內，大檔不會進版控。

## story.json

```json
{
  "version": 1,
  "name": "test_story3",
  "title": "序章：驟變之前",

  "plan": "plan.ch0.json",
  "prompts": "prompts",
  "output": "output",
  "manifest": "render_manifest.json",

  "render": {
    "width": 352,
    "height": 608,
    "fps": 24,
    "turbo": false
  },

  "subtitles": {
    "lang": "zh-Hant",
    "rate": 6.2,
    "maxLine": 15,
    "protect": ["嘉年華", "避難所", "……"]
  },

  "refs": {
    "root": null,
    "model": "moodyRealMix_zitV7.safetensors",
    "sizes": { "character": { "width": 832, "height": 1024 } }
  }
}
```

* `name`：預設資料夾名稱；同時是新的參考圖命名空間 `refs/<name>/<entity>`。
* `plan/prompts/output/manifest`：都可寫絕對路徑，預設相對於故事資料夾。
* `render`：`width/height` 必須是 32 的倍數（H3 限制）；`turbo` 決定是否套用渦輪 LoRA。
* `subtitles.protect`：換行時不可拆開的詞。這是故事專屬資料，所以放在故事裡，不寫死在程式。
* `refs.root`：不設就用 `comfyui_mcp/metadata.json` 的 `comfyui.output_dir`（跨故事共用的素材快取）。
* `refs.model/clip/vae/sizes/quality`：參考圖生成參數，預設已是 `z_image_t2i` 可用的一組。

解析順序：`--story` > 目前目錄；`--plan` > `story.json.plan` > 目錄裡唯一的 `plan.*.json`。

## 工具

所有工具都接受 `--story <資料夾>`，省略時用目前目錄。`--dry-run`、`--force` 在各工具語意
一致（只演算 / 覆蓋既有結果），`check_refs` 另有 `--json`。大部分工具結尾會印一份 JSON 摘要。
結束碼 `0` = 通過，`1` = 有問題，`2` = 用法錯誤。

### 1. 建立故事骨架

```bat
node workspace/tools/new_story.mjs --name my_story --title "第一章"
node workspace/tools/new_story.mjs --dir stories/my_story --name my_story
```

產生 `story.json`、空的 `plan.ch0.json`、`prompts/`、`output/{render,video}/`。

### 2. 小說 HTML → 純文字

```bat
node workspace/tools/extract_penana.mjs --story my_story
node workspace/tools/extract_penana.mjs --story my_story --html story_ch0.html --out story_ch0.txt
```

Penana 匯出的每個段落都夾著防盜水印 span；這一步只留正文，並印出 sha256 供 plan 引用。
輸出檔結尾不加換行，因為 plan 會對整份檔案做雜湊。

### 3. 驗證 plan

```bat
node workspace/tools/verify_plan.mjs --story my_story
node workspace/tools/verify_plan.mjs --story my_story --verbose
```

檢查：來源切片是否接回原檔（sha256 / 連續 / 長度）、`reference_images[0]` 是否為 scene、
講話契約（action 不可有 `spoken_text`、dialogue/narration 必須有）、entity 類型是否對得上、
參考圖是否超過 9 張。**不**檢查故事專屬的 anchor 規則，那是由故事自己的 `build_plan.mjs` 負責。

### 4. 檢查 prompt

```bat
node workspace/tools/check_prompts.mjs --story my_story
node workspace/tools/check_prompts.mjs --story my_story --style-lock 100 --verbose
```

* 缺 prompt、副檔名與欄位格式不符（`subject_definitions` = r2v，`integrated_multimodal_description` = t2v）。
* 必填欄位是否齊全（r2v 六欄、t2v 三欄）。
* `[Shot N]` 是否遞增、是否超出片長；`[Shot 1]` 開頭不應帶時間（r2v 的 `00:00-00:03` 除外）。
* action 不該有 `<d>`、講話段落不該沒有 `<d>`。
* `<d>` 是否仍與 `plan.spoken_text` 一致（用 CJK 二元組相似度，忽略引號）。
* TTS 會被唸出來的符號：`%`、數字、英文字母、`「」『』`、`：`、`& # @ *` 視為錯誤；
  `——` 視為可用停頓，只警告。
* **風格鎖**：取多數 prompt 的前 100 字 `[Shot 1]` 開頭當基準，把不同的一律標出來。
  這能抓到「其中幾段偷偷換了畫風」的問題，不需要手動比對 79 個檔案。

### 5. 產生參考圖

```bat
node workspace/tools/generate_refs.mjs --story my_story
node workspace/tools/generate_refs.mjs --story my_story --only char_taylor,loc_riverbed
node workspace/tools/generate_refs.mjs --story my_story --force --dry-run
```

每個實體一張板（`z_image_t2i`），依 `entity.kind` 決定尺寸（人物 832×1024、道具 1024×1024、
場景 1344×768）。輸出位置：

* `entity.reference.image` 有值 → 用它（`test_story3` 就是 `refs/<entity>`）；
* 沒值 → `refs/<story.name>/<entity>`，新故事不會跟舊故事撞名。

成功後把 `plan.entities[*].reference.status` 改成 `ready`，並寫 `refs_report.json`。
`--dry-run` 只印出每個實體會去哪、多大，不呼叫 ComfyUI。

### 6. 檢查參考圖

```bat
node workspace/tools/check_refs.mjs --story my_story
node workspace/tools/check_refs.mjs --story my_story --json
```

列出每個實體資料夾裡最新的板；`declared_ready_but_missing` 表示 plan 說 ready 但磁碟沒檔案。

### 7. 渲染單段

```bat
node workspace/tools/render_segment.mjs --story my_story --seg seg_017
node workspace/tools/render_segment.mjs --story my_story --seg seg_002 --mode r2v
node workspace/tools/render_segment.mjs --story my_story --seg seg_017 --dry-run
node workspace/tools/render_segment.mjs --story my_story --seg seg_017 --async
node workspace/tools/render_segment.mjs --story my_story --seg seg_017 --first-frame still.png
```

模式判斷：prompt 檔名（`.r2v.txt` / `.t2v.txt`）與內容欄位互相驗證；`--first-frame` 會把
t2v 升級成 i2v（`minimax_t2v` + 首幀）。r2v 會把 `segment.reference_images` 依序解析成
每個實體資料夾裡**最新**的板，並檢查 prompt 的 `<Picture N>` 數量與 plan slot 數是否一致
（不一致要 `--force`）。

長度：`segment.estimated_sec`（或 `--duration`）經 `17k+5` 影格量化，24 fps 下 12 秒會變成
294 格（12.25 秒）；manifest 記的是實際長度，字幕與合併都用它。

寫入 `render_manifest.json` 的欄位：`segment_id / take / mode / prompt_id / prompt_file /
status / seed / turbo / width / height / duration_sec / frames / references / files`。

`--async` 只送出不等結果，之後用 `audit_renders` + `download_renders` 收。

### 8. 批次渲染

```bat
node workspace/tools/render_all.mjs --story my_story
node workspace/tools/render_all.mjs --story my_story --from seg_040 --to seg_079
node workspace/tools/render_all.mjs --story my_story --only seg_009,seg_051 --force
node workspace/tools/render_all.mjs --story my_story --async --no-turbo --seed 100
```

依 plan 順序送件，已在 manifest 且檔案存在的段落會跳過；`--force` 重送。單一 GPU 故刻意
串行。`--dry-run` 只列出每段會用哪種模式、多長、幾個警告。

### 9. 追蹤佇列

```bat
node workspace/tools/audit_renders.mjs --story my_story
node workspace/tools/download_renders.mjs --story my_story
```

`audit_renders` 問 ComfyUI `/history`，把每個 `prompt_id` 的輸出檔寫進
`render_history_report.json`（不下載）。`download_renders` 依該報告下載到故事的
`output/`，再把路徑折回 manifest。這是 ComfyUI 重開、佇列被取消、或自動下載遺失時的救援路徑。

### 10. 合併成片

```bat
node workspace/tools/concat_renders.mjs --story my_story
node workspace/tools/concat_renders.mjs --story my_story --from seg_040 --to seg_079
node workspace/tools/concat_renders.mjs --story my_story --reencode
node workspace/tools/concat_renders.mjs --story my_story --out path/to/cut.mp4
```

順序永遠取自 plan，不靠檔名排序。預設 stream copy（無損、快），因為同一故事的片段是同一組
解析度 / fps / codec；接點有問題時用 `--reencode`（H.264 CRF 18 + AAC 192k）。
輸出預設 `output/video/<planBase>_full_<w>x<h>.mp4`。

### 11. 字幕

```bat
node workspace/tools/build_subtitles.mjs --story my_story
node workspace/tools/build_subtitles.mjs --story my_story --no-audio
node workspace/tools/build_subtitles.mjs --story my_story --film cut.mp4 --lang zh-Hant
node workspace/tools/build_subtitles.mjs --story my_story --protect 嘉年華,避難所
```

時間軸：段落起點 = manifest 實際片長累加；段落內每個 `<d>` 區塊放在該 `[Shot N]` 的
`At MM:SS.mmm`；同一區塊的多行依 `subtitles.rate`（預設 6.2 字/秒）分配，剩餘時間平均成
行距。接著掃描片段音訊（RMS 包絡），把整句落在靜音裡的 cue 移到 3 秒內最近的說話起點，
所以模型多留的半拍不會讓字幕提前出現。

輸出 `<film base>.<lang>.srt` 與 `.vtt`，並自我檢查：重疊、兩行、單行字數、破折號斷行。
有問題時結束碼為 1。`narrator` / `internal_monologue` 的 cue 會包 `<i>`。

## 端到端流程

```bat
REM 0) 一次性：確認 comfyui_mcp/metadata.json 的 url 與 output_dir
REM 1) 建立故事 + 抽出正文
node workspace/tools/new_story.mjs --name my_story --title "第一章"
node workspace/tools/extract_penana.mjs --story my_story

REM 2) 寫 plan（故事專屬 builder）與 prompts/，然後驗證
node test_story3/build_plan.mjs            REM 以 test_story3 為例
node workspace/tools/verify_plan.mjs   --story my_story
node workspace/tools/check_prompts.mjs --story my_story

REM 3) 參考圖
node workspace/tools/generate_refs.mjs --story my_story
node workspace/tools/check_refs.mjs    --story my_story

REM 4) 渲染（先 --dry-run 看模式與長度）
node workspace/tools/render_all.mjs --story my_story --dry-run
node workspace/tools/render_all.mjs --story my_story --async --no-turbo --seed 100
node workspace/tools/audit_renders.mjs    --story my_story
node workspace/tools/download_renders.mjs --story my_story

REM 5) 成片 + 字幕
node workspace/tools/concat_renders.mjs  --story my_story
node workspace/tools/build_subtitles.mjs --story my_story
```

## 前置條件

* **Node.js ≥ 20**（本機 v24）。工具只用內建模組，沒有 npm 依賴。
* **ComfyUI**：`comfyui_mcp/metadata.json`

  ```json
  {
    "comfyui": {
      "url": "http://100.106.154.88:8000",
      "output_dir": "D:\\han\\Niba\\dev\\Project21\\output",
      "timeout_sec": 900,
      "client_id": "comfyui-mcp"
    }
  }
  ```

  `output_dir` 同時是跨故事的參考圖快取根目錄。可用 `COMFYUI_MCP_METADATA` 指向別的檔案。
* **ffmpeg**：優先用 `FFMPEG_PATH`；否則用 `gen_video/node_modules/ffmpeg-static/ffmpeg.exe`；
  再否則找系統 `ffmpeg`。本機沒有 `ffprobe`，所以 `probe()` 解析 `ffmpeg -i` 的 stderr。
* **模型**：`minimax_t2v` / `minimax_r2v`（含 `minimax_h3_fl2v_turbo_8step` LoRA）、
  `z_image_t2i`（`zImageUltimateNSFW_v20` + `qwen_3_4b` + `ae`）。用 `comfy_status` 先做預檢。

## 從 test_story3 遷移

`test_story3` 已經是新結構的範例：

* `story.json`：`352×608`、24 fps、`turbo:false`、字幕保護詞。
* 素材：`output/render/plan.ch0/` → `test_story3/output/render/plan.ch0/`。
* 成片：`output/video/plan.ch0*` → `test_story3/output/video/`。
* `render_manifest.json` 內的絕對路徑已改寫；`references` 仍指向共用的 `output/refs/`。
* 舊的通用腳本（`concat_renders.mjs`、`build_subtitles.mjs`、`check_refs.mjs`、
  `check_render_history.mjs`、`download_renders.mjs`、`verify_plan.mjs`、`extract_story.mjs`、
  `generate_refs.mjs`）已刪除，改用 `workspace/tools/` 的同名工具。
* 故事專屬的 `build_plan.mjs`、`data_entities.mjs`、`data_segments_*.mjs` 留在原資料夾。
* `gen_video/render_segment.mjs` 由 `workspace/tools/render_segment.mjs` 取代。

舊指令對照：

| 舊 | 新 |
|---|---|
| `node gen_video/render_segment.mjs --plan test_story3/plan.ch0.json --seg seg_009 --prompt ...` | `node workspace/tools/render_segment.mjs --story test_story3 --seg seg_009` |
| `node test_story3/concat_renders.mjs` | `node workspace/tools/concat_renders.mjs --story test_story3` |
| `node test_story3/build_subtitles.mjs` | `node workspace/tools/build_subtitles.mjs --story test_story3` |
| `node test_story3/verify_plan.mjs` | `node workspace/tools/verify_plan.mjs --story test_story3` |
| `node test_story3/generate_refs.mjs` | `node workspace/tools/generate_refs.mjs --story test_story3` |
| `node test_story3/download_renders.mjs` | `node workspace/tools/audit_renders.mjs --story test_story3` 然後 `download_renders` |

回歸結果：重建的成片 79 段、81.06 MB、557.67 秒（00:09:17.67）；字幕 141 cue、
21 個兩行、0 重疊、0 破折號斷行、15 個 cue 經音訊對齊，與舊版 SRT 位元組完全相同。

## FAQ

**Q：可以從故事資料夾裡面跑嗎？**
可以。`--story` 省略時就是目前目錄：

```bat
cd test_story3
node ..\workspace\tools\verify_plan.mjs
```

**Q：多個 plan 怎麼辦？**
放在同一個故事資料夾時，用 `story.json` 的 `plan` 指定，或每次 `--plan`。
`planBase` 取自檔名，所以 `plan.ch1.json` 的素材會到 `output/render/plan.ch1/`，
成片是 `plan.ch1_full_<w>x<h>.mp4`，兩個 plan 不會互蓋。

**Q：為什麼 seed 每次都不一樣？**
`render_segment` / `render_all` 沒給 `--seed` 時用時間戳，方便抽新 take。要固定就
`--seed 100`；manifest 會記下來，之後可重現。

**Q：參考圖會不會被新故事覆蓋？**
不會。只有 `test_story3` 這種在 plan 裡寫死 `reference.image` 的舊資料會指向
`refs/<entity>`；新故事預設 `refs/<story.name>/<entity>`。要強制共用就自己填
`reference.image`。

**Q：t2v 幹嘛還要參考圖？**
t2v 不把圖送進模型，但參考圖是「外觀錨點」：寫 prompt 時拿它對照，角色才不會每段換臉。
要真的把圖綁進渲染，那段改用 `.r2v.txt`（`<Picture N>`），或 `--first-frame` 做 i2v。

**Q：`concat` 後聲音畫面不同步？**
先用 `--reencode`。串流複製要求每段 codec/時間基一致；只要有一段是別台機器或別版模型輸出，
接點就可能漂。`--reencode` 會統一成 24 fps、AAC 48 kHz 立體聲。

**Q：字幕某一詞被拆成兩行？**
把詞加進 `story.json` 的 `subtitles.protect`（或暫時 `--protect 詞A,詞B`）。
換行器會在 30%–70% 之間找分數最高的切點，保護詞被切開會重扣分。

**Q：`audit_renders` 說沒有輸出，但 ComfyUI 上跑完了？**
`/history` 可能已被清除，或 job 是用別的 client 送出。重新用 `render_segment --async`
送一次即可；manifest 以最新送出的 `prompt_id` 為準。

**Q：Windows 主控台中文變亂碼？**
那是 PowerShell 的顯示編碼，不是檔案內容。檔案一律 UTF-8（無 BOM）。要正常顯示先跑
`chcp 65001`，或把工具的 JSON 輸出導到檔案再開。
