module AdPlatform.Google.Program

open System
open System.Text.Json
open System.Text.Json.Serialization
open AdAutomation.Core.Domain
open AdCredentials
open AdPlatform.Google

let private usage () =
    eprintfn "用法:"
    eprintfn "  AdPlatform.Google flow1 <loginCustomerId> <customerId> <GAQL 查詢…>"
    eprintfn "    憑證：環境變數 GOOGLE_ADS_CLIENT_ID / _CLIENT_SECRET / _REFRESH_TOKEN / _DEVELOPER_TOKEN"
    eprintfn ""
    eprintfn "  AdPlatform.Google flow2 <credentials.json> <credentialCustomId> <loginCustomerId|-> <customerId> <GAQL 查詢…>"
    eprintfn "    憑證：AdCredentials JSON；login 傳「-」則使用該筆 key5（defaultLoginCustomerId）。"
    eprintfn "    輸出：`SystemInput` JSON；`items` 為 API 各列轉成之 `AdRow`（編碼 adId／階層 adName，metadata：isVideoAd、resourceName）。"
    eprintfn ""
    eprintfn "GAQL 含空白時請用引號包住；查詢可拆成多個參數（以空白合併）。"
    eprintfn ""
    eprintfn "範例:"
    eprintfn "  dotnet run --project AdPlatform.Google -- flow1 9876543210 1234567890 \"SELECT campaign.id FROM campaign LIMIT 3\""
    eprintfn "  dotnet run --project AdPlatform.Google -- flow2 ./AdCredentials/credentials.sample.json google-local-env - 2044490174 \"SELECT campaign.id FROM campaign LIMIT 3\""

let private searchAndPrint (client: GoogleAdsClient) (customerId: string) (gaql: string) : int =
    let work =
        async {
            let! r = client.SearchAsync(customerId, gaql)

            match r with
            | Error msg ->
                eprintfn "%s" msg
                return 3
            | Ok doc ->
                use doc = doc

                let json =
                    JsonSerializer.Serialize(
                        doc.RootElement,
                        JsonSerializerOptions(WriteIndented = true)
                    )

                Console.Out.WriteLine(json)
                return 0
        }

    work |> Async.RunSynchronously

/// 憑證來自環境變數（`GoogleAdsCredentials.tryLoadFromEnvironment`）。
let flow1 (args: string[]) : int =
    if args.Length < 3 then
        eprintfn "錯誤：flow1 需要至少 3 個參數（loginCustomerId、customerId、GAQL）。"
        usage ()
        1
    else
        let loginCustomerId = args.[0].Trim()
        let customerId = args.[1].Trim()
        let gaql = String.Join(" ", args.[2..]).Trim()

        if
            String.IsNullOrWhiteSpace loginCustomerId
            || String.IsNullOrWhiteSpace customerId
            || String.IsNullOrWhiteSpace gaql
        then
            eprintfn "錯誤：loginCustomerId、customerId 與 GAQL 皆不可為空。"
            1
        else
            match GoogleAdsCredentials.tryLoadFromEnvironment () with
            | Error missing ->
                eprintfn "缺少環境變數：%s" (String.Join(", ", missing))
                2
            | Ok creds ->
                let client = GoogleAdsClient(creds, loginCustomerId)
                searchAndPrint client customerId gaql

/// 憑證來自 `AdCredentials` JSON，經 `GoogleAdsCredentialBundle` 轉成 `GoogleAdsCredentials`。
let flow2 (args: string[]) : int =
    if args.Length < 5 then
        eprintfn "錯誤：flow2 需要至少 5 個參數（憑證檔、credentialCustomId、login 或 -、customerId、GAQL）。"
        usage ()
        1
    else
        let credPath = args.[0].Trim()
        let credentialCustomId = args.[1].Trim()
        let loginArg = args.[2].Trim()
        let customerId = args.[3].Trim()
        let gaql = String.Join(" ", args.[4..]).Trim()

        if String.IsNullOrWhiteSpace credPath || String.IsNullOrWhiteSpace credentialCustomId then
            eprintfn "錯誤：憑證檔路徑與 credentialCustomId 不可為空。"
            1
        elif String.IsNullOrWhiteSpace customerId || String.IsNullOrWhiteSpace gaql then
            eprintfn "錯誤：customerId 與 GAQL 不可為空。"
            1
        else
            match AdCredentialsStore.TryLoad credPath with
            | Error msg ->
                eprintfn "%s" msg
                2
            | Ok store ->
                let loginOpt =
                    if loginArg = "-" || String.IsNullOrWhiteSpace loginArg then
                        None
                    else
                        Some loginArg

                let listingRow =
                    { EncodedAdId = customerId
                      AdName = customerId
                      Area = ""
                      Metadata = Map.empty }

                let systemInput : SystemInput =
                    { SchemaVersion = 1
                      StartDate = ""
                      EndDate = ""
                      Platform = GoogleAdsCredentialBundle.ExpectedClientAdPlatform
                      CredentialCustomId = credentialCustomId
                      Items = [| listingRow |] }

                let query = GoogleAdsCredentialQuery(store)

                let jsonOpts =
                    let o = JsonSerializerOptions(WriteIndented = true)
                    o.PropertyNamingPolicy <- JsonNamingPolicy.CamelCase
                    o.DefaultIgnoreCondition <- JsonIgnoreCondition.WhenWritingNull
                    o

                let work =
                    async {
                        let! r =
                            match loginOpt with
                            | None -> query.SearchToSystemInputAsync(systemInput, customerId, gaql)
                            | Some login ->
                                query.SearchToSystemInputAsync(systemInput, customerId, gaql, loginCustomerId = login)

                        match r with
                        | Error msg ->
                            eprintfn "%s" msg
                            return 3
                        | Ok siOut ->
                            let json = JsonSerializer.Serialize(siOut, jsonOpts)
                            Console.Out.WriteLine(json)
                            return 0
                    }

                work |> Async.RunSynchronously

[<EntryPoint>]
let main argv =
    if argv.Length < 1 then
        usage ()
        1
    else
        match argv.[0].Trim().ToLowerInvariant() with
        | "flow1" -> flow1 argv.[1..]
        | "flow2" -> flow2 argv.[1..]
        | _ ->
            eprintfn "錯誤：第一個參數須為 flow1 或 flow2。"
            usage ()
            1
