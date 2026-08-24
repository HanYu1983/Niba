namespace HelloSk.Core

open System
open System.ComponentModel
open Amazon
open Amazon.ElasticBeanstalk
open Amazon.ElasticBeanstalk.Model
open Microsoft.SemanticKernel

/// 專門處理實際問題的 Plugin，每個函數對應一項具體任務（固定應用/環境等）。
[<AutoOpen>]
module private RealTasksPluginImpl =
    let private getRegionEndpoint () =
        Shared.getEnv "AWS_REGION"
        |> Option.bind (fun s -> if String.IsNullOrWhiteSpace s then None else Some(s.Trim()))
        |> Option.bind (fun r ->
            try Some(Amazon.RegionEndpoint.GetBySystemName(r))
            with _ -> None)

    let private createEbClient () =
        match getRegionEndpoint () with
        | Some ep -> new AmazonElasticBeanstalkClient(ep)
        | None -> new AmazonElasticBeanstalkClient()

    let runSync (task: System.Threading.Tasks.Task<'T>) : 'T =
        task.GetAwaiter().GetResult()

    let wrap (f: unit -> string) : string =
        try f ()
        with ex -> "Error: " + ex.Message

    let ebEnvNamespace = "aws:elasticbeanstalk:application:environment"

    [<Literal>]
    let SmartCanvasNovaApp = "SmartCanvasNova"

    [<Literal>]
    let SmartCanvasNovaDev2Env = "smartcanvas-nova-development2"

/// 實際任務 Plugin：SmartCanvasNova EB 等具體操作。
type RealTasksPlugin() =

    [<KernelFunction("SmartCanvasNovaSetTmp")>]
    [<Description("將 EB 應用 SmartCanvasNova 的環境 smartcanvas-nova-development2 的 config 中環境變數 TMP 設為使用者輸入的值。傳入要設定的 TMP 字串。")>]
    member _.SmartCanvasNovaSetTmp(
        [<Description("要設定的 TMP 環境變數值")>] value: string
    ) : string =
        wrap (fun () ->
            let v = value |> Option.ofObj |> Option.defaultValue ""
            use client = createEbClient ()
            let req = UpdateEnvironmentRequest(
                ApplicationName = SmartCanvasNovaApp,
                EnvironmentName = SmartCanvasNovaDev2Env
            )
            req.OptionSettings.Add(ConfigurationOptionSetting(
                Namespace = ebEnvNamespace,
                OptionName = "TMP",
                Value = v
            ))
            let resp = runSync (client.UpdateEnvironmentAsync(req))
            let status = if isNull (box resp.Status) then "" else resp.Status.Value
            sprintf "OK: SmartCanvasNova %s 的 TMP 已設為 \"%s\"。status=%s" SmartCanvasNovaDev2Env v status)
