
// 179025_07D_CH_WT075C_white
// リリーナ・ピースクラフト
// 女性　子供　別名「リリーナ・ドーリアン」
// 【ステイ】
// 『起動』：このカードがプレイされて場にセットされた場合、カード１枚を引く。
// 『起動』：自軍本国に戦闘ダメージが与えられた場合、カード１枚を引く事ができる。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { EffectFn, type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードがプレイされて場にセットされた場合、カード１枚を引く。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "プレイされて場にセットされた場合" && evt.cardIds?.includes(cardId)) {
          ctx = GameStateFn.doPlayerDrawCard(ctx, 1, cardController, Options)
        }
        return ctx
      }.toString()
    },
    {
      id: "",
      description: "『起動』：自軍本国に戦闘ダメージが与えられた場合、カード１枚を引く事ができる。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "自軍本国に戦闘ダメージが与えられた場合" && evt.playerId == cardController) {
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
