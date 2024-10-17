// 179027_09D_O_WT014N_white
// N
// Gのレコンギスタ
// 月から来た者
// 補強
// 『起動』：敵軍カードが場から離れた場合、カード１枚を引く事ができる。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { EffectFn, type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：敵軍カードが場から離れた場合、カード１枚を引く事ができる。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "カードが場から離れた場合" && evt.cardIds?.some(cardId => GameStateFn.getItemController(ctx, cardId) != cardController)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            logicTreeAction: {
              actions: [
                {
                  title: ["カード_１枚を引く", 1]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString()
    }
  ],
};
