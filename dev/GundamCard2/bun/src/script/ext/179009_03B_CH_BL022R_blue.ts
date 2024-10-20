

// 179009_03B_CH_BL022R_blue
// R
// UC
// ナイジェル・ギャレット
// 男性　大人　トライスター
// （戦闘フェイズ）〔１〕：ユニットが３枚以上の部隊にいる、全ての自軍ユニットは、ターン終了時まで「速攻」を得る。

import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { EffectFn, type Effect } from "../../game/define/Effect";
import { StrBaSyouPair } from "../../game/define/Tip";
import type { GameState } from "../../game/gameState/GameState";
import { LogicTree } from "../../tool/logicTree";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔１〕：ユニットが３枚以上の部隊にいる、全ての自軍ユニットは、ターン終了時まで「速攻」を得る。",
      title: ["使用型", ["戦闘フェイズ"]],
      testEnvs: [
        {
          createCards: [
            ["自軍", "配備エリア", [["179009_03B_CH_BL022R_blue", 1]]],
            ["自軍", "戦闘エリア1", [["unit", 3]]],
            ["自軍", "Gゾーン", [["unit", 1]]]
          ]
        },
        {
          createCards: [
            ["自軍", "配備エリア", [["179009_03B_CH_BL022R_blue", 1]]],
            ["自軍", "戦闘エリア2", [["unit", 3]]],
            ["自軍", "Gゾーン", [["unit", 1]]]
          ]
        }
      ],
      conditions: {
        ...createRollCostRequire(1, null),
        "ユニットが３枚以上の部隊にいる、全ての自軍ユニット1": {
          title: ["Entity", {
            at: ["戦闘エリア1"],
            side: "自軍",
            is: ["ユニット"],
            min: 3,
            max: 50,
            asMuchAsPossible: true,
            returnNullIfNotPassCondition: true
          }],
        },
        "ユニットが３枚以上の部隊にいる、全ての自軍ユニット1_2": {
          actions: [
            {
              title: ["Entity", {
                at: ["戦闘エリア1"],
                side: "自軍",
                is: ["ユニット"],
                min: 3,
              }],
            }
          ]
        },
        "ユニットが３枚以上の部隊にいる、全ての自軍ユニット2": {
          title: ["Entity", {
            at: ["戦闘エリア2"],
            side: "自軍",
            is: ["ユニット"],
            min: 3,
            max: 50,
            asMuchAsPossible: true,
            returnNullIfNotPassCondition: true
          }]
        },
        "ユニットが３枚以上の部隊にいる、全ての自軍ユニット2_2": {
          actions: [
            {
              title: ["Entity", {
                at: ["戦闘エリア2"],
                side: "自軍",
                is: ["ユニット"],
                min: 3,
              }],
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
                type: "And",
                children: [
                  ...Object.keys(createRollCostRequire(1, null)).map(key => {
                    return {
                      type: "Leaf",
                      value: key
                    } as LogicTree
                  }),
                  {
                    type: "Leaf",
                    value: "ユニットが３枚以上の部隊にいる、全ての自軍ユニット1"
                  },
                  {
                    type: "Leaf",
                    value: "ユニットが３枚以上の部隊にいる、全ての自軍ユニット2"
                  }
                ]
              },
              {
                type: "Or",
                children: [
                  {
                    type: "Leaf",
                    value: "ユニットが３枚以上の部隊にいる、全ての自軍ユニット1_2"
                  },
                  {
                    type: "Leaf",
                    value: "ユニットが３枚以上の部隊にいる、全ての自軍ユニット2_2"
                  }
                ]
              }
            ]
          },
          actions: [
            {
              title: ["cutIn", [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const tip1 = GameStateFn.getItemState(ctx, cardId).tips["ユニットが３枚以上の部隊にいる、全ての自軍ユニット1"]
                    if (tip1) {
                      const pairs = DefineFn.TipFn.getSelection(tip1) as StrBaSyouPair[]
                      for (const pair of pairs) {
                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: ["AddText", { id: ToolFn.getUUID("ユニットが３枚以上の部隊にいる、全ての自軍ユニット1"), title: ["特殊型", ["速攻"]] }], cardIds: [pair[0]] }], pair)
                      }
                    }
                    const tip2 = GameStateFn.getItemState(ctx, cardId).tips["ユニットが３枚以上の部隊にいる、全ての自軍ユニット2"]
                    if (tip2) {
                      const pairs = DefineFn.TipFn.getSelection(tip1) as StrBaSyouPair[]
                      for (const pair of pairs) {
                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, [{ title: ["AddText", { id: ToolFn.getUUID("ユニットが３枚以上の部隊にいる、全ての自軍ユニット2"), title: ["特殊型", ["速攻"]] }], cardIds: [pair[0]] }], pair)
                      }
                    }
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