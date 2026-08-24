open System
open System.IO
open System.Text
open App1
open AdAutomation.Apps
open AdAutomation.Runner

let private defaultInput =
    Path.Combine(__SOURCE_DIRECTORY__, "..", "samples", "demo-input.json")

let private defaultOutput =
    Path.Combine(__SOURCE_DIRECTORY__, "..", "samples", "demo-output.json")

[<EntryPoint>]
let main argv =
    // 與 AdPlatform.Google 一致：避免容器／終端非 UTF-8 時中文等輸出異常。
    Console.OutputEncoding <- Encoding.UTF8
    Console.InputEncoding <- Encoding.UTF8

    let ioResult = RunnerCli.tryParseIoArgs argv defaultInput defaultOutput

    match ioResult with
    | Error () ->
        eprintfn "用法: App1 [<輸入.json> [<輸出.json>]]"
        eprintfn "未給路徑時使用 samples/demo-input.json → samples/demo-output.json"
        eprintfn "可選：環境變數 AD_CREDENTIALS_JSON 指向憑證 JSON；未設定時嘗試 AdCredentials/credentials.sample.json。"
        2
    | Ok (inputPath, outputPath) ->
        let hooks = EvaluationHooks.tryResolveHooks ()
        let conditionSet = App1ConditionSet()

        match Runner.runWithHooks hooks inputPath outputPath conditionSet with
        | Ok (RunOutcome.SingleFile (path, _)) ->
            printfn "已寫入結果: %s" path
            0
        | Ok (RunOutcome.MultiFolder paths) ->
            printfn "已寫入 %d 個結果檔:" paths.Length

            for p in paths do
                printfn "  %s" p

            0
        | Error msg ->
            eprintfn "%s" msg
            1
