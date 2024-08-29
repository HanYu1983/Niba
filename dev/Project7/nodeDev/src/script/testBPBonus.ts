

// 179016_04B_U_WT075C_white
// アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。（注：このカードが場に出た時にも起動する）

import { CardPrototype, DEFAULT_CARD_PROTOTYPE, DEFAULT_CARD_TEXT_ZIDOU_KATA, GlobalEffect, CardTextCustom, CardText } from "../game/define";
import { GameState } from "../game/gameState/GameState";
import { GameStateWithFlowMemory } from "../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { Bridge, Runtime } from "./bridge";

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
      ...DEFAULT_CARD_TEXT_ZIDOU_KATA,
      category: "恒常",
      block: {
        id: "+3/+3/+3",
        getGlobalEffectScript: function _(ctx: GameState, runtime: Runtime, lib: Bridge): GlobalEffect[] {
          const units = lib.getMyUnitIds(ctx, runtime.getPlayerID())
          return [
            {
              type: "AddText",
              cardIds: units,
              text: {
                id: "CardTextCustom",
                customID: {
                  id: "CardTextCustomIDBattleBonus",
                  battleBonus: [3, 3, 3]
                }
              }
            } as GlobalEffect
          ]
        }.toString()
      }
    }
  ],
};
