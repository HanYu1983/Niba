namespace HelloWorld
open HelloWorld.Type
open HelloWorld.Alg

module Condition1 = 
    let input: SystemInput = {
        clientId = Some "123"
        startDate = None
        endDate = None
        items = Some [
            {
                id = Some "1"
                name = Some "Item 1"
                area = None
                googleMeta = None
                desiredState = Some NotSet
            }
            {
                id = Some "2"
                name = Some "Item 2"
                area = None
                googleMeta = None
                desiredState = Some NotSet
            }
        ]
    }

    let run () =
        let input = readAllText "systemInput.json" |> Result.bind parseSystemInput
        match input with
        | Ok input ->
            let runner = itemSystemProcess (fun item -> 
                { item with desiredState = Some On }
            )
            let output = doIt input runner
            printfn "Output: %A" output
        | Error err ->
            match err with
            | AppError.Exn ex -> printfn "Error: %A" ex
            | AppError.String msg -> printfn "Error: %s" msg