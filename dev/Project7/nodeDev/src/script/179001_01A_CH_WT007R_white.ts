
// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。

import { CardPrototype, DEFAULT_CARD_PROTOTYPE } from "../game/define/CardPrototype";

export const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "キラ・ヤマト",
  characteristic: "男性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  battlePoint: [2, 2, 2],
  texts: [],
};
