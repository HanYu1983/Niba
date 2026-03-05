namespace HelloSk.GraphQL

open System
open System.IdentityModel.Tokens.Jwt
open System.Net.Http
open System.Security.Claims
open System.Text
open System.Text.Json
open Microsoft.AspNetCore.Authentication.JwtBearer
open Microsoft.AspNetCore.Authorization
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.IdentityModel.Tokens
open HotChocolate
open HotChocolate.AspNetCore
open HotChocolate.ApolloFederation
open HotChocolate.ApolloFederation.Types
open HotChocolate.ApolloFederation.Resolvers
open HotChocolate.Types
open Microsoft.SemanticKernel
open Microsoft.SemanticKernel.ChatCompletion
open HelloSk.Core
open HelloSk.Core.Shared

// ----- Schema：Login（無帳密）、Federation 用 entity -----

/// 登入回傳：JWT token（無帳密，個人使用）
type LoginPayload(token: string) =
    member _.Token = token

/// Qdrant collection 型別（供前端列表顯示）
type QdrantCollection(name: string, pointsCount: int) =
    member _.Name = name
    member _.PointsCount = pointsCount

/// 刪除 collection 回傳
type DeleteCollectionPayload(success: bool, message: string) =
    member _.Success = success
    member _.Message = message

/// 聊天訊息 input / output 型別
type ChatMessageInput(role: string, content: string) =
    member _.Role = role
    member _.Content = content

type ChatMessage(role: string, content: string) =
    member _.Role = role
    member _.Content = content

type ChatResult(messages: ChatMessage list, answer: string) =
    member _.Messages = messages
    member _.Answer = answer

/// 共用的 Semantic Kernel 建立與 chat 呼叫
module private ChatKernel =

    let private lazyKernel: Lazy<Result<Kernel, string>> =
        lazy (Shared.createKernelFromEnv ())

    let getKernel () =
        match lazyKernel.Value with
        | Result.Error msg -> Result.Error msg
        | Result.Ok k ->
            // 確保 Plugin 只註冊一次（若重複註冊會重覆出現在 Plugins 中，但影響有限）
            HelloSk.Core.PluginRegistration.registerCorePlugins k
            Result.Ok k

    let private defaultSystemMessage = """
你是助理，可依使用者需求選擇呼叫以下工具（Plugin）：
- CodeHelper（寫/改/跑程式）：ReadFile(path)、WriteFile(path, content)、ListDir(path)。路徑為相對於 workspace 根目錄。
- Tools：GetEnv(key)、RunCmd(command)，可用於 dotnet build、dotnet test 等，不可寫檔。
- Aws（AWS）：S3ListBuckets()、S3ListObjects、S3GetObjectText；EBGetEnvVars、EBUpdateEnvVars。
- RealTasks（實際任務）：SmartCanvasNovaSetTmp(value) 將 EB SmartCanvasNova 的 smartcanvas-nova-development2 的 TMP 環境變數設為 value。
- Rag（RAG 查詢）：QdrantSearch(collectionName, query, topK) 需要使用者提供 collectionName，會對 Qdrant 搜尋相關內容並回傳摘要。
- Facebook：query_graph(path)，如 /me、/me/adaccounts
- GoogleAds：query_ads(gaql, customerId)
- RicohMonitoring：RicohFetchAndUpdate、RicohPostToSlack
撰寫或修改程式時請依序使用 ReadFile/ListDir、WriteFile、RunCmd；查詢 AWS 時使用 Aws 的 S3 函數，查詢文件內容時可用 Rag 的 QdrantSearch（請先讓使用者說明 collectionName）。回覆簡潔中文。
"""

    let buildHistory (inputs: ChatMessageInput list) : ChatHistory =
        let h = ChatHistory()
        h.AddSystemMessage(defaultSystemMessage)
        for m in inputs do
            let role = (m.Role |> string).ToLowerInvariant()
            let content = m.Content
            if not (String.IsNullOrWhiteSpace content) then
                match role with
                | "user" -> h.AddUserMessage(content)
                | "assistant" -> h.AddAssistantMessage(content)
                | "system" -> h.AddSystemMessage(content)
                | _ -> h.AddUserMessage(content)
        h

    let runChat (messages: ChatMessageInput list) : ChatResult =
        printfn "[Chat] runChat start, messages=%d" messages.Length
        match getKernel () with
        | Error msg ->
            printfn "[Chat] getKernel error: %s" msg
            // 當作 GraphQL error，由外層包裝
            raise (
                GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage($"建立 Kernel 失敗：{msg}")
                        .SetCode("CHAT_KERNEL_ERROR")
                        .Build()
                )
            )
        | Ok kernel ->
            printfn "[Chat] getKernel ok, building history..."
            let chatService = kernel.GetRequiredService<IChatCompletionService>()
            let settings = PromptExecutionSettings()
            settings.FunctionChoiceBehavior <- FunctionChoiceBehavior.Auto()
            let history = buildHistory messages
            printfn "[Chat] history built, count=%d" (history.Count)

            printfn "[Chat] calling GetChatMessageContentAsync..."
            let result =
                chatService.GetChatMessageContentAsync(history, settings, kernel)
                |> Async.AwaitTask
                |> Async.RunSynchronously
            printfn "[Chat] GetChatMessageContentAsync done."

            history.Add(result)

            let answer =
                result.Content
                |> Option.ofObj
                |> Option.defaultValue ""

            // 將完整對話歷史轉回 GraphQL 型別
            let allMessages =
                history
                |> Seq.toList
                |> List.choose (fun m ->
                    let content = m.Content |> Option.ofObj |> Option.defaultValue ""
                    if String.IsNullOrWhiteSpace content then
                        None
                    else
                        let role =
                            m.Role.ToString().ToLowerInvariant()
                        Some(ChatMessage(role, content)))

            printfn "[Chat] runChat done, totalMessages=%d" allMessages.Length
            ChatResult(allMessages, answer)

