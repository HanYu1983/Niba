// 179003_01A_CH_GN001R_green
// R
// GUNDAM
// シャア・アズナブル
// 男性　大人　NT
// 『恒常』：このカードは、「専用機のセット」が成立するユニットにセットする場合、合計国力２としてプレイできる。
// （自軍攻撃ステップ）〔２〕：このカードが戦闘エリアにいる場合、敵軍ユニット１枚に３ダメージを与える。

import { CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  dynamicPlayCardTexts(ctx: GameState, cardId: string, bridge: Bridge): CardText[] {
    const { DefineFn, GameStateFn } = bridge
    const prototype = GameStateFn.getItemPrototype(ctx, cardId)
    const playerId = GameStateFn.getItemOwner(ctx, cardId)
    const cardRollCostLength = GameStateFn.getCardTotalCostLength(ctx, cardId)
    const costConditions: { [key: string]: Condition } = {
      [DefineFn.TipFn.createTotalCostKey()]: {
        actions: [
          {
            title: ["合計国力〔x〕", cardRollCostLength]
          }
        ]
      },
    }
    const rollCostConditions = GameStateFn.createRollCostConditions(ctx, prototype, prototype.rollCost || [], 0)
    return [
      {
        id: "",
        description: "『恒常』：このカードは、「専用機のセット」が成立するユニットにセットする場合、合計国力２としてプレイできる。",
        title: ["使用型", ["自軍", "配備フェイズ"]],
        conditions: {
          ...costConditions,
          ...rollCostConditions,
          [DefineFn.TipFn.createCharacterTargetUnitKey()]: {
            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): Tip | null {
              const cardId = DefineFn.EffectFn.getCardID(effect)
              const prototype = GameStateFn.getItemPrototype(ctx, cardId)
              const tip = GameStateFn.createTipByEntitySearch(ctx, cardId, {
                hasChar: [prototype.title || ""],
                side: "自軍",
                at: ["配備エリア"],
                is: ["ユニット"],
                count: 1
              })
              if (DefineFn.TipFn.checkTipSatisfies(tip)) {
                return tip
              }
              return {
                title: ["カード", [], []],
                count: 1
              }
            }.toString(),
          },
          "合計国力２": {
            actions: [
              {
                title: ["合計国力〔x〕", 2]
              }
            ]
          },
        },
        logicTreeActions: [
          {
            actions: [
              {
                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                  const newE = GameStateFn.createCharOpUnitGoStageEffectFromPlayEffect(ctx, effect)
                  return GameStateFn.addStackEffect(ctx, newE) as GameState
                }.toString()
              }
            ]
          }
        ]
      }
    ]
  },
  texts: [
    {
      id: "",
      description: "（自軍攻撃ステップ）〔２〕：このカードが戦闘エリアにいる場合、敵軍ユニット１枚に３ダメージを与える。",
      title: ["使用型", ["自軍", "攻撃ステップ"]],
      conditions: {
        "このカードが戦闘エリアにいる場合": {
          actions: [
            {
              title: ["Entity", {
                isThisCard: true,
                at: ["戦闘エリア1", "戦闘エリア2"],
                count: 1,
              }]
            }
          ]
        },
        "敵軍ユニット１枚に": {
          title: ["Entity", {
            atBa: true,
            side: "敵軍",
            is: ["ユニット"],
            count: 1
          }]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["_１ダメージを与える", 3],
                  vars: ["敵軍ユニット１枚に"]
                }
              ]]
            }
          ]
        }
      ]
    }
  ],
};
