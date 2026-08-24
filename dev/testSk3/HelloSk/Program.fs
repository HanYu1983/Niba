// 進入點 #1：Hello Semantic Kernel
open HelloSk.Core.Shared

[<EntryPoint>]
let main _ =
    match createKernelFromEnv () with
    | Error msg ->
        printfn "錯誤：%s" msg
        1
    | Ok kernel ->
        try
            let prompt = "用一句話說：Hello, Semantic Kernel!"
            let text = invokePromptAsync kernel prompt
            printfn "Semantic Kernel 回覆: %s" text
            0
        with ex ->
            printfn "錯誤: %s" ex.Message
            1
