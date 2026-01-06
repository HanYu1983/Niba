// 179901_00_U_BL021P_blue
// P
// ZZ
// フルアーマーΖΖガンダム［∞］
// ΖΖ系　MS　ガンダムチーム　専用「ジュドー・アーシタ」
// 戦闘配備　強襲　〔１〕：改装［ΖΖ系］
// （自軍ダメージ判定ステップ）〔０毎〕：このカードが戦闘エリアにいる場合、本来の記述に「特徴：ガンダムチーム」を持つ自軍G２枚をロールする。その場合、敵軍ユニット１～３枚に、３ダメージを振り分けて与える。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（自軍ダメージ判定ステップ）〔０毎〕：このカードが戦闘エリアにいる場合、本来の記述に「特徴：ガンダムチーム」を持つ自軍G２枚をロールする。その場合、敵軍ユニット１～３枚に、３ダメージを振り分けて与える。",
      title: ["使用型", ["自軍", "ダメージ判定ステップ"]],
      isEachTime: true,
      testEnvs: [
        {
          createCards: [
            ["自軍", "戦闘エリア1", [["179901_00_U_BL021P_blue", 1]]],
            ["自軍", "Gゾーン", [["179901_00_U_BL021P_blue", 2]]],
            ["敵軍", "配備エリア", [["unit", 2]]]
          ],
        },
      ],
      conditions: {
        "このカードが戦闘エリアにいる場合": {
          actions: [
            {
              title: ["このカードが_戦闘エリアにいる場合", ["戦闘エリア1", "戦闘エリア2"]],
            }
          ]
        },
        "本来の記述に「特徴：ガンダムチーム」を持つ自軍G２枚": {
          title: ["Entity", {
            side: "自軍",
            at: ["Gゾーン"],
            hasOriginChar: ["ガンダムチーム"],
            isRoll: false,
            count: 2
          }],
        },
        "敵軍ユニット１～３枚": {
          title: ["Entity", {
            atBa: true,
            side: "敵軍",
            is: ["ユニット"],
            count: 3,
            isRepeat: true
          }]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["_ロールする", "ロール"],
                  vars: ["本来の記述に「特徴：ガンダムチーム」を持つ自軍G２枚"]
                },
                {
                  title: ["_１ダメージを与える", 1],
                  vars: ["敵軍ユニット１～３枚"]
                }
              ]]
            },
          ]
        }
      ]
    },
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