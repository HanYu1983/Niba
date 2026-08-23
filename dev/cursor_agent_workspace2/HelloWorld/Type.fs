namespace HelloWorld
open System
open Thoth.Json.Net

module Type = 
    type AppError =
        | Exn of exn
        | String of string

    type GoogleMeta = {
        resourceName: string
        isVideo: bool
    }

    type DesiredState =
        | On
        | Off
        | NotSet

    type Item = {
        id: string
        name: string
        area: string
        googleMeta: GoogleMeta option
        desiredState: DesiredState
    }

    type SystemInput = {
        clientId: string
        startDate: DateTime
        endDate: DateTime
        conditions: string list
        items: Item list
    }

    
    type SystemOutput = SystemInput

    // function type
    type SystemProcess = SystemInput -> Result<SystemOutput, AppError>

    type ConditionFactory = string list -> Result<SystemProcess, AppError>

    let private desiredStateDecoder : Decoder<DesiredState> =
        Decode.string
        |> Decode.map (function
            | "On" -> On
            | "Off" -> Off
            | "NotSet" -> NotSet
            | _ -> NotSet)

    let private googleMetaDecoder : Decoder<GoogleMeta> =
        Decode.object (fun get ->
            {
                resourceName = get.Required.Field "resourceName" Decode.string
                isVideo = get.Required.Field "isVideo" Decode.bool
            })

    let private itemDecoder : Decoder<Item> =
        Decode.object (fun get ->
            {
                id = get.Required.Field "id" Decode.string
                name = get.Required.Field "name" Decode.string
                area = get.Required.Field "area" Decode.string
                googleMeta = get.Optional.Field "googleMeta" googleMetaDecoder
                desiredState = get.Required.Field "desiredState" desiredStateDecoder
            })

    let private systemInputDecoder : Decoder<SystemInput> =
        Decode.object (fun get ->
            {
                clientId = get.Required.Field "clientId" Decode.string
                startDate = get.Required.Field "startDate" Decode.datetimeUtc
                endDate = get.Required.Field "endDate" Decode.datetimeUtc
                conditions = get.Required.Field "conditions" (Decode.list Decode.string)
                items = get.Required.Field "items" (Decode.list itemDecoder)
            })

    let parseSystemInput (str: string) : Result<SystemInput, AppError> =
        Decode.fromString systemInputDecoder str |> Result.mapError AppError.String

    let private desiredStateEncoder (d: DesiredState) : JsonValue =
        match d with
        | On -> Encode.string "On"
        | Off -> Encode.string "Off"
        | NotSet -> Encode.string "NotSet"

    let private googleMetaEncoder (g: GoogleMeta) : JsonValue =
        Encode.object
            [ "resourceName", Encode.string g.resourceName
              "isVideo", Encode.bool g.isVideo ]

    let private itemEncoder (item: Item) : JsonValue =
        Encode.object
            [ "id", Encode.string item.id
              "name", Encode.string item.name
              "area", Encode.string item.area
              "googleMeta", Encode.option googleMetaEncoder item.googleMeta
              "desiredState", desiredStateEncoder item.desiredState ]

    let private systemInputValue (input: SystemInput) : JsonValue =
        Encode.object
            [ "clientId", Encode.string input.clientId
              "startDate", Encode.datetime input.startDate
              "endDate", Encode.datetime input.endDate
              "conditions", input.conditions |> List.map Encode.string |> Encode.list
              "items", input.items |> List.map itemEncoder |> Encode.list ]

    /// 與 parseSystemInput 對稱的手動 Encode。
    let encodeSystemInput (input: SystemInput) : string =
        Encode.toString 4 (systemInputValue input)

    