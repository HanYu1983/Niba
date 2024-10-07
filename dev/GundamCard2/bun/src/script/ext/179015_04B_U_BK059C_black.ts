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
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              // "_自軍_本国の上のカード_１～_４枚を見て、その中にある、「特徴：_ヘイズル系」を持つ_ユニット_１枚": {
              //   title: ["_自軍_本国の上のカード_１～_４枚を見て、その中にある、「特徴：_ヘイズル系」を持つ_ユニット_１枚", "敵軍", "本国", 1, 4, "ヘイズル系", "ユニット", 1],
              // },
              "自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚": {
                title: ["Entity", {
                  see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 4],
                  hasChar: ["ヘイズル系"],
                  cardCategory: ["ユニット"],
                  max: 1,
                }],
                // actions: [
                //   {
                //     title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                //       const cardId = DefineFn.EffectFn.getCardID(effect)
                //       const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚", cardId)
                //       const validPairs = DefineFn.TipFn.getWant(GameStateFn.createTipByEntitySearch(ctx, cardId, {
                //         see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 4],
                //         hasChar: ["ヘイズル系"],
                //         cardCategory: ["ユニット"],
                //       })) as StrBaSyouPair[]
                //       const isValid = pairs.every(pair=> validPairs.find(vp=> pair[0] == vp[0]))
                //       if(isValid == false){
                //         throw new DefineFn.TipError(`select not right`)
                //       }
                //       return ctx
                //     }.toString()
                //   }
                // ]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                  vars: ["自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚"]
                },
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
          return ctx
        }
        return ctx
      }.toString()
    },
  ],
};
