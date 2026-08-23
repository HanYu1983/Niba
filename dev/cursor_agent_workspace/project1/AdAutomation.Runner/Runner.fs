namespace AdAutomation.Runner

open System
open System.Collections.Generic
open System.IO
open System.Text
open System.Text.Json
open System.Text.Json.Nodes
open AdAutomation.Core
open AdAutomation.Core.Domain

/// `run` 成功時：單一結果檔，或資料夾多檔輸入且輸出為**目錄**時之多個結果檔路徑。
type RunOutcome =
    | SingleFile of writtenPath: string * output: SystemOutput
    | MultiFolder of writtenPaths: string[]

/// 通用的「讀取輸入 JSON → 呼叫 ConditionSet → 組裝 `SystemOutput` 並寫檔」執行器。
/// App1/App2/... 只需提供最精簡的 ConditionSet。
module Runner =

    let private jsonReadOptions = SystemTextJsonOptions.createReadOptions ()
    let private jsonWriteOptions = SystemTextJsonOptions.createWriteOptions ()
    let private jsonWriteMetadataMapOptions = SystemTextJsonOptions.createWriteOptionsForMetadataMap ()

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

    /// 依 `input-model.md` 驗證外層與每列必填欄位。
    let validateSystemInput (sourceFile: string) (si: SystemInput) : Error[] =
        let errs = ResizeArray<Error>()

        let add msg detail =
            errs.Add(
                { File = sourceFile
                  Message = msg
                  Detail = detail }
            )

        if String.IsNullOrWhiteSpace si.StartDate then
            add "外層 startDate 不可為空白" None

        if String.IsNullOrWhiteSpace si.EndDate then
            add "外層 endDate 不可為空白" None

        if String.IsNullOrWhiteSpace si.Platform then
            add "外層 platform 不可為空白" None

        if String.IsNullOrWhiteSpace si.CredentialCustomId then
            add "外層 credentialCustomId 不可為空白" None

        if not (isNull (box si.Items)) then
            si.Items
            |> Array.iteri (fun i row ->
                let adId = if isNull row.EncodedAdId then "" else row.EncodedAdId
                let adName = if isNull row.AdName then "" else row.AdName
                let area = if isNull row.Area then "" else row.Area

                if String.IsNullOrWhiteSpace adId then
                    add $"items[{i}].adId 不可為空白" None

                if String.IsNullOrWhiteSpace adName then
                    add $"items[{i}].adName 不可為空白" None

                if String.IsNullOrWhiteSpace area then
                    add $"items[{i}].area 不可為空白" None)

        errs.ToArray()

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

    /// 輸出路徑副檔名為 `.json` 時視為**單一結果檔**（多檔輸入時觸發合併模式）。
    let private outputLooksLikeSingleJsonFile (outputPath: string) =
        String.Equals(Path.GetExtension(outputPath), ".json", StringComparison.OrdinalIgnoreCase)

    /// 將 `SystemOutput` 寫成結果 JSON 契約之檔案（根層 platform／期間；items 無 reason／sourceFile）。
    /// `metadata` 與 `MetadataObjectMapConverter` 相同規則（嵌套 JSON 字串會展開為結構）。
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
                let metaNode =
                    JsonSerializer.SerializeToNode(it.Metadata, jsonWriteMetadataMapOptions)

                jo["metadata"] <- metaNode

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
        (hooks: RunEvaluationHooks)
        (runId: Guid)
        (generatedAt: DateTimeOffset)
        (batchAt: DateTimeOffset)
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
                      EndDate = si.EndDate
                      BatchAt = batchAt
                      PlatformQueryProvider = hooks.PlatformQueryProvider
                      CredentialKeyValidator = hooks.CredentialKeyValidator }

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

    let private evaluateMergedRowsCore
        (hooks: RunEvaluationHooks)
        (runId: Guid)
        (generatedAt: DateTimeOffset)
        (batchAt: DateTimeOffset)
        (envelope: SystemInput)
        (rows: (string * AdRow)[])
        (conditionSet: ConditionSet)
        : SystemOutput =
        let itemsOut =
            rows
            |> Array.map (fun (sourceFile, row) ->
                let ctx =
                    { RunId = runId
                      Platform = envelope.Platform
                      CredentialCustomId = envelope.CredentialCustomId
                      SourceFile = sourceFile
                      StartDate = envelope.StartDate
                      EndDate = envelope.EndDate
                      BatchAt = batchAt
                      PlatformQueryProvider = hooks.PlatformQueryProvider
                      CredentialKeyValidator = hooks.CredentialKeyValidator }

                let decision =
                    conditionSet.EvaluateRowAsync(row, ctx) |> Async.RunSynchronously

                { AdId = row.EncodedAdId
                  AdName = row.AdName
                  DesiredState = decision.State
                  Metadata = row.Metadata })

        { SchemaVersion = 1
          RunId = runId
          GeneratedAt = generatedAt
          Platform = envelope.Platform
          CredentialCustomId = envelope.CredentialCustomId
          StartDate = envelope.StartDate
          EndDate = envelope.EndDate
          Items = itemsOut
          Errors = [||] }

    let private envelopeMismatchErrors (pairs: (string * SystemInput)[]) : Error[] =
        if pairs.Length <= 1 then
            [||]
        else
            let _, first = pairs.[0]
            let errs = ResizeArray<Error>()

            for i in 1 .. pairs.Length - 1 do
                let fileName, si = pairs.[i]

                if first.Platform <> si.Platform then
                    errs.Add(
                        { File = fileName
                          Message =
                            $"無法合併為單一結果檔：platform 與「{fst pairs.[0]}」不一致（{first.Platform} vs {si.Platform}）。"
                          Detail = None }
                    )

                if first.CredentialCustomId <> si.CredentialCustomId then
                    errs.Add(
                        { File = fileName
                          Message =
                            $"無法合併為單一結果檔：credentialCustomId 與「{fst pairs.[0]}」不一致。"
                          Detail = None }
                    )

                if first.StartDate <> si.StartDate then
                    errs.Add(
                        { File = fileName
                          Message =
                            $"無法合併為單一結果檔：startDate 與「{fst pairs.[0]}」不一致。"
                          Detail = None }
                    )

                if first.EndDate <> si.EndDate then
                    errs.Add(
                        { File = fileName
                          Message =
                            $"無法合併為單一結果檔：endDate 與「{fst pairs.[0]}」不一致。"
                          Detail = None }
                    )

            errs.ToArray()

    let private duplicateAdIdErrors (rows: (string * AdRow) seq) : Error[] =
        let seen = Dictionary<string, string>(StringComparer.Ordinal)
        let errs = ResizeArray<Error>()

        for (fileName, row) in rows do
            let id = row.EncodedAdId

            match seen.TryGetValue id with
            | true, firstFile ->
                errs.Add(
                    { File = fileName
                      Message = $"adId 重複：與檔案「{firstFile}」中已有相同的 adId。"
                      Detail = Some id }
                )
            | false, _ ->
                seen.[id] <- fileName
                ()

        errs.ToArray()

    /// 對單一輸入封套做條件評估；可注入 `RunEvaluationHooks`（平台查詢／憑證鍵驗證）。
    let evaluateSystemInputWithHooks (hooks: RunEvaluationHooks) (si: SystemInput) (conditionSet: ConditionSet) : SystemOutput =
        let runId = Guid.NewGuid()
        let at = DateTimeOffset.UtcNow
        evaluateSystemInputCore hooks runId at at "" si conditionSet

    /// 每次呼叫使用**新** `RunId` 與 `GeneratedAt`，`SourceFile` 為空字串；未注入服務。
    let evaluateSystemInput (si: SystemInput) (conditionSet: ConditionSet) : SystemOutput =
        evaluateSystemInputWithHooks RunEvaluationHooks.Empty si conditionSet

    /// 讀取輸入、評估條件、寫入結果檔。
    /// - 輸入為**單一路徑**（檔案，或僅含一個 `*.json` 的資料夾）：寫入 `outputPath` 單檔，成功為 `SingleFile`。
    /// - 輸入為**資料夾且有多個** `*.json` 且 `outputPath` 為 **`.json` 檔**：合併各檔 `items`（外層須一致），成功為 `SingleFile`。
    /// - 輸入為**資料夾且有多個** `*.json` 且 `outputPath` 為**目錄**：每檔寫入 `原名.result.json`；成功為 `MultiFolder`。
    /// - 多檔目錄輸出模式時 `outputPath` 不可為已存在之一般檔案。
    let runWithHooks (hooks: RunEvaluationHooks) (inputPath: string) (outputPath: string) (conditionSet: ConditionSet) : Result<RunOutcome, string> =
        try
            let isInputDir = Directory.Exists inputPath
            let _inputDir, inputFiles = tryGetInputDirAndFiles inputPath
            let multiJsonInFolder = isInputDir && inputFiles.Length > 1
            let mergeToSingleFile = multiJsonInFolder && outputLooksLikeSingleJsonFile outputPath

            if multiJsonInFolder && not mergeToSingleFile then
                if File.Exists outputPath then
                    Error "輸入資料夾含多個 JSON 且輸出為目錄模式時，outputPath 不可為已存在之檔案。"
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
                            let v = validateSystemInput sourceFile si

                            if v.Length > 0 then
                                let runId = Guid.NewGuid()
                                let generatedAt = DateTimeOffset.UtcNow

                                let so =
                                    { SchemaVersion = 1
                                      RunId = runId
                                      GeneratedAt = generatedAt
                                      Platform = si.Platform
                                      CredentialCustomId = si.CredentialCustomId
                                      StartDate = si.StartDate
                                      EndDate = si.EndDate
                                      Items = [||]
                                      Errors = v }

                                writeSystemOutputFile outFile so
                                written.Add(outFile)
                            else
                                let runId = Guid.NewGuid()
                                let generatedAt = DateTimeOffset.UtcNow
                                let batchAt = DateTimeOffset.UtcNow

                                let so =
                                    evaluateSystemInputCore hooks runId generatedAt batchAt sourceFile si conditionSet

                                writeSystemOutputFile outFile so
                                written.Add(outFile)

                    Ok(MultiFolder(written.ToArray()))
            else
                let parseErrors = ResizeArray<Error>()
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
                    | Ok si ->
                        let v = validateSystemInput sourceFile si

                        if v.Length > 0 then
                            for e in v do
                                parseErrors.Add(e)
                        else
                            loaded.Add(sourceFile, si)

                let runId = Guid.NewGuid()
                let generatedAt = DateTimeOffset.UtcNow
                let batchAt = DateTimeOffset.UtcNow

                if isInputDir && inputFiles.Length = 0 then
                    parseErrors.Add(
                        { File = Path.GetFileName inputPath
                          Message = "輸入目錄內沒有任何 .json 檔案。"
                          Detail = None }
                    )

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
                elif mergeToSingleFile then
                    let pairs = loaded.ToArray()
                    let mergeErrs = envelopeMismatchErrors pairs
                    let flatRows = ResizeArray<string * AdRow>()

                    for (sf, si) in pairs do
                        for row in si.Items do
                            flatRows.Add(sf, row)

                    let dupErrs = duplicateAdIdErrors flatRows
                    let allErrs = Array.append mergeErrs dupErrs |> Array.append (parseErrors.ToArray())

                    if mergeErrs.Length > 0 || dupErrs.Length > 0 then
                        let _, refSi = pairs.[0]

                        let so =
                            { SchemaVersion = 1
                              RunId = runId
                              GeneratedAt = generatedAt
                              Platform = refSi.Platform
                              CredentialCustomId = refSi.CredentialCustomId
                              StartDate = refSi.StartDate
                              EndDate = refSi.EndDate
                              Items = [||]
                              Errors = allErrs }

                        writeSystemOutputFile outputPath so
                        Ok(SingleFile(outputPath, so))
                    else
                        let _, envelope = pairs.[0]

                        let so =
                            evaluateMergedRowsCore hooks runId generatedAt batchAt envelope (flatRows.ToArray()) conditionSet

                        let soWithErrs = { so with Errors = Array.append so.Errors (parseErrors.ToArray()) }
                        writeSystemOutputFile outputPath soWithErrs
                        Ok(SingleFile(outputPath, soWithErrs))
                elif loaded.Count = 1 then
                    let sourceFile, si = loaded.[0]

                    let so =
                        evaluateSystemInputCore hooks runId generatedAt batchAt sourceFile si conditionSet

                    let soWithErrs = { so with Errors = Array.append so.Errors (parseErrors.ToArray()) }
                    writeSystemOutputFile outputPath soWithErrs
                    Ok(SingleFile(outputPath, soWithErrs))
                else
                    // 多個成功載入的封套但非「資料夾多檔」路徑（防禦性合併，與設計多檔單輸出一致）
                    let pairs = loaded.ToArray()
                    let mergeErrs = envelopeMismatchErrors pairs
                    let flatRows = ResizeArray<string * AdRow>()

                    for (sf, si) in pairs do
                        for row in si.Items do
                            flatRows.Add(sf, row)

                    let dupErrs = duplicateAdIdErrors flatRows
                    let allErrs = Array.append mergeErrs dupErrs |> Array.append (parseErrors.ToArray())

                    if mergeErrs.Length > 0 || dupErrs.Length > 0 then
                        let _, refSi = pairs.[0]

                        let so =
                            { SchemaVersion = 1
                              RunId = runId
                              GeneratedAt = generatedAt
                              Platform = refSi.Platform
                              CredentialCustomId = refSi.CredentialCustomId
                              StartDate = refSi.StartDate
                              EndDate = refSi.EndDate
                              Items = [||]
                              Errors = allErrs }

                        writeSystemOutputFile outputPath so
                        Ok(SingleFile(outputPath, so))
                    else
                        let _, envelope = pairs.[0]

                        let so =
                            evaluateMergedRowsCore hooks runId generatedAt batchAt envelope (flatRows.ToArray()) conditionSet

                        let soWithErrs = { so with Errors = Array.append so.Errors (parseErrors.ToArray()) }
                        writeSystemOutputFile outputPath soWithErrs
                        Ok(SingleFile(outputPath, soWithErrs))
        with ex ->
            Error ex.Message

    /// 未注入服務之 `run`（與舊版簽名相容）。
    let run (inputPath: string) (outputPath: string) (conditionSet: ConditionSet) : Result<RunOutcome, string> =
        runWithHooks RunEvaluationHooks.Empty inputPath outputPath conditionSet
