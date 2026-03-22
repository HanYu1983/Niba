namespace HelloWorld
open HelloWorld.Type
open System.IO


module Alg =

    /// 依序套用 f；任一 Error 則短路，否則 Ok（順序與輸入相同）。
    let traverseResult (f: 'a -> Result<'b, 'e>) (xs: 'a list) : Result<'b list, 'e> =
        let folder acc x =
            acc |> Result.bind (fun ys -> f x |> Result.map (fun y -> y :: ys))

        List.fold folder (Ok []) xs |> Result.map List.rev

    /// `Result<'a,'e> list` → `Result<'a list,'e>`（遇錯即停）。
    let sequenceResult (xs: Result<'a, 'e> list) : Result<'a list, 'e> =
        traverseResult id xs

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
            |> Result.bind (runSystemProcessWithConditionFactory conditionFactory)
            |> Result.bind (writeAllText outputPath << encodeSystemInput)