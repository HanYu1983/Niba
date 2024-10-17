// 179014_03B_CH_WT027R_white
// ゼクス・マーキス
// 男性　子供
// 速攻
// （戦闘フェイズ）〔１〕：自軍ユニットの「専用機のセット」が成立している場合、このカードは、ターン終了時まで「高機動」を得る。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { EffectFn, type Effect } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔１〕：自軍ユニットの「専用機のセット」が成立している場合、このカードは、ターン終了時まで「高機動」を得る。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        ...createRollCostRequire(1, null),
        "自軍ユニットの「専用機のセット」が成立している場合": {
          actions: [
            {
              title: ["Entity", {
                side: "自軍",
                isMaster: true,
                min: 1
              }]
            }
          ]
        },
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [{
                title: ["ターン終了時まで「速攻」を得る。", [{ title: ["AddText", { id: "", title: ["特殊型", ["高機動"]] }], cardIds: [] }]],
              }]],
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