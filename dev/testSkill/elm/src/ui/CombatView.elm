module Ui.CombatView exposing (viewCombat)

import Html exposing (Html, div, h1, h3, h4, ul, li, text, span, button, p)
import Html.Attributes exposing (class, disabled, style, title)
import Html.Events exposing (onClick)
import Combat
import Lobby
import Messages exposing (GameMsg(..))
import Types exposing (CombatModel, CombatUnit, BattleResult(..), BattleSide(..), ActionState(..), CounterChoice(..), AttackResult, AttackOutcome(..), ArmorMatrix)
import Ui.Common exposing (displayName, rem, slotTagName)


cellSizeRem : Float
cellSizeRem =
    2.5


viewCombat : CombatModel -> Html GameMsg
viewCombat cm =
    div [ class "combat" ]
        [ viewCombatHeader cm
        , case cm.result of
            Just r -> viewCombatResult r
            Nothing -> viewCombatActive cm
        , viewCounterPrompt cm
        , viewSnipePrompt cm
        , viewAttackResultPanel cm
        , viewUnitStatusDetail cm cm.statusUnitId
        ]


viewCombatHeader : CombatModel -> Html GameMsg
viewCombatHeader cm =
    div [ class "combat-header" ]
        [ button [ onClick CombatBackToStrategy, class "btn btn-back" ] [ text "← 返回策略" ]
        , h1 [ class "combat-title" ] [ text ("戰鬥 — " ++ cm.mission.nameTw) ]
        , div [ class "combat-meta" ]
            [ span [ class "combat-round" ] [ text ("回合 " ++ String.fromInt cm.round) ]
            , span [ class ("combat-phase " ++ (if cm.currentSide == SidePlayer then "combat-phase--player" else "combat-phase--enemy")) ]
                [ text (if cm.currentSide == SidePlayer then "我方行動" else "敵方行動") ]
            ]
        ]


viewCombatResult : BattleResult -> Html GameMsg
viewCombatResult r =
    let
        ( resultClass, resultText ) =
            case r of
                Victory -> ( "victory", "勝利！" )
                Defeat -> ( "defeat", "敗北" )
    in
    div [ class "combat-result" ]
        [ p [ class ("result " ++ resultClass) ] [ text resultText ]
        , button [ onClick CombatBackToStrategy, class "btn btn-primary" ] [ text "返回策略" ]
        ]


viewCombatActive : CombatModel -> Html GameMsg
viewCombatActive cm =
    case Combat.getCurrentUnit cm of
        Nothing ->
            div [ class "combat-active" ]
                [ p [ class "combat-no-unit" ] [ text "無可行動單位。" ]
                , button [ onClick CombatBackToStrategy, class "btn" ] [ text "返回策略" ]
                ]
        Just current ->
            let
                sideOk = cm.currentSide == SidePlayer
                reachable = if sideOk then Combat.reachableCells cm current else []
                targets = if sideOk then Combat.targetsInRange cm current else []
                attackRangeCells = if sideOk then Combat.cellsInWeaponRange cm current else []
            in
            div [ class "combat-active" ]
                [ div [ class "combat-body" ]
                    [ viewCombatMap cm current reachable attackRangeCells
                    , div [ class "combat-panel" ]
                        [ viewCombatActionMenu cm current sideOk
                        , viewCombatUnitBrief current
                        , viewCombatUnitStatus current
                        , viewCombatTargets sideOk targets
                        ]
                    ]
                ]


viewCombatMap : CombatModel -> CombatUnit -> List ( Int, Int ) -> List ( Int, Int ) -> Html GameMsg
viewCombatMap cm current reachable attackRangeCells =
    div [ class "combat-map-container", style "display" "flex", style "flex-direction" "column", style "gap" "0.5rem" ]
        [ span [ class "combat-map-label", style "font-size" "0.9rem", style "color" "#aaccff", style "font-weight" "600" ] [ text "地圖" ]
        , viewCombatGrid cm current reachable attackRangeCells
        ]


