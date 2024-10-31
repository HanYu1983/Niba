import { Effect, EffectFn } from "../define/Effect"
import { TargetMissingError } from "../define/GameError"
import { GameExtParams } from "../define/GameExtParams"
import { getItemRuntimeCategory } from "./card"
import { GameState } from "./GameState"
import { getGlobalEffects, setGlobalEffects } from "./globalEffects"
import { getItemController } from "./ItemTableComponent"

export function assertTargetNoLongerValidAndUpdate(ctx: GameState, effect: Effect, cardId: string, options: GameExtParams) {
  const ges = options.ges || []
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
  // 179009_03B_C_RD015C_red
  // C
  // UC
  // 狂信的な崇拝者
  // 対抗
  // （常時）：自軍ユニット１枚、または、プレイされている自軍ユニット１枚は、カット終了時まで敵軍ユニットの効果の対象にならない。
}

