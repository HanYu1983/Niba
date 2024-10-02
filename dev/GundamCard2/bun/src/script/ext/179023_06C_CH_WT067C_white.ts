// 179023_06C_CH_WT067C_white
// スウェン・カル・バヤン
// 男性　大人
// 速攻
// （戦闘フェイズ）〔０〕：敵軍部隊がいる場合、このカードをリロールする。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";

import { EffectFn, type Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔０〕：敵軍部隊がいる場合、このカードをリロールする。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        "敵軍部隊がいる場合": {
          title: ["_敵軍部隊がいる場合", "敵軍"]
        }
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