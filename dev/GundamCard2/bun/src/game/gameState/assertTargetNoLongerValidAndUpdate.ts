import { Effect, EffectFn } from "../define/Effect"
import { TargetMissingError } from "../define/GameError"
import { getItemRuntimeCategory } from "./card"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemController } from "./ItemTableComponent"

export function assertTargetNoLongerValidAndUpdate(ctx: GameState, effect: Effect, cardId: string): GameState {
  const ges = getGlobalEffects(ctx, null)
  ctx = setGlobalEffects(ctx, null, ges)
  if (ges.find(ge => ge.title[0] == "敵軍効果の対象にならない" && ge.cardIds.includes(cardId))) {
    if (EffectFn.getPlayerID(effect) != getItemController(ctx, cardId)) {
      throw new TargetMissingError("敵軍効果の対象にならない")
    }
  }
  if (ges.find(ge => ge.title[0] == "敵軍ユニットの効果の対象にならない" && ge.cardIds.includes(cardId))) {
    if (EffectFn.getPlayerID(effect) != getItemController(ctx, cardId) && getItemRuntimeCategory(ctx, EffectFn.getCardID(effect)) == "ユニット") {
      throw new TargetMissingError("敵軍効果の対象にならない")
    }
  }
  return ctx
}