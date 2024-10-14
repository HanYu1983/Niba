// 179028_10D_U_WT177R_white
// R
// W
// ウイングガンダム
// ウイング系　MS　専用「ヒイロ・ユイ」
// 戦闘配備　高機動　〔０〕：改装［ウイング系］
// 『恒常』：このカードは、合計国力＋１してプレイできる。その場合、このカードは、ターン終了時まで合計国力＋１を得る。
// 『起動』：このカードは場に出た場合、ターン終了時まで以下のテキストを得る。
// 「『起動』：このカードが攻撃に出撃した場合、自軍本国をX回復する。Xの値は、このカードの合計国力の値と同じとする」
// p76
// ●【 1 】
// 【 】内 に 記 さ れ て い る 効 果 や 、 そ の 未 解 決 の 効 果 は 、 こ の 記 述 を 持 つ カ ー ド が G で は な い 場 合 。
// 無 効 に し た り 変 更 さ れ ま せ ん 。 ま た 効 果 に よ っ て 、 別 の カ ー ド が 【 】 を 含 め た そ の 記 述 と 、 同 ⼀ の
// テ キ ス ト を 得 る 事 が で き ま せ ん 。
// ● く ＞
// く ＞ 内 に 記 述 さ れ て い る 効 果 や 、 そ の 未 解 決 の 効 果 は 、 こ の 記 述 を 持 つ カ ー ド が 6 と し て プ レ イ
// さ れ る 場 合 、 ま た は 、 G で あ る 間 、 無 効 に し た り 変 更 さ れ ま せ ん 。 ま た 効 果 に よ っ て 、 別 の カ ー ド が
// ＜ ＞ を 含 め た そ の 記 述 と 、 同 ⼀ の テ キ ス ト を 得 る 事 が で き ま せ ん 。

import { CardPrototype } from "../../game/define/CardPrototype";
import type { Effect } from "../../game/define/Effect";
import type { Bridge } from "../bridge";
import type { GlobalEffect } from "../../game/define/GlobalEffect";
import { type GameState } from "../../game/gameState/GameState";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『恒常』：このカードは、合計国力＋１してプレイできる。その場合、このカードは、ターン終了時まで合計国力＋１を得る。",
      title: ["自動型", "恒常"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const hasSpecialPlayX = DefineFn.ItemStateFn.getMoreTotalRollCostLengthPlay(GameStateFn.getItemState(ctx, cardId))
        const ret: GlobalEffect[] = []
        if (hasSpecialPlayX) {
          ret.push({ title: ["合計国力_＋１", hasSpecialPlayX], cardIds: [cardId] })
        }
        ret.push({ title: ["合計国力_＋１してプレイできる", 1], cardIds: [cardId] })
        return ret
      }.toString()
    },
    {
      id: "",
      description: "『起動』：このカードは場に出た場合、ターン終了時まで以下のテキストを得る。「『起動』：このカードが攻撃に出撃した場合、自軍本国をX回復する。Xの値は、このカードの合計国力の値と同じとする」",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードが場に出た場合" && event.cardIds?.includes(cardId)) {
          ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx,
            [
              {
                title: ["AddText", {
                  id: `179028_10D_U_WT177R_white_ターン終了時まで以下のテキストを得る`,
                  description: "「『起動』：このカードが攻撃に出撃した場合、自軍本国をX回復する。Xの値は、このカードの合計国力の値と同じとする」",
                  title: ["自動型", "起動"],
                  protectLevel: 1,
                  onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const cardController = GameStateFn.getItemController(ctx, cardId)
                    const event = DefineFn.EffectFn.getEvent(effect)
                    if (event.title[0] == "このカードが攻撃に出撃した場合" && event.cardIds?.includes(cardId)) {
                      const totalCostLength = GameStateFn.getCardTotalCostLength(ctx, cardId)
                      ctx = GameStateFn.doCountryDamage(ctx, cardController, -totalCostLength)
                    }
                    return ctx
                  }.toString()
                }],
                cardIds: [cardId]
              }
            ],
            [cardId, GameStateFn.getItemBaSyou(ctx, cardId)]
          )
        }
        return ctx
      }.toString(),
    }
  ],
};
