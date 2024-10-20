// 179015_04B_CH_BL043C_blue
// C
// CCA
// クェス・パラヤ
// 女性　子供　NT
// 〔１〕：ゲイン
// 『起動』：このカードは、「特徴：NT」を持つ敵軍キャラと交戦中となった場合、ターン終了時に持ち主の本国の下に移る。

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
      // testEnvs: [
      //   {
      //     createCards: [
      //       ["自軍", "戦闘エリア1", [["179015_04B_CH_BL043C_blue", 1]]],
      //       ["敵軍", "戦闘エリア1", [["charBlueNT", 1]]]
      //     ]
      //   },
      // ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardOwner = GameStateFn.getItemOwner(ctx, cardId)
        // TODO: trigger event
        if (event.title[0] == "交戦中となった場合"
          && event.cardIds?.includes(cardId)
          && GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.setOpponentPlayerID(GameStateFn.getItemBaSyou(ctx, cardId)))
            .filter(itemId => GameStateFn.getItemCharacteristic(ctx, itemId).indexOf("NT") != -1)) {
          ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setFlag(is, "enabled", true, { isRemoveOnTurnEnd: true })) as GameState
        }
        if (event.title[0] == "GameEventOnTiming"
          && DefineFn.PhaseFn.eq(event.title[1], DefineFn.PhaseFn.getLastTriigerEffect())) {
          if (GameStateFn.getItemState(ctx, cardId).flags.enabled) {
            ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardOwner, "本国"), GameStateFn.createStrBaSyouPair(ctx, cardId), Options)
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