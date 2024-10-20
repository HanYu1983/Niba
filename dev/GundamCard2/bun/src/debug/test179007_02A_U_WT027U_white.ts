import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint, getCardHasSpeicalEffect } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent"
import { clearTipSelectionForUser, createCommandEffectTips, createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect"
import { getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { getPrototype, loadPrototype } from "../script"
import { getGlobalEffects } from "../game/gameState/globalEffects"
import { CommandEffecTipFn, TipOrErrorsFn } from "../game/define/CommandEffectTip"
import { Effect } from "../game/define/Effect"

export async function test179007_02A_U_WT027U_white() {
    await loadPrototype("179007_02A_U_WT027U_white")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179007_02A_U_WT027U_white",
        isRoll: true
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), ["179007_02A_U_WT027U_white"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
    {
        const effects = createPlayEffects(ctx, PlayerA, { ges: getGlobalEffects(ctx, null) })
        if (effects.length != 2) {
            throw new Error()
        }
    }
    const text = getPrototype("179007_02A_U_WT027U_white").texts?.[0]
    if (text == null) {
        throw new Error()
    }
    let effect: Effect | null = {
        id: "",
        reason: ["PlayText", PlayerA, cardA.id, text.id],
        text: text
    }
    if (effect == null) {
        throw new Error()
    }
    const cets = createEffectTips(ctx, effect, 0, 0).filter(TipOrErrorsFn.filterError)
    if (cets.length) {
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
    ctx = doEffect(ctx, effect, 0, 0)
    effect = getTopEffect(ctx)
    if (effect == null) {
        throw new Error()
    }
    if (getItemBaSyou(ctx, cardA.id).value[1] != "Gゾーン") {
        throw new Error()
    }
    if (getCard(ctx, cardA.id).isRoll != true) {
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0)
    if (getItemBaSyou(ctx, cardA.id).value[1] != "配備エリア") {
        throw new Error()
    }
    if (getCard(ctx, cardA.id).isRoll != false) {
        throw new Error()
    }
}