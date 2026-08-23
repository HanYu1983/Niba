# project1 對齊系統設計 — AI 工程師實作指引

**讀者**：在 Cursor／其他 AI 輔助環境中修改 `project1` 的工程師或代理。  
**權威設計來源**：工作區 `.cursor/skills/ad-automation-system-design/design/*.md`（與該技能 `SKILL.md` 索引）。實作前應先對照，避免契約與行為靜默漂移。

---

## 1. 必守不變量（Invariants）

1. **秘密不得進 JSON**：輸入／結果 JSON 僅含 `credentialCustomId` + `platform` 等鍵，不含 token、refresh token、client secret。
2. **封套外層語意**：`platform`、`credentialCustomId`、`startDate`、`endDate` 在**單一結果檔**根層與輸入封套一致；列上 `items[]` **不重複**這些外層欄位（見 `design/input-model.md`、`design/result-json.md`）。
3. **評估上下文**：列資料用 `AdRow`；平台／憑證／來源檔／期間來自**該列所屬來源檔**外層（見 `design/conditions.md`）。
4. **一進入點、一組條件**：同一次 `Runner.run` 內合併後的列集合共用同一 `ConditionSet`（見 `design/conditions.md`）。
5. **多檔合併規則**：若產出**單一**結果檔，各檔外層 `platform`／`credentialCustomId`／`startDate`／`endDate` **必須一致**；並以 `(platform, credentialCustomId, adId)` 處理重複鍵（見 `design/input-model.md`「多檔輸入」）。

---

## 2. 已知缺陷與設計落差（優先修復）

### P0 — 行為錯誤

| 問題 | 位置 | 預期行為（設計） | 建議修復 |
|------|------|------------------|----------|
| 資料夾內多個 `.json` 指向**單一輸出檔**時，僅處理第一個成功載入的檔案 | `AdAutomation.Runner/Runner.fs`（約 `loaded.[0]` 分支） | 要麼**合併**所有檔的 `items`（外層一致時），要麼**明確失敗**並將原因寫入結果 `errors`，**不得**靜默捨棄檔案 | 實作「合併模式」或「拒絕多檔單輸出」二選一；若保留「每檔一結果」模式，僅在輸出為**目錄**時啟用現有多檔行為 |

### P1 — 契約／上下文不完整

| 問題 | 位置 | 預期 | 建議 |
|------|------|------|------|
| 輸入缺少結構化驗證 | `Runner.loadEnvelope` | 外層與列上必填欄位依 `input-model.md` | 新增 `validateSystemInput`（或同等），錯誤進 `SystemOutput.Errors` |
| `EvaluationContext` 缺批次時間 | `AdAutomation.Core/Domain.fs` | `conditions.md` 建議含批次基準時間 | 新增欄位，例如 `BatchAt: DateTimeOffset`，由 `Runner` 在每次 run 注入 |
| 條件內打 API 的組裝方式未在型別層表達 | `Abstractions.fs` | 由 composition root 注入解析器／平台用戶端 | 新增介面（例如憑證解析、可選 `PlatformAdQuery`），**不要**在 `ConditionSet` 子類別硬編環境變數 |

### P2 — 可觀測性

| 問題 | 位置 | 預期 | 建議 |
|------|------|------|------|
| 無錯誤匯流抽象 | 各 `Program.fs`、`Runner` | `design/observability-security.md` 之 `IErrorSink` 概念 | 在 `AdAutomation.Core` 定義極簡介面；`Runner` 在解析失敗、合併衝突、寫檔失敗時呼叫；預設實作可為 stderr 或 no-op |

---

## 3. 重構與去重（語意重疊處）

### 3.1 領域型別

- **`Decision.Platform`**：與 `EvaluationContext.Platform` 重疊；結果 JSON 列級**不應**承載 `platform`（見 `result-json.md`）。**建議**：自 `Decision` 移除 `Platform`，或改為內部稽核用型別且不進入序列化。
- **`metadata` 讀寫**：輸入使用 `MetadataObjectMapConverter`；`Runner.writeSystemOutputFile` 以手動 `JsonObject` 寫出，可能與「嵌套 JSON 字串」語意不一致。**建議**：抽出與 converter **相同規則**的寫出邏輯，或輸出改走 `JsonSerializer` + 共用選項。

### 3.2 `AdPlatform.Google`

