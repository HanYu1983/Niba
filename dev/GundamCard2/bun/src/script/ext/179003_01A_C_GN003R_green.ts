// 179003_01A_C_GN003R_green
// R
// 08MS小隊
// 頭上の悪魔
// 移動
// （攻撃ステップ）：配備エリアにいる、X以下の合計国力を持つ敵軍ユニット１枚を持ち主の手札に移す。Xの値は、自軍Gの枚数と同じとする。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（攻撃ステップ）：配備エリアにいる、X以下の合計国力を持つ敵軍ユニット１枚を持ち主の手札に移す。Xの値は、自軍Gの枚数と同じとする。",
    title: ["使用型", ["攻撃ステップ"]],
    conditions: {
      "配備エリアにいる、X以下の合計国力を持つ敵軍ユニット１枚": {
        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): Tip | null {
          const cardId = DefineFn.EffectFn.getCardID(effect)
          const cardController = GameStateFn.getItemController(ctx, cardId)
          const gLen = GameStateFn.getPlayerGIds(ctx, cardController).length
          return GameStateFn.createTipByEntitySearch(ctx, cardId, {
            at: ["配備エリア"],
            compareBattlePoint: ["合計国力", "<=", gLen],
            side: "敵軍",
            is: ["ユニット"],
            count: 1,
          })
        }.toString()
      },
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
              const cardId = DefineFn.EffectFn.getCardID(effect)
              const cardController = GameStateFn.getItemController(ctx, cardId)
              const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "配備エリアにいる、X以下の合計国力を持つ敵軍ユニット１枚", cardId)
              for (const pair of pairs) {
                ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "手札"), pair)
              }
              return ctx
            }.toString()
          }
        ]
      }
    ],
  },
};