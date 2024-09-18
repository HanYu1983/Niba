
// 179030_11E_C_BL079R_blue
// R
// 閃光のハサウェイ
// キルケーユニット
// 展開　装弾
// 『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、カード１枚を引く。
// （戦闘フェイズ）：敵軍ユニットが戦闘エリアにいる場合、自軍手札、または自軍ハンガーにある、６以下の合計国力を持つユニット１枚を、自軍ユニット１枚と、リロール状態で置き換える。

import { CardPrototype } from "../game/define/CardPrototype";
import type { Effect } from "../game/define/Effect";
import type { Bridge } from "./bridge";
import { type GameState } from "../game/gameState/GameState";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、カード１枚を引く。",
      title: ["自動型", "恒常"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const opponentPlayerId = DefineFn.PlayerIDFn.getOpponent(cardController)
        if (
          event.title[0] == "解決直後" &&
          event.effect != null &&
          event.effect.text.id == effect.text.id
        ) {
          const newEffect: Effect = {
            id: "",
            reason: ["PlayText", cardController, cardId, effect.text.id || "unknown"],
            isOption: true,
            text: {
              id: "",
              title: [],
              description: "本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、カード１枚を引く。",
              conditions: {
                "本来の記述に｢特徴：装弾｣を持つ自軍G１枚": {
                  title: ["本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚", "装弾", "自軍", "グラフィック", 1],
                },
              },
              logicTreeActions: [
                {
                  actions: [
                    {
                      title: ["_ロールする", true]
                    },
                    {
                      title: ["カード_１枚を引く", 1]
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
    },
  ],
  commandText: {
    id: "",
    title: ["使用型", ["戦闘フェイズ"]],
    description: "（戦闘フェイズ）：敵軍ユニットが戦闘エリアにいる場合、自軍手札、または自軍ハンガーにある、６以下の合計国力を持つユニット１枚を、自軍ユニット１枚と、リロール状態で置き換える。",
    conditions: {
      "敵軍ユニットが戦闘エリアにいる場合": {
        title: ["_敵軍_ユニットが_戦闘エリアにいる場合", "敵軍", "ユニット", ["戦闘エリア1", "戦闘エリア2"]]
      },
      "自軍手札、または自軍ハンガーにある、６以下の合計国力を持つユニット１枚を": {
        title: ["_自軍手札、または自軍ハンガーにある、_６以下の合計国力を持つ_ユニット_１枚を", "自軍", 6, "ユニット", 1]
      },
      "自軍ユニット１枚": {
        title: ["_自軍_ユニット_１枚", "自軍", "ユニット", 1]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: "リロール状態で置き換える。",
            vars: ["自軍手札、または自軍ハンガーにある、６以下の合計国力を持つユニット１枚を", "自軍ユニット１枚"]
          }
        ]
      }
    ]
  }
};
