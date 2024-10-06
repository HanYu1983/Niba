// 179022_06C_CH_WT057R_white
// 叢雲劾
// 男性　大人　CO
// 〔白２〕：共有［ブルーフレーム系］
// 『常駐』：このカードは、「専用機のセット」が成立するユニットにセットされている場合、「速攻」「強襲」を得る。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { EffectFn, type Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『常駐』：このカードは、「専用機のセット」が成立するユニットにセットされている場合、「速攻」「強襲」を得る。",
      title: ["自動型", "常駐"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        if (GameStateFn.isCardMaster(ctx, GameStateFn.getSetGroupRoot(ctx, cardId), cardId)) {
          return [
            {
              title: ["AddText", { id: "", title: ["特殊型", ["速攻"]] }],
              cardIds: [cardId]
            },
            {
              title: ["AddText", { id: "", title: ["特殊型", ["強襲"]] }],
              cardIds: [cardId]
            }
          ]
        }
        return []
      }.toString()
    }
  ],
};
