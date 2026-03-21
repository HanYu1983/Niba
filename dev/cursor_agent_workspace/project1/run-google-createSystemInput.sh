#!/usr/bin/env bash
# 在 project1 目錄執行（與 docker-compose.yml 掛載 /app 一致）。
# 用法: ./run-google-createSystemInput.sh <customerId> <輸出.json> "<GAQL>"
# 範例: ./run-google-createSystemInput.sh 2044490174 google-ads-input.json "SELECT campaign.id FROM campaign LIMIT 3"

set -euo pipefail

cd "$(dirname "$0")"

if [ "$#" -ne 3 ]; then
    echo "用法: $0 <customerId> <輸出.json> \"<GAQL>\"" >&2
    echo "範例: $0 2044490174 google-ads-input.json \"SELECT campaign.id FROM campaign LIMIT 3\"" >&2
    exit 1
fi

CUSTOMER_ID="$1"
OUTPUT_JSON="$2"
GAQL="$3"

exec docker compose run --rm -T fsharp-dev \
    dotnet run --project AdPlatform.Google -- \
    createSystemInput ./AdCredentials/credentials.sample.json google-local-env - \
    "$CUSTOMER_ID" "$OUTPUT_JSON" "$GAQL"
