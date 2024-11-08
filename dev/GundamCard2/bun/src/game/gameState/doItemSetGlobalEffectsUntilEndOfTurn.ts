import { Effect } from "../define/Effect"
import { GameExtParams } from "../define/GameExtParams"
import { GlobalEffect } from "../define/GlobalEffect"
import { ItemStateFn } from "../define/ItemState"
import { StrBaSyouPair } from "../define/Tip"
import { assertTargetMissingError } from "./assertTargetMissingError"
import { GameState } from "./GameState"
import { getItemState, setItemState } from "./ItemStateComponent"
import { isCard, isChip, getItemBaSyou, isCoin } from "./ItemTableComponent"

export function doItemSetGlobalEffectsUntilEndOfTurn(ctx: GameState, effect: Effect, egs: GlobalEffect[], [itemId, originBasyou]: StrBaSyouPair, options: GameExtParams): GameState {
  assertTargetMissingError(ctx, effect, [itemId, originBasyou], options)
  return doItemSetGlobalEffectsUntilEndOfTurnBasic(ctx, egs, itemId)
}

export function doItemSetGlobalEffectsUntilEndOfTurnBasic(ctx: GameState, egs: GlobalEffect[], itemId: string): GameState {
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

export function doItemSetGlobalEffectsUntilEndOfStep(ctx: GameState, effect: Effect, egs: GlobalEffect[], [itemId, originBasyou]: StrBaSyouPair, options: GameExtParams): GameState {
  assertTargetMissingError(ctx, effect, [itemId, originBasyou], options)
  return doItemSetGlobalEffectsUntilEndOfStepBasic(ctx, egs, itemId)
}

export function doItemSetGlobalEffectsUntilEndOfStepBasic(ctx: GameState, egs: GlobalEffect[], itemId: string): GameState {
  if (isCard(ctx, itemId) || isChip(ctx, itemId)) {
    let cs = getItemState(ctx, itemId)
    for (const eg of egs) {
      cs = ItemStateFn.setGlobalEffect(cs, null, eg, { isRemoveOnStepEnd: true })
    }
    ctx = setItemState(ctx, itemId, cs) as GameState
    return ctx
  }
  if (isCoin(ctx, itemId)) {
    throw new Error(`coin can not doItemSetGlobalEffectsUntilEndOfStep: ${itemId}`)
  }
  throw new Error(`doItemSetGlobalEffectsUntilEndOfStep unknown item: ${itemId}`)
}