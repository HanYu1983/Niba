// 179009_03B_U_GN036U_green
// U
// GUNDAM
// 高機動型ザクⅡ（ギャビー・ハザード機）
// ザク系　MS　撃墜王　専用「ギャビー・ハザード」
// 戦闘配備　〔１〕：クロスウェポン［撃墜王］
// （戦闘フェイズ）〔R+１〕：このカードと交戦中の、ダメージを受けている敵軍ユニット１枚を持ち主の本国の上に移す。自軍ユニットの「専用機のセット」が成立している場合、この効果のコストは〔０〕に変更される。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { LogicTree } from "../../tool/logicTree";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔R+１〕：このカードと交戦中の、ダメージを受けている敵軍ユニット１枚を持ち主の本国の上に移す。自軍ユニットの「専用機のセット」が成立している場合、この効果のコストは〔０〕に変更される。",
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
        "〔R〕": {
          actions: [
            {
              title: ["_ロールする", "ロール"]
            }
          ]
        },
        "このカードと交戦中の、ダメージを受けている敵軍ユニット１枚": {
          title: ["Entity", {
            isBattleWithThis: this,
            hasDamage: true,
            is: ["ユニット"],
            count: 1
          }]
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
                    value: "〔R〕"
                  },
                  {
                    type: "Leaf",
                    value: "このカードと交戦中の、ダメージを受けている敵軍ユニット１枚"
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
                    value: "〔R〕"
                  },
                  {
                    type: "Leaf",
                    value: "このカードと交戦中の、ダメージを受けている敵軍ユニット１枚"
                  }
                ]
              }
            ]
          },
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["_の_ハンガーに移す", "持ち主", "本国"],
                  vars: ["このカードと交戦中の、ダメージを受けている敵軍ユニット１枚"]
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