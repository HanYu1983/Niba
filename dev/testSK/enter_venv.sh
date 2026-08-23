#!/usr/bin/env bash
# 進入虛擬環境：source enter_venv.sh 或 . enter_venv.sh
# 進入後可直接執行 python、pip 等指令
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/.venv/bin/activate"
echo "已進入虛擬環境 (.venv)，輸入 deactivate 可離開。"