/// 呼叫 Qdrant REST API 的小工具模組（本檔內自用）
module private QdrantApi =

    let private getEndpointFromEnv () =
        let v = Environment.GetEnvironmentVariable "QDRANT_ENDPOINT"
        if String.IsNullOrWhiteSpace v then
            "http://qdrant:6333"
        else
            v

    let getBaseUri () =
        let raw = getEndpointFromEnv ()
        let withSlash = if raw.EndsWith("/") then raw else raw + "/"
        Uri(withSlash)

    let createClient () =
        let baseUri = getBaseUri ()
        let c = new HttpClient(BaseAddress = baseUri)
        c.Timeout <- TimeSpan.FromSeconds(30.0)
        c

    /// 取得所有 collections 名稱
    let listCollections (client: HttpClient) : string list =
        let url = "collections"
        use req = new HttpRequestMessage(HttpMethod.Get, url)
        let resp = client.Send(req)
        if not resp.IsSuccessStatusCode then
            let msg = resp.Content.ReadAsStringAsync().Result
            failwithf "Qdrant 列出 collections 失敗（HTTP %d）：%s" (int resp.StatusCode) msg

        let json = resp.Content.ReadAsStringAsync().Result
        use doc = JsonDocument.Parse(json)
        let root = doc.RootElement

        // 根據官方文件：{ result: { collections: [ { name: \"...\" }, ... ] } }
        if not (root.TryGetProperty("result") |> fst) then
            []
        else
            let result = root.GetProperty("result")
            if not (result.TryGetProperty("collections") |> fst) then
                []
            else
                result.GetProperty("collections").EnumerateArray()
                |> Seq.choose (fun item ->
                    if item.TryGetProperty("name") |> fst then
                        Some (item.GetProperty("name").GetString())
                    else
                        None)
                |> Seq.filter (fun n -> not (String.IsNullOrWhiteSpace n))
                |> Seq.map (fun n -> n.Trim())
                |> Seq.distinct
                |> Seq.toList

    /// 取得單一 collection 的 points 數量
    let getPointsCount (client: HttpClient) (collection: string) : int =
        // 依 docker-compose 註解：POST /collections/{name}/points/count，body: {\"exact\": true}
        let url = sprintf "collections/%s/points/count" collection
        use content =
            new StringContent("{\"exact\": true}", Encoding.UTF8, "application/json")
        use req = new HttpRequestMessage(HttpMethod.Post, url)
        req.Content <- content
        let resp = client.Send(req)

        if not resp.IsSuccessStatusCode then
            // 若失敗，回傳 0 並記 log，不中斷整體查詢
            let msg = resp.Content.ReadAsStringAsync().Result
            printfn "Qdrant 取得 points count 失敗（collection=%s, HTTP %d）：%s" collection (int resp.StatusCode) msg
            0
        else
            let json = resp.Content.ReadAsStringAsync().Result
            use doc = JsonDocument.Parse(json)
            let root = doc.RootElement
            if not (root.TryGetProperty("result") |> fst) then
                0
            else
                let result = root.GetProperty("result")
                if result.TryGetProperty("count") |> fst then
                    result.GetProperty("count").GetInt32()
                else
                    0

    /// 刪除 collection，回傳是否成功與訊息
    let deleteCollection (client: HttpClient) (collection: string) : bool * string =
        let url = sprintf "collections/%s" collection
        use req = new HttpRequestMessage(HttpMethod.Delete, url)
        let resp = client.Send(req)

        if resp.IsSuccessStatusCode then
            true, sprintf "Collection \"%s\" deleted." collection
        elif resp.StatusCode = System.Net.HttpStatusCode.NotFound then
            // 若不存在，當作成功，但提示訊息
            true, sprintf "Collection \"%s\" does not exist (treated as deleted)." collection
        else
            let msg = resp.Content.ReadAsStringAsync().Result
            false, sprintf "刪除失敗（HTTP %d）：%s" (int resp.StatusCode) msg

