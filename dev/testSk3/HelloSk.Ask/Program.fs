// 進入點 #2：依命令列問題呼叫 Semantic Kernel；支援 --aws 取得 AWS CLI 語法、--chat 進入聊天模式測試 Plugin
open System
open System.Threading.Tasks
open Microsoft.SemanticKernel
open Microsoft.SemanticKernel.ChatCompletion
open HelloSk.Core
open HelloSk.Core.Shared

let defaultSystemMessage = """
你是助理，可依使用者需求選擇呼叫以下工具（Plugin）：
- CodeHelper（寫/改/跑程式）：ReadFile(path)、WriteFile(path, content)、ListDir(path)。路徑為相對於 workspace 根目錄。
- Tools：GetEnv(key)、RunCmd(command)，可用於 dotnet build、dotnet test 等，不可寫檔。
- Aws（AWS）：S3ListBuckets()、S3ListObjects、S3GetObjectText；EBGetEnvVars、EBUpdateEnvVars。
- RealTasks（實際任務）：SmartCanvasNovaSetTmp(value) 將 EB SmartCanvasNova 的 smartcanvas-nova-development2 的 TMP 環境變數設為 value。
- Facebook：query_graph(path)，如 /me、/me/adaccounts
- GoogleAds：query_ads(gaql, customerId)
- RicohMonitoring：RicohFetchAndUpdate、RicohPostToSlack
撰寫或修改程式時請依序使用 ReadFile/ListDir、WriteFile、RunCmd；查詢 AWS 時使用 Aws 的 S3 函數。回覆簡潔中文。
"""

let runChatLoop (kernel: Kernel) : unit =
    let chatService = kernel.GetRequiredService<IChatCompletionService>()
    let settings = PromptExecutionSettings()
    settings.FunctionChoiceBehavior <- FunctionChoiceBehavior.Auto()
    let history = ChatHistory()
    history.AddSystemMessage(defaultSystemMessage)
    printfn "=== 聊天模式（測試 Plugin 理解）==="
    printfn "輸入訊息後按 Enter；輸入 exit 或 quit 結束。"
    printfn ""
    let rec loop () =
        printf "You: "
        let input = Console.ReadLine() |> Option.ofObj |> Option.defaultValue ""
        let trimmed = input.Trim()
        if String.Equals(trimmed, "exit", StringComparison.OrdinalIgnoreCase)
           || String.Equals(trimmed, "quit", StringComparison.OrdinalIgnoreCase) then
            printfn "Bye."
        else if String.IsNullOrEmpty trimmed then
            loop ()
        else
            history.AddUserMessage(trimmed)
            try
                let result =
                    chatService.GetChatMessageContentAsync(history, settings, kernel)
                    |> Async.AwaitTask
                    |> Async.RunSynchronously
                history.Add(result)
                let content = result.Content |> Option.ofObj |> Option.defaultValue ""
                printfn "Assistant: %s" content
            with ex ->
                printfn "錯誤: %s" ex.Message
            printfn ""
            loop ()
    loop ()

[<EntryPoint>]
let main argv =
    let isChatMode, isAwsMode, prompt =
        match argv with
        | [||] -> false, false, "用一句話介紹你自己。"
        | [| "--chat" |] -> true, false, ""
        | arr when arr.Length >= 1 && arr.[0] = "--chat" ->
            true, false, ""
        | [| "--aws" |] -> false, true, "列出目前帳號的 S3 桶子"
        | arr when arr.Length >= 2 && arr.[0] = "--aws" ->
            false, true, String.concat " " (Array.toList arr.[1..])
        | _ -> false, false, String.concat " " (Array.toList argv)

    match createKernelFromEnv () with
    | Error msg ->
        printfn "錯誤：%s" msg
        1
    | Ok kernel ->
        PluginRegistration.registerCorePlugins kernel
        try
            if isChatMode then
                runChatLoop kernel
                0
            elif isAwsMode then
                printfn "任務：%s" prompt
                let awsCli = getAwsCliFromGoal kernel prompt
                printfn "建議的 AWS CLI：\n%s" awsCli
                0
            else
                let text = invokePromptAsync kernel prompt
                printfn "問：%s" prompt
                printfn "答：%s" text
                0
        with ex ->
            printfn "錯誤: %s" ex.Message
            1
