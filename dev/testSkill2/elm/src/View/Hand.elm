module View.Hand exposing (viewHand)

{-| 手牌顯示：5 格手牌，卡名與簡要效果。
-}

import Domain.Card exposing (Card)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)


viewHand : List Card -> Html msg
viewHand hand =
    div [ class "view-hand" ]
        [ div [ class "hand-title" ] [ text ("手牌 " ++ String.fromInt (List.length hand) ++ " / 5") ]
        , div [ class "hand-cards" ]
            (List.map viewCard hand)
        ]


viewCard : Card -> Html msg
viewCard c =
    div [ class "hand-card" ]
        [ div [ class "card-name" ] [ text c.name ]
        , div [ class "card-stats" ]
            [ text ("RP+" ++ String.fromInt c.rpYield)
            , text (" 穩定" ++ String.fromInt c.stabilityCost)
            , text (" 暴動" ++ String.fromInt c.riotDelta)
            , text (" 警覺" ++ String.fromInt c.alertDelta)
            ]
        , if c.nonDiscardable then
            div [ class "card-tag" ] [ text "不可棄置" ]

          else
            div [] []
        ]
