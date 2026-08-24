#!/usr/bin/env bash
# 先啟動 Ollama server，再拉取 qwen3.5:0.8b，最後保持 server 運行
set -e
ollama serve &
pid=$!
echo "Waiting for Ollama server to be ready..."
sleep 5
echo "Pulling qwen3.5:0.8b..."
ollama pull qwen3.5:0.8b || true
wait $pid
