// 179029_B3C_CH_WT103N_white
// マニィ・アンバサダ
// 女性　子供
// 『起動』：自軍「ルイン・リー」が場に出た、または自軍「ルイン・リー」がいる状態で、このカードが場に出た場合、カード２枚を引く事ができる。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：自軍「ルイン・リー」が場に出た、または自軍「ルイン・リー」がいる状態で、このカードが場に出た場合、カード２枚を引く事ができる。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if ((
          evt.title[0] == "場に出た場合"
          && (
            evt.cardIds?.some(cardId => GameStateFn.getItemController(ctx, cardId) == cardController && GameStateFn.getItemPrototype(ctx, cardId).title == "ルイン・リー"))
          || (
            DefineFn.TipFn.createTipErrorWhenCheckFail(GameStateFn.createTipByEntitySearch(ctx, cardId, {
              atBa: true,
              side: "自軍",
              title: ["ルイン・リー"],
              min: 1
            })) == null
            && evt.cardIds?.includes(cardId)
          )
        )) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            logicTreeAction: {
              actions: [
                {
                  title: ["カード_１枚を引く", 2],
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
