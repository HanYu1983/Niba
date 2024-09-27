// 179024_B2B_U_BK129R_black
// ギャプランTR-5［フライルー］
// ギャプラン系　ファイバー系　MS　T3部隊
// 快速　〔０〕：改装［ファイバー系］　〔２〕：クロスウェポン［T3部隊］
// 『起動』：このカードが攻撃に出撃した場合、自軍本国の上のカード１～３枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚を、このカードの部隊の任意の順番にリロール状態で出す事ができる。
import { title } from "process";
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair } from "../../game/define/Tip";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが攻撃に出撃した場合、自軍本国の上のカード１～３枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚を、このカードの部隊の任意の順番にリロール状態で出す事ができる。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "このカードが攻撃に出撃した場合" && evt.cardIds?.includes(cardId)) {

        } else {
          return ctx
        }
        const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
          isOption: true,
          conditions: {
            "自軍本国の上のカード１～３枚": {
              title: ["Entity", { side: "自軍", see: ["本国", 1, 3], hasChar: ["ヘイズル系"], is: ["ユニット"], min: 1, max: 3 }],
            },
            // TODO
            "このカードの部隊の任意の順番": {
              title: ["Entity", {}]
            }
          },
          logicTreeAction: {
            actions: [
              {
                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                  return ctx
                }.toString()
              }
            ]
          }
        })
        ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        return ctx
      }.toString(),
    }
  ]
};
