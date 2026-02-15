module Ui.Result exposing (view)

import Game exposing (GameResult(..))
import Html exposing (Html, button, div, h2, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)


view :
    GameResult
    -> String
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> Int
    -> msg
    -> msg
    -> Html msg
view result reason playerScore aiScore playerCastleHp aiCastleHp turn playerCaptures aiCaptures playerBomb playerLaser playerShield aiBomb aiLaser aiShield onRestart onMainMenu =
    let
        title =
            case result of
                PlayerWins -> "玩家勝利"
                AIWins -> "AI 勝利"
                Draw -> "平局"
                Ongoing -> ""
    in
    div [ style "padding" "24px", style "text-align" "center", style "max-width" "400px", style "margin" "0 auto" ]
        [ h2 [] [ text title ]
        , div [ style "margin" "8px 0" ] [ text ("終局原因: " ++ reason) ]
        , div [ style "margin" "8px 0" ] [ text ("玩家分數: " ++ String.fromInt playerScore ++ " / AI 分數: " ++ String.fromInt aiScore) ]
        , div [ style "margin" "8px 0" ] [ text ("玩家主堡 HP: " ++ String.fromInt playerCastleHp ++ " / AI 主堡 HP: " ++ String.fromInt aiCastleHp) ]
        , div [ style "margin" "8px 0" ] [ text ("總回合數: " ++ String.fromInt turn) ]
        , div [ style "margin" "8px 0" ] [ text ("玩家吃子: " ++ String.fromInt playerCaptures ++ " / AI 吃子: " ++ String.fromInt aiCaptures) ]
        , div [ style "margin" "8px 0" ] [ text ("玩家道具 炸/雷/盾: " ++ String.fromInt playerBomb ++ " / " ++ String.fromInt playerLaser ++ " / " ++ String.fromInt playerShield) ]
        , div [ style "margin" "8px 0" ] [ text ("AI 道具 炸/雷/盾: " ++ String.fromInt aiBomb ++ " / " ++ String.fromInt aiLaser ++ " / " ++ String.fromInt aiShield) ]
        , div [ style "margin-top" "16px", style "display" "flex", style "gap" "8px", style "justify-content" "center" ]
            [ button [ onClick onRestart, style "padding" "8px 16px" ] [ text "重新開始" ]
            , button [ onClick onMainMenu, style "padding" "8px 16px" ] [ text "回主選單" ]
            ]
        ]
