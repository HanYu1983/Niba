// 179015_04B_U_BK061C_black
// C
// Z
// ジム・スナイパーⅢ
// ジム系　MS　T3部隊
// 『起動』：このカードが場に出た場合、敵軍本国に１ダメージ、または、敵軍ユニット１枚に２ダメージを与える。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、敵軍本国に１ダメージ、または、敵軍ユニット１枚に２ダメージを与える。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect,{
            conditions: {
              "敵軍ユニット１枚": {
                title: ["_自軍_ユニット_１枚", "敵軍", "ユニット", 1],
                actions: [
                  {
                    title: ["_１ダメージを与える", 2],
                    vars: ["敵軍ユニット１枚"]
                  }
                ]
              },
              "敵軍本国": {
                actions: [
                  {
                    title: ["_敵軍本国に_１ダメージ", "敵軍", 1]
                  }
                ]
              }
            },
            logicTreeAction:{
              logicTree: {
                type: "Or",
                children: [
                  {
                    type: "Leaf",
                    value: "敵軍ユニット１枚"
                  },
                  {
                    type: "Leaf",
                    value: "敵軍本国"
                  }
                ]
              },
              actions: []
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
