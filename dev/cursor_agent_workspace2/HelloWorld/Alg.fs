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

    let runSystemProcess (input: SystemInput) (run: SystemProcess) : SystemOutput =
        run input

    let runSystemProcessWithConditionFactory  (conditionFactory: ConditionFactory) (input: SystemInput) : Result<SystemOutput, AppError> =
        match input.conditions with
        | Some conditions ->
            match conditionFactory conditions with
            | Ok systemProcess ->
                runSystemProcess input systemProcess |> Ok
            | Error err ->
                Error err
        | None ->
            Error (AppError.String "No conditions provided")

    let itemSystemProcess (fn: Item -> Item) : SystemProcess =
        fun input -> { input with items = input.items |> Option.map (List.map fn) }

    let runSystemProcessTemplate (conditionFactory: ConditionFactory) (inputPath: string) (outputPath: string) : Result<unit, AppError> =
        readAllText inputPath 
            |> Result.bind parseSystemInput
            |> Result.bind (runSystemProcessWithConditionFactory conditionFactory)
            |> Result.bind (writeAllText outputPath << encodeSystemInput)