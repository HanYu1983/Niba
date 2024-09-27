import { TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou"
import { DestroyReason, Effect, EffectFn } from "../define/Effect"
import { GameError } from "../define/GameError"
import { GameEvent } from "../define/GameEvent"
import { StrBaSyouPair } from "../define/Tip"
import { getCard, setCard } from "./CardTableComponent"
import { createDestroyEffect } from "./createDestroyEffect"
import { getEffects, isStackEffect, getEffect, getCutInDestroyEffects, removeEffect, addDestroyEffect } from "./EffectStackComponent"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { clearGlobalEffects, getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemStateValues, mapItemState } from "./ItemStateComponent"
import { ItemTableComponent, isCard, isChip, getItemBaSyou, isCoin, getItemController, assertTargetMissingError } from "./ItemTableComponent"
import { getSetGroupBattlePoint } from "./setGroup"
import { getSetGroupChildren } from "./SetGroupComponent"
import { doTriggerEvent } from "./doTriggerEvent"

export function doItemSetDestroy(ctx: GameState, reason: DestroyReason | null, [itemId, from]: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
    if (options?.isSkipTargetMissing) {

    } else {
        assertTargetMissingError(ctx, [itemId, from])
    }
    if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
        const isDestroyEffect = getCutInDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == itemId)
        if (reason) {
            if (isDestroyEffect) {
                throw new GameError(`already destroy: ${itemId}`, { flags: [] })
            }
            // 設定為破壞狀態, 破壞而廢棄的效果還沒進堆疊
            ctx = mapItemState(ctx, itemId, is => {
                return { ...is, destroyReason: reason }
            }) as GameState
        } else {
            if (isDestroyEffect == null) {
                throw new GameError(`not destroy: ${itemId}`, { flags: [] })
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

export function createDestroyEffectAndPush(ctx: GameState): GameState {
    // 將所有破壞效果加入破壞用堆疊
    // 加入破壞用堆疊後，主動玩家就必須決定解決順序
    // 決定後，依順序將所有效果移到正在解決中的堆疊，並重設切入的旗標，讓玩家可以在堆疊解決中可以再次切入
    return getItemStateValues(ctx).reduce((ctx, cs) => {
        if (EffectFn.isFakeCardID(cs.id)) {
            return ctx
        }
        if (cs.destroyReason) {
            const effect: Effect = createDestroyEffect(ctx, cs.destroyReason, cs.id)
            ctx = addDestroyEffect(ctx, effect) as GameState
            return ctx
        }
        const [_, _2, hp] = getSetGroupBattlePoint(ctx, cs.id)
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
    }, ctx)
}

