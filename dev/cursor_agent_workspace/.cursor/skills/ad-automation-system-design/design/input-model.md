# 輸入資料模型（JSON）

[← 上一篇：架構](architecture.md) · [回到索引](../../../../docs/SYSTEM_DESIGN.md) · [下一篇：條件邏輯 →](conditions.md)

## 單一檔案外層（輸入封套，建議）

`platform` 與 `credentialCustomId` 置於**封套外層**：同一檔內所有 `items` 共用該平台與憑證鍵；若需多組憑證，請拆成多個檔案（或多個封套）處理。

```json
{
  "schemaVersion": 1,
  "startDate": "2025-03-01",
  "endDate": "2025-03-31",
  "platform": "meta",
  "credentialCustomId": "brandA-tw-prod",
  "items": [
    {
      "adId": "act_1.cmp_9.adg_3.ad_77",
      "adName": "accName.capName.grpName.adName",
      "area": "tw",
      "metadata": {
        "note": "可選"
      }
    }
  ]
}
```

## 必填欄位（外層）

| 欄位 | 型別 | 說明 |
|------|------|------|
| `startDate` | string | 自動化啟動期間**起**；建議 ISO 8601 日期或日期時間（與 `endDate` 粒度一致）。 |
| `endDate` | string | 自動化啟動期間**迄**（「是否含當日終了」見下方「日期語意」）。 |
| `platform` | string | 平台識別；與憑證解析、平台共用專案選型一致。**本檔**內所有列共用。 |
| `credentialCustomId` | string | **自定義 ID**（非秘密）：與 `platform` 一併作為憑證管理共用專案中的查詢鍵，取得**本檔**列在**平台查詢 API**與**下游操作 API**應使用的憑證。同一鍵在兩類呼叫中應解析到**同一商業帳戶／應用身分**（除非文件另定讀寫分離鍵）。 |
| `items` | array | 至少零筆；每筆為一則廣告列（不再重複 `platform`／`credentialCustomId`）。 |

## `items` 內每列必填

| 欄位 | 型別 | 說明 |
|------|------|------|
| `adId` | string | **編碼過的階層字串**（慣例為 `.` 分隔）；語意由**外層** `platform` 之編解碼規格定義。 |
| `adName` | string | 對應 `adId` 階層的名稱字串（**非秘密**），格式建議為：`accName.capName.grpName.adName`（以 `.` 分隔；段的語意由該檔 `platform` 的階層命名規則定義）。 |
| `area` | string | 地區代碼（或地區路由鍵），用於從共用專案解析出對應平台 API 所需的「地區／區域（region）代碼」。 |

## 自定義 ID 與憑證對照（設計約束）

- **不得**在輸入或結果 JSON 中放入 API key、client secret、refresh token 等秘密；**僅**在封套外層傳遞 `credentialCustomId`（與 `platform`）。
- 條件邏輯內若呼叫某平台**查詢** API：以**該列所屬檔案外層**之 `(platform, credentialCustomId)`，透過 **憑證管理專案** `Resolve(platform, credentialCustomId)`（示意）取得憑證，再交 **該平台共用專案** 的查詢用戶端發送。
- **下游廣告操作專案**對同一列執行開／關時：結果 JSON 中每列應**原樣帶出**該列對應之 `credentialCustomId` + `platform`（與輸入一致；實作上通常由管線自**來源檔外層**填入每列），走**相同**憑證解析與**相同**平台共用專案之**操作** API。
- 鍵的命名與粒度（例如「一客戶一鍵」或「一 BM 一鍵」）由營運與資安約定；需在憑證庫側維護對照表並可審計。

## `area` 與 API 地區代碼（共用路由）

- 輸入列提供 `area`，作為**地區路由**鍵。
- 當條件端（`ConditionSet`）需要呼叫某平台的查詢 API 時，應透過「地區路由共用專案」將 `area` 轉成該平台 API 所需的地區／region 代碼，再組裝請求（憑證仍取自該列所屬檔案外層之 `platform` + `credentialCustomId`）。
- 同一列的 `area` 必須在「查詢（條件端）」與「操作（下游／後續系統）」的串接中維持一致的路由邏輯；若操作端不需要 `area`，至少應明確文件說明其依賴來源（例如由 `credentialCustomId` 推導）。 

## 日期語意（`startDate` / `endDate`，建議）

- **用途一（條件）**：條件邏輯可將「目前時間（或批次基準時間）是否落在 \[startDate, endDate\]」納入規則（例如僅在檔期內允許 `On`）。
- **用途二（下游）**：下游開關系統可選擇**僅在有效期內**套用結果 JSON 中的 `desiredState`，避免過期檔案誤動作（契約層面可於結果 JSON 覆寫帶出每列或每批的有效窗）。
- **邊界**：`endDate` 為「當日 23:59:59」還是「隔日 0:00 不含」需專案定案；時區一律建議標明（UTC 或明確 offset）。

<a id="folder-merge"></a>

## 多檔輸入：資料夾掃描與合併

- 進入點啟動時指定**輸入目錄**（例如 `--input-dir ./campaigns/spring`）。
- 讀取目錄內所有副檔名為 **`.json`** 的檔案（是否遞迴子目錄可選，**預設建議：僅一層、不遞迴**，避免誤掃；若需遞迴應在文件中與旗標上明示）。
- **合併規則（建議預設）**：
  - 將各檔 `items` **串接**為單一列表，處理順序為**檔名字母序**（或明訂為修改時間序，需定案並寫入進入點說明）。串接後**每一筆列**須保留其**來源檔**外層之 `platform`、`credentialCustomId`（以及 `startDate`／`endDate`）之語意，供憑證解析與結果 JSON 使用。
  - 合併後以 **(來源檔外層之 `platform`, `credentialCustomId`, `adId`)** 作為列之唯一鍵；若重複：記錄警告或錯誤。**預設策略建議二擇一並定案**：後掃到的覆蓋先掃到的，或整批失敗拒寫結果。（若同一 `adId` 出現於不同檔且外層 `credentialCustomId` 不一致，建議**視為錯誤**並列入 `errors`，避免同一廣告誤用不同憑證。）
- **每列繼承之期間**：每筆 `item` 所屬的 `startDate`/`endDate` 預設為**來源檔案外層**之值；寫入結果 JSON 時建議保留 `sourceFile`（見 [結果 JSON](result-json.md)）以利稽核。
- 若某檔缺少 `startDate` 或 `endDate`：建議**整批拒絕**該檔並列入結果之 `errors`，或允許進入點提供**全域預設**（需設定與文件一致）。

## 選填與擴充

- `metadata`：供條件使用；可原樣出現在結果 JSON 中（可選）。
- `schemaVersion`：輸入與輸出分別演進時比對相容性。

## 廣告階層：編碼、解碼與查詢（設計延續）

- 各平台以抽象**編解碼器**將 `adId` ↔ 階層路徑轉換；條件或結果組裝階段可呼叫。
- **平台查詢**（實作於**該平台共用專案**）：以編碼 ID（與解碼後路徑視 API 需要）向平台取數；**HTTP／SDK 層使用的憑證**必須由該列所屬**來源檔外層**之 `(platform, credentialCustomId)` 經**憑證管理專案**解析，與下游操作一致。
- 結果 JSON **不**要求攜帶解碼後路徑（`decodedPath`）；需要時由下游廣告操作專案依 `adId` 與該平台編解碼器解碼後取得目標層級。
