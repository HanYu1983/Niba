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
    [<CLIMutable>]
    type AdRow =
        { [<JsonPropertyName("adId")>] EncodedAdId: string
          AdName: string
          Area: string
          [<JsonConverter(typeof<MetadataObjectMapConverter>)>]
          Metadata: Map<string, string> }

    /// 對應輸入 JSON 單檔封套（`input-model.md`）；`Items` 為 `items[]`。
    /// 與 Runner 反序列化共用；`schemaVersion` 缺漏時 JSON 預設為 `0`（建議輸入仍明寫版本）。
    [<CLIMutable>]
    type SystemInput =
        { SchemaVersion: int
          StartDate: string
          EndDate: string
          Platform: string
          CredentialCustomId: string
          Items: AdRow[] }

    type AdRowOutput =
        { AdId: string
          AdName: string
          DesiredState: DesiredState
          Metadata: Map<string, string> }

    type Error =
        { File: string
          Message: string
          Detail: string option }

    type SystemOutput =
        { SchemaVersion: int
          RunId: System.Guid
          GeneratedAt: System.DateTimeOffset
          Platform: string
          CredentialCustomId: string
          StartDate: string
          EndDate: string
          Items: AdRowOutput[]
          Errors: Error[] }

    /// 條件評估結果，供開關器使用。`platform` 由 `EvaluationContext` 提供，不應重複於列級結果 JSON。
    type Decision =
        { EncodedAdId: string
          State: DesiredState
          Reason: string option }

    /// 查詢結果：通常先以編碼 ID 呼叫平台 API，再將回應對應為階層路徑供開關器操作特定層級。
    type AdSnapshot =
        { EncodedId: string
          DecodedPath: DecodedAdPath }

    /// 依「編碼過的廣告 ID」向平台查詢；實作內可呼叫 HTTP/SDK，並組出 `DecodedPath`（可與 `Decode` 純字串解碼並用或取代）。
    [<AbstractClass>]
    type PlatformAdQuery() =
        abstract PlatformKey: string
        abstract FetchByEncodedIdAsync: encodedId: string -> Async<Result<AdSnapshot, string>>

    /// Composition root 注入：依 `(platform, credentialCustomId)` 提供**已組裝憑證**之平台查詢用戶端。
    /// 條件邏輯應透過 `EvaluationContext.PlatformQueryProvider` 取得，**勿**在 `ConditionSet` 內讀環境變數自行組裝。
    type IPlatformAdQueryProvider =
        abstract TryGetPlatformAdQuery: platform: string * credentialCustomId: string -> PlatformAdQuery option

    /// 可選：驗證憑證庫可解析該鍵（不暴露秘密）。
    type ICredentialKeyValidator =
        abstract Validate: platform: string * credentialCustomId: string -> Result<unit, string>

    /// `Runner.runWithHooks` 使用；同一 `run` 內各列共用。
    type RunEvaluationHooks =
        { PlatformQueryProvider: IPlatformAdQueryProvider option
          CredentialKeyValidator: ICredentialKeyValidator option }

        static member Empty =
            { PlatformQueryProvider = None
              CredentialKeyValidator = None }

    /// 條件評估上下文：`AdRow` 僅含列欄位；平台／憑證鍵／來源檔與期間來自輸入**封套外層**（見 `input-model.md`）。
    type EvaluationContext =
        { RunId: System.Guid
          Platform: string
          CredentialCustomId: string
          SourceFile: string
          StartDate: string
          EndDate: string
          /// 本次 Runner 執行的批次基準時間（條件可比對是否落在檔期內等）。
          BatchAt: System.DateTimeOffset
          /// 與 `RunEvaluationHooks` 對齊；條件內打 API 時優先使用，而非硬編環境變數。
          PlatformQueryProvider: IPlatformAdQueryProvider option
          CredentialKeyValidator: ICredentialKeyValidator option }
