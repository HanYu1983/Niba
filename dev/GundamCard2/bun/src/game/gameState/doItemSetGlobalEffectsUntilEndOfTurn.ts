import { GlobalEffect } from "../define/GlobalEffect"
import { ItemStateFn } from "../define/ItemState"
import { StrBaSyouPair } from "../define/Tip"
import { GameState } from "./GameState"
import { getItemState, setItemState } from "./ItemStateComponent"
import { isCard, isChip, getItemBaSyou, isCoin, assertTargetMissingError } from "./ItemTableComponent"

export function doItemSetGlobalEffectsUntilEndOfTurn(ctx: GameState, egs: GlobalEffect[], [itemId, originBasyou]: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
  if (options?.isSkipTargetMissing) {

  } else {
    assertTargetMissingError(ctx, [itemId, originBasyou])
  }
  if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
    let cs = getItemState(ctx, itemId)
    for (const eg of egs) {
      cs = ItemStateFn.setGlobalEffect(cs, null, eg, { isRemoveOnTurnEnd: true })
    }
    ctx = setItemState(ctx, itemId, cs) as GameState
    return ctx
  }
  if (isCoin(ctx, itemId)) {
    throw new Error(`coin can not doItemSetGlobalEffectsUntilEndOfTurn: ${itemId}`)
  }
  throw new Error(`doItemSetGlobalEffectsUntilEndOfTurn unknown item: ${itemId}`)
}