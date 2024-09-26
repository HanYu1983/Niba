import { repeat } from "ramda"
import { AbsoluteBaSyouFn } from "../game/define/BaSyou"
import { BattlePointFn } from "../game/define/BattlePoint"
import { Card } from "../game/define/Card"
import { ItemStateFn } from "../game/define/ItemState"
import { PlayerA, PlayerB } from "../game/define/PlayerID"
import { PhaseFn } from "../game/define/Timing"
import { setActivePlayerID } from "../game/gameState/ActivePlayerComponent"
import { getCardRollCostLength, getCardBattlePoint, getCardHasSpeicalEffect } from "../game/gameState/card"
import { addCards, createCardWithProtoIds } from "../game/gameState/CardTableComponent"
import { createCommandEffectTips, createEffectTips, doEffect, setTipSelectionForUser } from "../game/gameState/doEffect"
import { getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { getPlayEffects } from "../game/gameState/getPlayEffects"
import { getItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { triggerEvent } from "../game/gameState/triggerEvent"
import { loadPrototype } from "../script"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { doItemSetDestroy } from "../game/gameState/doItemSetDestroy"

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
    const effects = getPlayEffects(ctx, PlayerA)
    if (effects.length == 0) {
        throw new Error()
    }
    {
        const e = effects[0]
        const cets = createCommandEffectTips(ctx, e).filter(CommandEffecTipFn.filterNoError)
        if (cets.length != 0) {
            throw new Error()
        }
        const destroyUnit: Card = {
            id: "destroyUnit",
            protoID: "unitBlue",
        }
        ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), [destroyUnit]) as GameState
        ctx = doItemSetDestroy(ctx, { id: "破壊する", playerID: PlayerB }, [destroyUnit.id, getItemBaSyou(ctx, destroyUnit.id)])
        {
            const cets = createCommandEffectTips(ctx, e)//.filter(CommandEffecTipFn.filterNoError)
            for(const cet of cets){
                console.log(cet.logicID, cet.logicSubID, cet.tipOrErrors.map(t=>t.errors))
            }
            if (cets.length != 1) {
                throw new Error()
            }
        }
    }
}