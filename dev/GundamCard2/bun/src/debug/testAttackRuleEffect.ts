import { createBridge } from "../game/bridge/createBridge";
import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA, PlayerB } from "../game/define/PlayerID";
import { getBattleGroup, isABattleGroup } from "../game/gameState/battleGroup";
import { addCards } from "../game/gameState/CardTableComponent";
import { createCommandEffectTips, createEffectTips, doEffect, setCardTipStrBaSyouPairs, setTipSelectionForUser } from "../game/gameState/doEffect";
import { createGameState, GameState } from "../game/gameState/GameState";
import { createAttackPhaseRuleEffect } from "../game/gameState/createAttackPhaseRuleEffect";
import { createConditionTitleFn } from "../game/gameState/createConditionTitleFn";
import { getItem, getItemBaSyou } from "../game/gameState/ItemTableComponent";
import { Flow } from "../game/gameStateWithFlowMemory/Flow";
import { loadPrototype } from "../script";

export async function testAttackRuleEffect() {
    await loadPrototype("earthUnit")
    await loadPrototype("spaceUnit")
    let ctx = createGameState()
    const attackEffect = createAttackPhaseRuleEffect(ctx, PlayerA)
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
    ctx = setTipSelectionForUser(ctx, attackEffect, 0, 0)
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
    const attackEffect = createAttackPhaseRuleEffect(ctx, PlayerA)
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
    ctx = setTipSelectionForUser(ctx, attackEffect, 0, 0)
    ctx = doEffect(ctx, attackEffect, 0, 0)
    if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, earthUnit.id), AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1")) != false) {
        throw new Error()
    }
}

export async function testAttackRuleEffect3() {
    await loadPrototype("earthUnit")
    await loadPrototype("unitHasHigh")
    let ctx = createGameState()
    const attackEffect = createAttackPhaseRuleEffect(ctx, PlayerA)
    const tipOrErrors = createEffectTips(ctx, attackEffect, 0, 0, { isCheckUserSelection: true })
    const toes = tipOrErrors.filter(toe => toe.errors.length != 0)
    const tipInfos = toes.map(toe => {
        const con = attackEffect.text.conditions?.[toe.conditionKey]
        if (con == null) {
            throw new Error(`con must exist`)
        }
        const tip = createConditionTitleFn(con, {})(ctx, attackEffect, createBridge())
        return {
            conditionKey: toe.conditionKey,
            condition: con,
            tip: tip
        }
    }).filter(info => info.tip)
    const playerTips = tipInfos.filter(info => {
        if (info.condition.relatedPlayerSideKeyword == "敵軍") {
            return PlayerB
        }
        return PlayerA
    })
    if (playerTips.filter(tip => tip.conditionKey == "去地球").length != 1) {
        throw new Error()
    }
    if (playerTips.filter(tip => tip.conditionKey == "去宇宙").length != 1) {
        throw new Error()
    }
}