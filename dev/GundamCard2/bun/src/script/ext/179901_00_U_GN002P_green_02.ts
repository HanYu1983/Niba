// 179901_00_U_GN002P_green_02
// P
// GUNDAM
// シャア専用ザクⅡ
// ザク系　MS　専用「シャア・アズナブル」
// 戦闘配備　速攻
// （攻撃ステップ）〔１〕：このカードをリロールする。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（攻撃ステップ）〔１〕：このカードをリロールする。",
      title: ["使用型", ["攻撃ステップ"]],
      testEnvs: [{
        createCards: [
          ["自軍", "戦闘エリア1", [["179901_00_U_GN002P_green_02", 1]]],
          ["自軍", "Gゾーン", [["unit", 1]]]
        ]
      }],
      conditions: {
        ...createRollCostRequire(1, null),
        // TODO is roll
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["_ロールする", "リロール"]
                }
              ]]
            }
          ]
        }
      ]
    }
  ]
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