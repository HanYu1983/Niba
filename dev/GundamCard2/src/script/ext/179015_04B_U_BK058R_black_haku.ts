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
import { ItemStateFn } from "../../game/define/ItemState";
import { getItemCharacteristic } from "../../game/gameState/card";
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
          ctx = GameStateFn.addImmediateEffect(ctx, {
            id: "",
            reason: effect.reason,
            description: effect.description,
            text: {
              id: effect.text.id,
              description: effect.text.description,
              title: [],
              conditions: {
                "敵軍ユニット１枚": {
                  title: ["_自軍_ユニット_１枚", "敵軍", "ユニット", 1],
                }
              },
              logicTreeActions: [
                {
                  actions: [
                    {
                      title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                        const cardId = DefineFn.EffectFn.getCardID(effect)
                        const cardController = GameStateFn.getItemController(ctx, cardId)
                        const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "敵軍ユニット１枚", cardId)
                        const count = GameStateFn.getItemIdsByPlayerId(ctx, true, cardController).filter(cardId => getItemCharacteristic(ctx, cardId).indexOf("T3部隊") != -1).length
                        const bonusV = count + 1
                        const bonus: BattleBonus = [-bonusV, -bonusV, -bonusV]
                        for (const pair of pairs) {
                          GameStateFn.assertTargetMissingError(ctx, pair)
                          ctx = GameStateFn.mapItemState(ctx, cardId, is => ItemStateFn.setGlobalEffect(is, null, true, {
                            title: ["＋x／＋x／＋xを得る", bonus],
                            cardIds: [cardId]
                          })) as GameState
                        }
                        return ctx
                      }.toString()
                    }
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
