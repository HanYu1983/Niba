// 179003_01A_O_WT001C_white
// C
// SEED
// OS改竄
// 強化
// （敵軍戦闘フェイズ）〔白２毎〕：自軍ユニット１枚は、ターン終了時まで「速攻」、または「高機動」１つを得る。
import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { EffectFn, type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";
import { Tip } from "../../game/define/Tip";
import { GlobalEffect } from "../../game/define/GlobalEffect";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（敵軍戦闘フェイズ）〔白２毎〕：自軍ユニット１枚は、ターン終了時まで「速攻」、または「高機動」１つを得る。",
      title: ["使用型", ["敵軍", "戦闘フェイズ"]],
      isEachTime: true,
      conditions: {
        ...createRollCostRequire(2, "白"),
        "自軍ユニット１枚": {
          title: ["_自軍_ユニット_１枚", "自軍", "ユニット", 1]
        },
        "「速攻」、または「高機動」１つ": {
          title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
            const ge1: GlobalEffect = {
              title: ["AddText", {
                id: `179003_01A_O_WT001C_white_gain_1`,
                title: ["特殊型", ["速攻"]],
              }],
              cardIds: []
            }
            const ge2: GlobalEffect = {
              title: ["AddText", {
                id: `179003_01A_O_WT001C_white_gain_2`,
                title: ["特殊型", ["高機動"]],
              }],
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
                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ユニット１枚", cardId)
                    const selections = GameStateFn.getCardTipSelection(ctx, "「速攻」、または「高機動」１つ", cardId) as GlobalEffect[]
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