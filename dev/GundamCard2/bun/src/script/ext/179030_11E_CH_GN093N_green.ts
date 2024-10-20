// 179030_11E_CH_GN093N_green
// N
// CCA
// クェス・パラヤ
// 女性　子供　NT
// 『起動』：このカードのセットグループのユニットが破壊された場合、自軍本国の上のカード１～２枚を見て、その中にある「サイコミュ」を持つユニット１枚を、自軍配備エリアにリロール状態で出し、このカードをセットする。その後、このカードの破壊を無効にする。

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
      description: "『起動』：このカードのセットグループのユニットが破壊された場合、自軍本国の上のカード１～２枚を見て、その中にある「サイコミュ」を持つユニット１枚を、自軍配備エリアにリロール状態で出し、このカードをセットする。その後、このカードの破壊を無効にする。",
      title: ["自動型", "起動"],
      testEnvs: [{
        thisCard: ["自軍", "配備エリア", { id: "", protoID: "179030_11E_CH_GN093N_green" }, { destroyReason: { id: "破壊する", playerID: "PlayerA" } }],
        eventTitle: ["このカードのセットグループのユニットが破壊された場合"],
        createCards: [
          ["自軍", "本国", [["unitHasPhy", 2]]]
        ]
      }],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードのセットグループのユニットが破壊された場合" && event.cardIds?.includes(cardId)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            conditions: {
              "自軍本国の上のカード１～２枚を見て、その中にある「サイコミュ」を持つユニット１枚": {
                title: ["Entity", {
                  see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 2],
                  hasSpecialEffect: [["サイコミュ", 0]],
                  cardCategory: ["ユニット"],
                  max: 1,
                }],
                actions: [
                  {
                    title: ["看見see"],
                    vars: ["自軍本国の上のカード１～２枚を見て、その中にある「サイコミュ」を持つユニット１枚"]
                  }
                ]
              }
            },
            logicTreeAction: {
              actions: [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const cardController = GameStateFn.getItemController(ctx, cardId)
                    const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本国の上のカード１～２枚を見て、その中にある「サイコミュ」を持つユニット１枚", cardId)
                    if (pairs.length == 0) {
                      return ctx
                    }
                    const targetPair = pairs[0]
                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), targetPair, { ges: Options.ges })
                    ctx = GameStateFn.doItemSetDestroy(ctx, null, GameStateFn.createStrBaSyouPair(ctx, cardId), { ges: Options.ges })
                    ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), GameStateFn.createStrBaSyouPair(ctx, cardId), { isSkipTargetMissing: true, ges: Options.ges })
                    ctx = GameStateFn.setSetGroupParent(ctx, targetPair[0], cardId) as GameState
                    return ctx
                  }.toString()
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
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