namespace HelloSk.Core

open System
open System.ComponentModel
open System.IO
open Microsoft.SemanticKernel

[<AutoOpen>]
module private CodeHelperPluginImpl =
    let getWorkspaceRoot () =
        Shared.getEnv "CODE_WORKSPACE_ROOT"
        |> Option.filter (String.IsNullOrWhiteSpace >> not)
        |> Option.map (fun p -> p.Trim().Replace("~", Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)))
        |> Option.defaultValue (Environment.CurrentDirectory)

    /// 將使用者給的相對路徑解析為實體路徑，且必須在 workspace 內；否則回傳 Error。
    let resolvePath (workspaceRoot: string) (path: string) : Result<string, string> =
        if String.IsNullOrWhiteSpace path then Error "路徑不可為空"
        else
            let normalized = path.Trim().Replace("\\", "/")
            if normalized.Contains("..") then
                Error "路徑不可包含 .."
            else
                let rootFull = Path.GetFullPath(workspaceRoot)
                let combined = Path.GetFullPath(Path.Combine(rootFull, normalized))
                if not (combined.StartsWith(rootFull, StringComparison.OrdinalIgnoreCase)) then
                    Error(sprintf "路徑必須在 workspace 內：%s" rootFull)
                else
                    Ok combined

type CodeHelperPlugin() =

    [<KernelFunction("ReadFile")>]
    [<Description("讀取工作區內檔案的內容（UTF-8）。傳入相對於 workspace 的路徑或檔名，例如 HelloSk.Core/Shared.fs 或 docs/readme.md。")>]
    member _.ReadFile(
        [<Description("檔案路徑，相對於 CODE_WORKSPACE_ROOT（未設定則為目前工作目錄）")>] path: string
    ) : string =
        let root = getWorkspaceRoot()
        match resolvePath root (path |> Option.ofObj |> Option.defaultValue "") with
        | Error e -> "Error: " + e
        | Ok fullPath ->
            let fi = FileInfo(fullPath)
            if not fi.Exists then "Error: 檔案不存在 " + fullPath
            else if fi.Attributes.HasFlag(FileAttributes.Directory) then "Error: 此路徑為目錄，請指定檔案"
            else
                try
                    File.ReadAllText(fullPath, Text.Encoding.UTF8)
                with ex -> "Error: " + ex.Message

    [<KernelFunction("WriteFile")>]
    [<Description("將內容寫入工作區內的檔案（UTF-8）。若檔案不存在會建立；若存在會覆寫。路徑必須在 workspace 內。")>]
    member _.WriteFile(
        [<Description("檔案路徑，相對於 workspace")>] path: string,
        [<Description("要寫入的完整內容")>] ?content: string
    ) : string =
        let path = path |> Option.ofObj |> Option.defaultValue ""
        let content = content |> Option.defaultValue ""
        let root = getWorkspaceRoot()
        match resolvePath root path with
        | Error e -> "Error: " + e
        | Ok fullPath ->
            try
                let dir = Path.GetDirectoryName(fullPath)
                if not (String.IsNullOrEmpty dir) && not (Directory.Exists dir) then
                    Directory.CreateDirectory dir |> ignore
                File.WriteAllText(fullPath, content, Text.Encoding.UTF8)
                sprintf "OK: 已寫入 %s" fullPath
            with ex -> "Error: " + ex.Message

    [<KernelFunction("ListDir")>]
    [<Description("列出工作區內某目錄的檔案與子目錄名稱（一層）。傳入相對路徑或空字串表示 workspace 根目錄。")>]
    member _.ListDir(
        [<Description("目錄路徑，相對於 workspace；空字串表示根目錄")>] path: string
    ) : string =
        let root = getWorkspaceRoot()
        let p = path |> Option.ofObj |> Option.defaultValue ""
        let targetPath = if String.IsNullOrWhiteSpace p then "." else p.Trim().Replace("\\", "/")
        match resolvePath root targetPath with
        | Error e -> "Error: " + e
        | Ok fullPath ->
            if not (Directory.Exists fullPath) then "Error: 目錄不存在 " + fullPath
            else
                try
                    let entries = Directory.GetFileSystemEntries(fullPath) |> Array.map (fun e -> (Path.GetFileName(e), File.GetAttributes(e).HasFlag(FileAttributes.Directory)))
                    let lines = entries |> Array.map (fun (name, isDir) -> (if isDir then "[DIR]  " else "[FILE] ") + name) |> Array.sort
                    if lines.Length = 0 then "(空目錄)" else String.concat "\n" lines
                with ex -> "Error: " + ex.Message
