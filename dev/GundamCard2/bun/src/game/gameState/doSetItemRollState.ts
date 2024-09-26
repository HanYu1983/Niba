import { AbsoluteBaSyouFn } from "../define/BaSyou"
import { CardFn } from "../define/Card"
import { ChipFn } from "../define/Chip"
import { TargetMissingError } from "../define/GameError"
import { StrBaSyouPair } from "../define/Tip"
import { getCard, setCard } from "./CardTableComponent"
import { getChip, setChip } from "./ChipTableComponent"
import { GameState } from "./GameState"
import { ItemTableComponent, assertTargetMissingError, isCard, isChip, getItemBaSyou } from "./ItemTableComponent"
import { getSetGroupChildren } from "./SetGroupComponent"

export function doSetItemRollState(ctx: GameState, isRoll: boolean, [itemId, originBasyou]: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
    if (options?.isSkipTargetMissing) {
  
    } else {
      assertTargetMissingError(ctx, [itemId, originBasyou])
    }
    if (isCard(ctx, itemId)) {
      const itemIds = getSetGroupChildren(ctx, itemId)
      ctx = itemIds.reduce((ctx, itemId) => {
        if (isCard(ctx, itemId)) {
          let item = getCard(ctx, itemId)
          if (item.isRoll == isRoll) {
            throw new Error(`card already roll: ${item.id}`)
          }
          item = CardFn.setIsRoll(item, isRoll)
          ctx = setCard(ctx, itemId, item) as GameState
          return ctx
        }
        if (isChip(ctx, itemId)) {
          let item = getChip(ctx, itemId)
          if (item.isRoll == isRoll) {
            throw new Error(`chip already roll: ${item.id}`)
          }
          item = ChipFn.setIsRoll(item, isRoll)
          ctx = setChip(ctx, itemId, item) as GameState
          return ctx
        }
        return ctx
      }, ctx)
      return ctx
    }
    if (isChip(ctx, itemId)) {
      const nowBasyou = getItemBaSyou(ctx, itemId)
      if (AbsoluteBaSyouFn.eq(nowBasyou, originBasyou) == false) {
        throw new TargetMissingError(`target missing: ${itemId} from ${originBasyou}`)
      }
      let item = getChip(ctx, itemId)
      item = ChipFn.setIsRoll(item, isRoll)
      ctx = setChip(ctx, itemId, item) as GameState
      return ctx
    }
    throw new Error(`setItemIsRoll unknown item: ${itemId}`)
  }