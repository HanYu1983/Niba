// 179015_04B_U_BK059C_black
// C
// Z
// ガンダムTR-1［ヘイズル2号機］
// ヘイズル系　MS　T3部隊
// 強襲　〔０〕：改装［ヘイズル系］
// 『起動』：このカードが場に出た場合、自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚を、自軍ハンガーに移す事ができる。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚を、自軍ハンガーに移す事ができる。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {
          ctx = GameStateFn.addImmediateEffect(ctx, {
            id: "",
            reason: effect.reason,
            description: effect.description,
            text: {
              id: effect.text.id,
              description: effect.text.description,
              title: [],
              conditions: {
                "_自軍_本国の上のカード_１～_４枚を見て、その中にある、「特徴：_ヘイズル系」を持つ_ユニット_１枚": {
                  title: ["_自軍_本国の上のカード_１～_４枚を見て、その中にある、「特徴：_ヘイズル系」を持つ_ユニット_１枚", "敵軍", "本国", 1, 4, "ヘイズル系", "ユニット", 1],
                }
              },
              logicTreeActions: [
                {
                  actions: [
                    {
                      title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                      vars: ["_自軍_本国の上のカード_１～_４枚を見て、その中にある、「特徴：_ヘイズル系」を持つ_ユニット_１枚"]
                    },
                  ]
                }
              ]
            }
          }) as GameState
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
