import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { TipFn } from "../game/define/Tip"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardRollCostLength, getCardBattlePoint } from "../game/gameState/card"
import { addCards, createCardWithProtoIds, getCard, mapCard } from "../game/gameState/CardTableComponent"
import { getCardIdByCoinId, getCoins } from "../game/gameState/CoinTableComponent"
import { createEffectTips, doEffect, onMoveItem, setTipSelectionForUser, createCommandEffectTips, setEffectTips } from "../game/gameState/effect"
import { getEffect, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createConditionKeyOfPayColorX, getPlayCardEffects } from "../game/gameState/getPlayCardEffect"
import { getPlayEffects } from "../game/gameState/getPlayEffects"
import { getGlobalEffects, setGlobalEffects, clearGlobalEffects } from "../game/gameState/globalEffects"
import { checkIsBattle, isBattle } from "../game/gameState/IsBattleComponent"
import { getItemState, mapItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemIdsByBasyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { triggerEvent } from "../game/gameState/triggerEvent"
import { loadPrototype } from "../script"

export async function test179016_04B_U_BK066C_black() {
    await loadPrototype("179016_04B_U_BK066C_black")
    await loadPrototype("unitBlack")
    const cardA: Card = {
        id: "cardA",
        protoID: "179016_04B_U_BK066C_black"
    }
    const unit: Card = {
        id: "unit",
        protoID: "unitBlack"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), ["unitBlack", "unitBlack", "unitBlack"]) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), [unit]) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["配備フェイズ", "フリータイミング"]) as GameState
    const myGLength = getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン")).length
    {
        const effects = getPlayCardEffects(ctx, cardA.id)
        if (effects.length == 0) {
            throw new Error()
        }
        const effect = effects[0]
        const toes = createEffectTips(ctx, effect, 0, 0)
        const payKey = createConditionKeyOfPayColorX(getItemPrototype(ctx, cardA.id))
        for (const toe of toes) {
            let tip = toe.tip
            if (tip == null) {
                continue
            }
            if (toe.conditionKey == payKey) {
                tip = TipFn.passWantToSelection(tip)
            }
            ctx = mapItemState(ctx, cardA.id, is => ItemStateFn.setTip(is, toe.conditionKey, tip)) as GameState
        }
        if (TipFn.getSelection(ItemStateFn.getTip(getItemState(ctx, cardA.id), payKey)).length != myGLength) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)
    }
    {
        const effect = getTopEffect(ctx)
        if (effect == null) {
            throw new Error()
        }
        ctx = doEffect(ctx, effect, 0, 0)

    }
    {
        if (ctx.immediateEffect.length == 0) {
            throw new Error()
        }
        const effect = getEffect(ctx, ctx.immediateEffect[0])
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
        if (getItemState(ctx, unit.id).destroyReason == null) {
            throw new Error()
        }
    }
}