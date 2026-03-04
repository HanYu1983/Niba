namespace HelloSk.Core

open System
open System.Collections.Generic
open System.ComponentModel
open System.Net.Http
open System.Text
open System.Text.Json
open Microsoft.SemanticKernel

[<AutoOpen>]
module private GoogleAdsPluginImpl =
    let tokenUrl = "https://www.googleapis.com/oauth2/v3/token"
    let searchVersion = "v21"
    let defaultGaql = "SELECT campaign.id, campaign.name FROM campaign LIMIT 10"

    let getEnv () : Result<Map<string, string>, string> =
        Shared.getEnv "GOOGLE_ADS_PLUGIN_ENV"
        |> Option.filter (String.IsNullOrWhiteSpace >> not)
        |> function
            | Some p -> Shared.loadEnvFile p
            | None -> Shared.loadEnvFromCandidates [ "googleapi/.env"; ".env" ]

    let requiredKeys = [ "client_id"; "client_secret"; "refresh_token"; "developer_token"; "login-customer-id" ]

    let getAccessToken (client: HttpClient) (env: Map<string, string>) : Result<string, string> =
        let form = [
            KeyValuePair<string, string>("grant_type", "refresh_token")
            KeyValuePair<string, string>("client_id", env |> Map.find "client_id")
            KeyValuePair<string, string>("client_secret", env |> Map.find "client_secret")
            KeyValuePair<string, string>("refresh_token", env |> Map.find "refresh_token")
        ]
        let content = new FormUrlEncodedContent(form)
        try
            let resp = client.PostAsync(tokenUrl, content).GetAwaiter().GetResult()
            let body = resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if not resp.IsSuccessStatusCode then
                Error(sprintf "取得 token 失敗 (%d): %s" (int resp.StatusCode) body)
            else
                use doc = JsonDocument.Parse(body)
                let root = doc.RootElement
                let mutable tokEl = Unchecked.defaultof<JsonElement>
                if root.TryGetProperty("access_token", &tokEl) then
                    Ok(tokEl.GetString() |> Option.ofObj |> Option.defaultValue "")
                else
                    Error("access_token not in response: " + body)
        with ex -> Error(ex.Message)

    let search (client: HttpClient) (env: Map<string, string>) (accessToken: string) (customerId: string) (query: string) : Result<string, string> =
        let url = sprintf "https://googleads.googleapis.com/%s/customers/%s/googleAds:search" searchVersion customerId
        let body = JsonSerializer.Serialize({| query = query |})
        use req = new HttpRequestMessage(HttpMethod.Post, url)
        req.Content <- new StringContent(body, Encoding.UTF8, "application/json")
        req.Headers.TryAddWithoutValidation("Authorization", "Bearer " + accessToken) |> ignore
        req.Headers.TryAddWithoutValidation("developer-token", env |> Map.find "developer_token") |> ignore
        req.Headers.TryAddWithoutValidation("login-customer-id", env |> Map.find "login-customer-id") |> ignore
        try
            let resp = client.SendAsync(req).GetAwaiter().GetResult()
            let s = resp.Content.ReadAsStringAsync().GetAwaiter().GetResult()
            if not resp.IsSuccessStatusCode then
                Error(sprintf "查詢失敗 (%d): %s" (int resp.StatusCode) s)
            else
                Ok s
        with ex -> Error(ex.Message)

/// 查詢 Google Ads API 的 Plugin，使用 GAQL。需在 .env 設定 client_id, client_secret, refresh_token, developer_token, login-customer-id。
/// .env 可放在專案根目錄或 googleapi/ 目錄；或設定環境變數 GOOGLE_ADS_PLUGIN_ENV 指定檔案路徑。
type GoogleAdsPlugin() =

    [<KernelFunction("query_ads")>]
    [<Description("用 GAQL 查詢 Google Ads。傳入 GAQL 查詢字串（例如查 campaign、ad_group、keyword_view 等）；可選傳入 customer_id 覆寫查詢的客戶 ID。若不傳 gaql 則使用預設查詢（campaign 列表）。")>]
    member _.QueryAds(
        [<Description("GAQL 查詢字串，例如: SELECT campaign.id, campaign.name FROM campaign LIMIT 5")>] gaql: string,
        [<Description("選填。要查詢的 Google Ads 客戶 ID，不傳則用 .env 的 customer-id 或 login-customer-id")>] customerId: string
    ) : string =
        let query =
            (gaql |> Option.ofObj |> Option.defaultValue "").Replace("\n", " ").Trim()
            |> fun s -> if String.IsNullOrEmpty s then defaultGaql else s

        match getEnv () with
        | Error e ->
            JsonSerializer.Serialize({| error = "缺少 .env: " + e |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
        | Ok env ->
            let missing = requiredKeys |> List.filter (fun k -> Option.isNone (Map.tryFind k env))
            if missing.Length > 0 then
                JsonSerializer.Serialize({| error = sprintf "缺少 .env 變數: %s" (String.concat ", " missing) |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
            else
                let cid =
                    (customerId |> Option.ofObj |> Option.defaultValue "").Trim()
                    |> fun s ->
                        if String.IsNullOrEmpty s then
                            env |> Map.tryFind "customer-id" |> Option.orElse (env |> Map.tryFind "login-customer-id") |> Option.defaultValue ""
                        else
                            s
                if String.IsNullOrEmpty cid then
                    JsonSerializer.Serialize({| error = "未設定 customer_id 且 .env 無 customer-id / login-customer-id" |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
                else
                    use client = new HttpClient()
                    client.Timeout <- TimeSpan.FromSeconds(60.0)
                    match getAccessToken client env with
                    | Error msg ->
                        JsonSerializer.Serialize({| error = msg |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
                    | Ok accessToken ->
                        match search client env accessToken cid query with
                        | Error msg ->
                            JsonSerializer.Serialize({| error = msg; query = query |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
                        | Ok body ->
                            use doc = JsonDocument.Parse(body)
                            let root = doc.RootElement
                            let mutable errEl = Unchecked.defaultof<JsonElement>
                            if root.TryGetProperty("error", &errEl) then
                                JsonSerializer.Serialize({| error = errEl.GetRawText(); query = query |}, JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping))
                            else
                                let results = ResizeArray<string>()
                                let mutable resultsEl = Unchecked.defaultof<JsonElement>
                                if root.TryGetProperty("results", &resultsEl) && resultsEl.ValueKind = JsonValueKind.Array then
                                    results.Add(sprintf "共 %d 筆" (resultsEl.GetArrayLength()))
                                    let arr = resultsEl
                                    for i = 0 to arr.GetArrayLength() - 1 do
                                        results.Add(sprintf "  [%d] %s" (i + 1) (arr.[i].GetRawText()))
                                else
                                    results.Add("共 0 筆")
                                results.Add("")
                                results.Add("完整回應:")
                                let jsonOpts = JsonSerializerOptions(WriteIndented = true, Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping)
                                results.Add(JsonSerializer.Serialize(root, jsonOpts))
                                String.concat "\n" results
