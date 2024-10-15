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
import { addStackEffect, getCutInDestroyEffects, getImmediateEffects, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, mapItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { createStrBaSyouPair, getItemBaSyou, getItemIdsByBasyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { clearGlobalEffects, getGlobalEffects, setGlobalEffects } from "../game/gameState/globalEffects"
import { Effect } from "../game/define/Effect"
import { createPlayCardEffect, createPlayCardEffects } from "../game/gameState/createPlayCardEffects"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { getSetGroupRoot } from "../game/gameState/SetGroupComponent"
import { doItemMove } from "../game/gameState/doItemMove"

export async function test179003_01A_CH_GN001R_green() {
    await loadPrototype("179003_01A_CH_GN001R_green")
    await loadPrototype("179003_01A_U_GN001R_green")
    await loadPrototype("unit")
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
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [char]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [unit, masterUnit]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("179003_01A_CH_GN001R_green", 2)) as GameState
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    let storedCtx = JSON.parse(JSON.stringify(ctx))
    {
        const ges = getGlobalEffects(ctx, null)
        ctx = setGlobalEffects(ctx, null, ges)
        let effects = createPlayCardEffects(ctx, char.id)
        if (effects.length != 3) {
            console.log(effects)
            throw new Error()
        }
        let effect: Effect | null = effects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[3].isPlayCharacter && eff.text.description == "『恒常』：このカードは、「専用機のセット」が成立するユニットにセットする場合、合計国力２としてプレイできる。") || null
        if (effect == null) {
            console.log(effects)
            throw new Error()
        }
        let cets = createCommandEffectTips(ctx, effect)
        cets = cets.filter(CommandEffecTipFn.filterNoError)
        if (cets.length != 1) {
            for (const cet of cets) {
                console.log(cet.tipOrErrors)
            }
            throw new Error()
        }
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
        //
        effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if (getSetGroupRoot(ctx, char.id) != masterUnit.id) {
            throw new Error()
        }
        ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("179003_01A_CH_GN001R_green", 2)) as GameState
        ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), repeat("unit", 1)) as GameState
        ctx = doItemMove(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), createStrBaSyouPair(ctx, masterUnit.id))
        ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
        ctx = setActivePlayerID(ctx, PlayerA) as GameState
        if (getItemBaSyou(ctx, char.id).value[1] != "戦闘エリア1") {
            throw new Error()
        }
        effects = createPlayEffects(ctx, PlayerA)
        if (effects.length != 1) {
            console.log(effects)
            throw new Error()
        }
        effect = effects.find(eff => eff.reason[0] == "PlayText") || null
        if (effect == null) {
            console.log(effects)
            throw new Error()
        }
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
        //
        effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア")).some(cardId => getItemState(ctx, cardId).damage == 3) != true) {
            throw new Error()
        }
    }
    ctx = storedCtx
    {
        const ges = getGlobalEffects(ctx, null)
        ctx = setGlobalEffects(ctx, null, ges)
        let effects = createPlayCardEffects(ctx, char.id)
        if (effects.length != 3) {
            console.log(effects)
            throw new Error()
        }
        // 另一個Play沒有專用機，費用沒有減免，不能使用，不能出現在指令列表
        let effect: Effect | null = effects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[3].isPlayCharacter && eff.text.description != "『恒常』：このカードは、「専用機のセット」が成立するユニットにセットする場合、合計国力２としてプレイできる。") || null
        if (effect == null) {
            console.log(effects)
            throw new Error()
        }
        // 確認指令不存在
        let cets = createCommandEffectTips(ctx, effect)
        cets = cets.filter(CommandEffecTipFn.filterNoError)
        if (cets.length != 0) {
            console.log(cets)
            throw new Error()
        }
    }
}