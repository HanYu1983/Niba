# MCP → Docker 遷移：問題紀錄

> 追蹤把「ComfyUI-MiniMax H3 MCP」（`ai_gen_video/mcp_server_http.mjs`，HTTP :8765）
> 從「本機 node 背景執行」遷移到 Docker 期間遇到的坑。每一條含根因＋修法＋驗證。
> 更新日期：2026-09-12

---

## 【已解決】問題一：opencode 重啟後 MCP 回「Already connected / Server already initialized」，必須手動 kill node

### 現象
- 每次重啟 opencode，MCP 工具整批消失或報 `Server already initialized`（streamable HTTP 單一 session 限制）。
- 解法本來是：`Stop-Process node` → 重啟 `node mcp_server_http.mjs`。非常煩。

### 根因
1. **code 端（已先修）**：`mcp_server_http.mjs` 原本是「單一全域 `let transport`」＋ `server.connect(transport)`（Opencode 每次重啟開新 session 就撞已綁定的舊 transport）。
2. **部署端（本次 docker 遷移真正卡住的點）**：`docker compose up` 在 Windows 上遇
   - **port 被舊的 host node 佔用** → `Error response from daemon: ports are not available`
   - **舊 container 一直存活**（`restart: unless-stopped`，2h 前 build 的舊 image）→ `up` 只 restart 不 recreate，容器內跑的是**舊的多*單* transport code**，log 顯現 `Already connected to a transport ... mcp_server_http.mjs:351`。
   - 我先前「Edit applied」命中錯誤路徑 `D:\han\Niba\dev\Project20`（大小寫沒對上真正的 `D:\han\Niba\dev\Project20`），多 session 的 code 其實沒進到 server 檔案——所以 build 出來仍是單 transport。**路徑大小寫是隱形雷**。

### 修法（Docker 側）
1. **先修 code（multi-session）**：`mcp_server_http.mjs` 的 HTTP transport 區改成
   - `createMcpExpressApp({ host: "0.0.0.0" })`（對外暴露，容器內需 0.0.0.0）
   - per-session：`StreamableHTTPServerTransport` 用 `Map` 管理，`app.post("/mcp")` 依 `mcp-session-id` header + `randomUUID()` 建新 transport 並 `await server.connect(transport)`，`app.delete` 關閉該 session transport。
   - **確認寫進真檔**：`D:\han\Niba\dev\Project20\ai_gen_video\mcp_server_http.mjs`（不是大小寫錯的那個）。
2. **Dockerfile（根目錄）**：
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm install
   COPY mcp_server_http.mjs ./
   EXPOSE 8765
   CMD ["node", "mcp_server_http.mjs"]
   ```
3. **docker-compose.yml**：`mcp` service
   ```yaml
   mcp:
     build: .
     image: comfy-client:latest
     container_name: comfy-mcp
     restart: unless-stopped        # ← 開機自動啟動關鍵
     environment:
       - COMFY_SERVER=http://192.168.0.193:8000
     ports:
       - "127.0.0.1:8765:8765"
     volumes:
       - .:/app                     # host 圖檔對映容器，ref/首尾幀直接讀得到
   ```
4. **清掉舊 container + 強制重建**：
   ```powershell
   docker compose down --remove-orphans
   docker compose up -d --build     # 不是 up（up 只 restart 舊的）
   ```
5. **釋放 host port**：確認 8765 沒被 host node 佔（`Get-NetTCPConnection -State Listen -LocalPort 8765`），佔了就停。

### 驗證
```powershell
docker compose ps               # comfy-mcp Up
curl.exe http://127.0.0.1:8765/mcp   # 回 200（session 前哨）
```
重啟 opencode → MCP 工具自動出現、不需手動 kill node。開機自動啟動 = Docker Desktop 開機自啟 + `restart: unless-stopped`。

---

## 開機自動啟動設定（使用者版本，2026-09-12）
1. **Docker Desktop 開機自啟**：Docker Desktop → Settings → General → 勾 `Start Docker Desktop when you sign in to your computer` → Apply & Restart。
2. **container 自啟**：compose `restart: unless-stopped`（已設）→ Docker Desktop 起來後 container 自動跟起。
3. **opencode 連線**：opencode.json 的 mcp `remote` url 保持 `http://127.0.0.1:8765/mcp` 不變，opencode 重啟即自動連上。**不再需要手動 Start-Process node。**

## 重要教訓（下次注意）
- **路徑大小寫**：`D:\han\Niba\dev\Project20` ≠ `...\Project20`（Niba\...）。所有 edit/read 前先 `Get-ChildItem` 確認真檔名，不要再從 summary 記憶路徑下手。
- **docker compose up ≠ 重建**：要換 code 必須 `up -d --build`（或先 `down`）。`up` 遇到相同 container_name/image 只做 restart。
- **port 佔用檢查**：本機還有人用 `node mcp_server_http.mjs` 佔 8765 時，docker 起不來。兩者擇一：要嘛 host node、要嘛 container，不能同時。

---

## ⭐ 追加篇（2026-09-12）：Protocol 層根因——比 Docker 更根本，**Docker 動不了它**
> Docker 只是「讓 process 常駐＋開機自啟」，**但 opencode 重啟仍撞同一 guard**，因為問題在 `McpServer`(Protocol) 層，不在 process 層。

### 根因（SDK 原始碼實證，`protocol.js:217`）
```js
throw new Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.")
```
- `McpServer`（繼承 `Protocol`）**一次只能 `connect()` 一個 transport**。
- 現行 `mcp_server_http.mjs` 是**全域單一 `const server = new McpServer(...)`**（所有 17 個 `server.tool(...)` 都註冊在同一個 instance 上）。
- HTTP 端雖已用 `transports` Map 想做 multi-session，但每 session 都呼叫**同一個 `server.connect(transport)`** → 第二個 session 直接炸 guard。**Docker 化不解決**：container 重啟 = 新 session = 照樣 `server.connect` 撞同一個 McpServer。

### 正確修法：per-session factory（官方 streamableHttp multi-session 模式）
1. **抽 `registerTools(server)`**：把現行 17 個 `server.tool(...)` 整段包成一個 function（`McpServer` instance 當參數傳入）。
2. **每個 HTTP session 建立獨立 `McpServer` instance**：
   ```js
   const sessions = new Map(); // sessionId -> { server, transport }
   app.post("/mcp", async (req, res, next) => {
     const sessionId = req.header("mcp-session-id");
     let s = sessions.get(sessionId);
     if (!s) {
       const server = new McpServer({ name: "comfy-video-gen", ... });
       registerTools(server);                      // ← 每 session 各自註冊
       const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => randomUUID() });
       await server.connect(transport);            // ← 各自的 McpServer.connect，不撞 guard
       s = { server, transport };
       sessions.set(sessionId, s);
     }
     await s.transport.handleRequest(req, res, req.body);
   });
   app.delete("/mcp", async (req, res) => { /* 關掉該 session 的 transport + delete from Map */ });
   ```
3. **驗證**：opencode 重啟 → 新 session → 新 McpServer instance → 不再「Server already initialized」。**這步做完才做 Docker**（Docker 只補「常駐＋自啟」，不補這個 code root cause）。
4. 若不想手動抽，也可改用 SDK 現成的 `createMcpExpressApp`（官方 express helper，內部就是 per-session factory）。
