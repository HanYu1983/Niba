// 179015_04B_CH_BL043C_blue
// C
// CCA
// クェス・パラヤ
// 女性　子供　NT
// 〔１〕：ゲイン
// 『起動』：このカードは、「特徴：NT」を持つ敵軍キャラと交戦中となった場合、ターン終了時に持ち主の本国の下に移る。

import { title } from "process";
import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { type Effect } from "../../game/define/Effect";
import type { GameState } from "../../game/gameState/GameState";
import type { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：このカードは、「特徴：NT」を持つ敵軍キャラと交戦中となった場合、ターン終了時に持ち主の本国の下に移る。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "戦闘エリア1", { id: "", protoID: "179015_04B_CH_BL043C_blue" }, null],
          eventTitle: ["交戦中となった場合"],
          createCards: [
            ["敵軍", "戦闘エリア1", [["charBlueNT", 1]]]
          ]
        },
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardOwner = GameStateFn.getItemOwner(ctx, cardId)
        if (event.title[0] == "交戦中となった場合"
          && event.cardIds?.includes(cardId)
          && GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.setOpponentPlayerID(GameStateFn.getItemBaSyou(ctx, cardId)))
            .some(itemId => GameStateFn.getItemCharacteristic(ctx, itemId).indexOf("NT") != -1)) {
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            logicTreeAction: {
              actions: [
                {
                  title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setFlag(is, "enabled", true, { isRemoveOnTurnEnd: true })) as GameState
                    return ctx
                  }.toString()
                }
              ]
            }
          })
          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        }
        if (event.title[0] == "GameEventOnTiming"
          && DefineFn.PhaseFn.eq(event.title[1], DefineFn.PhaseFn.getLastTriggerEffect())) {
          if (GameStateFn.getItemState(ctx, cardId).flags.enabled) {
            ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardOwner, "本国"), GameStateFn.createStrBaSyouPair(ctx, cardId), Options) as GameState
          }
        }
        return ctx
      }.toString(),

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