viewCombatGrid : CombatModel -> CombatUnit -> List ( Int, Int ) -> List ( Int, Int ) -> Html GameMsg
viewCombatGrid cm current reachable attackRangeCells =
    let
        w = cm.gridWidth
        h = cm.gridHeight
        cellSize = rem cellSizeRem
        gridCols = "repeat(" ++ String.fromInt w ++ ", " ++ cellSize ++ ")"
        gridRows = "repeat(" ++ String.fromInt h ++ ", " ++ cellSize ++ ")"
        sideOk = cm.currentSide == SidePlayer
        cell gx gy =
            let
                isReachable = List.member ( gx, gy ) reachable
                isCurrent = current.x == gx && current.y == gy
                unitHere = unitAtCell cm gx gy
                ( isPlayer, isEnemy ) =
                    case unitHere of
                        Just ( True, _ ) -> ( True, False )
                        Just ( False, _ ) -> ( False, True )
                        Nothing -> ( False, False )
                u = Maybe.map Tuple.second unitHere
                isFinished = u |> Maybe.map (\uu -> uu.actionState == Finished) |> Maybe.withDefault False
                isInAttackRange = List.member ( gx, gy ) attackRangeCells
                classStr =
                    "cell"
                        ++ (if isReachable then " cell--reachable" else "")
                        ++ (if isCurrent then " cell--current-unit" else "")
                        ++ (if isPlayer then " cell--player" else "")
                        ++ (if isEnemy then " cell--enemy" else "")
                        ++ (if isFinished then " cell--finished" else "")
                        ++ (if isInAttackRange then " cell--attack-range" else "")
                clickable = sideOk && isReachable
                attrs =
                    [ class classStr, title ("(" ++ String.fromInt gx ++ ", " ++ String.fromInt gy ++ ")") ]
                        ++ (if clickable then [ onClick (CombatMoveTo gx gy) ] else [])
                content =
                    case u of
                        Just uu ->
                            viewCellUnit isPlayer uu
                        Nothing ->
                            if isReachable then
                                span [ class "cell-dot" ] [ text "○" ]
                            else
                                span [ class "cell-empty" ] [ text "·" ]
            in
            div attrs [ content ]
    in
    div
        [ class "combat-map-wrap"
        , style "display" "inline-block"
        , style "padding" "0.75rem"
        , style "background" "rgba(15, 52, 96, 0.4)"
        , style "border" "1px solid rgba(15, 52, 96, 0.8)"
        , style "border-radius" "10px"
        , style "box-shadow" "inset 0 0 0 1px rgba(0,0,0,0.2)"
        ]
        [ div
            [ class "combat-grid"
            , style "display" "grid"
            , style "grid-template-columns" gridCols
            , style "grid-template-rows" gridRows
            , style "gap" "2px"
            , style "width" "min-content"
            ]
            (List.range 0 (h - 1)
                |> List.concatMap (\gy -> List.range 0 (w - 1) |> List.map (\gx -> cell gx gy))
            )
        ]


viewCellUnit : Bool -> CombatUnit -> Html GameMsg
viewCellUnit isPlayer uu =
    let
        maxHp = Lobby.finalHp uu.assembly.mecha uu.assembly.parts
        pct = if maxHp > 0 then (toFloat uu.currentHp / toFloat maxHp) * 100 else 0
    in
    div [ class "cell-unit" ]
        [ span [ class "cell-unit-mark" ] [ text (if isPlayer then "P" else "E") ]
        , span [ class "cell-unit-hp" ] [ text (String.fromInt uu.currentHp) ]
        , div [ class "cell-unit-hp-bar-wrap" ]
            [ div [ class "cell-unit-hp-bar", style "width" (String.fromFloat pct ++ "%") ] [] ]
        ]


unitAtCell : CombatModel -> Int -> Int -> Maybe ( Bool, CombatUnit )
unitAtCell cm gx gy =
    let
        at u = u.x == gx && u.y == gy && u.currentHp > 0
        player = List.filter at cm.playerUnits |> List.head
        enemy = List.filter at cm.enemyUnits |> List.head
    in
    case player of
        Just u -> Just ( True, u )
        Nothing -> Maybe.map (\u -> ( False, u )) enemy


