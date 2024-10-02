// 179901_00_C_WT003P_white
// 介入行動
// 破壊
// ユニーク
// ＜『起動』：このカードは、Gとして場に出た場合、〔Ｒ〕を支払う事ができる。その場合、敵軍ユニット１枚に３ダメージを与える＞
// （防御ステップ）：戦闘エリアにいる、４以下の防御力を持つ敵軍ユニット１枚を破壊する。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "＜『起動』：このカードは、Gとして場に出た場合、〔Ｒ〕を支払う事ができる。その場合、敵軍ユニット１枚に３ダメージを与える＞",
      title: ["自動型", "起動"],
      isEnabledWhileG: true,
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードがGとして場に出た場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "〔Ｒ〕": {
                actions: [
                  {
                    title: ["_ロールする", "ロール"],
                  }
                ]
              },
              "敵軍ユニット１枚": {
                title: ["Entity", {
                  atBa: true,
                  is: ["ユニット"],
                  count: 1,
                }],
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_１ダメージを与える", 3],
                  vars: ["敵軍ユニット１枚"]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
    }
  ],
  commandText: {
    id: "",
    description: "（防御ステップ）：戦闘エリアにいる、４以下の防御力を持つ敵軍ユニット１枚を破壊する。",
    title: ["使用型", ["防御ステップ"]],
    conditions: {
      "戦闘エリアにいる、４以下の防御力を持つ敵軍ユニット１枚": {
        title: ["Entity", {
          atBa: true,
          side: "敵軍",
          is: ["ユニット"],
          compareBattlePoint: ["防御力", "<=", 4],
          count: 1,
        }]
      },
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [
              {
                title: ["_ロールする", "破壞"]
              }
            ]]
          }
        ]
      }
    ]
  },
};