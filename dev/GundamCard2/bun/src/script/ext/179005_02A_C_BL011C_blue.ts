// 179005_02A_C_BL011C_blue
// C
// Z
// メガ・バズーカ・ランチャー
// 強化
// （ダメージ判定ステップ）：戦闘エリアにいる自軍ユニット1枚は、ターン終了時まで「〔0〕：範囲兵器（X）」を得る。Xの値は、自軍Gの枚数－1とする。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（ダメージ判定ステップ）：戦闘エリアにいる自軍ユニット1枚は、ターン終了時まで「〔0〕：範囲兵器（X）」を得る。Xの値は、自軍Gの枚数－1とする。",
    title: ["使用型", ["ダメージ判定ステップ"]],
    testEnvs: [
      {
        createCards: [
          ["自軍", "戦闘エリア2", [["unit", 1]]]
        ]
      }
    ],
    conditions: {
      "戦闘エリアにいる自軍ユニット1枚": {
        title: ["Entity", {
          at: ["戦闘エリア1", "戦闘エリア2"],
          side: "自軍",
          is: ["ユニット"],
          count: 1
        }]
      },
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [
              {
                title: function _(ctx: any, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                  const cardId = DefineFn.EffectFn.getCardID(effect)
                  const playerId = DefineFn.EffectFn.getPlayerID(effect)
                  const gLen = Math.max(GameStateFn.getPlayerGIds(ctx, playerId).length - 1, 0)
                  const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "戦闘エリアにいる自軍ユニット1枚", cardId)
                  for (const pair of pairs) {
                    ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [
                      {
                        title: ["SpecialEffectBonus", ["範囲兵器", gLen]],
                        cardIds: [pair[0]]
                      }
                    ], pair)
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