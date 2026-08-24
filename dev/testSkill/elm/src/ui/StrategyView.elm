module Ui.StrategyView exposing (viewStrategy)

import Html exposing (Html, div, h1, h2, h3, ul, li, text, span, button, p)
import Html.Attributes exposing (class, disabled)
import Html.Events exposing (onClick)
import Messages exposing (GameMsg(..))
import Types exposing (StrategyModel, Mission)
import Ui.Common exposing (displayName)


viewStrategy : StrategyModel -> Html GameMsg
viewStrategy sm =
    div [ class "strategy" ]
        [ h1 [] [ text "策略 — 任務選擇" ]
        , button [ onClick BackToLobby, class "btn" ] [ text "← 返回大廳" ]
        , h2 [] [ text "任務列表" ]
        , ul [ class "item-list" ]
            (List.map (viewMissionRow sm) sm.missions)
        , viewMissionDetail sm
        ]


viewMissionRow : StrategyModel -> Mission -> Html GameMsg
viewMissionRow _ m =
    li [ class "item-row" ]
        [ span [] [ text (displayName m.name m.nameTw) ]
        , span [] [ text (" | 地圖 " ++ String.fromInt m.mapSizeX ++ "×" ++ String.fromInt m.mapSizeY ++ " | 派擊上限 " ++ String.fromInt m.deploymentLimit) ]
        , button [ onClick (SelectMission m), class "btn btn-small" ] [ text "選擇" ]
        ]


viewMissionDetail : StrategyModel -> Html GameMsg
viewMissionDetail sm =
    case sm.selectedMission of
        Nothing ->
            div [] [ text "請選擇一項任務。" ]

        Just mission ->
            div [ class "mission-detail assembly-block" ]
                [ h3 [] [ text (displayName mission.name mission.nameTw) ]
                , p [] [ text mission.context ]
                , p [] [ text ("地圖: " ++ String.fromInt mission.mapSizeX ++ "×" ++ String.fromInt mission.mapSizeY ++ " | 天氣: " ++ mission.weatherTag) ]
                , p [] [ text ("勝利: " ++ mission.winCondition ++ " | 失敗: " ++ mission.loseCondition ++ " | 報酬: $" ++ String.fromInt mission.rewardMoney) ]
                , p [] [ text ("派擊上限: " ++ String.fromInt mission.deploymentLimit ++ " 機") ]
                , h3 [] [ text "選擇出擊機體" ]
                , if List.isEmpty sm.lobbySnapshot.squad then
                    p [] [ text "小隊尚無成員，請返回大廳編成並加入小隊。" ]
                  else
                    ul [ class "item-list" ]
                        (sm.lobbySnapshot.squad
                            |> List.indexedMap (\i a ->
                                li [ class "item-row" ]
                                    [ span [] [ text (if List.member i sm.selectedForDeployment then "✓ " else "") ]
                                    , span [] [ text (displayName a.mecha.name a.mecha.nameTw) ]
                                    , button
                                        [ onClick (ToggleDeployment i)
                                        , class "btn btn-small"
                                        , disabled (not (List.member i sm.selectedForDeployment) && List.length sm.selectedForDeployment >= mission.deploymentLimit)
                                        ]
                                        [ text (if List.member i sm.selectedForDeployment then "取消" else "派擊") ]
                                    ])
                        )
                , if List.length sm.selectedForDeployment > 0 && List.length sm.selectedForDeployment <= mission.deploymentLimit then
                    button [ onClick ConfirmDeploy, class "btn" ] [ text "確認出擊 → 進入戰鬥" ]
                  else
                    text ""
                ]
