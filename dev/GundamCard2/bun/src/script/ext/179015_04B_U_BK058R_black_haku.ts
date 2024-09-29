// 179015_04B_U_BK058R_black_haku
// R
// Z
// ガンダムTR-1［ヘイズル改］【箔押しVer.】
// ヘイズル系　MS　T3部隊
// クイック　〔０〕：改装［ヘイズル系］
// 『起動』：このカードが場に出た場合、敵軍ユニット１枚は、ターン終了時まで－X／－X／－Xを得る。Xの値は、「特徴：T3部隊」を持つ自軍ユニットの枚数＋１とする。（注：このカードも枚数に含める）

import { CardPrototype } from "../../game/define/CardPrototype";
import { BattleBonus } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが場に出た場合、敵軍ユニット１枚は、ターン終了時まで－X／－X／－Xを得る。Xの値は、「特徴：T3部隊」を持つ自軍ユニットの枚数＋１とする。（注：このカードも枚数に含める）",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "敵軍ユニット１枚": {
                title: ["Entity", {
                  at: DefineFn.BaSyouKeywordFn.getBaAll(),
                  side: "敵軍",
                  is: ["ユニット"],
                  count: 1,
                }],
              }
            },
            logicTreeAction:{
              actions: [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const cardController = GameStateFn.getItemController(ctx, cardId)
                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "敵軍ユニット１枚", cardId)
                    const count = GameStateFn.getItemIdsByPlayerId(ctx, true, cardController).filter(cardId => GameStateFn.getItemCharacteristic(ctx, cardId).indexOf("T3部隊") != -1).length
                    const bonusV = count + 1
                    const bonus: BattleBonus = [-bonusV, -bonusV, -bonusV]
                    for (const pair of pairs) {
                      GameStateFn.assertTargetMissingError(ctx, pair)
                      ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{
                        title: ["＋x／＋x／＋xを得る", bonus],
                        cardIds: [pair[0]]
                      }], pair)
                    }
                    return ctx
                  }.toString()
                }
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
