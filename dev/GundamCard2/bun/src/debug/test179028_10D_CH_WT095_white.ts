import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint, getCardHasSpeicalEffect } from "../game/gameState/card"
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { clearTipSelectionForUser, createCommandEffectTips, createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect"
import { getTopEffect, removeEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou, getItemIds, getItemIdsByBasyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { getGlobalEffects } from "../game/gameState/globalEffects"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { GameError, TargetMissingError, TipError } from "../game/define/GameError"
import { getSetGroupRoot, setSetGroupParent } from "../game/gameState/SetGroupComponent"
import { repeat } from "ramda"
import { doCutInDestroyEffectsAndClear } from "../game/gameState/doCutInDestroyEffectsAndClear"

export async function test179028_10D_CH_WT095_white() {
    await loadPrototype("179028_10D_CH_WT095_white")
    await loadPrototype("unitWhite")
    const cardA: Card = {
        id: "cardA",
        protoID: "179028_10D_CH_WT095_white"
    }
    const unitWhite: Card = {
        id: "unitWhite",
        protoID: "unitWhite"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード"), [cardA]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード"), [unitWhite]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unitWhite", 5)) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    let effects = createPlayEffects(ctx, PlayerA)
    if (effects.length != 3) {
        throw new Error()
    }
    let effect = effects.find(e => e.text.description == "『恒常』：このカードは、自軍ジャンクヤードにある状態でプレイする場合、セット先として、自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚を、自軍配備エリアにロール状態で出し、このカードをセットできる。")
    if (effect == null) {
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
    ctx = doEffect(ctx, effect, 0, 0)
    // go stage effect
    effect = getTopEffect(ctx) || undefined
    if (effect == null) {
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
    ctx = doEffect(ctx, effect, 0, 0)

    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード")).length != 0) {
        throw new Error()
    }
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア")).length != 2) {
        throw new Error()
    }
    if (getSetGroupRoot(ctx, cardA.id) != unitWhite.id) {
        throw new Error()
    }
}