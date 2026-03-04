namespace HelloSk.Core

open System
open System.ComponentModel
open Microsoft.SemanticKernel

/// 通用工具類 Plugin：供 Kernel 註冊，讓 AI 可透過 function calling 呼叫。
/// 包含 GetEnv、RunCmd 等無副作用的讀取與安全指令執行。
type ToolsPlugin() =

    [<KernelFunction("GetEnv")>]
    [<Description("讀取環境變數。傳入變數名稱，回傳該變數的值；若不存在或為空則回傳空字串。")>]
    member _.GetEnv(
        [<Description("環境變數名稱，例如 OPENROUTER_API_KEY、PATH")>] key: string
    ) : string =
        Shared.getEnv (if isNull key then "" else key)
        |> Option.defaultValue ""

    [<KernelFunction("RunCmd")>]
    [<Description("在本機安全地執行一則 shell 指令。會阻擋：管線到 shell、輸出重定向寫檔、rm/del/format/chmod/sudo 等對本機有副作用的指令。僅適合查詢或無副作用指令（例如 aws s3 ls、echo）。回傳 stdout、stderr 與結束碼的摘要。")>]
    member _.RunCmd(
        [<Description("要執行的單行指令，例如 aws s3 ls 或 echo hello")>] command: string
    ) : string =
        match Shared.runCmd (if isNull command then "" else command) with
        | Error msg -> "Error: " + msg
        | Ok (stdout, stderr, code) ->
            let stderrPart =
                if String.IsNullOrWhiteSpace stderr then "" else "\nstderr: " + stderr
            sprintf "ExitCode: %d%s\nstdout: %s" code stderrPart (stdout.Trim())
