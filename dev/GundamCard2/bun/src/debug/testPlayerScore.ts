import { AbsoluteBaSyouFn } from "../game/define/BaSyou";
import { Card } from "../game/define/Card";
import { PlayerA, PlayerB, PlayerIDFn } from "../game/define/PlayerID";
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent";
import { doEffect, createEffectTips, createCommandEffectTips, setTipSelectionForUser } from "../game/gameState/doEffect";
import { doItemMove } from "../game/gameState/doItemMove";
import { getCutInDestroyEffects, getEffect, getImmediateEffects, getStackEffects, getTopEffect, removeEffect } from "../game/gameState/EffectStackComponent";
import { createGameState, GameState } from "../game/gameState/GameState";
import { loadPrototype } from "../script";
import { repeat } from "ramda";
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects";
import { createPlayerScore, createPreviewEffectScore, getPlayerDestroyIds } from "../game/gameState/player";
import { Effect, EffectFn } from "../game/define/Effect";

export async function testPlayerScore() {

    await loadPrototype("179029_B3C_C_BK071N_black")
    await loadPrototype("179019_02A_C_BK015S_black")
    await loadPrototype("unitBlack")

    let ctx = createGameState()
    const cardA: Card = {
        id: "cardA",
        protoID: "179029_B3C_C_BK071N_black"
    }
    const cardB: Card = {
        id: "cardB",
        protoID: "179019_02A_C_BK015S_black"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA, cardB]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), repeat("unitBlack", 2)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unitBlack", 6)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), repeat("unitBlack", 2)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), repeat("unitBlack", 2)) as GameState
    let playA = createPlayCardEffects(ctx, cardA.id)[0]
    if (playA == null) {
        throw new Error()
    }
    let playB = createPlayCardEffects(ctx, cardB.id)[0]
    if (playB == null) {
        throw new Error()
    }
    const effectScorePairs = createPreviewEffectScore(ctx, PlayerA, [playA, playB], { isMoreThenOrigin: true })
    if (effectScorePairs.length != 1) {
        throw new Error()
    }
    // 必須選第2個效果較好
    if (effectScorePairs[0][0] != playB.id) {
        throw new Error()
    }
}