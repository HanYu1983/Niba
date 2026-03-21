namespace AdPlatform.Google

open System
open System.IO
open System.Net.Http
open System.Net.Http.Headers
open System.Text
open System.Text.Json

/// `googleAds:search` 分頁：REST JSON 使用 camelCase（pageSize、pageToken、nextPageToken）。
module internal GoogleAdsSearchPaging =
    /// 單次請求列數上限（Google Ads API 規定）。
    let MaxPageSize = 10_000

    /// 防護用：避免異常迴圈或過大查詢佔滿記憶體。
    let MaxPageIterations = 50_000

    let buildRequestBody (gaql: string) (pageSize: int option) (pageToken: string option) =
        use ms = new MemoryStream()
        use w = new Utf8JsonWriter(ms)
        w.WriteStartObject()
        w.WriteString("query", gaql)

        match pageSize with
        | Some n when n > 0 -> w.WriteNumber("pageSize", min n MaxPageSize)
        | _ -> ()

        match pageToken with
        | Some t when not (String.IsNullOrWhiteSpace t) -> w.WriteString("pageToken", t.Trim())
        | _ -> ()

        w.WriteEndObject()
        w.Flush()
        Encoding.UTF8.GetString(ms.ToArray())

    let tryNextPageToken (root: JsonElement) =
        let mutable p = Unchecked.defaultof<JsonElement>

        if root.TryGetProperty("nextPageToken", &p) && p.ValueKind = JsonValueKind.String then
            match p.GetString() with
            | null
            | "" -> None
            | s -> Some s
        else
            None

    let tryFieldMaskRaw (root: JsonElement) =
        let mutable p = Unchecked.defaultof<JsonElement>
        if root.TryGetProperty("fieldMask", &p) then Some(p.GetRawText()) else None

    let mergeAllPages (rows: ResizeArray<string>) (fieldMaskRaw: string option) =
        use ms = new MemoryStream()
        use w = new Utf8JsonWriter(ms)

        w.WriteStartObject()
        w.WritePropertyName("results")
        w.WriteStartArray()

        for raw in rows do
            w.WriteRawValue(raw)

        w.WriteEndArray()

        match fieldMaskRaw with
        | Some fm ->
            w.WritePropertyName("fieldMask")
            w.WriteRawValue(fm)
        | None -> ()

        w.WriteEndObject()
        w.Flush()
        JsonDocument.Parse(ms.ToArray())

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

    /// 對指定客戶執行 GAQL `googleAds:search`，自動以 `pageSize`／`pageToken` 撈完所有分頁後合併 `results`。
    /// `pageSize`：單次請求列數上限（1～10000）；未指定則不傳此欄，由 API 使用預設。
    /// 回傳的 `JsonDocument` 須由呼叫端 `Dispose`（已不含 `nextPageToken`，`fieldMask` 沿用首頁）。
    member this.SearchAsync(customerId: string, gaql: string, ?pageSize: int) : Async<Result<JsonDocument, string>> =
        let cid = normalizeCustomerId customerId
        let loginCid = normalizeCustomerId loginCustomerIdParam

        let inputError =
            if String.IsNullOrWhiteSpace customerId || String.IsNullOrWhiteSpace gaql then
                Some "customerId 與 GAQL 查詢字串不可為空。"
            elif
                match pageSize with
                | Some n when n < 1 || n > GoogleAdsSearchPaging.MaxPageSize -> true
                | _ -> false
            then
                Some $"pageSize 須介於 1 與 {GoogleAdsSearchPaging.MaxPageSize}。"
            elif loginCid.Length = 0 then
                Some "login-customer-id（登入客戶 ID）經正規化後為空。"
            else
                None

        async {
            match inputError with
            | Some msg -> return Error msg
            | None ->
                let! tokenResult = this.GetAccessTokenAsync()

                match tokenResult with
                | Error e -> return Error e
                | Ok accessToken ->
                    let url =
                        $"https://googleads.googleapis.com/{apiVersion}/customers/{cid}/googleAds:search"

                    let rec fetchPage (pageToken: string option) (pageCount: int) (acc: ResizeArray<string>) fieldMaskOpt =
                        async {
                            if pageCount >= GoogleAdsSearchPaging.MaxPageIterations then
                                return Error $"googleAds:search 分頁超過 {GoogleAdsSearchPaging.MaxPageIterations} 次，已中止。"
                            else
                                let json = GoogleAdsSearchPaging.buildRequestBody gaql pageSize pageToken

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
                                        use doc = JsonDocument.Parse(body)
                                        let root = doc.RootElement

                                        let fm =
                                            match fieldMaskOpt with
                                            | Some _ as x -> x
                                            | None -> GoogleAdsSearchPaging.tryFieldMaskRaw root

                                        let mutable resultsEl = Unchecked.defaultof<JsonElement>

                                        if
                                            root.TryGetProperty("results", &resultsEl)
                                            && resultsEl.ValueKind = JsonValueKind.Array
                                        then
                                            for el in resultsEl.EnumerateArray() do
                                                acc.Add(el.GetRawText())

                                        match GoogleAdsSearchPaging.tryNextPageToken root with
                                        | None -> return Ok(GoogleAdsSearchPaging.mergeAllPages acc fm)
                                        | Some t -> return! fetchPage (Some t) (pageCount + 1) acc fm
                                    with ex ->
                                        return Error $"解析 Google Ads JSON 失敗：{ex.Message}"
                        }

                    return! fetchPage None 0 (ResizeArray()) None
        }
