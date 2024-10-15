// 179901_00_C_GN007P_green
// P
// 08小隊
// 狂気の落とし子
// 展開
// （自軍配備フェイズ）：自軍手札にある、６以上の合計国力と緑のロールコストを持つユニット１枚を選んで、自軍配備エリアにリロール状態で出す。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（自軍配備フェイズ）：自軍手札にある、６以上の合計国力と緑のロールコストを持つユニット１枚を選んで、自軍配備エリアにリロール状態で出す。",
    title: ["使用型", ["自軍", "配備フェイズ"]],
    testEnvs: [
      {
        createCards: [["自軍", "手札", [["179009_03B_U_GN042R_green", 1]]]]
      }
    ],
    conditions: {
      "自軍手札にある、６以上の合計国力と緑のロールコストを持つユニット１枚": {
        title: ["Entity", {
          side: "自軍",
          at: ["手札"],
          compareBattlePoint: ["合計国力", ">=", 6],
          hasRollCostColor: ["緑"],
          cardCategory: ["ユニット"],
          count: 1
        }]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_の_ハンガーに移す", "自軍", "配備エリア"],
            vars: ["自軍手札にある、６以上の合計国力と緑のロールコストを持つユニット１枚"]
          }
        ]
      }
    ]
  },
};