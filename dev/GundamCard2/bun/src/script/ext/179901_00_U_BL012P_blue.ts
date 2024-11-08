// 179901_00_U_BL012P_blue
// P
// ΖΖ
// Gフォートレス
// ΖΖ系　MA　専用「ジュドー・アーシタ」
// 〔０〕：改装［ΖΖ系］
// 『起動』：このカードが、自軍効果で戦闘エリアに出た場合、自軍ジャンクヤードにある、「特徴：ΖΖ系」を持つユニット１枚を自軍ハンガーに移す事ができる。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードが、自軍効果で戦闘エリアに出た場合、自軍ジャンクヤードにある、「特徴：ΖΖ系」を持つユニット１枚を自軍ハンガーに移す事ができる。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "戦闘エリア2", { id: "thisCard", protoID: "179901_00_U_BL012P_blue" }, null],
          event: {
            title: [
              "GameEventOnMove",
              { id: "AbsoluteBaSyou", value: ["自軍", "Gゾーン"] },
              { id: "AbsoluteBaSyou", value: ["自軍", "戦闘エリア2"] }
            ],
            cardIds: ["thisCard"],
            effect: {
              id: "",
              reason: ["PlayText", "PlayerA", "", ""],
              text: {
                id: "",
                title: ["自動型", "起動"],
              }
            }
          },
          addCards: [
            ["自軍", "ジャンクヤード", [{ id: "unit", protoID: "179029_05C_U_BL102R_blue" }]],
          ],
          checkFn: function _(ctx: GameState, { GameStateFn }: Bridge): void {
            if (GameStateFn.getPlayerJunkyardIds(ctx, "PlayerA").length != 0) {
              throw new Error()
            }
            if (GameStateFn.getPlayerHungerIds(ctx, "PlayerA").length != 1) {
              throw new Error()
            }
          }
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const event = DefineFn.EffectFn.getEvent(effect)
        if (event.title[0] == "GameEventOnMove"
          && (event.title[1].value[1] != "戦闘エリア1" && event.title[1].value[1] != "戦闘エリア2")
          && (event.title[2].value[1] == "戦闘エリア1" || event.title[2].value[1] == "戦闘エリア2")
          && event.cardIds?.includes(cardId)
          && event.effect && event.effect.reason[0] != "GameRule" && DefineFn.EffectFn.getPlayerID(event.effect) == cardController) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "自軍ジャンクヤードにある、「特徴：ΖΖ系」を持つユニット１枚": {
                title: ["Entity", {
                  at: ["ジャンクヤード"],
                  side: "自軍",
                  hasChar: ["ΖΖ系"],
                  cardCategory: ["ユニット"],
                  count: 1
                }],
                actions: [
                  {
                    title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                    vars: ["自軍ジャンクヤードにある、「特徴：ΖΖ系」を持つユニット１枚"]
                  }
                ]
              },
            },
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
    },
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