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
        if (reason) {
            if (getItemState(ctx, itemId).destroyReason) {
                throw new TargetMissingError(`already destroy: ${itemId}`, {})
            }
        } else {
            if (getItemState(ctx, itemId).destroyReason == null) {
                throw new TargetMissingError(`not destroy: ${itemId}`, {})
            }
            if (getItemState(ctx, itemId).destroyReason?.id == "マイナスの戦闘修正") {
                throw new Error(`マイナスの戦闘修正的破壞不能被選到`)
            }
        }
        // const isDestroyEffect = getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == itemId)
        // if (reason) {
        //     if (isDestroyEffect) {
        //         throw new TargetMissingError(`already destroy: ${itemId}`, {})
        //     }
        // } else {
        //     if (isDestroyEffect == null) {
        //         throw new TargetMissingError(`not destroy: ${itemId}`, {})
        //     }
        //     ctx = mapItemState(ctx, itemId, is => {
        //         if (is.destroyReason?.id == "マイナスの戦闘修正") {
        //             throw new Error(`マイナスの戦闘修正的破壞不能被選到`)
        //         }
        //         return { ...is, destroyReason: null }
        //     }) as GameState
        // }
    }

    if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
        // 自己包含子樹全部破壞，自己的檢查在上方，以下的檢查是用子樹的標準
        getSetGroupChildren(ctx, itemId).forEach(setGroupId => {
            // 注意：從切入的堆疊取得破壞效果(stackEffects)，而不是從破壞陣列(destroyEffects)
            const isDestroyEffect = getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == setGroupId)
            if (reason) {
                // 略過已被破壞的
                // if (isDestroyEffect) {
                //     return
                // }
                if (getItemState(ctx, setGroupId).destroyReason) {
                    return
                }
                // 設定為破壞狀態
                ctx = mapItemState(ctx, setGroupId, is => {
                    return { ...is, destroyReason: reason }
                }) as GameState
                // 先將效果放入破壞陣列(destroyEffects)，會在流程中將破壞陣列切入到堆疊中(stackEffects)
                ctx = addDestroyEffect(ctx, createDestroyEffect(ctx, reason, setGroupId)) as GameState
            } else {
                // if (isDestroyEffect) {
                // 略過マイナスの戦闘修正，不能破壞無效，但因為在子樹裡，不必理會這種情況
                if (getItemState(ctx, setGroupId).destroyReason?.id == "マイナスの戦闘修正") {
                    return
                }
                ctx = mapItemState(ctx, setGroupId, is => {
                    return { ...is, destroyReason: null }
                }) as GameState
                if (isDestroyEffect) {
                    // 將切入堆疊(stackEffects)中的「破壞而廢棄」效果移除
                    ctx = removeEffect(ctx, isDestroyEffect.id) as GameState
                }
                // } else {
                //     // 本來就沒被破壞，不做任何事
                // }
            }
        })
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
        if (getSetGroupRoot(ctx, cardId) != cardId) {
            return
        }
        const runtimeCate = getItemRuntimeCategory(ctx, cardId)
        if (runtimeCate == "ACE" || runtimeCate == "ユニット") {

        } else {
            return
        }
        const [_, _2, hp] = getSetGroupBattlePoint(ctx, cardId)
        if (hp <= 0) {
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

