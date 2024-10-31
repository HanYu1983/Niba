import { Bridge } from "../../script/bridge";
import { CardText, OnEventFn, CardTextFn } from "../define/CardText";
import { Effect, EffectFn } from "../define/Effect";
import { GameExtParams } from "../define/GameExtParams";
import { GlobalEffect } from "../define/GlobalEffect";
import { PhaseFn } from "../define/Timing";
import { GameState } from "./GameState";
import { createActionTitleFn } from "./createActionTitleFn";

export function createOnEventTitleFn(text: CardText): OnEventFn {
  if (text.onEvent == null || typeof text.onEvent == "string") {
    return CardTextFn.getOnEventFn(text)
  }
  switch (text.onEvent[0]) {
    case "GameEventOnTimingDoAction": {
      const [_, timing, action] = text.onEvent;
      return function (ctx: GameState, effect: Effect, bridge: Bridge): GameState {
        const event = EffectFn.getEvent(effect)
        if (event.title[0] == "GameEventOnTiming" && PhaseFn.eq(event.title[1], timing)) {
          return createActionTitleFn(action)(ctx, effect, bridge)
        }
        return ctx
      }
    }
  }
}