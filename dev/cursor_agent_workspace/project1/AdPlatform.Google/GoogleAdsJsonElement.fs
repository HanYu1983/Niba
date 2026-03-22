namespace AdPlatform.Google

open System
open System.Text.Json

/// Google Ads REST JSON（`results[]` 列）共用之欄位讀取；`normalizeStringDigits` 為 true 時會正規化字串型 id（與 `GoogleAdsCredentialQuery` 列映射一致）。
module internal GoogleAdsJsonElement =

    let normalizeDigits (s: string) =
        if String.IsNullOrWhiteSpace s then
            ""
        else
            s.Replace("-", "", StringComparison.Ordinal).Trim()

    let idAsString (normalizeStringDigits: bool) (el: JsonElement) =
        match el.ValueKind with
        | JsonValueKind.String ->
            let s = el.GetString()

            if String.IsNullOrEmpty s then
                None
            else
                Some(
                    if normalizeStringDigits then
                        normalizeDigits s
                    else
                        s
                )
        | JsonValueKind.Number -> Some(el.GetInt64() |> string)
        | _ -> None

    let tryChildId (row: JsonElement) (objectName: string) (normalizeStringDigits: bool) =
        let mutable child = Unchecked.defaultof<JsonElement>

        if row.TryGetProperty(objectName, &child) then
            let mutable idEl = Unchecked.defaultof<JsonElement>

            if child.TryGetProperty("id", &idEl) then
                idAsString normalizeStringDigits idEl
            else
                None
        else
            None
