# 可觀測性、設定與安全

[← 上一篇：端到端流程](end-to-end-flow.md) · [回到索引](../SYSTEM_DESIGN.md) · [下一篇：與 project1 對照 →](project-map.md)

## 可觀測性與稽核

- 結構化日誌：`runId`、輸入檔、列鍵 `(platform, adId, credentialCustomId)`、`desiredState`、`reason`（**不**記錄 token 或金鑰內容）。
- 結果 JSON 本身即為**給營運／對帳**的主要稽核載體之一；可與憑證庫變更紀錄交叉比對「某鍵曾對應哪一帳戶」。
- 避免在 JSON 或日誌中寫入秘密（token、完整私鑰）。

## 錯誤輸出抽象（主程式／進入點）

條件判斷端**主程式**（各進入點的 `Program` 或 orchestration 層）應預留**與實作無關的錯誤匯流排**，將「可通知人的失敗」與「僅寫檔／exit code」分離，便於接上 Slack、Email、PagerDuty 等。

**建議抽象（概念）**

- 定義 **`IErrorSink`**（或同等）：例如 `ReportAsync(嚴重度, 訊息, 可選結構化內容)`；實作可為：
  - **Null／Console**：開發預設，僅 stderr／不送出。
  - **Slack**：透過 Webhook／Bot API 發送摘要（含 `runId`、檔名、列鍵、例外類型；**不**附秘密）。
  - **複合**：同時寫日誌與 Slack。
- **觸發時機（示例）**：輸入 JSON 驗證失敗、合併規則衝突、單列條件評估未捕獲例外、寫結果檔失敗等；細則由進入點與 [待確認議題](open-questions.md) 定案。
- **與結果 JSON `errors` 的關係**：`errors` 陣列供機器／下游消費；**Slack 等人讀通道**透過 `IErrorSink` 送**摘要**，兩者可並存，避免把整份 JSON 貼進聊天室（可選附結果檔路徑或 `runId` 連結）。

下游廣告操作專案亦可採**相同模式**（共用介面定義於 `AdAutomation.Core` 或獨立 `AdAutomation.Observability`），讓批次 API 失敗時一致告警。

## 設定與安全

- **秘密僅存在憑證管理後端**（或本機受控儲存），由 `credentialCustomId` + `platform` 在執行期解析；**不**寫入輸入／結果 JSON，**不**寫入結構化日誌正文。
- `credentialCustomId` 可公開於 JSON 與版控之列表檔，但仍屬**營運敏感**（可推測帳戶結構），建議權限與稽核與內部文件同級管理。
- 輸入資料夾與輸出檔路徑權限：僅必要帳號可寫入結果目錄，避免被竄改；防止惡意替換 `credentialCustomId` 導致操作到他帳。