viewCombatActionMenu : CombatModel -> CombatUnit -> Bool -> Html GameMsg
viewCombatActionMenu cm current sideOk =
    let
        canMoveNow = sideOk && current.actionState == Active && Combat.canMove cm current
        canAttack = sideOk && Combat.canAttackWithCurrentWeapon cm current
        canEnd = current.actionState /= Finished
        canSwitchWeapon = sideOk && current.actionState == Active && List.length current.assembly.weapons > 1
    in
    div [ class "combat-action-menu" ]
        [ h3 [ class "combat-action-menu-title" ] [ text "指令" ]
        , div [ class "combat-action-buttons" ]
            [ span [ class "combat-action-hint" ]
                [ text (if canMoveNow then "移動：點擊地圖上藍色格子" else (if current.actionState == PostMove then "已移動" else "無法移動")) ]
            , if canSwitchWeapon then
                div [ class "combat-weapon-switch" ]
                    [ span [ class "combat-action-hint" ] [ text "切換武器（移動前可自由切換）：" ]
                    , div [ class "combat-weapon-list" ]
                        (current.assembly.weapons
                            |> List.indexedMap
                                (\i w ->
                                    let
                                        isCurrent = i == current.currentWeaponIndex
                                    in
                                    button
                                        [ class ("btn btn-action btn-weapon" ++ (if isCurrent then " btn-weapon-current" else ""))
                                        , onClick (CombatSwitchWeapon i)
                                        , disabled isCurrent
                                        , title (if isCurrent then "當前武器" else "切換至此武器")
                                        ]
                                        [ text (displayName w.name w.nameTw) ]
                                )
                        )
                    ]
              else
                span [ class "combat-action-hint" ]
                    [ text (if List.length current.assembly.weapons <= 1 then "僅有一把武器" else "需在尚未移動時才能切換武器") ]
            , if canAttack then span [ class "combat-action-hint" ] [ text "攻擊：從下方選擇目標" ]
              else if sideOk && current.actionState == PostMove && (Combat.getWeapon current |> Maybe.map (\w -> w.stance == "Direct_Fire") |> Maybe.withDefault False) && List.length (Combat.targetsInRange cm current) > 0 then
                span [ class "combat-action-hint combat-hint-warn" ] [ text "直射架勢：本回合已移動，無法攻擊" ]
              else if sideOk && current.actionState /= Finished && List.length (Combat.targetsInRange cm current) > 0 && not (Combat.canAffordCurrentWeapon current) then
                span [ class "combat-action-hint combat-hint-warn" ] [ text "EN 或彈藥不足" ]
              else text ""
            , button [ class "btn btn-action", onClick (CombatShowStatus current.id) ] [ text "狀態" ]
            , if sideOk then
                button
                    [ onClick CombatEndTurn
                    , class "btn btn-action btn-end"
                    , disabled (not canEnd)
                    ]
                    [ text "結束回合" ]
              else
                button
                    [ onClick CombatRunEnemyTurn
                    , class "btn btn-action btn-enemy"
                    ]
                    [ text (if current.currentHp <= 0 then "跳過已擊破單位" else "執行敵方行動") ]
            ]
        ]


viewCombatUnitBrief : CombatUnit -> Html GameMsg
viewCombatUnitBrief u =
    let
        maxHp = Lobby.finalHp u.assembly.mecha u.assembly.parts
        pct = if maxHp > 0 then (toFloat u.currentHp / toFloat maxHp) * 100 else 0
    in
    div [ class "combat-unit-brief" ]
        [ h3 [ class "combat-unit-brief-title" ] [ text "當前單位" ]
        , p [ class "combat-unit-name" ] [ text (displayName u.assembly.mecha.name u.assembly.mecha.nameTw) ]
        , div [ class "combat-unit-hp-row" ]
            [ span [ class "combat-unit-hp-label" ] [ text "HP" ]
            , div [ class "combat-unit-hp-bar-wrap" ]
                [ div [ class "combat-unit-hp-bar", style "width" (String.fromFloat pct ++ "%") ] [] ]
            , span [ class "combat-unit-hp-nums" ] [ text (String.fromInt u.currentHp ++ " / " ++ String.fromInt maxHp) ]
            ]
        , p [ class "combat-unit-en" ] [ text ("EN " ++ String.fromInt u.currentEn ++ " / " ++ String.fromInt u.assembly.mecha.maxEn) ]
        , p [ class "combat-unit-weapon" ]
            [ text ("武器 " ++ currentWeaponName u ++ " (" ++ currentWeaponAmmo u ++ ")") ]
        ]


currentWeaponName : CombatUnit -> String
currentWeaponName u =
    Combat.getWeapon u
        |> Maybe.map (\w -> displayName w.name w.nameTw)
        |> Maybe.withDefault "—"


