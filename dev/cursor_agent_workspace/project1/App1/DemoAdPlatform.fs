namespace App1

open System
open AdAutomation.Core
open AdAutomation.Core.Domain

/// App1 測試用條件：metadata `testPause`=`true` 或 adId 含 `pause`（不分大小寫）→ Off，否則 On。
type App1ConditionSet() =
    inherit ConditionSet()

    override _.EvaluateRowAsync(row, ctx) =
        async {
            let pauseByMeta =
                Map.tryFind "testPause" row.Metadata
                |> Option.map (fun v -> v.Equals("true", StringComparison.OrdinalIgnoreCase))
                |> Option.defaultValue false

            let pauseById =
                row.EncodedAdId.IndexOf("pause", StringComparison.OrdinalIgnoreCase) >= 0

            let state = if pauseByMeta || pauseById then Off else On

            let reason =
                if pauseByMeta then
                    Some "testPause=true"
                elif pauseById then
                    Some "adId 含 pause"
                else
                    Some "測試條件預設 On"

            return
                { EncodedAdId = row.EncodedAdId
                  Platform = ctx.Platform
                  State = state
                  Reason = reason }
        }
