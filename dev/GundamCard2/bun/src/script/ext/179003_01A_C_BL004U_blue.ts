
// 179003_01A_C_BL004U_blue
// U
// UC
// 守る決意
// 対抗
// （戦闘フェイズ）：自軍カード１枚は、ステップ終了時まで、敵軍効果の対象にならない。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（戦闘フェイズ）：自軍カード１枚は、ステップ終了時まで、敵軍効果の対象にならない。",
    title: ["使用型", ["戦闘フェイズ"]],
    testEnvs: [
      {
        createCards: [
          ["自軍", "配備エリア", [["charBlue", 1]]]
        ]
      }
    ],
    conditions: {
      "自軍カード１枚": {
        title: ["Entity", {
          atBa: true,
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
                title: ["ステップ終了時まで「速攻」を得る。", [{ title: ["敵軍効果の対象にならない"], cardIds: [] }]],
                vars: ["自軍カード１枚"]
              }
            ]]
          }
        ]
      }
    ],
  },
};