import { Bridge } from "../../script/bridge"
import { DestroyReason, Effect } from "../define/Effect"
import { ToolFn } from "../tool"
import { GameState } from "./GameState"

export function getDestroyEffect(ctx: GameState, reason: DestroyReason, cardId: string): Effect {
    const effect: Effect = {
      id: ToolFn.getUUID("getDestroyEffect"),
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