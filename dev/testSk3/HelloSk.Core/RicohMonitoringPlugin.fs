namespace HelloSk.Core

open System
open System.IO
open System.ComponentModel
open Microsoft.SemanticKernel
open HelloSk.RicohMonitoring

/// Ricoh 運用モニタリング SK Plugin。
/// 呼叫 HelloSk.RicohMonitoring 的 F# 程式庫（RicohFetchAndUpdate、RicohPostToSlack），不再依賴外部 Python。
/// 環境變數 RICOH_MONITORING_SCRIPT_DIR 可指定 skill 根目錄（用於預設 .env 路徑）；RICOH_MONITORING_ENV 可指定 .env 檔案路徑。
type RicohMonitoringPlugin() =

    let getScriptDir () =
        Shared.getEnv "RICOH_MONITORING_SCRIPT_DIR"
        |> Option.defaultValue ".cursor/skills/ricoh-monitoring"

    let getEnvPath () =
        Shared.getEnv "RICOH_MONITORING_ENV"
        |> Option.defaultValue (Path.Combine(getScriptDir(), ".env"))

    [<KernelFunction("RicohFetchAndUpdate")>]
    [<Description("執行リコー運用モニタリング：從 Google Ads 取得費用並更新スプレッドシート「ブランド施策2025下期」的 J列/O列/Q列，以及 Google 広告日予算。可選乾跑（不寫入）或強制大額變更。輸出 JSON 摘要供後續 Slack 通知使用。")>]
    member _.RicohFetchAndUpdate(
        [<Description("是否僅乾跑（不寫入スプレッドシート與広告）。true=乾跑")>] dryRun: bool,
        [<Description("輸出 JSON 摘要的檔案路徑，預設 ricoh_report.json")>] outputPath: string,
        [<Description("是否允許日予算 ¥5,000 以上的變更。true=允許")>] force: bool
    ) : string =
        let out = if String.IsNullOrWhiteSpace outputPath then "ricoh_report.json" else outputPath
        match RicohFetchAndUpdate.run (getEnvPath()) dryRun out force with
        | Error msg -> "Error: " + msg
        | Ok msg -> msg

    [<KernelFunction("RicohPostToSlack")>]
    [<Description("將リコー運用モニタリング的 JSON 摘要投稿到 Slack（預設 #claude_test）。需先執行 RicohFetchAndUpdate 產生 JSON 檔案。")>]
    member _.RicohPostToSlack(
        [<Description("fetch_and_update 輸出的 JSON 摘要檔案路徑，例如 ricoh_report.json")>] inputPath: string
    ) : string =
        if String.IsNullOrWhiteSpace inputPath then
            "Error: inputPath 為必填"
        else
            match RicohPostToSlack.run (getEnvPath()) inputPath "" with
            | Error msg -> "Error: " + msg
            | Ok msg -> msg
