// 179027_09D_C_WT067R_white
// 全門射撃
// 破壊
// （自軍ターン）：任意の枚数の敵軍ユニットに、Xダメージを振り分けて与える。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（自軍ターン）：任意の枚数の敵軍ユニットに、Xダメージを振り分けて与える。",
    title: ["使用型", ["自軍", "ターン"]],
    conditions: {
      // 檢查最少有一機
      "任意の枚数の敵軍ユニット": {
        actions: [
          {
            title: ["Entity", {
              side: "敵軍",
              atBa: true,
              min: 1,
            }],
          }
        ]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
              const cardId = DefineFn.EffectFn.getCardID(effect)
              const prototype = GameStateFn.getItemPrototype(ctx, cardId)
              const colorXKey = GameStateFn.createConditionKeyOfPayColorX(prototype)
              const colorXLength = GameStateFn.getCardTipStrBaSyouPairs(ctx, colorXKey, cardId).length
              const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                conditions: {
                  "任意の枚数の敵軍ユニット": {
                    title: ["Entity", {
                      side: "敵軍",
                      atBa: true,
                      isRepeat: true,
                      count: colorXLength,
                    }]
                  }
                },
                logicTreeAction: {
                  actions: [
                    {
                      title: ["cutIn", [
                        {
                          title: ["_１ダメージを与える", 1],
                          vars: ["任意の枚数の敵軍ユニット"]
                        }
                      ]]
                    }
                  ]
                }
              })
              ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
              return ctx
            }.toString()
          }
        ]
      }
    ],
  },
};