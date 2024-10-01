
// 179004_01A_CH_WT009R_white
// ラクス・クライン
// 女性　子供　CO
// 【ステイ】　〔１〕：ゲイン　〔１〕：供給
// 『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { EffectFn, type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "「ゲイン」の効果で戦闘修正を得た場合" && evt.cardIds?.every(cid => GameStateFn.getItemController(ctx, cid) == cardController)) {
          const battleBonus = evt.title[1]
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "そのカードのセットグループ以外の自軍ユニット１枚": {
                title: ["Entity", {
                  at: ["戦闘エリア1", "戦闘エリア2", "配備エリア"],
                  side: "自軍",
                  is: ["ユニット"],
                  count: 1,
                  exceptCardIds: GameStateFn.getSetGroup(ctx, cardId)
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["ターン終了時まで「速攻」を得る。", [{ title: ["＋x／＋x／＋xを得る", battleBonus], cardIds: [] }]],
                  vars: ["そのカードのセットグループ以外の自軍ユニット１枚"]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString()
    }
  ],
};
