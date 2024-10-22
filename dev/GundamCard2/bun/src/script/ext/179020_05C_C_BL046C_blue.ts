// 179020_05C_C_BL046C_blue
// C
// ΖΖ
// 不可侵防壁
// 再生
// （常時）：通常ダメージで破壊されている自軍ユニット１枚の破壊を無効にする。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（常時）：通常ダメージで破壊されている自軍ユニット１枚の破壊を無効にする。",
    title: ["使用型", ["常時"]],
    testEnvs: [
      {
        thisCard: ["自軍", "配備エリア", { id: "", protoID: "unit" }, { destroyReason: { id: "通常ダメージ", playerID: "PlayerA" }, }]
      }
    ],
    conditions: {
      "通常ダメージで破壊されている自軍ユニット１枚": {
        title: ["Entity", {
          atBa: true,
          hasDestroyId: ["通常ダメージ"],
          side: "自軍",
          count: 1
        }]
      },
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [
              {
                title: ["_ロールする", "破壊を無効"],
                vars: ["通常ダメージで破壊されている自軍ユニット１枚"]
              }
            ]]
          }
        ]
      }
    ],
  },
};