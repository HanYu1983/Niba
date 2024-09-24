import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardRollCostLength, getCardBattlePoint, getCardHasSpeicalEffect } from "../game/gameState/card"
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { createEffectTips, doEffect, onMoveItem } from "../game/gameState/effect"
import { getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { getPlayEffects } from "../game/gameState/getPlayEffects"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { triggerEvent } from "../game/gameState/triggerEvent"
import { loadPrototype } from "../script"

export async function test179001_01A_CH_WT007R_white() {
    await loadPrototype("179001_01A_CH_WT007R_white")
    const cardA: Card = {
        id: "cardA",
        protoID: "179001_01A_CH_WT007R_white"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    {
        let cs = getItemState(ctx, cardA.id)
        cs = ItemStateFn.setTip(cs, "このセットグループのユニットは", { title: ["カード", [], [[cardA.id, getItemBaSyou(ctx, cardA.id)]]] })
        ctx = setItemState(ctx, cardA.id, cs) as GameState
        const playCardEffects = getPlayEffects(ctx, PlayerA)
        if (playCardEffects.length != 1) {
            throw new Error(`playCardEffects.length != 1`)
        }
        ctx = doEffect(ctx, playCardEffects[0], 0, 0)
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error(`effect == null`)
        }
        if (effect.reason[0] != "PlayText") {
            throw new Error(`effect.reason[0]!="PlayText`)
        }
        ctx = doEffect(ctx, effect, 0, 0)
        if (getCardHasSpeicalEffect(ctx, ["速攻"], cardA.id) != true) {
            throw new Error(`getCardHasSpeicalEffect(ctx, ["速攻"],cardA.id) != true`)
        }
        ctx = triggerEvent(ctx, { title: ["GameEventOnTiming", PhaseFn.getLast()] })
        if (getCardHasSpeicalEffect(ctx, ["速攻"], cardA.id) != false) {
            throw new Error(`getCardHasSpeicalEffect(ctx, ["速攻"],cardA.id) != false`)
        }
    }
}