/// 根 Mutation：login 不帶參數，回傳 JWT；deleteCollection 需 JWT
type Mutation() =
    member _.Login([<Service>] config: IConfiguration) =
        let jwt = config.GetSection("Jwt")
        let str (key: string) = let v = jwt[key] in if isNull v then None else Some v
        let secret = str "Secret" |> Option.defaultValue "dev-secret-must-be-32-bytes-long!!"
        let issuer = str "Issuer" |> Option.defaultValue "HelloSk.GraphQL"
        let audience = str "Audience" |> Option.defaultValue "HelloSk"
        let expMinutes =
            str "ExpirationMinutes"
            |> Option.bind (fun s -> match Int32.TryParse(s) with true, n -> Some n | _ -> None)
            |> Option.defaultValue 60
        // HS256 需要金鑰至少 256 bits (32 bytes)，不足則以 0 填滿
        let rawKey = Encoding.UTF8.GetBytes(secret)
        let keyBytes = if rawKey.Length >= 32 then rawKey else Array.zeroCreate 32
        if rawKey.Length < 32 then Array.blit rawKey 0 keyBytes 0 rawKey.Length
        let key = SymmetricSecurityKey(keyBytes)
        let creds = SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        let claims = [|
            Claim(JwtRegisteredClaimNames.Sub, "me")
            Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        |]
        let notBefore = System.Nullable<DateTime>()
        let expires = DateTime.UtcNow.AddMinutes(float expMinutes)
        let expiresNullable = System.Nullable(expires)
        let token = JwtSecurityToken(issuer, audience, claims, notBefore, expiresNullable, creds)
        let tokenString = JwtSecurityTokenHandler().WriteToken(token)
        LoginPayload(tokenString)

    [<Authorize>]
    member _.DeleteCollection(name: string) =
        try
            use client = QdrantApi.createClient ()
            let ok, msg = QdrantApi.deleteCollection client name
            DeleteCollectionPayload(ok, msg)
        with ex ->
            DeleteCollectionPayload(false, sprintf "刪除 collection \"%s\" 時發生錯誤：%s" name ex.Message)

    /// 與 HelloSk.Ask 的聊天模式相同，但由 GraphQL 取得輸入
    /// 注意這裡使用 C# 陣列型別當作參數，避免 F# list 與 HotChocolate 的 List 之間型別轉換問題
    [<Authorize>]
    member _.Chat(messages: ChatMessageInput array) =
        try
            messages
            |> Array.toList
            |> ChatKernel.runChat
        with
        | :? GraphQLException as gex ->
            // 直接向外拋出 GraphQLException
            raise gex
        | ex ->
            raise (
                GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage($"聊天呼叫失敗：{ex.Message}")
                        .SetCode("CHAT_ERROR")
                        .Build()
                )
            )

