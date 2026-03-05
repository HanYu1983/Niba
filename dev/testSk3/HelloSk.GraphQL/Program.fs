namespace HelloSk.GraphQL

open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.DependencyInjection
open HotChocolate.AspNetCore

/// GraphQL 根查詢型別（目前僅佔位，之後在此擴充 schema）
type Query() =
    /// 佔位欄位，確認 server 正常運作；之後可移除或改為正式 schema
    member _.Hello() = "Hello GraphQL"

module Program =

    [<EntryPoint>]
    let main args =
        let builder = WebApplication.CreateBuilder(args)

        builder.Services
            .AddGraphQLServer()
            .AddQueryType<Query>()
            |> ignore

        let app = builder.Build()
        app.MapGraphQL() |> ignore
        app.Run()
        0
