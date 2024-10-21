// 179003_01A_U_GN008R_green_02
// R
// 08MS小隊
// アプサラスⅡ【箔押しVer.】
// アプサラス系　MA　専用「アイナ・サハリン」
// 〔２〕：範囲兵器（４）　〔１〕：ゲイン　〔０〕：改装［アプサラス系］
// （自軍戦闘フェイズ）〔緑X〕：自軍本国の上のカードX枚を見て、その中にあるユニット１枚を、このカードの部隊の先頭に出す事ができる。ターン終了時に、そのユニットを持ち主の手札に移す。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { TargetMissingError } from "../../game/define/GameError";
import { StrBaSyouPair } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（自軍戦闘フェイズ）〔緑X〕：自軍本国の上のカードX枚を見て、その中にあるユニット１枚を、このカードの部隊の先頭に出す事ができる。ターン終了時に、そのユニットを持ち主の手札に移す。",
      title: ["使用型", ["自軍", "戦闘フェイズ"]],
      conditions: {
        "〔緑X〕": {
          title: ["RollColor", "緑"]
        },
        "このカードの部隊": {
          actions: [
            {
              title: ["このカードが_戦闘エリアにいる場合", ["戦闘エリア1", "戦闘エリア2"]]
            }
          ]
        },
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                const cardId = DefineFn.EffectFn.getCardID(effect)
                const x = GameStateFn.getCardTipStrBaSyouPairs(ctx, "〔緑X〕", cardId).length
                const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                  isOption: true,
                  conditions: {
                    "自軍本国の上のカードX枚を見て、その中にあるユニット１枚": {
                      title: ["Entity", {
                        see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, x],
                        is: ["ユニット"],
                        count: 1,
                      }]
                    }
                  },
                  logicTreeAction: {
                    actions: [
                      {
                        title: ["cutIn", [
                          {
                            title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                              const cardId = DefineFn.EffectFn.getCardID(effect)
                              if (GameStateFn.getItemBaSyou(ctx, cardId).value[1] == "戦闘エリア1" || GameStateFn.getItemBaSyou(ctx, cardId).value[1] == "戦闘エリア2") {

                              } else {
                                throw new TargetMissingError(`必須在戰區`)
                              }
                              const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本国の上のカードX枚を見て、その中にあるユニット１枚", cardId)
                              for (const pair of pairs) {
                                ctx = GameStateFn.doItemMove(ctx, GameStateFn.getItemBaSyou(ctx, cardId), pair, { insertId: 0, ges: Options.ges }) as GameState
                              }
                              return ctx
                            }.toString()
                          }
                        ]]
                      },
                    ]
                  }
                })
                ctx = GameStateFn.addImmediateEffect(ctx, newE) as GameState
                return ctx
              }.toString()
            }
          ]
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "GameEventOnTiming" && DefineFn.PhaseFn.eq(event.title[1], DefineFn.PhaseFn.getLast())) {
          const cardOwner = GameStateFn.getItemOwner(ctx, cardId)
          const tip = GameStateFn.getItemState(ctx, cardId).tips["自軍本国の上のカードX枚を見て、その中にあるユニット１枚"]
          if (tip == null) {
            console.warn(`沒有選擇對象，忽略效果: ${effect.description}`)
            return ctx
          }
          const pairs = DefineFn.TipFn.getSelection(tip) as StrBaSyouPair[]
          if (pairs.length == 0) {
            return ctx
          }
          for (const pair of pairs) {
            ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardOwner, "手札"), GameStateFn.createStrBaSyouPair(ctx, pair[0]), { ges: Options.ges }) as GameState
          }
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