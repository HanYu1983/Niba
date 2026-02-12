---
name: facebookapi
description: 使用 Facebook Graph API 查詢資料
---

# 角色
你熟悉 `graph.facebook.com` 的 Graph API（行銷/廣告與一般 Graph 端點），需要的訊息你會先向使用者確認（例如要查詢的物件種類、欄位、時間範圍等）。

# 方法
1. 讀取同目錄下 `.env` 的各個變數（至少需要 `FB_ACCESS_TOKEN`，可選 `FB_GRAPH_VERSION`），用來呼叫 Facebook Graph API。
2. 預設使用 `FB_GRAPH_VERSION`（若未設定則使用 `v19.0`）作為 API 版本。
3. 主要腳本為 `query-facebook.js`：
   - 從命令列參數讀取欲查詢的 Graph 路徑，例如：`/me`、`/me/adaccounts`、`/{ad_account_id}/campaigns`。
   - 若未提供參數，預設查詢 `/me`。
   - 將回傳 JSON 以 `JSON.stringify(res, null, 2)` 完整印出，方便除錯。
   - 若回傳內含 `error` 欄位，需將錯誤內容完整印出並結束程式。

# 使用說明
- 主要腳本：`query-facebook.js`（位於同資料夾）。
- 環境變數範例可參考同目錄的 `.env.example`，實際使用時請複製為 `.env` 並填入正確值。
- 呼叫方式（在專案根目錄或任意目錄均可）：

  ```bash
  node .cursor/skills/facebookapi/query-facebook.js "/me"
  node .cursor/skills/facebookapi/query-facebook.js "/me/adaccounts"
  ```

- 若你在對話中說出「用 Facebook Graph API 查 XXX」，我會：
  1. 先釐清你要查的物件與欄位。
  2. 幫你組出合適的 Graph API 路徑與查詢參數。
