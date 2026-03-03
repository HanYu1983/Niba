// 進入點 #2：依命令列問題呼叫 Semantic Kernel
open HelloSk.Core.Shared

[<EntryPoint>]
let main argv =
    let prompt =
        match argv with
        | [||] -> "用一句話介紹你自己。"
        | _ -> String.concat " " (Array.toList argv)

    match createKernelFromEnv () with
    | Error msg ->
        printfn "錯誤：%s" msg
        1
    | Ok kernel ->
        try
            let text = invokePromptAsync kernel prompt
            printfn "問：%s" prompt
            printfn "答：%s" text
            0
        with ex ->
            printfn "錯誤: %s" ex.Message
            1
