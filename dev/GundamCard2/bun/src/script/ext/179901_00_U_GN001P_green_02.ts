// 179901_00_U_GN001P_green_02
// P
// GUNDAM
// シャア専用ゲルググ ［†］
// ゲルググ系　MS　専用「シャア・アズナブル」
// 戦闘配備　速攻
// 『起動』：このカードがプレイされて場に出た場合、キャラがセットされていない敵軍ユニット１枚を持ち主の手札に移す。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードがプレイされて場に出た場合、キャラがセットされていない敵軍ユニット１枚を持ち主の手札に移す。",
      title: ["自動型", "起動"],
      testEnvs: [{
        thisCard: ["自軍", "配備エリア", { id: "", protoID: "179901_00_U_GN001P_green_02" }, null],
        eventTitle: ["プレイされて場に出た場合"],
        createCards: [
          ["敵軍", "戦闘エリア1", [["unit", 1]]],
        ]
      }],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "プレイされて場に出た場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "キャラがセットされていない敵軍ユニット１枚": {
                title: ["Entity", {
                  atBa: true,
                  side: "敵軍",
                  hasSetCard: false,
                  is: ["ユニット"],
                  count: 1
                }],
                actions: [
                  {
                    title: ["_の_ハンガーに移す", "持ち主", "手札"],
                    vars: ["キャラがセットされていない敵軍ユニット１枚"]
                  }
                ]
              }
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        return ctx
      }.toString(),
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