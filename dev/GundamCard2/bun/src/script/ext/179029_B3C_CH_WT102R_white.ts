// 179029_B3C_CH_WT102R_white
// ルイン・リー
// 男性　子供　別名「マスク」
// 高機動
// 『起動』：自軍「マニィ・アンバサダ」が場に出た、または自軍「マニィ・アンバサダ」がいる状態で、このカードが場に出た場合、G以外の敵軍カード１枚を破壊する。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：自軍「マニィ・アンバサダ」が場に出た、または自軍「マニィ・アンバサダ」がいる状態で、このカードが場に出た場合、G以外の敵軍カード１枚を破壊する。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if ((
          evt.title[0] == "このカードが場に出た場合"
          && (
            evt.cardIds?.some(cardId => GameStateFn.getItemController(ctx, cardId) == cardController && GameStateFn.getItemPrototype(ctx, cardId).title == "マニィ・アンバサダ"))
          || (
            DefineFn.TipFn.createTipErrorWhenCheckFail(GameStateFn.createTipByEntitySearch(ctx, effect, {
              atBa: true,
              side: "自軍",
              title: ["マニィ・アンバサダ"],
              min: 1
            }, {ges: Options.ges})) == null
            && evt.cardIds?.includes(cardId)
          )
        )) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "G以外の敵軍カード１枚": {
                title: ["Entity", {
                  atBa: true,
                  side: "敵軍",
                  is: DefineFn.CardCategoryFn.createRemaining(["グラフィック"]),
                  count: 1,
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_ロールする", "破壞"],
                  vars: ["G以外の敵軍カード１枚"]
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
