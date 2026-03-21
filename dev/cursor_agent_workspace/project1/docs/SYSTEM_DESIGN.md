# 廣告自動條件判斷「開始」系統 — 系統設計（索引）

| 項目 | 說明 |
|------|------|
| 狀態 | 草案（供討論與迭代） |
| 閱讀方式 | **漸進式披露**：本頁為總覽與導覽；細節正文在 **Cursor 專案技能** [`.cursor/skills/ad-automation-system-design/design/`](../../.cursor/skills/ad-automation-system-design/design/)（`docs/design` 僅保留導向說明）。 |

## 一頁摘要

- **條件判斷端**：指定資料夾內多份輸入 JSON → 合併 → **一組條件**逐列評估 → 寫出**結果 JSON**。
- **不**在本行程內實作「對平台開／關」；**下游系統**讀結果檔後再呼叫各平台 API。
- 每份輸入 JSON **外層**含 **`platform`**、**`credentialCustomId`**；`items` 每列含 **`adId`**（階層編碼）等。憑證經 **AdCredentials** 等共用專案解析，**秘密不進 JSON**；[結果 JSON](../../.cursor/skills/ad-automation-system-design/design/result-json.md) 將 `platform`／`credentialCustomId`／`startDate`／`endDate` 置於**檔案根層**，`items` 為列級決策（與設計篇一致）。
- **AdPlatform.***（每平台一專案）統一封裝**查詢**與**操作** API，條件端與下游共用同一憑證對照規則。
- **下游**讀結果檔後**必須**依 `(platform, credentialCustomId)` **分組**，再依平台 API 限制**分批**呼叫；**預設每批 100**（可設定）。
- **進入點主程式**預留**錯誤輸出抽象**（如 `IErrorSink`），可接 Slack 等，與結果 JSON 的 `errors` 並用。

## 建議閱讀順序

適合第一次從頭讀：依序點開下列連結即可。

1. [概覽與目標](../../.cursor/skills/ad-automation-system-design/design/overview.md)
2. [名詞與範圍](../../.cursor/skills/ad-automation-system-design/design/glossary-and-scope.md)
3. [架構與專案分層](../../.cursor/skills/ad-automation-system-design/design/architecture.md)
4. [輸入資料模型（JSON）](../../.cursor/skills/ad-automation-system-design/design/input-model.md)
5. [條件邏輯（進入點綁定）](../../.cursor/skills/ad-automation-system-design/design/conditions.md)
6. [結果 JSON（下游契約）](../../.cursor/skills/ad-automation-system-design/design/result-json.md)
7. [端到端流程](../../.cursor/skills/ad-automation-system-design/design/end-to-end-flow.md)
8. [可觀測性與安全](../../.cursor/skills/ad-automation-system-design/design/observability-security.md)
9. [與 `project1` 程式對照](../../.cursor/skills/ad-automation-system-design/design/project-map.md)
10. [待確認議題](../../.cursor/skills/ad-automation-system-design/design/open-questions.md)

## 主題速查

| 想了解… | 開這篇 |
|---------|--------|
| 為何要做、邊界在哪 | [概覽](../../.cursor/skills/ad-automation-system-design/design/overview.md)、[名詞與範圍](../../.cursor/skills/ad-automation-system-design/design/glossary-and-scope.md) |
| Mermaid 圖、誰負責什麼、共用專案怎麼切 | [架構](../../.cursor/skills/ad-automation-system-design/design/architecture.md) |
| `startDate` / `endDate`、多檔合併、`credentialCustomId` | [輸入資料模型](../../.cursor/skills/ad-automation-system-design/design/input-model.md) |
| 一進入點一組條件、評估上下文 | [條件邏輯](../../.cursor/skills/ad-automation-system-design/design/conditions.md) |
| 給下游的 JSON 長相與必填欄位 | [結果 JSON](../../.cursor/skills/ad-automation-system-design/design/result-json.md) |
| 從啟動到寫檔的步驟 | [端到端流程](../../.cursor/skills/ad-automation-system-design/design/end-to-end-flow.md) |
| 日誌、祕密、檔案權限、錯誤→Slack 抽象 | [可觀測性與安全](../../.cursor/skills/ad-automation-system-design/design/observability-security.md) |
| solution 裡大概對應哪些專案 | [project 對照](../../.cursor/skills/ad-automation-system-design/design/project-map.md) |
| 尚未定案的選項 | [待確認議題](../../.cursor/skills/ad-automation-system-design/design/open-questions.md) |

---

單檔全文已拆成上述多篇；若需列印或送審「完整合訂本」，可依「建議閱讀順序」串接各檔即可。
