// 179001_01A_CH_WT006C_white
// C
// SEED
// ディアッカ・エルスマン
// 男性　子供　CO
// （ダメージ判定ステップ）〔２〕：このセットグループのユニットは、ターン終了時まで、「〔０〕：範囲兵器（３）」、または「範囲兵器」＋１を得る。

import { CardPrototype, CardColor } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  __ignoreAutoTexts: true,
  texts: [
    {
      id: "",
      description: "（ダメージ判定ステップ）〔２〕：このセットグループのユニットは、ターン終了時まで、「〔０〕：範囲兵器（３）」、または「範囲兵器」＋１を得る。",
      title: ["使用型", ["ダメージ判定ステップ"]],
      conditions: {
        ...createRollCostRequire(2, null),
        "このセットグループのユニット": {
          title: ["このセットグループの_ユニットは", "ユニット"]
        },
        "「〔０〕：範囲兵器（３）」、または「範囲兵器」＋１": {
          title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
            const ge1: GlobalEffect = {
              title: ["AddText", {
                id: `179001_01A_CH_WT006C_white_gain_1`,
                title: ["特殊型", ["範囲兵器", 3]],
              }],
              cardIds: []
            }
            const ge2: GlobalEffect = {
              title: ["SpecialEffectBonus", ["範囲兵器", 1]],
              cardIds: []
            }
            return {
              title: ["GlobalEffects", [ge1, ge2], [ge1]],
              count: 1
            }
          }.toString()
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "このセットグループのユニット", cardId)
                    const selections = GameStateFn.getCardTipSelection(ctx, "「〔０〕：範囲兵器（３）」、または「範囲兵器」＋１", cardId) as GlobalEffect[]
                    pairs.forEach(pair => {
                      selections.forEach(ge => {
                        ge.cardIds = [pair[0]]
                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [ge], pair)
                      })
                    })
                    return ctx
                  }.toString()
                }
              ]]
            }
          ]
        }
      ]
    }
  ],
};

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