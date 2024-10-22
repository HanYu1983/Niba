// 179030_11E_C_GN074R_green
// R
// 閃光のハサウェイ
// ファンネルミサイル
// 移動　装弾
// 『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、カード１枚を引く。
// （戦闘フェイズ）：ロール状態の敵軍ユニット１枚を、持ち主の手札に移す。

import { BaSyouKeyword } from "../../game/define/BaSyou";
import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、カード１枚を引く。",
      title: ["自動型", "恒常"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (
          event.title[0] == "解決直後" &&
          event.effect != null &&
          event.effect.text.id == "179030_11E_C_GN074R_green__2" &&
          DefineFn.EffectFn.getCardID(event.effect) == cardId
        ) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "本来の記述に｢特徴：装弾｣を持つ自軍G１枚": {
                title: ["Entity", {
                  at: ["Gゾーン"],
                  hasChar: ["装弾"],
                  side: "自軍",
                  isRoll: false,
                  count: 1
                }]
              },
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_ロールする", "ロール"],
                  vars: ["本来の記述に｢特徴：装弾｣を持つ自軍G１枚"]
                },
                {
                  title: ["カード_１枚を引く", 1]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
    }
  ],
  commandText: {
    id: "179030_11E_C_GN074R_green__2",
    description: "（戦闘フェイズ）：ロール状態の敵軍ユニット１枚を、持ち主の手札に移す。",
    title: ["使用型", ["戦闘フェイズ"]],
    testEnvs: [
      {
        addCards: [
          ["敵軍", "戦闘エリア2", [{ id: "1", protoID: "unit", isRoll: true }]]
        ],
        createCards: [
          ["自軍", "本国", [["unit", 1]]]
        ]
      }
    ],
    conditions: {
      "ロール状態の敵軍ユニット１枚": {
        title: ["Entity", {
          atBa: true,
          isRoll: true,
          side: "敵軍",
          is: ["ユニット"],
          count: 1,
        }]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [
              {
                title: ["_の_ハンガーに移す", "持ち主", "手札"],
                vars: ["ロール状態の敵軍ユニット１枚"]
              },
              {
                title: ["triggerEvent", { title: ["解決直後"] }]
              }
            ]]
          }
        ]
      }
    ]
  }
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