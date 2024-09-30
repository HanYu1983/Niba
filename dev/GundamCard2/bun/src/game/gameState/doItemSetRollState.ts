import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { CardFn } from "../define/Card"
import { ChipFn } from "../define/Chip"
import { TargetMissingError, TipError } from "../define/GameError"
import { StrBaSyouPair } from "../define/Tip"
import { getCard, setCard } from "./CardTableComponent"
import { getChip, setChip } from "./ChipTableComponent"
import { GameState } from "./GameState"
import { ItemTableComponent, assertTargetMissingError, isCard, isChip, getItemBaSyou } from "./ItemTableComponent"
import { getSetGroup, getSetGroupChildren } from "./SetGroupComponent"

export function doItemSetRollState(ctx: GameState, isRoll: boolean, [itemId, originBasyou]: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
  if(options?.isSkipTargetMissing){
    
  } else {
    assertTargetMissingError(ctx, [itemId, originBasyou])
  }
  const itemIds = getSetGroup(ctx, itemId)
  ctx = itemIds.reduce((ctx, itemId) => {
    if (isCard(ctx, itemId)) {
      let item = getCard(ctx, itemId)
      if(options?.isSkipTargetMissing){
    
      } else {
        if (item.isRoll == isRoll) {
          throw new TargetMissingError(`card already isRoll: ${item.isRoll}: ${item.id}`)
        }
      }
      item = CardFn.setIsRoll(item, isRoll)
      ctx = setCard(ctx, itemId, item) as GameState
      return ctx
    }
    if (isChip(ctx, itemId)) {
      let item = getChip(ctx, itemId)
      if(options?.isSkipTargetMissing){
    
      } else {
        if (item.isRoll == isRoll) {
          throw new TargetMissingError(`chip already isRoll: ${item.isRoll}: ${item.id}`)
        }
      }
      item = ChipFn.setIsRoll(item, isRoll)
      ctx = setChip(ctx, itemId, item) as GameState
      return ctx
    }
    return ctx
  }, ctx)
  return ctx
}