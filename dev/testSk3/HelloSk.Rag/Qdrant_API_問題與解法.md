# Qdrant 向量搜尋問題與解法

## 問題描述

在相同環境（同一 embed 模型 `openai/text-embedding-3-small`、同一 Qdrant）下：

- **Python**（`test_qdrant_sk.py`）執行後可正常寫入並**查到向量**。
- **F#**（`TestQdrantSk.fs`）執行後寫入成功，但**搜尋結果為 0 筆**。

## 原因分析

F# 端是直接用 `HttpClient` 呼叫 Qdrant REST API，有兩處與官方 API 規格不一致，導致寫入未被正確接受，進而搜尋不到資料。

### 1. Upsert：HTTP 方法錯誤

| 項目 | Qdrant 官方 | 修正前 F# |
|------|-------------|------------|
| 方法 | **PUT** | POST |
| 路徑 | `PUT /collections/{name}/points` | `POST .../points?wait=true` |

使用 POST 時，伺服器可能回 405 或忽略請求，點沒有真正寫入。

### 2. Upsert：Request Body 結構錯誤

Qdrant 的 `PointInsertOperations` 只接受兩種格式：

- **PointsList**：`{ "points": [ { "id", "vector", "payload" }, ... ] }`
- **PointsBatch**：`{ "batch": { "ids", "vectors", "payloads" } }`（必須包在 `"batch"` 下）

修正前 F# 送的是頂層的 `ids` / `vectors` / `payloads`，**沒有外層的 `"batch"`**：

```json
{ "ids": [...], "vectors": [[...],[...]], "payloads": [...] }
```

正確的 batch 格式應為：

```json
{ "batch": { "ids": [...], "vectors": [[...],[...]], "payloads": [...] } }
```

缺少 `batch` 包裝時，API 無法正確解析，寫入失敗或未如預期。

### 3. Search：JSON 欄位命名 (snake_case)

Qdrant API 使用 **snake_case**（如 `with_payload`、`with_vector`）。  
F# 使用 `JsonNamingPolicy.CamelCase` 會把 `with_payload` 序列化成 `withPayload`，Qdrant 可能不識別而使用預設值。此問題不直接導致 0 筆，但會影響是否回傳 payload；修正後一併改為符合文件。

## 解法摘要

### Upsert

1. **改為 PUT**：使用 `HttpRequestMessage(HttpMethod.Put, url)` 並 `client.Send(req)`。
2. **Body 包一層 `batch`**：  
   `body = { batch = { ids; vectors; payloads } }`，再序列化送出。

### Search

1. **另建不轉換命名的選項**：  
   `JsonSerializerOptions(PropertyNamingPolicy = null, ...)`（例如 `jsonOptionsSnake`）。
2. **搜尋請求用該選項序列化**：  
   送出 `with_payload`、`with_vector`（與文件一致）。
3. **參數名稱**：搜尋用 `with_vector`（單數，與 API 文件一致）。

## 修正後程式要點（TestQdrantSk.fs）

- **Upsert**：  
  - 組 `batch = {| ids; vectors; payloads |}`，再 `body = {| batch = batch |}`。  
  - `PUT collections/{name}/points?wait=true`，body 用既有 `jsonOptions`（camelCase 對 batch 內欄位無妨）。
- **Search**：  
  - body 使用 `jsonOptionsSnake` 序列化，保留 `with_payload`、`with_vector`。  
  - 其餘邏輯不變。

## 驗證結果

修正後執行：

```bash
docker compose run --rm run-sk dotnet run --project HelloSk.Rag -- --test-qdrant-sk
```

- Embedding 維度：1536（`openai/text-embedding-3-small`）。
- 寫入 3 筆成功。
- 搜尋「向量資料庫與 RAG 用哪一個？」回傳 3 筆，最相關為「Qdrant 是開源向量資料庫…」（score ≈ 0.72）。

F# 與 Python 在相同模型與 Qdrant 下行為一致，可正確寫入並查到向量。

## 參考

- [Qdrant REST API - Upsert points](https://api.qdrant.tech/api-reference/points/upsert-points)（PUT、`PointInsertOperations` 之 `PointsBatch` / `PointsList`）
- [Qdrant REST API - Search points](https://api.qdrant.tech/api-reference/search/points)（`with_payload`、`with_vector` 等 snake_case 參數）
