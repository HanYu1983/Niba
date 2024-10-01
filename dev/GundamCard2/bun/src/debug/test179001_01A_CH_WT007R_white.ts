import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardRollCostLength, getCardBattlePoint, getCardHasSpeicalEffect } from "../game/gameState/card"
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
import { getGlobalEffects } from "../game/gameState/globalEffects"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { GameError, TargetMissingError, TipError } from "../game/define/GameError"
import { setSetGroupParent } from "../game/gameState/SetGroupComponent"

export async function test179001_01A_CH_WT007R_white() {
    await loadPrototype("179001_01A_CH_WT007R_white")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179001_01A_CH_WT007R_white"
    }
    const unit: Card = {
        id: "unit",
        protoID: "unit"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA, unit]) as GameState
    ctx = setSetGroupParent(ctx, unit.id, cardA.id) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), ["179001_01A_CH_WT007R_white", "179001_01A_CH_WT007R_white"]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    if (getCardHasSpeicalEffect(ctx, ["速攻"], cardA.id) != false) {
        throw new Error()
    }
    {
        let cs = getItemState(ctx, cardA.id)
        cs = ItemStateFn.setTip(cs, "このセットグループのユニットは", { title: ["カード", [], [[cardA.id, getItemBaSyou(ctx, cardA.id)]]] })
        ctx = setItemState(ctx, cardA.id, cs) as GameState
        const playCardEffects = createPlayEffects(ctx, PlayerA)
        if (playCardEffects.length != 1) {
            throw new Error(`playCardEffects.length != 1`)
        }
        const playCardEffect = playCardEffects[0]
        ctx = setTipSelectionForUser(ctx, playCardEffect, 0, 0)
        ctx = doEffect(ctx, playCardEffect, 0, 0)
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error(`effect == null`)
        }
        if (effect.reason[0] != "PlayText") {
            throw new Error(`effect.reason[0]!="PlayText`)
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if (getCardHasSpeicalEffect(ctx, ["速攻"], unit.id) != true) {
            throw new Error()
        }
        // 避開同切上限
        ctx = doTriggerEvent(ctx, { title: ["カット終了時", [playCardEffect]] })
        // 已有速攻了，不能再加速攻
        //ctx = clearTipSelectionForUser(ctx, playCardEffect, 0, 0)
        const cetsNoErr = createCommandEffectTips(ctx, playCardEffect).filter(CommandEffecTipFn.not(CommandEffecTipFn.filterNoError))
        if (cetsNoErr.length == 0) {
            throw new Error()
        }

        ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", PhaseFn.getLast()] })
        if (getCardHasSpeicalEffect(ctx, ["速攻"], unit.id) != false) {
            throw new Error()
        }
    }
}