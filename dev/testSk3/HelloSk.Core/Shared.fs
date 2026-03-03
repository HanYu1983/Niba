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
