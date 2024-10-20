// 179030_11E_CH_GN094R_green
// R
// 閃光のハサウェイ
// マフティー・ナビーユ・エリン
// 男性　大人　NT
// <『常駐』：自軍の手札の上限枚数に＋１する>
// 『起動』：自軍ターン終了時に、自軍手札が５枚以上ある場合、敵軍本国に３ダメージを与える。

import { BaSyouKeyword } from "../../game/define/BaSyou";
import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { GlobalEffect } from "../../game/define/GlobalEffect";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "<『常駐』：自軍の手札の上限枚数に＋１する>",
      protectLevel: 2,
      title: ["自動型", "常駐"],
      testEnvs: [{
        thisCard: ["自軍", "Gゾーン", { id: "", protoID: "179030_11E_CH_GN094R_green" }, null],
      }],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, ToolFn }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        return [{ title: ["自軍の手札の上限枚数に＋_１", 1], cardIds: [cardId] }]
      }.toString()
    },
    {
      id: "",
      description: "『起動』：自軍ターン終了時に、自軍手札が５枚以上ある場合、敵軍本国に３ダメージを与える。",
      title: ["自動型", "起動"],
      testEnvs: [{
        thisCard: ["自軍", "配備エリア", { id: "", protoID: "179030_11E_CH_GN094R_green" }, null],
        event: { title: ["GameEventOnTiming", ["戦闘フェイズ", "ターン終了時", "効果解決"]] },
        createCards: [
          ["自軍", "手札", [["unit", 5]]],
        ]
      }],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        if (event.title[0] == "GameEventOnTiming"
          && DefineFn.PhaseFn.eq(event.title[1], DefineFn.PhaseFn.getLastTrigerEffect())
          && GameStateFn.getActivePlayerID(ctx) == cardController) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "自軍手札が５枚以上ある場合": {
                actions: [
                  {
                    title: ["Entity", {
                      side: "自軍",
                      at: ["手札"],
                      min: 5,
                    }]
                  }
                ]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: ["_敵軍本国に_１ダメージ", "敵軍", 3]
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE, { isSkipLimitCheck: true })
        }
        return ctx
      }.toString(),
    },
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