// 179024_04B_C_BK027U_black
// シザースクロー
// 束縛　装弾
// 『恒常』：このカードの解決直後に、本来の記述に「特徴：装弾」を持つ自軍G１枚をロールできる。その場合、カード１枚を引く。
// （自軍ターン）：敵軍手札１枚を無作為に廃棄する。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『恒常』：このカードの解決直後に、本来の記述に「特徴：装弾」を持つ自軍G１枚をロールできる。その場合、カード１枚を引く。",
      title: ["自動型", "恒常"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (
          event.title[0] == "解決直後" &&
          event.effect != null &&
          event.effect.text.id == "179024_04B_C_BK027U_black__2" &&
          DefineFn.EffectFn.getCardID(event.effect) == cardId
        ) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "本来の記述に｢特徴：装弾｣を持つ自軍G１枚": {
                title: ["_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚", true, "装弾", "自軍", "グラフィック", 1],
              },
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_ロールする", "ロール"],
                  vars: ["本来の記述に｢特徴：装弾｣を持つ自軍G１枚"]
                },
                {
                  title: ["カード_１枚を引く", 1]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
    },
  ],
  commandText: {
    id: "179024_04B_C_BK027U_black__2",
    description: "（自軍ターン）：敵軍手札１枚を無作為に廃棄する。",
    title: ["使用型", ["自軍", "ターン"]],
    conditions: {
      "敵軍手札１枚": {
        title: ["Entity", {
          side: "敵軍",
          at: ["手札"],
          count: 1
        }]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_ロールする", "廃棄"],
            vars: ["敵軍手札１枚"]
          },
          {
            title: ["triggerEvent", { title: ["解決直後"] }],
          }
        ]
      }
    ]
  },
};
