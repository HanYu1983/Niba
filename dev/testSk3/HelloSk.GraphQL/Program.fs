namespace HelloSk.GraphQL

open System
open System.IdentityModel.Tokens.Jwt
open System.Security.Claims
open System.Text
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

// ----- Schema：Login（無帳密）、Federation 用 entity -----

/// 登入回傳：JWT token（無帳密，個人使用）
type LoginPayload(token: string) =
    member _.Token = token

/// Qdrant collection 假資料型別（供前端列表顯示）
type QdrantCollection(name: string, pointsCount: int) =
    member _.Name = name
    member _.PointsCount = pointsCount

/// 刪除 collection 回傳
type DeleteCollectionPayload(success: bool, message: string) =
    member _.Success = success
    member _.Message = message

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
        // 假資料：一律回傳成功，之後可改為呼叫 Qdrant API
        DeleteCollectionPayload(true, sprintf "Collection \"%s\" deleted." name)

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
        // 假資料：之後可改為呼叫 Qdrant GET /collections
        [
            QdrantCollection("my_docs", 120)
            QdrantCollection("rag_demo", 45)
        ]

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
