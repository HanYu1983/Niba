# 結果 JSON（給下游開關系統）

[← 上一篇：條件邏輯](conditions.md) · [回到索引](../../../../project1/docs/SYSTEM_DESIGN.md) · [下一篇：端到端流程 →](end-to-end-flow.md)

本系統**主要產出**為結果檔；下游**只依契約讀檔**，不呼叫本進入點行程。

## 建議外層結構

```json
{
  "schemaVersion": 1,
  "runId": "550e8400-e29b-41d4-a716-446655440000",
  "generatedAt": "2025-03-21T08:00:00Z",
  "platform": "meta",
  "credentialCustomId": "brandA-tw-prod",
  "startDate": "2025-03-01",
  "endDate": "2025-03-31",
  "items": [
    {
      "adId": "act_1.cmp_9.adg_3.ad_77",
      "adName": "accName.capName.grpName.adName",
      "desiredState": "On",
      "metadata": {}
    }
  ],
  "errors": []
}
```

`platform`、`credentialCustomId`、`startDate`、`endDate` 與[輸入資料模型](input-model.md)封套外層語意一致，**整份結果檔共用同一組值**（一次執行對應一組自動化期間與憑證鍵）。若實務上需混用多組外層語境，應**分次執行**或產出多份結果檔，而非在同一檔內於列級重複外層維度。

## 欄位說明（要點）

| 欄位 | 說明 |
|------|------|
| `runId` | 本次執行唯一 id，供下游去重與對帳。 |
| `generatedAt` | 產生此檔之時間戳（建議 ISO 8601）。 |
| `platform` | 廣告平台鍵；與輸入封套外層一致，供下游選擇 SDK／API。 |
| `credentialCustomId` | 憑證自訂鍵；與輸入封套外層一致，供憑證解析。 |
| `startDate` / `endDate` | 自動化所屬期間（字串格式與輸入一致）；供下游驗證是否在允許窗內再執行開關。 |
| `items` | 每列最終決策；**必含**下游開關所需之 `adId`、`adName`、`desiredState`。`metadata` 可帶平台列級附註（鍵值皆字串）。 |
| `errors` | 解析失敗、驗證失敗、或單列評估失敗之摘要（結構可為 `{ "file", "message", "detail" }`）；與 `items` 並存策略需定案（見 [待確認議題](open-questions.md)）。 |

## 下游讀取與執行（契約提示）

- 下游應驗證 `schemaVersion`、根層與每列必填欄位完整（含根層 `credentialCustomId`）。
- 建議依根層 `startDate`／`endDate` 與自身「執行當下」決定是否套用檔內各列。

### 分組與批次呼叫（必須）

- 下游讀入檔案後，以根層 **`platform`**、**`credentialCustomId`** 取得**一組**已解析憑證與對應平台用戶端，再對 **`items`** 分批呼叫操作 API。
- 每一批次依該**廣告平台 API** 所允許的批量上限切分；**batch 大小以平台文件為準**。
- **預設 batch 大小**：若平台未另規定或設定檔未覆寫，採 **`100`** 筆／批（可為列數上限的保守預設；實際仍應以 `AdPlatform.*` 內建或設定為準）。

### 單列執行與可靠性

- 對每一批：以根層 `platform` + `credentialCustomId` 經**憑證管理共用專案**取得憑證，再經**該平台共用專案**之**操作** API 執行開／關。
- 冪等、重試、節流、**批次內部分失敗**如何回滾或重試：**下游實作**；**憑證載體**由共用專案統一，秘密仍不得寫入結果檔。

## 結果檔生命週期

- 輸出路徑由進入點參數指定（單一檔或按 `runId` 命名，需定案）。
- 是否由下游讀後歸檔、刪除或標記已處理：屬整合流程，此處不強制。
