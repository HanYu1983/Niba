// 179024_B2B_C_GN052C_green
// C
// CCA
// スカウト
// 移動
// （戦闘フェイズ）：敵軍キャラ１枚を、自軍ハンガーに移す。

import { BaSyouKeyword } from "../../game/define/BaSyou";
import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）：敵軍キャラ１枚を、自軍ハンガーに移す。",
      title: ["使用型", ["戦闘フェイズ"]],
      testEnvs: [{
        createCards: [
          ["自軍", "配備エリア", [["179024_B2B_C_GN052C_green", 1]]],
          ["敵軍", "配備エリア", [["charBlue", 1]]],
        ]
      }],
      conditions: {
        "敵軍キャラ１枚を": {
          title: ["Entity", {
            atBa: true,
            side: "敵軍",
            is: ["キャラクター"],
            count: 1
          }]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                  vars: ["敵軍キャラ１枚を"]
                }
              ]]
            }
          ]
        }
      ]
    },
  ],
};


function createRollCostRequire(
  costNum: number,
  color: CardColor | null
): { [key: string]: Condition } {
  let ret: { [key: string]: Condition } = {}
  for (let i = 0; i < costNum; ++i) {
    const key = `${i}[${color}]`
    ret = {
      ...ret,
      [key]: {
        title: ["RollColor", color],
        actions: [
          {
            title: ["_ロールする", "ロール"],
            vars: [key]
          }
        ]
      }
    };
  }
  return ret
}