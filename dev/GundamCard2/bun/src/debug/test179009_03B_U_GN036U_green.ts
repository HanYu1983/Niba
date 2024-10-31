import { repeat } from "ramda"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint, getCardHasSpeicalEffect } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard } from "../game/gameState/CardTableComponent"
import { createCommandEffectTips, createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect"
import { addStackEffect, getCutInDestroyEffects, getEffect, getImmediateEffects, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, mapItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { createStrBaSyouPair, getItemBaSyou, getItemIdsByBasyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { clearGlobalEffects, getGlobalEffects } from "../game/gameState/globalEffects"
import { Effect } from "../game/define/Effect"
import { createPlayCardEffect, createPlayCardEffects } from "../game/gameState/createPlayCardEffects"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { getSetGroupRoot, setSetGroupParent } from "../game/gameState/SetGroupComponent"
import { doItemMove } from "../game/gameState/doItemMove"

export async function test179009_03B_U_GN036U_green() {
    await loadPrototype("179009_03B_U_GN036U_green")
    await loadPrototype("179003_01A_CH_GN001R_green")
    await loadPrototype("179003_01A_U_GN001R_green")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179009_03B_U_GN036U_green"
    }
    const char: Card = {
        id: "char",
        protoID: "179003_01A_CH_GN001R_green"
    }
    const masterUnit: Card = {
        id: "masterUnit",
        protoID: "179003_01A_U_GN001R_green"
    }
    const unit: Card = {
        id: "unit",
        protoID: "unit"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [masterUnit, char]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), [unit]) as GameState
    // 交戰中受傷的敵軍存在
    ctx = mapItemState(ctx, unit.id, is => ({ ...is, damage: 1 })) as GameState
    // 自軍專用機成立存在
    ctx = setSetGroupParent(ctx, masterUnit.id, char.id) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "防御ステップ", "フリータイミング"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    let effects = createPlayEffects(ctx, PlayerA, { ges: getGlobalEffects(ctx, null) })
    if (effects.length != 2) {
        console.log(effects)
        throw new Error()
    }
    // 沒有國力可以橫置也可以使用
    let effect: Effect | null = effects.find(eff => eff.reason[0] == "PlayText" && eff.text.description == "（戦闘フェイズ）〔R+１〕：このカードと交戦中の、ダメージを受けている敵軍ユニット１枚を持ち主の本国の上に移す。自軍ユニットの「専用機のセット」が成立している場合、この効果のコストは〔０〕に変更される。") || null
    if (effect == null) {
        console.log(effects)
        throw new Error()
    }
    let cets = createCommandEffectTips(ctx, effect)
    let cetsCanUse = cets.filter(CommandEffecTipFn.filterNoError)
    if (cetsCanUse.length != 1) {
        for (const cet of cets) {
            console.log(cet.tipOrErrors)
        }
        throw new Error()
    }
    effect = effects.find(eff => eff.id == cetsCanUse[0].effectId) || null
    if (effect == null) {
        console.log(effects)
        throw new Error()
    }
    ctx = setTipSelectionForUser(ctx, effect, cetsCanUse[0].logicID, cetsCanUse[0].logicSubID)
    ctx = doEffect(ctx, effect, cetsCanUse[0].logicID, cetsCanUse[0].logicSubID)
    //
    effect = getTopEffect(ctx)
    if (effect == null) {
        throw new Error()
    }
    ctx = doEffect(ctx, effect, 0, 0)
    if (AbsoluteBaSyouFn.eq(getItemBaSyou(ctx, unit.id), AbsoluteBaSyouFn.of(PlayerB, "本国")) != true) {
        throw new Error()
    }
}