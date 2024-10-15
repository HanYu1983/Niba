// 179027_09D_C_WT067R_white
// 全門射撃
// 破壊
// （自軍ターン）：任意の枚数の敵軍ユニットに、Xダメージを振り分けて与える。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（自軍ターン）：任意の枚数の敵軍ユニットに、Xダメージを振り分けて与える。",
    title: ["使用型", ["自軍", "ターン"]],
    conditions: {
      "任意の枚数の敵軍ユニット": {
        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): Tip | null {
          const cardId = DefineFn.EffectFn.getCardID(effect)
          const count = GameStateFn.getCardTipStrBaSyouPairs(ctx, DefineFn.TipFn.createTotalCostKey(), cardId).length
          return GameStateFn.createTipByEntitySearch(ctx, effect, {
            atBa: true,
            side: "敵軍",
            is: ["ユニット"],
            count: count,
            isRepeat: true,
          })
        }.toString(),
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_１ダメージを与える", 1],
            vars: ["任意の枚数の敵軍ユニット"],
            description: "任意の枚数の敵軍ユニット"
          },
        ]
      }
    ],
  },
};