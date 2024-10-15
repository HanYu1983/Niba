// 179025_07D_C_GN056U_green
// U
// 83
// 強襲揚陸波
// 移動
// （自軍攻撃ステップ）：敵軍は、自分のユニット１枚を選んで持ち主の手札に移す。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（自軍攻撃ステップ）：敵軍は、自分のユニット１枚を選んで持ち主の手札に移す。",
    title: ["使用型", ["自軍", "攻撃ステップ"]],
    testEnvs: [
      {
        createCards: [["敵軍", "戦闘エリア1", [["unit", 1]]]]
      },
      {
        createCards: [["敵軍", "配備エリア", [["unit", 1]]]]
      }
    ],
    conditions: {
      "敵軍は、自分のユニット１枚": {
        relatedPlayerSideKeyword: "敵軍",
        title: ["Entity", {
          atBa: true,
          is: ["ユニット"],
          side: "敵軍",
          count: 1
        }]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_の_ハンガーに移す", "持ち主", "手札"],
            vars: ["敵軍は、自分のユニット１枚"]
          }
        ]
      }
    ]
  },
};