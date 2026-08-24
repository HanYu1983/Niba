module Logic.TurnResolution exposing (applyCardEffect, runPurge, propagateRiot, collectFlattenedRp)

{-| 回合結算：卡牌效果、暴動蔓延、平坦化 RP。對齊 Card_System 僅以卡牌執行。
-}

import Domain.Card exposing (Card)
import Domain.Defense exposing (DefenseModule)
import Domain.Map exposing (Zone(..), ZoneGovernance(..), ZoneState, applyDeltas, getZone, setZone, updateZone)
import Domain.Metrics exposing (Metrics, clampMetrics)


{-| 鄰區（2x2 網格：左上住宅、右上金融、左下工業、右下藝術）
-}
neighbors : Zone -> List Zone
neighbors z =
    case z of
        Residential ->
            [ Financial, Industrial ]

        Financial ->
            [ Residential, Artistic ]

        Industrial ->
            [ Residential, Artistic ]

        Artistic ->
            [ Financial, Industrial ]


{-| 區域專屬高階卡（Z-xxx）用於 §3 穩定度閾值倍率。
-}
isZoneCard : Card -> Bool
isZoneCard c =
    String.startsWith "Z-" c.uid


{-| 執行一張卡牌：依卡面更新目標區域與全局指標（Numerical_Design §3、§4）。
  中暴動 31~70 時該卡穩定度損耗 ×2；中穩定 40~80 且區域專屬高階卡時損耗 ×1.2。
-}
applyCardEffect : Card -> List ZoneState -> Metrics -> { zones : List ZoneState, metrics : Metrics, rpGain : Int, logLine : String }
applyCardEffect card zones metrics =
    let
        ( zoneOpt, zoneDesc ) =
            case card.targetZone of
                Just z ->
                    ( getZone z zones, zoneLabel z )

                Nothing ->
                    ( Nothing, "全域" )

        stabilityMult : Float
        stabilityMult =
            case zoneOpt of
                Nothing ->
                    1.0
                Just zone ->
                    let
                        midRiot = zone.riot >= 31 && zone.riot <= 70
                        midStab = metrics.stability >= 40 && metrics.stability <= 80
                        riotMult = if midRiot then 2.0 else 1.0
                        stabMult = if midStab && isZoneCard card then 1.2 else 1.0
                    in
                    riotMult * stabMult

        effectiveStability =
            metrics.stability + round (toFloat card.stabilityCost * stabilityMult)

        newMetrics =
            clampMetrics
                { stability = effectiveStability
                , physicalIntegrity = metrics.physicalIntegrity
                , alertness = metrics.alertness + card.alertDelta
                , thermalLoad = metrics.thermalLoad
                }

        ( newZones, _ ) =
            case card.targetZone of
                Just z ->
                    case getZone z zones of
                        Nothing ->
                            ( zones, "?" )

                        Just zone ->
                            let
                                updated =
                                    zone |> applyDeltas 0 card.riotDelta 0
                            in
                            ( setZone updated zones, zoneLabel z )

                Nothing ->
                    ( zones, "全域" )

        logLine =
            "執行 " ++ card.name ++ " @ " ++ zoneDesc ++ " | RP +" ++ String.fromInt card.rpYield ++ " 穩定 " ++ String.fromInt (round (toFloat card.stabilityCost * stabilityMult))
    in
    { zones = newZones, metrics = newMetrics, rpGain = card.rpYield, logLine = logLine }


{-| 晚間清除（Numerical_Design §10、§14.3）：心魔基礎攻擊 5，數量 1+floor(Riot/25)/區，
  實際傷害 = 5*(1+Riot/100)*警覺係數；防禦 10+8*裝備數；每晚最低傷害 2。
-}
runPurge : List ZoneState -> Metrics -> List DefenseModule -> Metrics
runPurge zones metrics equipped =
    let
        alertFactor =
            if metrics.alertness <= 20 then
                1.0
            else if metrics.alertness <= 60 then
                1.0 + toFloat (metrics.alertness - 20) / 80
            else
                1.5 + toFloat (metrics.alertness - 60) / 80

        threatFromZone : ZoneState -> Float
        threatFromZone s =
            let
                count =
                    1 + s.riot // 25
                attackPer =
                    5 * (1 + toFloat s.riot / 100) * alertFactor
            in
            toFloat count * attackPer

        rawThreat =
            List.map threatFromZone zones |> List.sum

        defense =
            10 + 8 * List.length equipped

        damageBeforeMin =
            max 0 (round rawThreat - defense)

        damage =
            max 2 damageBeforeMin

        newHP =
            max 0 (metrics.physicalIntegrity - damage)
    in
    clampMetrics { metrics | physicalIntegrity = newHP }


zoneLabel : Zone -> String
zoneLabel z =
    case z of
        Residential ->
            "Residential"

        Financial ->
            "Financial"

        Industrial ->
            "Industrial"

        Artistic ->
            "Artistic"


{-| 暴動蔓延（Numerical_Design §4、§11）：71~100 每回合相鄰 +5；>80 再擴散該區 Riot 的 10%（向下取整）。
-}
propagateRiot : List ZoneState -> List ZoneState
propagateRiot zones =
    let
        spreadFromZone : ZoneState -> List ZoneState -> List ZoneState
        spreadFromZone fromState acc =
            let
                r = fromState.riot
                base = if r >= 71 then 5 else 0
                extra = if r > 80 then r // 10 else 0
                delta = base + extra
            in
            if delta <= 0 then
                acc
            else
                List.foldl
                    (\nbr zs -> updateZone nbr (applyDeltas 0 delta 0) zs)
                    acc
                    (neighbors fromState.zone)
    in
    List.foldl spreadFromZone zones zones


{-| 平坦化金融區每回合被動 RP（Numerical_Design §11）：+8 RP。
-}
collectFlattenedRp : List ZoneState -> Int
collectFlattenedRp zones =
    case getZone Financial zones of
        Nothing ->
            0

        Just state ->
            if state.governance == Flattened then
                8

            else
                0
