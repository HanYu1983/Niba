namespace HelloSk.GraphQL

open System
open System.IdentityModel.Tokens.Jwt
open System.Security.Claims
open System.Text
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

/// 根 Mutation：login 不帶參數，回傳 JWT
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

module Program =

    [<EntryPoint>]
    let main args =
        let builder = WebApplication.CreateBuilder(args)

        builder.Services
            .AddGraphQLServer()
            .AddApolloFederation()
            .AddQueryType<Query>()
            .AddMutationType<Mutation>()
            .AddType<User>()
            .ModifyRequestOptions(fun opt -> opt.IncludeExceptionDetails <- (builder.Environment.EnvironmentName = Environments.Development))
            |> ignore

        let app = builder.Build()
        app.MapGraphQL() |> ignore
        app.Run()
        0
