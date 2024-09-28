

// 179025_07D_U_RD156R_red
// R
// F91
// ガンダムF91
// F91系　MS　レジェンド　専用｢シーブック・アノー｣
// クイック　高機動　〔１〕：改装〔F91系〕
// 『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
// 『起動』：このカードが場に出た場合、ユニットとキャラ以外の敵軍カード１枚のプレイを無効にし、そのカードを廃棄する。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      title: ["自動型", "恒常"],
      description: "『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        const phase = GameStateFn.getPhase(ctx)
        return [{ title: ["合計国力＋(１)してプレイできる", -3], cardIds: [cardId] }]
      }.toString(),
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const evt = DefineFn.EffectFn.getEvent(effect)
        const hasSpecialPlayX = DefineFn.ItemStateFn.getMoreTotalRollCostLengthPlay(GameStateFn.getItemState(ctx, cardId))
        if (evt.title[0] == "カット終了時" && hasSpecialPlayX) {
          ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "ジャンクヤード"), GameStateFn.createStrBaSyouPair(ctx, cardId))
        }
        return ctx
      }.toString()
    },
    {
      id: "",
      title: ["自動型", "起動"],
      description: "『起動』：このカードが場に出た場合、ユニットとキャラ以外の敵軍カード１枚のプレイを無効にし、そのカードを廃棄する。",
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "ユニットとキャラ以外の敵軍カード１枚のプレイ": {
                title: ["Entity", {
                  at: ["プレイされているカード"],
                  side: "敵軍",
                  is: ["ACE", "オペレーション", "オペレーション(ユニット)", "グラフィック", "コマンド"],
                  count: 1,
                }],
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const cardController = GameStateFn.getItemController(ctx, cardId)
                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "ユニットとキャラ以外の敵軍カード１枚のプレイ", cardId)
                    const pairIds = pairs.map(i => i[0])
                    const targetEs = GameStateFn.getStackEffects(ctx).filter(e => e.reason[0] == "場に出る" && pairIds.includes(DefineFn.EffectFn.getCardID(e)))
                    for (const targetE of targetEs) {
                      ctx = GameStateFn.removeEffect(ctx, targetE.id) as GameState
                    }
                    for (const pair of pairs) {
                      ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "ジャンクヤード"), pair)
                    }
                    return ctx
                  }.toString(),
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
          return ctx
        }
        return ctx
      }.toString()
    }
  ]
}