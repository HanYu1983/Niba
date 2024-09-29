// 179027_09D_O_BK010N_black
// 先を見通す眼
// 破壊　再生
// 『起動』：自軍ターン開始時に、自軍本国の上のカード１枚を見て、そのカードを廃棄できる。
// （常時）〔１〕：このカードを廃棄する。その場合、自軍ジャンクヤードにあるユニット１枚を、持ち主のハンガーに移す。
import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

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

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：自軍ターン開始時に、自軍本国の上のカード１枚を見て、そのカードを廃棄できる。",
      title: ["自動型", "起動"],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const cardController = GameStateFn.getItemController(ctx, cardId)
        const evt = DefineFn.EffectFn.getEvent(effect)
        if (evt.title[0] == "GameEventOnTiming" &&
          DefineFn.PhaseFn.eq(DefineFn.PhaseFn.getFirst(), evt.title[1]) &&
          GameStateFn.getActivePlayerID(ctx) == cardController
        ) {

        } else {
          return ctx
        }
        const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
          conditions: {
            "自軍本国の上のカード１枚を見て": {
              title: ["Entity", {
                see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 1],
                max: 1,
              }]
            }
          },
          logicTreeAction: {
            actions: [
              {
                title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                  const cardId = DefineFn.EffectFn.getCardID(effect)
                  const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本国の上のカード１枚を見て", cardId)
                  if (pairs.length) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                      logicTreeAction: {
                        actions: [
                          {
                            title: ["_ロールする", "廃棄"],
                            vars: ["自軍本国の上のカード１枚を見て"]
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
          }
        })
        ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE)
        return ctx
      }.toString(),
    },
    {
      id: "",
      description: "（常時）〔１〕：このカードを廃棄する。その場合、自軍ジャンクヤードにあるユニット１枚を、持ち主のハンガーに移す。",
      title: ["使用型", ["常時"]],
      conditions: {
        ...createRollCostRequire(1, null),
        "このカードを廃棄する": {
          actions: [
            {
              title: ["_ロールする", "廃棄"],
            }
          ]
        },
        "自軍ジャンクヤードにあるユニット１枚": {
          title: ["Entity", {
            side: "自軍",
            at: ["ジャンクヤード"],
            is: ["ユニット"],
            count: 1,
          }],
          actions: [
            {
              title: ["_の_ハンガーに移す", "持ち主", "ハンガー"]
            }
          ]
        }
      },
    }
  ]
};
