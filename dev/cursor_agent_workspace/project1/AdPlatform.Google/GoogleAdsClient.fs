namespace AdPlatform.Google

open System
open System.Net.Http
open System.Net.Http.Headers
open System.Text
open System.Text.Json

module internal SharedGoogleHttp =
    let client =
        lazy
            let c = new HttpClient()
            c.Timeout <- TimeSpan.FromSeconds 120.
            c.DefaultRequestHeaders.UserAgent.ParseAdd("AdPlatform.Google/1.0")
            c

    let get () = client.Value

/// 封裝 OAuth access token 快取與 `googleads.googleapis.com` 的 `googleAds:search` REST 呼叫。
/// `loginCustomerId`：API 標頭 `login-customer-id`（MCC／登入客戶，純數字可含連字號）。
type GoogleAdsClient(credentials: GoogleAdsCredentials, loginCustomerId: string, ?httpClient: HttpClient) =

    let http =
        match httpClient with
        | Some h -> h
        | None -> SharedGoogleHttp.get ()

    let creds = credentials
    let loginCustomerIdParam = loginCustomerId
    let apiVersion = "v23"
    let lockObj = obj ()
    let mutable cachedToken: (string * DateTimeOffset) option = None

    let normalizeCustomerId (s: string) =
        if String.IsNullOrWhiteSpace s then
            ""
        else
            s.Replace("-", "", StringComparison.Ordinal).Trim()

    /// 強制重新以 refresh_token 換取 access token（不經快取）。
    member _.RefreshAccessTokenAsync() : Async<Result<struct (string * int), string>> =
        GoogleOAuth.refreshAccessTokenAsync http creds

    /// 取得可用的 Bearer token（含約 2 分鐘緩衝的快取）。
    member this.GetAccessTokenAsync() : Async<Result<string, string>> =
        async {
            let now = DateTimeOffset.UtcNow

            let fromCache =
                lock lockObj (fun () ->
                    match cachedToken with
                    | Some (tok, exp) when exp > now.AddMinutes(1.) -> Some tok
                    | _ -> None)

            match fromCache with
            | Some t -> return Ok t
            | None ->
                let! refreshed = this.RefreshAccessTokenAsync()

                match refreshed with
                | Error e -> return Error e
                | Ok struct (tok, expSec) ->
                    let skew = min 120 (max 30 (expSec / 10))
                    let expAt = now.AddSeconds(float (expSec - skew))
                    lock lockObj (fun () -> cachedToken <- Some(tok, expAt))
                    return Ok tok
        }

    /// 對指定客戶執行 GAQL `googleAds:search`；回傳的 `JsonDocument` 須由呼叫端 `Dispose`。
    member this.SearchAsync(customerId: string, gaql: string) : Async<Result<JsonDocument, string>> =
        async {
            if String.IsNullOrWhiteSpace customerId || String.IsNullOrWhiteSpace gaql then
                return Error "customerId 與 GAQL 查詢字串不可為空。"
            else
                let cid = normalizeCustomerId customerId
                let loginCid = normalizeCustomerId loginCustomerIdParam

                if loginCid.Length = 0 then
                    return Error "login-customer-id（登入客戶 ID）經正規化後為空。"
                else
                    let! tokenResult = this.GetAccessTokenAsync()

                    match tokenResult with
                    | Error e -> return Error e
                    | Ok accessToken ->
                        let url =
                            $"https://googleads.googleapis.com/{apiVersion}/customers/{cid}/googleAds:search"

                        let json = JsonSerializer.Serialize {| query = gaql |}

                        use req = new HttpRequestMessage(HttpMethod.Post, url)
                        req.Headers.Authorization <- AuthenticationHeaderValue("Bearer", accessToken)
                        req.Headers.TryAddWithoutValidation("developer-token", creds.DeveloperToken) |> ignore
                        req.Headers.TryAddWithoutValidation("login-customer-id", loginCid) |> ignore
                        req.Content <- new StringContent(json, Encoding.UTF8, "application/json")

                        let! resp = http.SendAsync(req) |> Async.AwaitTask
                        let! body = resp.Content.ReadAsStringAsync() |> Async.AwaitTask

                        if not resp.IsSuccessStatusCode then
                            return Error $"Google Ads API 錯誤 ({int resp.StatusCode}): {body}"
                        else
                            try
                                let doc = JsonDocument.Parse(body)
                                return Ok doc
                            with ex ->
                                return Error $"解析 Google Ads JSON 失敗：{ex.Message}"
        }
