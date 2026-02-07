module View.Metrics exposing (viewMetrics)

{-| 全局指標面板，對應 Current_World_State、Metrics_Impact_Analysis。
-}

import Domain.Map exposing (ZoneState)
import Domain.Metrics exposing (Metrics)
import Domain.Tech exposing (Tech)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)


viewMetrics : Int -> Int -> Metrics -> List ZoneState -> Tech -> Html msg
viewMetrics turn rp metrics zones tech =
    div [ class "view-metrics" ]
        [ div [ class "metrics-row" ] [ text ("回合 " ++ String.fromInt turn) ]
        , div [ class "metrics-row" ] [ text ("研究點數 " ++ String.fromInt rp ++ " RP") ]
        , div [ class "metrics-row" ] [ text ("穩定度 " ++ String.fromInt metrics.stability ++ " / 100") ]
        , div [ class "metrics-row" ] [ text ("物理防禦值 " ++ String.fromInt metrics.physicalIntegrity ++ " / 100") ]
        , div [ class "metrics-row" ] [ text ("警覺感 " ++ String.fromInt metrics.alertness) ]
        , div [ class "metrics-row" ] [ text ("熱負載 " ++ String.fromInt metrics.thermalLoad) ]
        , div [ class "metrics-row" ] [ text ("格式化進度 " ++ String.fromInt (formatProgress zones) ++ "%") ]
        , div [ class "metrics-row" ] [ text ("效率線 " ++ String.fromInt tech.efficiencyPercent ++ "% | 技能線 " ++ String.fromInt tech.skillPercent ++ "%") ]
        ]


totalSaturation : List ZoneState -> Int
totalSaturation zones =
    List.map .saturation zones |> List.sum


formatProgress : List ZoneState -> Int
formatProgress zones =
    let
        totalSat =
            totalSaturation zones
    in
    clamp 0 100 (100 - totalSat // 4)
