// 179023_06C_C_BL054U_blue
// U
// UC
// 最後の戦いへ
// 強化
// （戦闘フェイズ）：自軍セットグループ１つの全てのカードの上に、＋１／＋１／＋１コイン１個を乗せる。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition, TestEnv } from "../../game/define/CardText";
import { GameState } from "../../game/gameState/GameState";
import { getSetGroup } from "../../game/gameState/SetGroupComponent";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（戦闘フェイズ）：自軍セットグループ１つの全てのカードの上に、＋１／＋１／＋１コイン１個を乗せる。",
    title: ["使用型", ["戦闘フェイズ"]],
    testEnvs: [
      {
        addCards:[
          ["自軍", "戦闘エリア1", [{id: "unit", protoID: "unit"}, {id: "charBlue", protoID: "charBlue"}]]
        ],
        setGroupParent: {"charBlue": "unit"},
        checkFn(ctx:GameState, {GameStateFn, Options}:Bridge){
          const coins = GameStateFn.getCoinIds(ctx)
          if(coins.length != 2){
            throw new Error()
          }
        }
      }
    ],
    conditions: {
      ...createRollCostRequire(1, null),
      "自軍セットグループ１つの全てのカード": {
        title: ["Entity", {
          isSetGroupRoot: true,
          atBa: true,
          side: "自軍",
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
                title: ["_－１／－１／－１コイン_１個を乗せる", [1, 1, 1], 1],
                vars: ["自軍セットグループ１つの全てのカード"],
                isSelectAllCardInSetGroup: ["自軍セットグループ１つの全てのカード"]
              }
            ]]
          }
        ]
      }
    ]
  }
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