- **重複的 JSON 工具**：`GoogleAdsPlatformAdQuery.fs`（`GoogleAdsRowJson`）與 `GoogleAdsCredentialQuery.fs`（`GoogleAdsSearchResultRows`）皆含 `idAsString`、`tryChildId`、`normalizeDigits` 等。**建議**：新增單一 `internal` 模組集中共用；`tryMapRow` 與 `decodePath` 保留差異化邏輯。
- **憑證欄位驗證**：`GoogleAdsCredentials.tryCreate` 與 `GoogleAdsCredentialBundle.tryFromResolvedEntry` 語意重疊。**建議**：Bundle 對應 key 後**統一**呼叫 `tryCreate`，錯誤訊息單一來源。

### 3.3 JSON 選項與 CLI

- **`JsonSerializerOptions`**（camelCase、indent、relaxed escaping）在 `Runner`、`AdPlatform.Google/Program.fs`、`GoogleAdsCredentialQuery` 重複。**建議**：共用靜態工廠（例如 `AdAutomation.Core` 或 Runner 內 `JsonOptions` 模組）。
- **`App1/Program.fs` 與 `App2/Program.fs`**：除預設路徑與 `ConditionSet` 外幾乎相同。**建議**：抽共用 CLI 解析與結束碼列印（極薄模組即可）。

### 3.4 架構接線

- **`AdAreaRouting`**：設計要求條件端以 `area` 解析 region；目前未接入 `ConditionSet`。**建議**：在需要呼叫區域相關 API 的進入點注入 `AreaRouting`（或介面），參數為 `row.Area` + `ctx.Platform`。
- **`GoogleAdsPlatformAdQuery`**：建構子直接接受 `GoogleAdsCredentials`，與「一律經 `AdCredentials`」的敘事並存即可：文件與範例優先展示 `GoogleAdsCredentialQuery`／store 路徑；直傳 credentials 保留給測試與進階組裝。

---

## 4. 建議實作順序（給代理的執行順序）

1. **修正多檔 + 單一輸出路徑**（P0）：合併或拒絕，並有測試或可重現的範例目錄。
2. **輸入驗證** + **`EvaluationContext.BatchAt`**（P1）。
3. **`metadata` 寫出對稱** + **Google internal 模組去重**（3.2、3.1）。
4. **`Decision` 精簡** + **CLI 共用** + **可選 `IErrorSink`**（3.1、3.3、P2）。
5. **文件**：還原或新增 `docs/SYSTEM_DESIGN.md` 索引（若 repo 需人類導覽）；並更新技能內 `design/project-map.md` 若與現況不符（例如 `AdAreaRouting` 已存在）。

---

## 5. 驗收檢查清單（代理自測）

- [ ] 同一資料夾內兩個合法輸入 JSON、**單一輸出檔**：要麼合併後列數正確，要麼 `errors` 說明不可合併，**不可**只處理第一個檔。
- [ ] 兩檔外層 `credentialCustomId` 不同但同一 `adId`：行為符合設計（建議錯誤進 `errors`）。
- [ ] 缺 `adId`／空字串外層：拒絕並進 `errors`，不產生靜默錯誤結果。
- [ ] 結果 JSON：`items[]` 無 `reason`；根層含 `platform`、`credentialCustomId`、`startDate`、`endDate`（與現有 `Runner.writeSystemOutputFile` 契約一致）。
- [ ] `dotnet build` 通過整個 solution（路徑：`project1/project1.sln`）。

---

## 6. 關鍵檔案索引

| 區域 | 路徑 |
|------|------|
| 領域與條件抽象 | `AdAutomation.Core/Domain.fs`、`Abstractions.fs` |
| 管線 | `AdAutomation.Runner/Runner.fs` |
| 範例條件 | `App1/DemoAdPlatform.fs`、`App2/ConditionSet.fs` |
| 憑證 | `AdCredentials/*.fs` |
| Google 平台 | `AdPlatform.Google/*.fs` |
| 地區路由 | `AdAreaRouting/AreaRouting.fs` |

---

## 7. 與人類文件的關係

- 深度設計段落以 **skill 目錄下 `design/*.md`** 為準；本檔僅濃縮**要做什麼**與**檔案級線索**。
- 若實作與某篇 `design/*.md` 衝突：**先停**並在 PR／提交說明註明「改程式或改文件」的決策，避免單方面漂移。

---

*產出目的：讓後續 AI 或人類在單一文件內取得對齊設計的修復順序、不變量與驗收條件，減少重複探索 repo 的成本。*
