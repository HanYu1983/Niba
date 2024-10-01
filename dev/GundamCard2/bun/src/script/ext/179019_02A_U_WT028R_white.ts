// 179019_02A_U_WT028R_white
// アストレイ レッドフレーム（ガーベラ・ストレート）
// アストレイ系　レッドフレーム系　MS　専用「ロウ・ギュール」
// 戦闘配備　〔１〕：ゲイン
// 『起動』：このカードは、「ゲイン」の効果で戦闘修正を得る場合、その戦闘修正の代わりに、ターン終了時まで＋４／±０／±０を得る事ができる。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { TargetMissingError } from "../../game/define/GameError";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { getCardGSign, getCardGSignProperty } from "../../game/gameState/card";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      // 這個能力的實作在createTextsFromSpecialEffect
      description: "『起動』：このカードは、「ゲイン」の効果で戦闘修正を得る場合、その戦闘修正の代わりに、ターン終了時まで＋４／±０／±０を得る事ができる。",
      title: ["自動型", "起動"],
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