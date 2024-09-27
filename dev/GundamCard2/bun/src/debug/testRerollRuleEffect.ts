import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent";
import { doEffect, setCardTipStrBaSyouPairs, setTipSelectionForUser } from "../game/gameState/doEffect";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createRerollPhaseRuleEffect } from "../game/gameState/createRerollPhaseRuleEffect";
import { loadPrototype } from "../script";

export async function testReollRuleEffect() {
    await loadPrototype("empty")
    let ctx = createGameState()
    const attackEffect = createRerollPhaseRuleEffect(ctx, PlayerA)
    const empty: Card = {
        id: "empty",
        protoID: "empty",
        isRoll: true
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [empty]) as GameState
    const empty2: Card = {
        id: "empty2",
        protoID: "empty",
        isRoll: true
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), [empty2]) as GameState
    ctx = setTipSelectionForUser(ctx, attackEffect, 0, 0)
    if (getCard(ctx, empty.id).isRoll != true) {
        throw new Error()
    }
    if (getCard(ctx, empty2.id).isRoll != true) {
        throw new Error()
    }
    ctx = doEffect(ctx, attackEffect, 0, 0)
    if (getCard(ctx, empty.id).isRoll != false) {
        throw new Error()
    }
    if (getCard(ctx, empty2.id).isRoll != false) {
        throw new Error()
    }
}