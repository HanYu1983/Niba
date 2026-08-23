namespace AdAutomation.Runner

open System.IO

/// App1／App2 等進入點共用的 `[<輸入> [<輸出>]]` 解析。
module RunnerCli =

    let tryParseIoArgs (argv: string[]) (defaultInput: string) (defaultOutput: string) =
        match argv with
        | [| i; o |] -> Ok(i, o)
        | [| i |] ->
            let dir = Path.GetDirectoryName(i)
            let name = Path.GetFileNameWithoutExtension(i) + ".result.json"

            let outPath =
                if System.String.IsNullOrEmpty dir then
                    name
                else
                    Path.Combine(dir, name)

            Ok(i, outPath)
        | [||] -> Ok(defaultInput, defaultOutput)
        | _ -> Error()
