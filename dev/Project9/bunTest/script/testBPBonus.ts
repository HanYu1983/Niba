import { CardPrototype, DEFAULT_CARD_PROTOTYPE } from "../game/define/CardPrototype";
import { Effect } from "../game/define/Effect";
import { GlobalEffect } from "../game/define/GlobalEffect";
import { GameState } from "../game/gameState/GameState";
import { Bridge } from "./bridge";

export const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」",
  category: "ユニット",
  color: "白",
  rollCost: ["白", "白", null, null, null],
  battlePoint: [5, 2, 4],
  texts: [
    {
      id: "",
      title: ["自動型", "恒常"],
      onSituation: function _(ctx: GameState, effect: Effect, { GameStateFn, ToolFn }: Bridge): GlobalEffect[] {
        const cardIds = GameStateFn.getItemIds(ctx)
        const units = cardIds
        return [
          {
            title: ["AddText", {
              id: ToolFn.getUUID("testBPBonus"),
              title: ["TextBattleBonus", [3, 3, 3]],
            }],
            cardIds: units
          }
        ]
      }.toString()
    },
  ],
};