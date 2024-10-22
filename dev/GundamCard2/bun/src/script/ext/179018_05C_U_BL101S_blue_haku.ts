// 179018_05C_U_BL101S_blue_haku
// S
// ZZ
// ΖΖガンダム［†］【ネグザレアパラレル】
// ΖΖ系　MS　ガンダムチーム　専用｢ジュドー・アーシタ｣
// 強襲　〔１〕：ゲイン　〔１〕：範囲兵器（３）　〔０〕：改装［ΖΖ系］
// （戦闘フェイズ）：〔青２〕このカードを抜き出し、リロール状態で自軍Gにする。その場合、本来の名称が「コア・ファイター（ΖΖ）」「コア・トップ」「コア・ベース」である自軍G３枚を、ユニットとして、このカードがいるエリアの任意の順番にリロール状態で移す。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（戦闘フェイズ）：〔青２〕このカードを抜き出し、リロール状態で自軍Gにする。その場合、本来の名称が「コア・ファイター（ΖΖ）」「コア・トップ」「コア・ベース」である自軍G３枚を、ユニットとして、このカードがいるエリアの任意の順番にリロール状態で移す。",
      title: ["使用型", ["戦闘フェイズ"]],
      testEnvs: [
        {
          createCards: [
            ["自軍", "配備エリア", [["179018_05C_U_BL101S_blue_haku", 1]]],
            ["自軍", "Gゾーン", [["179029_05C_U_BL103C_blue", 1], ["179029_05C_U_BL104C_blue", 1], ["179029_05C_U_BL105C_blue", 1]]]
          ]
        }
      ],
      conditions: {
        ...createRollCostRequire(2, "青"),
        "本来の名称が「コア・ファイター（ΖΖ）」である自軍G1枚": {
          title: ["Entity", {
            title: ["コア・ファイター（ΖΖ）"],
            at: ["Gゾーン"],
            side: "自軍",
            is: ["グラフィック"],
            count: 1
          }]
        },
        "本来の名称が「コア・トップ」である自軍G1枚": {
          title: ["Entity", {
            title: ["コア・トップ"],
            at: ["Gゾーン"],
            side: "自軍",
            is: ["グラフィック"],
            count: 1
          }]
        },
        "本来の名称が「コア・ベース」である自軍G1枚": {
          title: ["Entity", {
            title: ["コア・ベース"],
            at: ["Gゾーン"],
            side: "自軍",
            is: ["グラフィック"],
            count: 1
          }]
        },
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn }: Bridge): GameState {
                ctx = GameStateFn.addStackEffect(ctx, DefineFn.EffectFn.fromEffectBasic(effect, {
                  logicTreeAction: {
                    actions: [
                      {
                        title: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
                          const cardId = DefineFn.EffectFn.getCardID(effect)
                          const cardController = GameStateFn.getItemController(ctx, cardId)
                          const unitBasyou = GameStateFn.getItemBaSyou(ctx, cardId)
                          // 抜き出し(p53)
                          // 2024/10/22 
                          // 決定為只是實際遊戲時把牌放在一旁的概念，不算移動
                          // 所以就不先移出遊戲了
                          // 直接移到G上，不必先移到場外，不然，它的駕駛就被跟著移除遊戲，但回不來
                          // ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "取り除かれたカード"), GameStateFn.createStrBaSyouPair(ctx, cardId), Options) as GameState
                          ctx = GameStateFn.doItemMove(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "Gゾーン"), GameStateFn.createStrBaSyouPair(ctx, cardId), Options) as GameState
                          ctx = GameStateFn.doItemSetRollState(ctx, false, GameStateFn.createStrBaSyouPair(ctx, cardId), { isSkipTargetMissing: true })
                          const relatedBasyou = DefineFn.RelatedBaSyouFn.of("自軍", unitBasyou.value[1])
                          const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                            conditions: {
                              "このカードがいるエリアの任意の順番": {
                                title: ["Entity", {
                                  side: "自軍",
                                  at: [unitBasyou.value[1]],
                                  isSetGroupRoot: true,
                                  max: 1
                                }],
                                actions: [
                                  {
                                    title: ["エリアの任意の順番に_リロール状態で移す", relatedBasyou, false],
                                    vars: ["このカードがいるエリアの任意の順番", "本来の名称が「コア・ファイター（ΖΖ）」である自軍G1枚"]
                                  },
                                ]
                              },
                              "このカードがいるエリアの任意の順番2": {
                                title: ["Entity", {
                                  side: "自軍",
                                  at: [unitBasyou.value[1]],
                                  isSetGroupRoot: true,
                                  max: 1
                                }],
                                actions: [
                                  {
                                    title: ["エリアの任意の順番に_リロール状態で移す", relatedBasyou, false],
                                    vars: ["このカードがいるエリアの任意の順番", "本来の名称が「コア・トップ」である自軍G1枚"]
                                  },
                                ]
                              },
                              "このカードがいるエリアの任意の順番3": {
                                title: ["Entity", {
                                  side: "自軍",
                                  at: [unitBasyou.value[1]],
                                  isSetGroupRoot: true,
                                  max: 1
                                }],
                                actions: [
                                  {
                                    title: ["エリアの任意の順番に_リロール状態で移す", relatedBasyou, false],
                                    vars: ["このカードがいるエリアの任意の順番", "本来の名称が「コア・ベース」である自軍G1枚"]
                                  },
                                ]
                              }
                            }
                          })
                          ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE, { isSkipLimitCheck: true, isAssertConditionPass: true }) as GameState
                          return ctx
                        }.toString()
                      }
                    ]
                  }
                })) as GameState
                return ctx
              }.toString()
            }
          ]
        }
      ]
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