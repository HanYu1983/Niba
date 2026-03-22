namespace App2

open AdAutomation.Core
open AdAutomation.Core.Domain

/// App2 測試用：全部列預設 On。
type App2ConditionSet() =
    inherit ConditionSet()

    override _.EvaluateRowAsync(row, ctx) =
        async {
            return
                { EncodedAdId = row.EncodedAdId
                  State = On
                  Reason = Some "App2 default On" }
        }

