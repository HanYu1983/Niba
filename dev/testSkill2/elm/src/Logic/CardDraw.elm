module Logic.CardDraw exposing (drawOne, applyDiscardRiot)

{-| 抽牌與棄牌結算。棄牌暴動增幅對應 Numerical_Design.md §2。
-}

import Domain.Card exposing (Card, CardType(..))
import Domain.Map exposing (Zone, ZoneState, applyDeltas, getZone, updateZone)


handLimit : Int
handLimit =
    5


{-| 從牌堆抽一張牌；若牌堆空則先以 pool 補牌再抽。回傳 (抽到的卡, 新牌堆)。
-}
drawOne : List Card -> List Card -> ( Maybe Card, List Card )
drawOne drawPile pool =
    case drawPile of
        [] ->
            case pool of
                [] ->
                    ( Nothing, [] )

                _ ->
                    drawOne pool pool

        c :: rest ->
            ( Just c, rest )


{-| 棄牌暴動增幅（Numerical_Design §2）：
  情境卡 低階 RP≤20 → +2；中階 21~35 → +4；高階 36+ → +6。
  系統事件卡 → +8。淨化卡 → +0。
-}
discardRiotDelta : Card -> Int
discardRiotDelta card =
    case card.cardType of
        Scenario ->
            if card.rpYield <= 20 then
                2
            else if card.rpYield <= 35 then
                4
            else
                6

        Event ->
            8

        Purify ->
            0


{-| 棄牌時的情緒洩漏：對卡牌目標區域增加暴動值；全域卡則對所有區域各加 2。
-}
applyDiscardRiot : Card -> List ZoneState -> List ZoneState
applyDiscardRiot card zones =
    let
        delta =
            discardRiotDelta card
    in
    case card.targetZone of
        Just z ->
            updateZone z (applyDeltas 0 delta 0) zones

        Nothing ->
            List.map (\s -> applyDeltas 0 2 0 s) zones
