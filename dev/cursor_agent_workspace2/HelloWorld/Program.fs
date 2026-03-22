open HelloWorld
open HelloWorld.Alg
open HelloWorld.Type
open HelloWorld.ConditionFactory
[<EntryPoint>]
let main argv =
    
    let result = Alg.runSystemProcessTemplate createConditionFactory "systemInput.json" "systemOutput.json"

    match result with
    | Ok () -> 0
    | Error err ->
        match err with
        | AppError.Exn ex -> printfn "Error: %A" ex
        | AppError.String msg -> printfn "Error: %s" msg

        -1
