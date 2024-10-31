import { Bridge } from "../../script/bridge"
import { DestroyReason, Effect, EffectFn } from "../define/Effect"
import { ToolFn } from "../tool"
import { EffectStackComponent, addDestroyEffect } from "./EffectStackComponent"
import { GameState } from "./GameState"
import { getItemStateValues } from "./ItemStateComponent"
import { getItemController, getItemPrototype } from "./ItemTableComponent"
import { getSetGroupBattlePoint } from "./setGroup"

export function createDestroyEffect(ctx: GameState, reason: DestroyReason, cardId: string): Effect {
  // 破壞效果的effectId必須是唯一但又不是亂數, 因為會重復叫用
  const effect: Effect = {
    id: `createDestroyEffect_${cardId}`,
    reason: ["Destroy", reason.playerID, cardId, reason],
    text: {
      id: `createDestroyEffect_text_${cardId}`,
      title: [],
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const cardOwner = GameStateFn.getItemOwner(ctx, cardId)
                ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.of(cardOwner, "ジャンクヤード"), [cardId, GameStateFn.getItemBaSyou(ctx, cardId)], { isSkipTargetMissing: true }) as GameState
                ctx = GameStateFn.mapItemState(ctx, cardId, is => {
                  return {
                    ...is,
                    damage: 0,
                  }
                }) as GameState
                return ctx
              }.toString(),
            }
          ]
        }
      ]
    }
  }
  return effect
}