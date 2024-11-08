
// 179029_05C_U_BL105C_blue
// C
// ZZ
// コア・ベース
// ΖΖ系　ガンダムチーム
// クイック
// 『起動』：このカードがプレイされて場に出た場合、自軍本国の上のカード１～５枚を見て、その中にある「特徴：ガンダムチーム」を持つユニット１枚を、自軍ハンガーに移す事ができる。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードがプレイされて場に出た場合、自軍本国の上のカード１～５枚を見て、その中にある「特徴：ガンダムチーム」を持つユニット１枚を、自軍ハンガーに移す事ができる。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "配備エリア", { id: "", protoID: "179029_05C_U_BL105C_blue" }, null],
          eventTitle: ["プレイされて場に出た場合"],
          createCards: [["自軍", "本国", [["179029_05C_U_BL105C_blue", 1]]]],
          checkFn: function _(ctx: GameState, { DefineFn, GameStateFn }: Bridge) {
            if (GameStateFn.getPlayerHungerIds(ctx, "PlayerA").length != 1) {
              throw new Error()
            }
          }
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const evt = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (evt.title[0] == "プレイされて場に出た場合" && evt.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            isOption: true,
            conditions: {
              "自軍本国の上のカード１～５枚を見て、その中にある「特徴：ガンダムチーム」を持つユニット１枚": {
                title: ["Entity", {
                  see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 5],
                  hasChar: ["ガンダムチーム"],
                  cardCategory: ["ユニット"],
                  count: 1
                }]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                  vars: ["自軍本国の上のカード１～５枚を見て、その中にある「特徴：ガンダムチーム」を持つユニット１枚"]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString()
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