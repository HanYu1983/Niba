// 179007_02A_U_GN020R_green_02
// R
// GUNDAM
// ビグ・ザム［†］【箔押しVer.】
// ビグ・ザム系　MA　専用「ドズル・ザビ」
// 戦闘配備
// 『常駐』：このカードが受ける全ての通常ダメージは、２減殺される。
// （ダメージ判定ステップ）〔X〕：このカードが攻撃に出撃している、または交戦中の場合、全ての敵軍ユニットにXダメージを与える。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『常駐』：このカードが受ける全ての通常ダメージは、２減殺される。",
      title: ["自動型", "常駐"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        return [
          {
            title: ["このカードが受ける全ての_通常ダメージは、_２減殺される", "通常ダメージ", 2],
            cardIds: [cardId]
          },
        ]
      }.toString()
    },
    {
      id: "",
      description: "（ダメージ判定ステップ）〔X〕：このカードが攻撃に出撃している、または交戦中の場合、全ての敵軍ユニットにXダメージを与える。",
      title: ["使用型", ["自軍", "戦闘フェイズ"]],
      conditions: {
        "〔X〕": {
          title: ["RollColor", null]
        },
        "このカードが攻撃に出撃している": {
          actions: [
            {
              title: ["このカードが攻撃に出撃している"]
            }
          ]
        },
        "このカードが交戦中の場合": {
          actions: [
            {
              title: ["このカードが交戦中の場合"]
            }
          ]
        },
      },
      logicTreeActions: [
        {
          logicTree: {
            type: "And",
            children: [
              {
                type: "Leaf",
                value: "〔X〕"
              },
              {
                type: "Or",
                children: [
                  {
                    type: "Leaf",
                    value: "このカードが攻撃に出撃している"
                  },
                  {
                    type: "Leaf",
                    value: "このカードが交戦中の場合"
                  }
                ]
              }
            ]
          },
          actions: [
            {
              title: ["cutIn", [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const x = GameStateFn.getCardTipStrBaSyouPairs(ctx, "〔X〕", cardId).length
                    const pairs = DefineFn.TipFn.getSelection(GameStateFn.createTipByEntitySearch(ctx, effect, {
                      atBa: true,
                      side: "敵軍",
                      is: ["ユニット"],
                      max: 50,
                      asMuchAsPossible: true,
                    }, {ges: Options.ges})) as StrBaSyouPair[]
                    for (const pair of pairs) {
                      ctx = GameStateFn.doItemDamage(ctx, effect, x, pair)
                    }
                    return ctx
                  }.toString()
                },
              ]]
            }
          ]
        }
      ],
    }
  ]
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