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
        if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = DefineFn.EffectFn.fromEffectBasic(effect,{
            conditions: {
              "敵軍ユニット１枚": {
                title: ["_自軍_ユニット_１枚", "敵軍", "ユニット", 1],
                actions: [
                  {
                    title: ["_２ダメージを与える", 2],
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
          // ctx = GameStateFn.addImmediateEffect(ctx, {
          //   id: "",
          //   reason: effect.reason,
          //   description: effect.description,
          //   text: {
          //     id: effect.text.id,
          //     description: effect.text.description,
          //     title: [],
          //     conditions: {
          //       "敵軍ユニット１枚": {
          //         title: ["_自軍_ユニット_１枚", "敵軍", "ユニット", 1],
          //         actions: [
          //           {
          //             title: ["_２ダメージを与える", 2],
          //             vars: ["敵軍ユニット１枚"]
          //           }
          //         ]
          //       },
          //       "敵軍本国": {
          //         actions: [
          //           {
          //             title: ["_敵軍本国に_１ダメージ", "敵軍", 1]
          //           }
          //         ]
          //       }
          //     },
          //     logicTreeActions: [
          //       {
          //         logicTree: {
          //           type: "Or",
          //           children: [
          //             {
          //               type: "Leaf",
          //               value: "敵軍ユニット１枚"
          //             },
          //             {
          //               type: "Leaf",
          //               value: "敵軍本国"
          //             }
          //           ]
          //         },
          //         actions: []
          //       }
          //     ]
          //   }
          // }) as GameState
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
