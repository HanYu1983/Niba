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
        Decode.map (fun b -> if b then On else Off) Decode.bool

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

    