namespace AdAreaRouting

open System
open System.Collections.Generic
open System.IO
open System.Text.Json

type private PlatformResolved =
    { DefaultRegionCode: string
      Apis: Dictionary<string, string> }

/// 由 routing JSON 建出的查詢索引（鍵皆為小寫以利比對）。
type AreaRouting private (byAreaPlatform: IReadOnlyDictionary<string, PlatformResolved>) =

    static let norm (s: string) = s.Trim().ToLowerInvariant()

    static let jsonOptions =
        let o = JsonSerializerOptions(PropertyNameCaseInsensitive = true)
        o

    /// 從檔案載入；失敗時回傳錯誤訊息。
    static member TryLoad(path: string) : Result<AreaRouting, string> =
        try
            if String.IsNullOrWhiteSpace path then
                Error "路徑為空。"
            elif not (File.Exists path) then
                Error $"找不到檔案：{path}"
            else
                let json = File.ReadAllText path
                let dtoObj = JsonSerializer.Deserialize<RoutingFileDto>(json, jsonOptions) |> box

                if isNull dtoObj then
                    Error "JSON 反序列化結果為 null。"
                else
                    let d = dtoObj :?> RoutingFileDto

                    if isNull (box d.areas) || d.areas.Count = 0 then
                        Error "設定缺少 areas。"
                    else
                        let outer = Dictionary<string, PlatformResolved>(StringComparer.OrdinalIgnoreCase)

                        for KeyValue(areaKey, areaDto) in d.areas do
                            if not (isNull (box areaDto)) && not (isNull (box areaDto.platforms)) then
                                for KeyValue(platformKey, plat) in areaDto.platforms do
                                    if not (isNull (box plat)) then
                                        let defaultCode =
                                            if String.IsNullOrWhiteSpace plat.defaultRegionCode then
                                                ""
                                            else
                                                plat.defaultRegionCode.Trim()

                                        let apiMap =
                                            let inner = Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)

                                            if not (isNull (box plat.apis)) then
                                                for KeyValue(k, v) in plat.apis do
                                                    if not (String.IsNullOrWhiteSpace k) && not (String.IsNullOrWhiteSpace v) then
                                                        inner.[norm k] <- v.Trim()

                                            inner

                                        let compositeKey = $"{norm areaKey}|{norm platformKey}"

                                        outer.[compositeKey] <-
                                            { DefaultRegionCode = defaultCode
                                              Apis = apiMap }

                        Ok(AreaRouting outer)
        with ex ->
            Error $"載入 area routing 失敗：{ex.Message}"

    /// 取得地區／API 代碼：若有 apiName 則先查 apis，否則或查不到時用 defaultRegionCode。
    member _.TryGetRegionCode(area: string, platform: string, ?apiName: string) : string option =
        if String.IsNullOrWhiteSpace area || String.IsNullOrWhiteSpace platform then
            None
        else
            let key = $"{norm area}|{norm platform}"

            match byAreaPlatform.TryGetValue key with
            | false, _ -> None
            | true, pr ->
                match apiName with
                | Some name when not (String.IsNullOrWhiteSpace name) ->
                    match pr.Apis.TryGetValue(norm name) with
                    | true, code -> Some code
                    | false, _ ->
                        if String.IsNullOrWhiteSpace pr.DefaultRegionCode then
                            None
                        else
                            Some pr.DefaultRegionCode
                | _ ->
                    if String.IsNullOrWhiteSpace pr.DefaultRegionCode then
                        None
                    else
                        Some pr.DefaultRegionCode

    /// 與 TryGetRegionCode 相同，但查不到時回傳預設字串。
    member this.GetRegionCodeOrDefault(area: string, platform: string, ?apiName: string, ?defaultValue: string) : string =
        let fallback = defaultArg defaultValue ""
        this.TryGetRegionCode(area, platform, ?apiName = apiName) |> Option.defaultValue fallback
