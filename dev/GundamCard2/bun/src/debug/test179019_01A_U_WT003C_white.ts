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
import { loadPrototype } from "../script"
import { getGlobalEffects } from "../game/gameState/globalEffects"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { GameError, TargetMissingError, TipError } from "../game/define/GameError"
import { setSetGroupParent } from "../game/gameState/SetGroupComponent"
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects"
import { StrBaSyouPair, TipFn } from "../game/define/Tip"

export async function test179019_01A_U_WT003C_white() {
    await loadPrototype("179019_01A_U_WT003C_white")
    await loadPrototype("unitBlack")
    const cardA: Card = {
        id: "cardA",
        protoID: "179019_01A_U_WT003C_white"
    }
    const cardHand: Card = {
        id: "cardHand",
        protoID: "179019_01A_U_WT003C_white"
    }
    const unitBlack: Card = {
        id: "unitBlack",
        protoID: "unitBlack"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), [unitBlack]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardHand]) as GameState
    let effects = createPlayCardEffects(ctx, cardHand.id)
    let effect = effects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[3].isPlayUnit == true)
    if (effect == null) {
        throw new Error()
    }
    let toes = createEffectTips(ctx, effect, 0, 0)
    let hasCardAcanPayCost = toes.find(toe => toe.conditionKey == TipFn.createRollColorKey(0, "白") && toe.tip && (TipFn.getWant(toe.tip) as StrBaSyouPair[])[0][0] == cardA.id) != null
    if (hasCardAcanPayCost != true) {
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, effect, 0, 0)
    ctx = doEffect(ctx, effect, 0, 0)
    if (getCard(ctx, cardA.id).isRoll != true) {
        throw new Error()
    }
}