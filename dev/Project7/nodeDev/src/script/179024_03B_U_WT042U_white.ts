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
import type { GlobalEffect } from "../game/define/GlobalEffect";
import type { GameState } from "../game/gameState/GameState";
import type { StrBaSyouPair, Tip } from "../game/define/Tip";
import { TimingFn } from "../game/define/Timing";

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
      "このカードが非交戦中の場合、敵軍ユニット１枚": {
        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip[] {
          const cardId = DefineFn.EffectFn.getCardID(effect)
          if (GameStateFn.isBattle(ctx, cardId, null)) {
            return []
          }
          return GameStateFn.getConditionTitleFn({
            title: ["(交戦中)の(自軍)(ユニット)(１)枚", null, "敵軍", "ユニット", 1]
          }, {})(ctx, effect, null)
        }.toString()
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
              const cardId = DefineFn.EffectFn.getCardID(effect)
              ctx = GameStateFn.addStackEffect(ctx, {
                reason: ["PlayText", DefineFn.EffectFn.getPlayerID(effect), cardId, effect.text.id || "unknown"],
                text: {
                  title: [],
                  logicTreeActions: [
                    {
                      actions: [
                        {
                          title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            if (GameStateFn.isBattle(ctx, cardId, null)) {
                              let cardState = GameStateFn.getItemState(ctx, cardId);
                              cardState = DefineFn.ItemStateFn.setFlag(cardState, "add bonus", true)
                              ctx = GameStateFn.setItemState(ctx, cardId, cardState) as GameState
                              return ctx
                            }
                            return GameStateFn.getActionTitleFn({
                              title: ["(－１／－１／－１)コイン(１)個を乗せる", [-1, -1, -1], 1],
                              var: "このカードが非交戦中の場合、敵軍ユニット１枚"
                            })(ctx, effect, null)
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
    onEvent: ["GameEventOnTimingDoAction", TimingFn.getLast(), { title: ["移除卡狀態_旗標", "add bonus"] }],
    // onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
    //   const event = DefineFn.EffectFn.getEvent(effect)
    //   const cardId = DefineFn.EffectFn.getCardID(effect)
    //   if (event.title[0] == "GameEventOnTiming" && event.title[1][0] == 34) {
    //     let cardState = GameStateFn.getItemState(ctx, cardId);
    //     cardState = DefineFn.ItemStateFn.removeFlag(cardState, "add bonus")
    //     ctx = GameStateFn.setItemState(ctx, cardId, cardState) as GameState
    //     return ctx
    //   }
    //   return ctx
    // }.toString(),
    onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
      const cardId = DefineFn.EffectFn.getCardID(effect)
      const cardState = GameStateFn.getItemState(ctx, cardId)
      if (cardState.flags["add bonus"]) {
        return [
          {
            title: ["＋x／＋x／＋xを得る", [1, 1, 1]],
            cardIds: [cardId],
          }
        ]
      }
      return []
    }.toString()
  }],
};
