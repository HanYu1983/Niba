
// 179009_03B_U_GN037C_green
// C
// GUNDAM
// 高機動型ザクⅡ（ロバート・ギリアム機）
// ザク系　MS　撃墜王　専用「ロバート・ギリアム」
// 速攻　〔１〕：クロスウェポン［撃墜王］
// （防御ステップ）〔１〕：このカードが戦闘エリアにいる場合、交戦中の敵軍部隊１つに３貫通ダメージを与える。自軍ユニットの「専用機のセット」が成立している場合、この効果のコストは〔０〕に変更される。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { LogicTree } from "../../tool/logicTree";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（防御ステップ）〔１〕：このカードが戦闘エリアにいる場合、交戦中の敵軍部隊１つに３貫通ダメージを与える。自軍ユニットの「専用機のセット」が成立している場合、この効果のコストは〔０〕に変更される。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        "自軍ユニットの「専用機のセット」が成立している場合": {
          actions: [
            {
              title: ["Entity", {
                side: "自軍",
                isMaster: true,
                min: 1,
              }]
            }
          ]
        },
        ...createRollCostRequire(1, null),
        "このカードが戦闘エリアにいる場合": {
          actions: [
            {
              title: ["Entity", {
                isThisCard: true,
                at: ["戦闘エリア1", "戦闘エリア2"],
                count: 1,
              }]
            }
          ]
        },
        "交戦中の敵軍部隊１つ": {
          title: ["_交戦中の_敵軍部隊_１つ", true, "敵軍", 1]
        }
      },
      logicTreeActions: [
        {
          logicTree: {
            type: "Or",
            children: [
              {
                type: "And",
                children: [
                  ...Object.keys(createRollCostRequire(1, null)).map(key => {
                    return {
                      type: "Leaf",
                      value: key
                    } as LogicTree
                  }),
                  {
                    type: "Leaf",
                    value: "このカードが戦闘エリアにいる場合"
                  },
                  {
                    type: "Leaf",
                    value: "交戦中の敵軍部隊１つ"
                  }
                ]
              },
              {
                type: "And",
                children: [
                  {
                    type: "Leaf",
                    value: "自軍ユニットの「専用機のセット」が成立している場合"
                  },
                  {
                    type: "Leaf",
                    value: "このカードが戦闘エリアにいる場合"
                  },
                  {
                    type: "Leaf",
                    value: "交戦中の敵軍部隊１つ"
                  }
                ]
              }
            ]
          },
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["_１貫通ダメージを与える", 3],
                  vars: ["交戦中の敵軍部隊１つ"]
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