/// Federation 規定 subgraph 至少要有一個 entity（@key + reference resolver）
/// 此為佔位 entity，供之後擴充或由 gateway 解析
type User(id: string) =
    [<Key>]
    [<GraphQLType(typeof<IdType>)>]
    member _.Id = id

    [<ReferenceResolver>]
    static member ResolveReference(id: string) = User(id)

/// GraphQL 根查詢型別（可擴充）
type Query() =
    member _.Hello() = "Hello GraphQL"

    [<Authorize>]
    member _.Collections() : QdrantCollection list =
        try
            use client = QdrantApi.createClient ()
            let names = QdrantApi.listCollections client
            names
            |> List.map (fun name ->
                let count = QdrantApi.getPointsCount client name
                QdrantCollection(name, count))
        with ex ->
            // 交給 GraphQL error 機制，前端可以從 errors[0].message 取得訊息
            raise (
                GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage($"取得 Qdrant collections 失敗：{ex.Message}")
                        .SetCode("QDRANT_COLLECTIONS_ERROR")
                        .Build()
                )
            )

module Program =

    let getJwtConfig (config: IConfiguration) =
        let jwt = config.GetSection("Jwt")
        let str (key: string) = let v = jwt[key] in if isNull v then None else Some v
        let secret = str "Secret" |> Option.defaultValue "dev-secret-must-be-32-bytes-long!!"
        let issuer = str "Issuer" |> Option.defaultValue "HelloSk.GraphQL"
        let audience = str "Audience" |> Option.defaultValue "HelloSk"
        let rawKey = Encoding.UTF8.GetBytes(secret)
        let keyBytes = if rawKey.Length >= 32 then rawKey else Array.zeroCreate 32
        if rawKey.Length < 32 then Array.blit rawKey 0 keyBytes 0 rawKey.Length
        (SymmetricSecurityKey(keyBytes), issuer, audience)

    [<EntryPoint>]
    let main args =
        let builder = WebApplication.CreateBuilder(args)
        let (jwtKey, jwtIssuer, jwtAudience) = getJwtConfig builder.Configuration

        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(fun opt ->
                opt.TokenValidationParameters <- TokenValidationParameters(
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = jwtKey,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ClockSkew = TimeSpan.Zero
                ))
            |> ignore

        builder.Services.AddAuthorization() |> ignore

        builder.Services
            .AddGraphQLServer()
            .AddApolloFederation()
            .AddAuthorization()
            .AddQueryType<Query>()
            .AddMutationType<Mutation>()
            .AddType<User>()
            .ModifyRequestOptions(fun opt -> opt.IncludeExceptionDetails <- (builder.Environment.EnvironmentName = Environments.Development))
            |> ignore

        let app = builder.Build()
        app.UseAuthentication()
        app.UseAuthorization()
        app.MapGraphQL() |> ignore
        app.Run()
        0
