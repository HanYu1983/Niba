module Main exposing (main)

import Browser
import Domain.Card exposing (Card, getEventCardByUid, initialHand, scenarioPool)
import Domain.Game exposing (Phase(..))
import Domain.Map exposing (Zone, ZoneState, defaultZones)
import Domain.Metrics exposing (Metrics, defaultMetrics)
import Domain.Defense exposing (DefenseModule, initialEquipped)
import Domain.Tech exposing (Tech, defaultTech, eventCardForEfficiencyNode, eventCardForSkillNode, researchCostForNextNode, thermalLoadFromTech)
import Html exposing (Html, div, h1, text)
import Html.Attributes exposing (class)
import Logic.CardDraw exposing (applyDiscardRiot, drawOne)
import Logic.TurnResolution exposing (applyCardEffect, collectFlattenedRp, propagateRiot, runPurge)
import View.Controls
import View.Hand
import View.Log
import View.Map
import View.Metrics


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


handLimit : Int
handLimit =
    5


type alias Model =
    { phase : Phase
    , zones : List ZoneState
    , metrics : Metrics
    , log : List String
    , turn : Int
    , rp : Int
    , hand : List Card
    , drawPile : List Card
    , scanMustDiscard : Bool
    , tech : Tech
    , equipped : List DefenseModule
    }


type Msg
    = NextPhase
    | ApplyCard Card
    | DiscardCard Card
    | ResearchEfficiency
    | ResearchSkill


initialDrawPile : List Card
initialDrawPile =
    scenarioPool ++ scenarioPool ++ scenarioPool


