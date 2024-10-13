import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint, getCardHasSpeicalEffect, getCardIdsCanPayRollCost } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent"
import { clearTipSelectionForUser, createCommandEffectTips, createEffectTips, doEffect, getCardTipStrBaSyouPairs, setTipSelectionForUser } from "../game/gameState/doEffect"
import { getImmediateEffects, getTopEffect, removeEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, getItemStateValues, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou, getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { getPrototype, loadPrototype } from "../script"
import { getGlobalEffects } from "../game/gameState/globalEffects"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { GameError, TargetMissingError, TipError } from "../game/define/GameError"
import { setSetGroupParent } from "../game/gameState/SetGroupComponent"
import { createRollCostConditions } from "../game/gameState/createPlayCardEffects"
import { repeat } from "ramda"
import { Effect } from "../game/define/Effect"
import { getPlayerGIds } from "../game/gameState/player"

export async function test179030_11E_C_WT077S_white() {
    await loadPrototype("179030_11E_C_WT077S_white")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179030_11E_C_WT077S_white"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("179030_11E_C_WT077S_white", 2)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "捨て山"), repeat("unit", 1)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), repeat("unit", 3)) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    let effects = createPlayEffects(ctx, PlayerA)
    if (effects.length != 2) {
        console.log(effects)
        throw new Error()
    }
    let effect: Effect | null = effects.find(eff=>eff.reason[0] == "PlayCard" && eff.description == "合計国力＋(１)してプレイできる") || null
    if(effect == null){
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
    ctx = doEffect(ctx, effect, 0, 0)

    effect = getTopEffect(ctx)
    if (effect == null) {
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0)
    ctx = removeEffect(ctx, effect.id) as GameState
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "捨て山")).length != 0) {
        throw new Error()
    }
    if (getPlayerGIds(ctx, PlayerA).length != 3) {
        throw new Error()
    }
    if (getPlayerGIds(ctx, PlayerA).filter(itemId => getCard(ctx, itemId).isRoll).length != 3) {
        throw new Error()
    }
    //throw new Error()
}