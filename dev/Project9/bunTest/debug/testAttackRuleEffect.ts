import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { getBattleGroup, isABattleGroup } from "../game/gameState/battleGroup";
import { addCards } from "../game/gameState/CardTableComponent";
import { doEffect, setCardTipStrBaSyouPairs, setTipSelectionForUser } from "../game/gameState/effect";
import { createGameState, GameState } from "../game/gameState/GameState";
import { getAttackPhaseRuleEffect } from "../game/gameState/getAttackPhaseRuleEffect";
import { getItem, getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { loadPrototype } from "../script";

export async function testAttackRuleEffect() {
    await loadPrototype("earthUnit")
    await loadPrototype("spaceUnit")
    let ctx = createGameState()
    const attackEffect = getAttackPhaseRuleEffect(ctx, PlayerA)
    const earthUnit: Card = {
        id: "earthUnit",
        protoID: "earthUnit"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [earthUnit]) as GameState
    const spaceUnit: Card = {
        id: "spaceUnit",
        protoID: "spaceUnit"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [spaceUnit]) as GameState
    ctx = setTipSelectionForUser(ctx, attackEffect)
    ctx = doEffect(ctx, attackEffect, 0, 0)
    if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, earthUnit.id), AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1")) != true) {
        throw new Error()
    }
    if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, spaceUnit.id), AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア2")) != true) {
        throw new Error()
    }
}

export async function testAttackRuleEffect2() {
    await loadPrototype("earthUnit")
    await loadPrototype("unitHasHigh")
    let ctx = createGameState()
    const attackEffect = getAttackPhaseRuleEffect(ctx, PlayerA)
    const earthUnit: Card = {
        id: "earthUnit",
        protoID: "earthUnit"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [earthUnit]) as GameState
    if (getBattleGroup(ctx, getItemBaSyou(ctx, earthUnit.id)).length != 1) {
        throw new Error()
    }
    if (isABattleGroup(ctx, ["高機動"], earthUnit.id)) {
        throw new Error()
    }
    const unitHasHigh: Card = {
        id: "unitHasHigh",
        protoID: "unitHasHigh"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), [unitHasHigh]) as GameState
    if (getBattleGroup(ctx, getItemBaSyou(ctx, unitHasHigh.id)).length != 1) {
        throw new Error()
    }
    if (isABattleGroup(ctx, ["高機動"], unitHasHigh.id) == false) {
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, attackEffect)
    ctx = doEffect(ctx, attackEffect, 0, 0)
    if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, earthUnit.id), AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1")) != false) {
        throw new Error()
    }
}