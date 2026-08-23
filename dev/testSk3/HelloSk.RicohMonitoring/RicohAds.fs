namespace HelloSk.RicohMonitoring

open System
open System.Globalization
open System.Net.Http
open System.Text
open System.Text.Json
open System.Collections.Generic

/// Google Ads API（searchStream / campaignBudgets:mutate）
module RicohAds =
    let private apiVersion = RicohConstants.GoogleAdsApiVersion

    let private customerIdClean (env: Map<string, string>) =
        match RicohEnv.get env "GOOGLE_ADS_CUSTOMER_ID" with
        | Some cid -> cid.Replace("-", "")
        | None -> ""

    /// NFC 正規化（キャンペーン名の比較用）
    let normalizeNfc (s: string) =
        if String.IsNullOrEmpty(s) then s else s.Normalize(NormalizationForm.FormC)

    /// アクセストークン取得（Google Ads 用 client/secret/refresh）
    let getAccessToken (client: HttpClient) (env: Map<string, string>) : Result<string, string> =
        let clientId = defaultArg (RicohEnv.get env "GOOGLE_ADS_CLIENT_ID") ""
        let clientSecret = defaultArg (RicohEnv.get env "GOOGLE_ADS_CLIENT_SECRET") ""
        let refreshToken = defaultArg (RicohEnv.get env "GOOGLE_ADS_REFRESH_TOKEN") ""
        RicohHttp.getGoogleAccessToken client clientId clientSecret refreshToken

    /// searchStream: query を POST し、結果の results を列挙。各 row は campaign / metrics 等を持つ。
    let searchStream (client: HttpClient) (env: Map<string, string>) (accessToken: string) (query: string) : Result<JsonElement list, string> =
        let cid = customerIdClean env
        let developerToken = defaultArg (RicohEnv.get env "GOOGLE_ADS_DEVELOPER_TOKEN") ""
        let url = sprintf "https://googleads.googleapis.com/%s/customers/%s/googleAds:searchStream" apiVersion cid
        let headers = [
            "Authorization", sprintf "Bearer %s" accessToken
            "developer-token", developerToken
            "Content-Type", "application/json"
        ]
        let queryEscaped = query.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "").Replace("\n", " ")
        use doc = JsonDocument.Parse(sprintf "{\"query\":\"%s\"}" queryEscaped)
        match RicohHttp.postJson client url headers doc.RootElement with
        | Error e -> Error e
        | Ok respBody ->
            try
                let results = ResizeArray<JsonElement>()
                let doc = JsonDocument.Parse(respBody)
                for root in doc.RootElement.EnumerateArray() do
                    let mutable res = Unchecked.defaultof<JsonElement>
                    if root.TryGetProperty("results", &res) then
                        for r in res.EnumerateArray() do
                            results.Add(r)
                Ok(List.ofSeq results)
            with ex -> Error(ex.Message)

    /// 費用取得: start_date ~ yesterday の campaign.name + metrics.cost_micros。NFC 名 -> 円
    let fetchCampaignCosts (client: HttpClient) (env: Map<string, string>) (accessToken: string) (campaigns: CampaignRow list) (yesterday: string) : Result<Map<string, float>, string> =
        let cid = customerIdClean env
        if String.IsNullOrEmpty(cid) then
            Error("GOOGLE_ADS_CUSTOMER_ID missing")
        else
            let byStart =
                campaigns
                |> List.choose (fun c -> c.StartDate |> Option.map (fun sd -> (sd, c.CampaignName)))
                |> List.groupBy fst
                |> List.map (fun (sd, ps) -> (sd, List.map snd ps))
            let mutable costs = Map.empty
            for (startDate, names) in byStart do
                if startDate > yesterday then
                    for n in names do costs <- costs.Add(normalizeNfc n, 0.0)
                else
                    let query = sprintf "SELECT campaign.name, metrics.cost_micros FROM campaign WHERE segments.date BETWEEN '%s' AND '%s'" startDate yesterday
                    match searchStream client env accessToken query with
                    | Error _ -> () // 1 日分失敗しても続行
                    | Ok results ->
                        let batchCosts = Dictionary<string, float>()
                        for row in results do
                            let name = normalizeNfc (row.GetProperty("campaign").GetProperty("name").GetString())
                            let micros =
                                let mutable m = Unchecked.defaultof<JsonElement>
                                if row.TryGetProperty("metrics", &m) then
                                    let mutable c = Unchecked.defaultof<JsonElement>
                                    if m.TryGetProperty("costMicros", &c) then c.GetInt64() else 0L
                                else 0L
                            let cost = float micros / 1_000_000.0
                            batchCosts.[name] <- (if batchCosts.ContainsKey(name) then batchCosts.[name] else 0.0) + cost
                        for n in names do
                            let norm = normalizeNfc n
                            if batchCosts.ContainsKey(norm) then costs <- costs.Add(norm, Math.Round(batchCosts.[norm], 0))
            Ok costs

    /// キャンペーン予算取得: ENABLED のみ。NFC 名 -> { budget_yen, budget_resource, campaign_id }
    let fetchCampaignBudgets (client: HttpClient) (env: Map<string, string>) (accessToken: string) : Result<Map<string, {| BudgetYen: float; BudgetResource: string; CampaignId: string |}>, string> =
        let query = "SELECT campaign.id, campaign.name, campaign_budget.amount_micros, campaign_budget.resource_name FROM campaign WHERE campaign.status = 'ENABLED'"
        match searchStream client env accessToken query with
        | Error e -> Error e
        | Ok results ->
            let m = Map.empty
            let mutable out = m
            for row in results do
                let camp = row.GetProperty("campaign")
                let budget = row.GetProperty("campaignBudget")
                let name = normalizeNfc (camp.GetProperty("name").GetString())
                let micros = budget.GetProperty("amountMicros").GetInt64()
                out <- out.Add(name, {| BudgetYen = float micros / 1_000_000.0; BudgetResource = budget.GetProperty("resourceName").GetString(); CampaignId = camp.GetProperty("id").GetString() |})
            Ok out

    /// 日予算 1 件更新
    let updateCampaignBudget (client: HttpClient) (env: Map<string, string>) (accessToken: string) (budgetResource: string) (newBudgetYen: int) : Result<unit, string> =
        let cid = customerIdClean env
        let developerToken = defaultArg (RicohEnv.get env "GOOGLE_ADS_DEVELOPER_TOKEN") ""
        let url = sprintf "https://googleads.googleapis.com/%s/customers/%s/campaignBudgets:mutate" apiVersion cid
        let bodyJson = sprintf """{"operations":[{"update":{"resourceName":"%s","amountMicros":"%d"},"updateMask":"amount_micros"}]}""" budgetResource (newBudgetYen * 1_000_000)
        use doc = JsonDocument.Parse(bodyJson)
        let headers = [ "Authorization", sprintf "Bearer %s" accessToken; "developer-token", developerToken; "Content-Type", "application/json" ]
        match RicohHttp.postJson client url headers doc.RootElement with
        | Error e -> Error e
        | Ok _ -> Ok()

    /// 全キャンペーンの status 取得。NFC 名 -> status
    let fetchCampaignStatuses (client: HttpClient) (env: Map<string, string>) (accessToken: string) : Result<Map<string, string>, string> =
        let query = "SELECT campaign.name, campaign.status FROM campaign"
        match searchStream client env accessToken query with
        | Error e -> Error e
        | Ok results ->
            let mutable out = Map.empty
            for row in results do
                let camp = row.GetProperty("campaign")
                let name = normalizeNfc (camp.GetProperty("name").GetString())
                let status = camp.GetProperty("status").GetString()
                out <- out.Add(name, status)
            Ok out