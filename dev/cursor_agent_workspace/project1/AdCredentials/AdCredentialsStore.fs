namespace AdCredentials

open System
open System.IO
open System.Text.Json

type AdCredentialsStore private (byKey: Map<string, ResolvedCredentialEntry>) =

    static let norm (s: string) =
        if isNull s then
            ""
        else
            s.Trim().ToLowerInvariant()

    static let compositeKey clientAdPlatform customId =
        $"{norm clientAdPlatform}|{norm customId}"

    static let jsonOptions =
        JsonSerializerOptions(PropertyNameCaseInsensitive = true)

    static let trimKey (x: string) =
        if isNull x then
            ""
        else
            x.Trim()

    static let entryToResolved (e: CredentialEntryDto) : Result<struct (string * ResolvedCredentialEntry), string> =
        if isNull (box e) then
            Error "entries 內含 null 項目。"
        elif String.IsNullOrWhiteSpace e.clientName then
            Error "每一筆 entry 須有 clientName。"
        elif String.IsNullOrWhiteSpace e.clientAdPlatform then
            Error "每一筆 entry 須有 clientAdPlatform。"
        elif String.IsNullOrWhiteSpace e.credentialCustomId then
            Error "每一筆 entry 須有 credentialCustomId。"
        else
            let resolved =
                { ClientName = trimKey e.clientName
                  ClientAdPlatform = trimKey e.clientAdPlatform
                  CredentialCustomId = trimKey e.credentialCustomId
                  Key1 = trimKey e.key1
                  Key2 = trimKey e.key2
                  Key3 = trimKey e.key3
                  Key4 = trimKey e.key4
                  Key5 = trimKey e.key5 }

            Ok struct (compositeKey e.clientAdPlatform e.credentialCustomId, resolved)

    /// 自 JSON 檔載入並建立查詢索引；`(clientAdPlatform, credentialCustomId)` 比對時不分大小寫。
    /// 呼叫端請以輸入列的 `platform` 對應此處的 `clientAdPlatform`。
    static member TryLoad(path: string) : Result<AdCredentialsStore, string> =
        try
            if String.IsNullOrWhiteSpace path then
                Error "路徑為空。"
            elif not (File.Exists path) then
                Error $"找不到憑證檔：{path}"
            else
                let text = File.ReadAllText path
                let dto = JsonSerializer.Deserialize<CredentialFileDto>(text, jsonOptions) |> box

                if isNull dto then
                    Error "憑證 JSON 反序列化結果為 null。"
                else
                    let d = dto :?> CredentialFileDto

                    if d.schemaVersion <> 1 then
                        Error $"不支援的 schemaVersion：{d.schemaVersion}（僅支援 1）。"
                    elif isNull (box d.entries) then
                        Error "entries 不可為 null。"
                    else
                        let mutable m = Map.empty
                        let mutable i = 0

                        for e in d.entries do
                            i <- i + 1

                            match entryToResolved e with
                            | Error msg -> failwith $"第 {i} 筆 entry：{msg}"
                            | Ok struct (k, resolved) ->
                                if Map.containsKey k m then
                                    failwith $"重複的 (clientAdPlatform, credentialCustomId)：{norm e.clientAdPlatform} / {norm e.credentialCustomId}"
                                else
                                    m <- Map.add k resolved m

                        Ok(AdCredentialsStore m)
        with
        | :? IOException as ex -> Error $"讀取憑證檔失敗：{ex.Message}"
        | ex -> Error $"載入憑證設定失敗：{ex.Message}"

    /// 依輸入列的 `platform`（＝檔案內 `clientAdPlatform`）與 `credentialCustomId` 解析憑證。
    member _.TryResolve(platform: string, credentialCustomId: string) : Result<ResolvedCredentialEntry, string> =
        if String.IsNullOrWhiteSpace platform || String.IsNullOrWhiteSpace credentialCustomId then
            Error "platform 與 credentialCustomId 不可為空。"
        else
            let k = compositeKey platform credentialCustomId

            match Map.tryFind k byKey with
            | Some cred -> Ok cred
            | None ->
                Error $"找不到憑證：platform={platform}, credentialCustomId={credentialCustomId}"

    /// 以 `credentialCustomId` 取得 **Google** 憑證；索引鍵為 `google|credentialCustomId`。
    /// 若該鍵對應之 `clientAdPlatform` 非 `google`，則回傳錯誤。
    member this.TryResolveGoogleAdsBundle(credentialCustomId: string) : Result<GoogleAdsCredentialBundle, string> =
        match this.TryResolve(GoogleAdsCredentialBundle.ExpectedClientAdPlatform, credentialCustomId) with
        | Error e -> Error e
        | Ok entry -> GoogleAdsCredentialBundle.tryFromResolvedEntry entry