init : () -> ( Model, Cmd Msg )
init _ =
    ( { phase = Scan
      , zones = defaultZones
      , metrics = defaultMetrics
      , log = [ "System online. Phase: Scan." ]
      , turn = 1
      , rp = 50
      , hand = initialHand
      , drawPile = initialDrawPile
      , scanMustDiscard = False
      , tech = defaultTech
      , equipped = initialEquipped
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NextPhase ->
            case model.phase of
                Scan ->
                    ( { model | phase = Command }, Cmd.none )

                Command ->
                    let
                        afterPurge =
                            runPurge model.zones model.metrics model.equipped
                    in
                    ( { model | phase = Purge, metrics = afterPurge }, Cmd.none )

                Purge ->
                    ( { model | phase = Cooldown }, Cmd.none )

                Cooldown ->
                    let
                        afterRiot =
                            propagateRiot model.zones

                        rpGain =
                            collectFlattenedRp afterRiot

                        ( drawn, newPile ) =
                            drawOne model.drawPile scenarioPool

                        newHand =
                            case drawn of
                                Just c ->
                                    c :: model.hand

                                Nothing ->
                                    model.hand

                        mustDiscard =
                            List.length newHand > handLimit

                        newLog =
                            ("Turn " ++ String.fromInt (model.turn + 1) ++ " start. RP +" ++ String.fromInt rpGain ++ ".") :: model.log
                    in
                    ( { model
                        | phase = Scan
                        , turn = model.turn + 1
                        , zones = afterRiot
                        , rp = model.rp + rpGain
                        , hand = newHand
                        , drawPile = newPile
                        , scanMustDiscard = mustDiscard
                        , log = newLog
                      }
                    , Cmd.none
                    )

        ApplyCard card ->
            case model.phase of
                Command ->
                    let
                        result =
                            applyCardEffect card model.zones model.metrics

                        afterPurge =
                            runPurge result.zones result.metrics model.equipped

                        newHand =
                            removeFirstCard card model.hand

                        newLog =
                            ("T" ++ String.fromInt model.turn ++ ": " ++ result.logLine ++ " | 晚間清除 HP=" ++ String.fromInt afterPurge.physicalIntegrity) :: model.log
                    in
                    ( { model
                        | zones = result.zones
                        , metrics = afterPurge
                        , rp = model.rp + result.rpGain
                        , hand = newHand
                        , phase = Purge
                        , log = newLog
                      }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        ResearchEfficiency ->
            if model.phase == Command then
                let
                    cost =
                        researchCostForNextNode model.tech.efficiencyPercent

                    canResearch =
                        model.rp >= cost && model.tech.efficiencyPercent < 100
                in
                if canResearch then
                    let
                        t =
                            model.tech

                        newEff =
                            t.efficiencyPercent + 25

                        newTech =
                            { t | efficiencyPercent = newEff }

                        newPile =
                            injectEventCard (eventCardForEfficiencyNode newEff) model.drawPile

                        newMetrics =
                            let
                                m = model.metrics
                            in
                            { m | thermalLoad = thermalLoadFromTech newTech }

                        newLog =
                            ("研發效率線 " ++ String.fromInt newEff ++ "%。消耗 RP " ++ String.fromInt cost) :: model.log
                    in
                    ( { model
                        | tech = newTech
                        , rp = model.rp - cost
                        , drawPile = newPile
                        , metrics = newMetrics
                        , log = newLog
                      }
                    , Cmd.none
                    )

                else
                    ( model, Cmd.none )

            else
                ( model, Cmd.none )

        ResearchSkill ->
            if model.phase == Command then
                let
                    cost =
                        researchCostForNextNode model.tech.skillPercent

                    canResearch =
                        model.rp >= cost && model.tech.skillPercent < 100
                in
                if canResearch then
                    let
                        t =
                            model.tech

                        newSkill =
                            t.skillPercent + 25

                        newTech =
                            { t | skillPercent = newSkill }

                        newPile =
                            injectEventCard (eventCardForSkillNode newSkill) model.drawPile

                        newMetrics =
                            let
                                m = model.metrics
                            in
                            { m | thermalLoad = thermalLoadFromTech newTech }

                        newLog =
                            ("研發技能線 " ++ String.fromInt newSkill ++ "%。消耗 RP " ++ String.fromInt cost) :: model.log
                    in
                    ( { model
                        | tech = newTech
                        , rp = model.rp - cost
                        , drawPile = newPile
                        , metrics = newMetrics
                        , log = newLog
                      }
                    , Cmd.none
                    )

                else
                    ( model, Cmd.none )

            else
                ( model, Cmd.none )

        DiscardCard card ->
            if model.phase == Scan && model.scanMustDiscard && not card.nonDiscardable then
                let
                    newHand =
                        removeFirstCard card model.hand

                    newZones =
                        applyDiscardRiot card model.zones

                    newLog =
                        ("棄置: " ++ card.name ++ "，數據洩漏。") :: model.log
                in
                ( { model
                    | hand = newHand
                    , zones = newZones
                    , scanMustDiscard = List.length newHand > handLimit
                    , log = newLog
                  }
                , Cmd.none
                )

            else
                ( model, Cmd.none )


removeFirstCard : Card -> List Card -> List Card
removeFirstCard target hand =
    case hand of
        [] ->
            []

        c :: rest ->
            if c.uid == target.uid then
                rest

            else
                c :: removeFirstCard target rest


injectEventCard : Maybe String -> List Card -> List Card
injectEventCard maybeUid drawPile =
    case maybeUid of
        Nothing ->
            drawPile

        Just uid ->
            case getEventCardByUid uid of
                Nothing ->
                    drawPile

                Just c ->
                    c :: drawPile


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


view : Model -> Html Msg
view model =
    div [ class "app" ]
        [ h1 [ class "title" ] [ text "The Silence Protocol" ]
        , div [ class "layout" ]
            [ div [ class "left-panel" ]
                [ View.Hand.viewHand model.hand
                , View.Map.viewMap model.zones
                , View.Log.viewLog model.log
                ]
            , div [ class "right-panel" ]
                [ View.Metrics.viewMetrics model.turn model.rp model.metrics model.zones model.tech
                , View.Controls.viewControls
                    { phase = model.phase
                    , hand = model.hand
                    , scanMustDiscard = model.scanMustDiscard
                    , tech = model.tech
                    , rp = model.rp
                    , onNextPhase = NextPhase
                    , onApplyCard = ApplyCard
                    , onDiscardCard = DiscardCard
                    , onResearchEfficiency = ResearchEfficiency
                    , onResearchSkill = ResearchSkill
                    }
                ]
            ]
        ]
