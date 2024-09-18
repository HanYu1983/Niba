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
import { getItemBaSyou, getItemIds, getItemIdsByBasyou, moveItem } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { loadPrototype } from "../script"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"

export async function test179030_11E_C_BL079R_blue() {
    await loadPrototype("179030_11E_C_BL079R_blue")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179030_11E_C_BL079R_blue"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unit", 2)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), repeat("unit", 2)) as GameState
    if (getCardIdsCanPayRollCost(ctx, PlayerA, null).length != 2) {
        throw new Error(`getCardIdsCanPayRollCost(ctx, PlayerA, null).length !=2`)
    }
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    {
        console.log("建立效果對象")
        const cardB: Card = {
            id: "cardB",
            protoID: "unit"
        }
        const originBasyouB = AbsoluteBaSyouFn.of(PlayerA, "ハンガー")
        ctx = addCards(ctx, originBasyouB, [cardB]) as GameState
        const cardC: Card = {
            id: "cardC",
            protoID: "unit"
        }
        const originBasyouC = AbsoluteBaSyouFn.of(PlayerA, "配備エリア")
        ctx = addCards(ctx, originBasyouC, [cardC]) as GameState
        console.log("選擇對象")
        let cs = getItemState(ctx, cardA.id)
        cs = ItemStateFn.setTip(cs,
            "自軍手札、または自軍ハンガーにある、６以下の合計国力を持つユニット１枚を",
            { title: ["カード", [], [[cardB.id, originBasyouB]]] }
        )
        cs = ItemStateFn.setTip(cs,
            "自軍ユニット１枚",
            { title: ["カード", [], [[cardC.id, originBasyouC]]] }
        )
        ctx = setItemState(ctx, cardA.id, cs) as GameState

        console.log("出指令")
        const playCardEffects = getPlayEffects(ctx, PlayerA)
        if (playCardEffects.length != 1) {
            throw new Error(`playCardEffects.length != 1`)
        }
        ctx = doEffect(ctx, playCardEffects[0], 0, 0)
        {
            console.log("解決指令效果")
            const effect = getTopEffect(ctx)
            if (effect == null) {
                throw new Error(`effect == null`)
            }
            if (effect.reason[0] != "場に出る") {
                throw new Error(`effect.reason[0]!="場に出る`)
            }
            console.log(`執行效果: ${effect.description}`)
            ctx = doEffect(ctx, effect, 0, 0)
            ctx = removeEffect(ctx, effect.id) as GameState
            console.log("指令卡會移到墓地")
            if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード")).length != 1) {
                throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード")).length != 1`)
            }
            if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札")).length != 0) {
                throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札")).length != 0`)
            }
            console.log("cardB和cardC交換位置")
            if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, cardB.id), originBasyouC) != true) {
                throw new Error(`AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, cardB.id),originBasyouC) != true`)
            }
            if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, cardC.id), originBasyouB) != true) {
                throw new Error(`AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, cardC.id),originBasyouB) != true`)
            }
        }
        if (ctx.immediateEffect.length) {
            const effect = getEffect(ctx, ctx.immediateEffect[0])
            if (effect == null) {
                throw new Error(`effect == null`)
            }
            console.log(`得到效果:${effect.text.description}`)
            if (effect.isOption != true) {
                throw new Error(`effect.isOption != true`)
            }
            if (effect.reason[0] != "PlayText") {
                throw new Error(`effect.reason[0]!="PlayText`)
            }
            if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length != 2) {
                throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length != 2`)
            }
            console.log(`執行效果: ${effect.text.description}`)
            ctx = doEffect(ctx, effect, 0, 0)
            if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length != 1) {
                throw new Error(`getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")).length != 1`)
            }
        } else {
            throw new Error(`ctx.immediateEffect.length`)
        }
    }
}