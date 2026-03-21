# 與 `project1` 程式結構的對照（參考）

[← 上一篇：可觀測性與安全](observability-security.md) · [回到索引](../SYSTEM_DESIGN.md) · [下一篇：待確認議題 →](open-questions.md)

## 專案一覽（統計）

下表為**依目前系統設計會出現的專案類型**；名稱可隨 repo 調整。狀態欄對應 **本 workspace 內 `project1` solution**（2025-03 左右）之實際情況。

| # | 專案（示例命名） | 類型 | 狀態 | 職責摘要 |
|---|------------------|------|------|----------|
| 1 | `AdAutomation.Core` | 類別庫 | **已有** | 領域型別、輸入／結果契約、條件／編解碼等抽象、`IErrorSink` 等介面；無平台秘密。 |
| 2 | `AdCredentials` | 類別庫 | **已有** | `(platform, credentialCustomId)` → 憑證物料（本機 JSON；可換 Vault／其他後端）。 |
| 3 | `AdAreaRouting`（地區路由共用） | 類別庫 | 規劃 | 將輸入列的 `area` 映射為平台 API 所需的地區／region 代碼。 |
| 4 | `AdPlatform.Meta` | 類別庫 | 規劃 | Meta 查詢 + 操作 API、批次上限等；依賴 `AdCredentials`。 |
| 5 | `AdPlatform.Google` | 類別庫 | 規劃 | Google Ads（或 Google 行銷 API）同上；**每新增一個廣告平台即多一個 `AdPlatform.*`**。 |
| 6 | `AdPlatform.<Other>` | 類別庫 | 視需求 | 其餘平台（TikTok、LINE 等）各一專案，與上同模式。 |
| 7 | 條件判斷**進入點**（如 `App1`、`App2` 或 `AdAutomation.Runner.CampaignA`） | **可執行檔** | **已有**（示範） | CLI：輸入目錄、輸出結果 JSON；注入條件、`AdCredentials`、`AdPlatform.*`（查詢用）、`IErrorSink` 實作。**每種列表策略／條件組合可對應一個進入點專案**。 |
| 8 | **下游廣告操作**（如 `AdOps.Executor`） | **可執行檔** | 規劃 | 讀結果 JSON；依 `(platform, credentialCustomId)` 分組、分批（預設 100）呼叫操作 API；同樣依賴 `AdCredentials` + `AdPlatform.*`。 |
| 9 | `AdAutomation.Observability`（可選） | 類別庫 | 可選 | 集中放 Slack／複合 `IErrorSink` 實作，避免每個進入點複製；亦可直接做在進入點專案內。 |
| 10 | `*.Tests` | 測試專案 | 建議 | 各核心／平台專案對應單元或整合測試；設計文件未強制命名。 |

**專案數量口徑**

- **固定最少**：`AdAutomation.Core` + `AdCredentials` + **至少 1 個**進入點 + **至少 1 個**下游操作（若與進入點分開部署）。
- **隨平台線性增加**：每支援一個廣告平台 **+1** 個 `AdPlatform.*`。
- **隨業務線性增加**：每多一套「列表＋條件」組合 **+1** 個進入點可執行專案（也可合併為單一進入點用參數切換，屬實作取捨）。

---

| 位置 | 職責（與本設計對齊時） |
|------|------------------------|
| `AdAutomation.Core`（或同等） | 領域型別、條件抽象、輸入／結果契約模型（含 `credentialCustomId`）；**錯誤輸出介面**（如 `IErrorSink`）定義可置於此；**不含**平台秘密。 |
| `AdCredentials`（憑證管理共用，新建） | 解析 `(platform, credentialCustomId)`；可抽換後端。 |
| `AdAreaRouting`（地區路由共用，新建） | 解析 `area` → 平台 API 所需的地區／region 代碼；供條件端（與視需要供操作端）組裝請求。 |
| `AdPlatform.*`（每平台共用，新建） | 查詢 API + 操作 API 封裝；依賴 `AdCredentials`。 |
| 各進入點 | CLI：輸入目錄、輸出檔；注入憑證解析與平台用戶端、**錯誤匯流排實作**；綁定**一組**條件。 |
| 下游廣告操作專案 | 讀取結果 JSON；**依 `(platform, credentialCustomId)` 分組並分批（預設 100）** 呼叫操作 API；**引用相同** `AdCredentials` + `AdPlatform.*`；可注入相同 **錯誤匯流排**。 |

（現有 `project1` 程式碼為早期示範，迭代時應以上述契約與共用專案分層為準。）
