import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard, mapCard } from "../game/gameState/CardTableComponent"
import { getCardIdByCoinId, getCoins } from "../game/gameState/CoinTableComponent"
import { createEffectTips, doEffect, setTipSelectionForUser, createCommandEffectTips } from "../game/gameState/doEffect"
import { getEffect, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "../game/gameState/globalEffects"
import { checkIsBattle, isBattle } from "../game/gameState/IsBattleComponent"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { createGameStateWithFlowMemory, GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory"
import { queryFlow } from "../game/gameStateWithFlowMemory/queryFlow"
import { applyFlow } from "../game/gameStateWithFlowMemory/applyFlow"
import { getActiveEffectID, getActiveLogicID, getActiveLogicSubID } from "../game/gameStateWithFlowMemory/effect"

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
    ctx = doTriggerEvent(ctx, { title: ["場に出た場合"], cardIds: [cardA.id] })
    if (ctx.immediateEffect.length != 1) {
        throw new Error()
    }
    {
        const effect = getEffect(ctx, ctx.immediateEffect[0])
        const cets = createCommandEffectTips(ctx, effect)
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
        // 避開同回合上限
        ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", PhaseFn.getLast()] })
        const unit2: Card = {
            id: "unit2",
            protoID: "unit"
        }
        ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), [unit2]) as GameState
        const effect = getEffect(ctx, ctx.immediateEffect[0])
        const cets = createCommandEffectTips(ctx, effect)
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

export async function test179015_04B_U_BK061C_black_2() {
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
    let ctx = createGameStateWithFlowMemory()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), ["unit"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), ["unit"]) as GameStateWithFlowMemory
    ctx = setActivePlayerID(ctx, PlayerA) as GameStateWithFlowMemory
    ctx = doTriggerEvent(ctx, { title: ["場に出た場合"], cardIds: [cardA.id] }) as GameStateWithFlowMemory
    if (ctx.immediateEffect.length != 1) {
        throw new Error()
    }
    let flows = queryFlow(ctx, PlayerA)
    if (flows.length == 1 && flows[0].id == "FlowSetActiveEffectID") {


    } else {
        throw new Error()
    }
    if (getActiveLogicID(ctx) != null) {
        throw new Error()
    }
    const effect = getEffect(ctx, flows[0].effectID)
    const cetsNoErr = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
    if (cetsNoErr.length == 1 && cetsNoErr[0].logicID == 0 && cetsNoErr[0].logicSubID == 1) {

    } else {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, flows[0])
    if (getActiveEffectID(ctx) == null) {
        throw new Error()
    }
    if (getActiveLogicID(ctx) == cetsNoErr[0].logicID && getActiveLogicSubID(ctx) == cetsNoErr[0].logicSubID) {

    } else {
        throw new Error()
    }
    flows = queryFlow(ctx, PlayerA)
    if (flows.find(flow => flow.id == "FlowCancelActiveEffectID") == null) {
        throw new Error()
    }
}