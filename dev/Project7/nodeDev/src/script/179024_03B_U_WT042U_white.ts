// 179024_03B_U_WT042U_white
// U
// W
// シェンロンガンダム
// シェンロン系　MS　専用「張五飛」
// 〔０〕：改装［シェンロン系］
// （自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。
import { CardPrototype, DEFAULT_CARD_PROTOTYPE } from "../game/define/CardPrototype";
import type { Effect } from "../game/define/Effect";
import type { Bridge } from "./bridge";
import type { Situation } from "../game/define/Text";
import type { GlobalEffect } from "../game/define/GlobalEffect";
import type { GameState } from "../game/gameState/GameState";
import type { Event } from "../game/define/Event";

export const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "シェンロンガンダム",
  characteristic: "シェンロン系　MS　専用「張五飛」",
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null, null],
  battlePoint: [5, 0, 4],
  texts: [{
    title: ["使用型", ["自軍", "ダメージ判定ステップ"]],
    description: "（自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
    conditions: {
      "〔１〕": {
        title: ["〔x〕", 1]
      },
      "敵軍ユニット１枚": {
        title: ["(交戦中)の(自軍)(ユニット)(１)枚", null, "敵軍", "ユニット", 1]
      }
    },
    logicTreeCommands: [
      {
        actions: [
          {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
              ctx = GameStateFn.addStackEffect(ctx, {
                id: "",
                reason: ["PlayText", DefineFn.EffectFn.getPlayerID(effect), ["origin", "", 0]],
                text: {
                  title: [],
                  logicTreeCommands: [
                    {
                      actions: [
                        {
                          title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            let cardState = GameStateFn.getCardState(ctx, cardId);
                            if (GameStateFn.isBattle(ctx, cardId, null) == false) {
                              const tip = GameStateFn.CardStateFn.getTip(cardState, "敵軍ユニット１枚")
                              const err = DefineFn.TipFn.checkTipSatisfies(tip)
                              if (err) {
                                // add message
                                return ctx
                              }
                              if (tip.title[0] != "カード") {
                                throw new Error("xxx")
                              }
                              const [_, _2, pairs] = tip.title
                              if (pairs.length < 1) {
                                throw new Error("your must select 1")
                              }
                              const [targetCardId, targetBasyou] = pairs[0]
                              ctx = GameStateFn.addCoins(ctx, targetBasyou, targetCardId, [DefineFn.CoinFn.battleBonus([-1, -1, -1])]) as GameState
                              return ctx
                            }
                            cardState = GameStateFn.CardStateFn.setFlag(cardState, "add bonus", true)
                            ctx = GameStateFn.setCardState(ctx, cardId, cardState) as GameState
                            return ctx
                          }.toString()
                        }
                      ]
                    }
                  ]
                }
              }) as GameState
              return ctx
            }.toString()
          }
        ]
      }
    ],
    onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
      const event = DefineFn.EffectFn.getEvent(effect)
      const cardId = DefineFn.EffectFn.getCardID(effect)
      if (event.title[0] == "GameEventOnTiming" && event.title[1][0] == 34) {
        let cardState = GameStateFn.getCardState(ctx, cardId);
        cardState = GameStateFn.CardStateFn.removeFlag(cardState, "add bonus")
        ctx = GameStateFn.setCardState(ctx, cardId, cardState) as GameState
        return ctx
      }
      return ctx
    }.toString(),
    onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
      const cardId = DefineFn.EffectFn.getCardID(effect)
      const cardState = GameStateFn.getCardState(ctx, cardId)
      if (cardState.flags["add bonus"]) {
        return [
          {
            type: "＋x／＋x／＋xを得る",
            cardIds: [cardId],
            value: [1, 1, 1]
          }
        ]
      }
      return []
    }.toString()
  }],
};
