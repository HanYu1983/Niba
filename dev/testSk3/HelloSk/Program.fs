// Semantic Kernel Hello World (F#)
// 使用 OpenRouter：需設定環境變數 OPENROUTER_API_KEY（可由 docker-compose 傳入）

open System
open Microsoft.SemanticKernel
open Microsoft.SemanticKernel.Connectors.OpenAI

let getEnv key =
    Environment.GetEnvironmentVariable key
    |> Option.ofObj

[<EntryPoint>]
let main _ =
    let apiKey = getEnv "OPENROUTER_API_KEY"
    let modelId = getEnv "OPENROUTER_MODEL" |> Option.defaultValue "deepseek/deepseek-chat"
    let baseUrl = getEnv "OPENROUTER_BASE_URL" |> Option.defaultValue "https://openrouter.ai/api/v1"

    match apiKey with
    | None
    | Some "" ->
        printfn "錯誤：請設定環境變數 OPENROUTER_API_KEY"
        printfn "例：docker compose run --rm -e OPENROUTER_API_KEY=sk-or-v1-... run-sk"
        1
    | Some key ->
        try
            let kernel =
                Kernel.CreateBuilder()
                    .AddOpenAIChatCompletion(modelId, Uri(baseUrl), key)
                    .Build()

            let prompt = "用一句話說：Hello, Semantic Kernel!"
            let task = kernel.InvokePromptAsync(prompt)
            let result = task.GetAwaiter().GetResult()
            let text = result.GetValue<string>()
            printfn "Semantic Kernel 回覆: %s" (if isNull text then "" else text)
            0
        with ex ->
            printfn "錯誤: %s" ex.Message
            1
