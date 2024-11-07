import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { Effect, EffectFn } from "../define/Effect";
import { TargetMissingError } from "../define/GameError";
import { GameExtParams } from "../define/GameExtParams";
import { ItemStateFn } from "../define/ItemState";
import { PlayerID } from "../define/PlayerID";
import { StrBaSyouPair } from "../define/Tip";
import { assertTargetMissingError, assertTargetNoLongerValid } from "./assertTargetMissingError";
import { getItemRuntimeCategory } from "./card";
import { createDestroyEffect } from "./createDestroyEffect";
import { doTriggerEvent } from "./doTriggerEvent";
import { addDestroyEffect } from "./EffectStackComponent";
import { GameState } from "./GameState";
import { getGlobalEffects, setGlobalEffects } from "./globalEffects";
import { getItemState, setItemState } from "./ItemStateComponent";
import { isCard, isChip, getItemController } from "./ItemTableComponent";
import { getSetGroupBattlePoint } from "./setGroup";


export function doItemDamage(ctx: GameState, effect: Effect, damage: number, target: StrBaSyouPair, options: GameExtParams): GameState {
  assertTargetMissingError(ctx, effect, target, options)
  return doItemDamageBasic(ctx, effect, damage, target[0], options)
}

export function doItemDamageBasic(ctx: GameState, effect: Effect, damage: number, targetItemId: string, options: GameExtParams): GameState {
  const effectController = EffectFn.getPlayerID(effect)
  {
    // damage修正
    const adj = (options.ges || []).map(ge => {
      if (ge.title[0] == "このカードが受ける全ての_通常ダメージは、_２減殺される" && ge.title[1] == "通常ダメージ") {
        if (ge.cardIds.includes(targetItemId)) {
          return -ge.title[2]
        }
      }
      return 0
    }).reduce((a, b) => a + b, 0)
    damage += adj
    damage = Math.max(0, damage)
  }
  if (isCard(ctx, targetItemId) || isChip(ctx, targetItemId)) {
    let cardState = getItemState(ctx, targetItemId);
    cardState = ItemStateFn.damage(cardState, damage)
    ctx = setItemState(ctx, targetItemId, cardState) as GameState
    ctx = doTriggerEvent(ctx, { title: ["ユニットがダメージを受けた場合"], cardIds: [targetItemId], effect: effect }, options)
    const [_, _2, hp] = getSetGroupBattlePoint(ctx, targetItemId, options)
    if (hp <= cardState.damage) {
      const effect: Effect = createDestroyEffect(ctx, { id: "通常ダメージ", playerID: effectController }, targetItemId)
      ctx = addDestroyEffect(ctx, effect) as GameState
    }
    return ctx
  }
  throw new Error(`doItemDamage unknown item: ${targetItemId}`)
}