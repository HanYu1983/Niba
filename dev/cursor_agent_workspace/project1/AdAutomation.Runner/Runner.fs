namespace AdAutomation.Runner

open System
open System.Collections.Generic
open System.IO
open System.Text
open System.Text.Encodings.Web
open System.Text.Json
open System.Text.Json.Nodes
open System.Text.Json.Serialization
open AdAutomation.Core
open AdAutomation.Core.Domain

/// 通用的「讀取輸入 JSON → 呼叫 ConditionSet → 寫出結果 JSON」執行器。
/// App1/App2/... 只需提供最精簡的 ConditionSet。
module Runner =

    [<CLIMutable>]
    type InputEnvelopeDto =
        { schemaVersion: Nullable<int>
          startDate: string
          endDate: string
          platform: string
          credentialCustomId: string
          items: InputItemDto[] }

    and [<CLIMutable>] InputItemDto =
        { adId: string
          adName: string
          area: string
          metadata: Dictionary<string, string> }

    let private jsonReadOptions =
        let o = JsonSerializerOptions(PropertyNameCaseInsensitive = true)
        o.PropertyNamingPolicy <- JsonNamingPolicy.CamelCase
        o

    let private jsonWriteOptions =
        let o = JsonSerializerOptions(WriteIndented = true)
        o.PropertyNamingPolicy <- JsonNamingPolicy.CamelCase
        o.DefaultIgnoreCondition <- JsonIgnoreCondition.WhenWritingNull
        o.Encoder <- JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        o

    /// 讀寫 JSON 檔案用 UTF-8、無 BOM（與常見工具／管線相容）。
    let private utf8Json = UTF8Encoding(false)

    let private metadataToMap (d: Dictionary<string, string>) =
        if isNull d || d.Count = 0 then
            Map.empty
        else
            d |> Seq.map (fun kv -> kv.Key, kv.Value) |> Map.ofSeq

    let private desiredStateString = function
        | DesiredState.On -> "On"
        | DesiredState.Off -> "Off"

    let private loadEnvelope (path: string) : Result<InputEnvelopeDto, string> =
        try
            let text = File.ReadAllText(path, utf8Json)
            let dtoObj = JsonSerializer.Deserialize(text, typeof<InputEnvelopeDto>, jsonReadOptions)

            if isNull dtoObj then
                Error "反序列化結果為 null"
            else
                let dto = dtoObj :?> InputEnvelopeDto
                if isNull (box dto.items) then
                    Error "items 不可為 null"
                else
                    Ok dto
        with ex ->
            Error $"讀取或解析 JSON 失敗: {ex.Message}"

    type private SourceItem =
        { SourceFile: string
          StartDate: string
          EndDate: string
          Platform: string
          CredentialCustomId: string
          Input: InputItemDto }

    let private tryGetInputDirAndFiles (inputPath: string) : string * string[] =
        if Directory.Exists inputPath then
            let files =
                Directory.EnumerateFiles(inputPath, "*.json", SearchOption.TopDirectoryOnly)
                |> Seq.sortBy Path.GetFileName
                |> Seq.toArray
            inputPath, files
        else
            let dir = Path.GetDirectoryName inputPath
            let inputDir = if String.IsNullOrEmpty dir then "." else dir
            inputDir, [| inputPath |]

    let run (entryPoint: string) (inputPath: string) (outputPath: string) (conditionSet: ConditionSet) : Result<string, string> =
        try
            let runId = Guid.NewGuid()
            let inputDir, inputFiles = tryGetInputDirAndFiles inputPath

            let errors = JsonArray()
            let items = JsonArray()

            let collectedItems = ResizeArray<SourceItem>()

            for fullPath in inputFiles do
                let sourceFile = Path.GetFileName fullPath
                match loadEnvelope fullPath with
                | Error msg ->
                    let err = JsonObject()
                    err["file"] <- JsonValue.Create(sourceFile)
                    err["message"] <- JsonValue.Create(msg)
                    errors.Add(err) |> ignore
                | Ok env ->
                    for it in env.items do
                        collectedItems.Add
                            { SourceFile = sourceFile
                              StartDate = env.startDate
                              EndDate = env.endDate
                              Platform = env.platform
                              CredentialCustomId = env.credentialCustomId
                              Input = it }

            // 評估：逐列呼叫 conditionSet（尚未做平行；之後可視 API 限制再最佳化）
            for si in collectedItems do
                let i = si.Input

                let row =
                    { EncodedAdId = i.adId
                      AdName = i.adName
                      Area = i.area
                      Metadata = metadataToMap i.metadata }

                let ctx =
                    { RunId = runId
                      Platform = si.Platform
                      CredentialCustomId = si.CredentialCustomId
                      SourceFile = si.SourceFile
                      StartDate = si.StartDate
                      EndDate = si.EndDate }

                let decision = conditionSet.EvaluateRowAsync(row, ctx) |> Async.RunSynchronously

                let jo = JsonObject()
                jo["adId"] <- JsonValue.Create(i.adId)
                jo["platform"] <- JsonValue.Create(si.Platform)
                jo["adName"] <- JsonValue.Create(i.adName)
                jo["credentialCustomId"] <- JsonValue.Create(si.CredentialCustomId)
                jo["desiredState"] <- JsonValue.Create(desiredStateString decision.State)

                match decision.Reason with
                | Some r -> jo["reason"] <- JsonValue.Create(r)
                | None -> ()

                jo["sourceFile"] <- JsonValue.Create(si.SourceFile)
                jo["startDate"] <- JsonValue.Create(si.StartDate)
                jo["endDate"] <- JsonValue.Create(si.EndDate)

                let md = row.Metadata
                if md.Count > 0 then
                    let mdObj = JsonObject()
                    for kv in md do
                        mdObj[kv.Key] <- JsonValue.Create(kv.Value)
                    jo["metadata"] <- mdObj

                items.Add(jo)

            // 輸出根物件
            let root = JsonObject()
            root["schemaVersion"] <- JsonValue.Create(1)
            root["runId"] <- JsonValue.Create(runId.ToString())
            root["entryPoint"] <- JsonValue.Create(entryPoint)
            root["generatedAt"] <- JsonValue.Create(DateTimeOffset.UtcNow.ToString("o"))
            root["inputDirectory"] <- JsonValue.Create(inputDir)
            let inputFilesArr = JsonArray()
            for p in inputFiles do
                inputFilesArr.Add(JsonValue.Create(Path.GetFileName p)) |> ignore
            root["inputFiles"] <- inputFilesArr
            root["items"] <- items
            root["errors"] <- errors

            // 寫檔
            let dir = Path.GetDirectoryName outputPath
            if not (String.IsNullOrEmpty dir) then
                Directory.CreateDirectory dir |> ignore

            File.WriteAllText(outputPath, root.ToJsonString(jsonWriteOptions), utf8Json)
            Ok outputPath
        with ex ->
            Error ex.Message
