# HelloSk 管理後台 (Elm)

純 Elm 前端，使用 Node 安裝的 `elm` 編譯（無 Vite）。透過 GraphQL 連接後端 login mutation。

## 需求

- Node.js 18+
- 後端 GraphQL 已啟動（port 5000）

## 本機開發

```bash
cd HelloSk.AdminElm
npm install
npm run build   # elm make src/Main.elm --output=elm.js
npm start       # node server.js，靜態檔 + /graphql 代理
```

瀏覽 http://localhost:5174 ，按「登入」取得 JWT。

## 使用 Docker Compose（repo 根目錄）

```bash
docker compose up -d graphql
docker compose up -d admin-elm
```

本機存取：http://localhost:5174

## 說明

- 編譯：`elm make src/Main.elm --output=elm.js`（由 npm 安裝的 `elm` 執行）
- 執行：Express 提供靜態檔（index.html、elm.js）並將 `/graphql` 代理到後端
- 登入無帳密，回傳 token；與 Admin（Fable）共用同一 GraphQL 後端
