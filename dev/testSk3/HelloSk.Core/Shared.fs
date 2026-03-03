namespace HelloSk.Core

open System
open System.Diagnostics
open System.Runtime.InteropServices
open System.Text.RegularExpressions
open Microsoft.SemanticKernel
open Microsoft.SemanticKernel.Connectors.OpenAI

module Shared =
    /// 從環境變數讀取，回傳 Option<string>
    let getEnv key =
        Environment.GetEnvironmentVariable key
        |> Option.ofObj

    /// 依環境變數建立 OpenRouter Kernel；失敗回傳 Error 訊息
    let createKernelFromEnv () =
        let apiKey = getEnv "OPENROUTER_API_KEY"
        let modelId = getEnv "OPENROUTER_MODEL" |> Option.defaultValue "deepseek/deepseek-chat"
        let baseUrl = getEnv "OPENROUTER_BASE_URL" |> Option.defaultValue "https://openrouter.ai/api/v1"

        match apiKey with
        | None
        | Some "" ->
            Error "請設定環境變數 OPENROUTER_API_KEY（例：docker compose run --rm -e OPENROUTER_API_KEY=sk-or-v1-... run-sk）"
        | Some key ->
            let kernel =
                Kernel.CreateBuilder()
                    .AddOpenAIChatCompletion(modelId, Uri(baseUrl), key)
                    .Build()
            Ok kernel

    /// 對 kernel 執行一個 prompt，回傳結果文字
    let invokePromptAsync (kernel: Kernel) (prompt: string) =
        kernel.InvokePromptAsync(prompt)
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> fun r -> r.GetValue<string>()
        |> fun t -> if isNull t then "" else t

    // ----- AWS CLI 語義函數 -----

    /// 語義函數用 prompt：輸入任務目標，要求只回傳 AWS CLI 指令
    let private awsCliPromptTemplate (taskGoal: string) =
        """你是一位 AWS CLI 專家。根據使用者的「任務目標」只輸出對應的 AWS CLI 指令，不要解釋、不要 markdown 程式碼塊、不要多餘文字。
若需要多個指令，一行一個。若無法對應到 AWS 服務，回傳：NOT_AWS_TASK

任務目標：
{{$input}}

只輸出 AWS CLI 指令（例如 aws s3 ls、aws ec2 describe-instances 等）："""
            .Replace("{{$input}}", taskGoal)

    /// 語義函數：輸入任務目標，回傳 AWS CLI 語法（單一字串，多行則以換行分隔）
    let getAwsCliFromGoal (kernel: Kernel) (taskGoal: string) =
        let prompt = awsCliPromptTemplate taskGoal
        invokePromptAsync kernel prompt
        |> fun s -> if isNull s then "" else s.Trim()

    // ----- 本機執行 Cmd -----

    /// 安全性檢查：禁止對本機有副作用的指令。回傳 Some 原因 表示阻擋，None 表示允許。
    let private tryBlockCommand (cmd: string) : Option<string> =
        let c = cmd.Trim()
        let ic = RegexOptions.IgnoreCase
        if String.IsNullOrWhiteSpace c then None
        else
            // 管線到 shell（遠端/本機任意碼執行）
            if Regex.IsMatch(c, @"\|\s*(sh|bash|zsh|cmd\.exe|powershell|pwsh)\b", ic) then
                Some "禁止管線到 shell（避免任意碼執行）"
            // 輸出重定向寫入本機檔案
            elif Regex.IsMatch(c, @"\s[>]{1,2}\s*\S", ic) then
                Some "禁止輸出重定向寫入本機檔案"
            // 危險指令：僅擋「指令開頭」或「在 && / ; 之後」的本機刪除/格式化/權限/權限提升（不擋 aws s3 rm 等）
            elif Regex.IsMatch(c, @"(^|&&|\|\||\;)\s*(rm\s+-|rm\s+[^\s]|rmdir\s|del\s|rd\s|format\s|mkfs\.|dd\s|chmod\s|chown\s|chgrp\s|eval\s|exec\s|sudo\s|su\s)", ic) then
                Some "禁止對本機有副作用的指令（如 rm/del/format/chmod/sudo 等）"
            else
                None

    /// 在本機執行 Cmd 指令字串（可多行，以 && 串接執行）。回傳 Ok (stdout, stderr, 結束碼) 或 Error 訊息。
    /// 會先進行安全性阻擋，禁止寫檔、管線到 shell、刪除/格式化/權限等對本機有副作用的指令。
    let runCmd (command: string) : Result<string * string * int, string> =
        let cmd = (if isNull command then "" else command).Trim()
        if String.IsNullOrWhiteSpace cmd then
            Error "未提供 Cmd 指令"
        else
            let lines =
                cmd.Split([| '\r'; '\n' |], StringSplitOptions.RemoveEmptyEntries)
                |> Array.map (fun s -> s.Trim())
                |> Array.filter (String.IsNullOrWhiteSpace >> not)
            let singleCommand = String.concat " && " lines

            match tryBlockCommand singleCommand with
            | Some reason -> Error ("安全性阻擋：" + reason)
            | None ->
                let fileName, argList =
                    if RuntimeInformation.IsOSPlatform(OSPlatform.Windows) then
                        "cmd.exe", [ "/c"; singleCommand ]
                    else
                        "/bin/sh", [ "-c"; singleCommand ]

                try
                    use p = new Process()
                    p.StartInfo.FileName <- fileName
                    for a in argList do
                        p.StartInfo.ArgumentList.Add(a)
                    p.StartInfo.UseShellExecute <- false
                    p.StartInfo.RedirectStandardOutput <- true
                    p.StartInfo.RedirectStandardError <- true
                    p.StartInfo.CreateNoWindow <- true
                    if p.Start() then
                        let stdout = p.StandardOutput.ReadToEnd()
                        let stderr = p.StandardError.ReadToEnd()
                        p.WaitForExit()
                        Ok(stdout, stderr, p.ExitCode)
                    else
                        Error "無法啟動程序"
                with ex ->
                    Error ex.Message
