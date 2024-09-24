import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardRollCostLength, getCardBattlePoint } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard, mapCard } from "../game/gameState/CardTableComponent"
import { getCardIdByCoinId, getCoins } from "../game/gameState/CoinTableComponent"
import { createEffectTips, doEffect, onMoveItem, setTipSelectionForUser } from "../game/gameState/effect"
import { getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { getPlayCardEffects } from "../game/gameState/getPlayCardEffect"
import { getPlayEffects } from "../game/gameState/getPlayEffects"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "../game/gameState/globalEffects"
import { checkIsBattle, isBattle } from "../game/gameState/IsBattleComponent"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemIdsByBasyou, getItemBaSyou } from "../game/gameState/ItemTableComponent"
import { moveItem } from "../game/gameState/moveItem"
import { setPhase } from "../game/gameState/PhaseComponent"
import { triggerEvent } from "../game/gameState/triggerEvent"
import { loadPrototype } from "../script"

export async function test179024_03B_U_WT042U_white() {
    await loadPrototype("179024_03B_U_WT042U_white")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179024_03B_U_WT042U_white"
    }
    const cardB: Card = {
        id: "cardB",
        protoID: "179024_03B_U_WT042U_white"
    }
    const unit: Card = {
        id: "unit",
        protoID: "unit"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), [unit]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), [cardB]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    {
        ctx = checkIsBattle(ctx) as GameState
        if (isBattle(ctx, cardA.id, null) != false) {
            throw new Error(`isBattle(ctx, cardA.id, null) != false`)
        }
        let cs = getItemState(ctx, cardA.id)
        cs = ItemStateFn.setTip(cs, "このカードが非交戦中の場合、敵軍ユニット１枚", { title: ["カード", [], [[cardB.id, getItemBaSyou(ctx, cardB.id)]]] })
        ctx = setItemState(ctx, cardA.id, cs) as GameState

        const playCardEffects = getPlayEffects(ctx, PlayerA)
        if (playCardEffects.length != 1) {
            throw new Error(`playCardEffects.length != 1`)
        }
        ctx = setTipSelectionForUser(ctx, playCardEffects[0], 0, 0)
        ctx = doEffect(ctx, playCardEffects[0], 0, 0)
        if (getCard(ctx, unit.id).isRoll != true) {
            throw new Error()
        }
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error(`effect == null`)
        }
        if (effect.reason[0] != "PlayText") {
            throw new Error(`effect.reason[0]!="PlayText`)
        }
        ctx = doEffect(ctx, effect, 0, 0)
        const coins = getCoins(ctx)
        if (coins.length == 1 && getCardIdByCoinId(ctx, coins[0].id) == cardB.id) {

        } else {
            throw new Error(`coins.length == 1 && getCardIdByCoinId(ctx, coins[0].id) == cardB.id`)
        }
        if (BattlePointFn.eq(getCardBattlePoint(ctx, cardB.id), [4, 0, 3]) == false) {
            throw new Error(`BattlePointFn.eq(getCardBattlePoint(ctx, cardB.id), [4,0,3]) == false`)
        }
    }
    // battle
    ctx = moveItem(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), [cardB.id, getItemBaSyou(ctx, cardB.id)]) as GameState
    const itemIds = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"))
    if (itemIds.length > 0 && itemIds[0] == cardB.id) {

    } else {
        throw new Error(`itemIds.length > 0 && itemIds[0] == cardA.id`)
    }
    {
        // 將同一個切入的旗標清除, 因為同樣的切入中1個技能只能使用1次
        ctx = triggerEvent(ctx, { title: ["カット終了時", []] })
         // 重置G
        ctx = mapCard(ctx, unit.id, card => {
            return {
                ...card,
                isRoll: false,
            }
        }) as GameState
        ctx = checkIsBattle(ctx) as GameState
        if (isBattle(ctx, cardA.id, null) != true) {
            throw new Error(`isBattle(ctx, cardA.id, null) != true`)
        }
        const playCardEffects = getPlayEffects(ctx, PlayerA)
        if (playCardEffects.length != 1) {
            throw new Error(`playCardEffects.length != 1`)
        }
        ctx = doEffect(ctx, playCardEffects[0], 0, 0)
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error(`effect == null`)
        }
        if (effect.reason[0] != "PlayText") {
            throw new Error(`effect.reason[0]!="PlayText`)
        }
        ctx = doEffect(ctx, effect, 0, 0)
        let ges = getGlobalEffects(ctx, null)
        if (ges.length == 1 && ges[0].cardIds.includes(cardA.id)) {

        } else {
            throw new Error(`ges.length == 1 && ges[0].cardIds.includes(cardA.id)`)
        }
        if (BattlePointFn.eq(getCardBattlePoint(ctx, cardA.id), [6, 1, 5]) == false) {
            throw new Error(`BattlePointFn.eq(getCardBattlePoint(ctx, cardA.id), [6,1,5]) == false`)
        }
        ctx = triggerEvent(ctx, { title: ["GameEventOnTiming", PhaseFn.getLast()] })
        ges = getGlobalEffects(ctx, null)
        if (ges.length != 0) {
            throw new Error(`ges.length != 0`)
        }
        if (BattlePointFn.eq(getCardBattlePoint(ctx, cardA.id), [5, 0, 4]) == false) {
            throw new Error(`BattlePointFn.eq(getCardBattlePoint(ctx, cardA.id), [5,0,4]) == false`)
        }
    }
}