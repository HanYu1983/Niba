import { TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou"
import { DestroyReason, Effect, EffectFn } from "../define/Effect"
import { GameError, TargetMissingError } from "../define/GameError"
import { GameEvent } from "../define/GameEvent"
import { StrBaSyouPair } from "../define/Tip"
import { getCard, setCard } from "./CardTableComponent"
import { createDestroyEffect } from "./createDestroyEffect"
import { getEffects, isStackEffect, getEffect, getCutInDestroyEffects, removeEffect, addDestroyEffect } from "./EffectStackComponent"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { clearGlobalEffects, getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemState, getItemStateValues, mapItemState } from "./ItemStateComponent"
import { ItemTableComponent, isCard, isChip, getItemBaSyou, isCoin, getItemController, assertTargetMissingError, getItemIdsByBasyou } from "./ItemTableComponent"
import { getSetGroupBattlePoint } from "./setGroup"
import { getSetGroupChildren, getSetGroupRoot } from "./SetGroupComponent"
import { doTriggerEvent } from "./doTriggerEvent"
import { getRuntimeBattleArea } from "./RuntimeBattleAreaComponent"
import { getItemRuntimeCategory } from "./card"

export function doItemSetDestroy(ctx: GameState, reason: DestroyReason | null, [itemId, from]: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
    if (options?.isSkipTargetMissing) {

    } else {
        assertTargetMissingError(ctx, [itemId, from])
    }
    if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
        const isDestroyEffect = getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == itemId)
        if (reason) {
            if (isDestroyEffect) {
                if (options?.isSkipTargetMissing) {

                } else {
                    throw new TargetMissingError(`already destroy: ${itemId}`, {})
                }
            }
            // 設定為破壞狀態, 破壞而廢棄的效果還沒進堆疊
            ctx = mapItemState(ctx, itemId, is => {
                return { ...is, destroyReason: reason }
            }) as GameState
            ctx = addDestroyEffect(ctx, createDestroyEffect(ctx, reason, itemId)) as GameState
        } else {
            if (isDestroyEffect == null) {
                throw new TargetMissingError(`not destroy: ${itemId}`, {})
            }
            // 破壞無效要將堆疊中的破壞而廢棄效果移除
            ctx = removeEffect(ctx, isDestroyEffect.id) as GameState
            ctx = mapItemState(ctx, itemId, is => {
                if (is.destroyReason?.id == "マイナスの戦闘修正") {
                    throw new Error(`マイナスの戦闘修正的破壞不能被選到`)
                }
                return { ...is, destroyReason: null }
            }) as GameState
        }

        return ctx
    }
    if (isCoin(ctx, itemId)) {
        throw new Error(`coin can not move: ${itemId}`)
    }
    throw new Error(`moveItem unknown item: ${itemId}`)
}

export function createMinusDestroyEffectAndPush(ctx: GameState): GameState {
    // 將所有破壞效果加入破壞用堆疊
    // 加入破壞用堆疊後，主動玩家就必須決定解決順序
    // 決定後，依順序將所有效果移到正在解決中的堆疊，並重設切入的旗標，讓玩家可以在堆疊解決中可以再次切入
    AbsoluteBaSyouFn.getBaAll().flatMap(basyou => getItemIdsByBasyou(ctx, basyou)).forEach(cardId => {
        if (EffectFn.isFakeCardID(cardId)) {
            return ctx
        }
        const cs = getItemState(ctx, cardId)
        if (getSetGroupRoot(ctx, cardId) == cardId) {
            return
        }
        const runtimeCate = getItemRuntimeCategory(ctx, cardId)
        if (runtimeCate == "ACE" || runtimeCate == "ユニット") {

        } else {
            return
        }
        const [_, _2, hp] = getSetGroupBattlePoint(ctx, cardId)
        if (hp <= cs.damage) {
            const destroyReason: DestroyReason = {
                id: "マイナスの戦闘修正",
                playerID: getItemController(ctx, cs.id)
            }
            const effect: Effect = createDestroyEffect(ctx, destroyReason, cs.id)
            ctx = addDestroyEffect(ctx, effect) as GameState
            return ctx
        }
        return ctx
    })
    return ctx
}

