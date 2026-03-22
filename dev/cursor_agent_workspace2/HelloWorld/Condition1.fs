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
        let text = readAllText "systemInput.json"
        match text with
        | Ok text ->
            let input = parseSystemInput text
            let runner = itemSystemProcess (fun item -> item)
            let output = doIt input runner
            printfn "Output: %A" output
        | Error exn ->
            printfn "Error: %A" exn