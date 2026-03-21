namespace AdPlatform.Google

open System
open System.Net.Http
open System.Text.Json
open System.Text.Json.Nodes
open AdAutomation.Core.Domain
open AdCredentials

/// 依 `credentialCustomId` 自 `AdCredentialsStore` 解析 Google 憑證並呼叫 `googleAds:search`，回傳縮排 JSON 字串。
type GoogleAdsCredentialQuery(store: AdCredentialsStore, ?httpClient: HttpClient) =

    let jsonWriteOptions = JsonSerializerOptions(WriteIndented = true)

    let jsonNodeWriteOptions =
        let o = JsonSerializerOptions(WriteIndented = true)
        o

    let metadataObject (m: Map<string, string>) : JsonNode =
        let o = JsonObject()

        for KeyValue(k, v) in m do
            o.Add(k, JsonValue.Create(v))

        o :> JsonNode

    let resultsArrayFromApiRoot (apiRoot: JsonElement) : JsonNode =
        let mutable resultsEl = Unchecked.defaultof<JsonElement>

        if apiRoot.ValueKind = JsonValueKind.Object
           && apiRoot.TryGetProperty("results", &resultsEl)
           && resultsEl.ValueKind = JsonValueKind.Array then
            JsonNode.Parse(resultsEl.GetRawText())
        else
            JsonArray() :> JsonNode

    /// 以 `SystemInput` 為外層與第一筆 `Items` 列（`adId`／`adName`／`area`／`metadata`），並在該列附掛 `query` 與 `googleAdsSearchResults`（Google 延伸）。
    let tryFormatInputAlignedJson
        (si: SystemInput)
        (queryCustomerId: string)
        (gaql: string)
        (apiSearchResponseRoot: JsonElement)
        : Result<string, string> =
        match si.Items |> Array.tryHead with
        | None -> Error "SystemInput.Items 至少需一筆以附掛查詢結果。"
        | Some row ->
            let item = JsonObject()
            item.Add("adId", row.EncodedAdId)
            item.Add("adName", row.AdName)
            item.Add("area", row.Area)
            item.Add("metadata", metadataObject row.Metadata)

            let queryObj = JsonObject()
            queryObj.Add("customerId", queryCustomerId)
            queryObj.Add("gaql", gaql)
            item.Add("query", queryObj)

            item.Add("googleAdsSearchResults", resultsArrayFromApiRoot apiSearchResponseRoot)

            let itemsArr = JsonArray()
            itemsArr.Add(item)

            let root = JsonObject()
            root.Add("schemaVersion", si.SchemaVersion)
            root.Add("platform", si.Platform)
            root.Add("credentialCustomId", si.CredentialCustomId)

            if not (String.IsNullOrWhiteSpace si.StartDate) then
                root.Add("startDate", si.StartDate)

            if not (String.IsNullOrWhiteSpace si.EndDate) then
                root.Add("endDate", si.EndDate)

            root.Add("items", itemsArr)
            Ok(root.ToJsonString(jsonNodeWriteOptions))

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

    /// 先執行 search，再以 `SystemInput` 組出與 `input-model.md` 對齊之外層 JSON（`items[0]` 含 `query`、`googleAdsSearchResults`）。
    member this.SearchToInputAlignedJsonAsync
        (
            si: SystemInput,
            customerId: string,
            gaql: string,
            ?loginCustomerId: string
        ) : Async<Result<string, string>> =
        async {
            let! raw =
                this.SearchToJsonAsync(si.CredentialCustomId, customerId, gaql, ?loginCustomerId = loginCustomerId)

            match raw with
            | Error e -> return Error e
            | Ok jsonText ->
                use doc: JsonDocument = JsonDocument.Parse(jsonText)

                return tryFormatInputAlignedJson si customerId gaql doc.RootElement
        }
