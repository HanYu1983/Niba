// 179025_07D_U_RD158C_red
// C
// F91
// ガンダムF91（ツインヴェスバータイプ）
// F91系　MS　専用｢シーブック・アノー｣
// クイック　〔１〕：改装〔F91系〕
// 『恒常』：このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
// 『起動』：このカードが場に出た場合、戦闘エリアにいる敵軍ユニット１～２枚をロールする。

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
      description: "『恒常』：このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        const phase = GameStateFn.getPhase(ctx)
        if (phase[0] == "戦闘フェイズ" && phase[1] == "ダメージ判定ステップ") {

        } else {
          return []
        }
        return [{ title: ["合計国力_＋１してプレイできる", -3], cardIds: [cardId] }]
      }.toString(),
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const evt = DefineFn.EffectFn.getEvent(effect)
        const hasSpecialPlayX = DefineFn.ItemStateFn.getMoreTotalRollCostLengthPlay(GameStateFn.getItemState(ctx, cardId))
        if (evt.title[0] == "カット終了時" && hasSpecialPlayX) {
          ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.of(cardController, "ジャンクヤード"), GameStateFn.createStrBaSyouPair(ctx, cardId), { ges: Options.ges }) as GameState
        }
        return ctx
      }.toString()
    },
    {
      id: "",
      title: ["自動型", "起動"],
      description: "『起動』：このカードが場に出た場合、戦闘エリアにいる敵軍ユニット１～２枚をロールする。",
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "戦闘エリアにいる敵軍ユニット１～２枚を": {
                title: ["Entity", { at: ["戦闘エリア1", "戦闘エリア2"], side: "敵軍", is: ["ユニット"], min: 1, max: 2 }],
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_ロールする", "ロール"],
                  vars: ["戦闘エリアにいる敵軍ユニット１～２枚を"]
                },
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString()
    }
  ]
}