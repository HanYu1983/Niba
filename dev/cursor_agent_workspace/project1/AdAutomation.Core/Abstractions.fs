namespace AdAutomation.Core

open AdAutomation.Core.Domain

/// 廣告 ID 編碼／解碼：各平台依自身層級（account、campaign、adgroup、ad…）實作。
/// 編碼字串慣例為以 `.` 連接各層代碼；實際段數與語意由 `PlatformKey` 對應之實作負責。
[<AbstractClass>]
type AdHierarchyCodec() =
    abstract PlatformKey: string
    abstract Encode: path: DecodedAdPath -> string
    abstract Decode: encoded: string -> Result<DecodedAdPath, string>

/// 條件邏輯：由各**進入點專案**提供具體類別並注入管線。
/// 評估可為 `async`，以便日後在規則中呼叫各種 API；核心僅依賴此抽象，不實作業務規則。
[<AbstractClass>]
type ConditionSet() =
    abstract EvaluateRowAsync: row: AdRow * ctx: EvaluationContext -> Async<Decision>

/// 解析／合併／寫檔等非列級失敗之匯流（預設可為 stderr 或 no-op）。
type IErrorSink =
    abstract Emit: Error -> unit
