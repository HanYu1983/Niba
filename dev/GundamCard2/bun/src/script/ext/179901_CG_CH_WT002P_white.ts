// 179901_CG_CH_WT002P_white
// ラクス・クライン
// 女性　子供　CO
// 【ステイ】　〔１〕：供給
// （戦闘フェイズ）〔R〕：自軍キャラ１枚は、ターン終了時まで、＋２／＋２／＋２を得る。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { EffectFn, type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔R〕：自軍キャラ１枚は、ターン終了時まで、＋２／＋２／＋２を得る。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        "〔R〕": {
          actions: [
            {
              title: ["_ロールする", "ロール"]
            }
          ]
        },
        // TODO check this tip
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
                  title: ["ターン終了時まで「速攻」を得る。", [{
                    title: ["＋x／＋x／＋xを得る", [2, 2, 2]],
                    cardIds: []
                  }]],
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
