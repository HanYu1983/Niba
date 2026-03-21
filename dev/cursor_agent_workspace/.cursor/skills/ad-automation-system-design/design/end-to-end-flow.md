# 端到端流程（單次進入點執行）

[← 上一篇：結果 JSON](result-json.md) · [回到索引](../../../../project1/docs/SYSTEM_DESIGN.md) · [下一篇：可觀測性與安全 →](observability-security.md)

1. 解析啟動參數：輸入資料夾、輸出結果路徑、可選旗標（遞迴、重複鍵策略等）；初始化**憑證管理**與所需 **平台共用專案**（查詢用）。
2. 掃描資料夾，載入所有 `.json`，逐檔驗證外層（含 `startDate`、`endDate`、`platform`、`credentialCustomId`、`items`）；逐列驗證 `items` 內必填欄位（見 [輸入資料模型](input-model.md)）。
3. 依 [輸入資料模型 — 多檔合併](input-model.md#folder-merge) 合併 `items`，附帶每列的來源檔與期間。
4. 建立評估上下文（`RunId`、批次時間、憑證解析器、平台查詢用戶端等）。
5. 對每一列執行該進入點綁定之條件（必要時以 `platform` + `credentialCustomId` 打查詢 API）→ 得到 `desiredState` 等。
6. 組裝 [結果 JSON](result-json.md)（每列**原樣帶出**與輸入一致之 `platform`、`credentialCustomId`；實作上由**來源檔外層**填入每列）並寫檔。
7. （非本行程）下游讀取結果 JSON：篩選有效期內列 → **依 `(platform, credentialCustomId)` 分組** → 組內依平台 API 限制**分批**（**預設每批 100**）呼叫**操作** API；憑證每組解析一次。
