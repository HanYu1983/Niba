import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { TargetMissingError } from "../define/GameError";
import { ItemStateFn } from "../define/ItemState";
import { StrBaSyouPair } from "../define/Tip";
import { GameState } from "./GameState";
import { getItemState, setItemState } from "./ItemStateComponent";
import { isCard, isChip, getItemBaSyou, assertTargetMissingError } from "./ItemTableComponent";

export function doItemDamage(ctx: GameState, damage: number, target: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
  if (options?.isSkipTargetMissing) {

  } else {
    assertTargetMissingError(ctx, target)
  }
  const [targetItemId, targetOriginBasyou] = target
  if (isCard(ctx, targetItemId) || isChip(ctx, targetItemId)) {
    const nowBasyou = getItemBaSyou(ctx, targetItemId)
    let cardState = getItemState(ctx, targetItemId);
    cardState = ItemStateFn.damage(cardState, damage)
    ctx = setItemState(ctx, targetItemId, cardState) as GameState
    return ctx
  }
  throw new Error(`doItemDamage unknown item: ${targetItemId}`)
}