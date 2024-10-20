// 179030_11E_CH_WT108N_white
// ステア
// 女性　大人
// 【ステイ】
// （攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（攻撃ステップ）〔R〕：自軍キャラ１枚は、ターン終了時まで「高機動」を得る。",
      title: ["使用型", ["攻撃ステップ"]],
      conditions: {
        "〔R〕": {
          actions: [
            {
              title: ["_ロールする", "ロール"]
            }
          ]
        },
        "自軍キャラ１枚": {
          title: ["Entity", {
            atBa: true,
            side: "自軍",
            is: ["キャラクター"],
            count: 1,
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
                  vars: ["自軍キャラ１枚"]
                }
              ]]
            }
          ]
        }
      ]
    }
  ],
};
