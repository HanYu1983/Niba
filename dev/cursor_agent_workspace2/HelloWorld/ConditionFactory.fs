module HelloWorld.ConditionFactory

open HelloWorld.Type
open HelloWorld.Alg

let condition1: SystemProcess = fun input -> 
    { input with items = input.items |> Option.map (List.map (fun item -> { item with desiredState = Some On })) }

let condition2: SystemProcess = fun input -> 
    { input with items = input.items |> Option.map (List.map (fun item -> { item with desiredState = Some Off })) }

let createConditionFactory: ConditionFactory = fun _conditions ->
    match _conditions with
    | [ "Condition1"; _arg1; _arg2 ] ->
        Ok condition1
    | [ "Condition2"; _arg1 ] ->
        Ok condition2
    | _ -> Error (AppError.String (sprintf "Expected exactly three condition tokens, got %d" (List.length _conditions)))