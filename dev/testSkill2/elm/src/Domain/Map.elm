module Domain.Map exposing (Zone(..), ZoneGovernance(..), ZoneState, allZones, zoneState, defaultZones, getZone, setZone, updateZone, applyDeltas, zoneDisplayName)

{-| 區域與地圖狀態，對應 Map_Strategy.md、Current_World_State.md
-}


type Zone
    = Residential
    | Financial
    | Industrial
    | Artistic


type ZoneGovernance
    = Chaos
    | Stabilized
    | Flattened


type alias ZoneState =
    { zone : Zone
    , saturation : Int
    , riot : Int
    , alert : Int
    , governance : ZoneGovernance
    }


zoneDisplayName : Zone -> String
zoneDisplayName z =
    case z of
        Residential ->
            "住宅區"

        Financial ->
            "金融區"

        Industrial ->
            "工業區"

        Artistic ->
            "藝術區"


allZones : List Zone
allZones =
    [ Residential, Financial, Industrial, Artistic ]


zoneState : Zone -> Int -> Int -> Int -> ZoneState
zoneState z sat r alertVal =
    { zone = z
    , saturation = clamp 0 100 sat
    , riot = clamp 0 100 r
    , alert = clamp 0 100 alertVal
    , governance = governanceFromLevels sat r
    }


governanceFromLevels : Int -> Int -> ZoneGovernance
governanceFromLevels sat _ =
    if sat <= 0 then
        Flattened

    else if sat >= 70 then
        Chaos

    else
        Stabilized


defaultZones : List ZoneState
defaultZones =
    [ zoneState Residential 80 5 0
    , zoneState Financial 90 10 0
    , zoneState Industrial 85 8 0
    , zoneState Artistic 95 15 5
    ]


getZone : Zone -> List ZoneState -> Maybe ZoneState
getZone z states =
    List.filter (\s -> s.zone == z) states |> List.head


setZone : ZoneState -> List ZoneState -> List ZoneState
setZone updated states =
    List.map
        (\s ->
            if s.zone == updated.zone then
                updated

            else
                s
        )
        states


updateZone : Zone -> (ZoneState -> ZoneState) -> List ZoneState -> List ZoneState
updateZone z f states =
    List.map
        (\s ->
            if s.zone == z then
                f s

            else
                s
        )
        states


applyDeltas : Int -> Int -> Int -> ZoneState -> ZoneState
applyDeltas dSat dRiot dAlert s =
    let
        sat =
            clamp 0 100 (s.saturation + dSat)

        riot =
            clamp 0 100 (s.riot + dRiot)

        alertVal =
            clamp 0 100 (s.alert + dAlert)
    in
    { s
        | saturation = sat
        , riot = riot
        , alert = alertVal
        , governance = governanceFromLevels sat riot
    }
