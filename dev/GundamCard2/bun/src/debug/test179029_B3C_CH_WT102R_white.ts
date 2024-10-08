import { repeat } from "ramda"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint, getCardHasSpeicalEffect } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent"
import { createCommandEffectTips, createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect"
import { addStackEffect, getCutInDestroyEffects, getImmediateEffects, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, mapItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou, getItemIdsByBasyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { clearGlobalEffects, getGlobalEffects } from "../game/gameState/globalEffects"
import { Effect } from "../game/define/Effect"

export async function test179029_B3C_CH_WT102R_white() {
    await loadPrototype("179029_B3C_CH_WT102R_white")
    await loadPrototype("179029_B3C_CH_WT103N_white")
    const cardA: Card = {
        id: "cardA",
        protoID: "179029_B3C_CH_WT102R_white"
    }
    const cardB: Card = {
        id: "cardB",
        protoID: "179029_B3C_CH_WT103N_white"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA, cardB]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), ["179029_B3C_CH_WT103N_white"]) as GameState

    let ctx2 = doTriggerEvent(ctx, { title: ["場に出た場合"], cardIds: [cardA.id] })
    let effects = getImmediateEffects(ctx2)
    if (effects.length != 2) {
        throw new Error()
    }
    ctx2 = doTriggerEvent(ctx, { title: ["場に出た場合"], cardIds: [cardB.id] })
    effects = getImmediateEffects(ctx2)
    if (effects.length != 2) {
        throw new Error()
    }
}