namespace HelloSk.Core

open System
open System.ComponentModel
open System.IO
open System.Text
open System.Text.Json
open Amazon
open Amazon.ElasticBeanstalk
open Amazon.ElasticBeanstalk.Model
open Amazon.S3
open Amazon.S3.Model
open Microsoft.SemanticKernel

/// AWS Plugin：使用 AWS .NET SDK，依任務擴充（目前為 S3 唯讀操作）。
/// 憑證依 SDK 預設鏈：環境變數、~/.aws/credentials、IAM role 等。Region 可用環境變數 AWS_REGION。
[<AutoOpen>]
module private AwsPluginImpl =
    let private getRegionEndpoint () =
        let region =
            Shared.getEnv "AWS_REGION"
            |> Option.bind (fun s -> if String.IsNullOrWhiteSpace s then None else Some(s.Trim()))
        match region with
        | Some r ->
            try Some(Amazon.RegionEndpoint.GetBySystemName(r))
            with _ -> None
        | None -> None

    let createS3Client () =
        match getRegionEndpoint () with
        | Some ep -> new AmazonS3Client(ep)
        | None -> new AmazonS3Client()

    let createEbClient () =
        match getRegionEndpoint () with
        | Some ep -> new AmazonElasticBeanstalkClient(ep)
        | None -> new AmazonElasticBeanstalkClient()

    let runSync (task: System.Threading.Tasks.Task<'T>) : 'T =
        task.GetAwaiter().GetResult()

    /// 回傳可讀摘要字串，失敗回傳 "Error: ..."
    let wrap (f: unit -> string) : string =
        try
            f ()
        with ex -> "Error: " + ex.Message

    let ebEnvNamespace = "aws:elasticbeanstalk:application:environment"

    let parseJsonObject (json: string) : Result<(string * JsonElement) list, string> =
        if String.IsNullOrWhiteSpace json then
            Error "envVarsJson 為必填（JSON object，例如 {\"KEY\":\"VALUE\"}；值為 null 表示移除）"
        else
            try
                use doc = JsonDocument.Parse(json)
                let root = doc.RootElement
                if root.ValueKind <> JsonValueKind.Object then
                    Error "envVarsJson 必須是 JSON object，例如 {\"KEY\":\"VALUE\"}"
                else
                    root.EnumerateObject()
                    |> Seq.map (fun p -> p.Name, p.Value)
                    |> Seq.toList
                    |> Ok
            with ex ->
                Error("envVarsJson 解析失敗: " + ex.Message)

/// AWS 操作 Plugin，可隨任務擴充（S3、Lambda、DynamoDB 等）。
type AwsPlugin() =

    [<KernelFunction("S3ListBuckets")>]
    [<Description("列出目前帳號下所有 S3 桶子名稱與建立時間。需要 s3:ListAllMyBuckets 權限。")>]
    member _.S3ListBuckets() : string =
        wrap (fun () ->
            use client = createS3Client ()
            let resp = runSync (client.ListBucketsAsync())
            if isNull resp.Buckets || resp.Buckets.Count = 0 then
                "（無 S3 桶子）"
            else
                resp.Buckets
                |> Seq.map (fun b -> sprintf "%s  (%O)" (defaultArg (Option.ofObj b.BucketName) "") b.CreationDate)
                |> String.concat "\n")

    [<KernelFunction("S3ListObjects")>]
    [<Description("列出指定 S3 桶子內的物件（key、大小、最後修改時間）。可選 prefix 篩選前綴。最多回傳 1000 筆。需要 s3:ListBucket 權限。")>]
    member _.S3ListObjects(
        [<Description("S3 桶子名稱")>] bucketName: string,
        [<Description("選填。只列出 key 以此前綴開頭的物件，例如 folder/")>] ?prefix: string
    ) : string =
        wrap (fun () ->
            let bucket = bucketName |> Option.ofObj |> Option.defaultValue ""
            if String.IsNullOrWhiteSpace bucket then "Error: bucketName 為必填"
            else
                use client = createS3Client ()
                let req = ListObjectsV2Request(BucketName = bucket, MaxKeys = 1000)
                match Option.ofObj (defaultArg prefix null) with
                | Some p when not (String.IsNullOrWhiteSpace p) -> req.Prefix <- p.Trim()
                | _ -> ()
                let resp = runSync (client.ListObjectsV2Async(req))
                if isNull resp.S3Objects || resp.S3Objects.Count = 0 then
                    sprintf "（桶子 %s 內無物件或前綴無符合）" bucket
                else
                    resp.S3Objects
                    |> Seq.map (fun o -> sprintf "%s  %O bytes  %O" (defaultArg (Option.ofObj o.Key) "") o.Size o.LastModified)
                    |> String.concat "\n")

    [<KernelFunction("S3GetObjectText")>]
    [<Description("取得 S3 物件內容為文字（UTF-8）。僅適合小型文字檔（例如 < 1MB）。需要 s3:GetObject 權限。")>]
    member _.S3GetObjectText(
        [<Description("S3 桶子名稱")>] bucketName: string,
        [<Description("物件 key（路徑）")>] key: string
    ) : string =
        wrap (fun () ->
            let bucket = bucketName |> Option.ofObj |> Option.defaultValue ""
            let keyVal = key |> Option.ofObj |> Option.defaultValue ""
            if String.IsNullOrWhiteSpace bucket then "Error: bucketName 為必填"
            elif String.IsNullOrWhiteSpace keyVal then "Error: key 為必填"
            else
                let maxBytes = 1 * 1024 * 1024
                use client = createS3Client ()
                let resp = runSync (client.GetObjectAsync(bucket, keyVal))
                use stream = resp.ResponseStream
                if resp.ContentLength > int64 maxBytes then
                    sprintf "Error: 物件過大 (%d bytes)，僅支援 < 1MB 文字" resp.ContentLength
                else
                    use reader = new StreamReader(stream, Encoding.UTF8)
                    reader.ReadToEnd())

    [<KernelFunction("EBUpdateEnvVars")>]
    [<Description("更新 AWS Elastic Beanstalk 環境的環境變數（namespace aws:elasticbeanstalk:application:environment）。傳入 environmentName 與 envVarsJson（JSON object）。值為 null 代表移除該變數。")>]
    member _.EBUpdateEnvVars(
        [<Description("Elastic Beanstalk 環境名稱（EnvironmentName）")>] environmentName: string,
        [<Description("要設定/移除的環境變數 JSON object，例如 {\"FOO\":\"bar\",\"REMOVE_ME\":null}")>] envVarsJson: string
    ) : string =
        wrap (fun () ->
            let envName = environmentName |> Option.ofObj |> Option.defaultValue "" |> fun s -> s.Trim()
            if String.IsNullOrWhiteSpace envName then
                "Error: environmentName 為必填"
            else
                match parseJsonObject envVarsJson with
                | Error e -> "Error: " + e
                | Ok pairs ->
                    let toSet =
                        pairs
                        |> List.choose (fun (k, v) ->
                            let key = (k |> Option.ofObj |> Option.defaultValue "").Trim()
                            if String.IsNullOrWhiteSpace key then None
                            elif v.ValueKind = JsonValueKind.Null then None
                            else
                                let value =
                                    if v.ValueKind = JsonValueKind.String then v.GetString() |> Option.ofObj |> Option.defaultValue ""
                                    else v.GetRawText()
                                Some(key, value))

                    let toRemove =
                        pairs
                        |> List.choose (fun (k, v) ->
                            let key = (k |> Option.ofObj |> Option.defaultValue "").Trim()
                            if String.IsNullOrWhiteSpace key then None
                            elif v.ValueKind = JsonValueKind.Null then Some key
                            else None)

                    if toSet.IsEmpty && toRemove.IsEmpty then
                        "Error: envVarsJson 沒有任何可更新的項目（請至少包含一個 key）"
                    else
                        use client = createEbClient ()
                        let req = UpdateEnvironmentRequest(EnvironmentName = envName)

                        if not toSet.IsEmpty then
                            for (k, v) in toSet do
                                req.OptionSettings.Add(
                                    ConfigurationOptionSetting(
                                        Namespace = ebEnvNamespace,
                                        OptionName = k,
                                        Value = v
                                    )
                                )

                        if not toRemove.IsEmpty then
                            for k in toRemove do
                                req.OptionsToRemove.Add(
                                    OptionSpecification(
                                        Namespace = ebEnvNamespace,
                                        OptionName = k
                                    )
                                )

                        let resp = runSync (client.UpdateEnvironmentAsync(req))
                        let status =
                            if isNull (box resp.Status) then ""
                            else resp.Status.Value
                        sprintf "OK: EB 環境 %s 已更新。set=%d remove=%d status=%s" envName toSet.Length toRemove.Length status)

    [<KernelFunction("EBGetEnvVars")>]
    [<Description("取得 AWS Elastic Beanstalk 環境的環境變數（namespace aws:elasticbeanstalk:application:environment）。傳入 environmentName；可選 applicationName，未傳則由 API 查詢。需要 elasticbeanstalk:DescribeConfigurationSettings（與 DescribeEnvironments）權限。")>]
    member _.EBGetEnvVars(
        [<Description("Elastic Beanstalk 環境名稱（EnvironmentName）")>] environmentName: string,
        [<Description("選填。所屬應用名稱（ApplicationName），不傳則依 environmentName 查詢")>] ?applicationName: string
    ) : string =
        wrap (fun () ->
            let envName = environmentName |> Option.ofObj |> Option.defaultValue "" |> fun s -> s.Trim()
            if String.IsNullOrWhiteSpace envName then
                "Error: environmentName 為必填"
            else
                use client = createEbClient ()
                let appName =
                    match Option.ofObj (defaultArg applicationName null) with
                    | Some a when not (String.IsNullOrWhiteSpace a) -> a.Trim()
                    | _ ->
                        let descReq = DescribeEnvironmentsRequest(EnvironmentNames = ResizeArray [ envName ])
                        let descResp = runSync (client.DescribeEnvironmentsAsync(descReq))
                        if isNull descResp.Environments || descResp.Environments.Count = 0 then
                            raise (InvalidOperationException(sprintf "找不到環境: %s" envName))
                        let env = descResp.Environments.[0]
                        defaultArg (Option.ofObj env.ApplicationName) ""
                if String.IsNullOrWhiteSpace appName then
                    "Error: 無法取得 ApplicationName（請傳入 applicationName）"
                else
                    let req = DescribeConfigurationSettingsRequest(ApplicationName = appName, EnvironmentName = envName)
                    let resp = runSync (client.DescribeConfigurationSettingsAsync(req))
                    if isNull resp.ConfigurationSettings || resp.ConfigurationSettings.Count = 0 then
                        sprintf "（環境 %s 無 configuration settings）" envName
                    else
                        let envVars =
                            resp.ConfigurationSettings
                            |> Seq.collect (fun (cs: ConfigurationSettingsDescription) -> if isNull cs.OptionSettings then Seq.empty else seq { for x in cs.OptionSettings -> x })
                            |> Seq.filter (fun (o: ConfigurationOptionSetting) -> (defaultArg (Option.ofObj o.Namespace) "") = ebEnvNamespace)
                            |> Seq.map (fun (o: ConfigurationOptionSetting) -> sprintf "%s=%s" (defaultArg (Option.ofObj o.OptionName) "") (defaultArg (Option.ofObj o.Value) ""))
                            |> Seq.sort
                            |> Seq.distinct
                            |> String.concat "\n"
                        if String.IsNullOrWhiteSpace envVars then
                            sprintf "（環境 %s 無 aws:elasticbeanstalk:application:environment 變數）" envName
                        else
                            sprintf "環境: %s\n%s" envName envVars)
