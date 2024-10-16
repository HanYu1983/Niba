import { logCategory } from "../../tool/logger"
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
  // 整個setGroup都要一起
  const itemIds = getSetGroup(ctx, itemId)
  ctx = itemIds.reduce((ctx, willRollItemId) => {
    if (isCard(ctx, willRollItemId)) {
      let willRollItem = getCard(ctx, willRollItemId)
      logCategory("doItemSetRollState", "willRollItemId", itemId, willRollItemId, isRoll, !!(willRollItem.isRoll), isRoll == willRollItem.isRoll)
      if(options?.isSkipTargetMissing){
    
      } else {
        // 只判斷自身有沒有違規
        if (willRollItem.id == itemId && !!(willRollItem.isRoll) == isRoll) {
          throw new TargetMissingError(`card already isRoll: ${willRollItem.isRoll}: ${willRollItem.id}`)
        }
      }
      willRollItem = CardFn.setIsRoll(willRollItem, isRoll)
      ctx = setCard(ctx, willRollItemId, willRollItem) as GameState
      return ctx
    }
    if (isChip(ctx, willRollItemId)) {
      let willRollItem = getChip(ctx, willRollItemId)
      if(options?.isSkipTargetMissing){
    
      } else {
        // 只判斷自身有沒有違規
        if (willRollItem.id == itemId && !!(willRollItem.isRoll) == isRoll) {
          throw new TargetMissingError(`chip already isRoll: ${willRollItem.isRoll}: ${willRollItem.id}`)
        }
      }
      willRollItem = ChipFn.setIsRoll(willRollItem, isRoll)
      ctx = setChip(ctx, willRollItemId, willRollItem) as GameState
      return ctx
    }
    return ctx
  }, ctx)
  return ctx
}