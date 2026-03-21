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

/// `run` 成功時：單一結果檔，或資料夾多檔輸入時之多個結果檔路徑。
type RunOutcome =
    | SingleFile of writtenPath: string * output: SystemOutput
    | MultiFolder of writtenPaths: string[]

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

    /// 內部：指定本次 `runId`、時間戳、來源檔名（寫入 `EvaluationContext`），評估單一 `SystemInput`。
    /// 回傳之 `Errors` 為空陣列；解析錯誤由 `run` 寫入對應結果檔。
    let private evaluateSystemInputCore
        (runId: Guid)
        (generatedAt: DateTimeOffset)
        (sourceFile: string)
        (si: SystemInput)
        (conditionSet: ConditionSet)
        : SystemOutput =
        let itemsOut =
            si.Items
            |> Array.map (fun row ->
                let ctx =
                    { RunId = runId
                      Platform = si.Platform
                      CredentialCustomId = si.CredentialCustomId
                      SourceFile = sourceFile
                      StartDate = si.StartDate
                      EndDate = si.EndDate }

                let decision =
                    conditionSet.EvaluateRowAsync(row, ctx) |> Async.RunSynchronously

                { AdId = row.EncodedAdId
                  AdName = row.AdName
                  DesiredState = decision.State
                  Metadata = row.Metadata })

        { SchemaVersion = 1
          RunId = runId
          GeneratedAt = generatedAt
          Platform = si.Platform
          CredentialCustomId = si.CredentialCustomId
          StartDate = si.StartDate
          EndDate = si.EndDate
          Items = itemsOut
          Errors = [||] }

    /// 對單一輸入封套做條件評估；每次呼叫使用**新** `RunId` 與 `GeneratedAt`，`SourceFile` 為空字串。
    let evaluateSystemInput (si: SystemInput) (conditionSet: ConditionSet) : SystemOutput =
        evaluateSystemInputCore (Guid.NewGuid()) (DateTimeOffset.UtcNow) "" si conditionSet

    /// 讀取輸入、評估條件、寫入結果檔。
    /// - 輸入為**單一路徑**（檔案，或僅含一個 `*.json` 的資料夾）：寫入 `outputPath` 單檔，成功為 `SingleFile`。
    /// - 輸入為**資料夾且有多個** `*.json`：每個輸入檔各自 `evaluateSystemInputCore`（各自 `runId`／時間），寫入 `outputPath` **資料夾**內，檔名為 `原名不含副檔名 + ".result.json"`；成功為 `MultiFolder`。
    /// - 多檔模式時 `outputPath` 不可為已存在之一般檔案。
    let run (inputPath: string) (outputPath: string) (conditionSet: ConditionSet) : Result<RunOutcome, string> =
        try
            let isInputDir = Directory.Exists inputPath
            let _inputDir, inputFiles = tryGetInputDirAndFiles inputPath
            let multiFileDirMode = isInputDir && inputFiles.Length > 1

            if multiFileDirMode then
                if File.Exists outputPath then
                    Error "輸入資料夾含多個 JSON 時，outputPath 必須為資料夾路徑，不可為已存在之檔案。"
                else
                    Directory.CreateDirectory outputPath |> ignore

                    let written = ResizeArray<string>()

                    for fullPath in inputFiles do
                        let sourceFile = Path.GetFileName fullPath

                        let outFile =
                            Path.Combine(
                                outputPath,
                                Path.GetFileNameWithoutExtension(sourceFile) + ".result.json"
                            )

                        match loadEnvelope fullPath with
                        | Error msg ->
                            let runId = Guid.NewGuid()
                            let generatedAt = DateTimeOffset.UtcNow

                            let so =
                                { SchemaVersion = 1
                                  RunId = runId
                                  GeneratedAt = generatedAt
                                  Platform = ""
                                  CredentialCustomId = ""
                                  StartDate = ""
                                  EndDate = ""
                                  Items = [||]
                                  Errors =
                                    [| { File = sourceFile
                                         Message = msg
                                         Detail = None } |] }

                            writeSystemOutputFile outFile so
                            written.Add(outFile)
                        | Ok si ->
                            let runId = Guid.NewGuid()
                            let generatedAt = DateTimeOffset.UtcNow

                            let so =
                                evaluateSystemInputCore runId generatedAt sourceFile si conditionSet

                            writeSystemOutputFile outFile so
                            written.Add(outFile)

                    Ok(MultiFolder(written.ToArray()))
            else
                let parseErrors = ResizeArray<Domain.Error>()
                let loaded = ResizeArray<string * SystemInput>()

                for fullPath in inputFiles do
                    let sourceFile = Path.GetFileName fullPath

                    match loadEnvelope fullPath with
                    | Error msg ->
                        parseErrors.Add(
                            { File = sourceFile
                              Message = msg
                              Detail = None }
                        )
                    | Ok env -> loaded.Add(sourceFile, env)

                let runId = Guid.NewGuid()
                let generatedAt = DateTimeOffset.UtcNow

                if loaded.Count = 0 then
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
                    Ok(SingleFile(outputPath, so))
                else
                    let sourceFile, si = loaded.[0]

                    let so =
                        evaluateSystemInputCore runId generatedAt sourceFile si conditionSet

                    writeSystemOutputFile outputPath so
                    Ok(SingleFile(outputPath, so))
        with ex ->
            Error ex.Message
