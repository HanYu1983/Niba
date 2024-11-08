// 179029_05C_U_BL104C_blue
// C
// ZZ
// コア・ファイター（ΖΖ）
// ΖΖ系　ガンダムチーム　専用｢ジュドー・アーシタ｣
// 〔１〕：共有［ΖΖ系］
// （戦闘フェイズ）〔R〕：このカードと、このカードの部隊にいる「特徴：ΖΖ系」を持つ、このカード以外の自軍ユニット２枚を自軍Gにする。その場合、自軍G１枚を、持ち主の本国の下に移し、本来の記述に「特徴：ΖΖ系」を持つ自軍G１枚を、ユニットとして、このカードの部隊の任意の順番にリロール状態で移す。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）〔R〕：このカードと、このカードの部隊にいる「特徴：ΖΖ系」を持つ、このカード以外の自軍ユニット２枚を自軍Gにする。その場合、自軍G１枚を、持ち主の本国の下に移し、本来の記述に「特徴：ΖΖ系」を持つ自軍G１枚を、ユニットとして、このカードの部隊の任意の順番にリロール状態で移す。",
      title: ["使用型", ["戦闘フェイズ"]],
      testEnvs: [
        {
          createCards: [
            ["自軍", "戦闘エリア1", [["179029_05C_U_BL104C_blue", 3]]],
            ["自軍", "Gゾーン", [["unit", 1], ["179029_05C_U_BL104C_blue", 1]]]
          ],
          checkFn: function _(ctx: GameState, { DefineFn, GameStateFn }: Bridge) {
            if (GameStateFn.getPlayerGIds(ctx, "PlayerA").length != 3) {
              throw new Error()
            }
            if (GameStateFn.getPlayerCountrytIds(ctx, "PlayerA").length != 1) {
              throw new Error()
            }
            if (GameStateFn.getItemIdsByBasyou(ctx, DefineFn.AbsoluteBaSyouFn.of("PlayerA", "戦闘エリア1")).length != 1) {
              throw new Error()
            }
          }
        }
      ],
      conditions: {
        "〔R〕": {
          actions: [
            {
              title: ["_ロールする", "ロール"]
            }
          ]
        },
        "このカードの部隊にいる「特徴：ΖΖ系」を持つ、このカード以外の自軍ユニット２枚": {
          title: ["Entity", {
            exceptCardIds: [],
            isThisBattleGroup: true,
            hasChar: ["ΖΖ系"],
            side: "自軍",
            is: ["ユニット"],
            count: 2
          }],
        },
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: function _(ctx: GameState, effect: Effect, bridge: Bridge): GameState {
                    const { DefineFn, GameStateFn } = bridge
                    const cardId = DefineFn.EffectFn.getCardID(effect)
                    const unitBasyou = GameStateFn.getItemBaSyou(ctx, cardId)
                    const relatedBasyou = DefineFn.RelatedBaSyouFn.of("自軍", unitBasyou.value[1])
                    ctx = GameStateFn.createActionTitleFn({
                      title: ["_の_ハンガーに移す", "自軍", "Gゾーン"],
                    })(ctx, effect, bridge)
                    ctx = GameStateFn.createActionTitleFn({
                      title: ["_の_ハンガーに移す", "自軍", "Gゾーン"],
                      vars: ["このカードの部隊にいる「特徴：ΖΖ系」を持つ、このカード以外の自軍ユニット２枚"]
                    })(ctx, effect, bridge)
                    const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                      conditions: {
                        "自軍G１枚": {
                          title: ["Entity", {
                            at: ["Gゾーン"],
                            side: "自軍",
                            count: 1
                          }],
                          actions: [
                            {
                              title: ["_の_ハンガーに移す", "持ち主", "本国"],
                              vars: ["自軍G１枚"]
                            }
                          ]
                        },
                        "このカードの部隊の任意の順番": {
                          title: ["Entity", {
                            side: "自軍",
                            at: [unitBasyou.value[1]],
                            isSetGroupRoot: true,
                            max: 1
                          }],
                        },
                        "本来の記述に「特徴：ΖΖ系」を持つ自軍G１枚": {
                          title: ["Entity", {
                            at: ["Gゾーン"],
                            hasChar: ["ΖΖ系"],
                            cardCategory: ["ユニット"],
                            side: "自軍",
                            count: 1
                          }],
                          actions: [
                            {
                              title: ["エリアの任意の順番に_リロール状態で移す", relatedBasyou, false],
                              vars: ["このカードの部隊の任意の順番", "本来の記述に「特徴：ΖΖ系」を持つ自軍G１枚"]
                            },
                          ]
                        }
                      }
                    })
                    ctx = GameStateFn.addImmediateEffect(ctx, newE) as GameState
                    return ctx
                  }.toString()
                }
              ]]
            }
          ]
        }
      ],
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