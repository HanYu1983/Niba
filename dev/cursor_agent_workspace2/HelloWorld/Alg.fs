namespace HelloWorld
open HelloWorld.Type
open System.Text.Json
open System.IO
open System

module Alg =
    let parseSystemInput (str: string) : SystemInput =
        let getStringOpt (prop: string) (el: JsonElement) =
            match el.TryGetProperty prop with
            | false, _ -> None
            | true, p ->
                match p.ValueKind with
                | JsonValueKind.String -> Some (p.GetString())
                | JsonValueKind.Null -> None
                | _ -> None

        let getBoolOpt (prop: string) (el: JsonElement) =
            match el.TryGetProperty prop with
            | false, _ -> None
            | true, p ->
                match p.ValueKind with
                | JsonValueKind.True -> Some true
                | JsonValueKind.False -> Some false
                | JsonValueKind.Null -> None
                | _ -> None

        let parseDesiredState (el: JsonElement) =
            match el.TryGetProperty "desiredState" with
            | false, _ -> None
            | true, p ->
                match p.ValueKind with
                | JsonValueKind.True -> Some On
                | JsonValueKind.False -> Some Off
                | JsonValueKind.Null -> None
                | _ -> None

        let parseGoogleMeta (el: JsonElement) =
            match el.TryGetProperty "googleMeta" with
            | false, _ -> None
            | true, p when p.ValueKind = JsonValueKind.Object ->
                Some
                    { resourceName = getStringOpt "resourceName" p
                      isVideo = getBoolOpt "isVideo" p }
            | _ -> None

        let parseItem (el: JsonElement) : Item =
            if el.ValueKind <> JsonValueKind.Object then
                { id = None
                  name = None
                  area = None
                  googleMeta = None
                  desiredState = None }
            else
                { id = getStringOpt "id" el
                  name = getStringOpt "name" el
                  area = getStringOpt "area" el
                  googleMeta = parseGoogleMeta el
                  desiredState = parseDesiredState el }

        let parseItems (root: JsonElement) =
            match root.TryGetProperty "items" with
            | false, _ -> None
            | true, p when p.ValueKind = JsonValueKind.Null -> None
            | true, p when p.ValueKind = JsonValueKind.Array ->
                p.EnumerateArray() |> Seq.map parseItem |> List.ofSeq |> Some
            | _ -> None

        use doc = JsonDocument.Parse(str)
        let root = doc.RootElement

        { clientId = getStringOpt "clientId" root
          startDate = getStringOpt "startDate" root
          endDate = getStringOpt "endDate" root
          items = parseItems root }

    let readAllText (path: string) : Result<string, exn> =
        try
            let text = File.ReadAllText path
            Ok text
        with
            | exn -> Error exn

    let doIt (input: SystemInput) (run: SystemProcess) : SystemOutput =
        run input

    let itemSystemProcess (fn: Item -> Item) : SystemProcess =
        fun input -> { input with items = input.items |> Option.map (List.map fn) }