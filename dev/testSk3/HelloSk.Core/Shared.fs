namespace HelloSk.Core

open System
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
