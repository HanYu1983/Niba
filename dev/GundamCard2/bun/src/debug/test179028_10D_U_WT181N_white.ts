import { repeat } from "ramda"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { PlayerA } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { getCardTotalCostLength, getCardBattlePoint, getCardIdsCanPayRollCost } from "../game/gameState/card"
import { createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect"
import { getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "../game/gameState/globalEffects"
import { getItemState } from "../game/gameState/ItemStateComponent"
import { getItemIdsByBasyou, getItemIds } from "../game/gameState/ItemTableComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"

export async function test179028_10D_U_WT181N_white() {
    await loadPrototype("179028_10D_U_WT181N_white")
    let ctx = createGameState()
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), ["179028_10D_U_WT181N_white"]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("179028_10D_U_WT181N_white", 5)) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    let ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    if (getCardIdsCanPayRollCost(ctx, PlayerA, { ges: ges }).length != 5) {
        throw new Error(`getCardIdsCanPayRollCost(ctx, PlayerA, null).length !=5`)
    }
    const cardIds = getItemIds(ctx)
    if (cardIds.length == 0) {
        throw new Error('must has one card')
    }
    const cardId = cardIds[0]
    const playCardEffects = createPlayCardEffects(ctx, cardId)
    if (playCardEffects.length != 3) {
        throw new Error(`playCardEffects.length != 3`)
    }
    const useEffect = playCardEffects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[3].isPlayUnit && eff.description == "合計国力_＋１してプレイできる")
    if (useEffect == null) {
        throw new Error()
    }
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 0) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 0`)
    }
    ctx = setTipSelectionForUser(ctx, useEffect, 0, 0)
    ctx = doEffect(ctx, useEffect, 0, 0)
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 1) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "プレイされているカード")).length != 1`)
    }
    const effect = getTopEffect(ctx)
    if (effect == null) {
        throw new Error(`effect == null`)
    }
    if (effect.reason[0] != "場に出る") {
        throw new Error(`effect.reason[0]!="場に出る`)
    }
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 0) {
        throw new Error(`getCardLiketemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 0`)
    }
    if (getCardTotalCostLength(ctx, cardId, { ges: ges }) != 4) {
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0)
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 1) {
        throw new Error()
    }
    ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    if (ges.filter(ge => ge.title[0] == "＋x／＋x／＋xを得る" && ge.title[1][0] == 4).length != 1) {
        throw new Error()
    }
    if (getCardTotalCostLength(ctx, cardId, { ges: ges }) != 5) {
        throw new Error()
    }
    if (BattlePointFn.eq(getCardBattlePoint(ctx, cardId, { ges: ges }), [8, 0, 8]) == false) {
        console.log(getCardBattlePoint(ctx, cardId, { ges: ges }))
        throw new Error()
    }
    if (getItemState(ctx, cardId).flags["bonus"] == null) {
        throw new Error()
    }
    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", PhaseFn.getLast()] })
    if (getItemState(ctx, cardId).flags["bonus"] != null) {
        throw new Error()
    }
    ctx = clearGlobalEffects(ctx)
    ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    if (BattlePointFn.eq(getCardBattlePoint(ctx, cardId, { ges: ges }), [4, 0, 4]) == false) {
        throw new Error()
    }
}