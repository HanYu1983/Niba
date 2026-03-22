namespace HelloWorld
open Thoth.Json.Net

module Type = 
    type GoogleMeta = {
        resourceName: string option
        isVideo: bool option
    }

    type DesiredState =
        | On
        | Off
        | NotSet

    type Item = {
        id: string option
        name: string option
        area: string option
        googleMeta: GoogleMeta option
        desiredState: DesiredState option
    }


    type SystemInput = {
        clientId: string option
        startDate: string option
        endDate: string option
        items: (Item list) option
    }

    
    type SystemOutput = SystemInput

    // function type
    type SystemProcess = SystemInput -> SystemOutput


    type AppError =
        | Exn of exn
        | String of string


    let private desiredStateDecoder : Decoder<DesiredState> =
        Decode.map (fun s ->
            match s with
            | "On" -> On
            | "Off" -> Off
            | "NotSet" -> NotSet
            | _ -> NotSet
        ) Decode.string

    let private googleMetaDecoder : Decoder<GoogleMeta> =
        Decode.object (fun get ->
            { resourceName = get.Optional.Field "resourceName" Decode.string
              isVideo = get.Optional.Field "isVideo" Decode.bool })

    let private itemDecoder : Decoder<Item> =
        Decode.object (fun get ->
            { id = get.Optional.Field "id" Decode.string
              name = get.Optional.Field "name" Decode.string
              area = get.Optional.Field "area" Decode.string
              googleMeta = get.Optional.Field "googleMeta" googleMetaDecoder
              desiredState = get.Optional.Field "desiredState" desiredStateDecoder })

    let private systemInputDecoder : Decoder<SystemInput> =
        Decode.object (fun get ->
            { clientId = get.Optional.Field "clientId" Decode.string
              startDate = get.Optional.Field "startDate" Decode.string
              endDate = get.Optional.Field "endDate" Decode.string
              items = get.Optional.Field "items" (Decode.list itemDecoder) })

    let parseSystemInput (str: string) : Result<SystemInput, AppError> =
        Decode.fromString systemInputDecoder str |> Result.mapError AppError.String

    let private desiredStateEncoder (d: DesiredState) : JsonValue =
        match d with
        | On -> Encode.string "On"
        | Off -> Encode.string "Off"
        | NotSet -> Encode.string "NotSet"

    let private googleMetaEncoder (g: GoogleMeta) : JsonValue =
        Encode.object
            [ "resourceName", Encode.option Encode.string g.resourceName
              "isVideo", Encode.option Encode.bool g.isVideo ]

    let private itemEncoder (item: Item) : JsonValue =
        Encode.object
            [ "id", Encode.option Encode.string item.id
              "name", Encode.option Encode.string item.name
              "area", Encode.option Encode.string item.area
              "googleMeta", Encode.option googleMetaEncoder item.googleMeta
              "desiredState", Encode.option desiredStateEncoder item.desiredState ]

    let private systemInputValue (input: SystemInput) : JsonValue =
        Encode.object
            [ "clientId", Encode.option Encode.string input.clientId
              "startDate", Encode.option Encode.string input.startDate
              "endDate", Encode.option Encode.string input.endDate
              "items",
                Encode.option (fun items -> items |> List.map itemEncoder |> Encode.list) input.items ]

    /// 與 parseSystemInput 對稱：手動 Encode 管線，desiredState 以 bool（或 NotSet → null）輸出。
    let encodeSystemInput (input: SystemInput) : string =
        Encode.toString 4 (systemInputValue input)

    