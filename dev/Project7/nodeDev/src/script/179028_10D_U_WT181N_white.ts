// 179028_10D_U_WT181N_white
// N
// W
// シェンロンガンダム［†］
// シェンロン系　MS　専用「張五飛」
// 戦闘配備　〔０〕：改装［シェンロン系］
// 『恒常』：このカードは、合計国力＋１してプレイできる。その場合、このカードは、ターン終了時まで合計国力＋１を得る。
//『起動』：このカードは場に出た場合、ターン終了時まで、＋X／±０／＋Xを得る。Xの値は、このカードの合計国力の値－１とする。

import { CardPrototype, DEFAULT_CARD_PROTOTYPE } from "../game/define/CardPrototype";
import type { Effect } from "../game/define/Effect";
import type { Bridge } from "./bridge";
import type { GlobalEffect } from "../game/define/GlobalEffect";
import { type GameState } from "../game/gameState/GameState";

export const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "シェンロンガンダム［†］",
  characteristic: "シェンロン系　MS　専用「張五飛」",
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null, null],
  battlePoint: [4, 0, 4],
  texts: [
    {
      id: "",
      title: ["特殊型", ["戦闘配備"]]
    },
    {
      id: "",
      title: ["特殊型", ["改装", "シェンロン系"]]
    },
    {
      id: "",
      description: "『恒常』：このカードは、合計国力＋１してプレイできる。その場合、このカードは、ターン終了時まで合計国力＋１を得る。",
      title: ["自動型", "恒常"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        return [{ title: ["合計国力＋(１)してプレイできる", 1], cardIds: [DefineFn.EffectFn.getCardID(effect)] }]
      }.toString()
    },
    {
      id: "",
      description: "『起動』：このカードは場に出た場合、ターン終了時まで、＋X／±０／＋Xを得る。Xの値は、このカードの合計国力の値－１とする。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        let state = GameStateFn.getItemState(ctx, cardId)
        if (event.title[0] == "場に出た場合" && event.cardIds?.includes(cardId)) {
          const totalCostLength = GameStateFn.getCardRollCostLength(ctx, cardId) - 1
          state = DefineFn.ItemStateFn.setFlag(state, "bonus", totalCostLength)
        }
        if (event.title[0] == "GameEventOnTiming" && DefineFn.PhaseFn.eq(event.title[1], DefineFn.PhaseFn.getLast())) {
          state = DefineFn.ItemStateFn.removeFlag(state, "bonus")
        }
        ctx = GameStateFn.setItemState(ctx, cardId, state) as GameState
        return ctx
      }.toString(),
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const hasSpecialPlayX = DefineFn.ItemStateFn.getMoreTotalRollCostLengthPlay(GameStateFn.getItemState(ctx, cardId))
        const ret: GlobalEffect[] = []
        if (hasSpecialPlayX) {
          ret.push({ title: ["合計国力＋(１)", hasSpecialPlayX], cardIds: [cardId] })
        }
        const totalCostLength = GameStateFn.getItemState(ctx, cardId).flags["bonus"]
        if (totalCostLength) {
          ret.push({ title: ["＋x／＋x／＋xを得る", [totalCostLength, 0, totalCostLength]], cardIds: [cardId] })
        }
        return ret
      }.toString()
    }
  ],
};
