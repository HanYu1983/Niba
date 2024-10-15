// 179015_04B_U_GN055R_green_haku
// R
// GUNDAM
// エルメス【箔押しVer.】
// エルメス系　MA　専用「ララァ・スン」
// 〔０〕：サイコミュ（１）　〔１〕：サイコミュ（２）
// （攻撃ステップ）〔２〕：自軍手札にある、このカードと同じ属性のGサインと、「特徴：専用「シャア・アズナブル」」を持つユニット１枚を選んで、戦闘エリアにリロール状態で出す。その場合、カード１枚を引く。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（攻撃ステップ）〔２〕：自軍手札にある、このカードと同じ属性のGサインと、「特徴：専用「シャア・アズナブル」」を持つユニット１枚を選んで、戦闘エリアにリロール状態で出す。その場合、カード１枚を引く。",
      title: ["使用型", ["攻撃ステップ"]],
      testEnv: {
        basicCards: [
          ["自軍", "Gゾーン", [["unit", 2]]],
          ["自軍", "手札", [["179015_04B_U_GN053U_green", 1]]],
          ["自軍", "配備エリア", [["179015_04B_U_GN055R_green_haku", 1]]],
        ]
      },
      conditions: {
        ...createRollCostRequire(2, null),
        "自軍手札にある、このカードと同じ属性のGサインと、「特徴：専用「シャア・アズナブル」」を持つユニット１枚": {
          title: ["Entity", {
            side: "自軍",
            at: ["手札"],
            hasGSignProperty: [],
            hasChar: ["専用「シャア・アズナブル"],
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
                  title: ["_の_ハンガーに移す", "自軍", "配備エリア"],
                  vars: ["自軍手札にある、このカードと同じ属性のGサインと、「特徴：専用「シャア・アズナブル」」を持つユニット１枚"]
                },
                {
                  title: ["カード_１枚を引く", 1]
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