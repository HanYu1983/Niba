import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { Effect } from "../define/Effect";
import { TargetMissingError } from "../define/GameError";
import { ItemStateFn } from "../define/ItemState";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair } from "../define/Tip";
import { createDestroyEffect } from "./createDestroyEffect";
import { addDestroyEffect } from "./EffectStackComponent";
import { GameState } from "./GameState";
import { getGlobalEffects, setGlobalEffects } from "./globalEffects";
import { getItemState, setItemState } from "./ItemStateComponent";
import { isCard, isChip, getItemBaSyou, assertTargetMissingError } from "./ItemTableComponent";
import { getSetGroupBattlePoint } from "./setGroup";

export function doItemDamage(ctx: GameState, playerId: PlayerID, damage: number, target: StrBaSyouPair, options?: { isSkipTargetMissing?: boolean }): GameState {
  if (options?.isSkipTargetMissing) {

  } else {
    assertTargetMissingError(ctx, target)
  }
  {
    // damage修正
    const ges = getGlobalEffects(ctx, null)
    ctx = setGlobalEffects(ctx, null, ges)
    const adj = ges.map(ge => ge.title[0] == "このカードが受ける全ての_通常ダメージは、_２減殺される" && ge.title[1] == "通常ダメージ" ? -ge.title[2] : 0).reduce((a, b) => a + b, 0)
    damage += adj
    damage = Math.max(0, damage)
  }
  const [targetItemId, targetOriginBasyou] = target
  if (isCard(ctx, targetItemId) || isChip(ctx, targetItemId)) {
    let cardState = getItemState(ctx, targetItemId);
    cardState = ItemStateFn.damage(cardState, damage)
    ctx = setItemState(ctx, targetItemId, cardState) as GameState
    const [_, _2, hp] = getSetGroupBattlePoint(ctx, targetItemId)
    if (hp <= cardState.damage) {
      const effect: Effect = createDestroyEffect(ctx, { id: "通常ダメージ", playerID: playerId }, targetItemId)
      ctx = addDestroyEffect(ctx, effect) as GameState
    }
    return ctx
  }
  throw new Error(`doItemDamage unknown item: ${targetItemId}`)
}