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

    let doIt (input: SystemInput) (run: SystemProcess) : SystemOutput =
        run input

    let itemSystemProcess (fn: Item -> Item) : SystemProcess =
        fun input -> { input with items = input.items |> Option.map (List.map fn) }