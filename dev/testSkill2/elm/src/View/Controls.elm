module View.Controls exposing (viewControls)

{-| 階段顯示與操作：Phase、Command 時選卡執行或研發；Scan 時可棄牌（溢出時）。對齊 Card_System 僅執行卡牌。
-}

import Domain.Card exposing (Card)
import Domain.Game exposing (Phase(..), phaseLabel)
import Domain.Tech exposing (Tech, researchCostForNextNode)
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, disabled)
import Html.Events exposing (onClick)


viewControls :
    { phase : Phase
    , hand : List Card
    , scanMustDiscard : Bool
    , tech : Tech
    , rp : Int
    , onNextPhase : msg
    , onApplyCard : Card -> msg
    , onDiscardCard : Card -> msg
    , onResearchEfficiency : msg
    , onResearchSkill : msg
    }
    -> Html msg
viewControls { phase, hand, scanMustDiscard, tech, rp, onNextPhase, onApplyCard, onDiscardCard, onResearchEfficiency, onResearchSkill } =
    div [ class "view-controls" ]
        [ div [ class "phase-display" ] [ text ("階段: " ++ phaseLabel phase) ]
        , case phase of
            Scan ->
                div [ class "scan-panel" ]
                    (if scanMustDiscard then
                        [ div [ class "must-discard" ] [ text "手牌已滿，請選擇一張卡棄置（數據洩漏將增加該區暴動值）" ]
                        , div [ class "hand-discard" ]
                            (List.map (viewDiscardButton onDiscardCard) (List.filter (\c -> not c.nonDiscardable) hand))
                        ]

                     else
                        [ button [ class "btn", onClick onNextPhase ] [ text "進入指令階段" ] ]
                    )

            Command ->
                div [ class "command-panel" ]
                    [ div [ class "command-title" ] [ text "選擇一張卡執行 或 研發科技" ]
                    , div [ class "hand-play" ]
                        (List.map (viewPlayCardButton onApplyCard) hand)
                    , div [ class "research-row" ]
                        [ let
                            costEff =
                                researchCostForNextNode tech.efficiencyPercent

                            canEff =
                                rp >= costEff && tech.efficiencyPercent < 100
                          in
                          button
                            [ class "btn btn-research"
                            , onClick onResearchEfficiency
                            , disabled (not canEff)
                            ]
                            [ text ("效率線 " ++ String.fromInt tech.efficiencyPercent ++ "% → 消耗 " ++ String.fromInt costEff ++ " RP") ]
                        , let
                            costSkill =
                                researchCostForNextNode tech.skillPercent

                            canSkill =
                                rp >= costSkill && tech.skillPercent < 100
                          in
                          button
                            [ class "btn btn-research"
                            , onClick onResearchSkill
                            , disabled (not canSkill)
                            ]
                            [ text ("技能線 " ++ String.fromInt tech.skillPercent ++ "% → 消耗 " ++ String.fromInt costSkill ++ " RP") ]
                        ]
                    ]

            Purge ->
                button [ class "btn", onClick onNextPhase ] [ text "進入冷卻結算" ]

            Cooldown ->
                button [ class "btn", onClick onNextPhase ] [ text "下一回合（掃描）" ]
        ]


viewDiscardButton : (Card -> msg) -> Card -> Html msg
viewDiscardButton toMsg c =
    button [ class "btn btn-discard", onClick (toMsg c) ]
        [ text (c.name ++ " (棄置)") ]


viewPlayCardButton : (Card -> msg) -> Card -> Html msg
viewPlayCardButton toMsg c =
    button [ class "btn btn-play-card", onClick (toMsg c) ]
        [ text (c.name ++ " | RP+" ++ String.fromInt c.rpYield ++ " 執行") ]
