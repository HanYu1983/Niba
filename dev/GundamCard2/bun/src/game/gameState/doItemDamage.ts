import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { TargetMissingError } from "../define/GameError";
import { ItemStateFn } from "../define/ItemState";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair } from "../define/Tip";
import { createDestroyEffect } from "./createDestroyEffect";
import { addDestroyEffect } from "./EffectStackComponent";
import { GameState } from "./GameState";
import { getItemState, setItemState } from "./ItemStateComponent";
import { isCard, isChip, getItemBaSyou, assertTargetMissingError } from "./ItemTableComponent";
import { getSetGroupBattlePoint } from "./setGroup";

export function doItemDamage(ctx: GameState, playerId: PlayerID, damage: number, target: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
  if (options?.isSkipTargetMissing) {

  } else {
    assertTargetMissingError(ctx, target)
  }
  const [targetItemId, targetOriginBasyou] = target
  if (isCard(ctx, targetItemId) || isChip(ctx, targetItemId)) {
    let cardState = getItemState(ctx, targetItemId);
    cardState = ItemStateFn.damage(cardState, damage)
    ctx = setItemState(ctx, targetItemId, cardState) as GameState
    const [_, _2, hp] = getSetGroupBattlePoint(ctx, targetItemId)
    if(hp <= cardState.damage){
      const effect: Effect = createDestroyEffect(ctx, {id:"通常ダメージ", playerID: playerId}, targetItemId)
      ctx = addDestroyEffect(ctx, effect) as GameState
    }
    return ctx
  }
  throw new Error(`doItemDamage unknown item: ${targetItemId}`)
}