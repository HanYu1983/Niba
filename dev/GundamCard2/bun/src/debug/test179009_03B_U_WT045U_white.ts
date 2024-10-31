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
import { getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { getGlobalEffects, setGlobalEffects } from "../game/gameState/globalEffects"
import { getBattleGroup, getBattleGroupBattlePoint } from "../game/gameState/battleGroup"
import { doPlayerAttack } from "../game/gameState/player"
import { checkIsBattle } from "../game/gameState/IsBattleComponent"

export async function test179009_03B_U_WT045U_white() {
    await loadPrototype("179009_03B_U_WT045U_white")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179009_03B_U_WT045U_white"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), ["179009_03B_U_WT045U_white", "179009_03B_U_WT045U_white"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    let ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    ctx = checkIsBattle(ctx) as GameState
    if (ges.find(ge => ge.title[0] == "このカードと交戦中の敵軍部隊の部隊戦闘力を_－３する") == null) {
        throw new Error()
    }
    let battleGroup = getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"))
    if (getBattleGroupBattlePoint(ctx, battleGroup, battleGroup, { ges: ges }) != -2) {
        throw new Error()
    }
    battleGroup = getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"))
    if (getBattleGroupBattlePoint(ctx, battleGroup, battleGroup, { ges: ges }) != 1) {
        throw new Error()
    }
    ctx = doPlayerAttack(ctx, PlayerA, "戦闘エリア1", 2, { ges: ges })
    if (getItemState(ctx, cardA.id).damage != 1) {
        console.log(ctx.battleSnapshot)
        throw new Error()
    }
}