currentWeaponAmmo : CombatUnit -> String
currentWeaponAmmo u =
    u.ammoRemaining
        |> List.drop u.currentWeaponIndex
        |> List.head
        |> Maybe.map (\a -> if a < 0 then "∞" else String.fromInt a)
        |> Maybe.withDefault "—"


viewCombatUnitStatus : CombatUnit -> Html GameMsg
viewCombatUnitStatus u =
    div [ class "combat-unit-status" ]
        [ h3 [ class "combat-unit-status-title" ] [ text "狀態" ]
        , p [] [ text ("駕駛: " ++ (Maybe.map (\p -> displayName p.name p.nameTw) u.assembly.pilot |> Maybe.withDefault "—")) ]
        , ul [ class "combat-unit-status-weapons" ]
            (u.assembly.weapons
                |> List.indexedMap
                    (\i w ->
                        let
                            ammo = u.ammoRemaining |> List.drop i |> List.head |> Maybe.map (\a -> if a < 0 then "∞" else String.fromInt a) |> Maybe.withDefault "—"
                        in
                        li [] [ text (displayName w.name w.nameTw ++ " " ++ ammo) ]
                    )
            )
        , p [] [ text ("配件: " ++ (if List.isEmpty u.assembly.parts then "無" else String.join ", " (List.map (\pt -> displayName pt.name pt.nameTw) u.assembly.parts))) ]
        ]


viewCombatTargets : Bool -> List CombatUnit -> Html GameMsg
viewCombatTargets sideOk targets =
    if not sideOk || List.isEmpty targets then
        text ""
    else
        div [ class "combat-targets" ]
            [ h3 [ class "combat-targets-title" ] [ text "可攻擊目標" ]
            , div [ class "combat-targets-list" ]
                (List.map (\t -> button [ onClick (CombatAttack t.id), class "btn btn-target" ] [ text (displayName t.assembly.mecha.name t.assembly.mecha.nameTw ++ " HP " ++ String.fromInt t.currentHp) ]) targets)
            ]


viewCounterPrompt : CombatModel -> Html GameMsg
viewCounterPrompt cm =
    case cm.counterPrompt of
        Nothing ->
            text ""

        Just _ ->
            div [ class "combat-modal-backdrop" ]
                [ div [ class "combat-modal" ]
                    [ h3 [ class "combat-modal-title" ] [ text "反擊選單" ]
                    , p [] [ text "防禦方可選擇：反擊 / 防禦 / 迴避" ]
                    , div [ class "combat-modal-actions" ]
                        [ button [ class "btn btn-action", onClick (CombatCounterChoice CounterAttack) ] [ text "反擊" ]
                        , button [ class "btn btn-action", onClick (CombatCounterChoice CounterDefend) ] [ text "防禦" ]
                        , button [ class "btn btn-action", onClick (CombatCounterChoice CounterEvade) ] [ text "迴避" ]
                        ]
                    ]
                ]


viewSnipePrompt : CombatModel -> Html GameMsg
viewSnipePrompt cm =
    case cm.snipePrompt of
        Nothing ->
            text ""

        Just _ ->
            div [ class "combat-modal-backdrop" ]
                [ div [ class "combat-modal" ]
                    [ h3 [ class "combat-modal-title" ] [ text "狙擊確認" ]
                    , p [] [ text "敵方移動進入狙擊射程，是否執行狙擊？（每回合每機僅一次）" ]
                    , div [ class "combat-modal-actions" ]
                        [ button [ class "btn btn-primary", onClick (CombatSnipeConfirm True) ] [ text "狙擊" ]
                        , button [ class "btn", onClick (CombatSnipeConfirm False) ] [ text "略過" ]
                        ]
                    ]
                ]


