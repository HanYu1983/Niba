# 故事範本生成系統說明

本文說明 `story_test/` 底下故事範本如何透過 `story.js` 產生圖片，以及各檔案之間的關係。

## 檔案角色總覽

| 檔案 | 角色 | 說明 |
|------|------|------|
| `story.js` | 主程式 | 讀取 story + config + workflow，逐幕拼出提示詞，丟給 ComfyUI 生成圖片 |
| `comfy.js` | ComfyUI API 客戶端 | 包裝 `/prompt`、`/history`、`/view`、`/upload/image`、WebSocket 等呼叫 |
| `story.json` | 故事定義 | 故事大綱、通用風格、`prompt_template`、各幕 `scenes` 清單 |
| `story_config.json` | 角色設定 | 角色描述、衣著、稱呼（`{{person1_*}}`、`{{person2_*}}` 等 token 來源） |
| `story_t2i.json` / `story_t2i_hd.json` | 工作流 (workflow) | ComfyUI API 格式節點圖，決定用哪個 checkpoint / sampler |
| `docker-compose.yml` | 執行環境 | 定義 `comfy-client`（CLI 批次出圖）與 `story-server`（網頁 UI） |
| `server.js` | 網頁 UI | 列出 story/config/workflow 供選擇並呼叫 `story.js` |
| `index.js` | 單張生圖客戶端 | 給單張 prompt 用的簡易 CLI（`-p`、`-s`、`-w`...） |

## 命名的對應關係

一套故事 = 一個 `story_<主題>.json` + 一個 `story_config_<主題>.json`：

- 故事：`story_ocean.json` ↔ 設定：`story_config_ocean.json`
- 故事：`story_dq.json` ↔ 設定：`story_config_dq.json`
- 故事：`story_ghost.json` ↔ 設定：`story_config_ghost.json`
- 故事：`story_coffee.json` ↔ 設定：`story_config_coffee.json`
- 故事：`story_cyberpunk.json` ↔ 設定：`story_config_cyberpunk.json`
- 故事：`story_photoshoot.json` ↔ 設定：`story_config_photoshoot.json`

預設檔名（未帶參數時）：`story.json` + `story_config.json` + `story_t2i.json`。

## 執行流程（story.js）

```
docker compose run --rm comfy-client node story.js \
  <story.json> <workflow.json> <輸出目錄> <開始幕> <結束幕> \
  <story_config.json> [場景指定] [尺寸JSON] [基礎seed]
```

實際範例（來自 docker-compose.yml 註解）：

```
docker compose run --rm comfy-client node story.js story_ocean.json story_t2i.json output 1 10 story_config_ocean.json
docker compose run --rm comfy-client node story.js story_ghost.json story_t2i_hd.json story_ghost_output 1 10 story_config_ghost.json "1-10" "[[1024, 1024], [832, 1216], [1216, 832]]"
```

參數說明：

| 位置 | 參數 | 預設值 | 說明 |
|------|------|--------|------|
| 2 | 故事檔 | `story.json` | 故事劇本 |
| 3 | 工作流檔 | `story_t2i.json` | ComfyUI workflow（`_hd` 版解析度更高） |
| 4 | 輸出目錄 | `story_output` | 圖片寫入位置 |
| 5 | 起始幕 | `1` | 幕數下限 |
| 6 | 結束幕 | `999` | 幕數上限 |
| 7 | 設定檔 | `story_config.json` | 角色設定 |
| 8 | 場景指定 | 無 | `"1,3,5"` 或 `"2-4"` 或 `"7"`，有給就覆寫 5/6 |
| 9 | 尺寸 JSON | 取自 story 的 `sizes` | 例如 `"[[832,1216],[1216,832]]"` |
| 10 | 基礎 seed | 隨機 | 每個幕實際 seed = `(baseSeed + scene.seed + 尺寸索引) >>> 0` |

### 步驟拆解

1. **讀檔**：讀入 story、config、workflow 三個 JSON。
2. **解析參數**：解析場景範圍與尺寸清單。
3. **攤平 token**：把 config 與 story 遞迴攤平成 `{ "a.b": "值" }` 的 token 對照表（`flatten()`）。
4. **定位節點**：用 `findNodes()` 在 workflow 中找出 `CLIPTextEncode`（正/負）、`KSampler`/`KSamplerAdvanced`、`EmptySD3LatentImage`。
   - 負向節點判斷：`inputs.text` 含 `bad|low quality|negative|低品質|模糊|水印` 等關鍵字。
