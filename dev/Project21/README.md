# json-editor — 用路徑操作 JSON 的 MCP server

給 agent 用的 JSON 工具：**先看樹、再定位、只改那一個節點**，不需要把整個檔案讀進 context，也不靠字串比對改檔案。

以本 repo 的 `dev/GundamCard2/bun/GundamCard.json`（3.97 MB、`$.data` 有 4310 筆）實測：

| 動作 | 耗時 |
|---|---|
| 讀檔 + parse | 69 ms |
| 看根層結構 | 49 ms |
| 改一個欄位（含 before/after diff） | 12 ms |
| 原子寫回（保留 CRLF / 2 空格縮排） | 69 ms |

---

## 檔案結構

```
dev/Project21/
  mcp_server_stdio.mjs   stdio 進入點（給 opencode / Claude Desktop 用）
  mcp_core.mjs           12 個工具的註冊與共用邏輯
  lib/
    jsonpath.mjs         路徑解析、展開、讀寫單一節點
    jsonfile.mjs         讀檔、JSONC 容錯、格式偵測、原子寫入
    diff.mjs             路徑層級的結構 diff
    inspect.mjs          樹狀瀏覽、query、find、統計
    patch.mjs            RFC 6902 風格的批次 patch
  test/
    smoke.mjs            18 項檢查（路徑引擎 + MCP 端到端）
    stdio.mjs            真的 spawn 一個 server 驗證 stdio
  opencode.json          可直接引用的註冊範例
```

## 安裝

```powershell
cd D:\han\Niba\dev\Project21
npm install
npm test          # 18 checks passed
node test/stdio.mjs
```

## 註冊到 opencode

把 `opencode.json` 的內容併進你的設定（專案層放 repo 根目錄的 `opencode.json`，或放全域設定）：

```json
{
  "mcp": {
    "json-editor": {
      "type": "local",
      "command": ["node", "D:\\han\\Niba\\dev\\Project21\\mcp_server_stdio.mjs"],
      "enabled": true
    }
  }
}
```

重啟 opencode 後應該會看到 `json-editor` 的 12 個工具。

---

## 工具一覽

### 讀

| 工具 | 用途 |
|---|---|
| `json_inspect` | **看一層樹**：key/index、型別、大小，可排序（`sort:size` 找出肥大的欄位）、分頁、regex 過濾 key。往下鑽就再呼叫一次帶子路徑。 |
| `json_get` | 取單一路徑的值（不支援萬用字元），可截斷長字串。 |
| `json_query` | JSONPath 查詢，回傳**每個命中項的實際路徑**，方便接著逐一 `json_set`。 |
| `json_find` | 不知道資料在哪時用：按 key 名稱或值搜尋（`eq｜contains｜regex｜gt｜gte｜lt｜lte｜type`）。 |
| `json_validate` | 批次檢查檔案是否合法，回報大小、節點數、深度、縮排、EOL、BOM、sha256。 |
| `json_diff` | 兩個檔案（或兩個節點）的結構 diff，只列變更的路徑。 |

### 寫（全部走「讀 → 記憶體修改 → diff → 原子寫回」）

| 工具 | 用途 |
|---|---|
| `json_set` | 設定單一節點，`create:true` 可沿途建立不存在的 key/index；`path:"$"` 換掉整份文件。 |
| `json_merge` | RFC 7386 merge patch，適合「只更新這三個欄位」，陣列／純量則整段取代。 |
| `json_remove` | 刪除節點；陣列是 splice（後面元素前移），不是填 null。 |
| `json_array_op` | `push / unshift / insert / pop / shift / remove_index`，附加新資料不必自己算 index。 |
| `json_patch` | **一次套用多個操作**：`add / remove / replace / move / copy / test`，任何一個失敗就整批不寫入。20 個欄位改動 = 1 次讀寫。 |
| `json_format` | 只重排格式（縮排／EOL／排序 key），不改資料；內容相同時回報 `unchanged`。 |

所有寫入工具都支援：

- `dry_run` — 只回 diff，不動檔案
- `expect_sha256` — 樂觀鎖，檔案在讀取後被別人改過就拒絕寫入
- `backup` — 寫入前複製一份 `<file>.bak`

回傳長這樣（`changes` 是實際變更數，`diff` 只列路徑與前後值）：

```json
{
  "status": "updated",
  "file": "D:\\han\\Niba\\dev\\GundamCard2\\bun\\GundamCard.json",
  "changes": 1,
  "diff": [{ "op": "replace", "path": "$.data[0].test_field", "before": null, "after": 123 }],
  "sha256_before": "…",
  "sha256": "…",
  "bytes": 3970964
}
```

---

## 路徑語法

```
$                      根
.key  ['key']          物件成員（有空格或符號時用引號）
[0]  [-1]              陣列索引，負數從尾端算
[1:5]  [::2]           切片
[*]  .*                全部成員 / 全部元素
$..key  $..[*]         遞迴下降
[-]                    附加（只用在 json_patch 的 add）
```

不支援 filter 表達式 `[?(@.x==1)]` — 那類需求請用 `json_find`（按 key／值搜尋），效果一樣且回傳的仍是實際路徑。

範例：

```
$.cards[0].skills[2].name        → "beam"
$.cards[*].id                    → 所有卡片的 id
$..name                          → 任何層級的 name
$['weird key']["another one"]
```

---

## 典型工作流

```text
1. json_inspect  {file, sort:"size"}                    → 檔案有哪幾塊、誰最大
2. json_inspect  {file, path:"$.data", limit:20}         → 陣列元素長什麼樣
3. json_query    {file, path:"$.data[*]", max_value_chars:80}
4. json_find     {file, key:"id", value:179901}          → 找到實際路徑
5. json_set      {file, path:"$.data[3].hp", value:5000, dry_run:true}
6. json_patch    {file, ops:[...]}                       → 批次改，一次寫入
7. json_validate {files:[file]}
```

## 設計上的取捨

- **只改一個節點也要重寫整個檔案**：JSON 沒有定址寫入，這是必然。但寫入是 tmp + rename 的原子替換，不會留下半截檔案；4 MB 實測 69 ms。
- **格式會保留**：縮排、CRLF/LF、BOM、結尾換行都會沿用原檔。key 順序不動，只重排被改動的那個位置。
- **JSONC 是唯讀語意**：`lenient:true` 可以讀帶註解／尾逗號的檔案（例如 `tsconfig.json`），但寫回時註解會消失，回傳會帶 `lossy:true` 與 `warning`。要保留註解就別用這個工具寫。
- **不偵測重複 key**：`JSON.parse` 會默默採最後一個。若你的產生器可能輸出重複 key，先用 `json_validate` 以外的方式檢查。

## 已知限制

- 沒有 filter 表達式、沒有函式、沒有腳本運算（刻意，避免在資料裡執行邏輯）。
- `json_diff` 的陣列是**按索引**比較，插入一筆會讓後面全部顯示成 replace。要比對「移動」後的內容請先排序或用 id 對照。
- `json_find` 的 `value` 只比對純量；要比對整個物件請用 `json_query` + `json_diff`。
