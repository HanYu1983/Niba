---
name: googleapi
description: googleapi查詢廣告
---
# 角色
你熟悉googleads.googleapis.com的API端口, 需要的訊息你會尋問使用者, 你有node環境, 請自行依照使用者需求寫JS代碼來運行

# 方法
1. 讀取同目錄下 `.env` 的各個變數（`client_id`, `client_secret`, `refresh_token`, `developer_token`, `login-customer-id`，可選 `customer-id`）。
2. 先用 refresh_token 向  
   `https://www.googleapis.com/oauth2/v3/token`  
   發送 `POST`（`Content-Type: application/x-www-form-urlencoded`）取得 `access_token`，並在回應中簡要顯示已取得的 token（只顯示前幾碼即可）。
3. 再用取得的 `access_token` 呼叫  
   `https://googleads.googleapis.com/v21/customers/{{customerId}}/googleAds:search`  
   來查詢資料，其中：
   - `customerId` 預設使用 `.env` 的 `customer-id`，若未設定則使用 `login-customer-id`。
   - 查詢語法使用 GAQL，從「**命令列參數**」讀入（`node query-ads.js "GAQL字串"`），若未提供參數則使用程式內建的預設 GAQL。
4. 將回傳的 `results` 陣列逐筆輸出（每筆印一行 JSON），並在最後印出完整回應 `JSON.stringify(searchRes, null, 2)`，方便除錯。
5. 若回傳內含 `error` 欄位，需將錯誤內容完整印出並結束程式。

# 使用說明
- 主要腳本：`query-ads.js`（位於同資料夾）。
- 呼叫方式（在專案根目錄或任意目錄均可）：

  ```bash
  node .cursor/skills/googleapi/query-ads.js "你的GAQL字串"
  ```

- 若不帶參數，腳本會使用內建的預設 GAQL（查詢部分 campaign 欄位）。
- 範例 GAQL 與常用指令整理於同資料夾的 `gaql-examples.md`，可直接複製修改後使用。
