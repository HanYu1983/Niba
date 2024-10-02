// 179901_CG_C_WT001P_white
// アークエンジェル出航
// 補強
// （自軍配備フェイズ）：「供給」を持つ自軍カード１枚をロールする。その場合、カード２枚を引く。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（自軍配備フェイズ）：「供給」を持つ自軍カード１枚をロールする。その場合、カード２枚を引く。",
    title: ["使用型", ["自軍", "配備フェイズ"]],
    conditions: {
      "「供給」を持つ自軍カード１枚": {
        title: ["Entity", {
          side: "自軍",
          atBa: true,
          is: ["ユニット"],
          hasSpecialEffect: [["供給"]],
          count: 1,
        }],
        actions: [
          {
            title: ["_ロールする", "ロール"],
            vars: ["「供給」を持つ自軍カード１枚"]
          }
        ]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_ロールする", "ロール"],
            vars: ["「供給」を持つ自軍カード１枚"]
          },
          {
            title: ["カード_１枚を引く", 2],
          }
        ]
      }
    ],
  },
};