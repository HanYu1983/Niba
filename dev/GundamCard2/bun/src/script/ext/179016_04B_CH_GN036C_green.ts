// 179016_04B_CH_GN036C_green
// C
// CCA
// ギュネイ・ガス
// 男性　子供　NT　強化人間
// （防御ステップ）〔１〕：「特徴：女性」を持つキャラがいる場合、このセットグループのユニットは、ターン終了時まで「サイコミュ」＋２を得る。

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
      description: "（防御ステップ）〔１〕：「特徴：女性」を持つキャラがいる場合、このセットグループのユニットは、ターン終了時まで「サイコミュ」＋２を得る。",
      title: ["使用型", ["防御ステップ"]],
      testEnvs: [{
        createCards: [
          ["自軍", "Gゾーン", [["unit", 1]]],
          ["自軍", "戦闘エリア1", [["179016_04B_CH_GN035R_green", 1]]],
          ["自軍", "配備エリア", [["179016_04B_CH_GN036C_green", 1]]],
        ]
      }],
      conditions: {
        ...createRollCostRequire(1, null),
        "「特徴：女性」を持つキャラがいる場合": {
          actions: [
            {
              title: ["Entity", {
                atBa: true,
                hasChar: ["女性"],
                side: "自軍",
                is: ["キャラクター"],
                count: 1
              }]
            }
          ]
        },
        "このセットグループのユニット": {
          title: ["Entity", {
            isThisSetGroup: true,
            isSetGroup: true,
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
                      title: ["SpecialEffectBonus", ["サイコミュ", 2]],
                      cardIds: [],
                    },
                  ]],
                  vars: ["このセットグループのユニット"]
                },
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