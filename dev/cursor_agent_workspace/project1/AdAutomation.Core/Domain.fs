namespace AdAutomation.Core

open System
open System.Text.Json
open System.Text.Json.Serialization

/// 跨模組共用的領域型別（輸入列、決策、階層路徑）。
module Domain =

    /// 條件引擎對單列廣告的目標狀態。
    type DesiredState =
        | On
        | Off

    /// 解碼後的階層識別（各平台實作決定哪些層必填、對應幾段「.」分隔碼）。
    type DecodedAdPath =
        { AccountId: string
          CampaignId: string option
          AdGroupId: string option
          AdId: string option }

    /// `metadata` 序列化為 **JSON 物件**（非 F# Map 預設的鍵值陣列）。值若為合法 JSON 文字則以嵌套結構寫出；一般字串鍵值維持字串。
    type MetadataObjectMapConverter() =
        inherit JsonConverter<Map<string, string>>()

        override _.Write(writer, value, _options) =
            writer.WriteStartObject()

            for KeyValue(k, v) in value do
                writer.WritePropertyName(k)

                if String.IsNullOrWhiteSpace v then
                    writer.WriteStringValue("")
                else
                    let t = v.TrimStart()

                    if t.Length > 0 && (t.[0] = '{' || t.[0] = '[') then
                        try
                            use _ = JsonDocument.Parse(v)
                            writer.WriteRawValue(v)
                        with _ ->
                            writer.WriteStringValue(v)
                    else
                        writer.WriteStringValue(v)

            writer.WriteEndObject()

        override _.Read(reader, _typeToConvert, _options) =
            use doc = JsonDocument.ParseValue(&reader)
            let root = doc.RootElement

            root.EnumerateObject()
            |> Seq.map (fun p ->
                let v =
                    match p.Value.ValueKind with
                    | JsonValueKind.String -> p.Value.GetString() |> Option.ofObj |> Option.defaultValue ""
                    | _ -> p.Value.GetRawText()

                p.Name, v)
            |> Map.ofSeq

    /// JSON／管線中的一列廣告；`EncodedAdId` 為平台定義的「.」分隔編碼字串（JSON 鍵 `adId`）。
    type AdRow =
        { [<JsonPropertyName("adId")>] EncodedAdId: string
          AdName: string
          Area: string
          [<JsonConverter(typeof<MetadataObjectMapConverter>)>]
          Metadata: Map<string, string> }

    /// 對應輸入 JSON 單檔封套（`input-model.md`）；`Items` 為 `items[]`。
    type SystemInput =
        { SchemaVersion: int
          StartDate: string
          EndDate: string
          Platform: string
          CredentialCustomId: string
          Items: AdRow[] }

    /// 條件評估結果，供開關器使用。
    type Decision =
        { EncodedAdId: string
          Platform: string
          State: DesiredState
          Reason: string option }

    /// 條件評估上下文：`AdRow` 僅含列欄位；平台／憑證鍵／來源檔與期間來自輸入**封套外層**（見 `input-model.md`）。
    type EvaluationContext =
        { RunId: System.Guid
          Platform: string
          CredentialCustomId: string
          SourceFile: string
          StartDate: string
          EndDate: string }
