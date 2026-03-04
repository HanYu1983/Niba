namespace HelloSk.RicohMonitoring

open System
open System.Collections.Generic
open System.Net.Http
open System.Text
open System.Text.Json

/// Google Sheets API v4（values.get / values.batchUpdate）
module RicohSheets =
    let private jsonOptions = JsonSerializerOptions(PropertyNameCaseInsensitive = true)

    /// 指定範囲の値を取得。range 例: 'ブランド施策2025下期'!A4:Q200。返すのは行ごとのセル文字列リスト。
    let getValues (client: HttpClient) (accessToken: string) (spreadsheetId: string) (range: string) : Result<string list list, string> =
        let encoded = Uri.EscapeDataString(range)
        let url = sprintf "https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s" spreadsheetId encoded
        let headers = [ "Authorization", sprintf "Bearer %s" accessToken ]
        match RicohHttp.get client url headers with
        | Error e -> Error e
        | Ok body ->
            try
                let doc = JsonDocument.Parse(body)
                let root = doc.RootElement
                match root.TryGetProperty("values") with
                | false, _ -> Ok []
                | true, arr ->
                    let rows = ResizeArray<string list>()
                    for row in arr.EnumerateArray() do
                        let r = ResizeArray<string>()
                        for cell in row.EnumerateArray() do
                            let s =
                                match cell.ValueKind with
                                | JsonValueKind.Null | JsonValueKind.Undefined -> ""
                                | JsonValueKind.String -> cell.GetString()
                                | JsonValueKind.Number -> cell.GetRawText()
                                | _ -> cell.GetRawText()
                            r.Add(if isNull s then "" else s)
                        rows.Add(List.ofSeq r)
                    Ok(List.ofSeq rows)
            with ex -> Error(ex.Message)

    /// batchUpdate: 複数 range に values を書き込む。values の要素は string / int / float 可。
    let batchUpdate (client: HttpClient) (accessToken: string) (spreadsheetId: string) (updates: (string * obj list list) list) : Result<int, string> =
        let url = sprintf "https://sheets.googleapis.com/v4/spreadsheets/%s/values:batchUpdate" spreadsheetId
        let dataArray = System.Text.Json.Nodes.JsonArray()
        for (range, values) in updates do
            let entry = System.Text.Json.Nodes.JsonObject()
            entry["range"] <- System.Text.Json.Nodes.JsonValue.Create(range)
            let rows = System.Text.Json.Nodes.JsonArray()
            for row in values do
                let rowArr = System.Text.Json.Nodes.JsonArray()
                for cell in row do
                    match cell with
                    | :? string as s -> rowArr.Add(System.Text.Json.Nodes.JsonValue.Create(s))
                    | :? int as i -> rowArr.Add(System.Text.Json.Nodes.JsonValue.Create(i))
                    | :? float as f -> rowArr.Add(System.Text.Json.Nodes.JsonValue.Create(f))
                    | _ -> rowArr.Add(System.Text.Json.Nodes.JsonValue.Create(string cell))
                rows.Add(rowArr)
            entry["values"] <- rows
            dataArray.Add(entry)
        let payload = System.Text.Json.Nodes.JsonObject()
        payload["valueInputOption"] <- System.Text.Json.Nodes.JsonValue.Create("USER_ENTERED")
        payload["data"] <- dataArray
        use doc = JsonDocument.Parse(payload.ToJsonString())
        let headers = [ "Authorization", sprintf "Bearer %s" accessToken ]
        match RicohHttp.postJson client url headers doc.RootElement with
        | Error e -> Error e
        | Ok respBody ->
            try
                use respDoc = JsonDocument.Parse(respBody)
                Ok(respDoc.RootElement.GetProperty("totalUpdatedCells").GetInt32())
            with _ -> Ok 0
