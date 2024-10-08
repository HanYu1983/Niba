import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { CommandEffecTipFn, TipOrErrorsFn } from "../game/define/CommandEffectTip"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard, mapCard } from "../game/gameState/CardTableComponent"
import { getCardIdByCoinId, getCoins } from "../game/gameState/CoinTableComponent"
import { createEffectTips, doEffect, setTipSelectionForUser, createCommandEffectTips } from "../game/gameState/doEffect"
import { getEffect, getEffects, getImmediateEffects, getStackEffects, getTopEffect } from "../game/gameState/EffectStackComponent"
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
import { getActiveEffectID, getActiveLogicID, getActiveLogicSubID, setActiveEffectID } from "../game/gameStateWithFlowMemory/effect"
import { EffectFn } from "../game/define/Effect"

export async function test179901_B2B_C_BK005P_black() {
    await loadPrototype("179901_B2B_C_BK005P_black")
    await loadPrototype("unitBlack")
    const cardA: Card = {
        id: "cardA",
        protoID: "179901_B2B_C_BK005P_black"
    }
    let ctx = createGameStateWithFlowMemory()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), ["unitBlack"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), ["unitBlack", "unitBlack"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), ["unitBlack", "unitBlack"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国"), ["unitBlack"]) as GameStateWithFlowMemory
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "手札"), ["unitBlack", "unitBlack"]) as GameStateWithFlowMemory
    ctx = setActivePlayerID(ctx, PlayerA) as GameStateWithFlowMemory
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameStateWithFlowMemory
    let playEffects = createPlayEffects(ctx, PlayerA)
    let playEffect = playEffects.find(e => e.reason[0] == "PlayCard" && e.reason[2] == cardA.id && e.reason[3].isPlayG != true)
    if (playEffect != null) {
        throw new Error()
    }
    ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameStateWithFlowMemory
    playEffects = createPlayEffects(ctx, PlayerA)
    playEffect = playEffects.find(e => e.reason[0] == "PlayCard" && e.reason[2] == cardA.id && e.reason[3].isPlayG != true)
    if (playEffect == null) {
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, playEffect, 0, 0) as GameStateWithFlowMemory
    ctx = doEffect(ctx, playEffect, 0, 0) as GameStateWithFlowMemory
    let effect = getTopEffect(ctx)
    if (effect == null) {
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0) as GameStateWithFlowMemory
    if (getImmediateEffects(ctx).length == 0) {
        throw new Error()
    }
    effect = getImmediateEffects(ctx)[0]
    ctx = setActiveEffectID(ctx, PlayerA, effect.id)
    //========
    let flows = queryFlow(ctx, PlayerA)
    const playerASetTip = flows.find(flow => flow.id == "FlowSetTipSelection")
    if (playerASetTip == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, playerASetTip)
    //======
    flows = queryFlow(ctx, PlayerA)
    const playerAPassPayCost = flows.find(flow => flow.id == "FlowPassPayCost")
    if (playerAPassPayCost == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, playerAPassPayCost)
    //======
    const cets = createEffectTips(ctx, effect, 0, 0, { isCheckUserSelection: true })
    if (cets.length != 2) {
        throw new Error()
    }
    {
        const playerTips = cets.filter(TipOrErrorsFn.filterPlayerId(getEffects(ctx), PlayerA))
        if (playerTips.length == 1 && playerTips[0].conditionKey == "全ての軍は、自分の手札X枚を可能な限り選ん1") {

        } else {
            throw new Error()
        }
    }
    {
        const playerTips = cets.filter(TipOrErrorsFn.filterPlayerId(getEffects(ctx), PlayerB))
        if (playerTips.length == 1 && playerTips[0].conditionKey == "全ての軍は、自分の手札X枚を可能な限り選ん2") {

        } else {
            throw new Error()
        }
    }
    //======
    flows = queryFlow(ctx, PlayerB)
    const playerBSetTip = flows.find(flow => flow.id == "FlowSetTipSelection")
    if (playerBSetTip == null) {
        throw new Error()
    }
    console.log(playerBSetTip)
    ctx = applyFlow(ctx, PlayerB, playerBSetTip)
    //=========
    flows = queryFlow(ctx, PlayerB)
    const playerBFlowPassPayCost = flows.find(f => f.id = "FlowPassPayCost")
    if (playerBFlowPassPayCost == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerB, playerBFlowPassPayCost)
    //=========
    if (ctx.flowMemory.hasPlayerPassPayCost[PlayerA] && ctx.flowMemory.hasPlayerPassPayCost[PlayerB]) {

    } else {
        throw new Error()
    }
    //=========
    flows = queryFlow(ctx, PlayerA)
    const playerADoEffect = flows.find(f => f.id == "FlowDoEffect")
    if (playerADoEffect == null) {
        throw new Error()
    }
    ctx = applyFlow(ctx, PlayerA, playerADoEffect)
    // =========
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード")).length != 2) {
        throw new Error()
    }
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "ジャンクヤード")).length != 1) {
        throw new Error()
    }
}