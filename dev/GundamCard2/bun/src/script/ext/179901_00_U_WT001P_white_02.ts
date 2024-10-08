// 179901_00_U_WT001P_white_02
// P
// W
// ウイングガンダム（EW）
// ウイング系　MS　専用「ヒイロ・ユイ」
// クイック　〔１〕：ゲイン　〔１〕：範囲兵器（３）
// （戦闘フェイズ）〔２〕：このカードと交戦中の敵軍ユニットが破壊されている場合、G以外の敵軍カード１枚を破壊する。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔２〕：このカードと交戦中の敵軍ユニットが破壊されている場合、G以外の敵軍カード１枚を破壊する。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        ...createRollCostRequire(2, null),
        "このカードと交戦中の敵軍ユニットが破壊されている場合": {
          actions: [
            {
              title: ["Entity", {
                isBattleWithThis: true,
                isDestroy: true,
                side: "敵軍",
                is: ["ユニット"],
                min: 1,
              }]
            }
          ]
        },
        "G以外の敵軍カード１枚": {
          title: ["Entity", {
            atBa: true,
            is: ["ACE", "オペレーション", "オペレーション(ユニット)", "キャラクター", "コマンド", "ユニット"],
            side: "敵軍",
            isDestroy: false,
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
                  title: ["_ロールする", "破壞"],
                  vars: ["G以外の敵軍カード１枚"]
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