
// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。
import { title } from "process";
import type { CardPrototype } from "../../game/define/CardPrototype";
import { createRollCostRequire } from "../../game/define/CardText";
import type { Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        ...createRollCostRequire(2, null),
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                ctx = GameStateFn.addStackEffect(ctx, {
                  id: "",
                  reason: effect.reason,
                  description: effect.description,
                  text: {
                    id: effect.text.id,
                    title: effect.text.title,
                    description: effect.text.description,
                    logicTreeActions: [
                      {
                        actions: [
                          {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                              const cardId = DefineFn.EffectFn.getCardID(effect)
                              const targetId = GameStateFn.getSetGroupRoot(ctx, cardId)
                              ctx = GameStateFn.mapItemState(ctx, targetId, is =>
                                DefineFn.ItemStateFn.setGlobalEffect(is, null,
                                  { title: ["AddText", { id: "", title: ["特殊型", ["速攻"]] }], cardIds: [targetId] },
                                  { isRemoveOnTurnEnd: true }
                                )
                              ) as GameState
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
            },
          ]
        }
      ]
    }
  ],
};
