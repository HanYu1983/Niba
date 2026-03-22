namespace HelloWorld
open HelloWorld.Type
open System.IO


module Alg =

    let readAllText (path: string) : Result<string, AppError> =
        try
            let text = File.ReadAllText path
            Ok text
        with
            | exn -> Error (AppError.Exn exn)

    let writeAllText (path: string) (text: string) : Result<unit, AppError> =
        try
            File.WriteAllText(path, text)
            Ok ()
        with
            | exn -> Error (AppError.Exn exn)

    let runSystemProcess (input: SystemInput) (run: SystemProcess) : Result<SystemOutput, AppError> =
        run input

    let runSystemProcessWithConditionFactory  (conditionFactory: ConditionFactory) (input: SystemInput) : Result<SystemOutput, AppError> =
        match input.conditions with
        | Some conditions ->
            match conditionFactory conditions with
            | Ok systemProcess ->
                runSystemProcess input systemProcess
            | Error err ->
                Error err
        | None ->
            Error (AppError.String "No conditions provided")

    let itemSystemProcess (fn: Item -> Item) : SystemProcess =
        fun input -> Ok { input with items = input.items |> Option.map (List.map fn) }

    let runSystemProcessTemplate (conditionFactory: ConditionFactory) (inputPath: string) (outputPath: string) : Result<unit, AppError> =
        readAllText inputPath 
            |> Result.bind parseSystemInput
            |> Result.bind (fun input ->
                // 檢查區間，如果不在區間則 early return
                let now = System.DateTime.UtcNow.Date
                let startDateOpt =
                    match input.startDate with
                    | Some s -> match System.DateTime.TryParse(s) with | true, dt -> Some dt.Date | _ -> None
                    | None -> None
                let endDateOpt =
                    match input.endDate with
                    | Some s -> match System.DateTime.TryParse(s) with | true, dt -> Some dt.Date | _ -> None
                    | None -> None

                let isInDateRange =
                    match startDateOpt, endDateOpt with
                    | Some startDate, Some endDate -> now >= startDate && now <= endDate
                    | Some startDate, None -> now >= startDate
                    | None, Some endDate -> now <= endDate
                    | None, None -> true

                if not isInDateRange then
                    // 不在區間，直接 early return (可回傳 Ok ())
                    printfn "Now is not in the date range"
                    Ok ()
                else
                    // 在區間內才繼續流程
                    runSystemProcessWithConditionFactory conditionFactory input
                    |> Result.bind (writeAllText outputPath << encodeSystemInput)
            )