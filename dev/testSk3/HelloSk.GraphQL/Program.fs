namespace HelloSk.GraphQL

open System
open System.IdentityModel.Tokens.Jwt
open System.Security.Claims
open System.Text
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
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
        let secret = config["Jwt:Secret"] |> Option.ofObj |> Option.defaultValue "dev-secret-at-least-32-chars!!"
        let issuer = config["Jwt:Issuer"] |> Option.ofObj |> Option.defaultValue "HelloSk.GraphQL"
        let audience = config["Jwt:Audience"] |> Option.ofObj |> Option.defaultValue "HelloSk"
        let expMinutes = config["Jwt:ExpirationMinutes"] |> Option.ofObj |> Option.bind (fun s -> match Int32.TryParse(s) with true, n -> Some n | _ -> None) |> Option.defaultValue 60
        let key = SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
        let creds = SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        let claims = [|
            Claim(JwtRegisteredClaimNames.Sub, "me")
            Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        |]
        let expires = DateTime.UtcNow.AddMinutes(float expMinutes)
        let notBefore = System.Nullable<DateTime>()
        let token = JwtSecurityToken(issuer, audience, claims, notBefore, expires, creds)
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
            |> ignore

        let app = builder.Build()
        app.MapGraphQL() |> ignore
        app.Run()
        0
