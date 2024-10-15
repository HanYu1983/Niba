// 179901_CG_CH_GN001P_green
// P
// GUNDAM
// シャア・アズナブル
// 男性　大人　NT
// クイック
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
      title: ["使用型", ["戦闘フェイズ"]],
      testEnvs: [
        {
          addCards: [
            ["自軍", "配備エリア", [{ id: "this", protoID: "179901_CG_CH_GN001P_green" }, { id: "unit", protoID: "unit" }]]
          ],
          setGroupParent: { "this": "unit" },
          createCards: [
            ["自軍", "Gゾーン", [["unit", 2]]],
          ]
        }
      ],
      conditions: {
        ...createRollCostRequire(2, null),
        "このセットグループのユニット": {
          title: ["このセットグループの_ユニットは", "ユニット"]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["ターン終了時まで「速攻」を得る。", [{ title: ["AddText", { id: "", title: ["特殊型", ["速攻"]] }], cardIds: [] }]],
                }
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