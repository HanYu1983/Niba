import { TableFns } from "../../tool/table"
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou"
import { DestroyReason } from "../define/Effect"
import { GameEvent } from "../define/GameEvent"
import { StrBaSyouPair } from "../define/Tip"
import { getCard, setCard } from "./CardTableComponent"
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
        ctx = mapItemState(ctx, itemId, is => {
            if (reason == null) {
                if (is.destroyReason?.id == "マイナスの戦闘修正") {
                    throw new Error(`マイナスの戦闘修正的破壞不能被選到`)
                    //return is
                }
                return { ...is, destroyReason: null }
            }
            return { ...is, destroyReason: reason }
        }) as GameState
        return ctx
    }
    if (isCoin(ctx, itemId)) {
        throw new Error(`coin can not move: ${itemId}`)
    }
    throw new Error(`moveItem unknown item: ${itemId}`)
}