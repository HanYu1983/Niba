namespace AdAutomation.Core

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

    /// JSON／管線中的一列廣告；`EncodedAdId` 為平台定義的「.」分隔編碼字串（JSON 鍵 `adId`）。
    type AdRow =
        { [<JsonPropertyName("adId")>] EncodedAdId: string
          AdName: string
          Area: string
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
