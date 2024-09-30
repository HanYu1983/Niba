// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。
import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import type { Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

function createRollCostRequire(
  costNum: number,
  color: CardColor | null
): { [key: string]: Condition } {
  let ret: { [key: string]: Condition } = {}
  for (let i = 0; i < costNum; ++i) {
    const key = `${i}[${color}]`
    ret = {
      ...ret,
      [key]: {
        title: ["RollColor", color],
        actions: [
          {
            title: ["_ロールする", "ロール"],
            vars: [key]
          }
        ]
      }
    };
  }
  return ret
}

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
      title: ["使用型", ["戦闘フェイズ"]],
      conditions: {
        ...createRollCostRequire(2, null),
        "このセットグループのユニットは": {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const rootId = GameStateFn.getSetGroupRoot(ctx, cardId)
                if (GameStateFn.isSetGroupHasA(ctx, ["速攻"], rootId)) {
                  throw new DefineFn.TipError(`速攻已有了:${cardId}:${effect.text.description}`)
                }
                return ctx
              }.toString()
            }
          ]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                  logicTreeAction: {
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
                })
                ctx = GameStateFn.addStackEffect(ctx, newE) as GameState
                return ctx
              }.toString()
            },
          ]
        }
      ]
    }
  ],
};
