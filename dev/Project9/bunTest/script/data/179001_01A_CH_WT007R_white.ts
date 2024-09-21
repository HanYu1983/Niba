
// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。

import { test } from "ramda";
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        "このセットグループのユニットは": {
          title: ["このセットグループの_ユニットは", "ユニット"]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [{
                title: ["ターン終了時まで「速攻」を得る。", [{ title: ["AddText", { id: "", title: ["特殊型", ["速攻"]] }], cardIds: [] }]],
                vars: ["このセットグループのユニットは"],
              }]]
            },
          ]
        }
      ]
    }
  ],
};
