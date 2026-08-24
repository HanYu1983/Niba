namespace AdPlatform.Google

open System
open System.Net.Http
open System.Text.Json
open AdAutomation.Core.Domain
open AdCredentials

/// 將 `googleAds:search` 的單列（`results[]` 元素）轉成 `AdRow`（編碼 ID／名稱階層、精簡 metadata）。
module internal GoogleAdsSearchResultRows =

    open AdAutomation.Core.Domain

    let private tryChild (row: JsonElement) (name: string) =
        let mutable ch = Unchecked.defaultof<JsonElement>

        if row.TryGetProperty(name, &ch) then
            Some ch
        else
            None

    let private tryChildId (row: JsonElement) (objectName: string) =
        GoogleAdsJsonElement.tryChildId row objectName true

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

    /// 依序串接非空區段：`campaignName`、可選 `adGroupName`、可選 `adCreativeLabel`（與 `adId` 尾段層級對齊）。
    let private buildHierarchyAdName (campaignName: string) (adGroupName: string) (adCreativeLabel: string) =
        [ encodeNameSegment campaignName
          encodeNameSegment adGroupName
          encodeNameSegment adCreativeLabel ]
        |> List.filter (fun s -> s.Length > 0)
        |> String.concat "."

    /// `adGroupAd.ad`（REST camelCase）；無則回傳 `None`。
    let private tryAdGroupAdAd (row: JsonElement) =
        match tryChild row "adGroupAd" with
        | None -> None
        | Some aga -> tryChild aga "ad"

    let private tryAdId (row: JsonElement) =
        match tryAdGroupAdAd row with
        | None -> None
        | Some ad ->
            let mutable idEl = Unchecked.defaultof<JsonElement>

            if ad.TryGetProperty("id", &idEl) then
                GoogleAdsJsonElement.idAsString true idEl
            else
                None

    let private tryNonEmptyStringProp (el: JsonElement) (prop: string) =
        let mutable p = Unchecked.defaultof<JsonElement>

        if el.TryGetProperty(prop, &p) then
            match p.ValueKind with
            | JsonValueKind.String ->
                let s = p.GetString()

                if String.IsNullOrWhiteSpace s then None else Some(s.Trim())
            | _ -> None
        else
            None

    /// 取自 `ad.responsiveSearchAd.headlines[0].text`（若存在）。
    let private tryFirstResponsiveSearchHeadline (ad: JsonElement) =
        match tryChild ad "responsiveSearchAd" with
        | None -> None
        | Some rsa ->
            let mutable hs = Unchecked.defaultof<JsonElement>

            if rsa.TryGetProperty("headlines", &hs) && hs.ValueKind = JsonValueKind.Array then
                hs.EnumerateArray()
                |> Seq.tryPick (fun h -> tryNonEmptyStringProp h "text")
            else
                None

    /// 廣告層級可讀名稱（優先順序：`adGroupAd.name` → `ad.name` → RSA 首則 headline → ETA／文字廣告標題）。
    let private tryResolveAdCreativeLabel (row: JsonElement) : string option =
        let fromAdObject (ad: JsonElement) =
            tryNonEmptyStringProp ad "name"
            |> Option.orElseWith (fun () -> tryFirstResponsiveSearchHeadline ad)
            |> Option.orElseWith (fun () -> tryChildString ad "expandedTextAd" "headlinePart1")
            |> Option.orElseWith (fun () -> tryChildString ad "textAd" "headline")

        tryChildString row "adGroupAd" "name"
        |> Option.orElseWith (fun () ->
            tryAdGroupAdAd row |> Option.bind fromAdObject)

    let private isVideoAdType (typeStr: string) =
        if String.IsNullOrWhiteSpace typeStr then
            false
        else
            typeStr.IndexOf("VIDEO", StringComparison.OrdinalIgnoreCase) >= 0

    let private tryResourceName (row: JsonElement) (objectName: string) =
        match tryChild row objectName with
        | None -> ""
        | Some obj ->
            let mutable rn = Unchecked.defaultof<JsonElement>

            if obj.TryGetProperty("resourceName", &rn) then
                match rn.ValueKind with
                | JsonValueKind.String -> rn.GetString() |> Option.ofObj |> Option.defaultValue ""
                | _ -> ""
            else
                ""

    /// 由 API 列與查詢客戶 ID 建立一筆 `AdRow`；缺 **campaign.id** 則 `None`。
    /// JSON **`adId`**（`EncodedAdId`）＝**`customerId.`** ＋ 尾段其一：`campaignId`、`campaignId.adGroupId`、`campaignId.adGroupId.adId`。
    /// **`adName`**：僅串接非空之 `campaignName`、`adGroupName`、`adCreativeLabel`（與上列層級對齊）。
    let tryMapRow (queryCustomerIdNormalized: string) (area: string) (row: JsonElement) : AdRow option =
        let cid = queryCustomerIdNormalized
        let campId = tryChildId row "campaign"
        let agId = tryChildId row "adGroup"
        let creativeId = tryAdId row

        match campId with
        | None -> None
        | Some _ when cid.Length = 0 -> None
        | Some c ->
            match agId, creativeId with
            | None, Some _ -> None
            | None, None
            | Some _, None
            | Some _, Some _ ->
                let encodedId =
                    match agId, creativeId with
                    | None, None -> $"{cid}.{c}"
                    | Some g, None -> $"{cid}.{c}.{g}"
                    | Some g, Some adId -> $"{cid}.{c}.{g}.{adId}"
                    | None, Some _ -> ""

                if encodedId.Length = 0 then
                    None
                else
                    let campName =
                        tryChildString row "campaign" "name" |> Option.defaultValue ""

                    let agName =
                        match agId with
                        | None -> ""
                        | Some _ -> tryChildString row "adGroup" "name" |> Option.defaultValue ""

                    let adCreativeLabel = tryResolveAdCreativeLabel row
                    let adCreativePart = adCreativeLabel |> Option.defaultValue ""

                    let typeStr =
                        match agId with
                        | None -> ""
                        | Some _ ->
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

                    let resourceObject =
                        match agId with
                        | None -> "campaign"
                        | Some _ -> "adGroup"

                    let adName = buildHierarchyAdName campName agName adCreativePart

                    let md =
                        Map.empty
                        |> Map.add
                            "isVideoAd"
                            (if Option.isSome agId && isVideoAdType typeStr then "true" else "false")
                        |> Map.add "resourceName" (tryResourceName row resourceObject)
                        |> fun m ->
                            match adCreativeLabel with
                            | Some s -> Map.add "adName" s m
                            | None -> m

                    Some
                        { EncodedAdId = encodedId
                          AdName = adName
                          Area = area
                          Metadata = md }

/// 依 `credentialCustomId` 自 `AdCredentialsStore` 解析 Google 憑證並呼叫 `googleAds:search`。
type GoogleAdsCredentialQuery(store: AdCredentialsStore, ?httpClient: HttpClient) =

    let jsonWriteOptions = AdAutomation.Core.SystemTextJsonOptions.createWriteOptions ()

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
    /// `EncodedAdId`＝`customerId` ＋ 尾段：`campaignId`、`campaignId.adGroupId` 或 `campaignId.adGroupId.adId`（有 **`adGroupAd.ad.id`** 時為後者）。
    /// `AdName` 為非空之 `campaignName`／`adGroupName`／`adCreativeLabel` 以 `.` 串接；名稱區段內 `.` 轉 `_`。
    /// **`metadata`**：`isVideoAd`、`resourceName`（僅 campaign 列用 **campaign** 之 resourceName；含 ad group 則用 **ad group**）；可選 **`adName`**。
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

                let cidNorm = GoogleAdsJsonElement.normalizeDigits customerId

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
                        return Error "無法從 search results 解析任何列（缺 campaign.id，或列上含 ad id 卻無 ad group）。"
                    else
                        return Ok { si with Items = rows }
        }
