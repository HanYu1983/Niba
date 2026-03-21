module AdPlatform.Google.Program

open System
open System.Text.Encodings.Web
open System.Text.Json
open System.Text.Json.Serialization
open AdAutomation.Core.Domain
open AdCredentials
open AdPlatform.Google

/// 錯誤訊息一律寫 stderr，方便與 stdout 的 JSON 分離（管線／重新導向）。
let private err (reason: string) =
    eprintfn "錯誤原因：%s" reason

/// 主控台輸出用：避免日文等字元被序列化成 `\uXXXX`（System.Text.Json 預設行為）。
let private consoleJsonOptions (configure: JsonSerializerOptions -> unit) =
    let o = JsonSerializerOptions(WriteIndented = true)
    o.Encoder <- JavaScriptEncoder.UnsafeRelaxedJsonEscaping
    configure o
    o

let private usage () =
    eprintfn "用法:"
    eprintfn
        "  dotnet run --project AdPlatform.Google -- createSystemInput <credentials.json> <credentialCustomId> <loginCustomerId|-> <customerId> <GAQL 查詢…>"
    eprintfn "    憑證：AdCredentials JSON；login 傳「-」則使用該筆 key5（defaultLoginCustomerId）。"
    eprintfn "    成功時 stdout：SystemInput JSON（items 為各列 AdRow）。"
    eprintfn "    失敗時 stderr：錯誤原因（見「錯誤原因：」開頭列）。"
    eprintfn ""
    eprintfn "GAQL 含空白時請用引號包住；查詢可拆成多個參數（以空白合併）。"
    eprintfn ""
    eprintfn "範例:"
    eprintfn
        "  dotnet run --project AdPlatform.Google -- createSystemInput ./AdCredentials/credentials.sample.json google-local-env - 2044490174 \"SELECT campaign.id FROM campaign LIMIT 3\""

/// 憑證來自 `AdCredentials` JSON；查詢 Google Ads 後輸出 `SystemInput` JSON。
let createSystemInput (args: string[]) : int =
    if args.Length < 5 then
        err "參數不足。需要：憑證檔、credentialCustomId、login 或 -、customerId、GAQL（至少一個 token）。"
        usage ()
        1
    else
        let credPath = args.[0].Trim()
        let credentialCustomId = args.[1].Trim()
        let loginArg = args.[2].Trim()
        let customerId = args.[3].Trim()
        let gaql = String.Join(" ", args.[4..]).Trim()

        if String.IsNullOrWhiteSpace credPath || String.IsNullOrWhiteSpace credentialCustomId then
            err "憑證檔路徑與 credentialCustomId 不可為空。"
            1
        elif String.IsNullOrWhiteSpace customerId || String.IsNullOrWhiteSpace gaql then
            err "customerId 與 GAQL 不可為空。"
            1
        else
            match AdCredentialsStore.TryLoad credPath with
            | Error msg ->
                err $"無法載入憑證檔「{credPath}」：{msg}"
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
                    consoleJsonOptions (fun o ->
                        o.PropertyNamingPolicy <- JsonNamingPolicy.CamelCase
                        o.DefaultIgnoreCondition <- JsonIgnoreCondition.WhenWritingNull)

                let work =
                    async {
                        let! r =
                            match loginOpt with
                            | None -> query.SearchToSystemInputAsync(systemInput, customerId, gaql)
                            | Some login ->
                                query.SearchToSystemInputAsync(systemInput, customerId, gaql, loginCustomerId = login)

                        match r with
                        | Error msg ->
                            err $"Google Ads 查詢或轉換 SystemInput 失敗：{msg}"
                            return 3
                        | Ok siOut ->
                            try
                                let json = JsonSerializer.Serialize(siOut, jsonOpts)
                                Console.Out.WriteLine(json)
                                return 0
                            with ex ->
                                err $"序列化 SystemInput 為 JSON 失敗：{ex.Message}"
                                return 4
                    }

                work |> Async.RunSynchronously

[<EntryPoint>]
let main argv =
    Console.OutputEncoding <- Text.Encoding.UTF8

    if argv.Length < 1 then
        err "未指定子命令；應使用 createSystemInput。"
        usage ()
        1
    else
        match argv.[0].Trim().ToLowerInvariant() with
        | "createsysteminput" -> createSystemInput argv.[1..]
        | other ->
            err $"不支援的子命令「{other}」；請使用 createSystemInput。"
            usage ()
            1
