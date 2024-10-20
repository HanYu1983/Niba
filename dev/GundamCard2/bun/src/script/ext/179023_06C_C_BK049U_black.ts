// 179023_06C_C_BK049U_black
// 空中戦
// 破壊
// （敵軍ダメージ判定ステップ）：戦闘エリアにいる、「高機動」を持つ敵軍ユニット１枚を破壊する。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（敵軍ダメージ判定ステップ）：戦闘エリアにいる、「高機動」を持つ敵軍ユニット１枚を破壊する。",
    title: ["使用型", ["敵軍", "ダメージ判定ステップ"]],
    conditions: {
      "戦闘エリアにいる、「高機動」を持つ敵軍ユニット１枚": {
        title: ["Entity", {
          at: ["戦闘エリア1", "戦闘エリア2"],
          hasSpecialEffect: [["高機動"]],
          side: "敵軍",
          is: ["ユニット"],
          count: 1,
        }]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_ロールする", "破壞"],
            vars: ["戦闘エリアにいる、「高機動」を持つ敵軍ユニット１枚"]
          }
        ]
      }
    ]
  },
};
