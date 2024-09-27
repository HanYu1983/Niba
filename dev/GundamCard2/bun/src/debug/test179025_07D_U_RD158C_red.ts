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
import { addStackEffect, getCutInDestroyEffects, getTopEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, mapItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { doItemSetDestroy, createDestroyEffectAndPush } from "../game/gameState/doItemSetDestroy"
import { checkIsBattle } from "../game/gameState/IsBattleComponent"
import { getSetGroupBattlePoint } from "../game/gameState/setGroup"
import { createDestroyEffect } from "../game/gameState/createDestroyEffect"
import { DestroyReason, EffectFn } from "../game/define/Effect"
import { doCutInDestroyEffectsAndClear } from "../game/gameState/doCutInDestroyEffectsAndClear"
import { clearGlobalEffects, getGlobalEffects } from "../game/gameState/globalEffects"
import { getBattleGroup } from "../game/gameState/battleGroup"

export async function test179025_07D_U_RD158C_red() {
    await loadPrototype("179025_07D_U_RD158C_red")
    await loadPrototype("unit")
    const cardA: Card = {
        id: "cardA",
        protoID: "179025_07D_U_RD158C_red"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "ハンガー"), [cardA]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("179025_07D_U_RD158C_red", 2)) as GameState
    ctx = setActivePlayerID(ctx, PlayerB) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    //console.log(getItemPrototype(ctx, cardA.id))
    if(getCardHasSpeicalEffect(ctx, ["クイック"], cardA.id) != true){
        throw new Error()
    }
    if(getGlobalEffects(ctx, null).find(ge=>ge.title[0]=="合計国力＋(１)してプレイできる") == null){
        throw new Error()
    }
    const effects = createPlayEffects(ctx, PlayerA)
    if (effects.length != 2) {
        throw new Error()
    }
    {
        const effect = effects[1]
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
    }

}