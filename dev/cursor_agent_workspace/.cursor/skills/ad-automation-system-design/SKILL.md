---
name: ad-automation-system-design
description: Aligns implementation in project1 with canonical design documents bundled in this skill (design/*.md) plus docs/SYSTEM_DESIGN.md index. Use when editing project1 AdAutomation code (Runner, Core, AdPlatform.*, AdCredentials), JSON contracts, docker-compose flows, or when the user mentions system design, input model, conditions, or downstream result JSON.
---

# project1 廣告自動化 — 對照設計文件實作

## 強制習慣（實作前／實作中）

在 **project1** 內改程式、契約或行為時：

1. **先對照**本技能目錄下 **[design/](design/)** 與 **`docs/SYSTEM_DESIGN.md`**；若設計與現況衝突，**先釐清**要改程式還是改文件，避免默默漂移。
2. **改領域型別或 JSON 形狀**（例如 `SystemInput`、`AdRow`、`EvaluationContext`、輸入／輸出 JSON）時，必讀 **[輸入資料模型](design/input-model.md)** 與 **[結果 JSON](design/result-json.md)**。
3. **改進入點、條件、Runner 流程**時，對照 **[條件邏輯](design/conditions.md)**、**[端到端流程](design/end-to-end-flow.md)**。
4. **改專案邊界、共用專案、Google／憑證**時，對照 **[架構](design/architecture.md)**、**[project 對照](design/project-map.md)**、**[可觀測性與安全](design/observability-security.md)**。
5. **編輯設計正文**時以 **`design/*.md`** 為準（與本技能同目錄）；完成後若行為與文件不一致，**在回覆中註明**（使用者未要求則不主動大改文件，但必須點出差異）。

索引總覽（人類導覽）：[SYSTEM_DESIGN.md](../../../project1/docs/SYSTEM_DESIGN.md)（自本技能目錄向上三層為工作區根，再進 `project1/docs`）。

## 主題速查（實作時開哪一篇）

| 情境 | 文件 |
|------|------|
| 輸入 JSON 外層／`items[]`、多檔合併、`platform`／`credentialCustomId` | [input-model.md](design/input-model.md) |
| 條件、`EvaluationContext`、`ConditionSet` | [conditions.md](design/conditions.md) |
| 結果檔給下游、分組批次、`desiredState` | [result-json.md](design/result-json.md) |
| 啟動→讀檔→評估→寫檔步驟 | [end-to-end-flow.md](design/end-to-end-flow.md) |
| 模組邊界、共用專案、責任切分 | [architecture.md](design/architecture.md) |
| solution 內專案對應 | [project-map.md](design/project-map.md) |
| 日誌、祕密、權限 | [observability-security.md](design/observability-security.md) |
| 名詞、範圍 | [glossary-and-scope.md](design/glossary-and-scope.md) |
| 產品目標、邊界 | [overview.md](design/overview.md) |
| 未定案選項 | [open-questions.md](design/open-questions.md) |

## 設計要點速記（與程式對齊時核對）

- **秘密**：不得進輸入／結果 JSON；憑證以 `(platform, credentialCustomId)` 經 **AdCredentials** 解析。
- **輸入封套**：`platform`、`credentialCustomId` 在**檔案外層**；`items` 列上不重複（見 input-model）。
- **評估**：`AdRow` 僅列欄位；平台／憑證／來源檔／期間在 **`EvaluationContext`**（見 conditions、現行 `Domain.fs`）。
- **下游**：結果 JSON 於**根層**帶 `platform`／`credentialCustomId`／`startDate`／`endDate`；`items` 僅列級決策欄位；依根層 `(platform, credentialCustomId)` 取憑證後對 `items` 分批（預設 100）（見 result-json）。

## 延伸閱讀

較長的閱讀順序與補充表格式內容見 [reference.md](reference.md)。
