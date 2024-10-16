// 179003_01A_CH_GN001R_green
// R
// GUNDAM
// シャア・アズナブル
// 男性　大人　NT
// 『恒常』：このカードは、「専用機のセット」が成立するユニットにセットする場合、合計国力２としてプレイできる。
// （自軍攻撃ステップ）〔２〕：このカードが戦闘エリアにいる場合、敵軍ユニット１枚に３ダメージを与える。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『恒常』：このカードは、「専用機のセット」が成立するユニットにセットする場合、合計国力２としてプレイできる。",
      title: ["自動型", "恒常"],
      createPlayEffect: function _(ctx: any, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): Effect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const prototype = GameStateFn.getItemPrototype(ctx, cardId)
        const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
          hasChar: [prototype.title || ""],
          hasSetCard: false,
          side: "自軍",
          at: ["配備エリア"],
          is: ["ユニット"],
          count: 1
        }, {ges: Options.ges})
        if (DefineFn.TipFn.createTipErrorWhenCheckFail(tip) != null) {
          return []
        }
        const ges = GameStateFn.getGlobalEffects(ctx, null)
        const text: CardText = {
          id: effect.text.id,
          description: "『恒常』：このカードは、「専用機のセット」が成立するユニットにセットする場合、合計国力２としてプレイできる。",
          title: ["使用型", ["自軍", "配備フェイズ"]],
          conditions: {
            ...GameStateFn.createPlayCardConditions(ctx, cardId, {ges: ges}),
            // 覆寫以下兩個鍵
            [DefineFn.TipFn.createCharacterTargetUnitKey()]: {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): Tip | null {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const prototype = GameStateFn.getItemPrototype(ctx, cardId)
                const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
                  hasChar: [prototype.title || ""],
                  hasSetCard: false,
                  side: "自軍",
                  at: ["配備エリア"],
                  is: ["ユニット"],
                  count: 1
                }, {ges: Options.ges})
                if (DefineFn.TipFn.createTipErrorWhenCheckFail(tip) == null) {
                  return tip
                }
                return {
                  title: ["カード", [], []],
                  count: 1
                }
              }.toString(),
            },
            [DefineFn.TipFn.createTotalCostKey()]: {
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
        return [{ ...effect, isOption: true, text: text }]
      }.toString()
    },
    {
      id: "",
      description: "（自軍攻撃ステップ）〔２〕：このカードが戦闘エリアにいる場合、敵軍ユニット１枚に３ダメージを与える。",
      title: ["使用型", ["自軍", "攻撃ステップ"]],
      conditions: {
        ...createRollCostRequire(2, null),
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