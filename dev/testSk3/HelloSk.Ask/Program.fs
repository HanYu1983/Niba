// 進入點 #2：依命令列問題呼叫 Semantic Kernel；支援 --aws 取得 AWS CLI 語法
open HelloSk.Core.Shared

[<EntryPoint>]
let main argv =
    let isAwsMode, prompt =
        match argv with
        | [||] -> false, "用一句話介紹你自己。"
        | [| "--aws" |] -> true, "列出目前帳號的 S3 桶子"
        | arr when arr.Length >= 2 && arr.[0] = "--aws" ->
            true, String.concat " " (Array.toList arr.[1..])
        | _ -> false, String.concat " " (Array.toList argv)

    match createKernelFromEnv () with
    | Error msg ->
        printfn "錯誤：%s" msg
        1
    | Ok kernel ->
        try
            if isAwsMode then
                printfn "任務：%s" prompt
                let awsCli = getAwsCliFromGoal kernel prompt
                printfn "建議的 AWS CLI：\n%s" awsCli
            else
                let text = invokePromptAsync kernel prompt
                printfn "問：%s" prompt
                printfn "答：%s" text
            0
        with ex ->
            printfn "錯誤: %s" ex.Message
            1
