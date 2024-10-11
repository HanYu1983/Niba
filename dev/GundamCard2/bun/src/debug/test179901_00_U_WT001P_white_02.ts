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
import { addStackEffect, getCutInDestroyEffects, getEffect, getTopEffect, removeEffect } from "../game/gameState/EffectStackComponent"
import { createGameState, GameState } from "../game/gameState/GameState"
import { createPlayEffects } from "../game/gameState/createPlayEffects"
import { getItemState, mapItemState, setItemState } from "../game/gameState/ItemStateComponent"
import { getItemBaSyou, getItemIdsByBasyou, getItemPrototype } from "../game/gameState/ItemTableComponent"
import { setPhase } from "../game/gameState/PhaseComponent"
import { doTriggerEvent } from "../game/gameState/doTriggerEvent"
import { loadPrototype } from "../script"
import { CommandEffecTipFn } from "../game/define/CommandEffectTip"
import { doItemSetDestroy, createMinusDestroyEffectAndPush } from "../game/gameState/doItemSetDestroy"
import { checkIsBattle, isBattle } from "../game/gameState/IsBattleComponent"
import { getSetGroupBattlePoint } from "../game/gameState/setGroup"
import { createDestroyEffect } from "../game/gameState/createDestroyEffect"
import { DestroyReason, EffectFn } from "../game/define/Effect"
import { doCutInDestroyEffectsAndClear } from "../game/gameState/doCutInDestroyEffectsAndClear"
import { doBattleDamage } from "../game/gameState/player"
import { getBattleGroup } from "../game/gameState/battleGroup"
import { createTipByEntitySearch } from "../game/gameState/Entity"
import { TipFn } from "../game/define/Tip"

export async function test179901_00_U_WT001P_white_02() {
    await loadPrototype("179901_00_U_WT001P_white_02")
    await loadPrototype("unit3hp")
    const cardA: Card = {
        id: "cardA",
        protoID: "179901_00_U_WT001P_white_02"
    }
    const cardB: Card = {
        id: "cardB",
        protoID: "unit3hp"
    }
    let ctx = createGameState()
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), [cardA]) as GameState

    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "Gゾーン"), repeat("unit3hp", 6)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "配備エリア"), repeat("unit3hp", 6)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "戦闘エリア1"), repeat("unit3hp", 6)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国"), repeat("179901_00_U_WT001P_white_02", 6)) as GameState

    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "Gゾーン"), repeat("unit3hp", 6)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "配備エリア"), repeat("unit3hp", 6)) as GameState
    ctx = addCards(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), [cardB]) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1"), repeat("unit3hp", 6)) as GameState
    ctx = createCardWithProtoIds(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア2"), repeat("unit3hp", 6)) as GameState

    ctx = setActivePlayerID(ctx, PlayerA) as GameState
    ctx = setPhase(ctx, ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]) as GameState
    ctx = checkIsBattle(ctx) as GameState
    // 制造破壞
    let [newCtx, newPower] = doBattleDamage(ctx, PlayerA, getBattleGroup(ctx, AbsoluteBaSyouFn.of(PlayerB, "戦闘エリア1")), 3)
    ctx = newCtx
    ctx = doCutInDestroyEffectsAndClear(ctx)
    if (getCutInDestroyEffects(ctx).find(effect => EffectFn.getCardID(effect) != cardB.id)) {
        throw new Error()
    }
    let effects = createPlayEffects(ctx, PlayerA)
    if (effects.length != 2) {
        throw new Error()
    }
    if (isBattle(ctx, cardA.id, cardB.id) != true) {
        throw new Error()
    }
    const tip = createTipByEntitySearch(ctx, cardA.id, {
        isBattleWithThis: true,
        isDestroy: true,
        side: "敵軍",
        is: ["ユニット"],
        min: 1,
    })
    if (TipFn.getWant(tip).length != 1) {
        throw new Error()
    }
    // 依序發動以下
    // 內文 => 紅利 => 範兵
    for (const effect of effects) {
        ctx = setTipSelectionForUser(ctx, effect, 0, 0)
        ctx = doEffect(ctx, effect, 0, 0)
        // 為了測試，這裡直接將破壞效果推入堆疊，正常流程不這樣做
        ctx = doCutInDestroyEffectsAndClear(ctx)
        // 這裡的for迴圈會把所有破壞效果執行完畢，所以破壞的機體都到墓地了
        for (let i = 0; i < 10; ++i) {
            const effect2 = getTopEffect(ctx)
            if (effect2) {
                ctx = setTipSelectionForUser(ctx, effect2, 0, 0)
                ctx = doEffect(ctx, effect2, 0, 0)
                // 為了測試，這裡直接將破壞效果推入堆疊，正常流程不這樣做
                ctx = doCutInDestroyEffectsAndClear(ctx)
                ctx = removeEffect(ctx, effect2.id) as GameState
            }
        }
    }
    // 紅利效果 先暫時不測
    // if (BattlePointFn.eq(getSetGroupBattlePoint(ctx, cardA.id), [8, 5, 7]) != true) {
    //     throw new Error()
    // }
    if (getItemIdsByBasyou(ctx, AbsoluteBaSyouFn.of(PlayerB, "ジャンクヤード")).length != 3) {
        throw new Error()
    }
}