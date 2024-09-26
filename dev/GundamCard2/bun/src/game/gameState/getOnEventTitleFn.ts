import { CardText, OnEventFn, CardTextFn } from "../define/CardText";
import { Effect, EffectFn } from "../define/Effect";
import { PhaseFn } from "../define/Timing";
import { GameState } from "./GameState";
import { getActionTitleFn } from "./getActionTitleFn";

export function getOnEventTitleFn(text: CardText): OnEventFn {
    if (text.onEvent == null || typeof text.onEvent == "string") {
      return CardTextFn.getOnEventFn(text)
    }
    switch (text.onEvent[0]) {
      case "GameEventOnTimingDoAction": {
        const [_, timing, action] = text.onEvent;
        return function (ctx: GameState, effect: Effect): GameState {
          const event = EffectFn.getEvent(effect)
          if (event.title[0] == "GameEventOnTiming" && PhaseFn.eq(event.title[1], timing)) {
            return getActionTitleFn(action)(ctx, effect, null)
          }
          return ctx
        }
      }
    }
  }