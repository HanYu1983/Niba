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
import { addStackEffect, getCutInDestroyEffects, getTopEffect } from "../game/gameState/EffectStackComponent"
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

export async function test179028_10D_C_BL070N_blue() {
    await loadPrototype("179028_10D_C_BL070N_blue")
    await loadPrototype("unitBlue")
    const cardA: Card = {
        id: "cardA",
        protoID: "179028_10D_C_BL070N_blue"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "手札"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unitBlue", 2)) as GameState
    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]) as GameState
    const effects = createPlayEffects(ctx, PlayerA)
    if (effects.length == 0) {
        throw new Error()
    }
    {
        const effect = effects.find(eff => eff.reason[0] == "PlayCard" && eff.reason[3].isPlayCommand)
        if(effect == null){
            throw new Error()
        }
        const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
        if (cets.length != 0) {
            throw new Error()
        }
        const originCtx = JSON.parse(JSON.stringify(ctx))
        {
            const destroyUnit: Card = {
                id: "destroyUnit",
                protoID: "unitBlue",
            }
            ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [destroyUnit]) as GameState
            const destroyReason: DestroyReason = { id: "破壊する", playerID: PlayerB }
            ctx = doItemSetDestroy(ctx, destroyReason, [destroyUnit.id, getItemBaSyou(ctx, destroyUnit.id)])
            if (getItemState(ctx, destroyUnit.id).destroyReason == null) {
                throw new Error()
            }
            // 這裡模擬破壞效果進了堆疊了
            //ctx = createDestroyEffectAndPush(ctx)
            ctx = doCutInDestroyEffectsAndClear(ctx) as GameState
            if (getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == destroyUnit.id) == null) {
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
                if (getItemState(ctx, destroyUnit.id).destroyReason != null) {
                    throw new Error()
                }
                if (getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == destroyUnit.id) != null) {
                    throw new Error()
                }
            }
        }
        ctx = originCtx
        {
            const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
            if (cets.length != 0) {
                throw new Error()
            }
            const enemyUnit: Card = {
                id: "enemyUnit",
                protoID: "unitBlue",
            }
            ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), [enemyUnit]) as GameState
            const friendUnit: Card = {
                id: "friendUnit",
                protoID: "unitBlue",
            }
            ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [friendUnit]) as GameState
            ctx = checkIsBattle(ctx) as GameState
            {
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
                    if (BattlePointFn.eq(getSetGroupBattlePoint(ctx, friendUnit.id), [3, 3, 3]) == false) {
                        throw new Error()
                    }
                }
            }
        }
        ctx = originCtx
        {
            const destroyUnit: Card = {
                id: "destroyUnit",
                protoID: "unitBlue",
            }
            ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [destroyUnit]) as GameState
            const destroyReason: DestroyReason = { id: "破壊する", playerID: PlayerB }
            ctx = doItemSetDestroy(ctx, destroyReason, [destroyUnit.id, getItemBaSyou(ctx, destroyUnit.id)])
            if (getItemState(ctx, destroyUnit.id).destroyReason == null) {
                throw new Error()
            }
            // 這裡模擬破壞效果進了堆疊了
            //ctx = createDestroyEffectAndPush(ctx)
            ctx = doCutInDestroyEffectsAndClear(ctx) as GameState
            if (getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == destroyUnit.id) == null) {
                throw new Error()
            }
            const enemyUnit: Card = {
                id: "enemyUnit",
                protoID: "unitBlue",
            }
            ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), [enemyUnit]) as GameState
            const friendUnit: Card = {
                id: "friendUnit",
                protoID: "unitBlue",
            }
            ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [friendUnit]) as GameState
            ctx = checkIsBattle(ctx) as GameState
            const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
            if (cets.length != 2) {
                throw new Error()
            }
        }
    }

}