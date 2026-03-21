# 待確認議題（討論清單）

[← 上一篇：與 project1 對照](project-map.md) · [回到索引](../../../../project1/docs/SYSTEM_DESIGN.md)

1. **日期格式**：僅日期（`YYYY-MM-DD`）或必含時區之日期時間？`endDate` 是否含當日終了？
2. **多檔合併**：`(platform, adId)` 重複時採覆蓋、拒絕或合併 metadata？
3. **子目錄**：是否支援遞迴掃描？預設關閉是否可接受？
4. **部分失敗**：單檔解析失敗時，其餘檔是否仍產出結果？`errors` 與 `items` 並存原則？
5. **結果檔命名**：固定路徑覆寫 vs `result-{runId}.json` vs 每日一檔？
6. **編碼字元集**：`.` 是否允許出現在某一層 id 內？
7. **三態決策**：是否需要明確的「不變更」並在結果 JSON 標示，供下游跳過？
8. **`credentialCustomId` 唯一性**：在單一 `platform` 下是否全域唯一？是否需前綴區分環境（如 `prod:` / `stg:`）？
9. **讀寫身分分離**：查詢與操作是否永遠同一組 token？若否，是否改為兩個欄位（如 `credentialCustomIdRead` / `credentialCustomIdWrite`）？
10. **解析失敗**：未知 `credentialCustomId` 時，該列寫入 `errors` 還是整批失敗？
11. **批次大小**：預設 `100` 是否各平台覆寫表（例如 Meta／Google 不同上限）集中放在 `AdPlatform.*` 或設定檔？
12. **錯誤通知**：哪些錯誤等級必送 Slack／哪些僅寫 `errors` 與 log？

---

定案後建議補：**結果 JSON 的 JSON Schema**、`adName` 命名規則與驗證、憑證庫對照表範本、`area`→平台 API region 對照表、下游狀態機（已讀／已套用／失敗重試）、**各平台 batch 上限對照表**。
