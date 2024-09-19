import { repeat } from "ramda"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { PlayerA } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { getCardRollCostLength, getCardBattlePoint, getCardIdsCanPayRollCost } from "../game/gameState/card"
import { createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { getEffectTips, doEffect } from "../game/gameState/effect"
import { getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { getPlayCardEffects } from "../game/gameState/getPlayCardEffect"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "../game/gameState/globalEffects"
import { getItemState } from "../game/gameState/ItemStateComponent"
import { getCardLikeItemIdsByBasyou, getItemIds, getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { triggerEvent } from "../game/gameState/triggerEvent"
import { loadPrototype } from "../script"

export async function test179028_10D_U_WT181N_white() {
    await loadPrototype("179028_10D_U_WT181N_white")
    let ctx = createGameState()
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), ["179028_10D_U_WT181N_white"]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("179028_10D_U_WT181N_white", 5)) as GameState
    if (getCardIdsCanPayRollCost(ctx, PlayerA, null).length != 5) {
        throw new Error(`getCardIdsCanPayRollCost(ctx, PlayerA, null).length !=5`)
    }
    const cardIds = getItemIds(ctx)
    if (cardIds.length == 0) {
        throw new Error('must has one card')
    }
    const cardId = cardIds[0]
    const playCardEffects = getPlayCardEffects(ctx, cardId)
    if (playCardEffects.length != 2) {
        throw new Error(`playCardEffects.length != 2`)
    }
    const useEffect = playCardEffects[1]
    if (getCardLikeItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 0) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 0`)
    }
    ctx = doEffect(ctx, useEffect, 0, 0)
    if (getCardLikeItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 1) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 1`)
    }
    const effect = getTopEffect(ctx)
    if (effect == null) {
        throw new Error(`effect == null`)
    }
    if (effect.reason[0] != "場に出る") {
        throw new Error(`effect.reason[0]!="場に出る`)
    }
    if (getCardLikeItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 0) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 0`)
    }
    if (getCardRollCostLength(ctx, cardId) != 4) {
        throw new Error(`getCardRollCostLength(ctx, cardId) != 4`)
    }
    ctx = doEffect(ctx, effect, 0, 0)
    if (getCardLikeItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 1) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 1`)
    }
    const ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    if (ges.filter(ge => ge.title[0] == "＋x／＋x／＋xを得る").length != 1) {
        throw new Error(`ges.filter(ge=>ge.title[0]=="＋x／＋x／＋xを得る").length != 1`)
    }
    if (BattlePointFn.eq(getCardBattlePoint(ctx, cardId), [8, 0, 8]) == false) {
        throw new Error(`BattlePointFn.eq(bp, [8,0,8]) == false`)
    }
    if (getCardRollCostLength(ctx, cardId) != 5) {
        throw new Error(`getCardRollCostLength(ctx, cardId) != 5`)
    }
    if (getItemState(ctx, cardId).flags["bonus"] == null) {
        throw new Error(`getItemState(ctx, cardId).flags["bonus"] == null`)
    }
    ctx = triggerEvent(ctx, { title: ["GameEventOnTiming", PhaseFn.getLast()] })
    if (getItemState(ctx, cardId).flags["bonus"] != null) {
        throw new Error(`getItemState(ctx, cardId).flags["bonus"] != null`)
    }
    ctx = clearGlobalEffects(ctx)
    if (BattlePointFn.eq(getCardBattlePoint(ctx, cardId), [4, 0, 4]) == false) {
        throw new Error(`BattlePointFn.eq(bp, [4,0,4]) == false`)
    }
}