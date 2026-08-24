# Docker 指令環境

使用 **Python 3.11** 的容器，並以 **volume 掛載本機專案目錄**，本機修改程式會即時反映到容器內。

## 前置

- 已安裝 Docker 與 Docker Compose
- 若需呼叫 OpenAI，請在專案目錄建立 `.env`，內容例如：`OPENAI_API_KEY=sk-...`  
  （若沒有 `.env`，請暫時刪除 `docker-compose.yml` 裡的 `env_file: - .env` 再執行）

## 指令

```bash
# 建置並啟動容器（背景執行，用 volume 掛載本機目錄）
docker-compose up -d --build

# 進入容器，在掛載的 /app（即本機專案）下執行指令
docker-compose exec app bash

# 在容器內執行範例（等同本機檔案）
python hello_planner.py
# 或
python -c "from hello_plugin import HelloPlugin; print(HelloPlugin().say_hello('World'))"
```

```bash
# 不進入 bash，直接執行單一指令
docker-compose run --rm app python hello_planner.py
```

```bash
# 停止並移除容器
docker-compose down
```

## Qdrant 向量庫

- 執行 `docker-compose up -d` 會一併啟動 **Qdrant**（port 6333、6334），資料持久化在 volume `qdrant_data`。
- 測試 SK + Qdrant：`docker-compose run --rm app python test_qdrant_sk.py`（需設定 `OPENAI_API_KEY`）。

## MCP 讀檔伺服器（FastMCP）

- **mcp** 服務：FastMCP 提供的讀檔 MCP（工具 `read_file`、`list_dir`），port 8000，SSE 端點 `/sse`。
- 資料目錄掛載為 `./mcp_server/data` → 容器內 `/data`，可在此放檔供 `read_file` 讀取。
- 測試 SK 連本地 MCP：`docker-compose run --rm app python test_mcp_sk.py`（需先 `docker-compose up -d` 啟動 mcp）。
- 自訂 prompt 例：`docker-compose run --rm app python test_mcp_sk.py "用 list_dir 列出 /data 目錄"`

## Volume 說明

- `.:/app` 表示**本機專案目錄**掛載到容器內的 `/app`。
- 在本機編輯 `hello_planner.py`、`hello_plugin.py` 等，在容器內會立即看到變更，無需重建 image。
