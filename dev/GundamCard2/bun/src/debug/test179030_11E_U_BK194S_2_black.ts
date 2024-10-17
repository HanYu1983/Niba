import { repeat } from "ramda"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { getCardTotalCostLength, getCardBattlePoint, getCardIdsCanPayRollCost } from "../game/gameState/card"
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { createEffectTips, doEffect, setTipSelectionForUser, createCommandEffectTips } from "../game/gameState/doEffect"
import { getEffect, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayCardEffects } from "../game/gameState/createPlayCardEffects"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "../game/gameState/globalEffects"
import { getItemState } from "../game/gameState/ItemStateComponent"
import { getItemIdsByBasyou, getItemIds, getItemBaSyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { loadPrototype } from "../script"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { Card } from "../game/define/Card"
import { doItemMove } from "../game/gameState/doItemMove"

export async function test179030_11E_U_BK194S_2_black() {
    await loadPrototype("179030_11E_U_BK194S_2_black")
    await loadPrototype("unitBlack")
    let ctx = createGameState()
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), ["179030_11E_U_BK194S_2_black"]) as GameState
    const unitWillMove: Card = {
        id: "unit",
        protoID: "unitBlack"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [unitWillMove]) as GameState
    const unitAtGravyard: Card = {
        id: "unitAtGravyard",
        protoID: "unitBlack"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード"), [unitAtGravyard]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unitBlack", 5)) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["ドローフェイズ", "フリータイミング"]) as GameState
    const effects = createPlayEffects(ctx, PlayerA)
    {
        if (effects.length == 0) {
            throw new Error()
        }
        const effect = effects[0]
        ctx = doEffect(ctx, effect, 0, 0)
    }
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)
        const ges = getGlobalEffects(ctx, null)
        if (ges.filter(ge => ge.title[0] == "場、または手札から、自軍ジャンクヤードにカードが移る場合、ジャンクヤードに移る代わりにゲームから取り除かれる").length == 0) {
            throw new Error()
        }
        if (ges.filter(ge => ge.title[0] == "自軍手札にあるかのようにプレイできる").length == 0) {
            throw new Error()
        }
        {
            let ctx2 = JSON.parse(JSON.stringify(ctx))
            ctx2 = doItemMove(ctx2, AbsoluteBaSyouFn.of(PlayerA, "ジャンクヤード"), [unitWillMove.id, getItemBaSyou(ctx2, unitWillMove.id)])
            if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitWillMove.id)) == "ジャンクヤード") {
                throw new Error()
            }
            if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitWillMove.id)) != "取り除かれたカード") {
                throw new Error()
            }
        }
        {
            // 移到敵軍墓地則沒有影響
            let ctx2 = JSON.parse(JSON.stringify(ctx))
            ctx2 = doItemMove(ctx2, AbsoluteBaSyouFn.of(PlayerB, "ジャンクヤード"), [unitWillMove.id, getItemBaSyou(ctx2, unitWillMove.id)])
            if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitWillMove.id)) == "取り除かれたカード") {
                throw new Error()
            }
            if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx2, unitWillMove.id)) != "ジャンクヤード") {
                throw new Error()
            }
        }
    }
    {
        ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
        const effects = createPlayEffects(ctx, PlayerA)
        if (effects.length == 0) {
            throw new Error()
        }
        const playCard = effects.find(e => e.reason[0] == "PlayCard" && e.reason[2] == unitAtGravyard.id && e.reason[3].isPlayUnit)
        if (playCard == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, playCard, 0, 0)
    }
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, unitAtGravyard.id)) != "配備エリア") {
            console.log(effect.text.description)
            console.log(ctx.table)
            throw new Error()
        }
    }
}

export async function test179030_11E_U_BK194S_2_black_2() {
    await loadPrototype("179030_11E_U_BK194S_2_black")
    await loadPrototype("unitBlack")
    let ctx = createGameState()
    const cardA: Card = {
        id: "unit",
        protoID: "179030_11E_U_BK194S_2_black"
    }
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unitBlack", 6)) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["ドローフェイズ", "フリータイミング"]) as GameState
    if (getItemPrototype(ctx, cardA.id).category != "ユニット") {
        console.log(getItemPrototype(ctx, cardA.id))
        throw new Error()
    }
    const effects = createPlayCardEffects(ctx, cardA.id)
    if (effects.length == 0) {
        throw new Error()
    }
    {
        const effect = effects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[3].isPlayUnit)
        if(effect == null){
            throw new Error()
        }
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, cardA.id)) != "プレイされているカード") {
            throw new Error()
        }
    }
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, cardA.id)) != "配備エリア") {
            throw new Error()
        }
    }
}