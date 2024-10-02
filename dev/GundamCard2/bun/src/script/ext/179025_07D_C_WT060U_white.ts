// 179025_07D_C_WT060U_white
// 巨なる力
// 強化
// （戦闘フェイズ）：自軍ユニット１～２枚は、ターン終了時まで「高機動」、＋３／＋３／＋３を得る。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（戦闘フェイズ）：自軍ユニット１～２枚は、ターン終了時まで「高機動」、＋３／＋３／＋３を得る。",
    title: ["使用型", ["戦闘フェイズ"]],
    conditions: {
      "自軍ユニット１～２枚": {
        title: ["Entity", {
          at: ["戦闘エリア1", "戦闘エリア2", "配備エリア"],
          side: "自軍",
          is: ["ユニット"],
          min: 1,
          max: 2
        }]
      },
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [{
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ユニット１～２枚", cardId)
                for (const pair of pairs) {
                  ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [
                    { title: ["AddText", { id: ToolFn.getUUID(), title: ["特殊型", ["高機動"]] }], cardIds: [pair[0]] },
                    { title: ["＋x／＋x／＋xを得る", [3, 3, 3]], cardIds: [pair[0]] }
                  ], pair)
                }
                return ctx
              }.toString()
            }]]
          },
        ]
      }
    ],
  },
};