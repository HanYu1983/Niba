import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent";
import { doEffect, setCardTipStrBaSyouPairs, setTipSelectionForUser } from "../game/gameState/doEffect";
import { createGameState, GameState } from "../game/gameState/GameState";
import { getRerollPhaseRuleEffect } from "../game/gameState/getRerollPhaseRuleEffect";
import { getReturnRuleEffect } from "../game/gameState/getReturnRuleEffect";
import { getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { loadPrototype } from "../script";

export async function testReturnRuleEffect() {
    await loadPrototype("earthUnit")
    let ctx = createGameState()
    const attackEffect = getReturnRuleEffect(ctx, PlayerA)
    const earth: Card = {
        id: "earth",
        protoID: "earthUnit"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [earth]) as GameState
    const earth2: Card = {
        id: "earth2",
        protoID: "earthUnit"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2"), [earth2]) as GameState
    ctx = setTipSelectionForUser(ctx, attackEffect, 0, 0)
    if (getCard(ctx, earth.id).isRoll) {
        throw new Error()
    }
    ctx = doEffect(ctx, attackEffect, 0, 0)
    if (getCard(ctx, earth.id).isRoll != true) {
        throw new Error()
    }
    if(AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, earth.id), AbsoluteBaSyouFn.of(PlayerA, "配備エリア")) != true){
        throw new Error("")
    }
    if(AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, earth2.id), AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード")) != true){
        throw new Error("")
    }
}