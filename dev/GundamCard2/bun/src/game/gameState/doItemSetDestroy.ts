import { TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou"
import { DestroyReason, EffectFn } from "../define/Effect"
import { GameError } from "../define/GameError"
import { GameEvent } from "../define/GameEvent"
import { StrBaSyouPair } from "../define/Tip"
import { getCard, setCard } from "./CardTableComponent"
import { getEffects, isStackEffect, getEffect, getDestroyEffects, removeEffect } from "./EffectStackComponent"
import { EventCenterFn } from "./EventCenter"
import { GameState } from "./GameState"
import { clearGlobalEffects, getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { mapItemState } from "./ItemStateComponent"
import { ItemTableComponent, isCard, isChip, getItemBaSyou, isCoin, getItemController, assertTargetMissingError } from "./ItemTableComponent"
import { getSetGroupChildren } from "./SetGroupComponent"
import { triggerEvent } from "./triggerEvent"

export function doItemSetDestroy(ctx: GameState, reason: DestroyReason | null, [itemId, from]: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
    if (options?.isSkipTargetMissing) {

    } else {
        assertTargetMissingError(ctx, [itemId, from])
    }
    if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
        const isDestroyEffect = getDestroyEffects(ctx).find(e => EffectFn.getCardID(e) == itemId)
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

