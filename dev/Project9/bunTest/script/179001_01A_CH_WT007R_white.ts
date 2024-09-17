
// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。

import { test } from "ramda";
import { CardPrototype, DEFAULT_CARD_PROTOTYPE } from "../game/define/CardPrototype";
import { Effect } from "../game/define/Effect";
import { GlobalEffect } from "../game/define/GlobalEffect";
import { GameState } from "../game/gameState/GameState";
import { Bridge } from "./bridge";

export const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "キラ・ヤマト",
  characteristic: "男性　子供　CO",
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  battlePoint: [2, 2, 2],
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
              title: ["AddGlobalEffects", [{ title: ["AddText", { id: "", title: ["特殊型", ["速攻"]] }], cardIds: [] }]],
              var: "このセットグループのユニットは",
            }
          ]
        }
      ]
    }
  ],
};
