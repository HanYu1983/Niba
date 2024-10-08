// 179030_11E_C_WT078R_white
// R
// SEED
// ガンダム奪取作戦
// 支配
// （自軍配備フェイズ）：４以下の合計国力を持つ、キャラがセットされていない敵軍ユニット１枚を、自軍配備エリアに移す。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（自軍配備フェイズ）：４以下の合計国力を持つ、キャラがセットされていない敵軍ユニット１枚を、自軍配備エリアに移す。",
    title: ["使用型", ["自軍", "配備フェイズ"]],
    conditions: {
      "４以下の合計国力を持つ、キャラがセットされていない敵軍ユニット１枚": {
        title: ["Entity", {
          compareBattlePoint: ["合計国力", "<=", 4],
          atBa: true,
          hasSetCard: false,
          side: "敵軍",
          is: ["ユニット"],
          count: 1,
        }]
      },
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_の_ハンガーに移す", "自軍", "配備エリア"],
            vars: ["４以下の合計国力を持つ、キャラがセットされていない敵軍ユニット１枚"]
          }
        ]
      }
    ],
  },
};