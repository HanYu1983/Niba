import { Bridge } from "../../script/bridge"
import { DestroyReason, Effect, EffectFn } from "../define/Effect"
import { ToolFn } from "../tool"
import { EffectStackComponent, addDestroyEffect } from "./EffectStackComponent"
import { GameState } from "./GameState"
import { getItemStateValues } from "./ItemStateComponent"
import { getItemController } from "./ItemTableComponent"
import { getSetGroupBattlePoint } from "./setGroup"

export function createDestroyEffect(ctx: GameState, reason: DestroyReason, cardId: string): Effect {
  const effect: Effect = {
    id: ToolFn.getUUID("createDestroyEffect"),
    reason: ["Destroy", reason.playerID, cardId, reason],
    text: {
      id: `Destroy_card_${cardId}`,
      title: [],
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const cardOwner = GameStateFn.getItemOwner(ctx, cardId)
                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardOwner, "ジャンクヤード"), [cardId, GameStateFn.getItemBaSyou(ctx, cardId)], { isSkipTargetMissing: true })
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