viewAttackResultPanel : CombatModel -> Html GameMsg
viewAttackResultPanel cm =
    case cm.lastAttackResult of
        Nothing ->
            text ""

        Just r ->
            let
                outcomeText =
                    case r.outcome of
                        AttackHit ->
                            "命中"
                        AttackMiss ->
                            "未命中"
                        AttackEvade ->
                            "迴避成功"

                titleText =
                    r.attackerName ++ " 對 " ++ r.defenderName ++ " 的攻擊結果"
            in
            div [ class "combat-modal-backdrop combat-attack-result-backdrop" ]
                [ div [ class "combat-modal combat-attack-result-panel" ]
                    [ h3 [ class "combat-modal-title combat-attack-result-title" ] [ text titleText ]
                    , p [ class "combat-attack-result-outcome" ] [ text outcomeText ]
                    , if r.outcome == AttackHit && r.damage > 0 then
                        p [ class "combat-attack-result-damage" ] [ text ("造成 " ++ String.fromInt r.damage ++ " 傷害") ]
                      else
                        text ""
                    , if r.isCrit then
                        span [ class "combat-attack-result-crit" ] [ text "暴擊" ]
                      else
                        text ""
                    , Maybe.map (\s -> p [ class "combat-attack-result-note" ] [ text s ]) r.defenseNote |> Maybe.withDefault (text "")
                    , Maybe.map (\s -> p [ class "combat-attack-result-note" ] [ text s ]) r.evadeNote |> Maybe.withDefault (text "")
                    , button [ class "btn btn-primary combat-attack-result-dismiss", onClick CombatDismissAttackResult ] [ text "關閉" ]
                    ]
                ]


armorSummary : ArmorMatrix -> String
armorSummary a =
    "動" ++ String.fromInt a.kin ++ " 光" ++ String.fromInt a.beam ++ " 火" ++ String.fromInt a.fire ++ " 電" ++ String.fromInt a.elec ++ " 化" ++ String.fromInt a.chem


viewUnitStatusDetail : CombatModel -> Maybe String -> Html GameMsg
viewUnitStatusDetail cm maybeId =
    case maybeId of
        Nothing ->
            text ""

        Just id ->
            case Combat.findUnitById id cm of
                Nothing ->
                    text ""

                Just u ->
                    let
                        m = u.assembly.mecha
                        maxHp = Lobby.finalHp m u.assembly.parts
                        pilotLine = u.assembly.pilot
                            |> Maybe.map (\p -> "駕駛: " ++ displayName p.name p.nameTw ++ " | 鬥志 " ++ String.fromInt p.currentWillpower)
                            |> Maybe.withDefault "駕駛: —"
                        weaponLine i w =
                            let
                                ammoStr = u.ammoRemaining |> List.drop i |> List.head |> Maybe.map (\a -> if a < 0 then "∞" else String.fromInt a) |> Maybe.withDefault "—"
                                enAmmo = if w.enCost > 0 then "EN " ++ String.fromInt w.enCost else ammoStr ++ "/" ++ (if w.maxAmmo < 0 then "∞" else String.fromInt w.maxAmmo)
                                currentMark = if i == u.currentWeaponIndex then " [當前]" else ""
                            in
                            li []
                                [ text (displayName w.name w.nameTw ++ " | " ++ w.stance ++ " | " ++ String.fromInt w.rngMin ++ "～" ++ String.fromInt w.rngMax ++ " | " ++ w.atkVector ++ " | " ++ enAmmo ++ currentMark)
                                ]
                    in
                    div [ class "combat-modal-backdrop" ]
                        [ div [ class "combat-modal combat-status-modal" ]
                            [ h3 [ class "combat-modal-title" ] [ text "單位狀態" ]
                            , p [] [ text (displayName m.name m.nameTw) ]
                            , p [] [ text ("HP " ++ String.fromInt u.currentHp ++ " / " ++ String.fromInt maxHp) ]
                            , p [] [ text ("EN " ++ String.fromInt u.currentEn ++ " / " ++ String.fromInt m.maxEn) ]
                            , p [] [ text ("MOV " ++ String.fromInt m.baseMov) ]
                            , p [ class "combat-status-armor" ] [ text ("抗性 " ++ armorSummary m.armorMatrix) ]
                            , h4 [ class "combat-status-subtitle" ] [ text "武器" ]
                            , ul [ class "combat-status-weapons" ] (List.indexedMap weaponLine u.assembly.weapons)
                            , p [] [ text pilotLine ]
                            , p [] [ text ("配件: " ++ (if List.isEmpty u.assembly.parts then "無" else String.join ", " (List.map (\pt -> displayName pt.name pt.nameTw) u.assembly.parts))) ]
                            , button [ class "btn btn-primary", onClick CombatCloseStatus ] [ text "關閉" ]
                            ]
                        ]
