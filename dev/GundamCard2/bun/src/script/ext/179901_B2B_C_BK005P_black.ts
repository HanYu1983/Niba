// 179901_B2B_C_BK005P_black
// ティターンズ・テスト・チーム
// 束縛
// ユニーク
// （自軍攻撃ステップ）：全ての軍は、自分の手札X枚を可能な限り選んで廃棄する。

import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（自軍攻撃ステップ）：全ての軍は、自分の手札X枚を可能な限り選んで廃棄する。",
    title: ["使用型", ["自軍", "攻撃ステップ"]],
    logicTreeActions: [
      {
        actions: [
          {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
              const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                conditions: {
                  "全ての軍は、自分の手札X枚を可能な限り選ん1": {
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): Tip | null {
                      const cardId = DefineFn.EffectFn.getCardID(effect)
                      const cardProto = GameStateFn.getItemPrototype(ctx, cardId)
                      const payColorKey = DefineFn.TipFn.createConditionKeyOfPayColorX(cardProto)
                      const x = GameStateFn.getCardTipStrBaSyouPairs(ctx, payColorKey, cardId).length
                      const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
                        side: "自軍",
                        at: ["手札"],
                        max: x,
                        asMuchAsPossible: true,
                      }, {ges: Options.ges})
                      return tip
                    }.toString()
                  },
                  "全ての軍は、自分の手札X枚を可能な限り選ん2": {
                    relatedPlayerSideKeyword: "敵軍",
                    title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): Tip | null {
                      const cardId = DefineFn.EffectFn.getCardID(effect)
                      const cardProto = GameStateFn.getItemPrototype(ctx, cardId)
                      const payColorKey = DefineFn.TipFn.createConditionKeyOfPayColorX(cardProto)
                      const x = GameStateFn.getCardTipStrBaSyouPairs(ctx, payColorKey, cardId).length
                      const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
                        side: "敵軍",
                        at: ["手札"],
                        max: x,
                        asMuchAsPossible: true
                      }, {ges: Options.ges})
                      return tip
                    }.toString()
                  }
                },
                logicTreeAction: {
                  actions: [
                    {
                      title: ["_ロールする", "廃棄"],
                      vars: ["全ての軍は、自分の手札X枚を可能な限り選ん1", "全ての軍は、自分の手札X枚を可能な限り選ん2"]
                    }
                  ]
                }
              })
              ctx = GameStateFn.addImmediateEffect(ctx, newE) as GameState
              return ctx
            }.toString()
          }
        ]
      }
    ]
  },
};
