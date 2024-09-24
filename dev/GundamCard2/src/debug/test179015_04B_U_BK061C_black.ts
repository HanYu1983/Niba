import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardRollCostLength, getCardBattlePoint } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard, mapCard } from "../game/gameState/CardTableComponent"
import { getCardIdByCoinId, getCoins } from "../game/gameState/CoinTableComponent"
import { getEffectTips, doEffect, onMoveItem, setTipSelectionForUser, getCommandEffectTips } from "../game/gameState/effect"
import { getEffect, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { getPlayCardEffects } from "../game/gameState/getPlayCardEffect"
import { getPlayEffects } from "../game/gameState/getPlayEffects"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "../game/gameState/globalEffects"
import { checkIsBattle, isBattle } from "../game/gameState/IsBattleComponent"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { triggerEvent } from "../game/gameState/triggerEvent"
import { loadPrototype } from "../script"

export async function test179015_04B_U_BK061C_black() {
    await loadPrototype("179015_04B_U_BK061C_black")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179015_04B_U_BK061C_black"
    }
    const unit: Card = {
        id: "unit",
        protoID: "unit"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), [unit]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = triggerEvent(ctx, { title: ["場に出た場合"], cardIds: [cardA.id] })
    if (ctx.immediateEffect.length != 1) {
        throw new Error()
    }
    {
        const effect = getEffect(ctx, ctx.immediateEffect[0])
        const cets = getCommandEffectTips(ctx, effect)
        if (cets.length != 2) {
            throw new Error()
        }
        const cetsCanUse = cets.filter(CommandEffecTipFn.filterNoError)
        if (cetsCanUse.length != 1) {
            throw new Error()
        }
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国")).length != 1) {
            throw new Error()
        }
        const [{ logicID, logicSubID }] = cetsCanUse
        ctx = doEffect(ctx, effect, logicID, logicSubID)
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国")).length != 0) {
            throw new Error()
        }
    }
    {
        const unit2: Card = {
            id: "unit2",
            protoID: "unit"
        }
        ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), [unit2]) as GameState
        const effect = getEffect(ctx, ctx.immediateEffect[0])
        const cets = getCommandEffectTips(ctx, effect)
        if (cets.length != 2) {
            throw new Error()
        }
        const cetsCanUse = cets.filter(CommandEffecTipFn.filterNoError)
        if (cetsCanUse.length != 2) {
            throw new Error()
        }
        const [{ logicID, logicSubID }] = cetsCanUse
        ctx = setTipSelectionForUser(ctx, effect, logicID, logicSubID)
        ctx = doEffect(ctx, effect, logicID, logicSubID)
        if (getItemState(ctx, unit2.id).damage != 2) {
            throw new Error()
        }
    }
}