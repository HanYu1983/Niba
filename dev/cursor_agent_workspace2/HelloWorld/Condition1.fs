namespace HelloWorld
open HelloWorld.Type
open HelloWorld.Alg

module Condition1 = 
    let condition = itemSystemProcess (fun item -> 
        { item with desiredState = Some On }
    )

    let run () =
        let input = readAllText "systemInput.json" |> Result.bind parseSystemInput
        match input with
        | Ok input ->
            let output = doIt input condition

            match writeAllText "systemOutput.json" (encodeSystemInput output) with
            | Ok () -> ()
            | Error werr ->
                match werr with
                | AppError.Exn ex -> printfn "Write error: %A" ex
                | AppError.String msg -> printfn "Write error: %s" msg
        | Error err ->
            match err with
            | AppError.Exn ex -> printfn "Error: %A" ex
            | AppError.String msg -> printfn "Error: %s" msg