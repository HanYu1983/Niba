namespace AdAutomation.Runner

open System
open System.IO
open System.Text
open System.Text.Encodings.Web
open System.Text.Json
open System.Text.Json.Nodes
open System.Text.Json.Serialization
open AdAutomation.Core
open AdAutomation.Core.Domain

/// 通用的「讀取輸入 JSON → 呼叫 ConditionSet → 組裝 `SystemOutput` 並寫檔」執行器。
/// App1/App2/... 只需提供最精簡的 ConditionSet。
module Runner =

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

    let private desiredStateString = function
        | DesiredState.On -> "On"
        | DesiredState.Off -> "Off"

    let private loadEnvelope (path: string) : Result<SystemInput, string> =
        try
            let text = File.ReadAllText(path, utf8Json)

            let env =
                JsonSerializer.Deserialize<SystemInput>(text, jsonReadOptions)

            if isNull (box env) then
                Error "反序列化結果為 null"
            elif isNull (box env.Items) then
                Error "items 不可為 null"
            else
                Ok env
        with ex ->
            Error $"讀取或解析 JSON 失敗: {ex.Message}"

    type private SourceItem =
        { SourceFile: string
          StartDate: string
          EndDate: string
          Platform: string
          CredentialCustomId: string
          Row: AdRow }

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

    let private sameEnvelopeOuter (a: SourceItem) (b: SourceItem) =
        a.Platform = b.Platform
        && a.CredentialCustomId = b.CredentialCustomId
        && a.StartDate = b.StartDate
        && a.EndDate = b.EndDate

    /// 將 `SystemOutput` 寫成結果 JSON 契約之檔案（根層 platform／期間；items 無 reason／sourceFile）。
    let private writeSystemOutputFile (outputPath: string) (so: SystemOutput) =
        let root = JsonObject()
        root["schemaVersion"] <- JsonValue.Create(so.SchemaVersion)
        root["runId"] <- JsonValue.Create(so.RunId.ToString())
        root["generatedAt"] <- JsonValue.Create(so.GeneratedAt.ToString("o"))
        root["platform"] <- JsonValue.Create(so.Platform)
        root["credentialCustomId"] <- JsonValue.Create(so.CredentialCustomId)
        root["startDate"] <- JsonValue.Create(so.StartDate)
        root["endDate"] <- JsonValue.Create(so.EndDate)

        let itemsA = JsonArray()

        for it in so.Items do
            let jo = JsonObject()
            jo["adId"] <- JsonValue.Create(it.AdId)
            jo["adName"] <- JsonValue.Create(it.AdName)
            jo["desiredState"] <- JsonValue.Create(desiredStateString it.DesiredState)

            if it.Metadata.Count > 0 then
                let mdObj = JsonObject()

                for kv in it.Metadata do
                    mdObj[kv.Key] <- JsonValue.Create(kv.Value)

                jo["metadata"] <- mdObj

            itemsA.Add(jo) |> ignore

        root["items"] <- itemsA

        let errorsA = JsonArray()

        for e in so.Errors do
            let eo = JsonObject()
            eo["file"] <- JsonValue.Create(e.File)
            eo["message"] <- JsonValue.Create(e.Message)

            match e.Detail with
            | Some d -> eo["detail"] <- JsonValue.Create(d)
            | None -> ()

            errorsA.Add(eo) |> ignore

        root["errors"] <- errorsA

        let dir = Path.GetDirectoryName outputPath

        if not (String.IsNullOrEmpty dir) then
            Directory.CreateDirectory dir |> ignore

        File.WriteAllText(outputPath, root.ToJsonString(jsonWriteOptions), utf8Json)

    /// 讀取輸入、評估條件、寫入 `outputPath`，成功時回傳已寫入之 **`SystemOutput`**。
    /// 多檔合併時，各來源之外層 `platform`／`credentialCustomId`／`startDate`／`endDate` 必須一致，否則回傳 `Error`。
    let run (inputPath: string) (outputPath: string) (conditionSet: ConditionSet) : Result<SystemOutput, string> =
        try
            let runId = Guid.NewGuid()
            let _inputDir, inputFiles = tryGetInputDirAndFiles inputPath

            let parseErrors = ResizeArray<Domain.Error>()
            let collectedItems = ResizeArray<SourceItem>()

            for fullPath in inputFiles do
                let sourceFile = Path.GetFileName fullPath

                match loadEnvelope fullPath with
                | Error msg ->
                    parseErrors.Add(
                        { File = sourceFile
                          Message = msg
                          Detail = None }
                    )
                | Ok env ->
                    for row in env.Items do
                        collectedItems.Add
                            { SourceFile = sourceFile
                              StartDate = env.StartDate
                              EndDate = env.EndDate
                              Platform = env.Platform
                              CredentialCustomId = env.CredentialCustomId
                              Row = row }

            let generatedAt = DateTimeOffset.UtcNow

            if collectedItems.Count = 0 then
                let so =
                    { SchemaVersion = 1
                      RunId = runId
                      GeneratedAt = generatedAt
                      Platform = ""
                      CredentialCustomId = ""
                      StartDate = ""
                      EndDate = ""
                      Items = [||]
                      Errors = parseErrors.ToArray() }

                writeSystemOutputFile outputPath so
                Ok so
            else
                let f0 = collectedItems.[0]

                let inconsistent =
                    seq { 1 .. collectedItems.Count - 1 }
                    |> Seq.exists (fun i -> not (sameEnvelopeOuter f0 collectedItems.[i]))

                if inconsistent then
                    Error
                        "多檔輸入之外層 platform、credentialCustomId、startDate、endDate 不一致；請分次執行或對齊輸入封套（見設計 result-json）。"
                else
                    let itemsOut = ResizeArray<AdRowOutput>()

                    for si in collectedItems do
                        let row = si.Row

                        let ctx =
                            { RunId = runId
                              Platform = si.Platform
                              CredentialCustomId = si.CredentialCustomId
                              SourceFile = si.SourceFile
                              StartDate = si.StartDate
                              EndDate = si.EndDate }

                        let decision =
                            conditionSet.EvaluateRowAsync(row, ctx) |> Async.RunSynchronously

                        itemsOut.Add
                            { AdId = row.EncodedAdId
                              AdName = row.AdName
                              DesiredState = decision.State
                              Metadata = row.Metadata }

                    let so =
                        { SchemaVersion = 1
                          RunId = runId
                          GeneratedAt = generatedAt
                          Platform = f0.Platform
                          CredentialCustomId = f0.CredentialCustomId
                          StartDate = f0.StartDate
                          EndDate = f0.EndDate
                          Items = itemsOut.ToArray()
                          Errors = parseErrors.ToArray() }

                    writeSystemOutputFile outputPath so
                    Ok so
        with ex ->
            Error ex.Message
