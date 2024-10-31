// 179030_11E_U_GN184N_green
// N
// CCA
// ヤクト・ドーガ（クェス機）
// ヤクト・ドーガ系　MS　専用「クェス・パラヤ」
// 戦闘配備　〔１〕：サイコミュ（２）
// 『起動』：緑のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合、ターン終了時に、このカードを持ち主のGにできる。

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『起動』：緑のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合、ターン終了時に、このカードを持ち主のGにできる。",
      title: ["自動型", "起動"],
      testEnvs: [
        {
          thisCard: ["自軍", "配備エリア", { id: "", protoID: "179030_11E_U_GN184N_green" }, null],
          eventTitle: ["このカードが場に出た場合"],
          createCards: [["自軍", "Gゾーン", [["179030_11E_U_GN184N_green", 4]]]]
        },
        {
          thisCard: ["自軍", "配備エリア", { id: "", protoID: "179030_11E_U_GN184N_green" }, { flags: { "enabled": true } }],
          event: { title: ["GameEventOnTiming", ["戦闘フェイズ", "ターン終了時", "効果解決"]] },
        }
      ],
      onEvent: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GameState {
        const event = DefineFn.EffectFn.getEvent(effect)
        const cardId = DefineFn.EffectFn.getCardID(effect)
        if (event.title[0] == "このカードが場に出た場合" && event.cardIds?.includes(cardId)) {
          // const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
          //   at: ["Gゾーン"],
          //   side: "自軍",
          //   min: 4
          // }, { ges: Options.ges })
          // if (DefineFn.TipFn.createTipErrorWhenCheckFail(tip) == null) {
          //   ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.setFlag(is, "enabled", true, { isRemoveOnTurnEnd: true })) as GameState
          // }
          const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
            description: "緑のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合",
            conditions: {
              "緑のGサインを持つ自軍Gが４枚以上ある状態": {
                actions: [
                  {
                    title: ["Entity", {
                      at: ["Gゾーン"],
                      side: "自軍",
                      min: 4
                    }]
                  }
                ]
              }
            },
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
        if (event.title[0] == "GameEventOnTiming" && DefineFn.PhaseFn.eq(event.title[1], DefineFn.PhaseFn.getLastTriggerEffect())) {
          if (GameStateFn.getItemState(ctx, cardId).flags["enabled"]) {
            const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
              isOption: true,
              description: "ターン終了時に、このカードを持ち主のGにできる",
              logicTreeAction: {
                actions: [
                  {
                    title: ["_の_ハンガーに移す", "持ち主", "Gゾーン"]
                  }
                ]
              }
            })
            ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE, { isSkipLimitCheck: true })
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