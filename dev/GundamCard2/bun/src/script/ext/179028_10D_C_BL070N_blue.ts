
// 179028_10D_C_BL070N_blue
// N
// OO
// 希望の光
// 強化　再生

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

// （常時）：交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る。または、非交戦中の自軍ユニット１枚の破壊を無効にする。
export const prototype: CardPrototype = {
  commandText: {
    id: "",
    title: ["使用型", ["常時"]],
    description: "（常時）：交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る。または、非交戦中の自軍ユニット１枚の破壊を無効にする。",
    conditions: {
      "交戦中の自軍ユニット１枚は": {
        title: ["Entity", { isBattle: true, side: "自軍", runtimeItemCategory: ["ユニット"], count: 1 }]
      },
      "非交戦中の自軍ユニット１枚の破壊": {
        title: ["Entity", { isBattle: false, side: "自軍", runtimeItemCategory: ["ユニット"], count: 1, isDestroy: true }]
      }
    },
    // logicTreeActions只能支援一個元素, 不能多個
    logicTreeActions: [
      {
        logicTree: {
          type: "Or",
          children: [
            {
              type: "Leaf",
              value: "交戦中の自軍ユニット１枚は"
            },
            {
              type: "Leaf",
              value: "非交戦中の自軍ユニット１枚の破壊"
            }
          ]
        },
        actions: [
          {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
              const cardId = DefineFn.EffectFn.getCardID(effect)
              const enable1 = DefineFn.ItemStateFn.hasTip(GameStateFn.getItemState(ctx, cardId), "交戦中の自軍ユニット１枚は")
              if (enable1) {
                const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "交戦中の自軍ユニット１枚は", cardId)
                for (const pair of pairs) {
                  ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: ["＋x／＋x／＋xを得る", [3, 3, 3]], cardIds: [pair[0]] }], pair)
                }
                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.clearTip(is, "交戦中の自軍ユニット１枚は")) as GameState
              }
              const enable2 = DefineFn.ItemStateFn.hasTip(GameStateFn.getItemState(ctx, cardId), "非交戦中の自軍ユニット１枚の破壊")
              if (enable2) {
                const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "非交戦中の自軍ユニット１枚の破壊", cardId)
                for (const pair of pairs) {
                  ctx = GameStateFn.doItemSetDestroy(ctx, null, pair, { isSkipTargetMissing: true })
                }
                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.clearTip(is, "非交戦中の自軍ユニット１枚の破壊")) as GameState
              }
              return ctx
            }.toString()
          }
        ]
      },
    ]
  }
};
