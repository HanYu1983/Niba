import { repeat } from "ramda"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardRollCostLength, getCardBattlePoint, getCardHasSpeicalEffect, getCardIdsCanPayRollCost } from "../game/gameState/card"
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { getEffectTips, doEffect, onMoveItem } from "../game/gameState/effect"
import { getEffect, getTopEffect, removeEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { getPlayEffects } from "../game/gameState/getPlayEffects"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou, getItemIds, getItemIdsByBasyou, moveItem } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { triggerEvent } from "../game/gameState/triggerEvent"
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory"
import { loadPrototype } from "../script"

export async function test179030_11E_C_BL079R_blue() {
    await loadPrototype("179030_11E_C_BL079R_blue")
    const cardA: Card = {
        id: "cardA",
        protoID: "179030_11E_C_BL079R_blue"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("179030_11E_C_BL079R_blue", 2)) as GameState
    if (getCardIdsCanPayRollCost(ctx, PlayerA, null).length != 2) {
        throw new Error(`getCardIdsCanPayRollCost(ctx, PlayerA, null).length !=2`)
    }
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    {
        console.log("出指令")
        const playCardEffects = getPlayEffects(ctx, PlayerA)
        if (playCardEffects.length != 1) {
            throw new Error(`playCardEffects.length != 1`)
        }
        ctx = doEffect(ctx, playCardEffects[0], 0, 0)
        {
            console.log("解決出指令效果")
            const effect = getTopEffect(ctx)
            if (effect == null) {
                throw new Error(`effect == null`)
            }
            if (effect.reason[0] != "場に出る") {
                throw new Error(`effect.reason[0]!="場に出る`)
            }
            ctx = doEffect(ctx, effect, 0, 0)
            ctx = removeEffect(ctx, effect.id) as GameState
            if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード")).length != 1) {
                throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード")).length != 1`)
            }
            if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札")).length != 0) {
                throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札")).length != 0`)
            }
        }
        if (ctx.immediateEffect.length) {
            const effect = getEffect(ctx, ctx.immediateEffect[0])
            if (effect == null) {
                throw new Error(`effect == null`)
            }
            if (effect.reason[0] != "PlayText") {
                throw new Error(`effect.reason[0]!="PlayText`)
            }
            ctx = doEffect(ctx, effect, 0, 0)
        } else {
            throw new Error(`ctx.immediateEffect.length`)
        }
        // {
        //     const effect = getTopEffect(ctx)
        //     if (effect == null) {
        //         throw new Error(`effect == null`)
        //     }
        //     if (effect.reason[0] != "場に出る") {
        //         throw new Error(`effect.reason[0]!="場に出る`)
        //     }
        // }
    }
}