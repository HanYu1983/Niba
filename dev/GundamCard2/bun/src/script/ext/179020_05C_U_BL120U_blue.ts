// 179020_05C_U_BL120U_blue
// U
// ΖΖ
// メガ・ライダー
// SFS　ガンダムチーム
// 高機動
// （自軍攻撃ステップ）〔１〕：このカードの部隊にいる「特徴：ガンダムチーム」を持つ自軍ユニット１枚は、ターン終了時まで「高機動」を得る。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（自軍攻撃ステップ）〔１〕：このカードの部隊にいる「特徴：ガンダムチーム」を持つ自軍ユニット１枚は、ターン終了時まで「高機動」を得る。",
      title: ["使用型", ["自軍", "攻撃ステップ"]],
      testEnvs: [
        {
          createCards: [
            ["自軍", "戦闘エリア1", [["179020_05C_U_BL120U_blue", 1]]],
            ["自軍", "Gゾーン", [["179020_05C_U_BL120U_blue", 1]]]
          ]
        }
      ],
      conditions: {
        ...createRollCostRequire(1, null),
        "このカードの部隊にいる「特徴：ガンダムチーム」を持つ自軍ユニット１枚": {
          title: ["Entity", {
            isThisBattleGroup: true,
            hasChar: ["ガンダムチーム"],
            side: "自軍",
            is: ["ユニット"],
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
                  title: ["ターン終了時まで「速攻」を得る。", [
                    {
                      title: ["AddText", {
                        id: "",
                        title: ["特殊型", ["高機動"]]
                      }],
                      cardIds: []
                    },
                  ]],
                  vars: ["このカードの部隊にいる「特徴：ガンダムチーム」を持つ自軍ユニット１枚"]
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