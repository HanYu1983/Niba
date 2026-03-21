open System
open System.IO
open App2
open AdAutomation.Runner

[<Literal>]
let EntryName = "App2"

let private defaultInput =
    Path.Combine(__SOURCE_DIRECTORY__, "..", "samples", "demo-input.json")

let private defaultOutput =
    Path.Combine(__SOURCE_DIRECTORY__, "..", "samples", "app2-output.json")

[<EntryPoint>]
let main argv =
    let ioResult =
        match argv with
        | [| i; o |] -> Ok(i, o)
        | [| i |] ->
            let dir = Path.GetDirectoryName(i)
            let name = Path.GetFileNameWithoutExtension(i) + ".result.json"
            let outPath = if String.IsNullOrEmpty dir then name else Path.Combine(dir, name)
            Ok(i, outPath)
        | [||] -> Ok(defaultInput, defaultOutput)
        | _ -> Error()

    match ioResult with
    | Error () ->
        eprintfn "用法: App2 [<輸入.json> [<輸出.json>]]"
        eprintfn "未給路徑時使用 samples/demo-input.json → samples/app2-output.json"
        2
    | Ok (inputPath, outputPath) ->
        let conditionSet = App2ConditionSet()
        match Runner.run EntryName inputPath outputPath conditionSet with
        | Ok p ->
            printfn "已寫入結果: %s" p
            0
        | Error msg ->
            eprintfn "%s" msg
            1
