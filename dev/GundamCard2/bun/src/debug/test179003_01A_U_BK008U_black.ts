import { repeat } from "ramda"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardTotalCostLength, getCardBattlePoint, getCardHasSpeicalEffect } from "../game/gameState/card"
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { createCommandEffectTips, createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect"
import { addStackEffect, getCutInDestroyEffects, getEffect, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, mapItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { doItemSetDestroy, createMinusDestroyEffectAndPush } from "../game/gameState/doItemSetDestroy"
import { checkIsBattle } from "../game/gameState/IsBattleComponent"
import { getSetGroupBattlePoint } from "../game/gameState/setGroup"
import { createDestroyEffect } from "../game/gameState/createDestroyEffect"
import { DestroyReason, EffectFn } from "../game/define/Effect"
import { doCutInDestroyEffectsAndClear } from "../game/gameState/doCutInDestroyEffectsAndClear"
import { getGlobalEffects } from "../game/gameState/globalEffects"

export async function test179003_01A_U_BK008U_black() {
    await loadPrototype("179003_01A_U_BK008U_black")
    await loadPrototype("unitBlue")
    const cardA: Card = {
        id: "cardA",
        protoID: "179003_01A_U_BK008U_black"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unitBlue", 2)) as GameState
    ctx = setActivePlayerID(ctx, PlayerB) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    const effects = createPlayEffects(ctx, PlayerA, { ges: getGlobalEffects(ctx, null) })
    if (effects.length == 0) {
        throw new Error()
    }
    {
        const effect = effects[0]
        const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
        if (cets.length != 0) {
            throw new Error()
        }
        {
            const destroyReason: DestroyReason = { id: "戦闘ダメージ", playerID: PlayerB }
            ctx = doItemSetDestroy(ctx, destroyReason, [cardA.id, getItemBaSyou(ctx, cardA.id)], { ges: getGlobalEffects(ctx, null) })
            if (getItemState(ctx, cardA.id).destroyReason == null) {
                throw new Error()
            }
            // 這裡模擬破壞效果進了堆疊了
            //ctx = createDestroyEffectAndPush(ctx)
            ctx = doCutInDestroyEffectsAndClear(ctx, null, { ges: getGlobalEffects(ctx, null) }) as GameState
            if (getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == cardA.id) == null) {
                throw new Error()
            }
            // 
            const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
            if (cets.length != 1) {
                throw new Error()
            }
            const cet = cets[0]
            ctx = setTipSelectionForUser(ctx, effect, cet.logicID, cet.logicSubID)
            ctx = doEffect(ctx, effect, cet.logicID, cet.logicSubID)
            {
                const effect = getTopEffect(ctx)
                if (effect == null) {
                    throw new Error()
                }
                ctx = doEffect(ctx, effect, 0, 0)
                if (getItemState(ctx, cardA.id).destroyReason != null) {
                    throw new Error()
                }
                if (getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == cardA.id) != null) {
                    throw new Error()
                }
                if (AbsoluteBaSyouFn.getBaSyouKeyword(getItemBaSyou(ctx, cardA.id)) != "Gゾーン") {
                    throw new Error()
                }
            }
        }
    }

}