// 179029_B3C_U_BK185N_black
// ジム・キャノンⅡ（アデル機）
// ジム系　MS　専用「チャップ・アデル」
// 『起動』：このカードが場に出た場合、自軍ユニット１枚の上に±０／±０／－１コイン２個を乗せる事ができる。その場合、カード１枚を引く。
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
      description: "『起動』：このカードが場に出た場合、自軍ユニット１枚の上に±０／±０／－１コイン２個を乗せる事ができる。その場合、カード１枚を引く。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "自軍ユニット１枚の上": {
                title: ["Entity", {
                  at: DefineFn.BaSyouKeywordFn.getBaAll(),
                  side: "自軍",
                  is: ["ユニット"],
                  count: 1
                }],
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_－１／－１／－１コイン_１個を乗せる", [0, 0, -1], 2],
                  vars: ["自軍ユニット１枚の上"],
                  description: "自軍ユニット１枚の上に±０／±０／－１コイン２個を乗せる事ができる",
                },
                {
                  title: ["カード_１枚を引く", 1],
                  description: "その場合、カード１枚を引く"
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString()
    }
  ]
};