5. **逐幕逐尺寸生成**：
   - 組出該幕完整 prompt（詳見下方「模板引擎」）。
   - 寫入 `posNode.inputs.text`（與 `negNode.inputs.text`）。
   - 依尺寸設定 `latentNode` 的 width/height。
   - 計算 `sceneSeed` 並寫入 sampler。
   - 開 WebSocket → `queuePrompt()` → `waitForCompletion()` 輪詢 `/history`。
   - 下載圖片存成 `story_NN_WxH.png`（NN 為幕數補零）。

## 模板引擎

### 兩個層級的替換來源

組合最終 prompt 時，token 來源由 `story.js` 合併兩者：

```js
const tokens = { ...flatten(config), ...flatten(story) };
```

- `story_config.json` → 角色層：`person1_desc`、`person1_clothing`、`person1_ref`、`person2_desc`、`person2_clothing`、`person2_ref`
- `story.json`（不含 scenes）→ 故事層：`title`、`story_setting`、`lighting`、`style`、`negative_common` 等

每一幕再疊上 `flatten(scene)`（局部 token，如 `seed`、`title`），組成 `local`。

### 替換規則 `substitute()`

- 正規式 `/\{\{([^}]+)\}\}/g` 抓出所有 `{{key}}`。
- key 在 token 清單中就換成值；找不到則保留原文。
- 巢狀物件用點號路徑：`{a:{b:"x"}}` → token `a.b`。

### 一幕 prompt 怎麼拼出來

```
scene_part      = substitute(scene.scene_part)                       // 不一定有
scene_context   = substitute(scene.scene_context 去尾(。！？!?))        // 沒寫則空字串
scene_action    = substitute(scene.scene_action  去尾(。！？!?))
prompt  = substitute(story.prompt_template, { ...local, scene_part, scene_context, scene_action })
negative = substitute(story.negative, local)
seed    = scene.seed
```

在 `story.json` 中，`prompt_template` 使用了 `{{scene_context}}`、`{{scene_action}}`、`{{lighting}}`、`{{style}}`、`{{person1_ref}}`、`{{person1_desc}}`、`{{person1_clothing}}`、`{{person2_*}}`；而每幕在自己的 `scene_context` / `scene_action` 內又可用 `{{story_setting}}`、`{{antagonist_desc}}`、`{{person1_ref}}` 等 token，形成兩層替換。

範例組裝（逃出金字塔第 4 幕「甦醒」）：

- `scene_context`：`石棺蓋被猛然推開，{{antagonist_desc}}坐起身...` → 換成實際木乃伊描述
- `prompt_template`：「1男1女，動作冒險考古探險，{{scene_context}}，{{lighting}}，{{style}}。男性角色...」→ 全部替換後送出

## 建議新增一套故事的步驟

1. 建立 `story_<主題>.json`：
   - 填寫 `title`、`story_setting`、`lighting`、`camera`、`style`、`negative_common`、`sizes`。
   - 設計 `prompt_template`（決定角色與場景 token 的安插位置）。
   - 撰寫 10 幕 `scenes`，每幕含 `n`、`title`、`seed`、`scene_context`、`scene_action`。
   - 結尾 `"negative": "{{negative_common}}"`。
2. 建立 `story_config_<主題>.json`：
   - 填寫 `person1_desc`、`person1_clothing`、`person1_ref`、`person2_desc`、`person2_clothing`、`person2_ref`。
3. 用 docker-compose 執行（貼齊現有註解範例）：

```
docker compose run --rm comfy-client node story.js story_<主題>.json story_t2i.json output 1 10 story_config_<主題>.json "1-10"
```

## 其它細節

- **seed 規則**：`(baseSeed + scene.seed + 尺寸索引)`，同一幕不同尺寸 seed 會遞增；scene.seed 固定（如金字塔是 1001~1010、咖啡是 8001~8010）。
- **隱私/連線**：伺服器位址來自 `.env` 的 `SERVER_ADDRESS`，預設 `http://192.168.0.193:8000`（`comfy.js`）。
- **等待**：`waitForCompletion` 預設逾時 180 秒（`.env` 的 `TIMEOUT_MS`），完成與否以輪詢 `/history` 為準，WebSocket 只記錄預覽圖與進度。
- **輸出檔名**：`story_<NN>_<W>x<H>.png`，例如 `story_04_1024x1024.png`。
- **docker-compose**：
  - 掛載 `.:/app`，輸出會直接寫回本機資料夾。
  - `node_modules` 用匿名 volume 保留，避免蓋掉 image 內安裝的相依套件。
  - `story-server`（localhost:3000）是舊式網頁版 UI，本質仍是呼叫 `story.js`。