# 結果 JSON（給下游開關系統）

[← 上一篇：條件邏輯](conditions.md) · [回到索引](../SYSTEM_DESIGN.md) · [下一篇：端到端流程 →](end-to-end-flow.md)

本系統**主要產出**為結果檔；下游**只依契約讀檔**，不呼叫本進入點行程。

## 建議外層結構

```json
{
  "schemaVersion": 1,
  "runId": "550e8400-e29b-41d4-a716-446655440000",
  "entryPoint": "App1",
  "generatedAt": "2025-03-21T08:00:00Z",
  "inputDirectory": "/path/or/logical/name",
  "inputFiles": ["listing_a.json", "listing_b.json"],
  "items": [
    {
      "adId": "act_1.cmp_9.adg_3.ad_77",
      "platform": "meta",
      "adName": "accName.capName.grpName.adName",
      "credentialCustomId": "brandA-tw-prod",
      "desiredState": "On",
      "reason": "optional",
      "sourceFile": "listing_a.json",
      "startDate": "2025-03-01",
      "endDate": "2025-03-31",
      "metadata": {}
    }
  ],
  "errors": []
}
```

## 欄位說明（要點）

| 欄位 | 說明 |
|------|------|
| `runId` | 本次執行唯一 id，供下游去重與對帳。 |
| `entryPoint` | 產生此檔的進入點名稱或代碼。 |
| `inputFiles` | 實際讀取且成功解析的檔名列表。 |
| `items` | 每列最終決策；**必含**下游開關所需之 `adId`、`adName`、`platform`、`credentialCustomId`、`desiredState`。其中 `platform`／`credentialCustomId` 在[輸入資料模型](input-model.md)中位於**檔案外層**，結果列應依 `sourceFile` 對應之來源檔外層填入，與輸入一致。 |
| `sourceFile` / `startDate` / `endDate` | 建議附帶，便於下游驗證仍在自動化窗內再執行。 |
| `errors` | 解析失敗、驗證失敗、或單列評估失敗之摘要（結構可為 `{ "file", "message", "detail" }`）；與 `items` 並存策略需定案（見 [待確認議題](open-questions.md)）。 |

## 下游讀取與執行（契約提示）

- 下游應驗證 `schemaVersion`、必填欄位完整（含 `credentialCustomId`）。
- 建議依 `startDate`/`endDate` 與自身「執行當下」決定是否套用該列。

### 分組與批次呼叫（必須）

- 下游讀入 `items` 後，**必須**先依 **`(platform, credentialCustomId)`** 分組：同一組內共用**同一組已解析憑證**與同一平台用戶端實例，避免重複解析與混用身分。
- 每一組內再依該**廣告平台 API** 所允許的批量上限，將列切為多個 **batch** 依序呼叫操作 API；**batch 大小以平台文件為準**。
- **預設 batch 大小**：若平台未另規定或設定檔未覆寫，採 **`100`** 筆／批（可為列數上限的保守預設；實際仍應以 `AdPlatform.*` 內建或設定為準）。
- 不同 `platform` 或不同 `credentialCustomId` **不得**混在同一個 API batch（除非該平台 API 明文支援且共用專案已封裝）；本設計預設**不混批**。

### 單列執行與可靠性

- 對每一批：以該組之 `platform` + `credentialCustomId` 經**憑證管理共用專案**取得憑證，再經**該平台共用專案**之**操作** API 執行開／關。
- 冪等、重試、節流、**批次內部分失敗**如何回滾或重試：**下游實作**；**憑證載體**由共用專案統一，秘密仍不得寫入結果檔。

## 結果檔生命週期

- 輸出路徑由進入點參數指定（單一檔或按 `runId` 命名，需定案）。
- 是否由下游讀後歸檔、刪除或標記已處理：屬整合流程，此處不強制。
