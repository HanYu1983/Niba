// 179019_01A_C_WT010C_white
// 黄昏の魔弾
// 強化
// （戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    title: ["使用型", ["戦闘フェイズ"]],
    description: "（戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。",
    conditions: {
      "自軍ユニット１枚": {
        title: ["_自軍_ユニット_１枚", "自軍", "ユニット", 1]
      },
      "「速攻」または「高機動」": {
        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
          return {
            title: ["StringOptions", ["速攻", "高機動"], ["速攻"]],
            count: 1,
          }
        }.toString()
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [
              {
                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                  const cardId = DefineFn.EffectFn.getCardID(effect)
                  const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ユニット１枚", cardId)
                  const str2 = GameStateFn.getCardTipStrings(ctx, "「速攻」または「高機動」", cardId)
                  switch (str2[0]) {
                    case "速攻":
                      for (const pair of pairs1) {
                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: ["AddText", { id: ToolFn.getUUID(), title: ["特殊型", ["速攻"]] }], cardIds: [pair[0]] }], pair)
                      }
                      break
                    case "高機動":
                      for (const pair of pairs1) {
                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: ["AddText", { id: ToolFn.getUUID(), title: ["特殊型", ["高機動"]] }], cardIds: [pair[0]] }], pair)
                      }
                      break
                  }
                  return ctx
                }.toString()
              }
            ]]
          }
        ]
      }
    ],
  },
};