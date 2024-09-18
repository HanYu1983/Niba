// 179030_11E_O_GN023N_green
// N
// CCA
// サイコミュテスト
// 破壊　装弾
// 『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。
// 『起動』：この記述の効果以外で、敵軍ユニットがダメージを受けた場合、戦闘エリアにいる敵軍ユニット１枚に１ダメージを与える。

import { CardPrototype } from "../game/define/CardPrototype";
import type { Effect } from "../game/define/Effect";
import type { Bridge } from "./bridge";
import type { GlobalEffect } from "../game/define/GlobalEffect";
import { type GameState } from "../game/gameState/GameState";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。",
      title: ["自動型", "常駐"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation == null) {
          return []
        }
        if (situation.title[0] == "「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合") {
          return [{ title: ["自軍Gとしてロール"], cardIds: [cardId] }]
        }
        return []
      }.toString()
    },
    {
      id: "",
      description: "『起動』：この記述の効果以外で、敵軍ユニットがダメージを受けた場合、戦闘エリアにいる敵軍ユニット１枚に１ダメージを与える。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const opponentPlayerId = DefineFn.PlayerIDFn.getOpponent(cardController)
        if (
          event.title[0] == "(敵軍)(ユニット)がダメージを受けた場合" &&
          event.title[1] == opponentPlayerId &&
          event.title[2] == "ユニット" &&
          event.effect != null &&
          event.effect.text.id != effect.text.id
        ) {
          const newEffect: Effect = {
            id: "",
            reason: ["PlayText", cardController, cardId, effect.text.id || "unknown"],
            text: {
              id: "",
              title: [],
              description: "",
              conditions: {
                "戦闘エリアにいる敵軍ユニット１枚": {
                  title: ["_戦闘エリアにいる_敵軍_ユニット_１～_２枚", ["戦闘エリア1", "戦闘エリア2"], "敵軍", "ユニット", 1, 1]
                },
              },
              logicTreeActions: [
                {
                  actions: [
                    {
                      title: ["_１ダメージを与える", 1],
                      vars: ["戦闘エリアにいる敵軍ユニット１枚"]
                    }
                  ]
                }
              ]
            }
          }
          ctx = GameStateFn.addImmediateEffect(ctx, newEffect) as GameState
        }
        return ctx
      }.toString(),
    }
  ],
};
