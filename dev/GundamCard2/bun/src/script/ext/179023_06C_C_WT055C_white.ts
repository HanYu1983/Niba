// 179023_06C_C_WT055C_white
// C
// SEED
// パルマ・フィオキーナ
// 破壊
// （ダメージ判定ステップ）：戦闘エリアにいる敵軍ユニット１枚に５ダメージを与える。この効果で、対象が破壊されなかった場合、ターン終了時にカード１枚を引く。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（ダメージ判定ステップ）：戦闘エリアにいる敵軍ユニット１枚に５ダメージを与える。この効果で、対象が破壊されなかった場合、ターン終了時にカード１枚を引く。",
    title: ["使用型", ["ダメージ判定ステップ"]],
    conditions: {
      "戦闘エリアにいる敵軍ユニット１枚": {
        title: ["Entity", {
          at: ["戦闘エリア1", "戦闘エリア2"],
          side: "敵軍",
          is: ["ユニット"],
          count: 1,
        }]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
              const cardId = DefineFn.EffectFn.getCardID(effect)
              const cardController = GameStateFn.getItemController(ctx, cardId)
              const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "戦闘エリアにいる敵軍ユニット１枚", cardId)
              for (const pair of pairs) {
                ctx = GameStateFn.doItemDamage(ctx, effect, 5, pair, Options)
                // 対象が破壊されなかった場合
                if (GameStateFn.getItemState(ctx, pair[0]).destroyReason == null) {
                  ctx = GameStateFn.mapItemState(ctx, cardId, is => ({ ...is, flags: { ...is.flags, enabled: true, varNamesRemoveOnTurnEnd: { ...is.varNamesRemoveOnTurnEnd, ["enabled"]: true } } })) as GameState
                }
              }
              return ctx
            }.toString()
          }
        ]
      }
    ],
    onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
      const evt = DefineFn.EffectFn.getEvent(effect)
      const cardId = DefineFn.EffectFn.getCardID(effect)
      const cardController = GameStateFn.getItemController(ctx, cardId)
      if (evt.title[0] == "GameEventOnTiming"
        && DefineFn.PhaseFn.eq(evt.title[1], DefineFn.PhaseFn.getLastTriigerEffect())
        && GameStateFn.getItemState(ctx, cardId).flags.enabled
      ) {
        ctx = GameStateFn.doPlayerDrawCard(ctx, 1, cardController, Options)
      }
      return ctx
    }.toString()
  },
};