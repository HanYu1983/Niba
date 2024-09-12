

// 179016_04B_U_WT075C_white
// アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。（注：このカードが場に出た時にも起動する）
import { CardPrototype, DEFAULT_CARD_PROTOTYPE } from "../game/define/CardPrototype";
import { Effect } from "../game/define/Effect";
import { GlobalEffect } from "../game/define/GlobalEffect";
import { Situation } from "../game/define/Text";
import { Bridge } from "./bridge";

export const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "ユニット",
  color: "白",
  rollCost: ["白", "白", null, null, null],
  battlePoint: [5, 2, 4],
  texts: [
    {
      title: ["自動型", "恒常"],
      onSituation: function _(bridge: Bridge, effect: Effect, situation: Situation): GlobalEffect[] {
        const units = bridge.getMyUnitIds(bridge.getEffectCardID(effect))
        return [
          {
            type: "AddText",
            cardIds: units,
            text: {
              title: ["TTextBattleBonus", [3, 3, 3]],
            }
          }
        ]
      }.toString()
    },
  ],
};
