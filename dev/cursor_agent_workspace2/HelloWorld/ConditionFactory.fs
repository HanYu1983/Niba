module HelloWorld.ConditionFactory

open HelloWorld.Type

type IService =
    abstract queryTemperature: string -> Result<float, AppError>
    abstract queryHumidity: string -> Result<float, AppError>

type Service() =
    interface IService with
        member _.queryTemperature _city = Ok 20.0
        member _.queryHumidity _city = Ok 50.0

type FakeBugService() =
    interface IService with
        member _.queryTemperature _city = Error (AppError.String "FakeBugService: queryTemperature error")
        member _.queryHumidity _city = Error (AppError.String "FakeBugService: queryHumidity error")

let temperatureMinMax (min: float, max: float) : SystemProcess =
    fun input ->
        let service = Service() :> IService
        // 若要測「第一個 Error 即短路」，可改為：FakeBugService() :> IService

        let itemProcess (item: Item) : Result<Item, AppError> =
            if System.String.IsNullOrWhiteSpace item.area then
                Ok { item with desiredState = On }
            else
                service.queryTemperature item.area
                |> Result.map (fun temperature ->
                    let desiredState =
                        if temperature < min || temperature > max then Off else On

                    { item with desiredState = desiredState })

        input.items
        |> FsToolkit.ErrorHandling.List.traverseResultM itemProcess
        |> Result.map (fun newItems -> { input with items = newItems })

let condition2: SystemProcess =
    fun input ->
        Ok
            { input with
                items = input.items |> List.map (fun item -> { item with desiredState = Off }) }

let createConditionFactory: ConditionFactory = fun _conditions ->
    match _conditions with
    | [ "temperatureMinMax"; arg1; arg2 ] ->
        match System.Double.TryParse arg1, System.Double.TryParse arg2 with
        | (true, minV), (true, maxV) -> Ok (temperatureMinMax (minV, maxV))
        | _ ->
            Error (
                AppError.String "temperatureMinMax: 第二、三個參數必須為可解析的浮點數（例如 10 與 30）"
            )
    | [ "Condition2"; _arg1 ] ->
        Ok condition2
    | _ -> Error (AppError.String (sprintf "Expected exactly three condition tokens, got %d" (List.length _conditions)))