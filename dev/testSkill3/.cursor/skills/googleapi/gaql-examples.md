# GAQL 查詢範例

使用方式（在專案根目錄或任意處執行）：

```bash
node .cursor/skills/googleapi/query-ads.js "你的GAQL字串"
```

## 範例 GAQL

### 1. 廣告活動 (campaign)
```bash
node .cursor/skills/googleapi/query-ads.js "SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type FROM campaign WHERE campaign.status != 'REMOVED' ORDER BY campaign.name LIMIT 10"
```

### 2. 廣告群組 (ad_group)
```bash
node .cursor/skills/googleapi/query-ads.js "SELECT ad_group.id, ad_group.name, campaign.name FROM ad_group WHERE ad_group.status != 'REMOVED' LIMIT 10"
```

### 3. 客戶資訊 (customer)
```bash
node .cursor/skills/googleapi/query-ads.js "SELECT customer.id, customer.descriptive_name, customer.currency_code, customer.time_zone FROM customer LIMIT 1"
```

### 4. 關鍵字 (keyword_view，含效能)
```bash
node .cursor/skills/googleapi/query-ads.js "SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, metrics.impressions, metrics.clicks, metrics.cost_micros FROM keyword_view WHERE segments.date DURING LAST_30_DAYS LIMIT 10"
```

### 5. 廣告 (ad_group_ad)
```bash
node .cursor/skills/googleapi/query-ads.js "SELECT campaign.name, ad_group.name, ad_group_ad.ad.id, ad_group_ad.ad.type, ad_group_ad.status FROM ad_group_ad WHERE ad_group_ad.status != 'REMOVED' LIMIT 10"
```

### 6. 無參數（使用腳本內建預設查詢）
```bash
node .cursor/skills/googleapi/query-ads.js
```
