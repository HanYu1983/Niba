// 179024_03B_U_WT042U_white
// U
// W
// シェンロンガンダム
// シェンロン系　MS　専用「張五飛」
// 〔０〕：改装［シェンロン系］
// （自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。
import { CardPrototype } from "../game/define/CardPrototype";
import type { Effect } from "../game/define/Effect";
import type { Bridge } from "./bridge";
import type { GameState } from "../game/gameState/GameState";
import type { StrBaSyouPair, Tip } from "../game/define/Tip";

export const prototype: CardPrototype = {
  title: "シェンロンガンダム",
  characteristic: "シェンロン系　MS　専用「張五飛」",
  category: "ユニット",
  gsign: [["白"], "W"],
  rollCost: ["白", null, null, null],
  battlePoint: [5, 0, 4],
  texts: [{
    id: "",
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
                  id: "",
                  title: [],
                  logicTreeActions: [
                    {
                      actions: [
                        {
                          title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                            const cardId = DefineFn.EffectFn.getCardID(effect)
                            if (GameStateFn.isBattle(ctx, cardId, null)) {
                              let cardState = GameStateFn.getItemState(ctx, cardId);
                              cardState = DefineFn.ItemStateFn.setGlobalEffect(cardState, null, true, {
                                title: ["AddText", { id: ToolFn.getUUID("179024_03B_U_WT042U_white") , title: ["TextBattleBonus", [1, 1, 1]] }],
                                cardIds: [cardId]
                              })
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
  }],
};
