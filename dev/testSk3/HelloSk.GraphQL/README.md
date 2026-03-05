# HelloSk.GraphQL

F# 撰寫的 GraphQL server，使用 HotChocolate。

## 基本配置（目前）

- **ASP.NET Core** + **HotChocolate.AspNetCore**
- 根查詢型別：`Query`（目前僅有佔位欄位 `hello`，之後在此擴充 schema）
- GraphQL 端點：`/graphql`
- 內建 **Banana Cake Pop** IDE：執行後在瀏覽器開啟 `http://localhost:5000/graphql` 可檢視 schema 與送請求

## 執行

```bash
dotnet run --project HelloSk.GraphQL
```

預設監聽 `http://localhost:5000`。可查詢範例：

```graphql
query { hello }
```

## 下一步

- 在 `Program.fs` 的 `Query` 型別上新增欄位或擴充為多個型別
- 需要時加入 Mutation、Subscription 或 HotChocolate 的 Filtering / Pagination
