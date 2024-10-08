// 179028_10D_CH_WT095_white
// R
// W
// ヒイロ・ユイ
// 男性　子供
// 『恒常』：このカードは、自軍ジャンクヤードにある場合、自軍手札にあるカードのようにプレイできる。
// 『恒常』：このカードは、自軍ジャンクヤードにある状態でプレイする場合、セット先として、自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚を、自軍配備エリアにロール状態で出し、このカードをセットできる。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『恒常』：このカードは、自軍ジャンクヤードにある場合、自軍手札にあるカードのようにプレイできる。",
      title: ["自動型", "恒常"],
      onSituation: function _(ctx: GameState, effect: Effect, bridge: Bridge): GlobalEffect[] {
        const { DefineFn, GameStateFn } = bridge
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (GameStateFn.getItemBaSyou(ctx, cardId).value[1] == "ジャンクヤード") {
          return [
            {
              title: ["自軍手札にあるかのようにプレイできる"],
              cardIds: [cardId]
            }
          ]
        }
        return []
      }.toString()
    },
    {
      id: "",
      description: "『恒常』：このカードは、自軍ジャンクヤードにある状態でプレイする場合、セット先として、自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚を、自軍配備エリアにロール状態で出し、このカードをセットできる。",
      title: ["自動型", "恒常"],
    },
  ],
};
