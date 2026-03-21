# 設計文件延伸參考

正文皆在與本檔**同技能目錄**之 **[design/](design/)**；索引頁為 **`project1/docs/SYSTEM_DESIGN.md`**。

## 建議閱讀順序（首次貫穿）

1. [overview.md](design/overview.md)
2. [glossary-and-scope.md](design/glossary-and-scope.md)
3. [architecture.md](design/architecture.md)
4. [input-model.md](design/input-model.md)
5. [conditions.md](design/conditions.md)
6. [result-json.md](design/result-json.md)
7. [end-to-end-flow.md](design/end-to-end-flow.md)
8. [observability-security.md](design/observability-security.md)
9. [project-map.md](design/project-map.md)
10. [open-questions.md](design/open-questions.md)

## 實作後快速檢查

- [ ] 輸入／輸出 JSON 欄位與 **input-model**／**result-json** 是否一致（含外層 vs 列上欄位）。
- [ ] 憑證與平台鍵是否仍只經 **credentialCustomId + platform**，秘密未進 JSON。
- [ ] 若新增平台或改批次邊界，是否已對照 **architecture**／**result-json** 分組規則。
