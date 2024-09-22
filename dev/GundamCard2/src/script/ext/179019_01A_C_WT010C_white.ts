// 179019_01A_C_WT010C_white
// 黄昏の魔弾
// 強化
// （戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { PhaseFn } from "../../game/define/Timing";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
export const prototype: CardPrototype = {
  commandText: {
    id: "",
    title: ["使用型", ["戦闘フェイズ"]],
    description: "（戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。",
    conditions: {
      "自軍ユニット１枚": {
        title: ["_自軍_ユニット_１枚", "自軍", "ユニット", 1]
      },
      "「速攻」または「高機動」": {
        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
          return {
            title: ["StringOptions", ["速攻", "高機動"], ["速攻"]],
            count: 1,
          }
        }.toString()
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
              const cardId = DefineFn.EffectFn.getCardID(effect)
              let cs = GameStateFn.getItemState(ctx, cardId)
              const tip1 = DefineFn.ItemStateFn.getTip(cs, "自軍ユニット１枚")
              const tip1Error = DefineFn.TipFn.checkTipSatisfies(tip1)
              if (tip1Error) throw tip1Error
              const pairs1 = DefineFn.TipFn.getSelection(tip1) as StrBaSyouPair[]
              const [targetCardId, targetBasyou] = pairs1[0]
              // check targetMission
              const tip2 = DefineFn.ItemStateFn.getTip(cs, "「速攻」または「高機動」")
              const tip2Error = DefineFn.TipFn.checkTipSatisfies(tip2)
              if (tip2Error) throw tip2Error
              const str2 = DefineFn.TipFn.getSelection(tip2) as string[]
              const strOption = str2[0]
              cs = DefineFn.ItemStateFn.setFlag(cs, "enabled", [targetCardId, strOption])
              ctx = GameStateFn.setItemState(ctx, cardId, cs) as GameState
              return ctx
            }.toString()
          }
        ]
      }
    ],
    onEvent: ["GameEventOnTimingDoAction", PhaseFn.getLast(), { title: ["移除卡狀態_旗標", "enabled"] }],
    // onEvent2: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
    //   const event = DefineFn.EffectFn.getEvent(effect)
    //   const cardId = DefineFn.EffectFn.getCardID(effect)
    //   if (event.title[0] == "GameEventOnTiming" && DefineFn.PhaseFn.isLast(event.title[1])) {
    //     let cardState = GameStateFn.getItemState(ctx, cardId);
    //     cardState = DefineFn.ItemStateFn.removeFlag(cardState, "enabled")
    //     ctx = GameStateFn.setItemState(ctx, cardId, cardState) as GameState
    //     return ctx
    //   }
    //   return ctx
    // }.toString(),
    onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
      const cardId = DefineFn.EffectFn.getCardID(effect)
      const cs = GameStateFn.getItemState(ctx, cardId)
      const enabledOption = cs.flags["enabled"]
      if (enabledOption) {
        const [targetCardId, strOption] = enabledOption
        switch (strOption) {
          case "速攻":
            return [
              { title: ["AddText", { id: "", title: ["特殊型", ["速攻"]] }], cardIds: [targetCardId] }
            ]
          case "高機動":
            return [
              { title: ["AddText", { id: "", title: ["特殊型", ["高機動"]] }], cardIds: [targetCardId] }
            ]
        }
      }
      return []
    }.toString()
  },
};