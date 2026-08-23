#!/usr/bin/env bash
# 在 project1 目錄執行（與 docker-compose.yml 掛載 /app 一致）。
#
# 用法:
#   ./run-app1.sh
#     → samples/demo-input.json → samples/demo-output.json
#   ./run-app1.sh <輸入.json>
#     → 輸出為同目錄 <basename>.result.json
#   ./run-app1.sh <輸入.json> <輸出.json>
#
# 範例:
#   ./run-app1.sh samples/demo-input.json

set -euo pipefail

cd "$(dirname "$0")"

if [ "$#" -gt 2 ]; then
    echo "用法: $0 [<輸入.json> [<輸出.json>]]" >&2
    echo "參數最多 2 個；未指定時使用 samples/demo-input.json → samples/demo-output.json" >&2
    exit 1
fi

exec docker compose run --rm -T fsharp-dev \
    dotnet run --project App1 -- "$@"
