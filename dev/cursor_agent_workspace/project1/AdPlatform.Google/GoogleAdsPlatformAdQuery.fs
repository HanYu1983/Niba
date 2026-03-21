namespace AdPlatform.Google

open System
open System.Text.Json
open AdAutomation.Core
open AdAutomation.Core.Domain

module private GoogleAdsRowJson =

    let private idAsString (el: JsonElement) =
        match el.ValueKind with
        | JsonValueKind.String ->
            let s = el.GetString()

            if String.IsNullOrEmpty s then
                None
            else
                Some s
        | JsonValueKind.Number -> Some(el.GetInt64() |> string)
        | _ -> None

    let private tryChildId (row: JsonElement) (objectName: string) =
        let mutable child = Unchecked.defaultof<JsonElement>

        if row.TryGetProperty(objectName, &child) then
            let mutable idEl = Unchecked.defaultof<JsonElement>

            if child.TryGetProperty("id", &idEl) then
                idAsString idEl
            else
                None
        else
            None

    /// REST 回應使用 camelCase 欄位名稱（如 campaign、adGroup、adGroupAd）。
    let decodePath (row: JsonElement) (fallbackAccountId: string) =
        let account =
            tryChildId row "customer" |> Option.defaultValue fallbackAccountId

        let adId =
            let mutable aga = Unchecked.defaultof<JsonElement>

            if row.TryGetProperty("adGroupAd", &aga) then
                let mutable ad = Unchecked.defaultof<JsonElement>

                if aga.TryGetProperty("ad", &ad) then
                    let mutable idEl = Unchecked.defaultof<JsonElement>

                    if ad.TryGetProperty("id", &idEl) then
                        idAsString idEl
                    else
                        None
                else
                    None
            else
                None

        { AccountId = account
          CampaignId = tryChildId row "campaign"
          AdGroupId = tryChildId row "adGroup"
          AdId = adId }

/// 以編碼 ID 查詢 Google Ads。
/// 支援兩種編碼：`customerId`（僅驗證可讀客戶），或 `customerId.campaignId.adGroupId.adId`（查詢 ad_group_ad）。
type GoogleAdsPlatformAdQuery(credentials: GoogleAdsCredentials, loginCustomerId: string, ?client: GoogleAdsClient) =
    inherit PlatformAdQuery()

    let ads =
        match client with
        | Some c -> c
        | None -> GoogleAdsClient(credentials, loginCustomerId)

    static let normalizeDigits (s: string) = s.Replace("-", "", StringComparison.Ordinal).Trim()

    static let isDigits (s: string) =
        s.Length > 0 && Seq.forall Char.IsDigit s

    override _.PlatformKey = "google"

    override _.FetchByEncodedIdAsync(encodedId: string) =
        async {
            if String.IsNullOrWhiteSpace encodedId then
                return Error "EncodedAdId 為空。"
            else
                let splitOpts =
                    StringSplitOptions.RemoveEmptyEntries ||| StringSplitOptions.TrimEntries

                let parts =
                    encodedId.Split([| '.' |], splitOpts) |> Array.map normalizeDigits

                if parts.Length = 0 then
                    return Error "無法解析編碼 ID。"
                elif not (isDigits parts.[0]) then
                    return Error "客戶 ID（第一段）必須為數字。"
                else
                    let customerId = parts.[0]

                    let! gaqlResult =
                        if parts.Length >= 4 && isDigits parts.[1] && isDigits parts.[2] && isDigits parts.[3] then
                            let gaql =
                                $"SELECT customer.id, campaign.id, ad_group.id, ad_group_ad.ad.id FROM ad_group_ad WHERE campaign.id = {parts.[1]} AND ad_group.id = {parts.[2]} AND ad_group_ad.ad.id = {parts.[3]}"

                            async.Return(Ok gaql)
                        elif parts.Length = 1 then
                            async.Return(Ok "SELECT customer.id FROM customer LIMIT 1")
                        else
                            async.Return(
                                Error
                                    "編碼格式須為「customerId」或「customerId.campaignId.adGroupId.adId」（純數字，以 . 分隔）。"
                            )

                    match gaqlResult with
                    | Error e -> return Error e
                    | Ok gaql ->
                        let! search = ads.SearchAsync(customerId, gaql)

                        match search with
                        | Error e -> return Error e
                        | Ok doc ->
                            use doc = doc
                            let root = doc.RootElement
                            let mutable resultsEl = Unchecked.defaultof<JsonElement>

                            if not (root.TryGetProperty("results", &resultsEl)) then
                                return Error "Google Ads API 回應缺少 results 陣列。"
                            elif resultsEl.GetArrayLength() = 0 then
                                return Error "查無符合的 Google Ads 資料（results 為空）。"
                            else
                                let row = resultsEl.[0]

                                let path = GoogleAdsRowJson.decodePath row customerId

                                return
                                    Ok
                                        { EncodedId = encodedId
                                          DecodedPath = path }
        }
