#!/usr/bin/env bash
# =============================================================================
# Google Ads → SystemInput JSON → App1 條件評估（範例管線，可照抄或改參數）
# =============================================================================
# 前置：在 project1 目錄、Docker 可用、.env／AdCredentials 已就緒（與 run-google-createSystemInput 相同）。
#
# 流程：
#   1) run-google-createSystemInput.sh
#      → AdPlatform.Google createSystemInput 查 GAQL，以 UTF-8 寫入「中繼 input.json」
#      成功時 stdout 一行「已寫入 SystemInput: …」；錯誤在 stderr。
#   2) run-app1.sh
#      → App1 / Runner 讀取該 JSON，寫出「結果.json」（UTF-8 無 BOM、日文不跳脫 \u）
#
# 用法：
#   ./run-google-pipeline-example.sh \
#       [<customerId> [<中繼輸入.json> [<App1結果.json> [GAQL 一整段字串]]]]
#
# 參數皆可省略，下列為預設值：
#   customerId     = 2044490174
#   中繼輸入.json   = google-ads-pipeline-input.json
#   App1結果.json   = 結果-pipeline.json
#   GAQL           = 查詢 10 筆 ad_group_ad（每列一廣告）
#
# 範例（全部預設）：
#   ./run-google-pipeline-example.sh
#
# 範例（自訂 GAQL，請保持最後一個參數一對引號）：
#   ./run-google-pipeline-example.sh 2044490174 my-in.json my-out.json \
#     "SELECT campaign.id FROM campaign LIMIT 3"
#
# =============================================================================

set -euo pipefail

cd "$(dirname "$0")"

DEFAULT_CUSTOMER_ID="2044490174"
DEFAULT_MID_JSON="google-ads-pipeline-input.json"
DEFAULT_RESULT_JSON="結果-pipeline.json"
DEFAULT_GAQL='SELECT campaign.id, campaign.name, ad_group.id, ad_group.name, ad_group.type, ad_group.resource_name, ad_group_ad.ad.id FROM ad_group_ad LIMIT 10'

CUSTOMER_ID="${1:-$DEFAULT_CUSTOMER_ID}"
MID_JSON="${2:-$DEFAULT_MID_JSON}"
RESULT_JSON="${3:-$DEFAULT_RESULT_JSON}"
GAQL="${4:-$DEFAULT_GAQL}"

if [ "$#" -gt 4 ]; then
    echo "用法: $0 [<customerId> [<中繼.json> [<結果.json> [\"<GAQL>\"]]]]" >&2
    echo "參數最多 4 個；GAQL 請用一對引號包住。" >&2
    exit 1
fi

echo "== 1/2 createSystemInput → ${MID_JSON}" >&2
./run-google-createSystemInput.sh "$CUSTOMER_ID" "$MID_JSON" "$GAQL"

echo "== 2/2 App1 → ${RESULT_JSON}" >&2
./run-app1.sh "$MID_JSON" "$RESULT_JSON"

echo "完成：${RESULT_JSON}" >&2
