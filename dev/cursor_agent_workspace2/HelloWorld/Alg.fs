namespace HelloWorld
open HelloWorld.Type
open System
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

    let runSystemProcessWithConditionFactory (conditionFactory: ConditionFactory) (input: SystemInput) : Result<SystemOutput, AppError> =
        if List.isEmpty input.conditions then
            Error (AppError.String "No conditions provided")
        else
            match conditionFactory input.conditions with
            | Ok systemProcess -> runSystemProcess input systemProcess
            | Error err -> Error err

    let itemSystemProcess (fn: Item -> Item) : SystemProcess =
        fun input -> Ok { input with items = List.map fn input.items }

    let runSystemProcessTemplate (conditionFactory: ConditionFactory) (inputPath: string) (outputPath: string) : Result<unit, AppError> =
        let processIfInDateRange (input: SystemInput) : Result<unit, AppError> =
            let now = DateTime.UtcNow.Date
            let startDate = input.startDate.Date
            let endDate = input.endDate.Date
            let isInDateRange = now >= startDate && now <= endDate

            if not isInDateRange then
                printfn "Now is not in the date range"
                Ok ()
            else
                runSystemProcessWithConditionFactory conditionFactory input
                |> Result.bind (writeAllText outputPath << encodeSystemInput)
        readAllText inputPath 
            |> Result.bind parseSystemInput
            |> Result.bind processIfInDateRange