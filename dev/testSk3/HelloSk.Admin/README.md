# HelloSk 管理後台

F# + Fable + Elmish + Feliz 前端，透過 GraphQL 連接後端。

## 需求

- .NET 8 SDK
- Node.js 18+
- 後端 GraphQL 已啟動（例如 `docker compose up -d graphql`，port 5000）

## 使用 Docker Compose（repo 根目錄）

```bash
# 先啟動 GraphQL，再啟動管理後台
docker compose up -d graphql
docker compose up -d --build admin
```

瀏覽 http://localhost:5173 。

## 開發（本機）

```bash
cd HelloSk.Admin
npm install
dotnet tool restore
npm start
```

瀏覽 http://localhost:5173 。按「登入」會呼叫後端 `login` mutation，成功後會顯示 JWT token。

## 建置

```bash
npm run build
```

輸出在 `dist/`。

## 說明

- 開發時 Vite 會把 `/graphql` 代理到 `http://localhost:5000`，請先啟動 HelloSk.GraphQL。
- 登入無帳密，僅供個人使用；token 取得後可於後續請求帶入 `Authorization: Bearer <token>`。
