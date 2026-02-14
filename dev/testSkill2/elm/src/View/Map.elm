module View.Map exposing (viewMap)

{-| 四大區域地圖：CSS grid 四格，顏色依 governance。
-}

import Domain.Map exposing (Zone(..), ZoneGovernance(..), ZoneState, zoneDisplayName)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, style)


viewMap : List ZoneState -> Html msg
viewMap zones =
    div [ class "view-map", style "display" "grid", style "grid-template-columns" "1fr 1fr", style "gap" "8px", style "flex" "1" ]
        (List.map viewZone zones)


viewZone : ZoneState -> Html msg
viewZone s =
    div
        [ class "zone"
        , class ("zone--" ++ governanceClass s.governance)
        , style "padding" "12px"
        , style "min-height" "80px"
        , style "border-radius" "4px"
        ]
        [ div [ class "zone-name" ] [ text (zoneDisplayName s.zone) ]
        , div [ class "zone-state" ] [ text ("狀態： " ++ governanceLabel s.governance ++ " | 飽和 " ++ String.fromInt s.saturation ++ "% 暴動 " ++ String.fromInt s.riot ++ (if s.alert > 0 then " 警覺 " ++ String.fromInt s.alert else "")) ]
        ]


governanceLabel : ZoneGovernance -> String
governanceLabel g =
    case g of
        Chaos ->
            "混亂中"

        Stabilized ->
            "穩定"

        Flattened ->
            "平坦化"


governanceClass : ZoneGovernance -> String
governanceClass g =
    case g of
        Chaos ->
            "chaos"

        Stabilized ->
            "stabilized"

        Flattened ->
            "flattened"
