module HelloSk.Planner.Program

open System
open HelloSk.Core.Shared

type PlannerAction =
    | Chat of message: string
    | AwsCli of goal: string * execute: bool

let private buildPlannerPrompt (history: string list) (userInput: string) =
    let historyText =
        if List.isEmpty history then
            "（目前沒有歷史對話）"
        else
            history |> String.concat "\n"

    """
你是一個在命令列裡與使用者互動的「任務規劃助手 (planner)」。
請根據對話歷史與本輪使用者輸入，決定要：
1. 直接以自然語言回答問題，或
2. 產生適當的 AWS CLI 指令（可選擇是否請系統嘗試執行）。

你可以使用的工具（由系統負責實作與呼叫）：
- getAwsCliFromGoal(goal): 依任務目標產生對應的 AWS CLI 指令（不解釋，只給指令，一行一個）。
- runCmd(command): 在本機殼層中執行指令（系統會再做安全性檢查，阻擋危險指令）。

重要約束：
- 你「只」能用下列固定格式回覆。
- 不可以加上任何多餘說明、標題、註解或程式碼區塊。
- 所有內容都必須是純文字。

回覆格式（請擇一）：
1. 純聊天回覆：
   第一行：MODE: chat
   後續行：任意自然語言內容，會原樣輸出給使用者。

2. 產生 AWS CLI 但「暫不執行」：
   第一行：MODE: aws-cli
   後續行：視為「AWS 任務目標」，將會丟給 getAwsCliFromGoal(goal)。

3. 產生 AWS CLI 並「請系統嘗試執行」：
   第一行：MODE: aws-cli-run
   後續行：視為「AWS 任務目標」，將會丟給 getAwsCliFromGoal(goal)，再視使用者設定決定是否真的執行 runCmd。

對話歷史（舊到新，一行一則）：
""" + historyText + """

本輪使用者輸入：
""" + userInput + """

請依上述規則，僅輸出一個區塊：
- 第一行為 MODE: ...
- 之後為內容行。
"""

let private parsePlannerAction (raw: string) : Result<PlannerAction, string> =
    if String.IsNullOrWhiteSpace raw then
        Error "planner 回應為空"
    else
        let lines =
            raw.Split([| '\r'; '\n' |], StringSplitOptions.RemoveEmptyEntries)
            |> Array.map (fun s -> s.Trim())
            |> Array.filter (String.IsNullOrWhiteSpace >> not)

        if lines.Length = 0 then
            Error "planner 回應沒有任何可用內容"
        else
            let modeLine = lines.[0]
            let content =
                if lines.Length > 1 then
                    lines.[1..] |> String.concat "\n"
                else
                    ""

            if not (modeLine.StartsWith("MODE:", StringComparison.OrdinalIgnoreCase)) then
                Error ("第一行必須以 MODE: 開頭，但實際為：" + modeLine)
            else
                let mode =
                    modeLine.Substring("MODE:".Length).Trim().ToLowerInvariant()

                match mode with
                | "chat" -> Ok (Chat content)
                | "aws-cli" -> Ok (AwsCli(content, false))
                | "aws-cli-run" -> Ok (AwsCli(content, true))
                | other -> Error ("未知的 MODE：" + other)

let rec private chatLoop (kernel) (history: string list) =
    Console.Write("> ")
    let input = Console.ReadLine()

    if isNull input then
        ()
    else
        let trimmed = input.Trim()
        if trimmed.Equals("exit", StringComparison.OrdinalIgnoreCase) then
            printfn "結束對話。"
        else
            let prompt = buildPlannerPrompt history trimmed
            printfn "prompt: %s" prompt
            let raw = invokePromptAsync kernel prompt
            printfn "raw: %s" raw

            match parsePlannerAction raw with
            | Error err ->
                printfn "Planner 回應解析失敗：%s" err
                printfn "原始內容：\n%s" raw
                let newHistory =
                    history
                    @ [ "User: " + trimmed
                        "PlannerError: " + err ]
                chatLoop kernel newHistory

            | Ok action ->
                match action with
                | Chat message ->
                    printfn "助手：%s" message
                    let newHistory =
                        history
                        @ [ "User: " + trimmed
                            "Assistant: " + message ]
                    chatLoop kernel newHistory

                | AwsCli (goal, execute) ->
                    let goalText = if String.IsNullOrWhiteSpace goal then trimmed else goal
                    let cli = getAwsCliFromGoal kernel goalText

                    if String.IsNullOrWhiteSpace cli then
                        printfn "無法產生 AWS CLI 指令。"
                        let newHistory =
                            history
                            @ [ "User: " + trimmed
                                "AwsCli: <empty>" ]
                        chatLoop kernel newHistory
                    elif cli.StartsWith("NOT_AWS_TASK", StringComparison.OrdinalIgnoreCase) then
                        printfn "這個任務似乎不是 AWS 相關，無法產生 AWS CLI。"
                        let newHistory =
                            history
                            @ [ "User: " + trimmed
                                "AwsCli: NOT_AWS_TASK" ]
                        chatLoop kernel newHistory
                    else
                        printfn "建議的 AWS CLI：\n%s" cli

                        let mutable historyAfterCli =
                            history
                            @ [ "User: " + trimmed
                                "AwsCli: " + cli ]

                        if execute then
                            printfn "（planner 要求執行指令，系統會先做安全性檢查）"
                            printfn "執行指令：%s" cli
                            match runCmd cli with
                            | Error msg ->
                                printfn "執行失敗：%s" msg
                                historyAfterCli <-
                                    historyAfterCli
                                    @ [ "RunCmdError: " + msg ]
                            | Ok (stdout, stderr, code) ->
                                printfn "ExitCode: %d" code
                                if not (String.IsNullOrWhiteSpace stdout) then
                                    printfn "stdout:\n%s" stdout
                                if not (String.IsNullOrWhiteSpace stderr) then
                                    printfn "stderr:\n%s" stderr

                                historyAfterCli <-
                                    historyAfterCli
                                    @ [ "RunCmdExit: " + string code ]

                        chatLoop kernel historyAfterCli

[<EntryPoint>]
let main _ =
    match createKernelFromEnv () with
    | Error msg ->
        printfn "錯誤：%s" msg
        1
    | Ok kernel ->
        printfn "HelloSk Planner 已啟動。輸入文字與 AI 聊天，或描述 AWS 任務。"
        printfn "輸入 exit 結束程式。"
        chatLoop kernel []
        0

