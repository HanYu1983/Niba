module Ui.Toolbar exposing (view)

import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, disabled, style)
import Html.Events exposing (onClick)
import Items exposing (Item(..), cost)


view :
    Int
    -> Int
    -> Int
    -> Bool
    -> Maybe Item
    -> (Item -> msg)
    -> msg
    -> Html msg
view playerScore aiScore turn isPlayerTurn currentItem onItemClick onCancelItem =
    div [ style "margin" "12px 0", style "display" "flex", style "flex-wrap" "wrap", style "gap" "8px", style "align-items" "center" ]
        [ div [ style "margin-right" "16px" ] [ text ("玩家分數: " ++ String.fromInt playerScore) ]
        , div [ style "margin-right" "16px" ] [ text ("AI 分數: " ++ String.fromInt aiScore) ]
        , div [ style "margin-right" "16px" ] [ text ("回合: " ++ String.fromInt turn) ]
        , div [ style "margin-right" "8px" ] [ text (if isPlayerTurn then "玩家回合" else "AI 回合") ]
        , if isPlayerTurn then
            case currentItem of
                Nothing ->
                    div [ style "display" "flex", style "gap" "8px" ]
                        [ itemButton "炸彈(3)" (playerScore >= cost Bomb) (onItemClick Bomb)
                        , itemButton "雷射(4)" (playerScore >= cost Laser) (onItemClick Laser)
                        , itemButton "護盾(2)" (playerScore >= cost Shield) (onItemClick Shield)
                        ]
                Just _ ->
                    button [ onClick onCancelItem, style "padding" "4px 12px" ] [ text "取消道具" ]
          else
            text ""
        ]


itemButton : String -> Bool -> msg -> Html msg
itemButton label enabled msg =
    button
        [ onClick msg
        , disabled (not enabled)
        , style "padding" "4px 12px"
        ]
        [ text label ]
