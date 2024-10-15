import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint, getCardHasSpeicalEffect, getCardIdsCanPayRollCost } from "../game/gameState/card"
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { clearTipSelectionForUser, createCommandEffectTips, createEffectTips, doEffect, getCardTipStrBaSyouPairs, setTipSelectionForUser } from "../game/gameState/doEffect"
import { getImmediateEffects, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, getItemStateValues, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { getPrototype, loadPrototype } from "../script"
import { getGlobalEffects, setGlobalEffects } from "../game/gameState/globalEffects"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { GameError, TargetMissingError, TipError } from "../game/define/GameError"
import { setSetGroupParent } from "../game/gameState/SetGroupComponent"
import { createRollCostConditions } from "../game/gameState/createPlayCardEffects"
import { repeat } from "ramda"
import { Effect } from "../game/define/Effect"
import { TipFn } from "../game/define/Tip"

export async function test179027_09D_C_WT067R_white() {
    await loadPrototype("179027_09D_C_WT067R_white")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179027_09D_C_WT067R_white"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("179027_09D_C_WT067R_white", 4)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), ["unit", "unit"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["ドローフェイズ", "フリータイミング"]) as GameState
    let effects = createPlayEffects(ctx, PlayerA)
    let effect: Effect | null = effects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[3].isPlayCommand) || null
    if (effect == null) {
        throw new Error()
    }
    const conds = createRollCostConditions(ctx, getPrototype(cardA.protoID || ""), ["白"], 0)
    if (conds[TipFn.createRollColorKey(0, "白")] == null) {
        throw new Error()
    }
    let ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    if (getCardIdsCanPayRollCost(ctx, PlayerA, {ges: ges}).length != 4) {
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
    // 出牌效果
    ctx = doEffect(ctx, effect, 0, 0)
    effect = getTopEffect(ctx)
    if (effect == null) {
        throw new Error()
    }
    // 出場效果, 指令效果
    ctx = doEffect(ctx, effect, 0, 0)
    if (getItemStateValues(ctx).filter(is => is.damage == 2).length != 2) {
        throw new Error()
    }
}