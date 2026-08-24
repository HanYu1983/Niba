namespace HelloSk.Core

open System
open System.ComponentModel
open System.Net.Http
open System.Text
open System.Text.Json
open Microsoft.SemanticKernel

[<AutoOpen>]
module private FacebookPluginImpl =
    let defaultGraphVersion = "v19.0"

    let getEnv () : Result<Map<string, string>, string> =
        Shared.getEnv "FACEBOOK_ENV"
        |> Option.filter (String.IsNullOrWhiteSpace >> not)
        |> function
            | Some p -> Shared.loadEnvFile p
            | None -> Shared.loadEnvFromCandidates [ "facebookapi/.env"; ".env" ]

    let appendAccessToken (path: string) (token: string) =
        let encoded = Uri.EscapeDataString(token)
        let path = (path |> Option.ofObj |> Option.defaultValue "").Trim()
        let sep = if path.Contains("?") then "&" else "?"
        path + sep + "access_token=" + encoded

    let graphGet (client: HttpClient) (version: string) (path: string) (accessToken: string) : Result<string, string> =
        let path = (path |> Option.ofObj |> Option.defaultValue "").Trim()
        let path = if String.IsNullOrEmpty path then "/me" else path
        let pathWithToken = appendAccessToken path accessToken
        let url = sprintf "https://graph.facebook.com/%s%s" (version.Trim()) pathWithToken
        try
            let resp = client.GetAsync(url).GetAwaiter().GetResult()
            let body = resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if not resp.IsSuccessStatusCode then
                Error(sprintf "請求失敗 (%d): %s" (int resp.StatusCode) body)
            else
                Ok body
        with ex -> Error(ex.Message)

/// 查詢 Facebook Graph API 的 Plugin。需在 .env 設定 FB_ACCESS_TOKEN（可選 FB_GRAPH_VERSION，預設 v19.0）。
/// .env 可放在專案根目錄或 facebookapi/ 目錄；或設定環境變數 FACEBOOK_ENV 指定檔案路徑。
type FacebookPlugin() =

    [<KernelFunction("query_graph")>]
    [<Description("呼叫 Facebook Graph API。傳入 Graph 路徑，例如 /me、/me/adaccounts、/{ad_account_id}/campaigns。可帶查詢參數，例如 /me?fields=id,name。不傳則查 /me。")>]
    member _.QueryGraph(
        [<Description("Graph API 路徑，例如 /me、/me/adaccounts、/123456/campaigns；可含查詢參數如 ?fields=id,name")>] path: string
    ) : string =
        match getEnv () with
        | Error e ->
            JsonSerializer.Serialize({| error = "缺少 .env 變數: FB_ACCESS_TOKEN（或 " + e + "）" |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
        | Ok env ->
            let token = env |> Map.tryFind "FB_ACCESS_TOKEN" |> Option.defaultValue "" |> fun s -> s.Trim()
            if String.IsNullOrEmpty token then
                JsonSerializer.Serialize({| error = "缺少 .env 變數: FB_ACCESS_TOKEN" |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
            else
                let version = env |> Map.tryFind "FB_GRAPH_VERSION" |> Option.defaultValue defaultGraphVersion |> fun s -> if String.IsNullOrWhiteSpace s then defaultGraphVersion else s.Trim()
                let pathArg = (path |> Option.ofObj |> Option.defaultValue "").Trim() |> fun s -> if String.IsNullOrEmpty s then "/me" else s
                use client = new HttpClient()
                client.Timeout <- TimeSpan.FromSeconds(30.0)
                match graphGet client version pathArg token with
                | Error msg ->
                    JsonSerializer.Serialize({| error = msg; path = pathArg |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
                | Ok body ->
                    use doc = JsonDocument.Parse(body)
                    let root = doc.RootElement
                    let mutable errEl = Unchecked.defaultof<JsonElement>
                    if root.TryGetProperty("error", &errEl) then
                        let errStr = if errEl.ValueKind = JsonValueKind.Object then errEl.GetRawText() else (errEl.GetString() |> Option.ofObj |> Option.defaultValue "")
                        JsonSerializer.Serialize({| error = errStr; path = pathArg |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
                    else
                        body
