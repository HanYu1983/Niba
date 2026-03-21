namespace AdAutomation.Core

open AdAutomation.Core.Domain

/// 廣告 ID 編碼／解碼：各平台依自身層級（account、campaign、adgroup、ad…）實作。
/// 編碼字串慣例為以 `.` 連接各層代碼；實際段數與語意由 `PlatformKey` 對應之實作負責。
[<AbstractClass>]
type AdHierarchyCodec() =
    abstract PlatformKey: string
    abstract Encode: path: DecodedAdPath -> string
    abstract Decode: encoded: string -> Result<DecodedAdPath, string>

/// 查詢結果：通常先以編碼 ID 呼叫平台 API，再將回應對應為階層路徑供開關器操作特定層級。
type AdSnapshot =
    { EncodedId: string
      DecodedPath: DecodedAdPath }

/// 依「編碼過的廣告 ID」向平台查詢；實作內可呼叫 HTTP/SDK，並組出 `DecodedPath`（可與 `Decode` 純字串解碼並用或取代）。
[<AbstractClass>]
type PlatformAdQuery() =
    abstract PlatformKey: string
    abstract FetchByEncodedIdAsync: encodedId: string -> Async<Result<AdSnapshot, string>>

/// 條件邏輯：由各**進入點專案**提供具體類別並注入管線。
/// 評估可為 `async`，以便日後在規則中呼叫各種 API；核心僅依賴此抽象，不實作業務規則。
[<AbstractClass>]
type ConditionSet() =
    abstract EvaluateRowAsync: row: AdRow * ctx: EvaluationContext -> Async<Decision>
