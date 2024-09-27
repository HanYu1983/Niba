import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { getBattleGroup, isBattleGroupHasA } from "../game/gameState/battleGroup";
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent";
import { doEffect, setCardTipStrBaSyouPairs, setTipSelectionForUser } from "../game/gameState/doEffect";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createAttackPhaseRuleEffect } from "../game/gameState/createAttackPhaseRuleEffect";
import { createDrawPhaseRuleEffect } from "../game/gameState/createDrawPhaseRuleEffect";
import { getItemIdsByBasyou, getItem, getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { loadPrototype } from "../script";

export async function testDrawRuleEffect() {
    await loadPrototype("empty")
    let ctx = createGameState()
    const attackEffect = createDrawPhaseRuleEffect(ctx, PlayerA)
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), ["empty", "empty"]) as GameState
    ctx = setTipSelectionForUser(ctx, attackEffect, 0, 0)
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札")).length != 0) {
        throw new Error()
    }
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length != 2) {
        throw new Error()
    }
    ctx = doEffect(ctx, attackEffect, 0, 0)
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札")).length != 1) {
        throw new Error()
    }
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length != 1) {
        throw new Error()
    }
}