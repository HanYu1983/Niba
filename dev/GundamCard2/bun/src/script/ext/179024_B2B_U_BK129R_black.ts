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
        const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
          isOption: true,
          conditions: {
            "自軍本国の上のカード１～３枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚": {
              title: ["Entity", {
                see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 3],
                hasChar: ["ヘイズル系"],
                cardCategory: ["ユニット"],
                count: 1
              }],
            },
            "このカードの部隊の任意の順番": {
              title: ["Entity", {
                hasSelfCardId: true,
                isSetGroupRoot: true,
                max: 1
              }]
            }
          },
          logicTreeAction: {
            actions: [
              {
                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                  const cardId = DefineFn.EffectFn.getCardID(effect)
                  const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本国の上のカード１～３枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚", cardId)
                  const pairs2 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "このカードの部隊の任意の順番", cardId)
                  const cardBasyou = GameStateFn.getItemBaSyou(ctx, cardId)
                  //const battleGroup = GameStateFn.getBattleGroup(ctx, cardBasyou)
                  // 沒有選擇就是最後面
                  const insertId = pairs2.length == 0 ?
                    undefined :
                    pairs2.map(p => p[0]).indexOf(pairs1[0][0])
                  for (const pair of pairs1) {
                    ctx = GameStateFn.doItemMove(ctx, cardBasyou, pair, { insertId: insertId, ges: Options.ges }) as GameState
                  }
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
