namespace AdPlatform.Google

open System
open System.Net.Http
open System.Text.Json
open AdAutomation.Core.Domain
open AdCredentials

/// 將 `googleAds:search` 的單列（`results[]` 元素）轉成 `AdRow`（編碼 ID／名稱階層、精簡 metadata）。
module internal GoogleAdsSearchResultRows =

    open AdAutomation.Core.Domain

    let normalizeDigits (s: string) =
        if String.IsNullOrWhiteSpace s then
            ""
        else
            s.Replace("-", "", StringComparison.Ordinal).Trim()

    let private idAsString (el: JsonElement) =
        match el.ValueKind with
        | JsonValueKind.String ->
            let s = el.GetString()

            if String.IsNullOrEmpty s then
                None
            else
                Some(normalizeDigits s)
        | JsonValueKind.Number -> Some(el.GetInt64() |> string)
        | _ -> None

    let private tryChild (row: JsonElement) (name: string) =
        let mutable ch = Unchecked.defaultof<JsonElement>

        if row.TryGetProperty(name, &ch) then
            Some ch
        else
            None

    let private tryChildId (row: JsonElement) (objectName: string) =
        match tryChild row objectName with
        | None -> None
        | Some child ->
            let mutable idEl = Unchecked.defaultof<JsonElement>

            if child.TryGetProperty("id", &idEl) then
                idAsString idEl
            else
                None

    let private tryChildString (row: JsonElement) (objectName: string) (field: string) =
        match tryChild row objectName with
        | None -> None
        | Some child ->
            let mutable el = Unchecked.defaultof<JsonElement>

            if child.TryGetProperty(field, &el) then
                match el.ValueKind with
                | JsonValueKind.String ->
                    let s = el.GetString()

                    if String.IsNullOrEmpty s then
                        None
                    else
                        Some s
                | _ -> None
            else
                None

    /// 階層名稱用 `.` 連接；區段內原本的 `.` 改為 `_`，避免與分隔符混淆。
    let private encodeNameSegment (s: string) =
        if String.IsNullOrEmpty s then
            ""
        else
            s.Replace(".", "_", StringComparison.Ordinal).Trim()

    let private encodeAdName (campaignName: string) (adGroupName: string) =
        $"{encodeNameSegment campaignName}.{encodeNameSegment adGroupName}"

    let private isVideoAdType (typeStr: string) =
        if String.IsNullOrWhiteSpace typeStr then
            false
        else
            typeStr.IndexOf("VIDEO", StringComparison.OrdinalIgnoreCase) >= 0

    /// 由 API 列與查詢客戶 ID 建立一筆 `AdRow`；缺必填欄位則 `None`。
    let tryMapRow (queryCustomerIdNormalized: string) (area: string) (row: JsonElement) : AdRow option =
        let cid = queryCustomerIdNormalized
        let campId = tryChildId row "campaign"
        let agId = tryChildId row "adGroup"

        match campId, agId with
        | Some c, Some g when cid.Length > 0 ->
            let encodedId = $"{cid}.{c}.{g}"

            let campName =
                tryChildString row "campaign" "name" |> Option.defaultValue ""

            let agName =
                tryChildString row "adGroup" "name" |> Option.defaultValue ""

            let adName = encodeAdName campName agName

            let typeStr =
                match tryChild row "adGroup" with
                | None -> ""
                | Some ag ->
                    let mutable t = Unchecked.defaultof<JsonElement>

                    if ag.TryGetProperty("type", &t) then
                        match t.ValueKind with
                        | JsonValueKind.String -> t.GetString() |> Option.ofObj |> Option.defaultValue ""
                        | _ -> ""
                    else
                        ""

            let resourceName =
                match tryChild row "adGroup" with
                | None -> ""
                | Some ag ->
                    let mutable rn = Unchecked.defaultof<JsonElement>

                    if ag.TryGetProperty("resourceName", &rn) then
                        match rn.ValueKind with
                        | JsonValueKind.String -> rn.GetString() |> Option.ofObj |> Option.defaultValue ""
                        | _ -> ""
                    else
                        ""

            let md =
                Map.empty
                |> Map.add "isVideoAd" (if isVideoAdType typeStr then "true" else "false")
                |> Map.add "resourceName" resourceName

            let adRow =
                { EncodedAdId = encodedId
                  AdName = adName
                  Area = area
                  Metadata = md }

            Some adRow
        | _ ->
            None

/// 依 `credentialCustomId` 自 `AdCredentialsStore` 解析 Google 憑證並呼叫 `googleAds:search`。
type GoogleAdsCredentialQuery(store: AdCredentialsStore, ?httpClient: HttpClient) =

    let jsonWriteOptions = JsonSerializerOptions(WriteIndented = true)

    /// `loginCustomerId`：可覆寫憑證 key5；若未提供且 key5 為空則失敗。
    member _.SearchToJsonAsync
        (
            credentialCustomId: string,
            customerId: string,
            gaql: string,
            ?loginCustomerId: string,
            ?pageSize: int
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
                        let! search = client.SearchAsync(customerId, gaql, ?pageSize = pageSize)

                        match search with
                        | Error msg -> return Error msg
                        | Ok doc ->
                            use doc = doc

                            let json =
                                JsonSerializer.Serialize(doc.RootElement, jsonWriteOptions)

                            return Ok json
        }

    /// 執行 search 後回傳 **`SystemInput`**：沿用 `si` 外層；**`Items` 改為** API `results[]` 各列對應之 `AdRow`。
    /// `EncodedAdId`＝`customerId.campaignId.adGroupId`（數字、無連字號）；`AdName`＝`campaignName.adGroupName`（區段內 `.` 轉 `_`）。
    /// 每列 **`metadata`** 僅含 **`isVideoAd`**（`ad_group.type` 是否含 VIDEO）、**`resourceName`**（ad group 之 resourceName）。
    /// `Area`：若 `si.Items` 有第一筆則沿用其 `Area`，否則 `""`。
    member this.SearchToSystemInputAsync
        (
            si: SystemInput,
            customerId: string,
            gaql: string,
            ?loginCustomerId: string,
            ?pageSize: int
        ) : Async<Result<SystemInput, string>> =
        async {
            let! raw =
                this.SearchToJsonAsync(
                    si.CredentialCustomId,
                    customerId,
                    gaql,
                    ?loginCustomerId = loginCustomerId,
                    ?pageSize = pageSize
                )

            match raw with
            | Error e -> return Error e
            | Ok jsonText ->
                use doc: JsonDocument = JsonDocument.Parse(jsonText)
                let root = doc.RootElement

                let cidNorm = GoogleAdsSearchResultRows.normalizeDigits customerId

                let area =
                    si.Items |> Array.tryHead |> Option.map (fun r -> r.Area) |> Option.defaultValue ""

                let mutable resultsEl = Unchecked.defaultof<JsonElement>

                if root.ValueKind <> JsonValueKind.Object || not (root.TryGetProperty("results", &resultsEl)) then
                    return Ok { si with Items = [||] }
                elif resultsEl.ValueKind <> JsonValueKind.Array then
                    return Ok { si with Items = [||] }
                else
                    let rows =
                        resultsEl.EnumerateArray()
                        |> Seq.choose (fun el -> GoogleAdsSearchResultRows.tryMapRow cidNorm area el)
                        |> Seq.toArray

                    if rows.Length = 0 && resultsEl.GetArrayLength() > 0 then
                        return Error "無法從 search results 解析任何 ad group 列（缺 campaign／adGroup id）。"
                    else
                        return Ok { si with Items = rows }
        }
