namespace AdPlatform.Google

open System
open System.Net.Http
open System.Text.Json
open AdAutomation.Core.Domain
open AdCredentials

/// 依 `credentialCustomId` 自 `AdCredentialsStore` 解析 Google 憑證並呼叫 `googleAds:search`。
type GoogleAdsCredentialQuery(store: AdCredentialsStore, ?httpClient: HttpClient) =

    let jsonWriteOptions = JsonSerializerOptions(WriteIndented = true)

    /// `loginCustomerId`：可覆寫憑證 key5；若未提供且 key5 為空則失敗。
    member _.SearchToJsonAsync
        (
            credentialCustomId: string,
            customerId: string,
            gaql: string,
            ?loginCustomerId: string
        ) : Async<Result<string, string>> =
        async {
            match store.TryResolveGoogleAdsBundle(credentialCustomId) with
            | Error e -> return Error e
            | Ok bundle ->
                match
                    GoogleAdsCredentials.tryCreate
                        bundle.ClientId
                        bundle.ClientSecret
                        bundle.RefreshToken
                        bundle.DeveloperToken
                with
                | Error missing ->
                    let joined = String.Join(", ", missing)
                    return Error $"GoogleAdsCredentials 驗證失敗，缺少：{joined}"
                | Ok creds ->
                    let loginResolved =
                        match loginCustomerId with
                        | Some s when not (String.IsNullOrWhiteSpace s) -> Ok(s.Trim())
                        | _ ->
                            match bundle.DefaultLoginCustomerId with
                            | Some s -> Ok s
                            | None ->
                                Error "未提供 loginCustomerId，且憑證 key5（defaultLoginCustomerId）為空。"

                    match loginResolved with
                    | Error msg -> return Error msg
                    | Ok login ->
                        let client = GoogleAdsClient(creds, login, ?httpClient = httpClient)
                        let! search = client.SearchAsync(customerId, gaql)

                        match search with
                        | Error msg -> return Error msg
                        | Ok doc ->
                            use doc = doc

                            let json =
                                JsonSerializer.Serialize(doc.RootElement, jsonWriteOptions)

                            return Ok json
        }

    /// 執行 search 後回傳 **`SystemInput`**：外層與列欄位沿用 `si`；於 **第一筆** `Items` 的 `Metadata` 附加
    /// `query`（JSON 字串）、`googleAdsSearchResults`（API `results` 陣列之 JSON 字串，缺則 `[]`）。
    member this.SearchToSystemInputAsync
        (
            si: SystemInput,
            customerId: string,
            gaql: string,
            ?loginCustomerId: string
        ) : Async<Result<SystemInput, string>> =
        async {
            let! raw =
                this.SearchToJsonAsync(si.CredentialCustomId, customerId, gaql, ?loginCustomerId = loginCustomerId)

            match raw with
            | Error e -> return Error e
            | Ok jsonText ->
                printfn "jsonText: %s" jsonText
                use doc: JsonDocument = JsonDocument.Parse(jsonText)
                let root = doc.RootElement

                match si.Items |> Array.tryHead with
                | None -> return Error "SystemInput.Items 至少需一筆。"
                | Some headRow ->
                    let queryJson =
                        JsonSerializer.Serialize(
                            {| customerId = customerId
                               gaql = gaql |},
                            jsonWriteOptions)

                    let resultsJson =
                        let mutable resultsEl = Unchecked.defaultof<JsonElement>

                        if root.ValueKind = JsonValueKind.Object
                           && root.TryGetProperty("results", &resultsEl) then
                            JsonSerializer.Serialize(resultsEl, jsonWriteOptions)
                        else
                            "[]"
                    // 暫不使用metadata
                    // let md =
                    //     headRow.Metadata
                    //     |> Map.add "query" queryJson
                    //     |> Map.add "googleAdsSearchResults" resultsJson

                    let rowOut = { headRow with Metadata = Map.empty }

                    let itemsOut =
                        Array.mapi (fun i r -> if i = 0 then rowOut else r) si.Items

                    return Ok { si with Items = itemsOut }
        }
